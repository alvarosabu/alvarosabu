import { createHash } from 'node:crypto'
import { readFile, rm, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import { encode as encodeBlurhash } from 'blurhash'
import ExifReader from 'exifreader'
import fg from 'fast-glob'
import sharp from 'sharp'

const ROOT = resolve(import.meta.dirname, '..')
const RAW_DIR = join(ROOT, 'photos-raw')
const OUT_DIR = join(ROOT, 'public', 'photos')
const MANIFEST_PATH = join(ROOT, 'app', 'data', 'photos.json')

const DISPLAY_MAX = 1600
const DISPLAY_QUALITY = 82
const FULL_MAX = 2560
const FULL_QUALITY = 90

export interface PhotoSidecar {
  slug: string
  name: string
  src: string
  full: string
  blurhash: string
  width: number
  height: number
  date: string
  alt?: string
  camera?: string
  lens?: string
  focalLength?: string
  aperture?: string
  shutterSpeed?: string
  iso?: string | number
}

async function readDateFromExif(filePath: string): Promise<Date> {
  try {
    const tags = await ExifReader.load(filePath, { expanded: true })
    const raw
      = tags.exif?.DateTimeOriginal?.description
      ?? tags.exif?.CreateDate?.description
      ?? tags.exif?.DateTime?.description

    if (typeof raw === 'string') {
      // EXIF format: "YYYY:MM:DD HH:MM:SS"
      const [datePart, timePart = '00:00:00'] = raw.split(' ')
      const iso = `${datePart.replaceAll(':', '-')}T${timePart}`
      const d = new Date(iso)
      if (!Number.isNaN(d.getTime())) return d
    }
  }
  catch {
    // fall through to birthtime
  }
  const s = await stat(filePath)
  return s.birthtime ?? s.mtime
}

function pad(n: number, width: number) {
  return String(n).padStart(width, '0')
}

function dateToSlugPrefix(d: Date): string {
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1, 2),
    pad(d.getDate(), 2),
    pad(d.getHours(), 2),
    pad(d.getMinutes(), 2),
    pad(d.getSeconds(), 2),
  ].join('-')
}

function shortHash(buf: Buffer): string {
  return createHash('sha1').update(buf).digest('hex').slice(0, 8)
}

async function readExifMeta(filePath: string) {
  try {
    const tags = await ExifReader.load(filePath, { expanded: true })
    return {
      camera: tags.exif?.Model?.description as string | undefined,
      lens: tags.exif?.LensModel?.description as string | undefined,
      focalLength: tags.exif?.FocalLength?.description as string | undefined,
      aperture: tags.exif?.FNumber?.description as string | undefined,
      shutterSpeed: tags.exif?.ExposureTime?.description as string | undefined,
      iso: tags.exif?.ISOSpeedRatings?.description as string | undefined,
    }
  }
  catch {
    return {}
  }
}

interface SlugInfo {
  original: Buffer
  date: Date
  slug: string
}

async function computeSlug(filePath: string): Promise<SlugInfo> {
  const original = await readFile(filePath)
  const date = await readDateFromExif(filePath)
  const hash = shortHash(original)
  return { original, date, slug: `p-${dateToSlugPrefix(date)}-${hash}` }
}

async function processOne(filePath: string, slugInfo: SlugInfo): Promise<PhotoSidecar | null> {
  const { original, date, slug } = slugInfo

  const displayOut = join(OUT_DIR, `${slug}.jpg`)
  const fullOut = join(OUT_DIR, `${slug}.full.jpg`)
  const jsonOut = join(OUT_DIR, `${slug}.json`)

  // Lightbox master: 2560 / q90
  const fullBuf = await sharp(original)
    .rotate()
    .resize({ width: FULL_MAX, height: FULL_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: FULL_QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer()
  await writeFile(fullOut, fullBuf)

  // Display master: 1600 / q82 — used as the @nuxt/image source
  const { data: displayBuf, info: displayInfo } = await sharp(original)
    .rotate()
    .resize({ width: DISPLAY_MAX, height: DISPLAY_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: DISPLAY_QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer({ resolveWithObject: true })
  await writeFile(displayOut, displayBuf)

  // Blurhash from a 32x32 raw RGBA
  const { data, info } = await sharp(original)
    .rotate()
    .resize(32, 32, { fit: 'inside' })
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true })
  const blurhash = encodeBlurhash(new Uint8ClampedArray(data), info.width, info.height, 4, 4)

  const exifMeta = await readExifMeta(filePath)

  const sidecar: PhotoSidecar = {
    slug,
    name: basename(filePath, extname(filePath)),
    src: `/photos/${slug}.jpg`,
    full: `/photos/${slug}.full.jpg`,
    blurhash,
    width: displayInfo.width,
    height: displayInfo.height,
    date: date.toISOString(),
    ...exifMeta,
  }
  await writeFile(jsonOut, `${JSON.stringify(sidecar, null, 2)}\n`)

  return sidecar
}

async function cleanupOrphans(currentSlugs: Set<string>) {
  const files = await fg('*.{jpg,json}', { cwd: OUT_DIR, absolute: false })
  let removed = 0
  for (const file of files) {
    // strip ".full.jpg" / ".jpg" / ".json" to derive the slug
    const slug = file.replace(/\.full\.jpg$/, '').replace(/\.jpg$/, '').replace(/\.json$/, '')
    if (!currentSlugs.has(slug)) {
      await rm(join(OUT_DIR, file))
      removed++
    }
  }
  return removed
}

async function loadExistingManifest(): Promise<Map<string, PhotoSidecar>> {
  try {
    const raw = await readFile(MANIFEST_PATH, 'utf8')
    const entries = JSON.parse(raw) as PhotoSidecar[]
    return new Map(entries.map(e => [e.slug, e]))
  }
  catch {
    return new Map()
  }
}

async function main() {
  const force = process.argv.includes('--force')
  const raws = await fg(['*.{jpg,jpeg,png}', '*.{JPG,JPEG,PNG}'], { cwd: RAW_DIR, absolute: true })
  if (raws.length === 0) {
    console.warn('photos-raw/ is empty — nothing to do.')
    return
  }

  const existing = await loadExistingManifest()
  console.log(`Processing ${raws.length} photo(s)${force ? ' (force)' : ''}…`)
  const currentSlugs = new Set<string>()
  const manifest: PhotoSidecar[] = []
  for (const raw of raws) {
    const info = await computeSlug(raw)
    const cached = existing.get(info.slug)
    if (!force && cached) {
      currentSlugs.add(cached.slug)
      manifest.push(cached)
      console.log(`  ↩ ${cached.slug} (skipped)`)
      continue
    }
    const result = await processOne(raw, info)
    if (result) {
      currentSlugs.add(result.slug)
      manifest.push(result)
      console.log(`  ✓ ${result.slug}`)
    }
  }

  manifest.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Wrote manifest with ${manifest.length} entries → app/data/photos.json`)

  const removed = await cleanupOrphans(currentSlugs)
  if (removed) console.log(`Cleaned up ${removed} orphaned file(s).`)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

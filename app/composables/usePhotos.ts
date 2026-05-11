import manifest from '~/data/photos.json'

export interface Photo {
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

export function usePhotos(): Photo[] {
  return manifest as Photo[]
}

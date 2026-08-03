<script setup lang="ts">
// Companion to the "scrolling the noise" paragraph: a tileable scalar field that
// scrolls along the wind direction, showing how `direction × localTime` slides the
// whole field across the ground. Palette matches the article's dark Catppuccin figures.
const TILE = 256
const SPEED = 34 // px/s
const LO = [40, 46, 62]
const HI = [129, 200, 190]
// integer frequencies → the tile is seamlessly periodic, so scrolling never seams.
// mixed directions keep it from reading as parallel stripes
const WAVES = [
  { fx: 1, fy: 0, ph: 0.0, amp: 1.0 },
  { fx: 0, fy: 1, ph: 1.3, amp: 0.9 },
  { fx: 2, fy: 1, ph: 2.1, amp: 0.6 },
  { fx: -1, fy: 2, ph: 0.7, amp: 0.55 },
  { fx: 3, fy: -2, ph: 3.4, amp: 0.4 },
  { fx: 2, fy: 4, ph: 1.9, amp: 0.32 },
  { fx: -4, fy: 3, ph: 4.6, amp: 0.26 },
  { fx: 5, fy: 5, ph: 2.7, amp: 0.18 },
]
const DIR = (() => {
  const a = (-18 * Math.PI) / 180 // up-right, echoes the wind-field diagram
  return { x: Math.cos(a), y: Math.sin(a) }
})()

const canvasRef = useTemplateRef<HTMLCanvasElement>('cv')
let raf = 0

function buildTile(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = TILE
  const cx = c.getContext('2d')!
  const img = cx.createImageData(TILE, TILE)
  const maxA = WAVES.reduce((s, w) => s + w.amp, 0)
  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      let v = 0
      for (const w of WAVES) v += w.amp * Math.sin((2 * Math.PI * (w.fx * x + w.fy * y)) / TILE + w.ph)
      const n = (v / maxA) * 0.5 + 0.5
      const i = (y * TILE + x) * 4
      img.data[i] = LO[0]! + (HI[0]! - LO[0]!) * n
      img.data[i + 1] = LO[1]! + (HI[1]! - LO[1]!) * n
      img.data[i + 2] = LO[2]! + (HI[2]! - LO[2]!) * n
      img.data[i + 3] = 255
    }
  }
  cx.putImageData(img, 0, 0)
  return c
}

function drawArrow(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const ax = w * 0.5 - 90
  const ay = h * 0.5
  const len = 175
  const ex = ax + DIR.x * len
  const ey = ay + DIR.y * len
  const a = Math.atan2(DIR.y, DIR.x)
  const s = 16
  const stroke = (width: number, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(ex, ey)
    ctx.moveTo(ex - Math.cos(a - 0.5) * s, ey - Math.sin(a - 0.5) * s)
    ctx.lineTo(ex, ey)
    ctx.lineTo(ex - Math.cos(a + 0.5) * s, ey - Math.sin(a + 0.5) * s)
    ctx.stroke()
  }
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  stroke(10, 'rgba(24,24,31,0.5)') // halo for contrast over the field
  stroke(5, '#c6d0f5')
  ctx.fillStyle = '#c6d0f5'
  ctx.font = '600 20px ui-monospace, monospace'
  ctx.fillText('wind', ax - 6, ay - 16)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height
  const pattern = ctx.createPattern(buildTile(), 'repeat')!

  const draw = (dist: number) => {
    const ox = (DIR.x * dist) % TILE
    const oy = (DIR.y * dist) % TILE
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.save()
    ctx.translate(ox, oy)
    ctx.fillStyle = pattern
    ctx.fillRect(-ox, -oy, w, h)
    ctx.restore()
    ctx.fillStyle = '#a5adce'
    ctx.font = '17px ui-monospace, monospace'
    ctx.fillText('The wind field, scrolling downwind', 24, 34)
    drawArrow(ctx, w, h)
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    draw(70) // a representative still frame, no animation
    return
  }

  let start = 0
  const loop = (t: number) => {
    if (!start) start = t
    draw(((t - start) / 1000) * SPEED)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
})

onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <figure class="w-full">
    <div class="rounded-lg overflow-hidden border border-muted dark:border-transparent" :style="{ background: '#303446' }">
      <canvas ref="cv" width="900" height="280" class="w-full h-auto block" />
    </div>
    <figcaption class="mt-2 text-center text-sm text-muted">
      Adding <code>direction × localTime</code> to the sample position slides the whole field downwind, a gust travelling across the meadow
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
// Interactive companion to the article's static Catppuccin diagrams: drag the
// compass vector to steer the wind and watch the shared-noise-field panel (right)
// re-orient coherently while the per-blade-random panel (left) stays scattered.
// Palette is intentionally hard-coded to match the sibling static SVGs
// (blade-template.svg, grid-distribution.svg) rather than the app theme.
const COLORS = {
  bg: '#303446',
  border: '#414559',
  text: '#a5adce',
  red: '#e78284',
  teal: '#81c8be',
  lav: '#c6d0f5',
}

const VIEW = { w: 800, h: 540 }
const COLS = 5
const ROWS = 6
const PANEL = { w: 240, h: 320, y0: 130 }
const LEFT_X = 95
const RIGHT_X = 460
const RIGHT_CX = RIGHT_X + PANEL.w / 2
const RIGHT_CY = PANEL.y0 + PANEL.h / 2
const DIAL = { cx: 50, cy: 50, r: 38 } // its own 100×100 SVG in the control bar below

const windDeg = ref(-32) // screen-space heading; ≈ up-right, matches the static figure

interface Arrow {
  x1: number
  y1: number
  x2: number
  y2: number
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function cellCenter(x0: number, c: number, r: number): [number, number] {
  return [x0 + c * (PANEL.w / (COLS - 1)), PANEL.y0 + r * (PANEL.h / (ROWS - 1))]
}

function ray(cx: number, cy: number, deg: number, len: number): Arrow {
  const rad = (deg * Math.PI) / 180
  return { x1: cx, y1: cy, x2: cx + Math.cos(rad) * len, y2: cy + Math.sin(rad) * len }
}

const jitter = (() => {
  const rnd = mulberry32(12345)
  return Array.from({ length: COLS * ROWS }, () => ({ off: (rnd() * 2 - 1) * 115, len: 9 + rnd() * 20 }))
})()

const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ c: i % COLS, r: Math.floor(i / COLS) }))

const leftArrows = computed<Arrow[]>(() =>
  cells.map(({ c, r }, i) => {
    const [cx, cy] = cellCenter(LEFT_X, c, r)
    const j = jitter[i]!
    return ray(cx, cy, windDeg.value + j.off, j.len)
  }),
)

const rightArrows = computed<Arrow[]>(() =>
  cells.map(({ c, r }) => {
    const [cx, cy] = cellCenter(RIGHT_X, c, r)
    const rad = (windDeg.value * Math.PI) / 180
    const t = (cx - RIGHT_CX) * Math.cos(rad) + (cy - RIGHT_CY) * Math.sin(rad)
    const gust = 0.5 + 0.5 * Math.cos(t * 0.02)
    const deg = windDeg.value + 16 * Math.sin(c * 0.85 + r * 0.55)
    return ray(cx, cy, deg, 11 + 22 * gust)
  }),
)

const dots = [LEFT_X, RIGHT_X].flatMap(x0 => cells.map(({ c, r }) => cellCenter(x0, c, r)))

const needle = computed(() => ray(DIAL.cx, DIAL.cy, windDeg.value, DIAL.r - 4))
const displayDeg = computed(() => ((Math.round(windDeg.value) % 360) + 360) % 360)

const dialRef = useTemplateRef<SVGSVGElement>('dialEl')
const dragging = ref(false)

function setFromPointer(e: PointerEvent) {
  const svg = dialRef.value
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const px = (e.clientX - rect.left) * (100 / rect.width)
  const py = (e.clientY - rect.top) * (100 / rect.height)
  windDeg.value = (Math.atan2(py - DIAL.cy, px - DIAL.cx) * 180) / Math.PI
}

function onDown(e: PointerEvent) {
  dragging.value = true;
  (e.currentTarget as Element).setPointerCapture?.(e.pointerId)
  setFromPointer(e)
}
function onMove(e: PointerEvent) {
  if (dragging.value) setFromPointer(e)
}
function onUp(e: PointerEvent) {
  dragging.value = false;
  (e.currentTarget as Element).releasePointerCapture?.(e.pointerId)
}
function onKey(e: KeyboardEvent) {
  const step = e.shiftKey ? 15 : 3
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    windDeg.value -= step
    e.preventDefault()
  }
  else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    windDeg.value += step
    e.preventDefault()
  }
}
</script>

<template>
  <figure class="w-full">
    <div class="rounded-lg overflow-hidden border border-muted dark:border-transparent" :style="{ background: COLORS.bg }">
      <svg
        :viewBox="`0 0 ${VIEW.w} ${VIEW.h}`"
        class="w-full h-auto block"
        xmlns="http://www.w3.org/2000/svg"
        font-family="'JetBrains Mono', ui-monospace, monospace"
      >
        <defs>
          <marker id="wf-teal" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
            <path d="M3 2 L7.5 5 L3 8" fill="none" :stroke="COLORS.teal" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </marker>
          <marker id="wf-red" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
            <path d="M3 2 L7.5 5 L3 8" fill="none" :stroke="COLORS.red" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </marker>
        </defs>

        <text x="40" y="50" :fill="COLORS.text" font-size="17">Wind is a field sampled at each anchor, not per-blade jitter</text>
        <line x1="400" y1="86" x2="400" y2="500" :stroke="COLORS.border" stroke-width="2" />

        <text :x="LEFT_X" y="88" :fill="COLORS.red" font-size="15">per-blade random  ✗</text>
        <text :x="RIGHT_X - 5" y="88" :fill="COLORS.teal" font-size="15">one shared noise field  ✓</text>

        <!-- gust band: a stripe perpendicular to the wind, rotating with it -->
        <rect
          :x="RIGHT_CX - 42"
          :y="RIGHT_CY - 190"
          width="84"
          height="380"
          :fill="COLORS.teal"
          opacity="0.15"
          :transform="`rotate(${windDeg} ${RIGHT_CX} ${RIGHT_CY})`"
        />

        <g :fill="COLORS.text">
          <circle v-for="([cx, cy], i) in dots" :key="i" :cx="cx" :cy="cy" r="3" />
        </g>

        <g stroke-width="3.5" stroke-linecap="round" fill="none">
          <path
            v-for="(a, i) in leftArrows"
            :key="`l${i}`"
            :d="`M${a.x1.toFixed(1)} ${a.y1.toFixed(1)} L${a.x2.toFixed(1)} ${a.y2.toFixed(1)}`"
            :stroke="COLORS.red"
            marker-end="url(#wf-red)"
          />
          <path
            v-for="(a, i) in rightArrows"
            :key="`r${i}`"
            :d="`M${a.x1.toFixed(1)} ${a.y1.toFixed(1)} L${a.x2.toFixed(1)} ${a.y2.toFixed(1)}`"
            :stroke="COLORS.teal"
            marker-end="url(#wf-teal)"
          />
        </g>

        <text x="215" y="524" text-anchor="middle" :fill="COLORS.text" font-size="13">neighbors disagree — reads as static</text>
        <text x="585" y="524" text-anchor="middle" :fill="COLORS.text" font-size="13">neighbors agree — a gust rolls through</text>
      </svg>

      <!-- control bar: draggable wind vector -->
      <div class="flex items-center justify-center gap-4 px-4 py-3 border-t" :style="{ borderColor: COLORS.border }">
        <span class="text-sm shrink-0" :style="{ color: COLORS.text }">Wind direction</span>
        <svg
          ref="dialEl"
          viewBox="0 0 100 100"
          width="100"
          height="100"
          class="shrink-0 touch-none"
          :class="dragging ? 'cursor-grabbing' : 'cursor-grab'"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker id="wf-dial" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M3 2 L7.5 5 L3 8" fill="none" :stroke="COLORS.lav" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </marker>
          </defs>
          <circle :cx="DIAL.cx" :cy="DIAL.cy" :r="DIAL.r" fill="none" :stroke="COLORS.border" stroke-width="3" />
          <circle :cx="DIAL.cx" :cy="DIAL.cy" r="3" :fill="COLORS.lav" />
          <path
            :d="`M${needle.x1} ${needle.y1} L${needle.x2.toFixed(1)} ${needle.y2.toFixed(1)}`"
            :stroke="COLORS.lav"
            stroke-width="4"
            stroke-linecap="round"
            marker-end="url(#wf-dial)"
          />
          <!-- transparent hit target, bigger than the dial so it's easy to grab -->
          <circle
            :cx="DIAL.cx"
            :cy="DIAL.cy"
            :r="DIAL.r + 12"
            fill="transparent"
            tabindex="0"
            role="slider"
            aria-label="Wind direction in degrees"
            :aria-valuenow="displayDeg"
            aria-valuemin="0"
            aria-valuemax="360"
            @pointerdown="onDown"
            @pointermove="onMove"
            @pointerup="onUp"
            @pointercancel="onUp"
            @keydown="onKey"
          />
        </svg>
        <span class="text-sm tabular-nums w-12 text-right shrink-0" :style="{ color: COLORS.text }">{{ displayDeg }}°</span>
      </div>
    </div>
    <figcaption class="mt-2 text-center text-sm text-muted">
      Drag the dial to turn the wind: the field panel re-orients as one, the jitter panel just stays noise
    </figcaption>
  </figure>
</template>

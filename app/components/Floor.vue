<script setup lang="ts">
import { DoubleSide, PlaneGeometry, Vector3 } from 'three'
import { NodeMaterial, Node } from 'three/webgpu'
import {
  clamp,
  smoothstep,
  color,
  Fn,
  uniform,
  vec4,
  uv,
  mix,
  step,
  positionWorld,
} from 'three/tsl'
import type { TresPointerEvent } from '@tresjs/core'

interface GridLine {
  color: ReturnType<typeof uniform>
  scale: ReturnType<typeof uniform>
  thickness: ReturnType<typeof uniform>
  cross: ReturnType<typeof uniform>
}

const emit = defineEmits<{
  click: [event: TresPointerEvent]
}>()

function handleClick(event: TresPointerEvent) {
  emit('click', event)
}

function createGridLine(
  lineColor: string | number = 0xffffff,
  scale = 1,
  thickness = 0.05,
  cross = 1,
): GridLine {
  return {
    color: uniform(color(lineColor)),
    scale: uniform(scale),
    thickness: uniform(thickness),
    cross: uniform(cross),
  }
}

// Antialiased grid based on https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8
const toAntialiasedGrid = Fn(([uvRef, scale, thickness, cross]: [any, any, any, any]) => {
  const lineWidth = thickness
  const referenceUv = uvRef.div(scale)
  const uvDeriv = referenceUv.fwidth()
  const drawWidth = clamp(lineWidth, uvDeriv, 1)
  const lineAA = uvDeriv.mul(1.5)

  // Cross mask - creates the + pattern by masking out parts of the grid
  const crossGrid = step(referenceUv.fract().sub(0.5).abs(), cross.oneMinus().mul(0.5))
  const crossMask = mix(crossGrid.x, 1, crossGrid.y).oneMinus()

  const gridUV = referenceUv.fract().mul(2).sub(1).abs().oneMinus()
  let grid = smoothstep(drawWidth.add(lineAA), drawWidth.sub(lineAA), gridUV)
  grid = grid.mul(clamp(lineWidth.div(drawWidth), 0, 1))
  grid = mix(grid, lineWidth, clamp(uvDeriv.mul(2).sub(1), 0, 1)).mul(crossMask)

  return mix(grid.x, 1, grid.y)
})

function createGridMaterial(
  baseColor: string | number,
  lines: GridLine[],
  globalScale = 1,
  fadeStart = 40,
  fadeEnd = 80,
) {
  const material = new NodeMaterial()
  material.side = DoubleSide
  material.transparent = true

  const scaleNode = uniform(globalScale)
  const fadeStartNode = uniform(fadeStart)
  const fadeEndNode = uniform(fadeEnd)

  // Build color by layering grids - use reduce to maintain proper typing
  const gridColor = lines.reduce<Node>(
    (acc, line) => {
      const grid = toAntialiasedGrid(
        uv(),
        line.scale.mul(scaleNode),
        line.thickness,
        line.cross,
      )
      return mix(acc, line.color, grid)
    },
    uniform(color(baseColor)),
  )

  // Distance-based fade for horizon effect
  // Calculate distance from world position to origin (XZ plane)
  const dist = positionWorld.xz.length()
  const fadeAlpha = smoothstep(fadeEndNode, fadeStartNode, dist)

  material.colorNode = gridColor
  material.outputNode = vec4(gridColor, fadeAlpha)

  return { material, scaleNode, fadeStartNode, fadeEndNode }
}

// Configure grid lines - grayscale style
// Small light gray crosses + faint darker grid
const lines: GridLine[] = [
  createGridLine('#666666', 0.05, 0.015, 0.15), // gray crosses, cross=0.15 makes + shape
  createGridLine('#2a2a2a', 0.1, 0.002, 2), // faint larger grid lines
]

// Base color matches TresCanvas clear-color for seamless horizon fade
const { material } = createGridMaterial(0x0a0a0a, lines, 0.1)

const geometry = new PlaneGeometry(200, 200)
</script>

<template>
  <TresMesh
    name="floor"
    :geometry="geometry"
    :material="material"
    :rotation-x="-Math.PI / 2"
    receive-shadow
    @click="handleClick"
  />
</template>

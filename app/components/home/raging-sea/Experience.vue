<script setup lang="ts">
import type { SphereGeometry} from 'three';
import { Color, DoubleSide, Uniform, Vector2 } from 'three'
import { useBreakpoints, usePointer, breakpointsTailwind } from '@vueuse/core'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const { x, y } = usePointer()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm') // < 640px

// Normalize mouse coordinates to -1 to 1 range
const normalizedMouse = computed(() => {
  const normalizedX = (x.value / window.innerWidth) * 2 - 1
  const normalizedY = -(y.value / window.innerHeight) * 2 + 1
  return new Vector2(normalizedX, normalizedY)
})

const uniforms = {
  uTime: new Uniform(0),
  uBigWavesElevation: new Uniform(0.1),
  uBigWavesFrequency: new Uniform(new Vector2(4, 1.5)),
  uBigWavesSpeed: new Uniform(0.75),
  uDepthColor: new Uniform(new Color('#ff4000')),
  uSurfaceColor: new Uniform(new Color('#151c37')),
  uColorOffset: new Uniform(0.925),
  uColorMultiplier: new Uniform(1),
  uSmallWavesElevation: new Uniform(0.15),
  uSmallWavesFrequency: new Uniform(3),
  uSmallWavesSpeed: new Uniform(0.2),
  uSmallWavesIterations: new Uniform(4.0),
  uMouse: new Uniform(normalizedMouse.value),
}

watch(normalizedMouse, (newMouse) => {
  uniforms.uMouse.value = newMouse
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
})

const geometryRef = ref<SphereGeometry>(null)

watch(geometryRef, (newGeometry) => {
  if (newGeometry) {
    newGeometry.deleteAttribute('normal')
    newGeometry.deleteAttribute('uv')
  }
})

</script>
<template>
  <TresPerspectiveCamera :position="[0,0, isMobile ? 9 : 7]" />

  <TresMesh>
    <TresSphereGeometry ref="geometryRef" :args="[2, 512, 512]" />
    <TresShaderMaterial 
      :vertex-shader="vertexShader" 
      :fragment-shader="fragmentShader" 
      :uniforms="uniforms" 
      :side="DoubleSide"
    />
  </TresMesh>
  <Suspense>
    <EffectComposerPmndrs>
      <NoisePmndrs premultiply :blend-function="BlendFunction.SCREEN" />
      <ChromaticAberrationPmndrs :offset="new Vector2(0.001, 0.001)" :blend-function="BlendFunction.SCREEN" radial-modulation />
      <ToneMappingPmndrs :mode="ToneMappingMode.ACES_FILMIC" />
    </EffectComposerPmndrs>
  </Suspense>
</template>
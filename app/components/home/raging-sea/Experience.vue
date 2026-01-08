<script setup lang="ts">
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { Color, DoubleSide, Uniform, Vector2 } from 'three'

const uniforms = {
  uTime: new Uniform(0),
  uBigWavesElevation: new Uniform(0.1),
  uBigWavesFrequency: new Uniform(new Vector2(4, 1.5)),
  uBigWavesSpeed: new Uniform(0.75),
  uDepthColor: new Uniform(new Color('#186691')),
  uSurfaceColor: new Uniform(new Color('#9bd8ff')),
  uColorOffset: new Uniform(0.08),
  uColorMultiplier: new Uniform(5),
  uSmallWavesElevation: new Uniform(0.15),
  uSmallWavesFrequency: new Uniform(3),
  uSmallWavesSpeed: new Uniform(0.2),
  uSmallWavesIterations: new Uniform(4.0),
}

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
})

</script>
<template>
  <TresPerspectiveCamera :position="[5,5,5]" />
  <OrbitControls />
  <TresMesh :rotation-x="-Math.PI / 2">
    <TresSphereGeometry :args="[2, 512, 512]" />
    <TresShaderMaterial 
      :vertex-shader="vertexShader" 
      :fragment-shader="fragmentShader" 
      :uniforms="uniforms" 
      :side="DoubleSide"
    />
  </TresMesh>
</template>
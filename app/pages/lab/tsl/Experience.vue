<script setup lang="ts">
import { mix, positionLocal, uniform } from 'three/src/nodes/TSL.js'
import { Color, MeshStandardNodeMaterial } from 'three/webgpu'

const material = new MeshStandardNodeMaterial()

const topColor = uniform(new Color('#6366f1'))
const bottomColor = uniform(new Color('#ec4899'))

const factor = positionLocal.y.mul(0.5).add(0.5)

material.colorNode = mix(bottomColor, topColor, factor)


</script>

<template>
  <TresPerspectiveCamera :position="[10,10,10]" />
  <OrbitControls />
  <TresMesh>
    <TresSphereGeometry :args="[2,32,32]" />
    <primitive :object="material" />
  </TresMesh>
  <TresAmbientLight :intensity="1" />
</template>
<script setup lang="ts">
import { WebGPURenderer } from 'three/webgpu'
import type { TresRendererSetupContext } from '@tresjs/core'

function createWebGPURenderer(ctx: TresRendererSetupContext) {
  const renderer = new WebGPURenderer({
    canvas: toValue(ctx.canvas),
    // WebGPU specific configuration
    alpha: true,
    antialias: true,
  })
  return renderer
}
</script>

<template>
  <TresCanvas :renderer="createWebGPURenderer" clear-color="#2f2f2f">
    <TresPerspectiveCamera :position="[2.907317041458281,-0.8352025541628045,4.21145918828695]" :look-at="[0,0,0]" />
    <BlogTslCubeModel />
    <TresDirectionalLight :position="[-2, 3, 2]" :intensity="2" />
    <TresAmbientLight :intensity="1" />
    <OrbitControls />
  </TresCanvas>
</template>
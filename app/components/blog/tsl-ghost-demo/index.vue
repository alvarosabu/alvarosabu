<script setup lang="ts">
import { WebGPURenderer } from 'three/webgpu'
import { NoToneMapping } from 'three'
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
  <TresCanvas :renderer="createWebGPURenderer" :clear-color="0x0a0a0a" :tone-mapping="NoToneMapping">
    <TresPerspectiveCamera :position="[2.444151564294051,1.0749183544061558,3.6152688281859438]" :look-at="[0,1,0]" />
   
    <TresDirectionalLight :position="[-2, 3, 2]" :intensity="2" />
    <TresAmbientLight :intensity="1" />
    <Floor />
    <BlogTslGhostDemoHero />
    <OrbitControls :target="[0,1,0]" />
    <BlogTslGhostDemoBloom :bloom="{ strength: 0.5, radius: 0.1, threshold: 0.1, smoothWidth: 0.01 }" />
  </TresCanvas>
</template>
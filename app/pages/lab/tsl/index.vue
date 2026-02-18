<script setup lang="ts">
import LabTSLExperience from './Experience.vue'

import { WebGPURenderer, MeshStandardNodeMaterial } from 'three/webgpu'
import type { TresRendererSetupContext } from '@tresjs/core'

// Create WebGPU renderer factory
const createWebGPURenderer = (ctx: TresRendererSetupContext) => {
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
  <TresCanvas :renderer="createWebGPURenderer" window-size clear-color="#2f2f2f">
    <LabTSLExperience />
  </TresCanvas>
</template>
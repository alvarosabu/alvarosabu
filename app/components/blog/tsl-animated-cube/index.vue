<script setup lang="ts">
import { TresCanvas } from '@tresjs/core/webgpu'
</script>

<template>
  <TresCanvas alpha clear-color="#2f2f2f">
    <TresPerspectiveCamera :position="[2.907317041458281,-0.8352025541628045,4.21145918828695]" :look-at="[0,0,0]" />
    <BlogTslAnimatedCubeModel />
    <TresDirectionalLight :position="[-2, 3, 2]" :intensity="2" />
    <TresAmbientLight :intensity="1" />
    <OrbitControls />
  </TresCanvas>
</template>
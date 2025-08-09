<script setup lang="ts">
import { vLightHelper } from '@tresjs/core'

</script>

<template>
  <HomeCameraController />
  <TresAmbientLight :intensity="0.5" />
  <!-- <OrbitControls :target="[-2, 0, 0]" /> -->
  <TresDirectionalLight name="key-light" :intensity="2" :position="[0, 10, 10]" />
  <TresDirectionalLight name="fill-light" :intensity="2" :position="[0, -10, 10]" />
  <TresDirectionalLight name="back-light" color="cyan" :intensity="2" :position="[0, 0, -10]" />
  <Suspense>
    <HomePlanet />
  </Suspense>
</template>
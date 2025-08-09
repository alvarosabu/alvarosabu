<script setup lang="ts">

</script>

<template>
  <TresPerspectiveCamera :position="[10,10,10]" />
  <OrbitControls />
  <TestCharacter />
  <TresGridHelper :size="100" :divisions="100" />
  <TresAmbientLight :intensity="0.5" />
  <TresDirectionalLight :position="[10, 10, 10]" :intensity="1" />
</template>
<script setup lang="ts">

</script>

<template>
  <TresPerspectiveCamera :position="[-2,5,5]" :look-at="[-2, 0, 0]" />
  <TresMesh>
    <TresBoxGeometry />
    <TresMeshNormalMaterial />
  </TresMesh>
</template>
<script setup lang="ts">
const mode = useColorMode()
mode.value = 'dark'
</script>
<template>
  <TresCanvas window-size :clear-color="'#270000'">
    <HomeRagingSeaExperience />
  </TresCanvas>
</template>
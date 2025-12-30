<script setup lang="ts">
const { isDark, colors } = useDarkMode()
</script>
<template>
  <TresCanvas window-size :clear-color="isDark ? colors.DARK : colors.LIGHT">
    <HomeMorphingParticlesExperience />
  </TresCanvas>
</template>
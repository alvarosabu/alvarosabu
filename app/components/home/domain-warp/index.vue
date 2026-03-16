<script setup lang="ts">
import { NoToneMapping } from 'three'

const { isDark, colors } = useDarkMode()
</script>

<template>
  <TresCanvas window-size :clear-color="isDark ? colors.DARK : colors.LIGHT" :tone-mapping="NoToneMapping">
    <LazyHomeDomainWarpExperience />
  </TresCanvas>
</template>

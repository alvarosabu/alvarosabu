<script setup lang="ts">
const mode = useColorMode()
mode.value = 'dark'

// Hide the color mode toggle while the raging-sea experience forces dark mode,
// then restore it when leaving the home page so other pages keep the switch.
const toggleDarkModeEnabled = useState('toggleDarkModeEnabled')
toggleDarkModeEnabled.value = false

onUnmounted(() => {
  toggleDarkModeEnabled.value = true
})
</script>
<template>
  <TresCanvas window-size :clear-color="'#270000'">
    <HomeRagingSeaExperience />
  </TresCanvas>
</template>
<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const isVisible = computed(() => {
  return  y.value < 10
})
</script>

<template>
  <span
    class="mb-8 md:mb-0 py-0 lg:py-4 px-8 flex flex-col items-baseline justify-center text-left text-sm md:text-lg font-normal transition-transform duration-300"
    :class="{ '-translate-x-full opacity-0': !isVisible }"
  >
    <span>┌─────┐</span>
    <span class="pl-8">  A S </span>
    <span class="pl-8"> アル  </span>
    <span class="pl-8"> バロ  </span>
    <span>└─────┘</span>
  </span>
</template>

<style scoped></style>

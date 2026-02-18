<script setup lang="ts">
import { useMouse, useWindowSize, useTimeoutFn } from '@vueuse/core'

const { x, y } = useMouse()
const { width, height } = useWindowSize()

const isMoving = ref(false)
const { start, stop } = useTimeoutFn(() => {
  isMoving.value = false
}, 2000, { immediate: false })

watch([x, y], () => {
  isMoving.value = true
  stop()
  start()
})

const normalizedX = computed(() => (x.value / width.value).toFixed(3))
const normalizedY = computed(() => (y.value / height.value).toFixed(3))
</script>

<template>
  <div
    class="pointer-events-none fixed z-50 -translate-x-1/4 -translate-y-1/3 transition-opacity duration-700 ease-in"
    :class="isMoving ? 'opacity-50' : 'opacity-0'"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <!-- Crosshair brackets -->
    <div class="relative h-8 w-8">
      <span class="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-default" />
      <span class="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-default" />
      <span class="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-default" />
      <span class="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-default" />
    </div>
    <!-- Coordinates -->
    <p class="mt-1 text-center font-mono text-xs text-default">
      {{ normalizedX }}, {{ normalizedY }}
    </p>
  </div>
</template>

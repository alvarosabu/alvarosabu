<script setup lang="ts">
import { motion } from 'motion-v'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <motion.h1
      class="text-4xl font-bold mb-32 text-center md:text-left "
      :initial="{ opacity: 0, x: -100 }"
      :animate="{ opacity: 1, x: 0 }"
      :transition="{ duration: 0.5 }"
    >
        <slot>
        {{ title }}
        </slot>
    </motion.h1>
</template>
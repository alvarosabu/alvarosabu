<script setup lang="ts">
import { motion } from 'motion-v'
import type { Photo } from '~/composables/usePhotos'

defineProps<{ photos: Photo[] }>()

const emit = defineEmits<{
  select: [index: number, rect: DOMRect]
}>()

const container = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.04,
    },
  },
  hidden: { opacity: 0 },
}

const item = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 16 },
}
</script>

<template>
  <Motion
    initial="hidden"
    animate="visible"
    :variants="container"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
  >
    <motion.div
      v-for="(photo, index) in photos"
      :key="photo.slug"
      :variants="item"
    >
      <PhotosCard :photo @select="rect => emit('select', index, rect)" />
    </motion.div>
  </Motion>
</template>

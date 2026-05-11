<script setup lang="ts">
import { blurhashToGradientCssObject } from '@unpic/placeholder'
import type { CSSProperties } from 'vue'
import type { Photo } from '~/composables/usePhotos'

const { photo } = defineProps<{ photo: Photo }>()

const emit = defineEmits<{
  select: [rect: DOMRect]
}>()

const button = useTemplateRef<HTMLButtonElement>('button')
const loaded = ref(false)

const placeholderStyle = computed<CSSProperties>(() => blurhashToGradientCssObject(photo.blurhash) as CSSProperties)

function handleSelect() {
  if (button.value) {
    emit('select', button.value.getBoundingClientRect())
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleSelect()
  }
}
</script>

<template>
  <button
    ref="button"
    type="button"
    class="relative block w-full aspect-square overflow-hidden rounded-md cursor-zoom-in group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    :style="placeholderStyle"
    :aria-label="`View photo${photo.alt ? `: ${photo.alt}` : ''}`"
    @click="handleSelect"
    @keydown="handleKeydown"
  >
    <NuxtImg
      :src="photo.src"
      :alt="photo.alt ?? ''"
      format="avif,webp"
      sizes="sm:100vw md:50vw lg:33vw xl:25vw"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="loaded = true"
    />
  </button>
</template>

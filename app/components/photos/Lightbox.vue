<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'
import { onKeyStroke, useScrollLock, useSwipe } from '@vueuse/core'
import type { Photo } from '~/composables/usePhotos'

const { photos, sourceRect } = defineProps<{
  photos: Photo[]
  sourceRect: DOMRect | null
}>()

const index = defineModel<number | null>('index', { default: null })

const isOpen = computed(() => index.value !== null && index.value !== undefined)
const current = computed(() => (index.value != null ? photos[index.value] ?? null : null))

const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
const swipeTarget = useTemplateRef<HTMLElement>('swipeTarget')

const scrollLock = useScrollLock(import.meta.client ? document.body : null)

watch(isOpen, async (open) => {
  scrollLock.value = open
  if (open) {
    await nextTick()
    closeButton.value?.focus()
  }
})

function close() {
  index.value = null
}

function next() {
  if (index.value == null) return
  index.value = (index.value + 1) % photos.length
}

function prev() {
  if (index.value == null) return
  index.value = (index.value - 1 + photos.length) % photos.length
}

onKeyStroke('Escape', () => {
  if (isOpen.value) close()
})
onKeyStroke('ArrowRight', () => {
  if (isOpen.value) next()
})
onKeyStroke('ArrowLeft', () => {
  if (isOpen.value) prev()
})

useSwipe(swipeTarget, {
  threshold: 50,
  onSwipeEnd(_, direction) {
    if (!isOpen.value) return
    if (direction === 'left') next()
    else if (direction === 'right') prev()
  },
})

// Preload neighbors for instant transitions
const neighbors = computed<Photo[]>(() => {
  if (index.value == null || photos.length < 2) return []
  const total = photos.length
  const next = photos[(index.value + 1) % total]
  const prev = photos[(index.value - 1 + total) % total]
  return [next, prev].filter((p): p is Photo => Boolean(p))
})

const animateInitial = computed(() => {
  if (!sourceRect || typeof window === 'undefined') {
    return { opacity: 0, scale: 0.95 }
  }
  const vw = window.innerWidth
  const vh = window.innerHeight
  const targetSize = Math.min(vw * 0.9, vh * 0.9)
  const scale = sourceRect.width / targetSize
  const x = sourceRect.left + sourceRect.width / 2 - vw / 2
  const y = sourceRect.top + sourceRect.height / 2 - vh / 2
  return { opacity: 0, scale, x, y }
})

function formatExif(photo: Photo): string {
  const parts = [photo.camera, photo.lens].filter(Boolean)
  const settings = [photo.focalLength, photo.aperture, photo.shutterSpeed, photo.iso && `ISO ${photo.iso}`].filter(Boolean)
  if (settings.length) parts.push(settings.join(' · '))
  return parts.join(' — ')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <Teleport to="body">
    <AnimatePresence>
      <motion.div
        v-if="isOpen && current"
        ref="swipeTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="current.alt || 'Photo viewer'"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.2 }"
        @click.self="close"
      >
        <button
          ref="closeButton"
          type="button"
          class="absolute top-4 right-4 z-10 size-12 flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Close"
          @click="close"
        >
          <Icon name="lucide:x" class="size-6" />
        </button>

        <button
          v-if="photos.length > 1"
          type="button"
          class="absolute left-2 sm:left-6 z-10 size-12 flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Previous photo"
          @click="prev"
        >
          <Icon name="lucide:arrow-left" class="size-6" />
        </button>

        <button
          v-if="photos.length > 1"
          type="button"
          class="absolute right-2 sm:right-6 z-10 size-12 flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Next photo"
          @click="next"
        >
          <Icon name="lucide:arrow-right" class="size-6" />
        </button>

        <motion.img
          :key="current.slug"
          :src="current.full"
          :alt="current.alt ?? ''"
          class="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl select-none"
          :initial="animateInitial"
          :animate="{ opacity: 1, scale: 1, x: 0, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }"
          :transition="{ type: 'spring', stiffness: 260, damping: 30 }"
          draggable="false"
        />

        <!-- Preload neighbors -->
        <link v-for="p in neighbors" :key="p.slug" rel="preload" as="image" :href="p.full">

        <div class="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-12 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none">
          <div class="max-w-3xl mx-auto flex items-end justify-between gap-4">
            <div class="flex-1 min-w-0 font-mono text-xs text-white/70">
              <p v-if="current.alt" class="text-white text-sm truncate">
                {{ current.alt }}
              </p>
              <p class="mt-1">
                {{ formatDate(current.date) }}
                <span v-if="formatExif(current)" class="hidden sm:inline"> · {{ formatExif(current) }}</span>
              </p>
            </div>
            <span class="font-mono text-xs text-white/70 tabular-nums shrink-0">
              {{ String((index ?? 0) + 1).padStart(2, '0') }} / {{ String(photos.length).padStart(2, '0') }}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

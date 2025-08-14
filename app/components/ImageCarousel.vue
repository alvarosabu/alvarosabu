<script setup lang="ts">
interface CarouselImage {
  src: string
  alt?: string
  caption?: string
}

const slotContent = ref<HTMLElement>()
const parsedImages = ref<CarouselImage[]>([])
const carouselContainer = ref<HTMLElement>()

// Scroll state tracking
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

// Watch for slot content changes
const { stop: stopSlotObserver } = watchEffect(() => {
  if (slotContent.value) {
    console.log('slotContent', slotContent.value)
    parseImagesFromSlot()
  }
})

/**
 * Parse images from the slot content and populate the carousel items
 */
function parseImagesFromSlot() {
  if (!slotContent.value) return

  const images: CarouselImage[] = []
  const imgElements = slotContent.value.querySelectorAll('img')
  imgElements.forEach((img) => {
    if (img.src) {
      images.push({
        src: img.src,
        alt: img.alt,
        caption: img.title || undefined
      })
    }
  })
  console.log('images', images)
  parsedImages.value = images
}

function handleSelect(index: number) {
  if (index === 0) {
    canScrollLeft.value = false
  } else {
    canScrollLeft.value = true
  }
  if (index === parsedImages.value.length - 1) {
    canScrollRight.value = false
  } else {
    canScrollRight.value = true
  }
}

onMounted(() => {
  nextTick(() => {
    parseImagesFromSlot()
  })
})

onUnmounted(() => {
  stopSlotObserver()
})
</script>

<template>
  <div class="breakout">
    <div class="w-full sm:w-2/3 mx-auto relative">
      <div
        v-if="parsedImages.length > 0"
        ref="carouselContainer"
        class="relative"
      >
        <UCarousel
          v-slot="{ item }"
          :items="parsedImages"
          class-names
          :ui="{
            item: 'basis-[70%] transition-opacity [&:not(.is-snapped)]:opacity-15'
          }"
          class="relative"
          indicators
          wheel-gestures
          @select="handleSelect"
        >
          <div class="flex flex-col">
            <img
              :src="item.src"
              :alt="item.alt || 'Carousel image'"
              class="rounded-lg object-cover shadow-lg"
              loading="lazy"
            >
            <p
              v-if="item.caption"
              class="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center"
            >
              {{ item.caption }}
            </p>
          </div>
        </UCarousel>

        <!-- Left gradient overlay -->
        <div
          v-show="canScrollLeft"
          class="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10 transition-opacity duration-300 gradient-left"
          :class="{ 'opacity-0': !canScrollLeft, 'opacity-100': canScrollLeft }"
        />

        <!-- Right gradient overlay -->
        <div
          v-show="canScrollRight"
          class="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10 transition-opacity duration-300 gradient-right"
          :class="{ 'opacity-0': !canScrollRight, 'opacity-100': canScrollRight }"
        />
      </div>

      <!-- Hidden slot content for parsing -->
      <div ref="slotContent" class="sr-only">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-left {
  background: linear-gradient(to right, var(--ui-bg) 0%, transparent 100%);
}
.gradient-right {
  background: linear-gradient(to left, var(--ui-bg) 0%, transparent 100%);
}
</style>
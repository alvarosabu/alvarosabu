<script setup lang="ts">
import { joinURL } from 'ufo'

import HomeMorphingParticles from '~/components/home/morphing-particles/index.vue'
import HomeRagingSea from '~/components/home/raging-sea/index.vue'
import HomeDomainWarp from '~/components/home/domain-warp/index.vue'

definePageMeta({
  layout: 'landing'
})

// Reset synchronously before any children mount
const isExperienceReady = useState('homeExperienceReady', () => false)
isExperienceReady.value = false

// Animated fake progress counter
const progress = ref(0)
const showOverlay = ref(true)
const displayProgress = computed(() => Math.floor(progress.value).toString().padStart(3, '0'))

let animFrame: number

function animateProgress() {
  if (isExperienceReady.value) {
    // Snap to 100 quickly once experience is ready, minimum 1.5% per frame
    progress.value += Math.max((100 - progress.value) * 0.12, 1.5)
  }
  else {
    // Ease toward 85%, decelerating near the end to simulate "waiting"
    progress.value += (85 - progress.value) * 0.025
  }

  if (progress.value >= 99.95) {
    progress.value = 100
    setTimeout(() => { showOverlay.value = false }, 200)
    return
  }

  animFrame = requestAnimationFrame(animateProgress)
}

onMounted(() => {
  progress.value = 0
  showOverlay.value = true
  animFrame = requestAnimationFrame(animateProgress)
})

onUnmounted(() => cancelAnimationFrame(animFrame))

// Shader components available
const shaderComponents = [
  HomeMorphingParticles,
  HomeRagingSea,
  HomeDomainWarp,
] as const

const experimentNumber = useState('experimentNumber')
const shaderComponentsLength = useState('shaderComponentsLength')
shaderComponentsLength.value = shaderComponents.length
// Development override: uncomment and set index to test specific shader
/* experimentNumber.value = 3  */// 0: MorphingParticles, 1: FlowField, 2: RagingSea, 3: DomainWarp
experimentNumber.value = Math.floor(Math.random() * shaderComponentsLength.value)

const selectedShaderIndex = ref(
  typeof experimentNumber.value !== 'undefined'
    ? experimentNumber.value
    : Math.floor(Math.random() * shaderComponents.length)
)

const currentShader = computed(() => shaderComponents[selectedShaderIndex.value])

const site = useSiteConfig()
const title = 'Portfolio'

useSeoMeta({
  title,
  ogImage: joinURL(site.url, '/og.png'),
  ogImageAlt: 'Alvaro Saburido\'s Portfolio',
  ogTitle: title,
  ogDescription: site.description,
  ogUrl: site.url,
  twitterTitle: title,
  twitterDescription: site.description,
  twitterImage: joinURL(site.url, '/og.png'),
  twitterImageAlt: 'Alvaro Saburido\'s Portfolio',
})
</script>

<template>
  <div>
    <!-- Shader background -->
    <div class="fixed inset-0">
      <component :is="currentShader" />
    </div>
    <!-- Loading overlay -->
    <Transition name="fade">
      <div
        v-if="showOverlay"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-(--ui-bg)"
      >
        <p class="flex items-center gap-2">
          <span data-text="Loading..." class="font-pixel glitch glitch-slow">Loading...</span>
          <span
            class="font-pixel"
            :data-text="`${displayProgress}%`"
          >{{ displayProgress }}%</span>
        </p>
        <div class="relative w-40 h-px">
          <div class="absolute inset-0 h-1 bg-(--ui-text) opacity-20" />
          <div
            class="absolute inset-y-0 left-0 h-1 bg-(--ui-text)"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>
    </Transition>
    <!-- Cursor tracker -->
    <CursorTracker />
    <!-- Content overlay -->
    <div class="relative">
      <!-- Your content goes here -->
    </div>
  </div>
</template>

<style scoped>
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>

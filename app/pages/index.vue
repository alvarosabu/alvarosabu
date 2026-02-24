<script setup lang="ts">
import { joinURL } from 'ufo'

import HomeMorphingParticles from '~/components/home/morphing-particles/index.vue'
import HomeRagingSea from '~/components/home/raging-sea/index.vue'
import HomeDomainWarp from '~/components/home/domain-warp/index.vue'

definePageMeta({
  layout: 'landing'
})

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

/* useHead({
  title: `${title} | ${description}`,
}) */

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
/*   description: site.description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/og.png',
  ogUrl: site.url,
  twitterTitle: title,
  twitterDescription: description, */
 /*  twitterImage: joinURL(site.url, '/og.png'),
  twitterCard: 'summary_large_image', */
})


</script>

<template>
  <div>
    <!-- Shader background -->
    <div class="fixed inset-0">
      <component :is="currentShader" />
    </div>
    <!-- Cursor tracker -->
    <CursorTracker />
    <!-- Content overlay -->
    <div class="relative">
      <!-- Your content goes here -->
    </div>
  </div>
</template>

<style scoped></style>

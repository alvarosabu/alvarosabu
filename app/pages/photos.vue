<script setup lang="ts">
import { joinURL } from 'ufo'

const title = 'Photos'

definePageMeta({
  title: 'Photos',
})

const site = useSiteConfig()
const ogImage = joinURL(site.url, '/blog-og.png')

useSeoMeta({
  title,
  description: 'Photography by Alvaro Saburido — moments captured on the road.',
  ogImage,
  ogImageAlt: 'Alvaro Saburido\'s Photos',
  ogTitle: title,
  ogDescription: 'Photography by Alvaro Saburido — moments captured on the road.',
  ogUrl: joinURL(site.url, '/photos'),
  twitterTitle: title,
  twitterDescription: 'Photography by Alvaro Saburido — moments captured on the road.',
  twitterImage: ogImage,
  twitterImageAlt: 'Alvaro Saburido\'s Photos',
})

const photos = usePhotos()
const activeIndex = ref<number | null>(null)
const sourceRect = ref<DOMRect | null>(null)

function handleSelect(index: number, rect: DOMRect) {
  sourceRect.value = rect
  activeIndex.value = index
}
</script>

<template>
  <UContainer class="max-w-screen-xl">
    <PageTitle title="frames" />
    <p v-if="!photos.length" class="text-center text-muted py-12">
      No photos yet. Drop some in <code>photos-raw/</code> and run <code>pnpm photos</code>.
    </p>
    <PhotosGrid v-else :photos @select="handleSelect" />
    <PhotosLightbox v-model:index="activeIndex" :photos :source-rect="sourceRect" />
  </UContainer>
</template>

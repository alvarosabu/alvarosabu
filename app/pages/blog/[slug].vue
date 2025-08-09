<script setup lang="ts">
import type { useAsyncStoryblok } from '@storyblok/nuxt'
const route = useRoute()

const { story: article } = await useAsyncStoryblok(`blog/${route.params.slug}`, {
  api: {
    version: 'draft',
  }
})

// Metadata
useHead({
  title: `${article?.value?.content?.title} - AlvaroSabu`,
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})
useSeoMeta({
  title: `${article?.value?.content?.title} - AlvaroSabu`,
  keywords: article?.value?.content?.tag_list?.join(', '),
  description: article?.value?.content?.excerpt,
  ogDescription: article?.value?.content?.excerpt,
  ogUrl: `https://alvarosaburido.dev/blog/${route.params.slug}`,
  ogType: 'article',
  ogSiteName: 'AlvaroSabu',
  ogTitle: `${article?.value?.content?.title} - AlvaroSabu`,
  ogImage: article?.value?.content?.media?.filename,
  ogImageAlt: article?.value?.content?.media?.alt,
  twitterDescription: article?.value?.content?.excerpt,
  twitterTitle: `${article?.value?.content?.title} - AlvaroSabu`,
  twitterImage: article?.value?.content?.media?.filename,
  twitterImageAlt: article?.value?.content?.media?.alt,
  twitterCard: 'summary_large_image',
})

</script>

<template>
  <UContainer>
    <header class="prose mx-auto mb-12 dark:prose-invert">
      <NuxtLink to="/blog" class="flex items-center gap-2">
        <UIcon name="i-heroicons-arrow-left" />
        Back to blog
      </NuxtLink>
      <NuxtImg :src="article?.content?.media.filename" class="w-full aspect-16/9 object-cover rounded" />
      <h1 class="text-4xl font-bold font-display">{{ article?.content?.title }}</h1>
      <div class="flex justify-between items-center my-4">
        <NuxtTime :datetime="article?.published_at" class="text-sm text-gray-500 font-mono" month="long" day="numeric" year="numeric" locale="en-US" />
        <USeparator orientation="vertical" />
      </div>
      <USeparator />
    </header>
    <div class="prose dark:prose-invert mx-auto pb-24">
      <StoryblokEnhancedRichtext v-if="article?.content?.content"  :doc="article?.content.content" />
    </div>
  </UContainer>
</template>
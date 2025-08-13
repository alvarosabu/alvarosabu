<script setup lang="ts">
const route = useRoute()

/* const { story: article } = await useAsyncStoryblok(`blog/${route.params.slug}`, {
  api: {
    version: 'draft',
  }
}) */
const { data: article } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})
// Metadata
useHead({
  title: `${article?.value?.title} - AlvaroSabu`,
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
  title: `${article?.value?.title} - AlvaroSabu`,
  keywords: article?.value?.tag_list?.join(', '),
  description: article?.value?.excerpt,
  ogDescription: article?.value?.excerpt,
  ogUrl: `https://alvarosaburido.dev/blog/${route.params.slug}`,
  ogType: 'article',
  ogSiteName: 'AlvaroSabu',
  ogTitle: `${article?.value?.title} - AlvaroSabu`,
  ogImage: article?.value?.media?.filename,
  ogImageAlt: article?.value?.media?.alt,
  twitterDescription: article?.value?.excerpt,
  twitterTitle: `${article?.value?.title} - AlvaroSabu`,
  twitterImage: article?.value?.media?.filename,
  twitterImageAlt: article?.value?.media?.alt,
  twitterCard: 'summary_large_image',
})

</script>

<template>
  <UContainer class="max-w-screen-md">
    <header class="prose mx-auto mb-12 dark:prose-invert">
      <NuxtLink to="/blog" class="flex items-center gap-2">
        <UIcon name="i-heroicons-arrow-left" />
        Back to blog
      </NuxtLink>
      <NuxtImg :src="article?.thumbnail" class="w-full my-8 aspect-16/9 object-cover rounded" />
      <h1 class="text-4xl font-bold font-display">{{ article?.title }}</h1>
      <div class="flex justify-between items-center my-4">
        <NuxtTime v-if="article?.date" :datetime="article?.date" class="text-sm text-gray-500 font-mono" month="long" day="numeric" year="numeric" locale="en-US" />
        <USeparator orientation="vertical" />
      </div>
      <USeparator />
    </header>
    <div class="prose dark:prose-invert mx-auto pb-24">
      <ContentRenderer v-if="article" :value="article" />
      <!-- <StoryblokEnhancedRichtext v-if="article?.content?.content"  :doc="article?.content.content" /> -->
    </div>
  </UContainer>
</template>
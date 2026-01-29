<script setup lang="ts">
definePageMeta({
  layout: 'single'
})

const route = useRoute()
const { isPostVisible, isDev } = useBlogPosts()

const { data: article } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

if (article.value && !isPostVisible(article.value.status)) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const readingTime = computed(() => {
  return article?.value?.meta?.readingTime?.text
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
  keywords: article?.value?.tags?.join(', '),
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
  ogImage: article?.value?.thumbnail,
  ogImageAlt: article?.value?.thumbnailAlt,
  twitterDescription: article?.value?.excerpt,
  twitterTitle: `${article?.value?.title} - AlvaroSabu`,
  twitterImage: article?.value?.thumbnail,
  twitterImageAlt: article?.value?.thumbnailAlt,
  twitterCard: 'summary_large_image',
})

</script>

<template>
  <UContainer class="max-w-screen-md">
    <header class="prose mx-auto mb-12 dark:prose-invert">
      <NuxtImg v-if="article?.thumbnail" :src="article?.thumbnail" class="w-full my-8 aspect-16/9 object-cover rounded mb-24" />
      <div class="flex items-center gap-3 mb-8">
        <h1 class="text-4xl font-bold font-display">{{ article?.title }}</h1>
        <UBadge v-if="isDev && article?.status === 'draft'" label="Draft" color="warning" variant="subtle" />
      </div>
      <div class="flex items-center gap-2 my-4">
       <NuxtTime v-if="article?.date" :datetime="article?.date" class="text-sm text-gray-500 font-mono" month="long" day="numeric" year="numeric" locale="en-US" text="Updated at " />
         —
        <span class="text-sm text-gray-500 font-mono flex items-center gap-2"> <UIcon name="i-heroicons-clock" class="w-4 h-4" /> {{ readingTime }} </span>
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
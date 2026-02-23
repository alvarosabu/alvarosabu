<script setup lang="ts">
import { joinURL } from 'ufo'

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

const site = useSiteConfig()

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
useSchemaOrg([
  defineArticle({
    headline: article.value?.title,
    description: article.value?.description,
    datePublished: article.value?.date,
    keywords: article.value?.tags,
    image: article.value?.thumbnail,
  }),
])

useSeoMeta({
  title: `${article?.value?.title} - AlvaroSabu`,
  keywords: article?.value?.tags?.join(', '),
  description: article?.value?.description,
  ogDescription: article?.value?.description,
  ogUrl: joinURL(site.url, `/blog/${route.params.slug}`),
  ogType: 'article',
  ogSiteName: 'AlvaroSabu',
  ogTitle: `${article?.value?.title} - AlvaroSabu`,
  ogImage: article?.value?.thumbnail,
  twitterDescription: article?.value?.description,
  twitterTitle: `${article?.value?.title} - AlvaroSabu`,
  twitterImage: article?.value?.thumbnail,
  twitterCard: 'summary_large_image',
})

</script>

<template>
  <UContainer class="max-w-screen-md">
    <header class="prose mx-auto mb-12 dark:prose-invert">
     
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
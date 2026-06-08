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

const articleUrl = computed(() => joinURL(site.url, `/blog/${route.params.slug}`))

// Resolve the thumbnail to an absolute URL so crawlers and schema.org get a fully qualified image
const ogImageUrl = computed(() =>
  article.value?.thumbnail ? joinURL(site.url, article.value.thumbnail) : undefined,
)

// Metadata — title kept bare; app.vue's titleTemplate appends " - AlvaroSabu"
useSeoMeta({
  title: () => article.value?.title,
  keywords: () => article.value?.tags?.join(', '),
  description: () => article.value?.description,
  ogType: 'article',
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.description,
  ogUrl: () => articleUrl.value,
  ogImage: () => ogImageUrl.value,
  ogImageAlt: () => article.value?.title,
  articlePublishedTime: () => article.value?.date,
  articleModifiedTime: () => article.value?.date,
  articleAuthor: ['Alvaro Saburido'],
  articleTag: () => article.value?.tags,
  twitterCard: 'summary_large_image',
  twitterTitle: () => article.value?.title,
  twitterDescription: () => article.value?.description,
  twitterImage: () => ogImageUrl.value,
  twitterImageAlt: () => article.value?.title,
  twitterCreator: '@alvarosabu',
})

useSchemaOrg([
  defineArticle({
    headline: () => article.value?.title,
    description: () => article.value?.description,
    datePublished: () => article.value?.date,
    dateModified: () => article.value?.date,
    keywords: () => article.value?.tags,
    image: () => ogImageUrl.value,
    inLanguage: 'en',
    authorName: 'Alvaro Saburido',
  }),
])
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
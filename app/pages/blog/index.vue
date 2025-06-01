<script setup lang="ts">
useHead({
  title: 'Blog - AlvaroSabu',
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
  title: 'Blog - AlvaroSabu',
  description: 'A collection of articles about web development, design, 3D, and other topics.',
  ogDescription: 'A collection of articles about web development, design, 3D, and other topics.',
  ogUrl: 'https://alvarosaburido.dev/blog/',
  ogType: 'website',
  ogSiteName: 'AlvaroSabu',
  ogTitle: 'Blog - AlvaroSabu',
  ogImage: 'https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Blog_oet7tv.png',
  ogImageAlt: 'Blog - AlvaroSabu',
  twitterDescription: 'A collection of articles about web development, design, 3D, and other topics.',
  twitterTitle: 'Blog - AlvaroSabu',
  twitterImage: 'https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Blog_oet7tv.png',
  twitterImageAlt: 'Blog - AlvaroSabu',
  twitterCard: 'summary_large_image',
})

const config = useRuntimeConfig()

const story = await useAsyncStoryblok(
  'blog',
  { 
    version: config.public.storyblokVersion as 'draft' | 'published', 
    resolve_relations: 'overview.featured_story' },
  { resolveRelations: 'overview.featured_story' },
)

const articles = await useAsyncStoryblokStories({
  version: config.public.storyblokVersion as 'draft' | 'published',
  starts_with: 'blog',
  is_startpage: false,
  resolve_relations: 'article.category',
})

</script>
<template>
  <UContainer>
    <h1 class="text-4xl font-bold font-display mt-8 mb-16 md:mt-24 md:mb-32">{{ story?.content?.title }} <UBadge v-if="config.public.storyblokVersion === 'draft'" :label="config.public.storyblokVersion" color="primary" variant="subtle" class="mb-2" size="sm" /></h1>
    <section v-if="articles" class="flex flex-col gap-16">
      <template v-for="article in articles" :key="article.content.uuid">
        <NuxtLink class="flex flex-col md:flex-row gap-4" :to="`/blog/${article.slug}`">
          <NuxtImg :src="article.content.media.filename" class="w-full md:w-1/6 aspect-16/9 md:aspect-1/1 object-cover rounded" />
          <div>
            <UBadge :label="article.content.category.name" color="primary" variant="subtle" class="mb-2" size="sm" />
            <h2 class="text-2xl font-bold mb-4">{{ article.content.title }}</h2>
            <p class="text-gray-500 max-w-prose">{{ article.content.excerpt }}</p>
            <footer class="flex justify-between items-center mt-4">
              <NuxtTime :datetime="article.published_at" class="text-sm text-gray-500 font-mono" month="long" day="numeric" year="numeric" locale="en-US" />
            </footer>
          </div>
        </NuxtLink>
        <USeparator />
      </template>
    </section>
  </UContainer>
</template>
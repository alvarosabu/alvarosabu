<script setup lang="ts">
import { motion } from 'motion-v'
import { isDev } from '~/utils'

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

const { data: articles } = await useAsyncData('blog', () =>
  queryCollection('blog').all().then(items =>
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )
)
console.log(articles)

/* const { story } = await useAsyncStoryblok(
  'blog',
  { 
    api: {
      version: config.public.storyblokVersion as 'draft' | 'published', 
      resolve_relations: 'overview.featured_story' 
    },
    bridge: { resolveRelations: 'overview.featured_story' },
  },
  
)

const articles = await useAsyncStoryblokStories({
  version: config.public.storyblokVersion as 'draft' | 'published',
  starts_with: 'blog',
  is_startpage: false,
  resolve_relations: 'article.category',
}) */
const list = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3, // Stagger children by .3 seconds
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
}

const item = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 },
}
</script>
<template>
  <UContainer>
    <motion.h1
      class="text-4xl font-bold font-display pt-8 mb-16 md:pt-24 md:mb-32 flex items-center gap-2"
      :initial="{ opacity: 0, y: 100 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      Blog <UBadge v-if="isDev" label="Draft" color="primary" variant="subtle" class="mb-2" size="sm" />
    </motion.h1>
    <section v-if="articles" >
      <Motion
        initial="hidden"
        class="flex flex-col gap-16"
        while-in-view="visible"
        :variants="list">
        <section class="flex flex-col gap-12">
          <Motion v-for="{ thumbnail, path, date, title, description } in articles" :key="path" :variants="item">
            <NuxtLink :to="path">
              <article class="flex flex-col md:flex-row gap-4 mb-12">
                <NuxtImg :src="thumbnail" class="w-full md:w-1/6 aspect-16/9 md:aspect-1/1 object-cover rounded" />
                <div>
                  <!-- <UBadge :label="article.content.category.name" color="primary" variant="subtle" class="mb-2" size="sm" /> -->
                  <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
                  <p class="text-gray-500 max-w-prose">{{ description }}</p>
                  <footer class="flex justify-between items-center mt-4">
                    <NuxtTime :datetime="date" class="text-sm text-gray-500 font-mono" month="long" day="numeric" year="numeric" locale="en-US" />
                  </footer>
                </div>
              </article>
            </NuxtLink>
            <USeparator />
          </Motion>
        </section>
  
      </Motion>
    </section>
  </UContainer>
</template>
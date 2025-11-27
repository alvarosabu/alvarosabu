<script setup lang="ts">
import { motion } from 'motion-v'

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

interface ArticlesByYear {
  year: number
  articles: typeof articles.value
}

const articlesByYear = computed<ArticlesByYear[]>(() => {
  if (!articles.value) return []

  const grouped = articles.value.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(article)
    return acc
  }, {} as Record<number, typeof articles.value>)

  return Object.entries(grouped)
    .map(([year, articles]) => ({ year: Number(year), articles }))
    .sort((a, b) => b.year - a.year)
})

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

function getRandomGlitchStyle(index: number) {
  // Deterministic pseudo-random based on index
  const seed = index * 2654435761 // Large prime for better distribution
  const random = (seed % 100) / 100

  // Duration: between 1s and 4s (varied glitch speed)
  const duration = 4 + (random * 6)

  // Offset: between 3px and 8px (visible but not overwhelming)
  const offset = 3 + ((seed % 50) / 50) * 5

  return {
    '--glitch-duration': `${duration.toFixed(2)}s`,
    '--glitch-offset': `${offset.toFixed(1)}px`,
  }
}
</script>
<template>
  <UContainer>
    <motion.h1
      class="text-4xl font-bold  pt-8 mb-16 md:pt-24 md:mb-32 flex items-center gap-2"
      :initial="{ opacity: 0, y: 100 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      some thoughts
    </motion.h1>
    <section v-if="articlesByYear.length" >
      <Motion
        initial="hidden"
        class="flex flex-col gap-16"
        while-in-view="visible"
        :variants="list">
        <section v-for="({ year, articles: yearArticles }, index) in articlesByYear" :key="year" class="relative pt-6 flex flex-col gap-10">
          <motion.span
            class="glitch-2 text-8xl absolute -top-8 -left-10 select-none font-bold text-stroke-muted text-stroke-2 text-transparent pointer-events-none opacity-3"
            :initial="{ opacity: 0, x: -50 }"
            :while-in-view="{ opacity: 0.05, x: 0 }"
            :transition="{ duration: 0.5 }"
            :data-text="year"
            :style="getRandomGlitchStyle(index)"
          >
            {{ year }}
          </motion.span>

          <Motion v-for="{ path, date, title } in yearArticles" :key="path" :variants="item">
            <NuxtLink :to="path">
              <article class="flex flex-col md:flex-row items-center gap-4 mb-4">

                <!-- <UBadge :label="article.content.category.name" color="primary" variant="subtle" class="mb-2" size="sm" /> -->
                <p class="font-bold">{{ title }}</p>
                
                <footer class="flex justify-between items-center">
                  <NuxtTime :datetime="date" class="text-sm text-gray-500 font-mono" month="short" day="numeric" locale="en-US" />
                </footer>

              </article>
            </NuxtLink>
          
          </Motion>
          <USeparator v-if="index !== articlesByYear.length - 1" />
        </section>

      </Motion>
    </section>
  </UContainer>
</template>
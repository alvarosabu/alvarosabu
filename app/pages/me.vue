<script setup lang="ts">
import { motion } from 'motion-v'

const { data: page } = await useAsyncData('me', () =>
  queryCollection('me').first()
)

const socialIcons: Record<string, string> = {
  github: 'i-simple-icons-github',
  twitter: 'i-simple-icons-x',
  bluesky: 'i-simple-icons-bluesky',
  youtube: 'i-simple-icons-youtube',
  discord: 'i-simple-icons-discord',
  linkedin: 'i-simple-icons-linkedin',
}

useHead({
  title: 'About Me - AlvaroSabu',
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
  title: 'About Me - AlvaroSabu',
  description: 'Creative Software Engineer. Enabling developers to build creative stuff they dream of but never thought was possible.',
  ogDescription: 'Creative Software Engineer. Enabling developers to build creative stuff they dream of but never thought was possible.',
  ogUrl: 'https://alvarosaburido.dev/me',
  ogType: 'website',
  ogSiteName: 'AlvaroSabu',
  ogTitle: 'About Me - AlvaroSabu',
  ogImage: 'https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Home_oxyn5k.png',
  ogImageAlt: 'About Me - AlvaroSabu',
  twitterDescription: 'Creative Software Engineer. Enabling developers to build creative stuff they dream of but never thought was possible.',
  twitterTitle: 'About Me - AlvaroSabu',
  twitterImage: 'https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Home_oxyn5k.png',
  twitterImageAlt: 'About Me - AlvaroSabu',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UContainer class="max-w-screen-md">
    <motion.article
      class="prose prose-lg dark:prose-invert mx-auto"
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <!-- Content from markdown -->
      <ContentRenderer v-if="page" :value="page" />

      <!-- Socials Section -->
      <template v-if="page?.socials?.length">
        <USeparator class="my-12" />
        <section class="not-prose">
          <h2 class="text-xl font-bold mb-6">Find me on</h2>
          <div class="flex flex-wrap gap-3">
            <UButton
              v-for="social in page.socials"
              :key="social.platform"
              :to="social.url"
              target="_blank"
              rel="noopener noreferrer"
              variant="soft"
              color="neutral"
              size="lg"
            >
              <UIcon :name="socialIcons[social.platform] || 'i-heroicons-link'" class="w-5 h-5" />
              <span class="capitalize">{{ social.platform }}</span>
            </UButton>
          </div>
          <p class="mt-6 text-muted">
            Or email me at
            <a href="mailto:hola@alvarosaburido.dev" class="text-primary hover:underline font-mono">hola@alvarosaburido.dev</a>
          </p>
        </section>
      </template>

      <!-- Sponsors Section -->
      <template v-if="page?.sponsors">
        <USeparator class="my-12" />
        <section class="not-prose">
          <h2 class="text-xl font-bold mb-4">Support my work</h2>
          <p class="text-muted mb-6">
            If my open source work has helped you, consider sponsoring me to keep the projects alive and growing.
          </p>
          <div class="flex flex-wrap gap-3">
            <UButton
              v-if="page.sponsors.github"
              :to="page.sponsors.github"
              target="_blank"
              rel="noopener noreferrer"
              variant="soft"
              color="primary"
              size="lg"
            >
              <UIcon name="i-simple-icons-githubsponsors" class="w-5 h-5" />
              <span>Sponsor me</span>
            </UButton>
            <UButton
              v-if="page.sponsors.tresjs"
              :to="page.sponsors.tresjs"
              target="_blank"
              rel="noopener noreferrer"
              variant="soft"
              color="primary"
              size="lg"
            >
              <UAvatar src="https://tresjs.org/favicon.svg" size="xs" class="mr-1" />
              <span>Sponsor TresJS</span>
            </UButton>
            <UButton
              v-if="page.sponsors.opencollective"
              :to="page.sponsors.opencollective"
              target="_blank"
              rel="noopener noreferrer"
              variant="soft"
              color="primary"
              size="lg"
            >
              <UIcon name="i-simple-icons-opencollective" class="w-5 h-5" />
              <span>Open Collective</span>
            </UButton>
          </div>
        </section>
      </template>
    </motion.article>
  </UContainer>
</template>

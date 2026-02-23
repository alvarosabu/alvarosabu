<script setup lang="ts">
 import { joinURL } from 'ufo'

 useState('toggleDarkModeEnabled', () => true)

const route = useRoute()

const site = useSiteConfig()

useHead({
  title: () => (route.meta.title as string) || '',
  titleTemplate: title => (title ? `${title} - AlvaroSabu` : 'AlvaroSabu'),
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ],
})

if (import.meta.server) {
  useHead({
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    htmlAttrs: {
      lang: 'en',
    },
  })

  useSeoMeta({
    ogSiteName: site.name,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: 'alvarosabu',
    twitterImage: joinURL(site.url, '/og.png'),
    twitterImageAlt: 'AlvaroSabu',
    twitterTitle: site.name,
    twitterDescription: site.description,
    ogImage: joinURL(site.url, '/og.png'),
    ogImageAlt: 'Alvaro Saburido\'s Portfolio',
    ogTitle: site.name,
    ogDescription: site.description,
    ogUrl: site.url,
  })

}
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

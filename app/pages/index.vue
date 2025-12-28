<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useHead({
  title: 'AlvaroSabu | Creative Engineer & Front-end Developer',
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
  title: 'AlvaroSabu | Creative Engineer',
  description: 'Welcome to my 3D planet. Alvaro Saburido personal portfolio',
  ogDescription: 'Welcome to my 3D planet. Alvaro Saburido personal portfolio',
  ogUrl: 'https://alvarosaburido.dev/',
  ogType: 'website',
  ogSiteName: 'AlvaroSabu',
  ogTitle: 'AlvaroSabu | Creative Engineer',
  ogImage: 'https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Home_oxyn5k.png',
  ogImageAlt: 'AlvaroSabu | Creative Engineer',
  twitterDescription: 'Welcome to my 3D planet. Alvaro Saburido personal portfolio',
  twitterTitle: 'AlvaroSabu | Creative Engineer',
  twitterImage: 'https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Home_oxyn5k.png',
  twitterImageAlt: 'AlvaroSabu | Creative Engineer',
  twitterCard: 'summary_large_image',
  keywords: 'portfolio, frontend, developer, web, nuxt, threejs, tres, vue, javascript, typescript, creative, engineer, alvaro, saburido',
})


</script>

<template>
  <div>
    <!-- Shader background -->
    <div class="fixed inset-0 z-10">
      <TresCanvas window-size :clear-color="'#f5f5f5'">
        <HomeBackgroundExperience />
      </TresCanvas>
    </div>

    <!-- Content overlay -->
    <div class="relative">
      <!-- Your content goes here -->
    </div>
  </div>
</template>

<style scoped></style>

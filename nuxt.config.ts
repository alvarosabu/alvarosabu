// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/content',
    '@tresjs/nuxt',
    'motion-v/nuxt',
    'nuxt-ssr-api-logger',
    'nuxt-shiki',
    '@todde.tv/gltf-type-toolkit',
  ],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'catppuccin-frappe',
        },
        remarkPlugins: {
          'remark-reading-time': {}
        },
      },
    }
  },
  routeRules: {
    '/': { prerender: true },
  },

  image: {
    format: ['webp', 'avif'],
  },
  
})
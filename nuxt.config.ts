// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui-pro',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/content',
    '@tresjs/nuxt',
    'motion-v/nuxt',
    'nuxt-ssr-api-logger',
    'nuxt-shiki',
    '@todde.tv/gltf-type-toolkit',
  ],
  uiPro: {
    license: process.env.NUXT_UI_PRO_LICENSE
  },

  routeRules: {
    '/': { prerender: true },
  },

  image: {
    format: ['webp', 'avif'],
  },
  // Enable HTTPS in development
  devServer: {
     https: true,
     port: 2590
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'catppuccin-macchiato',
        },
      },
    }
  },
})
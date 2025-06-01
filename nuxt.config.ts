// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: [
    'assets/css/main.css'
  ],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@tresjs/nuxt',
    '@storyblok/nuxt',
    'motion-v/nuxt',
    'nuxt-ssr-api-logger'
  ],
  storyblok: {
    accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  },
  // Enable HTTPS in development
  devServer: {
    https: true
  },
  // Runtime config with environment variables
  runtimeConfig: {
    // Private keys are only available on the server
    storyblokAccessToken: process.env.STORYBLOK_ACCESS_TOKEN,
    public: {
      storyblokVersion: process.env.STORYBLOK_VERSION || 'published',
    }
  },
})
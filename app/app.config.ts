export default defineAppConfig({
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width' },
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    ],
    htmlAttrs: {
      lang: 'en',
    },
  },
  ui: {
    primary: 'green',
    neutral: 'neutral',
    fonts: {
      default: {
        sans: 'Inter',
        display: 'Gilroy',
        mono: 'Fira Code',
        serif: 'Inter',
      }
    }
  },
}) 
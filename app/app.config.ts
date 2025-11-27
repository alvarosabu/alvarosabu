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
    colors: {
      primary: 'neutral',
      neutral: 'neutral',
    },
    fonts: {
      default: {
        sans: 'Inter',
        display: 'Inter',
        mono: 'JetBrains Mono',
        serif: 'Inter',
      }
    }
  },
  uiPro: {
    prose: {
      pre: {
        slots: {
          base: 'group font-mono text-sm/6 border border-muted bg-gray-600 dark:bg-muted rounded-md px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none'
        }
      }
    }
  },
  
}) 
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
    icons: {
      light: 'i-iconoir-sun-light',
      dark: 'i-iconoir-half-moon',
    },
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
        pixel: 'Geist Pixel',
      }
    },
    // Force the catppuccin-frappe (dark) code theme in both light and dark site modes.
    // Shiki uses a single theme, so token colors are fixed dark-theme pastels; the surfaces
    // below match the frappe palette so contrast holds regardless of the site color mode.
    prose: {
      pre: {
        slots: {
          base: 'group font-mono text-sm/6 border border-[#414559] bg-[#303446] text-[#C6D0F5] rounded-md px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none',
          header: 'flex items-center gap-1.5 border border-[#414559] bg-[#292C3C] border-b-0 relative rounded-t-md px-4 py-3',
          filename: 'text-[#C6D0F5] text-sm/6',
        }
      }
    }
  },
})
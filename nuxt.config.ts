// https://nuxt.com/docs/api/configuration/nuxt-config
import { definePerson } from 'nuxt-schema-org/schema'
import { transformColorMentions } from './utils/transform-color-mentions'
import { transformGitHubMentions } from './utils/transform-github-mentions'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://alvarosabu.dev',
    name: 'AlvaroSabu',
    description: 'Creative Software Engineer. Author of TresJS.',
    logo: '/favicon.svg',
  },
  schemaOrg: {
    identity: definePerson({
      name: 'Alvaro Saburido',
      url: process.env.NUXT_PUBLIC_SITE_URL || 'https://alvarosabu.dev',
      image: `${process.env.NUXT_PUBLIC_SITE_URL || 'https://alvarosabu.dev'}/avatar.png`,
      jobTitle: 'Senior Software Engineer',
      description: 'Creative Software Engineer, open source mantainer, keynote speaker and author of TresJS.',
      worksFor: {
        '@type': 'Organization',
        name: 'Directus',
        url: 'https://directus.io',
      },
      memberOf: {
        '@type': 'Organization',
        name: 'TresJS',
        url: 'https://tresjs.org',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Universidad Católica Andrés Bello',
        url: 'https://ucab.edu.ve',
      },
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'Bachelor of Telecommunications Engineering',
        credentialCategory: 'BachelorDegree',
        credentialName: 'Bachelor of Telecommunications Engineering',
        credentialDescription: 'Bachelor of Telecommunications Engineering',
        credentialUrl: 'https://ucab.edu.ve',
        credentialIssuer: {
          '@type': 'Organization',
          name: 'Universidad Católica Andrés Bello',
          url: 'https://ucab.edu.ve',
        },
      },
      knowsAbout: ['Vue.js', 'Nuxt', 'JavaScript', 'TypeScript', 'Open Source', 'Three.js', 'WebGPU', 'WebGL'],
      email: 'mailto:hola@alvarosaburido.dev',
      homeLocation: {
        '@type': 'Place',
        name: 'Spain',
        address: {
          '@type': 'PostalAddress',
          'addressCountry': 'ES',
          'addressRegion': 'Barcelona',
        },
      },
      sameAs: [
        'https://github.com/alvarosabu',
        'https://x.com/alvarosabu',
        'https://linkedin.com/in/alvarosaburido',
        'https://bsky.app/profile/alvarosabu.dev',
      ],
    }),
  },
  css: ['~/assets/styles/main.css'],
  declare: ['*.glsl'],
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
    '@nuxtjs/seo',
    'nuxt-studio',
    '@nuxt/hints',
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

  tres: {
    devtools: true,
    glsl: true,
  },

  hooks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'content:file:beforeParse': (ctx: any) => {
      const { file } = ctx
      if (file.extension === '.md') {
        transformColorMentions(file)
        transformGitHubMentions(file)
      }
    }
  },
  icon: {
    customCollections: [{
      prefix: 'as',
      dir: resolve('./app/assets/icons')
    }],
  }
})
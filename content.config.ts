import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        thumbnail: z.string(),
        tags: z.array(z.string()).optional(),
        date: z.string(),
      }),
    }),
    talks: defineCollection({
      type: 'page',
      source: 'talks/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        url: z.string(),
        event: z.object({
          name: z.string(),
          url: z.string(),
        }),
        media: z.string().optional(),
        slides: z.string().optional(),
        tags: z.array(z.string()),
      }),
    }),
  },
})
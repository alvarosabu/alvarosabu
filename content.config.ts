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
        status: z.enum(['draft', 'published']).default('draft'),
      }),
    }),
    talks: defineCollection({
      type: 'page',
      source: 'talks/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        url: z.string().optional(),
        event: z.object({
          name: z.string(),
          url: z.string(),
        }),
        location: z.string().optional(),
        media: z.string().optional(),
        slides: z.string().optional(),
        pdf: z.string().optional(),
        tags: z.array(z.string()),
      }),
    }),
  },
})
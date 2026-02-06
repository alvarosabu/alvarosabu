import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    me: defineCollection({
      type: 'page',
      source: 'me.md',
      schema: z.object({
        socials: z.array(z.object({
          platform: z.string(),
          url: z.string(),
        })),
        sponsors: z.object({
          github: z.string().optional(),
          tresjs: z.string().optional(),
          opencollective: z.string().optional(),
        }).optional(),
      }),
    }),
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
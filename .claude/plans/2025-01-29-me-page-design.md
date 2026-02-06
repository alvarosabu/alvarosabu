# /me Page Design

## Overview

Create a personal "about me" page at `/me` route, inspired by antfu.me but with unique typography-forward editorial styling. Content editable via markdown.

## Content Structure

**Sections:**
1. **Intro** - Punchy single lines: name, role, company (Directus), creator of TresJS
2. **Mission** - Prose paragraph about enabling creative web dev
3. **Interests/Background** - Prose about hobbies, location, cats
4. **Socials** - GitHub, Twitter/X, YouTube, Discord, LinkedIn
5. **Sponsors** - GitHub Sponsors link

**Visual direction:** Typography-forward, bold type hierarchy, editorial feel. Horizontal dividers between sections.

## Technical Design

### Files to Create/Modify

1. **content.config.ts** - Add `me` collection
2. **content/me.md** - Content file with frontmatter (socials, sponsors) + markdown body
3. **app/pages/me.vue** - Page component
4. **app/components/MagicLink.vue** - Add Directus and Blender to linksMap

### Content Schema (content.config.ts)

```ts
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
      opencollective: z.string().optional(),
    }).optional(),
  }),
}),
```

### Content File (content/me.md)

```markdown
---
socials:
  - platform: github
    url: https://github.com/alvarosabu
  - platform: twitter
    url: https://twitter.com/alvarosabu
  - platform: youtube
    url: https://youtube.com/@alvarosabu
  - platform: discord
    url: https://discord.gg/UCr96AQmWn
  - platform: linkedin
    url: https://linkedin.com/in/alvarosaburido
sponsors:
  github: https://github.com/sponsors/alvarosabu
---

# Hey, I'm Alvaro

Creative Software Engineer

Working at :magic-link{label="Directus"}

Creator of :magic-link{label="TresJS"} - bringing 3D to :magic-link{label="Vue"}

---

I believe the web should be a canvas for creativity. My goal is enabling developers to build the creative stuff they dream of but never thought was possible. I write, speak at conferences, and make videos about creative web development.

---

When not coding, you'll find me diving into underwater worlds (literally - scuba diving), carving down snowy mountains, or getting lost in :magic-link{label="Blender"} building 3D worlds. I also enjoy photography, gaming, and traveling whenever I can.

I share my life in Terrassa, Barcelona with two cats: **Geralt** (yes, the Witcher) and **Mochi** (the Japanese dessert). Originally from Venezuela 🇻🇪
```

### Page Component (app/pages/me.vue)

- Use `queryCollection('me').first()` to fetch content
- `<ContentRenderer>` for markdown body with MDC support
- Render socials as icon buttons (UButton with icons)
- Render sponsors section
- Typography: large headings, prose for paragraphs, generous spacing
- Horizontal dividers between sections

### MagicLink Updates

Add to linksMap:
```ts
'Directus': 'https://directus.io',
'Blender': 'https://www.blender.org',
```

## Implementation Tasks

1. [ ] Add Directus and Blender to MagicLink linksMap
2. [ ] Add `me` collection to content.config.ts
3. [ ] Create content/me.md with content
4. [ ] Create app/pages/me.vue with:
   - Content fetching
   - Typography styling (editorial, bold headings)
   - Socials section with platform icons
   - Sponsors section
5. [ ] Test MDC components render correctly
6. [ ] Verify responsive design

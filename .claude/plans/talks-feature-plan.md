# Talks Feature Implementation Plan

**Reference**: https://antfu.me/talks
**Goal**: Create a talks section with list and detail pages, styled similar to `/pages/blog`, organized by topic

## Current State Analysis

### What Exists
- ✅ Content collection defined in `content.config.ts`
- ✅ Navigation link in `TheHeader.vue`
- ✅ One example talk: `content/talks/tresjs-vuejs-amsterdam-2024.md`
- ✅ Basic schema with title, description, date, url, event, media, slides, tags

### What's Missing
- ❌ Schema fields: `location`, `pdf` (for downloadable slides)
- ❌ `/app/pages/talks/index.vue` (listing page)

## Feature Requirements

### Talk Entry Should Display
1. **Title** - Main talk title
2. **Conference** - Event name (from `event.name`) + link to event website
3. **Date** - Formatted date (e.g., "Oct 25, 2024")
4. **Location** - City, Country (NEW FIELD needed)
5. **Description** - Brief summary
6. **Topic tags** - For organization and filtering
7. **Action buttons**:
   - 🎥 Watch (YouTube link from `url` field)
   - 📊 Slides (from `slides` field - web hosted)
   - 📄 PDF (NEW FIELD - downloadable slides)
8. **Optional**: Thumbnail/poster from `media` field

### Organization Strategy ✅ CONFIRMED
- **Primary**: Group by talk title (same talk, multiple conferences)
- **Secondary**: Sort conferences by date within each talk group (newest first)
- **Display**: Each talk title becomes a section header with conference entries below

**Example Structure**:
```
# The Subtle Art of 3D Scrollytelling
  → Vuejs Amsterdam 2024 · Oct 25 · Amsterdam [Watch] [Slides] [PDF]
  → VueConf US 2024 · May 15 · Miami, USA [Watch] [Slides]

# Building 3D Experiences with TresJS
  → Vue.js Nation 2024 · Jan 24 · Online [Watch]
```

## Implementation Steps

### 1. Update Content Schema
**File**: `content.config.ts`

Add new fields to talks collection:
```typescript
talks: defineCollection({
  type: 'page',
  source: 'talks/*.md',
  schema: z.object({
    // ... existing fields
    location: z.string().optional(), // NEW: "Tokyo, Japan"
    pdf: z.string().optional(),      // NEW: "/slides/talk-name.pdf"
    // ... rest
  }),
})
```

### 2. Update Existing Talk Content
**File**: `content/talks/tresjs-vuejs-amsterdam-2024.md`

Add missing frontmatter fields:
```yaml
location: "Amsterdam, Netherlands"
pdf: "/slides/tresjs-vuejs-amsterdam-2024.pdf"  # if available
```

### 3. Create Talks List Page ✅ CONFIRMED
**File**: `/app/pages/talks/index.vue`

**Key features**:
- Fetch all talks using `useAsyncData` + `queryCollection('talks')`
- Group by talk title (same talk presented at multiple conferences)
- Sort by date within each group (newest first)
- Display format similar to blog list but with:
  - Talk title as section header
  - Conference entries indented/nested below
  - Conference name, date, and location inline
  - Action buttons (Watch, Slides, PDF) - show only if links exist
  - Optional: Show description once per talk group (not per conference)
- Motion animations (consistent with blog page)
- SEO metadata (title, description, OG tags)
- Click "Watch" links directly to YouTube (no detail pages)

**UI Structure**:
```
[Talk Title as H2]
[Description - shown once]
  → [Conference Name] · [Date] · [Location]  [Watch] [Slides] [PDF]
  → [Conference Name] · [Date] · [Location]  [Watch] [Slides]
---
```

**Grouping Logic**:
```typescript
// Group talks by title
const talksByTitle = talks.reduce((acc, talk) => {
  if (!acc[talk.title]) acc[talk.title] = []
  acc[talk.title].push(talk)
  return acc
}, {})

// Sort conferences within each talk by date (newest first)
Object.values(talksByTitle).forEach(group => {
  group.sort((a, b) => new Date(b.date) - new Date(a.date))
})
```

### 4. Styling & Components ✅ CONFIRMED
**Approach**: Reuse blog styling patterns

- Color scheme: Use existing Nuxt UI Pro v3 colors
- Typography: Match blog headings and body text
- Action buttons: Create reusable `TalkActions.vue` component
- Topic badges: Style similar to blog tags
- Animations: Use Motion Framer Vue (consistent with blog)

### 5. Testing Checklist
- [ ] Content schema validation works with new `location` and `pdf` fields
- [ ] All talks render correctly on list page
- [ ] Talks are properly grouped by title
- [ ] Conferences are sorted by date within each group (newest first)
- [ ] Action buttons only show when URLs exist
- [ ] Links open correctly (YouTube, slides, PDF)
- [ ] YouTube links open in new tab
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] SEO metadata is correct
- [ ] Navigation link works from header
- [ ] Dark mode support
- [ ] Accessibility (keyboard navigation, screen readers, proper heading hierarchy)

## Remaining Questions

1. **PDF hosting** ✅ Needs confirmation:
   - Store slide PDFs in `/public/slides/` directory?
   - Naming convention: `{talk-slug}-{conference-slug}.pdf` or just `{talk-slug}.pdf`?
   - Should PDFs be versioned if slides are updated?

2. **Description handling**:
   - Should description be shown once per talk group?
   - Or once per conference entry (in case details differ)?
   - Recommended: Show once per talk group to reduce repetition

3. **Tags usage**:
   - Keep `tags` field for filtering/categorization (e.g., "Vue.js", "3D", "WebGL")?
   - Or remove if not needed since grouping is by title?
   - Recommended: Keep for potential filtering feature later

## File Changes Summary

```
Modified:
- content.config.ts                          (add location, pdf fields)
- content/talks/*.md                         (add new frontmatter: location, pdf)

Created:
- app/pages/talks/index.vue                  (listing page with grouping logic)
- app/components/talks/TalkGroup.vue         (talk group with conferences)
- app/components/talks/ConferenceEntry.vue   (single conference entry with actions)
- public/slides/                             (directory for PDF files)
```

## Reference Files
- Blog list: `/app/pages/blog/index.vue` (structure and animations)
- Blog detail: `/app/pages/blog/[slug].vue` (layout and SEO)
- Content config: `content.config.ts` (schema patterns)
- antfu.me/talks (UI inspiration)

---

## ✅ Implementation Summary

### What We're Building
A talks listing page that groups conference presentations by talk title, allowing you to showcase the same talk given at multiple events.

### Key Features
- Group talks by title (e.g., "The Subtle Art of 3D Scrollytelling")
- Show all conferences where each talk was presented
- Display: Conference, Date, Location for each entry
- Action buttons: Watch (YouTube), Slides (web), PDF (download)
- Direct links to videos (no detail pages)
- Similar styling to blog with Motion animations

### Files to Create/Modify
1. `content.config.ts` - Add `location` and `pdf` fields
2. `content/talks/*.md` - Update with new fields
3. `app/pages/talks/index.vue` - Main listing page
4. `app/components/talks/TalkGroup.vue` - Group component
5. `app/components/talks/ConferenceEntry.vue` - Conference entry
6. `public/slides/` - Directory for PDFs

### Open Questions
- PDF hosting location and naming convention?
- Show description once per group or per conference?
- Keep tags field for future filtering?

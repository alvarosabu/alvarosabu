# GitHub Mention Feature Design

**Created:** 2025-12-01
**Status:** Design Complete - Ready for Implementation

## Overview

A GitHub mention system that transforms `{@username}` or `{@username | Custom Label}` in markdown into clickable badges with GitHub avatars.

## Requirements

- **Syntax:** `{@username}` or `{@username | label}`
- **Display:** Badge with GitHub avatar + username/label
- **Behavior:** Click opens GitHub profile in new tab
- **Scope:** GitHub only (no other platforms)
- **Integration:** Works with existing Nuxt Content + MDC setup

## Architecture

### Component Structure

1. **Content Hook Transformer** (`nuxt.config.ts`)
   - Uses `content:file:afterParse` hook
   - Calls transformation function for `.md` files
   - No local plugin packaging needed

2. **AST Transformation Function** (`utils/transform-github-mentions.ts`)
   - Parses markdown AST during content build
   - Finds `{@username}` or `{@username | label}` patterns using regex
   - Transforms into MDC component nodes
   - Handles multiple mentions per text node

3. **Vue Component** (`app/components/GitHubMention.vue`)
   - Receives `username` and optional `label` props
   - Renders UBadge (consistent with MagicLink style)
   - Avatar from `https://github.com/{username}.png`
   - Links to `https://github.com/{username}`

### Why This Approach

- Leverages existing MDC infrastructure
- Transformation at build time (no runtime overhead)
- Clean separation from MagicLink component
- No GitHub API calls (uses avatar CDN)
- Style consistency with Nuxt UI's UBadge
- Avoids local remark plugin limitations

## Implementation Details

### 1. Nuxt Configuration

**File:** `/nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  // ... existing config

  hooks: {
    'content:file:afterParse': (file) => {
      if (file._extension === 'md') {
        transformGitHubMentions(file)
      }
    }
  }
})
```

### 2. AST Transformation Logic

**File:** `/utils/transform-github-mentions.ts`

```typescript
import { visit } from 'unist-util-visit'

const MENTION_REGEX = /\{@([a-zA-Z0-9-]+)(?:\s*\|\s*([^}]+))?\}/g

export function transformGitHubMentions(file: any) {
  visit(file.body, 'text', (node, index, parent) => {
    const matches = [...node.value.matchAll(MENTION_REGEX)]

    if (matches.length === 0) return

    // Split the text node into parts:
    // text before -> component -> text after
    // Handle multiple mentions in same text node

    const newNodes = []
    let lastIndex = 0

    for (const match of matches) {
      // Add text before mention
      if (match.index > lastIndex) {
        newNodes.push({
          type: 'text',
          value: node.value.slice(lastIndex, match.index)
        })
      }

      // Add MDC component node
      newNodes.push({
        type: 'mdxJsxTextElement',
        name: 'github-mention',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'username', value: match[1] },
          ...(match[2] ? [{ type: 'mdxJsxAttribute', name: 'label', value: match[2].trim() }] : [])
        ]
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < node.value.length) {
      newNodes.push({
        type: 'text',
        value: node.value.slice(lastIndex)
      })
    }

    // Replace the original text node with new nodes
    parent.children.splice(index, 1, ...newNodes)
  })
}
```

**Key Decisions:**
- Regex allows alphanumeric usernames and hyphens (standard GitHub usernames)
- Preserves whitespace around pipes in labels
- Handles multiple mentions per text node
- Does not validate username existence (fails gracefully with 404 avatar)

### 3. Vue Component

**File:** `/app/components/GitHubMention.vue`

```vue
<script setup lang="ts">
interface Props {
  username: string
  label?: string
}

const props = defineProps<Props>()

const avatarUrl = computed(() => `https://github.com/${props.username}.png`)
const profileUrl = computed(() => `https://github.com/${props.username}`)
const displayLabel = computed(() => props.label || `@${props.username}`)
</script>

<template>
  <a
    :href="profileUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="github-mention not-prose"
  >
    <UBadge
      :label="displayLabel"
      :avatar="{ src: avatarUrl, class: 'm-0!' }"
      variant="soft"
      color="neutral"
      size="sm"
      class="translate-y-0.5 rounded-full"
    />
  </a>
</template>
```

**Component Details:**
- `not-prose` class prevents Tailwind typography from styling the badge
- `translate-y-0.5` aligns badge vertically with surrounding text (matches MagicLink)
- Default label shows `@username` if no custom label provided
- Uses same UBadge styling as existing MagicLink for consistency

## Files to Create/Modify

### Create
- `/utils/transform-github-mentions.ts` - AST transformation function
- `/app/components/GitHubMention.vue` - Vue component

### Modify
- `/nuxt.config.ts` - Add content hook

### No Changes Required
- Existing blog posts
- `[slug].vue` page
- `content.config.ts`

## Dependencies

- `unist-util-visit` - For AST traversal (should already be available with Nuxt Content)
- No additional npm packages required

## Testing Plan

### Manual Testing Checklist

Use existing test file: `/content/blog/my-test-blog-post.md`

Add these test cases to the "Inline MDC Examples" section:

```markdown
## GitHub Mentions Testing

Single mention: {@antfu}

Mention with label: {@alvarosabu | Alvaro Saburido}

Multiple mentions: Thanks to {@antfu} and {@yyx990803} for Vue!

Start of sentence: {@username} wrote this code.

End of sentence: This was written by {@username}

Inside bold: **Created by {@antfu}**

Whitespace variations: {@user|NoSpace} vs {@user | WithSpace}
```

View at: `http://localhost:2590/blog/my-test-blog-post`

### Test Cases

1. ✅ Single mention: `{@antfu}` → Badge with @antfu
2. ✅ Mention with label: `{@alvarosabu | Alvaro}` → Badge showing "Alvaro"
3. ✅ Multiple mentions: `Thanks {@antfu} and {@yyx990803}!` → Two badges
4. ✅ Start/end of paragraph: `{@username} wrote this.` and `Written by {@username}`
5. ✅ Inside other markdown: `**Bold {@username}**`
6. ✅ Whitespace variations: Both `{@user|label}` and `{@user | label}` work

### Edge Cases Handled

- **Invalid username** → Avatar returns GitHub's 404 default image
- **Whitespace variations** → Both `{@user|label}` and `{@user | label}` work
- **No label** → Falls back to `@username`
- **Mention in code block** → Not transformed (code blocks are separate AST nodes)

### Edge Cases NOT Handled (Acceptable)

- **Escaped mentions** `\{@username}` → Will still transform (requires more complex regex)
- **Non-GitHub usernames** → No validation, just shows what you type

### Styling Verification

- Check badge alignment with surrounding text
- Verify avatar loads correctly
- Test in light/dark mode
- Ensure `not-prose` prevents typography interference

## Example Transformations

| Markdown Input | Rendered Output |
|----------------|-----------------|
| `{@antfu}` | Badge: [avatar] @antfu → https://github.com/antfu |
| `{@alvarosabu \| Alvaro}` | Badge: [avatar] Alvaro → https://github.com/alvarosabu |
| `Thanks {@antfu}!` | "Thanks " + Badge + "!" |

## Future Enhancements (Out of Scope)

- Support for repository mentions: `{@user/repo}`
- Support for other platforms (Twitter, LinkedIn)
- Hover preview of GitHub profile
- Cache GitHub avatars locally
- Validate usernames against GitHub API

## References

- Similar implementation: [markdown-it-magic-link](https://github.com/antfu/markdown-it-magic-link)
- GitHub Avatar API: `https://github.com/{username}.png`
- Nuxt Content hooks: [Documentation](https://content.nuxt.com/docs/getting-started/configuration)
- MDC Syntax: [Nuxt Content MDC](https://content.nuxt.com/docs/files/markdown)

---
title: My Test Blog Post
description: This is a test blog post
status: draft
date: 2021-01-01
thumbnail: https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Blog_oet7tv.png
---

This is a comprehensive test blog post to showcase various markdown elements and formatting options.

## Headings

### Level 3 Heading
#### Level 4 Heading
##### Level 5 Heading
###### Level 6 Heading

## Text Formatting

This paragraph contains **bold text**, *italic text*, ***bold and italic text***, and ~~strikethrough text~~.

You can also use `inline code` within sentences, and create [links to external sites](https://vuejs.org) or [internal links](/blog).

## Lists

### Unordered List
- First item
- Second item with a [link](https://nuxt.com)
- Third item
  - Nested item
  - Another nested item
    - Deeply nested item

### Ordered List
1. First numbered item
2. Second numbered item
3. Third numbered item
   1. Nested numbered item
   2. Another nested numbered item

### Task List
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Code Blocks

### JavaScript Example
```js
// Example Vue 3 Composition API
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
```

### TypeScript Example
```typescript
interface User {
  id: number
  name: string
  email: string
  isActive?: boolean
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', isActive: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

function getActiveUsers(users: User[]): User[] {
  return users.filter(user => user.isActive ?? false)
}
```

### Vue SFC Example
```vue
<template>
  <div class="counter">
    <h2>Count: {{ count }}</h2>
    <button @click="increment" class="btn-primary">
      Increment
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<style scoped>
.counter {
  @apply text-center p-6 rounded-lg bg-gray-100 dark:bg-gray-800;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
}
</style>
```

::code-group

```bash [pnpm]
pnpm add @nuxt/ui-pro
```

```bash [yarn]
yarn add @nuxt/ui-pro
```

```bash [npm]
npm install @nuxt/ui-pro
```

```bash [bun]
bun add @nuxt/ui-pro
```

::

## Blockquotes

> This is a simple blockquote.

> This is a multi-line blockquote.
> It spans multiple lines and can contain **formatting**.
> 
> It can even contain multiple paragraphs.

> ### Blockquote with heading
> This blockquote contains a heading and other elements.
> - List item in blockquote
> - Another list item

## Tables

| Feature | Vue 3 | React | Svelte |
|---------|-------|-------|--------|
| Bundle Size | Small | Medium | Smallest |
| Learning Curve | Easy | Medium | Easy |
| Performance | Excellent | Good | Excellent |
| TypeScript | ✅ | ✅ | ✅ |
| SSR Support | ✅ | ✅ | ✅ |

## Images

![Vue.js Logo](https://vuejs.org/images/logo.png)

![Alt text with caption](https://picsum.photos/1280/720?random=1 "Random image from Picsum")

## Horizontal Rules

Content above the horizontal rule.

---

Content below the horizontal rule.

## Inline HTML

You can also use <mark>highlighted text</mark> and other HTML elements like <kbd>Ctrl</kbd> + <kbd>C</kbd> for keyboard shortcuts.

<details>
<summary>Click to expand</summary>

This content is hidden by default and can be expanded by clicking the summary.

```bash
# You can even put code blocks inside details
npm install @nuxt/content
```

</details>

## Mathematical Expressions (if supported)

Inline math: $E = mc^2$

Block math:
$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$

## Footnotes

This text has a footnote[^1] and another one[^2].

[^1]: This is the first footnote.
[^2]: This is the second footnote with a [link](https://nuxt.com).

## Image Carousel

::image-carousel
![Image 1](https://picsum.photos/1280/720?random=1 "Caption 1")
![Image 2](https://picsum.photos/1280/720?random=2 "Caption 2")
![Image 3](https://picsum.photos/1280/720?random=3 "Caption 3")
![Image 4](https://picsum.photos/1280/720?random=4 "Caption 4")
![Image 5](https://picsum.photos/1280/720?random=5 "Caption 5")
![Image 6](https://picsum.photos/1280/720?random=6 "Caption 6")
![Image 7](https://picsum.photos/1280/720?random=7 "Caption 7")
![Image 8](https://picsum.photos/1280/720?random=8 "Caption 8")
![Image 9](https://picsum.photos/1280/720?random=9 "Caption 9")
![Image 10](https://picsum.photos/1280/720?random=10 "Caption 10")
::

## Inline MDC Examples

This is a paragraph with a :magic-link{label="TresJS"} would it work?

## GitHub Mentions Testing

Single mention: {@antfu}

Mention with label: {@alvarosabu | Alvaro Saburido}

Multiple mentions: Thanks to {@antfu} and {@yyx990803} for Vue!

Start of sentence: {@antfu} wrote this code.

End of sentence: This was written by {@alvarosabu}

Inside bold: **Created by {@antfu}**

Whitespace variations: {@antfu|NoSpace} vs {@antfu | WithSpace}

Manual mdc example: :github-mention{username="antfu"} and :magic-link{label="TresJS"}

## Conclusion

This test blog post demonstrates various markdown elements including:

- **Headings** at different levels
- **Text formatting** (bold, italic, strikethrough)
- **Lists** (ordered, unordered, task lists)
- **Code blocks** with syntax highlighting
- **Blockquotes** with nested content
- **Tables** with alignment
- **Images** with alt text and captions
- **Links** both external and internal
- **HTML elements** for enhanced formatting

Perfect for testing your markdown rendering and styling! 🚀
# Alvaro Saburido's Website

Alvaro Saburido's personal website.

- Discover what I've been working on
- Discover articles I've written
- Get in touch with me

This website serves as a portfolio of my work and a place to share my thoughts and ideas.


## Standards

- Stack: Vue.js, TypeScript, TailwindCSS v4, Vue Router, Nuxt UI Pro v3, TresJS, Motion Framer Vue.
- ALWAYS Keep types alongside your code, use TypeScript for type safety, prefer `interface` over `type` for defining types
- Keep unit and integration tests alongside the file they test: `src/ui/Button.vue` + `src/ui/Button.spec.ts`
- ALWAYS use TailwindCSS classes rather than manual CSS
- DO NOT hard code colors, use Nuxt UI Pro v3's Tailwind's color system unless it is used on TresJS components
- ONLY add meaningful comments that explain why something is done, not what it does
- Dev server is already running on `https://localhost:2590` with HMR enabled. NEVER launch it yourself
- ALWAYS use named functions when declaring methods, use arrow functions only for callbacks
- ALWAYS prefer named exports over default exports

## Project structure

Below is the current structure of this repository. Use it as a reference for finding files and understanding the organization of the project.

```
app/                          # Main Nuxt 4 app directory
├── app.config.ts             # Nuxt app configuration
├── app.vue                   # Root Vue component
├── assets/
│   ├── models/
│   │   ├── chamo/            # Character model and textures
│   │   │   ├── Chamo.glb
│   │   │   ├── Chamo.glb.d.ts
│   │   │   ├── Chamo.glb.js
│   │   │   └── textures/     # Character texture files
│   │   ├── Planet.glb        # Planet 3D model
│   │   ├── Planet.glb.d.ts
│   │   └── Planet.glb.js
│   └── styles/
│       └── main.css          # Main CSS file (TailwindCSS entry)
├── components/
│   ├── CodeBlock.vue         # Code syntax highlighting component
│   ├── home/
│   │   ├── CameraController.vue
│   │   ├── Experience.vue    # Main 3D experience component
│   │   ├── Hero.vue          # Hero section component
│   │   └── Planet.vue        # Planet 3D component
│   ├── MagicLink.vue         # Enhanced link component
│   ├── test/                 # Test components
│   │   ├── Character.vue
│   │   └── Experience.vue
│   ├── TheHeader.vue         # Main header component
│   └── TheLogo.vue           # Logo component
├── layouts/
│   └── default.vue           # Default layout for Nuxt
├── pages/
│   ├── blog/
│   │   ├── [slug].vue        # Dynamic blog post pages
│   │   └── index.vue         # Blog listing page
│   ├── index.vue             # Home page
│   └── test-character/
│       └── index.vue         # Character test page
content/
├── blog/                     # Blog post markdown files
└── talks/                    # Talk markdown files
public/                       # Public static files (favicons, robots.txt, static images, etc.)
├── avatar.png                # Profile avatar
├── favicon.ico
├── favicon.svg
├── models/                   # 3D models and type definitions
│   ├── Chamo-2.glb
│   ├── Chamo-2.glb.d.ts
│   ├── Chamo-2.glb.js
│   ├── Planet-flat-2.glb
│   ├── Planet-flat-2.glb.d.ts
│   ├── Planet-flat-2.glb.js
│   ├── Planet-flat.glb
│   ├── Planet-flat.glb.d.ts
│   ├── Planet-flat.glb.js
│   ├── Planet.glb
│   ├── Planet.glb.d.ts
│   └── Planet.glb.js
└── robots.txt
server/
└── tsconfig.json             # Server-side TypeScript config
content.config.ts             # Content module configuration
nuxt.config.ts                # Nuxt configuration
package.json                  # Project manifest
pnpm-lock.yaml                # pnpm lockfile
README.md                     # Project readme
tsconfig.json                 # Root TypeScript config
eslint.config.mjs             # ESLint configuration
```

## Project Commands

Frequently used commands for this project

- `pnpm dev`: Start the Nuxt development server (http://localhost:3000)
- `pnpm build`: Bundle the project for production
- `pnpm generate`: Generate a static version of the site
- `pnpm preview`: Preview the production build locally
- `pnpm install`: Install dependencies (runs `nuxt prepare` automatically after install)
- `pnpm lint`: Lint the codebase
- `pnpm lint:fix`: Fix linting errors

## Development Workflow

ALWAYS follow the workflow when implementing a new feature or fixing a bug in this project. This ensures consistency, quality, and maintainability of the codebase.

1. Plan your tasks, review them with user. Include tests when possible
2. Write code, following the [project structure](#project-structure) and [conventions](#standards)
3. Stage your changes with `git add` once a feature works
4. Review changes and analyze the need of refactoring

## TresJS v5 Essentials

### Core Patterns
- **ALWAYS USE** `useLoop()` for animations (not `useRenderLoop`)
- **ALWAYS USE** `useTres()` for context
- **ALWAYS USE** `@pointerenter` not `@pointer-enter` for events
- **ALWAYS SEPARATE** DOM components from 3D scene components

### Component Architecture
```vue
<!-- Scene3D.vue: TresCanvas + DOM siblings -->
<template>
  <TresCanvas window-size @ready="onReady">
    <TheExperience />
  </TresCanvas>
</template>

<!-- TheExperience.vue: 3D scene root -->
<script setup>
const { onBeforeRender } = useLoop()
const { scene, camera } = useTres()
</script>
```

### Asset Loading (v5)
```vue
<script setup>
const { state: model, isLoading, error } = useLoader(GLTFLoader, '/model.glb')
</script>
<template>
  <primitive v-if="model?.scene && !isLoading" :object="model.scene" />
</template>
```

## Research & Documentation

- **NEVER hallucinate or guess URLs**
- ALWAYS try accessing the `llms.txt` file first to find relevant documentation. EXAMPLE: `https://ui.nuxt.com/llms.txt`
  - If it exists, it will contain other links to the documentation for the LLMs used in this project
- ALWAYS follow existing links in table of contents or documentation indices
- Verify examples and patterns from documentation before using

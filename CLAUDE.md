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
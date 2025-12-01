<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Blog',
    to: '/blog',
  },
  {
    label: 'Talks',
    to: '/talks',
  },
  {
    label: 'Projects',
    to: '/projects',
  },
  {
    label: 'Photography',
    to: '/photography',
  },
]
</script>

<template>
  <header class="pt-5 flex items-baseline justify-between">
    <TheLogo class="-ml-16" />

    <UNavigationMenu class="mr-16" :items="items" orientation="horizontal" />
  </header>
</template>

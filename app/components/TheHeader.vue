<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const isVisible = computed(() => {
  return  y.value < 10
})

const toggleDarkModeEnabled = useState('toggleDarkModeEnabled')

const headerLinks: NavigationMenuItem[] = [
  {
    label: 'Blog',
    to: '/blog',
  },
  {
    label: 'Talks',
    to: '/talks',
  },
  {
    label: 'Me',
    to: '/me',
  },
  /* {
    label: 'Projects',
    to: '/projects',
  },
  {
    label: 'Photography',
    to: '/photography',
  }, */
]
</script>

<template>
  <UHeader
:ui="{ 
    container: 'max-w-none px-4 sm:px-0 items-baseline ',
    root: 'bg-transparent border-none h-auto sticky-none backdrop-blur-none',
    title: '-ml-20 lg:-ml-24',
    header: ''
   }">
    <template #title>
      <TheLogo />
    </template>
    <UNavigationMenu v-if="isVisible" :items="headerLinks" class="font-pixel" />

    <template #right>
      <UColorModeButton v-if="toggleDarkModeEnabled" />

<!--       <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/Tresjs"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip> -->
    </template>
    <template #body>
      <UNavigationMenu :items="headerLinks" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
 <!--  <header class="pt-5 flex items-baseline justify-between">
    <TheLogo class="-ml-16" />

    <div>
      <UNavigationMenu class="mr-16" :items="headerLinks" orientation="horizontal" />
      <UColorModeButton />
    </div>
  </header>
  <div>
    <UNavigationMenu :items="headerLinks" orientation="vertical" class="-mx-2.5" />
  </div> -->
</template>

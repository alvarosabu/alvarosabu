<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Blog',
    to: '/blog',
  },
  {
    label: 'Projects',
    to: '/projects',
  },
])

const isMobileMenuOpen = ref(false)
</script>

<template>
  <header class="flex h-[72px] fixed top-0 left-0 right-0 z-50" >
    <UContainer class="flex items-center justify-between">
      <TheLogo />
      <UNavigationMenu :items="items" class="w-full justify-end hidden md:flex" orientation="horizontal" />

        <UButton icon="i-lucide-menu" color="neutral" variant="ghost" class="md:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen" />
      </UContainer>
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="isMobileMenuOpen"
            class="fixed top-[72px] h-screen left-0 w-full bg-white dark:bg-gray-900 z-50 p-4 sm:hidden shadow"
          >
            <UNavigationMenu :items="items" orientation="vertical" />
          </div>
        </Transition>
      </Teleport>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

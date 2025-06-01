<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useScroll } from '@vueuse/core'
import { useRoute } from 'vue-router'

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

// Track scroll position
const { y } = useScroll(window)
const route = useRoute()
const hasScrolled = computed(() => y.value > 0)
const shouldShowBackground = computed(() => hasScrolled.value && route.path !== '/')

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

</script>

<template>
  <header 
    class="flex h-(--ui-header-height) fixed top-0 left-0 right-0 z-50 sticky transition-colors duration-200 transition-all duration-300"
    :class="{ 'bg-(--ui-bg)/80 backdrop-blur-lg': shouldShowBackground, 'bg-transparent': !shouldShowBackground }"
  >
    <UContainer class="flex items-center justify-between">
      <TheLogo />
      <div class="flex items-center justify-end gap-2">
        <UNavigationMenu :items="items" class="w-full justify-end hidden md:flex" orientation="horizontal"/>
        <ul class="flex items-center gap-2">
          <li>
            <UButton icon="i-lucide-github" color="neutral" variant="ghost" to="https://github.com/alvarosabu" target="_blank" />
          </li>
          <li v-if="colorMode.preference !== 'system'">
            <USwitch v-model="isDark" class="cursor-pointer" unchecked-icon="i-lucide-sun" checked-icon="i-lucide-moon" color="neutral" variant="ghost" aria-label="Change site theme" />
          </li>
        </ul>
        <UButton icon="i-lucide-menu" color="neutral" variant="ghost" class="md:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen" />
      </div>
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

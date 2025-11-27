<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const router = useRouter()
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
  <div class="p-4 md:p-8 lg:p-16 min-h-screen">
    <header class="fixed top-0 left-0 right-0 z-50 pt-20 px-4 md:px-8 lg:px-16 flex items-baseline justify-between">
      <TheLogo class="-ml-16" />
      
      <UNavigationMenu class="mr-16" :items="items" orientation="horizontal" />

    </header>
    <div class="border border-gray-800 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)] flex flex-col">
      <!-- Header -->
      

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="flex items-end justify-between p-6 md:p-8">
        <UButton color="neutral" variant="link" class="font-mono text-sm md:text-base cursor-pointer" @click="router.back()">
          cd ../
        </UButton>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>

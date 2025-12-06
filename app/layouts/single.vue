<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="p-4 md:p-8 xl:p-16 min-h-screen">
    <div class="bordered-container min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)] flex flex-col">
      <TheHeader />
      

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

<script setup lang="ts">
  const router = useRouter()

</script>

<template>
  <div class="p-4 md:p-8 xl:p-12 min-h-screen relative z-1">
    <div class="bordered-container min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)] flex flex-col">
      <TheHeader />
      

      <!-- Main Content -->
      <main class="flex-1">
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

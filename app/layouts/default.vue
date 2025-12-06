<script setup lang="ts">
</script>

<template>
  <div class="p-4 md:p-8 xl:p-12 min-h-screen">
    <div class="bordered-container min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)] flex flex-col">
      <TheHeader />
      

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="flex items-end justify-between p-6 md:p-8">
        <!-- <div class="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
          CREATIVE<br>SOFTWARE ENGINEER
        </div>
        <div class="text-sm md:text-base">
          00/07
        </div> -->
      </footer>
    </div>
  </div>
</template>

<style scoped></style>

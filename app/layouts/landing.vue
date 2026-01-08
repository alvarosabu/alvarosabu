<script setup lang="ts">
  const experimentNumber = useState('experimentNumber', () => 0)
</script>

<template>
  <div class="p-4 md:p-8 xl:p-16 min-h-screen">
    <div class="bordered-container relative z-1 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)] flex flex-col">
      <TheHeader />


      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="flex items-end justify-between p-6 md:p-8 z-1">
        <div class="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
          <MutatingText text="CREATIVE" /><br><MutatingText text="SOFTWARE ENGINEER" />
        </div>
        <div class="text-sm md:text-base font-mono">
          0{{ experimentNumber }}/07
        </div>
      </footer>
    </div>
  </div>
</template>

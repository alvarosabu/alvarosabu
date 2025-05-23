<script setup lang="ts"></script>

<template>
    <div class="min-h-screen noise noise-subtle pt-[72px]">
    <!-- Header Component -->
    <TheHeader />
    
    <!-- Main Content -->
    <main class="py-8">
      <UContainer>
        <slot />
      </UContainer>
    </main>
  </div>
</template>

<style scoped></style>

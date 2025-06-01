<script setup lang="ts"></script>

<template>
    <div class="min-h-screen noise noise-subtle dark:noise-minimal">
    <!-- Header Component -->
    <TheHeader />
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped></style>

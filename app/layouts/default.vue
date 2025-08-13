<script setup lang="ts"></script>

<template>
    <div>
    <!-- Header Component -->
    <TheHeader />
    
    <!-- Main Content -->
    <main class="min-h-[calc(100vh-var(--ui-header-height))] pt-36 relative">
      <slot />
    </main>
  </div>
</template>

<style scoped></style>

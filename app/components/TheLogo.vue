<script setup lang="ts">
const name = ref('Alvaro')
const lastName = ref('Sabu')
</script>

<template>
  <NuxtLink to="/" class="flex items-center font-extrabold font-display">
    <img src="/avatar.png" class="w-10 h-10 rounded-full mr-2" >
    <span
      class="mr-1 sm:inline-block"
    >{{ `<${name}` }}</span>
    <span
      class="text-primary-500"
    >{{ lastName }}</span>
    <span
    >{{ '/>' }}</span>
    <span class="sr-only"> Go to home page</span>
  </NuxtLink>
</template>

<style scoped></style>

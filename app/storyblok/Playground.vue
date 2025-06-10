<script setup lang="ts">
defineProps({
  blok: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <iframe :src="blok.url.url" height="550" class="w-full rounded"/>
</template>

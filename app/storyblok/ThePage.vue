<script setup lang="ts">
import type { ThePage } from '../../.storyblok/types/340167/storyblok-components'

defineProps<{
  blok: ThePage
}>()
</script>
<template>
  <div v-editable="blok">
    <StoryblokComponent v-for="item in blok.body" :key="item._uid" :blok="item" />
  </div>
</template>
 
<script setup lang="ts">
import type { HomeHero } from '../../.storyblok/types/340167/storyblok-components'

const { blok } = defineProps<{
  blok: HomeHero;
}>();

const resolvers = {
  [BlockTypes.EMOJI]: (node: {
    attrs: {
      emoji: string
    }
  }) => {
    return node.attrs.emoji
  }
}
</script>

<template>
  <UContainer class="grid grid-cols-1 md:grid-cols-2 items-center justify-center h-screen">
    <div class="prose">
      <StoryblokRichText 
        v-if="blok.content" 
        class="font-display" 
        :doc="blok.title" 
        :resolvers="resolvers"
      />
   
      <StoryblokRichText 
        v-if="blok.content" 
        :doc="blok.content" 
        :resolvers="resolvers"
      />
    </div>
  </UContainer>
</template>

<style scoped></style>

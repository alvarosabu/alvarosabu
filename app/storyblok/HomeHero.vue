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
  <UContainer class="grid grid-cols-1 md:grid-cols-2 items-center justify-center h-dvh">
    <div class="prose dark:prose-invert">
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"

        :transition="{ duration: 0.8, ease: 'easeOut', delay: 3 }"
        class="flex flex-col gap-16">
        <StoryblokRichText 
          v-if="blok.title" 
          class="font-display" 
          :doc="blok.title" 
          :resolvers="resolvers"
        />
      </Motion>
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, ease: 'easeOut', delay: 3.2 }"
        class="flex flex-col gap-16">
        <StoryblokRichText 
          v-if="blok.content" 
          class="font-display" 
          :doc="blok.content" 
          :resolvers="resolvers"
        />
      </Motion>
    </div>
  </UContainer>
</template>

<style scoped></style>

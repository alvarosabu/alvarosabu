<script setup lang="ts">
const story = await useStoryblok('home', { version: 'draft' });
</script>

<template>
  <div>
    <TresCanvas window-size alpha :premultiplied-alpha="false">
      <HomeExperience />
    </TresCanvas>
    <StoryblokComponent v-if="story" :blok="story.content" />
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
defineProps<{
  caption?: string
}>()
</script>

<template>
  <figure class="w-full">
    <div class="relative rounded-lg overflow-hidden border-1 border-muted dark:border-transparent">
      <ClientOnly>
        <div class="aspect-video">
          <slot />
        </div>
      </ClientOnly>
    </div>
    <figcaption v-if="caption" class="mt-2 text-center text-sm text-muted">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  title?: string
  caption?: string
  // Skip the click-to-load placeholder and mount the iframe immediately
  eager?: boolean
}>(), {
  eager: false,
})

const isLoaded = ref(props.eager)

// Shown on the placeholder so readers know where the iframe points before it loads.
const hostname = computed(() => {
  try {
    return new URL(props.src).hostname.replace(/^www\./, '')
  }
  catch {
    return props.src
  }
})

function load() {
  isLoaded.value = true
}
</script>

<template>
  <figure class="w-full">
    <div class="relative aspect-video rounded-lg overflow-hidden border-1 border-muted dark:border-transparent">
      <iframe
        v-if="isLoaded"
        :src
        :title="title || hostname"
        class="absolute inset-0 size-full"
        frameborder="0"
        loading="lazy"
        allow="accelerometer; clipboard-write; fullscreen; gyroscope; xr-spatial-tracking"
        allowfullscreen
      />
      <!-- Click-to-load keeps heavy embeds (WebGPU editors, etc.) idle until the reader asks for them -->
      <button
        v-else
        type="button"
        :aria-label="`Load embed${title ? `: ${title}` : ''}`"
        class="group absolute inset-0 flex size-full cursor-pointer flex-col items-center justify-center gap-3 bg-elevated transition-colors hover:bg-accented"
        @click="load"
      >
        <span class="flex size-16 items-center justify-center rounded-full bg-default shadow-sm transition-transform group-hover:scale-110">
          <UIcon name="i-lucide-globe" class="size-7 text-primary" />
        </span>
        <span v-if="title" class="text-base font-medium text-highlighted">
          {{ title }}
        </span>
        <span class="text-sm text-muted">
          Click to load {{ hostname }}
        </span>
      </button>
    </div>
    <figcaption v-if="caption" class="mt-2 text-center text-sm text-muted">
      {{ caption }}
    </figcaption>
  </figure>
</template>

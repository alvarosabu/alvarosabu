<script setup lang="ts">
const props = defineProps<{
  id: string
  title?: string
  caption?: string
}>()

const isPlaying = ref(false)

// maxresdefault isn't guaranteed for every video; hqdefault always exists.
const thumbnail = computed(() => `https://i.ytimg.com/vi/${props.id}/hqdefault.jpg`)
const embedSrc = computed(() => `https://www.youtube-nocookie.com/embed/${props.id}?autoplay=1&rel=0`)

function play() {
  isPlaying.value = true
}
</script>

<template>
  <figure class="w-full">
    <div class="relative aspect-video rounded-lg overflow-hidden border-1 border-muted dark:border-transparent">
      <iframe
        v-if="isPlaying"
        :src="embedSrc"
        :title="title || 'YouTube video player'"
        class="absolute inset-0 size-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
      <button
        v-else
        type="button"
        :aria-label="`Play video${title ? `: ${title}` : ''}`"
        class="group absolute inset-0 size-full cursor-pointer"
        @click="play"
      >
        <img
          :src="thumbnail"
          :alt="title || 'Video thumbnail'"
          loading="lazy"
          class="size-full object-cover"
        >
        <span class="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
        <span class="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 transition-transform group-hover:scale-110">
          <UIcon name="i-lucide-play" class="size-7 translate-x-0.5 text-white" />
        </span>
      </button>
    </div>
    <figcaption v-if="caption" class="mt-2 text-center text-sm text-muted">
      {{ caption }}
    </figcaption>
  </figure>
</template>

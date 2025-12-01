<script setup lang="ts">
interface Props {
  username: string
  label?: string
}

const props = defineProps<Props>()

const avatarUrl = computed(() => `https://github.com/${props.username}.png`)
const profileUrl = computed(() => `https://github.com/${props.username}`)
const displayLabel = computed(() => props.label || `${props.username}`)
</script>

<template>
  <a
    :href="profileUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="github-mention not-prose"
  >
    <UBadge
      :label="displayLabel"
      :avatar="{ src: avatarUrl, class: 'm-0!' }"
      variant="soft"
      color="neutral"
      class="translate-y-0.5 rounded-full"
    />
  </a>
</template>

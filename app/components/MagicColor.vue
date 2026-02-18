<script setup lang="ts">
interface Props {
  value: string
}

const props = defineProps<Props>()

const hexColor = computed(() => {
  const v = props.value.trim()
  // Numeric format: 0xFF5733 → #FF5733
  if (v.startsWith('0x') || v.startsWith('0X')) {
    return `#${v.slice(2).toUpperCase()}`
  }
  // Already hex
  if (v.startsWith('#')) {
    return v.toUpperCase()
  }
  // Raw numeric string → treat as hex
  return `#${v.toUpperCase()}`
})
</script>

<template>
  <span class="magic-color not-prose inline-flex">
    <UBadge
      class="translate-y-0.5 rounded-full font-mono"
      :label="hexColor"
      variant="soft"
      color="neutral"
      size="sm"
    >
      <template #leading>
        <span
          class="size-3 rounded-full ring-1 ring-black/10 dark:ring-white/10 shrink-0"
          :style="{ backgroundColor: hexColor }"
        />
      </template>
    </UBadge>
  </span>
</template>

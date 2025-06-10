<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

const props = defineProps<{
  lang: string;
  code: string;
}>();

const { copy, isSupported, copied } = useClipboard({ source: props.code })

const toast = useToast()

watch(copied, (value) => {
  if (value) {
    toast.add({
      title: 'Copied to clipboard',
      description: 'The code has been copied to your clipboard',
    })
  }
})
</script>
<template>
  <div class="relative">
    <UButton
      :disabled="!isSupported"
      :icon="copied ? 'i-heroicons-check-circle' : 'i-heroicons-clipboard-document'"
      variant="ghost"
      class="absolute top-2 right-2 cursor-pointer"
      @click="copy(props.code)"
    />
    <Shiki :lang="lang" :code="code" />
  </div>
</template>
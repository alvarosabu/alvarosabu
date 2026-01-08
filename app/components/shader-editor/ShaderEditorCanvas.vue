<script setup lang="ts">
const { isDark } = useDarkMode()

interface Props {
  shaderCode: string
}

defineProps<Props>()

const emit = defineEmits<{
  compileError: [error: string | null]
}>()

function handleCompileError(error: string | null) {
  emit('compileError', error)
}
</script>

<template>
  <TresCanvas
    :clear-color="isDark ? '#0a0a0a' : '#f8f8f8'"
  >
    <ShaderEditorExperience
      :shader-code="shaderCode"
      @compile-error="handleCompileError"
    />
  </TresCanvas>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'

interface Props {
  modelValue: string
  readonly?: boolean
  showLineNumbers?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  showLineNumbers: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let isUpdatingFromProp = false

const { isDark } = useDarkMode()
const { registerGLSLLanguage } = useMonacoGLSL()

onMounted(() => {
  if (!editorContainer.value) return

  // Register GLSL language
  registerGLSLLanguage()

  // Create editor
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: 'glsl',
    theme: isDark.value ? 'vs-dark' : 'vs',
    minimap: { enabled: false },
    lineNumbers: props.showLineNumbers ? 'on' : 'off',
    readOnly: props.readonly,
    automaticLayout: true,
    fontSize: 14,
    scrollBeyondLastLine: false,
    padding: { top: 8, bottom: 8 },
    overviewRulerLanes: 0,
  })

  // Listen for content changes
  editor.onDidChangeModelContent(() => {
    if (editor && !isUpdatingFromProp) {
      emit('update:modelValue', editor.getValue())
    }
  })
})

// Watch for external code changes
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    isUpdatingFromProp = true
    editor.setValue(newValue)
    // Use nextTick to ensure the flag is reset after Monaco processes the change
    nextTick(() => {
      isUpdatingFromProp = false
    })
  }
})

// Watch for theme changes
watch(isDark, (newIsDark) => {
  if (editor) {
    monaco.editor.setTheme(newIsDark ? 'vs-dark' : 'vs')
  }
})

onUnmounted(() => {
  editor?.dispose()
})
</script>

<template>
  <div ref="editorContainer" class="w-full h-full" />
</template>

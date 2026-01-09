<script setup lang="ts">
import defaultFragmentShader from './shaders/default-fragment.glsl'
import type { ShaderEditorProps } from './types'

const props = withDefaults(defineProps<ShaderEditorProps>(), {
  initialCode: defaultFragmentShader,

  showLineNumbers: false,
  readonly: false,
})

const slots = useSlots()

// Process initial code to unescape sequences like \n, \t, etc.
function unescapeShaderCode(code: string): string {
  return code
    .replace(/\\\\n/g, '\n')
    .replace(/\\\\t/g, '\t')
    .replace(/\\\\r/g, '\r')
}

// Recursively extract text content from vnodes
function extractTextFromVNode(vnode: any): string {
  // Check if this is a code block (ProseCode component)
  if (vnode.type?.name === 'ProseCode' || vnode.type?.__name === 'ProseCode') {
    // ProseCode stores the code in props.code
    if (vnode.props?.code) {
      return vnode.props.code
    }
  }

  // Check for pre > code structure
  if (vnode.type === 'pre' || vnode.type?.name === 'pre') {
    // Look for code child
    if (Array.isArray(vnode.children)) {
      for (const child of vnode.children) {
        if (child.type === 'code' || child.type?.name === 'code') {
          if (typeof child.children === 'string') {
            return child.children
          }
          if (Array.isArray(child.children)) {
            return child.children.map(extractTextFromVNode).join('')
          }
        }
      }
    }
  }

  // Direct text node
  if (typeof vnode.children === 'string') {
    return vnode.children
  }

  // Text vnode type
  if (vnode.type === Text || typeof vnode.type === 'symbol') {
    return String(vnode.children || '')
  }

  // Array of children
  if (Array.isArray(vnode.children)) {
    return vnode.children.map(extractTextFromVNode).join('')
  }

  // Object children (slot content)
  if (vnode.children && typeof vnode.children === 'object' && vnode.children.default) {
    const childVNodes = typeof vnode.children.default === 'function'
      ? vnode.children.default()
      : vnode.children.default
    return Array.isArray(childVNodes)
      ? childVNodes.map(extractTextFromVNode).join('')
      : extractTextFromVNode(childVNodes)
  }

  return ''
}

// Extract text content from slot if available (computed to be reactive)
const slotContent = computed(() => {
  if (!slots.default) return null

  const vnodes = slots.default()
  if (!vnodes || vnodes.length === 0) return null

  // Recursively extract all text content
  const content = vnodes
    .map(extractTextFromVNode)
    .join('')
    .trim()

  return content || null
})

// Use slot content if available, otherwise use prop or default
const initialShaderCode = computed(() => slotContent.value || props.initialCode)
const shaderCode = ref<string>('')

// Initialize shader code
watch(initialShaderCode, (code) => {
  if (shaderCode.value === '') {
    // Only set initial value, don't override user edits
    shaderCode.value = slotContent.value ? code : unescapeShaderCode(code)
  }
}, { immediate: true })
const compilationError = ref<string | null>(null)
const copySuccess = ref(false)

// Prevent re-triggering on same error
let lastErrorMessage: string | null = null

function handleCompileError(error: string | null) {
  if (error !== lastErrorMessage) {
    lastErrorMessage = error
    compilationError.value = error
  }
}

function updateShaderCode(newCode: string) {
  shaderCode.value = newCode
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(shaderCode.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
  catch (error) {
    console.error('Failed to copy code:', error)
  }
}
</script>

<template>
  <ClientOnly>
    <div class="shader-editor not-prose my-8 relative" :style="{ height }">
      <!-- Copy button -->
      <UButton
        v-if="!readonly"
        color="neutral"
        variant="solid"
        size="sm"
        :icon="copySuccess ? 'i-lucide-check' : 'i-lucide-copy'"
        class="absolute bottom-2 right-2 z-10"
        @click="copyCode"
      />

      <!-- Side-by-side on desktop, stacked on mobile -->
      <div class="relative w-full h-full min-h-[600px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <!-- Editor Panel (full width/height) -->
        <div class="absolute inset-0">
          <ShaderEditorMonaco
            :model-value="shaderCode"
            :readonly="readonly"
            :show-line-numbers="showLineNumbers"
            @update:model-value="updateShaderCode"
          />
        </div>

        <!-- Preview Panel (floating top-right) -->
        <div class="absolute z-10 top-0 right-0 w-[250px] h-[250px] shadow-lg  overflow-hidden border border-gray-200 dark:border-gray-800">
          <ShaderEditorCanvas
            :shader-code="shaderCode"
            @compile-error="handleCompileError"
          />
        </div>
      </div>

      <!-- Error Alert -->
       <div class="p-4 absolute bottom-0 left-0">
        <UAlert
          v-if="compilationError"
          color="error"
          variant="subtle"
          title="Shader Compilation Error"
          :description="compilationError"
          :close-button="{ icon: 'i-lucide-x', color: 'gray', variant: 'link' }"
          class=""
          @close="compilationError = null"
        />
      </div>
    </div>
    <template #fallback>
      <div class="not-prose my-8" :style="{ height }">
        <div class="w-full h-full bg-gray-100 dark:bg-gray-900 animate-pulse rounded-lg flex items-center justify-center">
          <span class="text-gray-500 dark:text-gray-400">Loading shader editor...</span>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.shader-editor {
  min-height: 400px;
}
</style>

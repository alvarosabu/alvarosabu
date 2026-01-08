<script setup lang="ts">
import defaultFragmentShader from './shaders/default-fragment.glsl'
import type { ShaderEditorProps } from './types'

const props = withDefaults(defineProps<ShaderEditorProps>(), {
  initialCode: defaultFragmentShader,
  height: '500px',
  showLineNumbers: true,
  readonly: false,
})

type TabValue = 'editor' | 'preview'

const activeTab = ref<TabValue>('editor')
const shaderCode = ref<string>(props.initialCode)
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

const tabs = [
  { value: 'editor', label: 'Editor', icon: 'i-lucide-code' },
  { value: 'preview', label: 'Preview', icon: 'i-lucide-eye' },
]
</script>

<template>
  <ClientOnly>
    <div class="shader-editor not-prose my-8" :style="{ height }">
      <UCard
class="h-full flex flex-col" :ui="{
        body: 'sm:p-0 p-0',
      }">
        <template #header>
          <div class="flex items-center justify-between">
            <UTabs
              v-model="activeTab"
              :items="tabs"
              class="flex-1"
            />
            <UButton
              v-if="!readonly"
              color="neutral"
              variant="ghost"
              size="sm"
              :icon="copySuccess ? 'i-lucide-check' : 'i-lucide-copy'"
              @click="copyCode"
            >
              {{ copySuccess ? 'Copied!' : 'Copy' }}
            </UButton>
          </div>
        </template>

        <div class="flex-1 overflow-hidden aspect-square">
          <div class="h-full">
            <!-- <ShaderEditorMonaco
              :model-value="shaderCode"
              :readonly="readonly"
              :show-line-numbers="showLineNumbers"
              @update:model-value="updateShaderCode"
            /> -->
          </div>

          <div class="h-full">
            <ShaderEditorCanvas
              :shader-code="shaderCode"
              @compile-error="handleCompileError"
            />
          </div>
        </div>

        <template v-if="compilationError" #footer>
          <UAlert
            variant="subtle"
            title="Shader Compilation Error"
            :description="compilationError"
            :close-button="{ icon: 'i-lucide-x', color: 'gray', variant: 'link' }"
            @close="compilationError = null"
          />
        </template>
      </UCard>
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

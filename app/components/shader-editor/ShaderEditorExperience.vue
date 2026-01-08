<script setup lang="ts">
import { ShaderMaterial } from 'three'
import { useShaderUniforms } from './composables/useShaderUniforms'
import defaultVertexShader from './shaders/default-vertex.glsl'

interface Props {
  shaderCode: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  compileError: [error: string | null]
}>()

const { uniforms } = useShaderUniforms()

const shaderMaterial = shallowRef<ShaderMaterial | null>(null)
let lastCode = ''

// Update shader material when code changes
function updateMaterial(newCode: string) {
  // Prevent duplicate updates
  if (newCode === lastCode) return
  lastCode = newCode

  try {
    // Dispose old material if exists
    if (shaderMaterial.value) {
      shaderMaterial.value.dispose()
    }

    // Create new material with raw uniforms (prevent reactivity)
    const material = new ShaderMaterial({
      vertexShader: defaultVertexShader,
      fragmentShader: newCode,
      uniforms: toRaw(uniforms),
    })

    shaderMaterial.value = material
    emit('compileError', null)
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    emit('compileError', errorMessage)
    shaderMaterial.value = null
  }
}

// Watch for shader code changes
watch(() => props.shaderCode, (newCode) => {
  updateMaterial(newCode)
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  if (shaderMaterial.value) {
    shaderMaterial.value.dispose()
  }
})
</script>

<template>
  <TresOrthographicCamera :position="[0, 0, 1]" />
  <TresMesh v-if="shaderMaterial">
    <TresPlaneGeometry :args="[2, 2]" />
    <primitive :object="shaderMaterial" />
  </TresMesh>
</template>

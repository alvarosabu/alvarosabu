<script setup lang="ts">
import { ShaderMaterial } from 'three'
import defaultVertexShader from './shaders/default-vertex.glsl'

interface Props {
  shaderCode: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  compileError: [error: string | null]
}>()

const { uniforms } = useShaderUniforms()
const { renderer } = useTres()

const shaderMaterial = shallowRef<ShaderMaterial | null>(null)
const mesh = shallowRef<any>(null)
let lastCode = ''

// Update shader material when code changes
function updateMaterial(newCode: string) {
  // Prevent duplicate updates
  if (newCode === lastCode) return
  lastCode = newCode

  // Basic syntax validation
  const { validateShaderSyntax } = useShaderCompiler()
  const validation = validateShaderSyntax(newCode)

  if (!validation.success && validation.error) {
    emit('compileError', validation.error)
    // Still create material to show what we can
  }
  else {
    emit('compileError', null)
  }

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
}

// Watch for shader code changes
watch(() => props.shaderCode, (newCode) => {
  updateMaterial(newCode)


  console.log('renderer', renderer.debug)
}, { immediate: true })

renderer.debug.onShaderError = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader 
) => {
  
  let errorMessage = ''

  // Check vertex shader compilation
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const vertexError = gl.getShaderInfoLog(vertexShader)
    errorMessage += `Vertex Shader Error:\n${vertexError}\n\n`
  }

  // Check fragment shader compilation
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const fragmentError = gl.getShaderInfoLog(fragmentShader)
    errorMessage += `Fragment Shader Error:\n${fragmentError}\n\n`
  }

  // Check program linking
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(program)
    errorMessage += `Program Link Error:\n${linkError}\n\n`
  }

  if (errorMessage) {
    emit('compileError', errorMessage.trim())
  }

  // Optional: log shader sources for debugging
  console.groupCollapsed('Shader Error Details')
  console.log('Vertex Shader:', gl.getShaderSource(vertexShader))
  console.log('Fragment Shader:', gl.getShaderSource(fragmentShader))
  console.groupEnd()

}

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

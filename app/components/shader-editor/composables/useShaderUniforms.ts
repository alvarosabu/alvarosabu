import { Uniform, Vector2 } from 'three'
import { usePointer } from '@vueuse/core'
import { useLoop } from '@tresjs/core'

export function useShaderUniforms() {
  const { x, y } = usePointer()
  const { onBeforeRender } = useLoop()

  // Normalize mouse coordinates to -1 to 1 range
  const normalizedMouse = computed(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    return new Vector2(
      (x.value / width) * 2 - 1,
      -(y.value / height) * 2 + 1,
    )
  })

  // Create plain uniform objects (not reactive)
  const uniforms = {
    uTime: new Uniform(0),
    uResolution: new Uniform(new Vector2(window.innerWidth, window.innerHeight)),
    uMouse: new Uniform(normalizedMouse.value),
  }

  // Watch for mouse changes
  watch(normalizedMouse, (newMouse) => {
    uniforms.uMouse.value.copy(newMouse)
  })

  // Animation loop
  onBeforeRender(({ elapsed }) => {
    uniforms.uTime.value = elapsed
  })

  // Handle window resize
  function updateResolution() {
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
  }

  onMounted(() => {
    window.addEventListener('resize', updateResolution)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateResolution)
  })

  return {
    uniforms,
    normalizedMouse,
    updateResolution,
  }
}

import { Uniform, Vector2 } from 'three'
import { usePointer } from '@vueuse/core'
import { useLoop } from '@tresjs/core'

export function useShaderUniforms() {
  const { x, y } = usePointer()
  const { onBeforeRender } = useLoop()

  const uniforms = {
    uTime: new Uniform(0),
    uResolution: new Uniform(new Vector2(1, 1)),
    uMouse: new Uniform(new Vector2(0, 0)),
  }

  // Update mouse uniform in-place — no allocations
  watch([x, y], ([newX, newY]) => {
    const width = window.innerWidth
    const height = window.innerHeight
    uniforms.uMouse.value.set(
      (newX / width) * 2 - 1,
      -(newY / height) * 2 + 1,
    )
  })

  onBeforeRender(({ elapsed }) => {
    uniforms.uTime.value = elapsed
  })

  function updateResolution() {
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
  }

  onMounted(() => {
    updateResolution()
    window.addEventListener('resize', updateResolution)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateResolution)
  })

  return {
    uniforms,
  }
}

<script setup lang="ts">
import type { PlaneGeometry} from 'three';
import { BufferAttribute, ShaderMaterial } from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
  },
})

const planeGeometry = ref<PlaneGeometry>()

watch(planeGeometry, (newGeometry) => {
  const count = newGeometry?.attributes.position?.count
  if (count) {
    const randoms = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random()
    }
    newGeometry.setAttribute('aRandom', new BufferAttribute(randoms, 1))
  }
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  if (!material.uniforms.uTime) return
  material.uniforms.uTime!.value += delta
  material.needsUpdate = true
})
</script>

<template>
  <TresOrthographicCamera :position="[0, 0, 1]" />
  <TresMesh>
    <TresPlaneGeometry ref="planeGeometry" :args="[2, 2, 32, 32]" />
    <primitive :object="material" />
  </TresMesh>
</template>

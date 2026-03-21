<script setup lang="ts">
import { color, dot, normalView, float, positionViewDirection, vec3, pow, sub, smoothstep } from 'three/tsl'
import { DoubleSide, SphereGeometry } from 'three'
import { MeshPhysicalNodeMaterial } from 'three/webgpu'

const props = defineProps<{ step: number }>()

const geometry = new SphereGeometry(1, 64, 64)

function ghostMaterial(step: number): MeshPhysicalNodeMaterial {
  const material = new MeshPhysicalNodeMaterial()

  if (step === 1) return material

  const NdotV = dot(normalView, positionViewDirection).abs()
  const fresnelFactor = pow(sub(float(1.0), NdotV), float(1.5)).mul(0.9)
  const shaped = smoothstep(float(0.0), float(1.0), fresnelFactor)

  material.transparent = true
  material.depthWrite = false
  material.side = DoubleSide
  material.opacityNode = shaped

  if (step >= 3) {
    material.colorNode = vec3(0, 0, 0)
    material.emissiveNode = color('#88ccff').mul(shaped).mul(12.0)
  }

  return material
}

const material = computed(() => ghostMaterial(props.step))
</script>

<template>
  <TresMesh :position="[0, 1, 0]" :geometry="geometry" :material="material" />
</template>

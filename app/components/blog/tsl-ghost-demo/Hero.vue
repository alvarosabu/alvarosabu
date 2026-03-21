<script setup lang="ts">
import { color, dot, normalView, float, positionViewDirection, vec3, pow, sub, smoothstep, time, sin, mix } from "three/tsl";
import { AnimationClip, DoubleSide, Mesh, MeshPhysicalNodeMaterial } from "three/webgpu";

function ghostMaterial() {
    // Fresnel: edges bright, core dark — matching Blender Layer Weight Fresnel
    const NdotV = dot(normalView, positionViewDirection).abs()
    const fresnelFactor = pow(sub(float(1.0), NdotV), float(1.5)).mul(0.9)

    // S-curve shaping (approximates the RGB Curves node)
    const shaped = smoothstep(float(0.0), float(1.0), fresnelFactor)

    const material = new MeshPhysicalNodeMaterial()
    material.transparent = true
    material.depthWrite = true
    material.side = DoubleSide
    material.colorNode = vec3(0, 0, 0)
    material.opacityNode = shaped
    // Animate emission intensity: oscillates between 8 and 16 via sin wave
    const emissionPulse = mix(float(2.0), float(6.0), sin(time).mul(0.5).add(0.5))
    material.emissiveNode = color('#88ccff').mul(shaped).mul(emissionPulse)
    return material
}


const { state, nodes } = useGLTF('/models/hero/hero.glb', { draco: true })
const { state: animationsState } = useGLTF('/models/animations/Rig_Medium/Rig_Medium_General.glb', { draco: true })
const rig = computed(() => nodes.value?.Rig_Medium)
const animations = computed(() => animationsState.value?.animations) as WritableComputedRef<AnimationClip[]>
const { actions, mixer } = useAnimations(animations, rig)

watch(actions, (newActions) => { 
    if (newActions?.Idle_A) {
        newActions?.Idle_A?.play()
    }
})

watch(rig, (_rig) => {
  if(_rig) {
    _rig.traverse((child: Mesh) => {
      if (child instanceof Mesh) {
        child.material = ghostMaterial()
      }
    })
  }
}, { immediate: true })
</script>

<template>
  <primitive v-if="rig" :object="rig" />
</template>

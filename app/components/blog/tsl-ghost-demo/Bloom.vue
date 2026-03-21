<script setup lang="ts">
import type { Scene, Camera } from 'three'
import { PostProcessing, WebGPURenderer } from 'three/webgpu'
import { NoToneMapping } from 'three'
import { pass, renderOutput } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'

export interface BloomConfig {
  strength?: number
  radius?: number
  threshold?: number
  smoothWidth?: number
}

const props = withDefaults(defineProps<{
  bloom?: BloomConfig
}>(), {
  bloom: () => ({
    strength: 0.5,
    radius: 0,
    threshold: 0,
    smoothWidth: 0.01,
  }),
})

const { renderer, scene, camera } = useTresContext()
const postProcessing = shallowRef<PostProcessing | null>(null)

watch(
  [scene, camera.activeCamera],
  ([currentScene, currentCamera]) => {
    if (!currentScene || !currentCamera) return
    if (postProcessing.value) return

    const webgpuRenderer = renderer.instance as unknown as WebGPURenderer
    const sceneObj = currentScene as unknown as Scene
    const cameraObj = currentCamera as unknown as Camera

    const renderPipeline = new PostProcessing(webgpuRenderer)
    const scenePass = pass(sceneObj, cameraObj)
    const scenePassColor = scenePass.getTextureNode('output')

    const bloomPass = bloom(scenePassColor)
    bloomPass.strength.value = props.bloom.strength ?? 0.5
    bloomPass.radius.value = props.bloom.radius ?? 0
    bloomPass.threshold.value = props.bloom.threshold ?? 0
    bloomPass.smoothWidth.value = props.bloom.smoothWidth ?? 0.01

    watch(
      () => props.bloom,
      (config) => {
        if (!config) return
        bloomPass.strength.value = config.strength ?? 0.5
        bloomPass.radius.value = config.radius ?? 0
        bloomPass.threshold.value = config.threshold ?? 0
        bloomPass.smoothWidth.value = config.smoothWidth ?? 0.01
      },
      { deep: true },
    )

    let outputNode = scenePassColor.add(bloomPass)

    const rendererToneMapping = webgpuRenderer.toneMapping
    if (rendererToneMapping !== NoToneMapping) {
      renderPipeline.outputColorTransform = false
      outputNode = renderOutput(outputNode, rendererToneMapping)
    }

    renderPipeline.outputNode = outputNode
    postProcessing.value = renderPipeline
    renderer.replaceRenderFunction((notifySuccess) => {
      renderPipeline.render()
      notifySuccess()
    })
  },
  { immediate: true },
)

onUnmounted(() => {
  postProcessing.value?.dispose()
})
</script>

<template>
  <!-- Renderless component -->
</template>

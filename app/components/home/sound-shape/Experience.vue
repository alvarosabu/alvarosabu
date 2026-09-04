<script setup lang="ts">
import { MeshBasicNodeMaterial, PostProcessing } from 'three/webgpu'
import type { Renderer } from 'three/webgpu'
import { pass } from 'three/tsl'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { createSoundShapeNodes, MORPH_CYCLE, MORPH_STOPS } from './raymarch'
import { soundSourceKey } from './useSoundSource'

const BLOOM_STRENGTH = 0.25
const BLOOM_RADIUS = 0.5
const BLOOM_THRESHOLD = 0.1

const { isDark, colors } = useDarkMode()
const { scene, camera, renderer } = useTres()
const { onBeforeRender, render } = useLoop()

const sound = inject(soundSourceKey)!

const { colorNode, vertexNode, uniforms } = createSoundShapeNodes()

const material = new MeshBasicNodeMaterial({ depthTest: false, depthWrite: false })
material.colorNode = colorNode
material.vertexNode = vertexNode
material.toneMapped = false

watchEffect(() => {
  uniforms.backgroundColor.value.set(isDark.value ? colors.DARK : colors.LIGHT)
  uniforms.rimColor.value.set(isDark.value ? colors.DARK_TEXT : colors.LIGHT_TEXT)
})

// Holds the first solid until the visitor starts, so the morph reads as a
// response to them.
let morphOrigin: number | null = null

onBeforeRender(({ elapsed }) => {
  uniforms.time.value = elapsed
  uniforms.amplitude.value = sound.sample()

  if (!sound.hasStarted.value) { return }

  morphOrigin ??= elapsed
  const phase = ((elapsed - morphOrigin) % MORPH_CYCLE) / MORPH_CYCLE
  // Ease each stop-to-stop transition so the shape settles on every solid.
  const ring = phase * MORPH_STOPS
  const stop = Math.floor(ring)
  const f = ring - stop
  uniforms.morph.value = stop + f * f * (3 - 2 * f)
})

const isExperienceReady = useState('homeExperienceReady', () => false)

let postProcessing: PostProcessing | null = null
let bloomPass: ReturnType<typeof bloom> | null = null

// TresJS renders the scene directly; swap in a bloom composite.
render((notifySuccess) => {
  const activeCamera = camera.value
  if (!activeCamera) { return }

  if (!postProcessing) {
    const scenePass = pass(scene.value, activeCamera).getTextureNode('output')
    bloomPass = bloom(scenePass, BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD)

    postProcessing = new PostProcessing(renderer as Renderer)
    // the shader already applies its own gamma
    postProcessing.outputColorTransform = false
    postProcessing.outputNode = scenePass.add(bloomPass)
  }

  // In light mode the background is the bright part of the frame, so blooming
  // it would wash out the page.
  bloomPass!.strength.value = isDark.value ? BLOOM_STRENGTH : 0

  postProcessing.render()
  notifySuccess()

  if (!isExperienceReady.value) { isExperienceReady.value = true }
})

onBeforeUnmount(() => {
  postProcessing?.dispose()
  material.dispose()
})
</script>

<template>
  <TresPerspectiveCamera :position="[0, 0, 1]" />
  <TresMesh :frustum-culled="false">
    <TresPlaneGeometry :args="[1, 1]" />
    <primitive :object="material" />
  </TresMesh>
</template>

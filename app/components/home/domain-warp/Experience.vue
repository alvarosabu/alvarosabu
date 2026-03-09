<script setup lang="ts">
import { DoubleSide, NearestFilter, Uniform, Vector2, Vector3 } from 'three'
import { useTexture } from '@tresjs/cientos'
import { usePointer } from '@vueuse/core'
import gsap from 'gsap'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const { isDark } = useDarkMode()
const { sizes } = useTresContext()
const { x, y } = usePointer()

const resolution = computed(() => {
  return new Vector2(
    sizes.width.value * sizes.pixelRatio.value,
    sizes.height.value * sizes.pixelRatio.value,
  )
})

const normalizedMouse = computed(() => {
  const nx = (x.value / window.innerWidth) * 2 - 1
  const ny = -(y.value / window.innerHeight) * 2 + 1
  return new Vector2(nx, ny)
})

// Load textures via cientos useTexture, NearestFilter + no mipmaps
const { state: grainTex } = useTexture('/textures/grain.webp')
const { state: blurTex } = useTexture('/textures/blur.webp')

const uniforms = {
  grainTex: new Uniform(grainTex.value),
  blurTex: new Uniform(blurTex.value),
  time: new Uniform(0),
  seed: new Uniform(Math.random() * 100.0),
  back: new Uniform(new Vector3(0.05, 0.05, 0.05)),
  style: new Uniform(Math.round(Math.random())),
  uGrainScale: new Uniform(1.0),
  uGrainDisplacement: new Uniform(0.05),
  uNoiseDensity: new Uniform(0.2),
  uMouse: new Uniform(new Vector2(0, 0)),
  uResolution: new Uniform(resolution.value),
}

const isExperienceReady = useState('homeExperienceReady', () => false)

watch([grainTex, blurTex], () => {
  if (grainTex.value) {
    grainTex.value.minFilter = NearestFilter
    grainTex.value.magFilter = NearestFilter
    grainTex.value.generateMipmaps = false
  }
  if (blurTex.value) {
    blurTex.value.minFilter = NearestFilter
    blurTex.value.magFilter = NearestFilter
    blurTex.value.generateMipmaps = false
  }
  uniforms.grainTex.value = grainTex.value
  uniforms.blurTex.value = blurTex.value
  if (grainTex.value && blurTex.value) {
    isExperienceReady.value = true
  }
}, { immediate: true })

// Theme switching with GSAP transition
watch(isDark, (dark) => {
  if (dark) {
    gsap.to(uniforms.back.value, { x: 0.05, y: 0.05, z: 0.05, duration: 1.6 })
  }
  else {
    gsap.to(uniforms.back.value, { x: 0.9, y: 0.9, z: 0.9, duration: 1.6 })
  }
}, { immediate: true })

watch(normalizedMouse, (mouse) => {
  uniforms.uMouse.value.copy(mouse)
})

watch(resolution, (res) => {
  uniforms.uResolution.value.copy(res)
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  uniforms.time.value = elapsed
})
</script>

<template>
  <TresOrthographicCamera :position="[0, 0, 20]" />
  <TresMesh>
    <TresPlaneGeometry :args="[3, 3]" />
    <TresShaderMaterial
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms"
      :transparent="true"
      :side="DoubleSide"
    />
  </TresMesh>
</template>

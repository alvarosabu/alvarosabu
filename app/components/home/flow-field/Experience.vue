<script setup lang="ts">
  import type { WebGLRenderer } from 'three';
  import { BufferAttribute, BufferGeometry, Points, ShaderMaterial, SphereGeometry, Uniform, Vector2 } from 'three';
  import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
  import vertexShader from './shaders/vertex.glsl'
  import fragmentShader from './shaders/fragment.glsl'
  import gpgpuParticlesShader from './shaders/gpgpu/particles.glsl'

const { sizes, renderer } = useTresContext()

const resolution = computed(() => {
  return new Vector2(sizes.width.value * sizes.pixelRatio.value, sizes.height.value * sizes.pixelRatio.value)
})


/**
 * Base geometry
 */
const baseGeometry = {
  instance: null,
  count: 0,
}

baseGeometry.instance = new SphereGeometry(3)
baseGeometry.count = baseGeometry.instance.attributes.position.count
/**
 * GPU Compute
 */
// Setup GPU Compute

const gpgpu = {
  computation: null,
  size: Math.ceil(Math.sqrt(baseGeometry.count)),
  particlesVariable: null,
}
gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer.instance as WebGLRenderer)

// Base Particles
const baseParticlesTexture = gpgpu.computation.createTexture()

// We set the particles from the xyz of the base geometry to the rgba of the base particles texture
for (let i = 0; i < baseGeometry.count; i++) {
  const i3 = i * 3
  const i4 = i * 4

  baseParticlesTexture.image.data[i4 + 0] = baseGeometry.instance.attributes.position.array[i3 + 0] as number // X -> R
  baseParticlesTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1] as number // Y -> G
  baseParticlesTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2] as number // Z -> B
  baseParticlesTexture.image.data[i4 + 3] = 0
}

// Particles variable
gpgpu.particlesVariable = gpgpu.computation.addVariable('uParticles', gpgpuParticlesShader, baseParticlesTexture)
gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [gpgpu.particlesVariable])

// Init
//gpgpu.computation.init()
try {
  gpgpu.computation.init()
} catch (error) {
  console.error(error)
  throw new Error('Error initializing GPGPU computation', error)
}

console.log('gpgpu', gpgpu)
console.log(gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture)
const fboTexture = gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture

/**
 * Points
 */
const particlesUv = new Float32Array(baseGeometry.count * 2)

for (let y = 0; y < gpgpu.size; y++) {
  for (let x = 0; x < gpgpu.size; x++) {
    const i = (y * gpgpu.size) + x
    const i2 = i * 2
    particlesUv[i2 + 0] = (x + 0.5) / gpgpu.size // Normalized x coordinate to be between 0 and 1
    particlesUv[i2 + 1] = (y + 0.5) / gpgpu.size // Normalized y coordinate to be between 0 and 1
  }
}

const particlesGeometry = new BufferGeometry()
particlesGeometry.setDrawRange(0, baseGeometry.count)
particlesGeometry.setAttribute('aParticlesUv', new BufferAttribute(particlesUv, 2))
const uniforms = {
  uTime: new Uniform(0),
  uResolution: new Uniform(resolution.value),
  uSize: new Uniform(0.04),
  uParticlesTexture: new Uniform(null),
}

const particlesMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
})

const points = new Points(particlesGeometry, particlesMaterial)


const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
  gpgpu.computation?.compute()
  particlesMaterial.uniforms.uParticlesTexture.value = gpgpu.computation?.getCurrentRenderTarget(gpgpu.particlesVariable).texture

})



</script>
<template>
  <TresPerspectiveCamera :position="[4.5, 4, 11]" />
  <OrbitControls />
  <TresAxesHelper :size="1" />
  <TresPoints :geometry="particlesGeometry" :material="particlesMaterial"/>
  <TresMesh :position="[5, 0, 0]" >
    <TresPlaneGeometry :args="[3, 3]" />
    <TresMeshBasicMaterial :map="fboTexture" />
  </TresMesh>
</template>
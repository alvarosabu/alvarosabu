<script setup lang="ts">
import { DataTexture, Mesh, NearestFilter, PlaneGeometry, BufferAttribute, BufferGeometry, FloatType, OrthographicCamera, RGBAFormat, Scene, ShaderMaterial, Uniform, Vector2, WebGLRenderTarget } from 'three';
import { BlendFunction } from 'postprocessing'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import simVertexShader from './shaders/simVertex.glsl'
import simFragmentShader from './shaders/simFragment.glsl'
import { useTresContext } from '@tresjs/core'

const PARTICLE_COUNT = 10000
const SIZE = 128
const COUNT = SIZE * SIZE
const { sizes, renderer, scene, camera } = useTresContext()


const resolution = computed(() => {
  return new Vector2(sizes.width.value * sizes.pixelRatio.value, sizes.height.value * sizes.pixelRatio.value)
})

// Create a WebGL render target for FBO (Frame Buffer Object)
// FBOs allow us to render to a texture instead of the screen
function getRenderTarget() {
  const target = new WebGLRenderTarget(SIZE, SIZE, {
    format: RGBAFormat,
    type: FloatType,
    minFilter: NearestFilter,
    magFilter: NearestFilter,
  })
  return target
}

// PING-PONG BUFFERING: We need TWO FBOs to avoid reading/writing to the same texture
// Each frame: Read from FBO A → Simulate → Write to FBO B, then swap
// This prevents GPU race conditions when updating particle positions
const fbo = getRenderTarget()   // FBO A (read source)
const fbo1 = getRenderTarget()  // FBO B (write target)

// Separate scene just for FBO simulation (runs offscreen)
const fboScene = new Scene()
const fboCamera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
fboCamera.position.z = 0.5
const fboGeometry = new PlaneGeometry(2, 2)

// Initialize particle positions in a DataTexture
// Each pixel stores one particle's position (RGBA = xyzw)
const data = new Float32Array(SIZE * SIZE * 4)

// Generate initial DONUT/TORUS shape using polar coordinates
for (let i = 0; i < SIZE; i++) {
  for (let j = 0; j < SIZE; j++) {
    const theta = Math.random() * Math.PI * 2  // Angle around circle (0 to 2π)
    const radius = 0.5 + Math.random() * 0.5   // Random radius (0.5 to 1.0 = donut hole)
    const index = (i + j * SIZE) * 4
    data[index] = radius * Math.cos(theta)      // X position
    data[index + 1] = radius * Math.sin(theta)  // Y position
    data[index + 2] = 1
    data[index + 3] = 1
  }
}

  const fboTexture = new DataTexture(data, SIZE, SIZE, RGBAFormat, FloatType)
  fboTexture.minFilter = NearestFilter
  fboTexture.magFilter = NearestFilter
  fboTexture.needsUpdate = true

  const fboMaterial = new ShaderMaterial({
    vertexShader: simVertexShader,
    fragmentShader: simFragmentShader,
    uniforms: {
      uPositions: new Uniform(fboTexture),
      uTime: new Uniform(0.0),
    },
  })
  const fboMesh = new Mesh(fboGeometry, fboMaterial)
  fboScene.add(fboMesh)

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uResolution: new Uniform(resolution.value),
    uPositions: new Uniform(null),
    uSize: new Uniform(1.0),
    uTime: new Uniform(0.0),
  },
})

const geometry = new BufferGeometry()
const positions = new Float32Array(COUNT * 3)
const uv = new Float32Array(COUNT * 2)


for (let i = 0; i < SIZE; i++) {
  for (let j = 0; j < SIZE; j++) {
    const index = (i * SIZE + j) * 3
   
    positions[index] = Math.random()
    positions[index + 1] = Math.random()
    positions[index + 2] = 0

    const uvIndex = (i * SIZE + j) * 2
    uv[uvIndex] = i / SIZE
    uv[uvIndex + 1] = j / SIZE
  }
}

geometry.setAttribute('position', new BufferAttribute(positions, 3))
geometry.setAttribute('uv', new BufferAttribute(uv, 2))

// Assign the FBO texture containing donut positions
if (material.uniforms.uPositions) {
  material.uniforms.uPositions.value = fboTexture
}

watch(resolution, () => {
  if (!material.uniforms.uResolution) return
  material.uniforms.uResolution.value = resolution.value
}, { immediate: true })



renderer.replaceRenderFunction((notifySuccess) => {
  
  // renderer.instance.render(scene.value, camera.activeCamera.value)
    // notifySuccess()
})


</script>

<template>
  <TresPerspectiveCamera :args="[50, 1, 0.1, 2000]" :position="[0, 0, 2]" />
  <OrbitControls />
  <TresPoints :geometry="geometry" :material="material" />
  <TresAxesHelper :size="1" />
  <!-- <Suspense>
    <EffectComposerPmndrs>
      <NoisePmndrs
        premultiply
        :blend-function="BlendFunction.SCREEN"
      />
    </EffectComposerPmndrs>
  </Suspense> -->
</template>

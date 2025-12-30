<script setup lang="ts">
import type { BufferGeometry, PerspectiveCamera } from 'three';
import { BufferAttribute, Color, Float32BufferAttribute, Uniform, Vector2 } from 'three'
import gsap from 'gsap';
import { BlendFunction } from 'postprocessing';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const { sizes } = useTresContext()

const resolution = computed(() => {
  return new Vector2(sizes.width.value * sizes.pixelRatio.value, sizes.height.value * sizes.pixelRatio.value)
})

const uniforms = {
  uTime: new Uniform(0),
  uResolution: new Uniform(resolution.value),
  uSize: new Uniform(0.05),
  uProgress: new Uniform(0.0),
  uColorA: new Uniform(new Color('#0a0a0a')),
  uColorB: new Uniform(new Color('#141414')),
}

// Model configuration - add or remove models here
const modelConfigs = [
  { path: '/models/tori/tori-simplified.glb', nodeName: 'Tori' },
  { path: '/models/archer/archer-simplified.glb', nodeName: 'Archer' },
  { path: '/models/skull/skull.glb', nodeName: 'SkullFlowers' },
]

// Load all models dynamically
const loadedModels = modelConfigs.map(config => {
  const { nodes } = useGLTF(config.path, { draco: true })
  return computed(() => nodes.value[config.nodeName])
})


const particles = reactive<{
  positions: Float32BufferAttribute[]
  sizes: BufferAttribute
  maxCount: number
}>({
  positions: [],
  sizes: new BufferAttribute(new Float32Array(0), 1),
  maxCount: 0,
})

const geometryRef = ref<BufferGeometry>()

// Watch all models and prepare particle positions
watch(loadedModels, (models) => {
  const allModelsLoaded = models.every(model => model)
  if (!allModelsLoaded) return

  const positions: BufferAttribute[] = models.map(model => model.geometry.attributes.position)

  // Calculate max number of particles based on the most detailed model
  particles.maxCount = Math.max(...positions.map(position => position.count))

  // Generate random sizes for all particles
  const sizesArray = new Float32Array(particles.maxCount)
  for (let i = 0; i < particles.maxCount; i++) {
    sizesArray[i] = Math.random()
  }
  particles.sizes = new BufferAttribute(sizesArray, 1)

  // Harmonize all positions to match maxCount
  particles.positions = []
  for (const position of positions) {
    const originalArray = position.array
    const newArray = new Float32Array(particles.maxCount * 3)

    for (let i = 0; i < particles.maxCount; i++) {
      const i3 = i * 3

      if (i3 < originalArray.length) {
        newArray[i3] = originalArray[i3] as number
        newArray[i3 + 1] = originalArray[i3 + 1] as number
        newArray[i3 + 2] = originalArray[i3 + 2] as number
      } else {
        // If this model has fewer vertices, duplicate random existing vertices
        const randomIndex = Math.floor(position.count * Math.random()) * 3
        newArray[i3 + 0] = position.array[randomIndex + 0] as number
        newArray[i3 + 1] = position.array[randomIndex + 1] as number
        newArray[i3 + 2] = position.array[randomIndex + 2] as number
      }
    }
    particles.positions.push(new Float32BufferAttribute(newArray, 3))
  }
}, { immediate: true })

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
})

const currentIndex = ref(0)
const targetIndex = computed(() => {
  return (currentIndex.value + 1) % particles.positions.length
})

const cameraRef = ref<PerspectiveCamera>()

// Camera configurations - add more positions/rotations for additional models
const cameraConfigs: Array<{ position: [number, number, number], rotation: [number, number, number] }> = [
  { position: [4.035660072120894, 2.54742224460525, 8.264880778126532], rotation: [0.14, 0.74, -0.09] },
  { position: [-1.3121353810233232, 3.981874777965827, 8.372101210607038], rotation: [-0.01, 0.24, 0] },
  { position: [3.7970990941426352, 2.03847753532275, 8.723218284488384], rotation: [0.17, 0.68, -0.11] },
  // Add more: { position: [x, y, z], rotation: [x, y, z] },
]

function updateCamera() {
  if (!cameraRef.value) return

  // Use targetIndex so camera moves to where particles are morphing TO
  const configIndex = targetIndex.value % cameraConfigs.length
  const config = cameraConfigs[configIndex]

  if (!config) return

  gsap.to(cameraRef.value.position, {
    x: config.position[0],
    y: config.position[1],
    z: config.position[2],
    duration: 3.0,
    ease: 'power2.inOut',
  })

  gsap.to(cameraRef.value.rotation, {
    x: config.rotation[0],
    y: config.rotation[1],
    z: config.rotation[2],
    duration: 3.0,
    ease: 'power2.inOut',
  })
}

function morphParticles() {
  if (!geometryRef.value || particles.positions.length === 0) return

  const currentPos = particles.positions[currentIndex.value]
  const targetPos = particles.positions[targetIndex.value]

  if (!currentPos || !targetPos) return

  // Update geometry attributes for current morph pair
  geometryRef.value.setAttribute('position', currentPos)
  geometryRef.value.setAttribute('aPositionTarget', targetPos)
  if (geometryRef.value.attributes.position) {
    geometryRef.value.attributes.position.needsUpdate = true
  }
  if (geometryRef.value.attributes.aPositionTarget) {
    geometryRef.value.attributes.aPositionTarget.needsUpdate = true
  }

  // Animate uProgress from 0 to 1 for smooth interpolation
  uniforms.uProgress.value = 0
  gsap.to(uniforms.uProgress, {
    value: 1.0,
    duration: 3.0,
    ease: 'power2.inOut',
  })

  updateCamera()
}

// Trigger first morph when particles are ready
watch(() => particles.positions.length, (length) => {
  if (length > 0) {
    nextTick(() => {
      setInterval(() => {
        morphParticles()
        currentIndex.value = (currentIndex.value + 1) % particles.positions.length
      }, 6000)
    })
  }
}, { once: true })



</script>

<template>
  <TresPerspectiveCamera
    ref="cameraRef"
    :position="cameraConfigs[0]?.position"
    :rotation="cameraConfigs[0]?.rotation"
  />
  <OrbitControls v-if="false" />
  <TresPoints v-if="particles.positions.length > 0">
    <TresBufferGeometry
      ref="geometryRef"
      :position="[particles.positions[0]?.array, 3]"
      :a-position-target="[particles.positions[1]?.array, 3]"
      :a-size="[particles.sizes?.array, 1]"
    />
    <TresShaderMaterial
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms"
      :transparent="true"
      :depth-write="false"
    />
  </TresPoints>
  <Suspense>
    <EffectComposerPmndrs>
      <ChromaticAberrationPmndrs
        :offset="new Vector2(0.001, 0.001)"
        :blend-function="BlendFunction.SCREEN"
        radial-modulation
      />
      <NoisePmndrs
        premultiply
        :blend-function="BlendFunction.SCREEN"
      />
    </EffectComposerPmndrs>
  </Suspense>
</template>
<script setup lang="ts">
import type { PerspectiveCamera} from 'three';
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

const index = ref(0)


const { nodes: toriNodes } = useGLTF('/models/tori/tori-simplified.glb', {
  draco: true,
})
const tori = computed(() => toriNodes.value.Tori)

const { nodes: archerNodes } = useGLTF('/models/archer/archer-simplified.glb', {
  draco: true,
})
const archer = computed(() => archerNodes.value.Archer)

const particles = reactive<{
  positions: Float32BufferAttribute[],
  sizes: BufferAttribute[],
  maxCount: number,
}>({
  positions: [],
  maxCount: 0,
})

watch(() => [tori.value, archer.value], ([tori, archer]) => {
  if (tori && archer) {
    const positions: BufferAttribute[] = [
      tori.geometry.attributes.position,
      archer.geometry.attributes.position,
    ]

    // Calculate max number of particles based on the more detailed model
    particles.maxCount = Math.max(...positions.map(position => position.count))

    const sizesArray = new Float32Array(particles.maxCount)
    for (let i = 0; i < particles.maxCount; i++) {
      sizesArray[i] = Math.random()
    }
    particles.sizes = new BufferAttribute(sizesArray, 1)
    
    // We harmonize the positions by the max count
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
          const randomIndex = Math.floor(position.count * Math.random()) * 3
          newArray[i3 + 0] = position.array[randomIndex + 0] as number
          newArray[i3 + 1] = position.array[randomIndex + 1] as number
          newArray[i3 + 2] = position.array[randomIndex + 2] as number
        }
      }
      particles.positions.push(new Float32BufferAttribute(newArray, 3))
    }
  }
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
})

const cameraRef = ref<PerspectiveCamera>()

function updateCamera() {
  if (!cameraRef.value) return

  const targetPositionIndex = index.value % cameraPositions.length
  const targetRotationIndex = index.value % cameraRotations.length

  const targetPosition = cameraPositions[targetPositionIndex]
  const targetRotation = cameraRotations[targetRotationIndex]

  if (targetPosition) {
    gsap.to(cameraRef.value.position, {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
      duration: 3.0,
      ease: 'power2.inOut',
    })
  }

  if (targetRotation) {
    gsap.to(cameraRef.value.rotation, {
      x: targetRotation[0],
      y: targetRotation[1],
      z: targetRotation[2],
      duration: 3.0,
      ease: 'power2.inOut',
    })
  }
}

function morphParticles() {
  gsap.to(uniforms.uProgress, {
    value: index.value,
    duration: 3.0,
    ease: 'power2.inOut',
  })
  updateCamera()
}

onMounted(() => {
  setInterval(() => {
    index.value++
    if (index.value >= particles.positions.length) {
      index.value = 0
    }
    morphParticles()
  }, 6000)
})

const cameraPositions = [
  [4.035660072120894,2.54742224460525,8.264880778126532],
  [-1.3121353810233232,3.981874777965827,8.372101210607038],
]

const cameraRotations = [
  [0.14, 0.74, -0.09],
  [-0.01,0.24,0],
]


</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :position="cameraPositions[0]" :rotation="cameraRotations[0]" />
  <TresPoints>
    <TresBufferGeometry
      v-if="particles.positions.length > 0" :position="[particles.positions[0]?.array, 3]"
      :a-position-target="[particles.positions[1]?.array, 3]" :a-size="[particles.sizes?.array, 1]" />
    <TresShaderMaterial
:vertex-shader="vertexShader" :fragment-shader="fragmentShader" :uniforms="uniforms"
      :transparent="true"  :depth-write="false" />
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
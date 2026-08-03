<script setup lang="ts">
import { BufferAttribute, BufferGeometry, Color, DoubleSide, InstancedBufferAttribute, InstancedBufferGeometry, PlaneGeometry, Sphere, SRGBColorSpace, TextureLoader, Vector2, Vector3 } from 'three'
import type { Texture } from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'
import { atan, attribute, cameraPosition, Fn, mix, mx_noise_float, PI, positionGeometry, positionWorld, rotateUV, step, texture, uniform, uniformArray, uv, varying, vec2, vec3, vertexIndex } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import type { Node } from 'three/webgpu'
import { useLoop } from '@tresjs/core'

// Steps:
// 1: v1 static triangles, flat color
// 2: + height randomness + noise patchiness
// 3: + ground color mix + tipness AO
// 4: + camera billboard (v1 complete)
// 5: v2 instanced 5-vertex blade + per-blade yaw
// 6: + diffuse map sampled at the blade anchor
// 7: + wind sway (windWeight-weighted xz offset — blade stretches)
// 8: + arc-length droop so the blade bends instead of stretching
const props = defineProps<{ step: number, wireframe?: boolean }>()

const FIELD_SIZE = 15
const SUBDIVISIONS = 100
// step 1 stays sparse so individual triangles (and the wireframe) are readable
const SPARSE_SUBDIVISIONS = 24
const DIFFUSE_URL = '/blog/creating-a-grass-field-with-tsl/splat.webp'

const bladeWidth = uniform(0.05)
const bladeHeight = uniform(0.6)
const bladeHeightRandomness = uniform(0.6)
const bladeLean = uniform(0.3) // max static pitch in radians (~17°)
const shadowIntensity = uniform(0.5)
const colorA = uniform(new Color('#4f8a3d'))
const colorB = uniform(new Color('#b8cc48'))

// wind: a shared direction plus two scrolled noise octaves, advanced in the loop below
const WIND_ANGLE = Math.PI * 0.6
const windDirection = uniform(new Vector2(Math.sin(WIND_ANGLE), Math.cos(WIND_ANGLE)))
const windPositionFrequency = uniform(0.5)
const windStrength = uniform(0.45)
const windTimeFrequency = uniform(0.5)
const windLocalTime = uniform(0)

// two octaves at different frequency AND time scale so the field doesn't read as
// one marching wave; +0.4 is a downwind lean, so wind bows the grass instead of
// only oscillating it around rest pose
const windOffset = Fn(([worldXZ]: [Node]) => {
  const p = worldXZ.mul(windPositionFrequency)
  const n1 = mx_noise_float(p.mul(0.2).add(windDirection.mul(windLocalTime)))
  const n2 = mx_noise_float(p.mul(0.1).add(windDirection.mul(windLocalTime.mul(0.2)))).mul(0.5)
  const intensity = n1.add(n2).add(0.4)
  return windDirection.mul(intensity).mul(windStrength)
})

// v1 blade: one triangle expanded in the vertex stage, (x, y) pairs: tip, bottom-right, bottom-left
const bladeShape = uniformArray([
  new Vector2(0, 1),
  new Vector2(1, 0),
  new Vector2(-1, 0),
], 'vec2')

// v2 blade: unit quad + tip in the XY plane, 5 verts / 3 indexed triangles
const BLADE_POSITIONS = new Float32Array([
  -1, 0, 0, // bottom-left
  1, 0, 0, // bottom-right
  -0.5, 0.7, 0, // mid-left
  0.5, 0.7, 0, // mid-right
  0, 1, 0, // tip
])
const BLADE_TIPNESS = new Float32Array([0, 0, 0.7, 0.7, 1])
const BLADE_INDICES = [0, 1, 2, 1, 3, 2, 2, 3, 4]

function createAnchor(iX: number, iZ: number, subdivisions: number, fragmentSize: number): [number, number] {
  return [
    (iX + 0.5) / subdivisions * FIELD_SIZE - FIELD_SIZE / 2 + (Math.random() - 0.5) * fragmentSize,
    (iZ + 0.5) / subdivisions * FIELD_SIZE - FIELD_SIZE / 2 + (Math.random() - 0.5) * fragmentSize,
  ]
}

// v1: every blade owns 3 real vertices, all sharing the same xz anchor.
// The `position` attribute has itemSize 2 — it stores anchors, not positions.
function createV1Geometry(subdivisions: number): BufferGeometry {
  const count = subdivisions * subdivisions
  const fragmentSize = FIELD_SIZE / subdivisions
  const positions = new Float32Array(count * 3 * 2)
  const heightRandomness = new Float32Array(count * 3)

  for (let iX = 0; iX < subdivisions; iX++) {
    for (let iZ = 0; iZ < subdivisions; iZ++) {
      const i = iX * subdivisions + iZ
      const [x, z] = createAnchor(iX, iZ, subdivisions, fragmentSize)

      for (let v = 0; v < 3; v++) {
        positions[i * 6 + v * 2] = x
        positions[i * 6 + v * 2 + 1] = z
        heightRandomness[i * 3 + v] = Math.random()
      }
    }
  }

  const geometry = new BufferGeometry()
  // trivial index: three's WebGPU getWireframeIndex() assumes itemSize 3 on
  // non-indexed geometry, which drops 1/3 of the blades in wireframe mode
  geometry.setIndex([...Array(count * 3).keys()])
  geometry.setAttribute('position', new BufferAttribute(positions, 2))
  geometry.setAttribute('heightRandomness', new BufferAttribute(heightRandomness, 1))
  // position no longer holds real positions, so bounds must be set by hand
  geometry.boundingSphere = new Sphere(new Vector3(), (FIELD_SIZE / 2) * Math.SQRT2 + 2)
  return geometry
}

// v2: one 5-vertex blade shared by every instance, per-blade data in instanced attributes
function createV2Geometry(): InstancedBufferGeometry {
  const count = SUBDIVISIONS * SUBDIVISIONS
  const fragmentSize = FIELD_SIZE / SUBDIVISIONS
  const anchors = new Float32Array(count * 2)
  const randoms = new Float32Array(count)
  const yaws = new Float32Array(count)
  const leans = new Float32Array(count)
  // anchor-only noises baked at build time instead of per-vertex in the shader
  const heightNoises = new Float32Array(count)
  const colorNoises = new Float32Array(count)
  const noise = new ImprovedNoise()

  for (let iX = 0; iX < SUBDIVISIONS; iX++) {
    for (let iZ = 0; iZ < SUBDIVISIONS; iZ++) {
      const i = iX * SUBDIVISIONS + iZ
      const [x, z] = createAnchor(iX, iZ, SUBDIVISIONS, fragmentSize)

      anchors[i * 2] = x
      anchors[i * 2 + 1] = z
      randoms[i] = Math.random()
      yaws[i] = Math.random() * Math.PI * 2
      leans[i] = Math.random()
      heightNoises[i] = noise.noise(x * 0.35, z * 0.35, 0) * 0.5 + 1
      colorNoises[i] = noise.noise(x * 0.25, z * 0.25, 0) * 0.5 + 0.5
    }
  }

  const geometry = new InstancedBufferGeometry()
  geometry.instanceCount = count
  geometry.setIndex(BLADE_INDICES)
  geometry.setAttribute('position', new BufferAttribute(BLADE_POSITIONS, 3))
  geometry.setAttribute('tipness', new BufferAttribute(BLADE_TIPNESS, 1))
  geometry.setAttribute('anchor', new InstancedBufferAttribute(anchors, 2))
  geometry.setAttribute('random', new InstancedBufferAttribute(randoms, 1))
  geometry.setAttribute('yaw', new InstancedBufferAttribute(yaws, 1))
  geometry.setAttribute('lean', new InstancedBufferAttribute(leans, 1))
  geometry.setAttribute('heightNoise', new InstancedBufferAttribute(heightNoises, 1))
  geometry.setAttribute('colorNoise', new InstancedBufferAttribute(colorNoises, 1))
  geometry.boundingSphere = new Sphere(new Vector3(), (FIELD_SIZE / 2) * Math.SQRT2 + 2)
  return geometry
}

const groundColor = Fn(([worldXZ]: [Node]) => {
  const variation = mx_noise_float(worldXZ.mul(0.25)).mul(0.5).add(0.5)
  return mix(colorA, colorB, variation)
})

function createV1Material(stage: number, wireframe = false): MeshBasicNodeMaterial {
  const material = new MeshBasicNodeMaterial()
  material.side = DoubleSide
  material.wireframe = wireframe

  material.positionNode = Fn(() => {
    const anchor = attribute('position', 'vec2')
    const vertexLoopIndex = vertexIndex.toFloat().mod(3)
    const template = bladeShape.element(vertexLoopIndex.toInt())

    let height: Node = bladeHeight
    if (stage >= 2) {
      const heightRand = attribute('heightRandomness', 'float')
      const heightVariation = mx_noise_float(anchor.mul(0.35)).mul(0.5).add(1)
      height = bladeHeight
        .mul(mix(1, heightRand, bladeHeightRandomness))
        .mul(heightVariation)
    }

    const pos = vec3(
      anchor.x.add(template.x.mul(bladeWidth)),
      template.y.mul(height),
      anchor.y,
    ).toVar()

    if (stage >= 4) {
      // billboard: rotate around the blade base (anchor), not the origin
      const angle = atan(
        anchor.y.sub(cameraPosition.z),
        anchor.x.sub(cameraPosition.x),
      ).sub(PI.div(2))
      pos.xz.assign(rotateUV(pos.xz, angle, anchor))
    }

    return pos
  })()

  if (stage < 3) {
    material.colorNode = vec3(colorA)
  }
  else {
    material.colorNode = Fn(() => {
      const vertexLoopIndex = varying(vertexIndex.toFloat().mod(3))
      const tipness = varying(step(vertexLoopIndex, 0.5))
      const worldXZ = varying(attribute('position', 'vec2'))
      const base = groundColor(worldXZ)
      const ao = tipness.oneMinus().mul(shadowIntensity)
      return mix(base, base.mul(0.35), ao)
    })()
  }

  return material
}

function createV2Material(stage: number, diffuseMap: Texture | null): MeshBasicNodeMaterial {
  const material = new MeshBasicNodeMaterial()
  material.side = DoubleSide

  const anchor = attribute('anchor', 'vec2')
  const tipness = attribute('tipness', 'float')
  // anchor ∈ [-size/2, size/2] → normalized field UV [0, 1]
  const diffuseNode = stage >= 6 && diffuseMap
    ? texture(diffuseMap, anchor.div(FIELD_SIZE).add(0.5))
    : null

  material.positionNode = Fn(() => {
    const random = attribute('random', 'float')
    const yaw = attribute('yaw', 'float')

    const height = bladeHeight
      .mul(mix(1, random, bladeHeightRandomness))
      .mul(attribute('heightNoise', 'float'))
      .toVar()

    // unit blade → world scale, spun around its own base by the per-blade yaw
    const local = vec3(
      positionGeometry.x.mul(bladeWidth),
      positionGeometry.y.mul(height),
      0,
    ).toVar()
    // slight static pitch around the base; the yaw below spreads its direction
    local.yz.assign(rotateUV(local.yz, attribute('lean', 'float').mul(bladeLean), vec2(0)))
    local.xz.assign(rotateUV(local.xz, yaw, vec2(0)))

    const pos = vec3(local.x.add(anchor.x), local.y, local.z.add(anchor.y)).toVar()

    if (stage >= 7) {
      // tipness doubles as the wind weight: base planted (0), tip travels furthest (1),
      // so the blade curves along its length instead of hinging at the root.
      // taller blades sway more → × height
      const windVec = windOffset(anchor).mul(height).mul(2).toVar()
      pos.addAssign(vec3(windVec.x.mul(tipness), 0, windVec.y.mul(tipness)))

      if (stage >= 8) {
        // arc-length approximation |w|²/2h keeps the blade a constant length:
        // as the tip leans out it drops. clamp so gusts don't flatten it,
        // weight² so the tip drops most
        const droop = windVec.dot(windVec).div(height.mul(2)).min(height.mul(0.35))
        pos.y.subAssign(droop.mul(tipness).mul(tipness))
      }
    }

    return pos
  })()

  material.colorNode = Fn(() => {
    // sampled at the anchor only → constant across the blade (flat color per blade)
    const base = varying(diffuseNode ?? mix(colorA, colorB, attribute('colorNoise', 'float')))
    const ao = varying(tipness).oneMinus().mul(shadowIntensity)
    return mix(base, base.mul(0.35), ao)
  })()

  return material
}

function createGroundMaterial(stage: number, diffuseMap: Texture | null): MeshBasicNodeMaterial {
  const material = new MeshBasicNodeMaterial()
  if (stage >= 6 && diffuseMap) {
    // plane v runs opposite to the blades' anchor-derived v after the -90° X rotation
    material.colorNode = texture(diffuseMap, vec2(uv().x, uv().y.oneMinus()))
  }
  else if (stage >= 3) {
    material.colorNode = groundColor(positionWorld.xz).mul(0.8)
  }
  else {
    material.colorNode = vec3(colorA).mul(0.55)
  }
  return material
}

const diffuseMap = shallowRef<Texture | null>(null)
onMounted(async () => {
  const tex = await new TextureLoader().loadAsync(DIFFUSE_URL)
  tex.colorSpace = SRGBColorSpace
  diffuseMap.value = tex
})

// localTime scaled by strength so wind speed tracks the strength slider
const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  windLocalTime.value += delta * windTimeFrequency.value * windStrength.value
})

const v1SparseGeometry = createV1Geometry(SPARSE_SUBDIVISIONS)
const v1Geometry = createV1Geometry(SUBDIVISIONS)
const v2Geometry = createV2Geometry()
const groundGeometry = new PlaneGeometry(FIELD_SIZE, FIELD_SIZE)

const bladesGeometry = computed(() => {
  if (props.step >= 5) return v2Geometry
  return props.step === 1 ? v1SparseGeometry : v1Geometry
})
const bladesMaterial = computed(() =>
  props.step >= 5
    ? createV2Material(props.step, diffuseMap.value)
    : createV1Material(props.step, props.step === 1 && props.wireframe),
)
const groundMaterial = computed(() => createGroundMaterial(props.step, diffuseMap.value))

watch(bladesMaterial, (_, old) => old?.dispose())
watch(groundMaterial, (_, old) => old?.dispose())

onUnmounted(() => {
  v1SparseGeometry.dispose()
  v1Geometry.dispose()
  v2Geometry.dispose()
  groundGeometry.dispose()
  bladesMaterial.value.dispose()
  groundMaterial.value.dispose()
  diffuseMap.value?.dispose()
})
</script>

<template>
  <TresMesh :geometry="bladesGeometry" :material="bladesMaterial" />
  <TresMesh
    :geometry="groundGeometry"
    :material="groundMaterial"
    :rotation-x="-Math.PI / 2"
    :position="[0, 0.01, 0]"
  />
</template>

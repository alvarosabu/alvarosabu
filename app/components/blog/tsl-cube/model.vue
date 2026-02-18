<script setup lang="ts">
import { Mesh } from 'three'
import { mix, positionLocal, uniform } from 'three/tsl'                                                            
import { Color, MeshStandardNodeMaterial } from 'three/webgpu'                                                     
                                                                                                                    
const material = new MeshStandardNodeMaterial()                                                                    
                                                                                                                    
const topColor = uniform(new Color('#6366f1'))                                                                     
const bottomColor = uniform(new Color('#ec4899'))

const factor = positionLocal.y.mul(0.5).add(0.5)

material.colorNode = mix(bottomColor, topColor, factor)


const { nodes } = useGLTF('https://raw.githubusercontent.com/Tresjs/assets/main/models/gltf/blender-cube.glb', { draco: true })
const model = computed(() => nodes.value?.BlenderCube)

watch(model, (newModel) => {
  newModel.children[0].material = material
})
</script>

<template>
  <primitive v-if="model" :object="model" />
</template>
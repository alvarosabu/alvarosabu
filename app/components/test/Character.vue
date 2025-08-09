<script setup lang="ts">
import type { SceneScene as ChamoType } from '/models/Chamo-2.d.ts'
import { Color, MeshToonMaterial } from 'three'

const { state, nodes, materials } = useGLTF('/models/Chamo-2.glb')

const COLORS = {
  skin: new Color('#C2A498'),
  hair: new Color('#534339'),
  eyes: new Color('#C2A498'),
  mouth: new Color('#C2A498'),
  shoes: new Color('#f4f4f4'),
}

const MATERIALS = {
  skin: new MeshToonMaterial({
    color: COLORS.skin,
  }),
  hair: new MeshToonMaterial({
    color: COLORS.hair,
  }),
}

watchEffect(() => {
  console.log(nodes.value)
  console.log(materials.value)
})

const character = computed(() => nodes.value.ChamoRig)

watch(nodes, (model: ChamoType) => {
  model.Chamo_LongHair.material = MATERIALS.hair
  model.Chamo_BaseHair.material = MATERIALS.hair
  model.Chamo_Head.material = MATERIALS.skin
  model.Chamo_Ears.material = MATERIALS.skin
  model.Chamo_Arms.children[0].material = MATERIALS.skin
  model.Chamo_Arms.children[1].material = new MeshToonMaterial({
    color: COLORS.skin,
    map: materials.value['skin.tattoo']?.map,
    transparent: true,
  })
  model.Chamo_Legs.material = MATERIALS.skin
  model.Chamo_Hands.material = MATERIALS.skin
})

const animations = computed(() => state.value?.animations || [])
const { actions } = useAnimations(animations, character)

const currentAction = ref()

watch(actions, (newActions) => {
  currentAction.value = newActions.Idle
  currentAction.value.play()
})
</script>

<template>
  <primitive v-if="character" :object="character" />
</template>
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core/webgpu'
import { NoToneMapping } from 'three'

defineProps<{ step: number }>()

const wireframe = ref(false)
</script>

<template>
  <div class="relative w-full h-full">
    <TresCanvas alpha :clear-color="0x0a0a0a" :tone-mapping="NoToneMapping">
      <TresPerspectiveCamera :position="[0, 3, 9]" :look-at="[0, 0.5, 0]" />
      <Floor />
      <BlogGrassStepDemoBlades :step="step" :wireframe="wireframe" />
      <OrbitControls :target="[0, 0.5, 0]" :max-polar-angle="Math.PI / 2.05" :max-distance="30" />
    </TresCanvas>
    <USwitch
      v-if="step === 1"
      v-model="wireframe"
      label="Wireframe"
      size="sm"
      class="absolute top-3 right-3 rounded-full bg-default/70 backdrop-blur px-3 py-1.5"
    />
  </div>
</template>

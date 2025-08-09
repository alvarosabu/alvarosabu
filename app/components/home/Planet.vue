<script setup lang="ts">
const { state } = useGLTF('/models/Planet-flat-2.glb')
console.log(state)
</script>

<template>
  <primitive v-if="state?.scene" :object="state.scene" />
</template>
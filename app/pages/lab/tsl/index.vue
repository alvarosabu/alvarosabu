<script setup lang="ts">
import { TresCanvas } from '@tresjs/core/webgpu'
import LabTSLExperience from '~/components/lab/tsl/Experience.vue'
</script>

<template>
  <TresCanvas alpha window-size clear-color="#2f2f2f">
    <LabTSLExperience />
  </TresCanvas>
</template>
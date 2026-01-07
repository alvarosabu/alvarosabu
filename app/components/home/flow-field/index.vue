<script setup lang="ts">
  import { NoToneMapping } from 'three';
  </script>
  <template>
    <TresCanvas window-size :clear-color="'#29191f'" :tone-mapping="NoToneMapping">
      <HomeFlowFieldExperience />
    </TresCanvas>
  </template>
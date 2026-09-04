<script setup lang="ts">
import { LinearSRGBColorSpace, NoToneMapping } from 'three'
import { WebGPURenderer } from 'three/webgpu'
import type { TresRendererSetupContext } from '@tresjs/core'
import type { DropdownMenuItem } from '@nuxt/ui'
import { LOOP_DURATION } from './engines/kit'
import { SOUND_SOURCES } from './sources'
import { soundSourceKey, useSoundSource } from './useSoundSource'

// A fullscreen raymarch costs pixels, not triangles, so native 2x is four
// times the work for detail nobody sees at this scale.
const PIXEL_RATIO_RANGE: [number, number] = [1, 1.5]

const { isDark, colors } = useDarkMode()

const sound = useSoundSource()
provide(soundSourceKey, sound)

function createWebGPURenderer(ctx: TresRendererSetupContext) {
  const renderer = new WebGPURenderer({
    canvas: toValue(ctx.canvas),
    antialias: true,
  })

  // the shader does its own 1/2.2 gamma, so don't convert twice
  renderer.outputColorSpace = LinearSRGBColorSpace

  return renderer
}

const isExperienceReady = useState('homeExperienceReady', () => false)

function onRendererError(error: Error) {
  console.error('[sound-shape] renderer failed to start', error)
  isExperienceReady.value = true
}

const controlIcon = computed(() => {
  if (!sound.hasStarted.value) { return 'i-lucide-play' }
  return sound.isAudible.value ? 'i-lucide-volume-2' : 'i-lucide-volume-off'
})

const controlLabel = computed(() => (sound.hasStarted.value ? undefined : 'START EXPERIENCE'))

const controlAriaLabel = computed(() => {
  if (!sound.hasStarted.value) { return undefined }
  return sound.isAudible.value ? 'Mute the sound' : 'Play the sound'
})

const activeLabel = computed(() =>
  SOUND_SOURCES.find(source => source.id === sound.activeId.value)?.label ?? '',
)

const sourceItems = computed<DropdownMenuItem[]>(() =>
  SOUND_SOURCES.map(source => ({
    label: source.label,
    type: 'checkbox' as const,
    checked: source.id === sound.activeId.value,
    onSelect: () => { sound.setSource(source.id) },
  })),
)
</script>

<template>
  <TresCanvas
    window-size
    :dpr="PIXEL_RATIO_RANGE"
    :renderer="createWebGPURenderer"
    :clear-color="isDark ? colors.DARK : colors.LIGHT"
    :tone-mapping="NoToneMapping"
    class="transition-[filter,scale] duration-[900ms] ease-out motion-reduce:transition-none"
    :class="sound.hasStarted.value ? 'blur-[0px] scale-100' : 'blur-[10px] scale-105'"
    @error="onRendererError"
  >
    <HomeSoundShapeExperience />
  </TresCanvas>
  <ClientOnly>
    <Teleport
      defer
      to="#landing-controls"
    >
      <Transition name="control">
        <UDropdownMenu
          v-if="sound.hasStarted.value"
          :items="sourceItems"
          :content="{ side: 'top', align: 'end' }"
          size="sm"
        >
          <UButton
            :label="activeLabel"
            :loading="sound.isSwitching.value"
            trailing-icon="i-lucide-chevron-up"
            aria-label="Pick which instrument drives the shape"
            color="neutral"
            variant="ghost"
            size="sm"
            class="-my-1 font-mono opacity-40 hover:opacity-100 transition-opacity"
          />
        </UDropdownMenu>
      </Transition>

      <UButton
        :icon="controlIcon"
        :label="controlLabel"
        :aria-label="controlAriaLabel"
        :style="{ animationDuration: `${LOOP_DURATION}s` }"
        color="neutral"
        variant="ghost"
        size="sm"
        class="-my-1 font-mono transition-opacity"
        :class="sound.hasStarted.value ? 'opacity-40 hover:opacity-100' : 'opacity-100 kick-pulse'"
        @click="sound.toggle()"
      />
    </Teleport>
    <Teleport
      defer
      to="#landing-credit"
    >
      <Transition name="credit">
        <span
          v-if="sound.hasStarted.value"
          class="pointer-events-auto"
        >
          Sound shape after
          <ULink
            to="https://www.kynd.info/geom/demos/sound-amplitude/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-highlighted transition-colors"
          >Kynd</ULink>,
          <ULink
            to="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-highlighted transition-colors"
          >CC BY-SA 4.0</ULink>
        </span>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.control-enter-active {
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}
.control-enter-from {
  opacity: 0;
  transform: translateY(2px);
}

/* delayed, so the credit lands after the picker rather than with it */
.credit-enter-active {
  transition: opacity 600ms ease-out 350ms, transform 600ms ease-out 350ms;
}
.credit-enter-from {
  opacity: 0;
  transform: translateY(2px);
}

/**
 * The button thumps the groove it is about to play. Keyframes and peaks follow
 * PARTS.kick.steps, and the duration comes from LOOP_DURATION, so this cannot
 * drift out of time if the BPM changes.
 */
@keyframes kick-pulse {
  /* step 0, velocity 1 */
  0% { opacity: 1; transform: scale(1.05); animation-timing-function: ease-out; }
  8% { opacity: 0.65; transform: scale(1); }

  /* step 3, velocity 0.32 */
  18.25% { opacity: 0.65; transform: scale(1); }
  18.75% { opacity: 0.762; transform: scale(1.016); animation-timing-function: ease-out; }
  26.75% { opacity: 0.65; transform: scale(1); }

  /* step 6, velocity 0.5 */
  37% { opacity: 0.65; transform: scale(1); }
  37.5% { opacity: 0.825; transform: scale(1.025); animation-timing-function: ease-out; }
  45.5% { opacity: 0.65; transform: scale(1); }

  /* step 8, velocity 1 */
  49.5% { opacity: 0.65; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); animation-timing-function: ease-out; }
  58% { opacity: 0.65; transform: scale(1); }

  /* step 13, velocity 0.4 */
  80.75% { opacity: 0.65; transform: scale(1); }
  81.25% { opacity: 0.79; transform: scale(1.02); animation-timing-function: ease-out; }
  89.25% { opacity: 0.65; transform: scale(1); }

  /* step 15, velocity 0.22 */
  93.25% { opacity: 0.65; transform: scale(1); }
  93.75% { opacity: 0.727; transform: scale(1.011); animation-timing-function: ease-out; }
  100% { opacity: 0.65; transform: scale(1); }
}

.kick-pulse {
  /* linear overall: the per-keyframe ease-out owns the decay */
  animation-name: kick-pulse;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@media (prefers-reduced-motion: reduce) {
  .kick-pulse {
    animation: none;
  }
}
</style>

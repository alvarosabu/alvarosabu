import type { InjectionKey, Ref } from 'vue'
import type { SoundEngine } from './engines/types'
import { DEFAULT_SOURCE_ID, SOUND_SOURCES } from './sources'

const MASTER_LEVEL = 0.35
const START_RAMP = 0.15
const CROSSFADE = 0.12
const MUTE_RAMP = 0.1

export interface SoundSource {
  isAudible: Ref<boolean>
  /** True from the first start, and stays true if the visitor mutes again. */
  hasStarted: Ref<boolean>
  activeId: Ref<string>
  isSwitching: Ref<boolean>
  /** Loudness now, 0..1. Read every frame, so never reactive. */
  sample: () => number
  toggle: () => void
  setSource: (id: string) => Promise<void>
  dispose: () => void
}

export const soundSourceKey: InjectionKey<SoundSource> = Symbol('sound-shape-source')

/**
 * Owns the audio session. `hasStarted` and `isAudible` belong to the visitor,
 * not to whatever is playing, so switching sources mid-session never resets the
 * shape or opens a second AudioContext.
 */
export function useSoundSource(): SoundSource {
  const isAudible = ref(false)
  const hasStarted = ref(false)
  const activeId = ref(DEFAULT_SOURCE_ID)
  const isSwitching = ref(false)

  let context: AudioContext | null = null
  let master: GainNode | null = null
  let engine: SoundEngine | null = null
  let slot: GainNode | null = null
  let startedAt = 0
  let fading: { engine: SoundEngine, slot: GainNode, until: number } | null = null

  function definitionFor(id: string) {
    return SOUND_SOURCES.find(source => source.id === id) ?? SOUND_SOURCES[0]!
  }

  function enable() {
    if (!context) {
      // must happen inside the click handler, or autoplay policy suspends it
      context = new AudioContext()
      master = context.createGain()
      master.gain.value = 0
      master.connect(context.destination)
    }

    context.resume()

    if (!engine) {
      slot = context.createGain()
      slot.connect(master!)
      engine = definitionFor(activeId.value).create()
      engine.start(context, slot)
      startedAt = context.currentTime
    }

    master!.gain.cancelScheduledValues(context.currentTime)
    master!.gain.setValueAtTime(master!.gain.value, context.currentTime)
    master!.gain.linearRampToValueAtTime(MASTER_LEVEL, context.currentTime + START_RAMP)

    isAudible.value = true
    hasStarted.value = true
  }

  function disable() {
    if (!context || !master) { return }

    // ramp rather than cut, so scheduled voices fade instead of clicking
    master.gain.cancelScheduledValues(context.currentTime)
    master.gain.setValueAtTime(master.gain.value, context.currentTime)
    master.gain.linearRampToValueAtTime(0.0001, context.currentTime + MUTE_RAMP)

    isAudible.value = false
  }

  function toggle() {
    if (isAudible.value) { disable() }
    else { enable() }
  }

  async function setSource(id: string) {
    if (id === activeId.value) { return }

    const definition = SOUND_SOURCES.find(source => source.id === id)
    if (!definition) { return }

    const previousId = activeId.value
    activeId.value = id

    // before the first start there is no graph yet, so enable() builds it
    if (!context || !engine || !slot) { return }

    const nextSlot = context.createGain()
    nextSlot.gain.value = 0
    nextSlot.connect(master!)
    const nextEngine = definition.create()

    isSwitching.value = true
    try {
      await nextEngine.start(context, nextSlot)
    }
    catch (error) {
      // a background texture isn't worth an error toast: keep playing what works
      console.error('[sound-shape] source failed to start', error)
      nextEngine.dispose()
      nextSlot.disconnect()
      activeId.value = previousId
      isSwitching.value = false
      return
    }
    isSwitching.value = false

    const at = context.currentTime
    nextSlot.gain.setValueAtTime(0, at)
    nextSlot.gain.linearRampToValueAtTime(1, at + CROSSFADE)

    const outgoing = { engine, slot, until: at + CROSSFADE }
    outgoing.slot.gain.setValueAtTime(outgoing.slot.gain.value, at)
    outgoing.slot.gain.linearRampToValueAtTime(0, at + CROSSFADE)
    fading = outgoing

    engine = nextEngine
    slot = nextSlot

    setTimeout(() => {
      outgoing.engine.stop()
      outgoing.engine.dispose()
      outgoing.slot.disconnect()
      if (fading === outgoing) { fading = null }
    }, CROSSFADE * 1000 + 50)
  }

  // Still until the visitor starts it, so the first hit is what brings the
  // shape to life. The outgoing engine keeps being sampled through a switch, so
  // the shape hands over as smoothly as the audio does.
  function sample(): number {
    if (!context || !engine) { return 0 }

    const at = context.currentTime
    let amplitude = engine.sample()

    if (fading) {
      const remaining = (fading.until - at) / CROSSFADE
      if (remaining <= 0) { fading = null }
      else { amplitude = amplitude * (1 - remaining) + fading.engine.sample() * remaining }
    }

    return amplitude * Math.min((at - startedAt) / START_RAMP, 1)
  }

  function dispose() {
    engine?.stop()
    engine?.dispose()
    fading?.engine.dispose()
    engine = null
    fading = null
    context?.close()
    context = null
    master = null
    slot = null
    isAudible.value = false
  }

  onBeforeUnmount(dispose)

  return {
    isAudible,
    hasStarted,
    activeId,
    isSwitching,
    sample,
    toggle,
    setSource,
    dispose,
  }
}

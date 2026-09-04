export interface SoundEngine {
  /** Loudness now, 0..1. Read every frame, so never reactive. */
  sample: () => number
  start: (context: AudioContext, destination: AudioNode) => Promise<void> | void
  stop: () => void
  dispose: () => void
  /** Seconds of one loop, for UI that beats in time. `null` when irregular. */
  loopDuration: number | null
}

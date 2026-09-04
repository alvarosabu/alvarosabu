import type { SoundEngine } from './types'

/**
 * A synthesized drum kit on one 16-step clock.
 *
 * The original demo reads each stem's amplitude from a `.bin` baked offline
 * next to the mp3. We can't ship that audio, so the stems are synthesized and
 * the amplitude stays a closed-form function of time: `partAmplitudeAt()` and
 * `applyEnvelope()` describe the same curve on the same clock, so what you hear
 * and what the shape does cannot drift apart.
 */

const BPM = 118
const STEP_DURATION = 60 / BPM / 4
const STEPS = 16

export const LOOP_DURATION = STEPS * STEP_DURATION

const LOOKAHEAD = 0.15
const SCHEDULER_INTERVAL = 25

export type PartId = 'kick' | 'bass' | 'hat' | 'snare'

type PlayVoice = (
  context: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number,
  frequency: number,
) => AudioScheduledSourceNode[]

interface Part {
  /** Velocity per 16th note. 0 is a rest. */
  steps: number[]
  /** Hz per 16th note, read only where the step has a velocity. */
  pitches?: number[]
  /** Envelope rates in 1/s. */
  attack: number
  decay: number
  /** Peak audio gain at a velocity of 1. */
  level: number
  /** How much this part counts toward the master's amplitude. */
  masterWeight: number
  play: PlayVoice
}

function envelopeAt(secondsSinceHit: number, attack: number, decay: number): number {
  return (1 - Math.exp(-secondsSinceHit * attack)) * Math.exp(-secondsSinceHit * decay)
}

// The attack/decay product peaks below 1, so velocity 1 would never reach full
// amplitude. Solve for the turning point and normalise against it.
function envelopePeak(attack: number, decay: number): number {
  return envelopeAt(Math.log((attack + decay) / decay) / attack, attack, decay)
}

function tailOf(decay: number): number {
  return 4 / decay + 0.05
}

function applyEnvelope(param: AudioParam, time: number, peak: number, attack: number, decay: number) {
  param.setValueAtTime(0.0001, time)
  param.linearRampToValueAtTime(peak, time + 1 / attack)
  param.exponentialRampToValueAtTime(0.0001, time + 4 / decay)
}

const noiseBuffers = new WeakMap<AudioContext, AudioBuffer>()

function noiseBuffer(context: AudioContext): AudioBuffer {
  let buffer = noiseBuffers.get(context)
  if (!buffer) {
    buffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
    const samples = buffer.getChannelData(0)
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.random() * 2 - 1
    }
    noiseBuffers.set(context, buffer)
  }
  return buffer
}

function playNoise(
  context: AudioContext,
  destination: AudioNode,
  time: number,
  peak: number,
  attack: number,
  decay: number,
  filter: BiquadFilterNode,
): AudioScheduledSourceNode {
  const source = context.createBufferSource()
  source.buffer = noiseBuffer(context)
  source.loop = true

  const gain = context.createGain()
  applyEnvelope(gain.gain, time, peak, attack, decay)

  source.connect(filter).connect(gain).connect(destination)
  // random offset, so repeated hits aren't the same sample
  source.start(time, Math.random() * 0.9)
  source.stop(time + tailOf(decay))
  return source
}

export const PARTS: Record<PartId, Part> = {
  // The pulse keyframes in index.vue are hand-matched to this row.
  kick: {
    steps: [1, 0, 0, 0.32, 0, 0, 0.5, 0, 1, 0, 0, 0, 0, 0.4, 0, 0.22],
    attack: 320,
    decay: 8.5,
    level: 0.9,
    masterWeight: 1,
    play(context, destination, time, velocity) {
      const oscillator = context.createOscillator()
      const gain = context.createGain()

      oscillator.frequency.setValueAtTime(150, time)
      oscillator.frequency.exponentialRampToValueAtTime(45, time + 0.12)
      applyEnvelope(gain.gain, time, velocity * this.level, this.attack, this.decay)

      oscillator.connect(gain).connect(destination)
      oscillator.start(time)
      oscillator.stop(time + tailOf(this.decay))
      return [oscillator]
    },
  },

  bass: {
    steps: [0.9, 0, 0, 0, 0, 0, 0.6, 0, 0.9, 0, 0, 0.5, 0, 0, 0.7, 0],
    pitches: [55, 0, 0, 0, 0, 0, 55, 0, 82.41, 0, 0, 49, 0, 0, 65.41, 0],
    attack: 60,
    decay: 4,
    level: 0.5,
    masterWeight: 0.8,
    play(context, destination, time, velocity, frequency) {
      const oscillator = context.createOscillator()
      const filter = context.createBiquadFilter()
      const gain = context.createGain()

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(frequency, time)
      // keeps the triangle under the kick instead of fighting it for the low band
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(320, time)
      applyEnvelope(gain.gain, time, velocity * this.level, this.attack, this.decay)

      oscillator.connect(filter).connect(gain).connect(destination)
      oscillator.start(time)
      oscillator.stop(time + tailOf(this.decay))
      return [oscillator]
    },
  },

  hat: {
    steps: [0.5, 0.22, 0.35, 0.22, 0.5, 0.22, 0.35, 0.28, 0.5, 0.22, 0.35, 0.22, 0.5, 0.28, 0.4, 0.6],
    attack: 900,
    decay: 45,
    level: 0.22,
    masterWeight: 0.3,
    play(context, destination, time, velocity) {
      const filter = context.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.setValueAtTime(7000, time)
      return [playNoise(context, destination, time, velocity * this.level, this.attack, this.decay, filter)]
    },
  },

  snare: {
    steps: [0, 0, 0, 0, 1, 0, 0, 0.18, 0, 0, 0.22, 0, 1, 0, 0.3, 0],
    attack: 500,
    decay: 18,
    level: 0.4,
    masterWeight: 0.7,
    play(context, destination, time, velocity) {
      const filter = context.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1900, time)
      filter.Q.setValueAtTime(0.7, time)
      const noise = playNoise(context, destination, time, velocity * this.level, this.attack, this.decay, filter)

      // a tuned body under the noise, or it reads as a hiss and not a drum
      const body = context.createOscillator()
      const bodyGain = context.createGain()
      body.type = 'triangle'
      body.frequency.setValueAtTime(180, time)
      applyEnvelope(bodyGain.gain, time, velocity * this.level * 0.5, this.attack, this.decay * 1.6)
      body.connect(bodyGain).connect(destination)
      body.start(time)
      body.stop(time + tailOf(this.decay * 1.6))

      return [noise, body]
    },
  },
}

export function partAmplitudeAt(part: Part, patternTime: number): number {
  const local = ((patternTime % LOOP_DURATION) + LOOP_DURATION) % LOOP_DURATION
  const peak = envelopePeak(part.attack, part.decay)
  let amplitude = 0

  for (let step = 0; step < STEPS; step++) {
    const velocity = part.steps[step]!
    if (velocity === 0) { continue }

    let elapsed = local - step * STEP_DURATION
    // a hit late in the loop is still ringing at the start of the next one
    if (elapsed < 0) { elapsed += LOOP_DURATION }

    amplitude = Math.max(amplitude, velocity * envelopeAt(elapsed, part.attack, part.decay) / peak)
  }

  return amplitude
}

/** A single part drives the shape at full range; in a mix the weights apply. */
export function kitAmplitudeAt(partIds: PartId[], patternTime: number): number {
  const weighted = partIds.length > 1
  let amplitude = 0

  for (const id of partIds) {
    const part = PARTS[id]
    const value = partAmplitudeAt(part, patternTime) * (weighted ? part.masterWeight : 1)
    amplitude = Math.max(amplitude, value)
  }

  return amplitude
}

export function createKitEngine(partIds: PartId[]): SoundEngine {
  let context: AudioContext | null = null
  let destination: AudioNode | null = null
  let schedulerId: ReturnType<typeof setInterval> | null = null

  let origin = 0
  let nextStep = 0
  let nextStepTime = 0

  const voices = new Set<AudioScheduledSourceNode>()

  function patternTime(): number {
    return context ? context.currentTime - origin : 0
  }

  function scheduleAhead() {
    if (!context || !destination) { return }

    while (nextStepTime < context.currentTime + LOOKAHEAD) {
      const step = nextStep % STEPS

      for (const id of partIds) {
        const part = PARTS[id]
        const velocity = part.steps[step]!
        if (velocity === 0) { continue }

        for (const voice of part.play(context, destination, nextStepTime, velocity, part.pitches?.[step] ?? 0)) {
          voices.add(voice)
          voice.onended = () => voices.delete(voice)
        }
      }

      nextStep += 1
      nextStepTime += STEP_DURATION
    }
  }

  return {
    loopDuration: LOOP_DURATION,

    sample() {
      return context ? kitAmplitudeAt(partIds, patternTime()) : 0
    },

    start(audioContext, audioDestination) {
      context = audioContext
      destination = audioDestination

      // anchored here, so the first thing anyone hears is a downbeat
      origin = context.currentTime
      nextStep = 0
      nextStepTime = origin

      scheduleAhead()
      schedulerId ??= setInterval(scheduleAhead, SCHEDULER_INTERVAL)
    },

    stop() {
      if (schedulerId !== null) {
        clearInterval(schedulerId)
        schedulerId = null
      }
      for (const voice of voices) {
        // already-stopped nodes throw rather than no-op
        try { voice.stop() }
        catch { /* already finished */ }
      }
      voices.clear()
    },

    dispose() {
      this.stop()
      context = null
      destination = null
    },
  }
}

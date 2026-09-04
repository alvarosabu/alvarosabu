import type { SoundEngine } from './engines/types'
import { createKitEngine } from './engines/kit'
import type { PartId } from './engines/kit'

export interface SoundSourceDefinition {
  id: string
  label: string
  create: () => SoundEngine
}

function kit(...parts: PartId[]) {
  return () => createKitEngine(parts)
}

// Mirrors the original demo's stem selector: picking a part plays it alone and
// drives the shape from it.
export const SOUND_SOURCES: SoundSourceDefinition[] = [
  { id: 'bass', label: 'bass', create: kit('bass') },
  { id: 'hat', label: 'hat', create: kit('hat') },
  { id: 'kick', label: 'kick', create: kit('kick') },
  { id: 'snare', label: 'snare', create: kit('snare') },
  { id: 'master', label: 'master', create: kit('kick', 'bass', 'snare', 'hat') },
]

export const DEFAULT_SOURCE_ID = 'kick'

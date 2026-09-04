/**
 * The landing chrome (frame, header, footer) holds back until the loading
 * overlay clears, so the shader gets the first moment on its own.
 *
 * Whoever owns that moment calls `reveal()`. Usually that's the page, on a
 * timer after the overlay hides. A shader that has its own cue (a first kick,
 * a morph settling) can opt out of the timer and call `reveal()` itself.
 */
export const DEFAULT_REVEAL_DELAY = 1000

export function useHomeReveal() {
  const isRevealed = useState('homeRevealed', () => false)

  let timer: ReturnType<typeof setTimeout> | undefined

  function reveal() {
    isRevealed.value = true
  }

  function cancelReveal() {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function revealAfter(delay: number = DEFAULT_REVEAL_DELAY) {
    cancelReveal()
    timer = setTimeout(reveal, delay)
  }

  // Guarded: the composable is also called from the layout, outside any scope
  // that owns a timer.
  if (getCurrentScope()) {
    onScopeDispose(cancelReveal)
  }

  return { isRevealed, reveal, revealAfter, cancelReveal }
}

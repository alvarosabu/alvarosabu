<script setup lang="ts">
interface Props {
  text: string
  speed?: number
}

const { text, speed = 128 } = defineProps<Props>()

const displayText = shallowRef('')
let remainingMutations = 100

const C = '▇'

// Initialize with random characters
onMounted(() => {
  displayText.value = text.split('').map(char => char === ' ' ? ' ' : C).join('')
  remainingMutations = 100

  setInterval(mutate, speed)
})

watch(() => text, () => {
  remainingMutations = 100
  displayText.value = text.split('').map(char => char === ' ' ? ' ' : C).join('')
})

function mutate() {
  if (remainingMutations < 0) {
    return
  }
  remainingMutations--

  if (remainingMutations === 0) {
    displayText.value = text
  } else {
    if (!displayText.value || !text) {
      return
    }

    const dLength = displayText.value.length - text.length
    if (dLength < 0) {
      displayText.value += text[displayText.value.length] === ' ' ? ' ' : C
    } else if (dLength > 0) {
      displayText.value = displayText.value.substring(0, displayText.value.length - 1)
    } else {
      const incorrectCharacterIndices = [] as number[]
      for (let i = 0; i < displayText.value.length; i++) {
        if (displayText.value[i] !== text[i]) incorrectCharacterIndices.push(i)
      }
      const dIncorrect = incorrectCharacterIndices.length
      if (dIncorrect > 0) {
        shuffle(incorrectCharacterIndices)
        const numToCorrect = dIncorrect > 10 ? Math.min(dIncorrect, Math.floor(Math.random() * 10 + 1)) : 1
        for (let i = 0; i < numToCorrect; i++) {
          const idx = incorrectCharacterIndices.pop() as number
          const c = displayText.value[idx]
          if (c === C) {
            displayText.value = replaceAt(displayText.value, idx, text[idx])
          } else {
            displayText.value = replaceAt(displayText.value, idx, text[idx] === ' ' ? ' ' : C)
          }
        }
      }
    }
  }
}

function shuffle<T>(array: T[]) {
  let currentIndex = array.length

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}

function replaceAt(s: string, index: number, replacement: string) {
  return s.substring(0, index) + replacement + s.substring(index + replacement.length)
}
</script>

<template>
  <span class="font-pixel">{{ displayText }}</span>
</template>

export const colors = {
    DARK: '#0a0a0a',
    DARK_STROKE: '#141414',
    LIGHT: '#f8f8f8',
    LIGHT_STROKE: '#f5f5f5',
    DARK_TEXT: '#ffffff',
    LIGHT_TEXT: '#000000',
  }

export const useDarkMode = () => {
  const colorMode = useColorMode()
  const isDark = computed({
    get() {
      return colorMode.value === 'dark'
    },
    set(_isDark) {
      colorMode.preference = _isDark ? 'dark' : 'light'
    }
  })

  return {
    colorMode,
    isDark,
    colors
  }
}
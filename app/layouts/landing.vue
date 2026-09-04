<script setup lang="ts">
  const experimentNumber = useState('experimentNumber', () => 0)
  const shaderComponentsLength = useState('shaderComponentsLength', () => 0)

  const { isRevealed } = useHomeReveal()

  const revealTransition = 'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none'
</script>

<template>
  <div class="p-4 md:p-8 xl:p-16 min-h-screen">
    <div
      class="bordered-container bordered-container-reveal relative z-1 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)] flex flex-col"
      :data-revealed="isRevealed ? '' : undefined"
    >x
      <div
        class="relative z-50"
        :class="[revealTransition, 'delay-[120ms]', isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1']"
      >
        <TheHeader />
      </div>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
      <footer class="flex items-end justify-between p-6 md:p-8 z-1">
        <div
          class="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight"
          :class="[revealTransition, 'delay-[240ms]', isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1']"
        >
          <MutatingText text="CREATIVE" /><br><MutatingText text="SOFTWARE ENGINEER" />
        </div>
        <div
          class="flex items-center gap-3 text-sm md:text-base font-mono"
          :class="[revealTransition, 'delay-[240ms]', isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1']"
        >
          <div
            id="landing-controls"
            class="flex items-center gap-1 empty:hidden"
          />
          <span>0{{ experimentNumber }}/0{{ shaderComponentsLength - 1}}</span>
        </div>
      </footer>
    </div>
    <div
      id="landing-credit"
      class="relative z-2 flex justify-end pt-2 pr-6 md:pr-8 text-[10px] leading-none font-mono text-muted pointer-events-none empty:hidden"
    />
  </div>
</template>

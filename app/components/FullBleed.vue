<template>
  <!--
    Breaks out of the prose column to the width of the layout's <main>, which is a container
    query root (see layouts/single.vue). cqw measures main's content box, so the vertical
    scrollbar is excluded and no horizontal overflow appears. 100vw would be clipped by the
    bordered frame around main.
  -->
  <div class="relative left-1/2 w-[100cqw] -translate-x-1/2 my-8">
    <UContainer>
      <slot />
    </UContainer>
  </div>
</template>

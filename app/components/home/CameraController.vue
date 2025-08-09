<script setup lang="ts">
import { gsap } from 'gsap'

// Initial camera position (starting point for animation)
const cameraInitialPosition: [number, number, number] = [-2, 0, 7]

// Final camera position (end point for animation)  
const cameraFinalPosition: [number, number, number] = [-0.5942654684151276, 1.7888183668332087, 1.681371610296642]
const cameraFinalRotation: [number, number, number] = [-0.3190826182205291, -0.031226182411073163, -0.010314201227103333]

// Reactive camera properties that will be animated
const cameraPosition = ref<[number, number, number]>([...cameraInitialPosition])
const cameraRotation = ref<[number, number, number]>([0, 0, 0])

/**
 * Animates the camera from initial position to final position using GSAP
 * Creates a smooth transition over 3 seconds with ease-out timing
 */
const animateCamera = (): void => {
  // Create a timeline for coordinated camera animations
  const tl = gsap.timeline()
  
  // Animate camera position
  tl.to(cameraPosition.value, {
    duration: 3,
    ease: "power2.out",
    0: cameraFinalPosition[0], // x
    1: cameraFinalPosition[1], // y 
    2: cameraFinalPosition[2], // z
  })
  
  // Animate camera rotation simultaneously
  tl.to(cameraRotation.value, {
    duration: 3,
    ease: "power2.out",
    0: cameraFinalRotation[0], // x rotation
    1: cameraFinalRotation[1], // y rotation
    2: cameraFinalRotation[2], // z rotation
  }, 0) // Start at time 0 (simultaneously with position)
}


// Start animation when component is mounted
onMounted(() => {
  // Small delay to ensure scene is ready
  setTimeout(animateCamera, 500)
})
</script>
<template>
<TresPerspectiveCamera 
  :position="[cameraPosition[0], cameraPosition[1], cameraPosition[2]]" 
  :look-at="[-2, 0, 0]" 
  :rotation="[cameraRotation[0], cameraRotation[1], cameraRotation[2]]" 
/>
</template>
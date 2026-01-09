---
title: Shader Editor Test
description: Testing the interactive shader editor component
status: draft
date: 2026-01-08
thumbnail: /avatar.png
---

This is a test of the interactive shader editor component.

::shader-editor
::

## Custom Shader Example

Here's a shader with custom code:

:::shader-editor
```glsl
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 color = vec3(uv.x, uv.y, sin(uTime));
  gl_FragColor = vec4(color, 1.0);
}
```
:::

## Complex Shader Example

Here's a more complex shader with scrolling:

:::shader-editor
```glsl
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec2 vUv;

// Simplex noise function
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractal Brownian Motion
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 2.0;

  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return value;
}

// Color palette function
vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  vec2 mouseInfluence = uMouse * 2.0 - 1.0;

  // Apply mouse influence
  uv += mouseInfluence * 0.1;

  // Create animated noise
  float noise1 = fbm(uv * 3.0 + uTime * 0.1);
  float noise2 = fbm(uv * 2.0 - uTime * 0.15);

  // Combine noises
  float combined = (noise1 + noise2) * 0.5;

  // Create color based on noise
  vec3 color = palette(combined + uTime * 0.1);

  // Add some highlights based on distance from mouse
  float dist = length(uv - mouseInfluence);
  color += vec3(0.1) * (1.0 - smoothstep(0.0, 0.5, dist));

  // Vignette effect
  float vignette = 1.0 - length(vUv - 0.5) * 0.8;
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
```
::: 





















































































---
title: Shaders 101
description: A guide to shaders
status: draft
date: 2025-11-18
---

# Shaders 101

## What are shaders?

Shaders are programs that run on the GPU. They are used to render 3D graphics.

## How do shaders work?

- fragment shader
- vertex shader

## Fragment shader

The fragment shader is responsible for rendering the final color of each pixel.

## Vertex shader

The vertex shader is responsible for transforming the vertices of the mesh.

## Attributes

Attributes are **per-vertex data** sent from JavaScript to the **vertex shader**. Each vertex gets its own attribute values.

**Common attributes:**
- `position` - vertex coordinates (vec3)
- `normal` - surface normal direction (vec3)
- `uv` - texture coordinates (vec2)
- `color` - vertex color (vec3/vec4)

**Example:**
```glsl
// Vertex shader - automatically available with ShaderMaterial
attribute vec3 position;  // each vertex's position
attribute vec2 uv;        // each vertex's UV coordinate

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## Uniforms

Uniforms are **global values** that remain constant for all vertices and fragments in a single draw call. They're set from JavaScript and can be updated each frame.

**Common uniforms:**
- `uTime` - elapsed time for animations
- `uResolution` - canvas/viewport size
- `uMouse` - mouse/pointer position
- `uTexture` - texture samplers
- Transformation matrices (modelViewMatrix, projectionMatrix)

**Example:**
```glsl
// Fragment shader
uniform float uTime;
uniform vec2 uMouse;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 color = vec3(sin(uTime), cos(uTime), 0.5);
  gl_FragColor = vec4(color, 1.0);
}
```

```ts
// JavaScript - updating uniforms
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() }
  }
})

// In animation loop
material.uniforms.uTime.value = clock.getElapsedTime()
```

## Varyings

Varyings are values passed **from the vertex shader to the fragment shader**. They're automatically interpolated across the triangle's surface for each fragment.

::prose-note
Interpolation is the process of calculating the value of a varying for a given fragment.

For example, if a triangle has vertices with `vUv` values of `(0,0)`, `(1,0)`, and `(0,1)`, a fragment in the center will receive an interpolated value like `(0.33, 0.33)`.

This is useful for things like lighting, shadows, and other effects that need to be interpolated across the surface of the mesh.
::

**Example:**
```glsl
// Vertex shader - declare and set the varying
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;              // pass UV to fragment shader
  vNormal = normal;      // pass normal to fragment shader
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

```glsl
// Fragment shader - receive interpolated values
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // vUv is now interpolated for this specific fragment
  vec3 color = vec3(vUv, 0.5);
  gl_FragColor = vec4(color, 1.0);
}
```

**Key concept:** If a triangle has vertices with `vUv` values of `(0,0)`, `(1,0)`, and `(0,1)`, a fragment in the center will receive an interpolated value like `(0.33, 0.33)`.
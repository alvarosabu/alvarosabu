---
title: Intro to TSL
date: 2026-02-15
description: .
navigation:
  title: Intro to TSL
status: draft
tags:
  - webgpu
  - tsl
  - shaders
thumbnail: https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Blog_oet7tv.png
readingTime:
  text: 3 min read
  minutes: 2.535
  time: 152100
  words: 507
---

::SceneWrapper
 ::BlogTSLCube
 ::
::

Creating shaders has always been challenging, even seasoned developers have never wrote GLSL code by themselves. If you've spent time fighting with `onBeforeCompile()` or rebuilding entire rendering pipelines with `ShaderMaterial` you know what I'm talking about.

TSL (Three.js Shader Language) offers a new approach, a node based alternative to GLSL which integrates directly with Three.js material system.

This post will serve as a short introduction to TSL, how to get started and why is a great tool for creative web developers.

::u-timeline
---
items:
  - title: r160
    description: TSL introduced as part of the WebGPU renderer work
    date: December 2023
    icon: i-lucide-rocket
  - title: r162 - r165
    description: TSL becomes more stable and officially documented
    icon: i-lucide-shield-check
  - title: r167
    description: "`three/tsl` import path standardized"
    date: August 2024
    icon: i-lucide-package
---
::

## GLSL limitations

If you ever wanted to customize a material in {@Threejs} beyond what the built-in properties offered, you had two relative painful options:

**Option 1**: `onBeforeCompile()`  hack to replace the shader string before the material compiles:

```ts [custom-material.ts]
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 }
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
        #include <begin_vertex>
        transformed.y += sin(position.x * 10.0 + uTime) * 0.1;
      `
    )
  }
```

Yikes 🥴

**Option 2**: Create a `ShaderMaterial` from scratch

::code-tree{default-value="material.ts"}
```typescript [material.ts]
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { Color, ShaderMaterial } from 'three'

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uColorA: { value: new Color('#6366f1') },
    uColorB: { value: new Color('#ec4899') },
  },
})
```

```glsl [shaders/vertex.glsl]
varying vec2 vUv;                                                
void main() {                                                    
  vUv = uv;                                                      
  gl_Position = projectionMatrix * modelViewMatrix *             
vec4(position, 1.0);
}
```

```glsl [shaders/fragment.glsl]
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(uColorA, uColorB, vUv.y), 1.0);
}
```
::

Both approaches share the same fundamental issues:

- Strings, not code — GLSL lives in template literals. No IDE support, no typechecking, errors only at GPU compile time
- Fragile, easily broken if Three.js changes the shader code internally.
- LOL, debugging 🥲
- Manually managing uniforms and attributes, no automatic injection.
- Not composable — you can't easily combine two shader effects or reuse pieces across
  materials

## TSL to the rescue

TSL is a node based JavaScript API for creating shaders. It is designed to replace the string concatenation madness into composable shader operations using functions.

```ts [custom-material.ts]
import { mix, positionLocal, uniform } from 'three/tsl'                                                            
import { Color, MeshStandardNodeMaterial } from 'three/webgpu'                                                     
                                                                                                                    
const material = new MeshStandardNodeMaterial()                                                                    
                                                                                                                    
const topColor = uniform(new Color('#6366f1'))                                                                     
const bottomColor = uniform(new Color('#ec4899'))

const factor = positionLocal.y.mul(0.5).add(0.5)

material.colorNode = mix(bottomColor, topColor, factor)
```

Isn't that beautiful 🥹? No more strings templates. Just typescript code describing what is happening. Is no longer imperative code but composable building blocks that you can combine, reuse, and more important, inspect.

## How TSL works

The magic behind TSL is the concept of **nodes** — Objects that represent shaders properties and their operations.

Why nodes? Because node-based shading is already the standard in the 3D and game industry. Blender's Editor, Unreal's Material Editor, Unity's Shader Graph all work this way. TSL brings that same mental model to the web.

To visualize it better, lets take the gradient between {@#6366f1} and {@#ec4899} shader example we used before and replicate it in Blender:

![Blender Shading Nodes](/blog/intro-to-tsl/blender-shading-nodes.png)

::note
**Heads up** ☝

:br

Three.js uses **Y-up** while Blender uses **Z-up**, so the vertical axis in TSL is `positionLocal.y` but corresponds to the Z output in Blender's Separate XYZ node.
::

If we look closely, we can do a 1:1 mapping with our TSL code:

| Blender Node                                   | TSL                                  |
| ---------------------------------------------- | ------------------------------------ |
| Texture Coordinate (Object) → Separate XYZ → Z | `positionLocal.y`                    |
| Multiply (× 0.5)                               | `.mul(0.5)`                          |
| Add (+ 0.5)                                    | `.add(0.5)`                          |
| Color A (#ec4899)                              | `bottomColor`                        |
| Color B (#6366f1)                              | `topColor`                           |
| Mix → Factor                                   | `mix(bottomColor, topColor, factor)` |
| Principled BSDF → Base Color                   | `material.colorNode =`               |

![One to one mapping between Blender and TSL](/blog/intro-to-tsl/one-to-one-mapping.png)

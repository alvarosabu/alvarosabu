---
title: Noise in Shaders
description: Understanding different types of noise functions in GLSL and how to use them for creative effects
status: draft
date: 2025-11-18
thumbnail: https://res.cloudinary.com/alvarosaburido/image/upload/v1717241599/portfolio/og/v3/Open_Graph_-_Blog_oet7tv.png
---

Noise is fundamental to procedural generation in shaders. It allows you to create organic textures, terrain, clouds, water effects, and countless other visual phenomena without needing texture images.

## Types of Noise

Not all noise is created equal. Different types of noise produce different visual results and have different performance characteristics.

### White Noise (Random)

White noise generates completely random values where each pixel is independent. This creates a static/TV grain effect. Formula from the [book of shaders](https://thebookofshaders.com/10/).


```glsl
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  float noise = random(vUv);
  gl_FragColor = vec4(vec3(noise), 1.0);
}
```

**Use cases:**
- Film grain effects
- Particle randomization
- Glitch effects
- Dithering

**Pros:** Fastest, simplest implementation
**Cons:** Not organic-looking, very harsh transitions

### Value Noise

Value noise interpolates between random values at grid points, creating smooth transitions.

```glsl
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners of the grid cell
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  // Smooth interpolation (smoothstep)
  vec2 u = f * f * (3.0 - 2.0 * f);

  // Mix the four corners
  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

void main() {
  float noise = valueNoise(vUv * 10.0);
  gl_FragColor = vec4(vec3(noise), 1.0);
}
```

**Use cases:**
- Simple terrain generation
- Cloud patterns
- Water surfaces
- Procedural textures

**Pros:** Smooth, organic appearance
**Cons:** Can show grid artifacts at certain scales

### Perlin Noise

Perlin noise uses gradient vectors at grid points, producing more natural patterns without directional artifacts.

::prose-note
Perlin noise is one of the most famous noise algorithms, created by Ken Perlin in 1983. It won him an Academy Award for Technical Achievement in 1997!
::

**Use cases:**
- Natural terrain
- Wood grain
- Marble textures
- Animated effects

**Pros:** Very natural appearance, no grid artifacts
**Cons:** More complex to implement, slower than value noise

### Simplex Noise

Simplex noise is an improved version of Perlin noise with better performance and fewer directional artifacts.

```glsl
// Simplified 2D simplex noise (full implementation is quite long)
// For production, use a library like:
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0

  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
```

**Use cases:**
- Professional terrain generation
- Procedural textures
- Any application requiring high-quality noise

**Pros:** Best quality, fewer artifacts than Perlin, better performance
**Cons:** Complex implementation

## Advanced Techniques

### Fractal Brownian Motion (FBM)

Layering multiple octaves of noise at different frequencies and amplitudes creates rich, detailed patterns.

```glsl
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  // Typically 4-8 octaves
  for (int i = 0; i < 5; i++) {
    value += amplitude * valueNoise(st * frequency);
    frequency *= 2.0;  // Each octave doubles frequency
    amplitude *= 0.5;  // Each octave halves amplitude
  }

  return value;
}

void main() {
  float noise = fbm(vUv * 3.0);
  gl_FragColor = vec4(vec3(noise), 1.0);
}
```

**Creates:** Clouds, mountains, detailed terrain, organic textures

### Domain Warping

Using noise to distort the coordinates of another noise function creates complex, swirling patterns.

```glsl
void main() {
  vec2 st = vUv * 5.0;

  // Use noise to warp the coordinates
  vec2 q = vec2(
    fbm(st),
    fbm(st + vec2(5.2, 1.3))
  );

  vec2 r = vec2(
    fbm(st + 4.0 * q + vec2(1.7, 9.2)),
    fbm(st + 4.0 * q + vec2(8.3, 2.8))
  );

  float f = fbm(st + 4.0 * r);

  vec3 color = mix(
    vec3(0.1, 0.2, 0.3),
    vec3(0.9, 0.8, 0.7),
    clamp(f, 0.0, 1.0)
  );

  gl_FragColor = vec4(color, 1.0);
}
```

**Creates:** Swirling patterns, gas clouds, abstract art

## Practical Examples

### Animated Clouds

```glsl
uniform float uTime;
varying vec2 vUv;

float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * valueNoise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 st = vUv * 3.0;
  st.x += uTime * 0.1; // Scroll clouds

  float noise = fbm(st);

  // Map to cloud-like colors
  vec3 skyBlue = vec3(0.5, 0.7, 1.0);
  vec3 cloudWhite = vec3(1.0, 1.0, 1.0);
  vec3 color = mix(skyBlue, cloudWhite, smoothstep(0.4, 0.6, noise));

  gl_FragColor = vec4(color, 1.0);
}
```

### Terrain Height Map

```glsl
void main() {
  float height = fbm(vUv * 8.0);

  // Color by elevation
  vec3 color;
  if (height < 0.3) {
    color = vec3(0.1, 0.3, 0.6); // Water
  } else if (height < 0.5) {
    color = vec3(0.8, 0.7, 0.4); // Sand
  } else if (height < 0.7) {
    color = vec3(0.2, 0.6, 0.2); // Grass
  } else {
    color = vec3(0.5, 0.5, 0.5); // Rock
  }

  gl_FragColor = vec4(color, 1.0);
}
```

## Performance Tips

1. **Pre-compute when possible**: If noise doesn't need to be animated, bake it into a texture
2. **Use appropriate octaves**: More octaves = more detail but slower performance
3. **Consider texture lookups**: For complex noise, using a pre-generated noise texture can be faster
4. **Optimize frequency**: Higher frequencies require more samples for good results
5. **Use lower precision**: `mediump float` is often sufficient for noise calculations

## Comparison Table

| Type | Quality | Performance | Grid Artifacts | Best For |
|------|---------|-------------|----------------|----------|
| **White Noise** | Low | Fastest | N/A | Grain, glitches |
| **Value Noise** | Medium | Fast | Some | Simple effects |
| **Perlin Noise** | High | Medium | Minimal | Natural textures |
| **Simplex Noise** | Highest | Good | None | Production quality |

## Resources

- [The Book of Shaders - Noise](https://thebookofshaders.com/11/)
- [Inigo Quilez - Noise Functions](https://iquilezles.org/articles/morenoise/)
- [WebGL Noise - GitHub](https://github.com/ashima/webgl-noise)

## Conclusion

Noise is a powerful tool in shader programming. Start with simple white noise to understand the basics, then progress to value noise and finally to Perlin or simplex noise for production-quality effects. Combine techniques like FBM and domain warping to create truly unique and organic visuals.

The key is experimentation - try different frequencies, octaves, and combinations to discover what works for your creative vision.

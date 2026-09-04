import { Color } from 'three'
import type { Node } from 'three/webgpu'
import {
  abs,
  Break,
  clamp,
  cos,
  cross,
  dot,
  exp,
  float,
  Fn,
  fract,
  If,
  Loop,
  max,
  mix,
  normalize,
  positionGeometry,
  pow,
  screenSize,
  sin,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
} from 'three/tsl'

/**
 * Fullscreen fragment raymarch, no mesh.
 *
 * TSL port of https://www.kynd.info/geom/demos/sound-amplitude/ by Kenichi
 * Yoneda (Kynd), CC BY-SA 4.0. Share-alike: this file stays CC BY-SA 4.0, not
 * the repository's MIT license.
 */

const PHI = 1.61803398875
const S3 = 0.57735027 // 1/sqrt(3)

/** Number of stops on the morph ring: dodecahedron, icosahedron. */
export const MORPH_STOPS = 2
/** Seconds for one full trip around the morph ring. */
export const MORPH_CYCLE = 5

const MARCH_STEPS = 160
const MAX_DISTANCE = 8
// The spike deform warps the domain, so a full step can tunnel through the
// surface. Under-stepping costs iterations but keeps the silhouette intact.
const STEP_RELAXATION = 0.85
// Grows with distance so grazing rays terminate instead of burning the budget.
// Tight enough that a hit lands inside the 0.005 the thickness march steps
// forward. Loosen it and rays stop short of the surface, the back march exits
// immediately, and the near-zero thickness reads as bright subsurface speckle.
const SURFACE_EPS_BASE = 0.00015
const SURFACE_EPS_SLOPE = 0.00008

const BACK_STEPS = 32
const NORMAL_EPS = 0.002

const RIM_TINT = vec3(0.92, 0.96, 1)

// Original framing is (0, 0.55, 3.5) looking at (0, 0.08, 0). DOLLY pulls
// straight back along that view line; at 1 the shape reaches into the header
// menu at full spike.
const CAMERA_TARGET = vec3(0, 0.08, 0)
const CAMERA_OFFSET = vec3(0, 0.47, 3.5)
const DOLLY = 1.4

export function createSoundShapeNodes() {
  const uniforms = {
    time: uniform(0),
    /**
     * Position on the morph ring, 0..MORPH_STOPS: 0 = dodecahedron,
     * 1 = icosahedron, wraps back to 0.
     */
    morph: uniform(0),
    /** Current kick amplitude, 0..1. */
    amplitude: uniform(0),
    spikeIntensity: uniform(0.55),
    rimPower: uniform(3),
    ambient: uniform(0),
    sssDensity: uniform(2.5),
    sssStrength: uniform(0.3),
    backgroundColor: uniform(new Color('#0a0a0a')),
    rimColor: uniform(new Color('#ffffff')),
  }

  // Both normalised to circumradius 1, so the morph doesn't change scale.
  const sdDodecahedron = Fn(([p]: [Node]) => {
    const N = 1.90211303
    const RIN = 0.79465448
    const q = abs(p)
    const a = q.y.add(q.z.mul(PHI)).div(N)
    const b = q.x.add(q.y.mul(PHI)).div(N)
    const c = q.x.mul(PHI).add(q.z).div(N)
    return max(max(a, b), c).sub(RIN)
  })

  const sdIcosahedron = Fn(([p]: [Node]) => {
    const RIN = 0.79465448
    const q = abs(p)
    const dA = q.x.add(q.y).add(q.z).mul(S3)
    const dB = q.y.mul(PHI).add(q.z.div(PHI)).mul(S3)
    const dC = q.x.div(PHI).add(q.z.mul(PHI)).mul(S3)
    const dD = q.x.mul(PHI).add(q.y.div(PHI)).mul(S3)
    return max(max(dA, dB), max(dC, dD)).sub(RIN)
  })

  // Triangle weight of stop `index` on the ring, 1 at the stop, 0 one stop
  // away. Weights of neighbouring stops always sum to 1.
  function stopWeight(index: number): Node {
    const ringDistance = abs(
      fract(uniforms.morph.sub(index).div(MORPH_STOPS).add(0.5)).sub(0.5),
    ).mul(MORPH_STOPS)
    return clamp(ringDistance.oneMinus(), 0, 1)
  }

  // rotX(4.3 + t*0.20) * rotY(4.3 + t*0.36) * p, written out to skip the mat3.
  function toShapeFrame(p: Node): Node {
    const angleX = uniforms.time.mul(0.2).add(4.3)
    const angleY = uniforms.time.mul(0.36).add(4.3)

    const cy = cos(angleY)
    const sy = sin(angleY)
    const x = p.x.mul(cy).sub(p.z.mul(sy))
    const z = p.x.mul(sy).add(p.z.mul(cy))

    const cx = cos(angleX)
    const sx = sin(angleX)
    return vec3(x, p.y.mul(cx).add(z.mul(sx)), z.mul(cx).sub(p.y.mul(sx)))
  }

  const hash3 = Fn(([p]: [Node]) => {
    const q = fract(p.mul(0.3183099).add(0.1)).mul(17)
    return fract(q.x.mul(q.y).mul(q.z).mul(q.x.add(q.y).add(q.z)))
  })

  const shapeSDF = Fn(([p]: [Node]) =>
    sdDodecahedron(p).mul(stopWeight(0))
      .add(sdIcosahedron(p).mul(stopWeight(1))),
  )

  /** The deformed field the rays march against. */
  const sceneSDF = Fn(([p]: [Node]) => {
    const rp = toShapeFrame(p)
    // Normal extrusion: every direction gets a fixed random push along its own
    // normal, scaled by the amplitude.
    const n = normalize(rp.add(0.0001))
    const spike = hash3(n.mul(5)).mul(2).sub(1)
    return shapeSDF(rp.sub(n.mul(spike).mul(uniforms.amplitude).mul(uniforms.spikeIntensity)))
  })

  /** The undeformed field, used only for shading. */
  const smoothSDF = Fn(([p]: [Node]) => shapeSDF(toShapeFrame(p)))

  // The *undeformed* normal is what makes the spikes read as faceted shards
  // rather than soft bumps, as in the original.
  const smoothNormal = Fn(([p]: [Node]) => {
    const a = vec3(1, -1, -1)
    const b = vec3(-1, -1, 1)
    const c = vec3(-1, 1, -1)
    const d = vec3(1, 1, 1)
    return normalize(
      a.mul(smoothSDF(p.add(a.mul(NORMAL_EPS))))
        .add(b.mul(smoothSDF(p.add(b.mul(NORMAL_EPS)))))
        .add(c.mul(smoothSDF(p.add(c.mul(NORMAL_EPS)))))
        .add(d.mul(smoothSDF(p.add(d.mul(NORMAL_EPS))))),
    )
  })

  /** Returns (distance, hit). */
  const march = Fn(([origin, direction]: [Node, Node]) => {
    const t = float(0.02).toVar()
    const hit = float(0).toVar()

    Loop(MARCH_STEPS, () => {
      const distance = sceneSDF(origin.add(direction.mul(t)))

      If(distance.lessThan(t.mul(SURFACE_EPS_SLOPE).add(SURFACE_EPS_BASE)), () => {
        hit.assign(1)
        Break()
      })
      If(t.greaterThan(MAX_DISTANCE), () => {
        Break()
      })

      t.addAssign(max(distance, 0.0001).mul(STEP_RELAXATION))
    })

    return vec2(t, hit)
  })

  /** Distance from the hit point to where the ray exits the solid. */
  const thicknessAt = Fn(([origin, direction, t]: [Node, Node, Node]) => {
    const tb = t.add(0.005).toVar()

    Loop(BACK_STEPS, () => {
      const distance = sceneSDF(origin.add(direction.mul(tb)))
      If(distance.greaterThan(0), () => {
        Break()
      })
      tb.addAssign(max(distance.negate(), 0.005))
    })

    return tb.sub(t)
  })

  const colorNode = Fn(() => {
    // x spans +/- aspect and y spans +/- 1, same framing as the original
    const ndc = uv().sub(0.5).mul(2)
    const plane = vec2(ndc.x.mul(screenSize.x.div(screenSize.y)), ndc.y)

    const origin = CAMERA_TARGET.add(CAMERA_OFFSET.mul(DOLLY))
    const forward = normalize(CAMERA_TARGET.sub(origin))
    const right = normalize(cross(forward, vec3(0, 1, 0)))
    const up = cross(right, forward)
    const direction = normalize(
      right.mul(plane.x).add(up.mul(plane.y)).add(forward.mul(3)),
    )

    const result = march(origin, direction)
    const glow = vec3(0).toVar()

    If(result.y.greaterThan(0.5), () => {
      const position = origin.add(direction.mul(result.x))
      const normal = smoothNormal(position)
      const thickness = thicknessAt(origin, direction, result.x)

      const facing = abs(dot(normal, direction.negate()))
      const rim = pow(facing.oneMinus(), uniforms.rimPower)
      const subsurface = exp(thickness.negate().mul(uniforms.sssDensity))

      glow.assign(
        vec3(facing.mul(facing).mul(uniforms.ambient))
          .add(RIM_TINT.mul(rim))
          .add(RIM_TINT.mul(subsurface).mul(uniforms.sssStrength)),
      )
    })

    // The original gammas against black; mapping 0..1 between the theme colours
    // instead makes light mode read as ink on paper, not an inverted photo.
    const shaded = clamp(pow(max(glow, 0), vec3(0.4545)), 0, 1)
    return mix(uniforms.backgroundColor, uniforms.rimColor, shaded)
  })()

  // Clip space in the vertex stage, so framing never depends on Tres's camera.
  const vertexNode = vec4(positionGeometry.xy.mul(2), 0, 1)

  return { colorNode, vertexNode, uniforms }
}

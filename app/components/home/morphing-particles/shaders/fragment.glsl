uniform float uTime;
varying vec3 vColor;
varying float vRandom;

// Simple 2D noise function for organic ink texture
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = gl_PointCoord;
    vec2 center = uv - 0.5;
    float distanceToCenter = length(center);

    // Ink drop characteristics
    // 1. Irregular edge with noise
    float angle = atan(center.y, center.x);
    float noiseScale = 4.0;
    float edgeNoise = noise(vec2(angle * noiseScale, distanceToCenter * 3.0 + vRandom));

    // 2. Add turbulence for organic feel
    vec2 turbulence = vec2(
        noise(uv * 6.0 + vRandom),
        noise(uv * 6.0 + vRandom + 100.0)
    ) * 0.15;
    float distWithTurbulence = length(center + turbulence);

    // 3. Ink density gradient (darker in center, lighter at edges)
    float density = smoothstep(0.5, 0.0, distWithTurbulence);
    density *= 1.0 - edgeNoise * 0.3;

    // 4. Create irregular edge with smooth falloff
    float edge = smoothstep(0.5, 0.3, distWithTurbulence + edgeNoise * 0.1);

    // 5. Add subtle inner detail (ink concentration variation)
    float detail = noise(uv * 12.0 + vRandom * 10.0) * 0.3;
    density = clamp(density + detail * density, 0.0, 1.0);

    // Final color composition (darker in center)
    vec3 inkColor = vColor * (0.7 + density * 0.3);
    float alpha = edge * density;

    // Discard fully transparent fragments for performance
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(inkColor, alpha);
}
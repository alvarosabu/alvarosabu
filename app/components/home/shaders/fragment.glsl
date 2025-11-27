varying vec2 vUv;
varying float vRandom;
uniform float uTime;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
void main() {
  /* vec2 gridUv = vec2(
    floor(vUv.x * 10.0) / 10.0,
    floor(vUv.y * 10.0) / 10.0
  );
  float strength = random(gridUv ); */
  float strength = floor(vUv.x * 10.0) / 10.0;
  vec3 color = vec3(strength, 1.0, 0.8);
  gl_FragColor = vec4(color, 1.0);
} 
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Simple animated gradient based on mouse and time
  vec3 color = vec3(
    0.5 + 0.5 * sin(uTime + uv.x * 3.0 + uMouse.x),
    0.5 + 0.5 * cos(uTime + uv.y * 3.0 + uMouse.y),
    0.5 + 0.5 * sin(uTime * 2.0)
  );

  gl_FragColor = vec4(color, 1.0);
}

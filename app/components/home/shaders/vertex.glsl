attribute float aRandom;

varying vec2 vUv;
varying float vRandom;
void main() {
  vUv = uv;
  vRandom = aRandom;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
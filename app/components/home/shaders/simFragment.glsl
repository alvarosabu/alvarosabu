varying vec2 vUv;
varying float vRandom;
uniform sampler2D uPositions;
uniform float uTime;


void main() {
  vec4 position = texture2D(uPositions, vUv);
  gl_FragColor = position;
}
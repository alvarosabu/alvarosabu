
varying vec2 vUv;
uniform float uSize;
uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uPositions;

void main() {
   vec4 pos = texture2D(uPositions, uv);
  vec4 modelPosition = modelMatrix * vec4(pos.xyz, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Point size
  gl_PointSize = uSize * uResolution.y * 0.1;
  gl_PointSize *= (1.0 / - viewPosition.z);
  vUv = uv;
}
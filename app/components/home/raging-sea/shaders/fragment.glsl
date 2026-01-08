uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec2 uMouse;
uniform float uTime;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ./includes/directionalLight.glsl
#include ./includes/pointLight.glsl

void main()
{
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(cameraPosition - vPosition);

  // Create light direction from normalized mouse position
  // Add a Z component so light comes from in front
  vec3 lightDirection = normalize(vec3(uMouse.x, uMouse.y, 0.5));

  // Calculate distance from center and modulate intensity
  float distanceFromCenter = length(uMouse);
  float intensityFalloff = 1.0 - smoothstep(0.0, 1.0, distanceFromCenter);
  float dynamicIntensity = mix(0.3, 1.5, sin(intensityFalloff + uTime) * 0.5 + 0.5); // Min 0.5, max 2.0

  // Light
  vec3 light = vec3(0.0);
  light += directionalLight(
    vec3(0.7333, 0.0196, 0.0196), // Light color
    dynamicIntensity, // Light intensity
    normal, // Normal
    lightDirection, // Light direction
    viewDirection, // View direction
    30.0 // Specular power
  );

  float mixStrength = vElevation * uColorMultiplier + uColorOffset;
  // Smooth the mix strength to avoid sharp transitions
  mixStrength = smoothstep(0.0, 1.0, mixStrength);
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  color *= light;
  // Set the fragment color
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>


}
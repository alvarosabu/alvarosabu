uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;
uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ./includes/classicPerlinNoise3D.glsl

float waveElevation(vec3 position)
{
    // Use 3D position directly for natural spherical sampling
    vec3 sphericalCoord = position;

    // Create multiple wave layers moving in different directions
    // Layer 1: Primary wave direction
    float wave1 = sin(sphericalCoord.x * uBigWavesFrequency.x + sphericalCoord.y * 0.3 + uTime * uBigWavesSpeed) *
                  sin(sphericalCoord.z * uBigWavesFrequency.y + sphericalCoord.y * 0.3 + uTime * uBigWavesSpeed * 0.8);

    // Layer 2: Secondary wave at different angle and speed
    float wave2 = sin(sphericalCoord.z * uBigWavesFrequency.x * 0.8 + sphericalCoord.x * 0.5 + uTime * uBigWavesSpeed * 1.3) *
                  sin(sphericalCoord.y * uBigWavesFrequency.y * 0.7 + sphericalCoord.z * 0.4 - uTime * uBigWavesSpeed * 0.9);

    // Layer 3: Tertiary wave for more complexity
    float wave3 = sin(sphericalCoord.y * uBigWavesFrequency.x * 1.2 + sphericalCoord.z * 0.6 + uTime * uBigWavesSpeed * 0.7) *
                  sin(sphericalCoord.x * uBigWavesFrequency.y * 0.9 + sphericalCoord.y * 0.2 + uTime * uBigWavesSpeed * 1.1);

    // Combine waves with different weights for natural look
    float elevation = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * uBigWavesElevation;

      // Add small-scale turbulence using 3D Perlin noise
    // Animate noise in multiple directions for more dynamic movement
    for(float i = 1.0; i <= uSmallWavesIterations; i++) {
        vec3 noiseCoord = sphericalCoord * uSmallWavesFrequency * i;
        // Move noise through time in a circular pattern rather than linear
        vec3 timeOffset = vec3(
            sin(uTime * uSmallWavesSpeed * 0.5) * 0.5,
            cos(uTime * uSmallWavesSpeed * 0.7) * 0.5,
            sin(uTime * uSmallWavesSpeed * 0.3) * 0.5
        );
        elevation -= abs(classicPerlinNoise3D(noiseCoord + timeOffset) * uSmallWavesElevation / i);
    }

    return elevation;
}

void main()
{
    // Get the normalized vertex normal in object space
    vec3 objectNormal = normalize(position);

    // Get the elevation of the vertex
    float elevation = waveElevation(position);

    // Displace along the surface normal (radially outward)
    vec3 displacedPosition = position + objectNormal * elevation;

    // Calculate proper normal using neighbors technique
    float offset = 0.05;

    // Sample neighbors in tangent space
    vec3 tangent1 = normalize(cross(objectNormal, vec3(0.0, 1.0, 0.0)));
    if (length(tangent1) < 0.1) {
        tangent1 = normalize(cross(objectNormal, vec3(1.0, 0.0, 0.0)));
    }
    vec3 tangent2 = normalize(cross(objectNormal, tangent1));

    // Get neighbor positions
    vec3 positionA = position + tangent1 * offset;
    vec3 positionB = position + tangent2 * offset;

    // Calculate elevations for neighbors
    float elevationA = waveElevation(positionA);
    float elevationB = waveElevation(positionB);

    // Displace neighbors
    vec3 displacedA = positionA + normalize(positionA) * elevationA;
    vec3 displacedB = positionB + normalize(positionB) * elevationB;

    // Calculate tangent vectors
    vec3 toA = displacedA - displacedPosition;
    vec3 toB = displacedB - displacedPosition;

    // Calculate normal via cross product
    vec3 calculatedNormal = normalize(cross(toA, toB));

    // Ensure it points outward
    if (dot(calculatedNormal, objectNormal) < 0.0) {
        calculatedNormal *= -1.0;
    }

    // Transform to world space
    vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vElevation = elevation;
    vNormal = (modelMatrix * vec4(objectNormal, 0.0)).xyz;
    vPosition = modelPosition.xyz;
}
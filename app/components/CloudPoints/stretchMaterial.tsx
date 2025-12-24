import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

export const vertexShader = `
precision mediump float;

attribute float subTextureIndex;
attribute float opacityAttr;

uniform float atlasGridSize;
uniform float pointSize;

varying vec2 vUv;
varying float vDepth;
varying float vOpacity;

// --------------------------------------------------
// Atlas UV selection
// --------------------------------------------------
vec2 computeAtlasUV(float index) {
  float col = mod(index, atlasGridSize);
  float row = floor(index / atlasGridSize);
  return vec2(col, row);
}

// --------------------------------------------------
// Per-point opacity
// --------------------------------------------------
float computeOpacity(float attr) {
  return attr > 0.0 ? attr : 1.0;
}

// --------------------------------------------------
// Depth from model-view space
// --------------------------------------------------
float computeDepth(vec4 mvPosition) {
  return -mvPosition.z;
}

// --------------------------------------------------
// Distance-scaled point size
// --------------------------------------------------
float computePointSize(float baseSize, float depth) {
  float size = baseSize * (30.0 / depth);
  return clamp(size, 1.0, 200.0);
}

// --------------------------------------------------
// Main
// --------------------------------------------------
void main() {
  // Atlas selection
  vUv = computeAtlasUV(subTextureIndex);

  // Opacity
  vOpacity = computeOpacity(opacityAttr);

  // Transform to view space
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Depth
  vDepth = computeDepth(mvPosition);

  // Final position
  gl_Position = projectionMatrix * mvPosition;

  // Point size
  gl_PointSize = computePointSize(pointSize, vDepth);
}
`;

const fragmentShader = `
precision mediump float;

uniform sampler2D map;
uniform float atlasGridSize;
uniform float opacity;
uniform vec3 color;

varying vec2 vUv;
varying float vDepth;
varying float vOpacity;

// Fog
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

// Distance fade
uniform vec3 farColor;
uniform float fadeStart;
uniform float fadeEnd;

// --------------------------------------------------
// Atlas sampling
// --------------------------------------------------
vec4 sampleAtlas(vec2 cellUv, vec2 spriteUv) {
  vec2 atlasUV = (cellUv + spriteUv) / atlasGridSize;
  return texture2D(map, atlasUV);
}  

// --------------------------------------------------
// Alpha computation + discard
// --------------------------------------------------
float computeAlpha(vec4 tex) {
  float a = tex.a * opacity * vOpacity;
  if (a < 0.02) discard;
  return a;
}

// --------------------------------------------------
// Distance-based colour fade
// --------------------------------------------------
vec3 applyFade(vec3 baseColor, float depth) {
  float t = smoothstep(fadeStart, fadeEnd, depth);
  return mix(baseColor, farColor, t);
}

// --------------------------------------------------
// Fog
// --------------------------------------------------
vec3 applyFog(vec3 colorIn, float depth) {
  float fogFactor = smoothstep(fogNear, fogFar, depth);
  fogFactor = clamp(fogFactor, 0.0, 1.0);
  return mix(colorIn, fogColor, fogFactor);
}

// --------------------------------------------------
// Main
// --------------------------------------------------
void main() {
  vec4 tex = sampleAtlas(vUv, gl_PointCoord);

  float alpha = computeAlpha(tex);

  vec3 baseColor = tex.rgb * color;

  vec3 fadedColor = applyFade(baseColor, vDepth);
  vec3 finalColor = applyFog(fadedColor, vDepth);

  gl_FragColor = vec4(finalColor, alpha);
}
`;

export const StretchCloudPointsMaterial = shaderMaterial(
  {
    map: null,
    atlasGridSize: 3,
    pointSize: 40.0, // default size
    opacity: 0.5,
    color: new THREE.Color(0xffffff),
    fogColor: new THREE.Color(0x000000),
    fogNear: 20.0,
    fogFar: 200.0,
    farColor: new THREE.Color(0x222233),
    fadeStart: 80.0,
    fadeEnd: 160.0,
  },
  vertexShader,
  fragmentShader,
  (material) => {
    if (!material) return;
    material.transparent = true;
    material.depthWrite = false;
    material.blending = THREE.AdditiveBlending;
  }
);

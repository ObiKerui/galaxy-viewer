import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
precision mediump float;

attribute float subTextureIndex;
attribute float opacityAttr;

uniform float atlasGridSize;
uniform float pointSize;

varying vec2 vUv;
varying float vDepth;
varying float vOpacity;

void main() {

  // Atlas lookup
  float index = subTextureIndex;
  float col = mod(index, atlasGridSize);
  float row = floor(index / atlasGridSize);
  vUv = vec2(col, row);

  vOpacity = opacityAttr;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Depth only for fog / tint
  vDepth = -mvPosition.z;

  // ❗ NO depth-based scaling for bulge
  gl_PointSize = clamp(pointSize, 80.0, 900.0);

  gl_Position = projectionMatrix * mvPosition;
}
`;

// const fragmentShader = `
// precision mediump float;

// uniform sampler2D map;
// uniform float atlasGridSize;
// uniform float opacity;
// uniform vec3 color;

// uniform vec3 fogColor;
// uniform float fogNear;
// uniform float fogFar;

// uniform vec3 farColor;
// uniform float fadeStart;
// uniform float fadeEnd;

// varying vec2 vUv;
// varying float vDepth;
// varying float vOpacity;

// void main() {

//   // Radial softness
//   vec2 p = gl_PointCoord - 0.5;
//   float r = length(p);

//   float radialAlpha = smoothstep(0.55, 0.18, r);
//   if (radialAlpha < 0.005) discard;

//   // Atlas breakup
//   vec2 atlasUV = (vUv + gl_PointCoord) / atlasGridSize;
//   vec4 tex = texture2D(map, atlasUV);

//   float alpha = radialAlpha * tex.a * opacity * vOpacity;
//   if (alpha < 0.015) discard;

//   vec3 baseColor = color;

//   // Core glow
//   float coreBoost = smoothstep(0.6, 0.0, r);
//   baseColor *= mix(1.0, 1.45, coreBoost);

//   // Distance tint
//   float fadeT = smoothstep(fadeStart, fadeEnd, vDepth);
//   vec3 distColor = mix(baseColor, farColor, fadeT);

//   // Fog
//   float fogFactor = smoothstep(fogNear, fogFar, vDepth);
//   fogFactor = clamp(fogFactor, 0.0, 0.8);

//   vec3 finalColor = mix(distColor, fogColor, fogFactor);

//   gl_FragColor = vec4(finalColor, alpha);
// }
// `;

const fragmentShader = `
  precision mediump float;

  void main() {
  gl_FragColor = vec4(1.0);
  }
  `;

export const CentralCloudPointsMaterial = shaderMaterial(
  {
    map: null,
    atlasGridSize: 4,
    pointSize: 40.0, // default size
    opacity: 0.5,
    color: new THREE.Color(0xffffff),
    maxDepth: 100.0,
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

extend({ CentralCloudPointsMaterial });

function generateSubTextureIndices(count: number, atlasGridSize: number) {
  const arr = new Float32Array(count);
  const max = atlasGridSize * atlasGridSize;
  for (let i = 0; i < count; i++) {
    arr[i] = Math.floor(Math.random() * max);
  }
  return arr;
}

export function CloudPoints({
  positions,
  opacities = null,
  atlasTexture,
  atlasGridSize = 3,
  pointSize = 40,
  opacity = 1.0,
  colour = new THREE.Color(0xffffff),
  blending = THREE.NormalBlending,
}: {
  positions: Float32Array;
  opacities?: Float32Array;
  atlasTexture: THREE.Texture;
  atlasGridSize?: number;
  pointSize?: number;
  opacity?: number;
  colour?: THREE.Color;
  blending?: THREE.Blending;
}) {
  const count = positions.length / 3;

  // Generate random atlas indices ONCE per count/grid size
  const subTextureIndices = useMemo(() => {
    return generateSubTextureIndices(count, atlasGridSize);
  }, [count, atlasGridSize]);

  // Build buffer geometry
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute(
      'subTextureIndex',
      new THREE.BufferAttribute(subTextureIndices, 1)
    );
    geom.setAttribute(
      'opacityAttr',
      new THREE.BufferAttribute(
        opacities ?? new Float32Array(count).fill(1.0),
        1
      )
    );
    return geom;
  }, [positions, opacities, subTextureIndices, count]);

  return (
    <points geometry={geometry}>
      <centralCloudPointsMaterial
        map={atlasTexture}
        atlasGridSize={atlasGridSize}
        pointSize={pointSize}
        transparent
        opacity={opacity}
        color={colour}
        maxDepth={200.0}
        fadeStart={10.0}
        fadeEnd={400}
        farColor={new THREE.Color(0x222233)}
        fogColor={new THREE.Color(0x000000)}
        fogNear={200}
        fogFar={2000}
        depthWrite={false}
        blending={blending}
      />
    </points>
  );
}

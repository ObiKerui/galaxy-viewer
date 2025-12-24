import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
  precision mediump float;
  attribute float subTextureIndex;
  varying vec2 vUv;
  varying float vDepth;
  uniform float atlasGridSize;
  uniform float pointSize;
  uniform float opacity;
  attribute float opacityAttr;
  varying float vOpacity;

  void main() {    
    float index = subTextureIndex;
    float col = mod(index, atlasGridSize);
    float row = floor(index / atlasGridSize);
    vUv = vec2(col, row);

    vOpacity = opacityAttr > 0.0 ? opacityAttr : 1.0;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    //gl_Position = projectionMatrix * mvPosition;
    //gl_PointSize = pointSize;

    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;

    float size = pointSize * (30.0 / -mvPosition.z);
    gl_PointSize = clamp(size, 1.0, 200.0);   // max 300px

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

  uniform float maxDepth;

  uniform vec3 fogColor;
  uniform float fogNear;
  uniform float fogFar;

  // Far-colour fading
  uniform vec3 farColor;
  uniform float fadeStart;
  uniform float fadeEnd;  

  void main() {
    vec2 atlasUV = (vUv + gl_PointCoord) / atlasGridSize;
    vec4 texColor = texture2D(map, atlasUV);

    // Don't render near-invisible texels
    float alpha = texColor.a * opacity * vOpacity;
    if (alpha < 0.02) discard;

    // Base star colour (texture * assigned colour)
    vec3 baseColor = texColor.rgb * color;

    // ---- Fog (subtle) ----
    // float fogFactor = smoothstep(fogNear, fogFar, vDepth);

    // Clamp fog so stars don't disappear completely
    // fogFactor = clamp(fogFactor, 0.0, 1.0);
    // vec3 foggedColor = mix(farBlendColor, fogColor, fogFactor);

    float depthNorm = clamp(vDepth / maxDepth, 0.0, 1.0);
    float fadeT = smoothstep(fadeStart, fadeEnd, depthNorm);

    vec3 blended = mix(baseColor, farColor, fadeT);
    vec3 colorOut = max(blended, vec3(0.01)); // clamp min brightness to 0.2

    gl_FragColor = vec4(colorOut, texColor.a * opacity * vOpacity);    
 
  }
`;

export const CloudPointsMaterial = shaderMaterial(
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
    farColor: new THREE.Color(0xffffff),
    fadeStart: 0.0,
    fadeEnd: 10.0,

    // farColor: new THREE.Color(0x222233),
    // fadeStart: 80.0,
    // fadeEnd: 160.0,
  },
  vertexShader,
  fragmentShader,
  (material) => {
    if (!material) return;
    material.transparent = true;
    material.depthWrite = false;
    material.blending = THREE.NormalBlending;
    // material.blending = THREE.AdditiveBlending;
  }
);

extend({ CloudPointsMaterial });

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
  atlasGridSize = 4,
  pointSize = 40,
  opacity = 1.0,
  colour = new THREE.Color(0xffffff),
  blending = THREE.NormalBlending,
}: {
  positions: Float32Array;
  opacities?: Float32Array | null;
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
    if (opacities) {
      geom.setAttribute('opacityAttr', new THREE.BufferAttribute(opacities, 1));
    }

    return geom;
  }, [positions, opacities, subTextureIndices]);

  return (
    <points geometry={geometry}>
      <cloudPointsMaterial
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

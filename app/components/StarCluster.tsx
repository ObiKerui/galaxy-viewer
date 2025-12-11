'use client';
// import type { ReactThreeFiber } from '@react-three/fiber';

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       cloudPointsMaterial: ReactThreeFiber.MaterialNode<any, any>;
//     }
//   }
// }

import { useMemo } from 'react';
import { Points, PointMaterial, shaderMaterial } from '@react-three/drei';
import { TextureLoader } from 'three';
import { extend, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float subTextureIndex;
  varying vec2 vUv;
  uniform float atlasGridSize;
  void main() {
    float index = subTextureIndex;
    float col = mod(index, atlasGridSize);
    float row = floor(index / atlasGridSize);
    vUv = vec2(col, row);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 40.0;
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform sampler2D map;
  uniform float atlasGridSize;
  varying vec2 vUv;
  void main() {
    vec2 atlasUV = (vUv + gl_PointCoord) / atlasGridSize;
    vec4 color = texture2D(map, atlasUV);
    if (color.a < 0.1) discard;
    gl_FragColor = color;
  }
`;

export const CloudPointsMaterial = shaderMaterial(
  {
    map: null,
    atlasGridSize: 4,
  },
  vertexShader,
  fragmentShader
);

// Custom shader material
// const CloudPointsMaterial = shaderMaterial(
//   {
//     map: null,
//     atlasGridSize: 4, // adjust for your atlas (4x4 grid)
//   },
//   glsl`
//     attribute float subTextureIndex;
//     varying vec2 vUv;
//     uniform float atlasGridSize;
//     void main() {
//       float index = subTextureIndex;
//       float col = mod(index, atlasGridSize);
//       float row = floor(index / atlasGridSize);
//       vUv = vec2(col, row);
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       gl_PointSize = 40.0;
//     }
//   `,
//   glsl`
//     precision mediump float;
//     uniform sampler2D map;
//     uniform float atlasGridSize;
//     varying vec2 vUv;
//     void main() {
//       vec2 atlasUV = (vUv + gl_PointCoord) / atlasGridSize;
//       vec4 color = texture2D(map, atlasUV);
//       if (color.a < 0.1) discard;
//       gl_FragColor = color;
//     }
//   `
// );

function generatePoints(count: number) {
  const positions = new Float32Array(count * 3);
  const subTextureIndices = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    subTextureIndices[i] = Math.floor(Math.random() * 16); // 16 tiles in 4x4 atlas
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute(
    'subTextureIndex',
    new THREE.BufferAttribute(subTextureIndices, 1)
  );
  return geometry;
}

extend({ CloudPointsMaterial });

export function CloudPoints({ count }: { count: number }) {
  const atlasTexture = useLoader(
    THREE.TextureLoader,
    '/textures/cloudAtlas.png'
  );

  // Generate random positions
  const geometry = useMemo(() => generatePoints(count), [count]);

  return (
    <points geometry={geometry}>
      <testElement />
      <cloudPointsMaterial
        map={atlasTexture}
        atlasGridSize={4}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function generateCluster(count: number, radius: number): Float32Array {
  // IMPORTANT: This is pure at module level because it's NOT RUN YET 🧠
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = Math.random() * radius;
    const theta = Math.random() * Math.PI * 2;

    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const z = (Math.random() - 0.5) * radius * 0.3;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

interface StarClusterProps {
  count?: number;
  radius?: number;
  colour?: string;
  size?: number;
}

export default function StarCluster({
  count = 200,
  radius = 1,
  colour = 'white',
  size = radius * 0.15 * 2,
}: StarClusterProps) {
  const circleTexture = useLoader(TextureLoader, '/textures/cloud.png');

  // Generate the random points ONCE
  const positions = useMemo(() => {
    const arr = generateCluster(count, radius);
    return arr;
  }, [count, radius]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        size={size}
        transparent
        opacity={0.4}
        depthWrite={false}
        color={colour}
        map={circleTexture}
        alphaMap={circleTexture}
        alphaTest={0.001}
        sizeAttenuation
      />
    </Points>
  );
}

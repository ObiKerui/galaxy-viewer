import { extend } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { StretchCloudPointsMaterial } from './stretchMaterial';

extend({ StretchCloudPointsMaterial });

function generateSubTextureIndices(count: number, atlasGridSize: number) {
  const arr = new Float32Array(count);
  const max = atlasGridSize * atlasGridSize;
  for (let i = 0; i < count; i++) {
    arr[i] = Math.floor(Math.random() * max);
  }
  return arr;
}

export function StretchCloudPoints({
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

    const opacityArray = opacities ?? new Float32Array(count).fill(1.0);
    geom.setAttribute(
      'opacityAttr',
      new THREE.BufferAttribute(opacityArray, 1)
    );

    return geom;
  }, [count, positions, opacities, subTextureIndices]);

  return (
    <points geometry={geometry}>
      <stretchCloudPointsMaterial
        map={atlasTexture}
        atlasGridSize={atlasGridSize}
        pointSize={pointSize}
        transparent
        opacity={opacity}
        color={colour}
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

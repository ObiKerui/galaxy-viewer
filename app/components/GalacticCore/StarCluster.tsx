import { randGen } from '@/app/utils/randomOps';
import { useMemo } from 'react';
import { CloudPoints } from '../CloudPoints/CloudPoints';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

function generateCorePositions(
  count: number,
  radiusX: number,
  radiusY: number,
  radiusZ: number,
  seed: number
) {
  const rnd = randGen(seed);
  const positions = [];

  for (let i = 0; i < count; i++) {
    // random point in unit sphere with bias towards center
    const u = rnd();
    const v = rnd();
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(2 * v - 1);

    // radius biased toward center (e.g. sqrt to cluster inside)
    const r = Math.cbrt(rnd()); // cube root gives denser center

    const x = Math.sin(phi) * Math.cos(theta) * r * radiusX;
    const y = Math.sin(phi) * Math.sin(theta) * r * radiusY;
    const z = Math.cos(phi) * r * radiusZ;

    positions.push(x, y, z);
  }

  return new Float32Array(positions);
}

export function StarCluster() {
  const atlasTexture = useLoader(
    THREE.TextureLoader,
    '/textures/starCloudTextureMap.png'
  );

  const corePositions = useMemo(
    () => generateCorePositions(5000, 1, 0.3, 1, 123),
    []
  );

  return (
    <CloudPoints
      positions={corePositions}
      atlasTexture={atlasTexture}
      atlasGridSize={4}
      pointSize={50}
      opacity={0.6}
      colour={new THREE.Color(0xffa500)} // orange
    />
  );
}

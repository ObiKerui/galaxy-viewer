import { useLoader } from '@react-three/fiber';
import { CloudPoints } from '../CloudPoints/CloudPoints';
import { useMemo } from 'react';
import * as THREE from 'three';

function generatePeanutBulge({
  count,
  barLength,
  barThickness,
  lobeHeight,
}: {
  count: number;
  barLength: number;
  barThickness: number;
  lobeHeight: number;
}): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Bar-aligned X
    const x = (Math.random() - 0.5) * barLength * Math.pow(Math.random(), 0.5);

    // Choose upper or lower lobe
    const sign = Math.random() < 0.5 ? -1 : 1;

    // Lobe-shaped Y (biased away from center)
    const y =
      sign * lobeHeight * (0.5 + Math.random()) * Math.pow(Math.random(), 0.7);

    // Thin Z
    const z =
      (Math.random() - 0.5) * barThickness * Math.pow(Math.random(), 1.5);

    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

export default function VolumetricBulge({}) {
  const atlasTexture = useLoader(
    THREE.TextureLoader,
    '/textures/med-detail-atlas.png'
  );

  const peanutPositions = useMemo(
    () =>
      generatePeanutBulge({
        count: 2000,
        barLength: 32,
        barThickness: 0.1,
        lobeHeight: 0.1,
      }),
    []
  );

  return (
    <CloudPoints
      positions={peanutPositions}
      atlasTexture={atlasTexture}
      atlasGridSize={3}
      pointSize={100}
      opacity={0.25}
      colour={new THREE.Color(0xffb36b)}
      blending={THREE.NormalBlending}
    />
  );
}

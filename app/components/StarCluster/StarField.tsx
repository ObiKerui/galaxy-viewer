import { useMemo } from 'react';
import * as THREE from 'three';
import { CloudPoints } from '../CloudPoints/CloudPoints';
import { useLoader } from '@react-three/fiber';

const colorSpectrum = [
  new THREE.Color('#ffffff'), // pure white (dominant)
  new THREE.Color('#fdfdfd'), // slightly off-white
  new THREE.Color('#fdfdfd'), // slightly off-white
  new THREE.Color('#dbe9ff'), // soft blue-white (O/B type)
  new THREE.Color('#dbe9ff'), // soft blue-white (O/B type)
  new THREE.Color('#dbe9ff'), // soft blue-white (O/B type)
];

function getRandomColor() {
  const random = Math.random();
  const index =
    Math.floor(random * colorSpectrum.length) % colorSpectrum.length;
  return colorSpectrum[index];
}

function generateStarFieldPositions(count: number, spread: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  return positions;
}

export function StarField({
  position,
  count = 800,
  spread = 100,
}: {
  position: THREE.Vector3;
  count?: number;
  spread?: number;
}) {
  const texture = useLoader(THREE.TextureLoader, '/textures/light-orb.png');
  const positions = useMemo(
    () => generateStarFieldPositions(count, spread),
    [count, spread]
  );

  const randomColour = useMemo(() => {
    // You can seed your RNG or just random:
    return getRandomColor();
  }, []);

  return (
    <group position={position.toArray()}>
      <CloudPoints
        positions={positions}
        atlasTexture={texture}
        atlasGridSize={1}
        pointSize={1}
        opacity={0.7}
        colour={randomColour}
      />
    </group>
  );
}

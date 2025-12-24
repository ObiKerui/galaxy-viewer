import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { CloudQuads } from '../CloudQuads/CloudQuads'; // import your CloudQuads component
import { xorshift32 } from '../../utils/randomOps'; // your RNG

// Generate positions arranged roughly in a circular, flattened cluster like your example
export function generateClusterPositions(
  count: number,
  spread: number,
  seed: number
) {
  const rnd = xorshift32(seed);
  const arr = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const angle = rnd() * Math.PI * 2;
    const radius = rnd() * spread;

    arr[i * 3 + 0] = Math.cos(angle) * radius;
    arr[i * 3 + 1] = (rnd() - 0.5) * spread * 0.2; // thin height
    arr[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return arr;
}

// You can reuse your existing color spectrum or define new one
// const colorSpectrum = [
//   new THREE.Color('#ffffff'),
//   new THREE.Color('#fdfdfd'),
//   new THREE.Color('#dbe9ff'),
// ];

// function getRandomColor() {
//   const random = Math.random();
//   const index =
//     Math.floor(random * colorSpectrum.length) % colorSpectrum.length;
//   return colorSpectrum[index];
// }

// LOD config for example (adjust counts & sizes)
const LOD_CONFIG = [
  { maxDist: 30, count: 40, size: 2 },
  { maxDist: 60, count: 20, size: 2 },
  { maxDist: 120, count: 10, size: 2 },
  { maxDist: Infinity, count: 2, size: 2 },
];

function pickLOD(distance: number) {
  return LOD_CONFIG.findIndex((l) => distance < l.maxDist);
}

export function StarClusterQuads({
  spread = 1,
  position = new THREE.Vector3(0, 0, 0),
  opacity = 0.1,
}: {
  spread?: number;
  position?: THREE.Vector3;
  opacity?: number;
}) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const lodRef = useRef(0);

  // Update LOD each frame based on camera distance
  useFrame(() => {
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);
    const dist = camera.position.distanceTo(worldPos);
    const newLOD = pickLOD(dist);
    if (newLOD !== lodRef.current) lodRef.current = newLOD;
  });

  // Extract LOD config
  const { count, size } = LOD_CONFIG[lodRef.current];

  // Generate positions once per count/spread/LOD
  const positions = useMemo(
    () => generateClusterPositions(count, spread, lodRef.current * 1000),
    [count, spread]
  );

  //   const randomColor = useMemo(() => getRandomColor(), []);

  return (
    <group ref={groupRef} position={position.toArray()}>
      <CloudQuads positions={positions} size={size} />
    </group>
  );
}

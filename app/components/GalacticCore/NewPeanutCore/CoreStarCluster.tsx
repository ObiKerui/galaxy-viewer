import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CloudPoints } from './CloudPoints';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { xorshift32 } from '../../../utils/randomOps';

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
    arr[i * 3 + 1] = (rnd() - 0.5) * spread * 0.2;
    arr[i * 3 + 2] = Math.sin(angle) * radius;
  }

  return arr;
}

const colorSpectrum = [
  new THREE.Color('#fff6e5'), // warm white (dominant)
  new THREE.Color('#fff6e5'), // warm white
  new THREE.Color('#fff1d6'), // creamy white
  new THREE.Color('#ffebc2'), // pale yellow
  new THREE.Color('#ffd8a8'), // soft amber
  new THREE.Color('#ffc58a'), // warm orange tint
  new THREE.Color('#ffb36b'), // golden core glow
  new THREE.Color('#f5d0a6'), // dusty beige (reddened stars)
];

function getRandomColor() {
  const random = Math.random();
  const index =
    Math.floor(random * colorSpectrum.length) % colorSpectrum.length;
  return colorSpectrum[index];
}

const LOD_CONFIG = [
  { maxDist: 60, count: 20, size: 40 },
  { maxDist: 140, count: 8, size: 80 },
  { maxDist: Infinity, count: 1, size: 80 },
];

function pickLOD(distance: number) {
  return LOD_CONFIG.findIndex((l) => distance < l.maxDist);
}

export function CoreStarCluster({
  spread = 3,
  position = new THREE.Vector3(0, 0, 0),
  blending = THREE.NormalBlending,
  opacity = 0.05,
}: {
  count?: number;
  spread?: number;
  position?: THREE.Vector3;
  blending?: THREE.Blending;
  opacity?: number;
}) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const lodRef = useRef(0);

  // Compute LOD each frame (cheap)
  useFrame(() => {
    if (!groupRef.current) return;

    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    const dist = camera.position.distanceTo(worldPos);
    const newLOD = pickLOD(dist);

    if (newLOD !== lodRef.current) {
      lodRef.current = newLOD;
    }
  });

  const { count: clusterCount, size } = LOD_CONFIG[lodRef.current];

  const atlasTexture = useLoader(
    THREE.TextureLoader,
    '/textures/med-detail-atlas.png'
  );

  // Generate positions ONE time
  const positions = useMemo(
    () => generateClusterPositions(clusterCount, spread, lodRef.current * 1000),
    [clusterCount, spread]
  );

  const randomColour = useMemo(() => {
    // You can seed your RNG or just random:
    return getRandomColor();
  }, []);

  return (
    <group ref={groupRef} position={position.toArray()}>
      <CloudPoints
        positions={positions}
        atlasTexture={atlasTexture}
        atlasGridSize={3}
        pointSize={size}
        opacity={opacity}
        colour={randomColour}
        blending={blending}
      />
    </group>
  );
}

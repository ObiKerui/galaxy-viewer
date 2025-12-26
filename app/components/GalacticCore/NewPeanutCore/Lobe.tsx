'use client';
import { randGen } from '@/app/utils/randomOps';
import { useMemo } from 'react';
import * as THREE from 'three';
import { CloudPoints } from './CloudPoints';
import { useLoader } from '@react-three/fiber';

export function convertToArrayBuffer(points: THREE.Vector3[]) {
  const arr = new Float32Array(points.length * 3);

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const i3 = i * 3;

    arr[i3 + 0] = p.x;
    arr[i3 + 1] = p.y;
    arr[i3 + 2] = p.z;
  }

  return arr;
}

function generateLobePoints({
  center,
  count,
  radius,
  seed,
  ySquash = 1,
}: {
  center: THREE.Vector3;
  count: number;
  radius: number;
  seed: number;
  ySquash?: number;
}) {
  const rand = randGen(seed);
  const points: THREE.Vector3[] = [];

  while (points.length < count) {
    // random point in a cube
    const x = (rand() * 2 - 1) * radius;
    const y = (rand() * 2 - 1) * radius * ySquash;
    const z = (rand() * 2 - 1) * radius;

    // keep only points inside sphere
    if (x * x + y * y + z * z > radius * radius) continue;

    points.push(new THREE.Vector3(center.x + x, center.y + y, center.z + z));
  }

  return points;
}

const colorSpectrum = [
  new THREE.Color('#ffffff'), // pure white (dominant)
  new THREE.Color('#fdfdfd'), // slightly off-white
  new THREE.Color('#fdfdfd'), // slightly off-white
  new THREE.Color('#dbe9ff'), // soft blue-white (O/B type)
  new THREE.Color('#dbe9ff'), // soft blue-white (O/B type)
  // new THREE.Color('#dbe9ff'), // soft blue-white (O/B type)
];

function getRandomColor() {
  const random = Math.random();
  const index =
    Math.floor(random * colorSpectrum.length) % colorSpectrum.length;
  return colorSpectrum[index];
}

type tProps = {
  center?: THREE.Vector3;
  count?: number;
  radius?: number;
  opacity?: number;
  seed?: number;
};

export function Lobe({
  center = new THREE.Vector3(0, 0, 0),
  count = 100,
  radius = 3.5,
  opacity = 0.1,
  seed = 1,
}: tProps) {
  const points = useMemo(() => {
    const vectorPoints = generateLobePoints({
      center,
      count,
      radius,
      seed,
      ySquash: 10,
    });
    const points = convertToArrayBuffer(vectorPoints);
    return points;
  }, [center, count, radius, seed]);

  const atlasTexture = useLoader(
    THREE.TextureLoader,
    '/textures/med-detail-atlas.png'
  );

  const randomColour = useMemo(() => {
    // You can seed your RNG or just random:
    return getRandomColor();
  }, []);

  return (
    <>
      {/* Draw lines from centre → each branch point */}
      {/* {points.map((p, i) => (
        <Line
          key={i}
          points={[center.toArray(), p.toArray()]}
          color="cyan"
          lineWidth={1}
        />*/}
      <CloudPoints
        positions={points}
        blending={THREE.NormalBlending}
        opacity={opacity}
        atlasTexture={atlasTexture}
        atlasGridSize={3}
        pointSize={60}
        colour={randomColour}
      />
    </>
  );
}

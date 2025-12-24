'use client';
import { useCombinedLOD } from '@/app/utils/useCombinedLOD';
import { useLoader } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CloudPoints } from '../CloudPoints/CloudPoints';
import {
  convertToArrayBuffer,
  generateEclipseBranchingPoints,
  randomizeX,
} from './utils';
import { CloudQuads } from './CloudQuads';
import { PointMaterial, Points } from '@react-three/drei';

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

type DebugPointsProps = {
  points: Float32Array | number[];
  size?: number;
  color?: THREE.ColorRepresentation;
};

export function DebugPoints({
  points,
  size = 1,
  color = 'white',
}: DebugPointsProps) {
  const positions = useMemo(() => {
    return points instanceof Float32Array ? points : new Float32Array(points);
  }, [points]);

  return (
    <Points positions={positions}>
      <PointMaterial
        size={size}
        color={color}
        opacity={0.1}
        transparent
        sizeAttenuation
        depthTest
        depthWrite={false}
      />
    </Points>
  );
}

type tProps = {
  id: string;
  center: THREE.Vector3;
  count?: number;
  radius?: number;
  opacity?: number;
  seed?: number;
};

export function Branch({
  id = '',
  center,
  count = 20,
  radius = 1.5,
  opacity = 0.2,
  seed = 1,
}: tProps) {
  // const activeRef = useRef<boolean[]>([]);
  const ref = useRef<THREE.Group>(null);

  // const atlasTexture = useLoader(
  //   THREE.TextureLoader,
  //   '/textures/med-detail-atlas.png'
  // );

  const atlasTexture = useLoader(
    THREE.TextureLoader,
    '/textures/high-detail-atlas.png'
  );

  // const atlasTexture = useLoader(
  //   THREE.TextureLoader,
  //   '/textures/newTextureAtlas2.png'
  // );

  const points = useMemo(() => {
    const pts = generateEclipseBranchingPoints(
      count,
      0.8,
      radius,
      Math.PI / 16
    );
    const randomized = randomizeX(pts, 2.0, seed + 1337);
    const positions = convertToArrayBuffer(randomized);
    return positions;
  }, [radius, count, seed]);

  const quadPositions = useMemo(() => points.slice(), [points]);

  const directionToCenter = useMemo(() => {
    return new THREE.Vector3(0, 0, 0).sub(center).normalize();
  }, [center]);

  const rotation = useMemo(() => {
    const from = new THREE.Vector3(1, 0, 0); // original forward vector
    const up = new THREE.Vector3(0, 1, 0); // world up

    // Vector from mesh to center, normalized
    const to = directionToCenter.clone();

    // Sideways vector: perpendicular to 'to' and 'up'
    const sideways = new THREE.Vector3().crossVectors(to, up).normalize();

    // Quaternion rotating 'from' to 'sideways'
    return new THREE.Quaternion().setFromUnitVectors(from, sideways);
  }, [directionToCenter]);

  const { showMediumHighDetail } = useCombinedLOD({
    position: center,
  });

  const randomColour = useMemo(() => {
    // You can seed your RNG or just random:
    return getRandomColor();
  }, []);

  return (
    <group
      ref={ref}
      position={center}
      quaternion={rotation}
      scale={[1.0, 0.5, 1.0]}
    >
      <CloudPoints
        positions={points}
        blending={THREE.AdditiveBlending}
        opacity={opacity}
        atlasTexture={atlasTexture}
        atlasGridSize={3}
        pointSize={60}
        colour={randomColour}
      />
      <DebugPoints points={points} />
      {showMediumHighDetail && <CloudQuads positions={quadPositions} />}
    </group>
  );
}

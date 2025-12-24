'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Branch } from './Branch';
import { Spine } from './Spine';
import { xorshift32 } from '@/app/utils/randomOps';
import GalaxyDustPlane from '../GasDisk/DustPlane';
import { CloudQuads } from '../CloudQuads/CloudQuads';
import { StarClusterQuads } from '../StarCluster/StarClusterQuads';

const defaultbranchCounts = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
  2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 8, 8, 10, 10, 12, 14,
  19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 17, 18, 19, 20, 20, 20, 20,
  19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 6, 6, 6, 5, 5,
  4, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 0,
];

const defaultRadials = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5,
  5, 6, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 9, 9, 8, 8, 8, 8, 8, 6, 6, 6, 5, 5,
  5, 5, 4, 4, 4, 3, 3, 3, 3, 2, 2,
];

const defaultRadiusProfile = new Array(defaultbranchCounts.length).fill(1.5);
const defaultOpacityProfile = new Array(defaultbranchCounts.length).fill(0.2);

export function generateSpiralCenters(
  count: number,
  armOffset: number,
  seed = 1
) {
  const rand = xorshift32(seed);
  const arr: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const t = i * 0.35;
    const radius = 0.5 * Math.exp(0.18 * t);
    const angle = t + armOffset;

    const x = Math.cos(angle) * radius;
    const y = (rand() - 0.5) * 2; // deterministic vertical drift
    const z = Math.sin(angle) * radius;

    arr.push(new THREE.Vector3(x, y, z));
  }

  return arr;
}

export function generateEvenSpiralCenters(
  count: number,
  armOffset: number,
  seed = 1,
  distanceApart = 0.4
) {
  const rand = xorshift32(seed);
  const points: THREE.Vector3[] = [];

  // starting angle
  let t = 0;
  const deltaT = 0.01; // small angular step

  // compute first point
  function pointAt(t: number) {
    // const radius = 0.5 * Math.exp(0.18 * t);
    const radius = 0.5 * Math.exp(0.23 * t);
    const angle = -t + armOffset;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      (rand() - 0.5) * 0.5, // your vertical drift
      Math.sin(angle) * radius
    );
  }

  let last = pointAt(t);
  points.push(last.clone());

  // march forward along the spiral
  while (points.length < count) {
    t += deltaT;
    const next = pointAt(t);

    if (next.distanceTo(last) >= distanceApart) {
      points.push(next.clone());
      last = next;
    }
  }

  return points;
}

export function SpiralArm({
  name = '',
  armOffset = 0,
  pitch = 0,
  branchProfile = defaultbranchCounts,
  radialProfile = defaultRadials,
  radiusProfile = defaultRadiusProfile,
  opacityProfile = defaultOpacityProfile,
  clusters = 100,
  clusterSpread = 3,
  seed = 42,
}: {
  name?: string;
  armOffset?: number; // offset angle for separate arms
  pitch?: number; // tilt angle of the arm
  branchProfile?: number[]; // array defining number of branches at intervals along the arm
  radialProfile?: number[]; // optional array defining radius at intervals along the arm
  radiusProfile?: number[]; // optional array defining radius of the branches
  opacityProfile?: number[];
  clusters?: number;
  clusterSpread?: number;
  seed?: number;
}) {
  const clusterCenters = useMemo(
    () => generateEvenSpiralCenters(clusters, armOffset, seed, 4.5),
    [clusters, armOffset, seed]
  );

  return (
    <>
      {clusterCenters.map((pos, i) => (
        <Branch
          key={i}
          id={`cluster-${name}-${i}`}
          center={pos}
          count={branchProfile[i % branchProfile.length] || 0}
          radius={radiusProfile[i % radiusProfile.length] || 0}
          opacity={opacityProfile[i % opacityProfile.length] || 0}
          seed={seed + i}
        />
      ))}
      {clusterCenters.map((pos, i) => (
        <GalaxyDustPlane
          key={i}
          position={pos}
          opacity={0.08}
          size={radialProfile[i % radialProfile.length] * 1.1 || 0}
          texturePath="/textures/arm-disk.png"
        />
      ))}

      {/* <Spine points={clusterCenters} colour="yellow" /> */}
    </>
  );
}

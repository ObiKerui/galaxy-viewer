'use client';

import { xorshift32 } from '@/app/utils/randomOps';
import { useMemo } from 'react';
import * as THREE from 'three';
import { BarBranches } from './BarBranches';

const defaultbranchCounts = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];

export function generateCentralBarPoints(
  count: number,
  seed = 1,
  distanceApart = 0.1,
  deviation = 0.5 // max random offset on Y and Z axes
): THREE.Vector3[] {
  const rand = xorshift32(seed);
  const points: THREE.Vector3[] = [];

  let x = 0;

  while (points.length < count) {
    // Random small offset on Y and Z controlled by deviation
    const y = (rand() - 0.5) * 2 * deviation;
    const z = (rand() - 0.5) * 2 * deviation;

    points.push(new THREE.Vector3(x, y, z));

    // Move forward along X by distanceApart each step
    x += distanceApart;
  }

  return points;
}

function shiftPointsToCentre(points: THREE.Vector3[]) {
  if (points.length === 0) return points;

  // find midpoint along X (or total length midpoint)
  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const centreX = (minX + maxX) / 2;

  return points.map((p) => new THREE.Vector3(p.x - centreX, p.y, p.z));
}

function rotatePointsToDirection(
  points: THREE.Vector3[],
  direction: THREE.Vector3
) {
  if (points.length === 0) return points;

  const dir = direction.clone().normalize();

  // Default bar direction is +X
  const from = new THREE.Vector3(1, 0, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(from, dir);

  return points.map((p) => p.clone().applyQuaternion(quat));
}

export function BarSpine({
  name = '',
  branchProfile = defaultbranchCounts,
  clusters = 200,
  clusterSpread = 1,
  seed = 42,
}: {
  name?: string;
  branchProfile?: number[]; // array defining number of branches at intervals along the arm
  clusters?: number;
  clusterSpread?: number;
  seed?: number;
}) {
  const clusterCenters = useMemo(() => {
    const pts = generateCentralBarPoints(clusters, seed, 5);
    const centred = shiftPointsToCentre(pts);
    const rotated = rotatePointsToDirection(
      centred,
      new THREE.Vector3(1, 0.1, 0).normalize()
    );
    return centred;
  }, [clusters, seed]);

  return (
    <>
      {clusterCenters.map((pos, i) => (
        <BarBranches
          key={i}
          center={pos}
          count={branchProfile[i % branchProfile.length] || 0}
          radius={clusterSpread}
          seed={seed + i}
        />
      ))}
      {/* <Spine points={clusterCenters} colour="yellow" /> */}
    </>
  );
}

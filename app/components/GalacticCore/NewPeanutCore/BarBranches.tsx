'use client';
import { randGen } from '@/app/utils/randomOps';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { CoreStarCluster } from './CoreStarCluster';

export function generateBiasedBranchPoints({
  center,
  count,
  radius,
  seed,
  yBias = 0.15,
}: {
  center: THREE.Vector3;
  count: number;
  radius: number;
  seed: number;
  yBias?: number; // 1 = no flattening, smaller = stronger bias toward center plane
}) {
  const rnd = randGen(seed);
  const arr: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(2 * rnd() - 1);
    const r = rnd() * radius;

    // direction on sphere
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );

    // apply flattening bias toward Y=0 plane
    dir.y *= yBias; // shrink vertical component => cluster around the plane
    dir.normalize();

    arr.push(
      new THREE.Vector3(
        center.x + dir.x * r,
        center.y + dir.y * r,
        center.z + dir.z * r
      )
    );
  }

  return arr;
}

const DETAIL_DISTANCE = 20;

type tProps = {
  center: THREE.Vector3;
  count?: number;
  radius?: number;
  seed?: number;
};

export function BarBranches({
  center,
  count = 20,
  radius = 0.5,
  seed = 1,
}: tProps) {
  const points = useMemo(
    () =>
      generateBiasedBranchPoints({
        center,
        count,
        radius,
        seed,
        yBias: 0.25,
      }),
    [center, count, radius, seed]
  );

  const [activeDetail, setActiveDetail] = useState<boolean[]>(() =>
    points.map(() => false)
  );

  const activeRef = useRef<boolean[]>([]);

  useEffect(() => {
    activeRef.current = activeDetail;
  }, [activeDetail]);

  const { camera } = useThree();
  const temp = useRef(new THREE.Vector3());

  useFrame(() => {
    let changed = false;
    const next = [...activeRef.current];

    points.forEach((p, i) => {
      temp.current.copy(p);
      const dist = camera.position.distanceTo(temp.current);

      const shouldBeActive = dist < DETAIL_DISTANCE;

      if (next[i] !== shouldBeActive) {
        next[i] = shouldBeActive;
        changed = true;
      }
    });

    if (changed) setActiveDetail(next);
  });

  return (
    <>
      {/* Draw lines from centre → each branch point */}
      {/* {points.map((p, i) => (
        <Line
          key={i}
          points={[center.toArray(), p.toArray()]}
          color="cyan"
          lineWidth={1}
        />
      ))} */}
      {points.map((p, i) => (
        <React.Fragment key={i}>
          {/* Always render cheap cluster */}
          <CoreStarCluster
            position={p}
            blending={THREE.AdditiveBlending}
            opacity={0.09}
          />
        </React.Fragment>
      ))}
    </>
  );
}

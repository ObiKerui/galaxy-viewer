'use client';
import { randGen } from '@/app/utils/randomOps';
import { Line } from '@react-three/drei/core/Line';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { CoreStarCluster } from './CoreStarCluster';

export function generateOuterCorePoints({
  center,
  count,
  radius,
  seed,
  ySquash = 1,
  stretchAxis = 'x',
  stretchStrength = 2.0,
  stretchFalloff = 2.0,
}: {
  center: THREE.Vector3;
  count: number;
  radius: number;
  seed: number;
  ySquash?: number;
  stretchAxis?: 'x' | 'z';
  stretchStrength?: number;
  stretchFalloff?: number;
}) {
  const rand = randGen(seed);
  const points: THREE.Vector3[] = [];

  while (points.length < count) {
    let x = (rand() * 2 - 1) * radius;
    let y = (rand() * 2 - 1) * radius * ySquash;
    let z = (rand() * 2 - 1) * radius;

    // base sphere test
    if (x * x + y * y + z * z > radius * radius) continue;

    // how close are we to the centre plane (Y = 0)
    const planeFactor = 1 - Math.min(Math.abs(y) / radius, 1);

    // smooth falloff (sharper = higher exponent)
    const stretchFactor = Math.pow(planeFactor, stretchFalloff);

    // pull sideways from centre
    if (stretchAxis === 'x') {
      x *= 1 + stretchFactor * stretchStrength;
    } else {
      z *= 1 + stretchFactor * stretchStrength;
    }

    points.push(new THREE.Vector3(center.x + x, center.y + y, center.z + z));
  }

  return points;
}

const DETAIL_DISTANCE = 20;

type tProps = {
  center?: THREE.Vector3;
  count?: number;
  radius?: number;
  seed?: number;
};

export function OuterCore({
  center = new THREE.Vector3(0, 0, 0),
  count = 300,
  radius = 6.5,
  seed = 1,
}: tProps) {
  const points = useMemo(
    () =>
      generateOuterCorePoints({
        center,
        count,
        radius,
        seed,
        ySquash: 10,
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
            blending={THREE.NormalBlending}
            opacity={0.3}
          />
        </React.Fragment>
      ))}
    </>
  );
}

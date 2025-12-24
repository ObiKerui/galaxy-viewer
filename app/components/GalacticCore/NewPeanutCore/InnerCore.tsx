'use client';
import { randGen } from '@/app/utils/randomOps';
import { Line } from '@react-three/drei/core/Line';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { CoreStarCluster } from './CoreStarCluster';

function generateInnerCorePoints({
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

const DETAIL_DISTANCE = 20;

type tProps = {
  center?: THREE.Vector3;
  count?: number;
  radius?: number;
  seed?: number;
};

export function InnerCore({
  center = new THREE.Vector3(0, 0, 0),
  count = 200,
  radius = 6.5,
  seed = 1,
}: tProps) {
  const points = useMemo(
    () =>
      generateInnerCorePoints({
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
            blending={THREE.AdditiveBlending}
            opacity={0.1}
          />
        </React.Fragment>
      ))}
    </>
  );
}

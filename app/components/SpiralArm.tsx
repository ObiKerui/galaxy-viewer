'use client';

import { useMemo } from 'react';
import StarCluster from './StarCluster';

function getSpiralPositions(
  turns: number,
  clustersPerTurn: number,
  a: number,
  b: number,
  scatter: number
): [number, number, number][] {
  const clusters: [number, number, number][] = [];
  const total = turns * clustersPerTurn;

  for (let i = 0; i < total; i++) {
    const t = (i / clustersPerTurn) * 2 * Math.PI;
    const r = a + b * t;

    let x = r * Math.cos(t);
    let y = r * Math.sin(t);
    let z = 0;

    // Optional slight positional noise
    x += (Math.random() - 0.5) * scatter;
    y += (Math.random() - 0.5) * scatter;
    z += (Math.random() - 0.5) * scatter * 0.2;

    clusters.push([x, y, z]);
  }

  return clusters;
}

export function SpiralArm({
  turns = 3,
  clustersPerTurn = 20,
  a = 0.2,
  b = 0.15,
  scatter = 0.3,
  clusterRadius = 0.25,
  clusterStars = 150,
  color = 'white',
}) {
  // Precompute cluster anchor positions
  const clusterCenters = useMemo(
    () => getSpiralPositions(turns, clustersPerTurn, a, b, scatter),
    [turns, clustersPerTurn, a, b, scatter]
  );

  return (
    <group>
      {clusterCenters.map((pos, i) => (
        <group key={i} position={pos}>
          <StarCluster
            count={clusterStars}
            radius={clusterRadius}
            colour={color}
          />
        </group>
      ))}
    </group>
  );
}

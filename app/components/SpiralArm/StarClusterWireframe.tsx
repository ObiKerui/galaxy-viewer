'use client';

import { PointMaterial, Points } from '@react-three/drei';
import { useMemo } from 'react';

function generateCluster(count: number, radius: number): Float32Array {
  // IMPORTANT: This is pure at module level because it's NOT RUN YET 🧠
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = Math.random() * radius;
    const theta = Math.random() * Math.PI * 2;

    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const z = (Math.random() - 0.5) * radius * 0.3;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

interface StarClusterProps {
  count?: number;
  radius?: number;
  colour?: string;
  size?: number;
}

export default function StarClusterWireFrame({
  count = 1,
  radius = 1,
  colour = 'white',
  size = radius * 0.15 * 1,
}: StarClusterProps) {
  // Generate the random points ONCE
  const positions = useMemo(() => {
    const arr = generateCluster(count, radius);
    return arr;
  }, [count, radius]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      {/* <PointMaterial
        size={size}
        transparent
        opacity={0.4}
        depthWrite={false}
        color={colour}
        map={circleTexture}
        alphaMap={circleTexture}
        alphaTest={0.001}
        sizeAttenuation
      /> */}
      <PointMaterial
        size={size}
        transparent
        opacity={0.4}
        depthWrite={false}
        color={colour}
        sizeAttenuation
      />
    </Points>
  );
}

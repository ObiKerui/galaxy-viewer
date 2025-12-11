import React, { useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';

type GalacticCoreProps = {
  starCount?: number;
  radius?: number;
  color?: string;
  size?: number;
  position?: [number, number, number];
  squashFactor?: number;
};

function generateCoreStars(
  starCount: number,
  radius: number,
  squashFactor = 1
): Float32Array {
  const positions = [];

  for (let i = 0; i < starCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi) * squashFactor; // squash vertical axis here

    positions.push(x, y, z);
  }

  return new Float32Array(positions);
}

export const GalacticCore: React.FC<GalacticCoreProps> = ({
  starCount = 500,
  radius = 1,
  color = 'orange',
  size = 0.07,
  position = [0, 0, 0],
  squashFactor = 1,
}) => {
  const positions = useMemo(
    () => generateCoreStars(starCount, radius, squashFactor),
    [starCount, radius, squashFactor]
  );

  return (
    <group position={position}>
      <Points positions={positions} stride={3} frustumCulled>
        <PointMaterial color={color} size={size} sizeAttenuation />
      </Points>
    </group>
  );
};

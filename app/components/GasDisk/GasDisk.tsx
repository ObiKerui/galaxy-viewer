import React, { useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function generateGasDustPositions(
  count: number,
  radialScale: number,
  verticalScale: number
) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Radial distance sampled exponentially
    const r = -radialScale * Math.log(1 - Math.random());
    const clampedR = Math.min(r, radialScale);

    // Azimuth angle uniform
    const theta = Math.random() * 2 * Math.PI;

    // x, y coordinates on disk plane
    const x = clampedR * Math.cos(theta);
    const y = clampedR * Math.sin(theta);

    // z coordinate with small vertical spread
    const z = (Math.random() - 0.5) * verticalScale * 2;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

const GasDustDisk = ({ count = 2000 }) => {
  // Parameters for disk scale
  const radialScale = 100; // size of disk radius
  const verticalScale = 0.1; // thickness of the disk

  // Generate points position data once
  const positions = useMemo(
    () => generateGasDustPositions(count, radialScale, verticalScale),
    [count, radialScale, verticalScale]
  );

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <Points positions={positions} frustumCulled={false}>
        <PointMaterial
          color="#88ccff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          transparent
          opacity={0.5}
        />
      </Points>
    </group>
  );
};

export default GasDustDisk;

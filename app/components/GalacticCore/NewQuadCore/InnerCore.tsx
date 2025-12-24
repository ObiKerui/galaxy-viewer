import { useMemo } from 'react';
import * as THREE from 'three';
import { CloudQuads } from '../../CloudQuads/CloudQuads';

function pointOnEllipticalSphere(radius = 1, stretchX = 1.5): THREE.Vector3 {
  const u = Math.random();
  const v = Math.random();

  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);

  let x = sinPhi * Math.cos(theta);
  let y = cosPhi;
  let z = sinPhi * Math.sin(theta);

  // Bias stretch towards east/west (±X)
  const eastWestStrength = Math.abs(x); // 0 at YZ plane, 1 at ±X
  const stretch = 1 + (stretchX - 1) * eastWestStrength;

  x *= stretch;

  return new THREE.Vector3(x, y, z).multiplyScalar(radius);
}

function generateEllipticalSpherePoints(
  count: number,
  radius = 1,
  stretchY = 1.5
): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const p = pointOnEllipticalSphere(radius, stretchY);

    positions[i * 3 + 0] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  }

  return positions;
}

function generateUniformEllipticalSpherePoints(
  count: number,
  radius = 1,
  stretchX = 1.5,
  stretchY = 1,
  stretchZ = 1
): Float32Array {
  const positions = new Float32Array(count * 3);

  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399963

  for (let i = 0; i < count; i++) {
    // y goes from +1 to -1 uniformly
    const t = i / (count - 1);
    let y = 1 - 2 * t;

    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    let x = Math.cos(theta) * r;
    let z = Math.sin(theta) * r;

    // Stretch into ellipsoid
    x *= stretchX;
    y *= stretchY;
    z *= stretchZ;

    positions[i * 3 + 0] = x * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = z * radius;
  }

  return positions;
}

export function InnerCore({
  count = 300,
  radius = 2,
  stretchY = 5.8,
  opacity = 0.1,
}: {
  count?: number;
  radius?: number;
  stretchY?: number;
  opacity?: number;
}) {
  const positions = useMemo(
    () => generateEllipticalSpherePoints(count, radius, stretchY),
    [count, radius, stretchY]
  );

  //   const positions = useMemo(
  //     () => generateUniformEllipticalSpherePoints(count, radius, stretchY),
  //     [count, radius, stretchY]
  //   );

  return (
    <CloudQuads
      positions={positions}
      size={3.2}
      blending={THREE.AdditiveBlending}
      opacity={opacity}
    />
  );
}

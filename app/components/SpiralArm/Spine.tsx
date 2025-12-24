// Spine.tsx
'use client';
import * as THREE from 'three';
import { useMemo } from 'react';

export function Spine({
  points,
  colour = 'white',
}: {
  points: THREE.Vector3[];
  colour?: string;
}) {
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);

    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();
    return geometry;
  }, [points]);

  return (
    <line>
      <lineBasicMaterial color={colour} linewidth={2} />
      <primitive object={lineGeometry} attach="geometry" />
    </line>
  );
}

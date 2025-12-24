import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';

// function generateRandomPositions(count: number, spread: number) {
//   const positions = new Float32Array(count * 3);
//   for (let i = 0; i < count; i++) {
//     positions[i * 3 + 0] = (Math.random() - 0.5) * spread; // x
//     positions[i * 3 + 1] = (Math.random() - 0.5) * spread; // y
//     positions[i * 3 + 2] = (Math.random() - 0.5) * spread; // z
//   }
//   return positions;
// }

type CloudQuadsProps = {
  positions: Float32Array | number[]; // Explicit positions [x1,y1,z1, x2,y2,z2, ...]
  size?: number;
  blending?: THREE.Blending;
  opacity?: number;
};

export function CloudQuads({
  positions,
  size = 1,
  blending = THREE.NormalBlending,
  opacity = 0.18,
}: CloudQuadsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  // const texture = useLoader(THREE.TextureLoader, 'textures/instmesh.png');
  const texture = useLoader(THREE.TextureLoader, 'textures/cluster.png');

  // Calculate count from positions length (3 components per point)
  const count = positions.length / 3;

  // const pointsGeometry = useMemo(() => {
  //   const geometry = new THREE.BufferGeometry();
  //   geometry.setAttribute(
  //     'position',
  //     new THREE.Float32BufferAttribute(positions, 3)
  //   );
  //   return geometry;
  // }, [positions]);

  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      // Use explicit position from positions array
      const x = positions[i * 3 + 0];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      dummy.current.position.set(x, y, z);

      // Random-ish scale near size, or fixed if you prefer
      const scale = size * (Math.random() * 0.5 + 0.75);

      dummy.current.scale.set(
        scale * (Math.random() * 0.6 + 1.2),
        scale * (Math.random() * 0.3 + 0.7),
        1
      );

      dummy.current.rotation.set(0, 0, 0);

      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, count, size]);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.current.matrix);
      dummy.current.position.setFromMatrixPosition(dummy.current.matrix);

      // Billboard rotation to face camera
      dummy.current.lookAt(camera.position);
      dummy.current.rotation.z = 0; // Optional: keep upright

      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const planeGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(1, 1);
    // geom.rotateX(-Math.PI / 2); // Rotate to face camera looking along -Z axis
    return geom;
  }, []);

  // return (
  //   <points geometry={pointsGeometry}>
  //     <pointsMaterial size={0.2} color="white" sizeAttenuation={true} />
  //   </points>
  // );

  return (
    <instancedMesh
      ref={meshRef}
      args={[
        planeGeometry,
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          blending: blending,
          opacity: opacity,
          color: 'yellow',
        }),
        count,
      ]}
    />
  );
}

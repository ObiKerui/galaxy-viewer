import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';

type tRandomCloudQuadsProps = {
  count?: number;
  size?: number;
  spread?: number;
};

export function RandomCloudQuads({
  count = 1,
  size = 1,
  spread = 10,
}: tRandomCloudQuadsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  // Load texture atlas or single texture
  const texture = useLoader(
    THREE.TextureLoader,
    'textures/med-detail-atlas.png'
  );

  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      // Random position within a cube of size `spread`
      dummy.current.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      );

      // Random scale near `size`
      const scale = size * (Math.random() * 0.5 + 0.75);
      dummy.current.scale.set(scale, scale, scale);

      // Initially no rotation, will be updated each frame to face camera
      dummy.current.rotation.set(0, 0, 0);

      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, spread, size]);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.current.matrix);
      dummy.current.position.setFromMatrixPosition(dummy.current.matrix);

      // Billboard: rotate to face camera
      dummy.current.lookAt(camera.position);
      dummy.current.rotation.z = 0; // Keep quads upright, optional

      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
        count,
      ]}
    ></instancedMesh>
  );
}

import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export function populateBulgeInstances({
  mesh,
  count,
  length,
  radiusY,
  radiusZ,
}: {
  mesh: THREE.InstancedMesh;
  count: number;
  length: number;
  radiusY: number;
  radiusZ: number;
}) {
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i++) {
    // Position along bar (X axis)
    const x = THREE.MathUtils.randFloatSpread(length);

    // Radial falloff (denser in centre)
    const r = Math.random();
    const y = THREE.MathUtils.randFloatSpread(radiusY * (1 - r));
    const z = THREE.MathUtils.randFloatSpread(radiusZ * (1 - r));

    dummy.position.set(x, y, z);

    // Random small scale for variation
    const s = Math.random() * 0.6 + 0.2;
    dummy.scale.set(s, s, s);

    // const s = Math.random() * 4.2 + 0.6;
    // dummy.scale.set(s, s, s);
    // dummy.scale.set(10, 10, 10);

    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

export function InstancedBulgeStars({
  count = 1200,
  length = 40,
  radiusX = 8,
  radiusY = 4,
  radiusZ = 6,
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const starTexture = useLoader(THREE.TextureLoader, '/textures/circle.png');

  const starGeo = new THREE.PlaneGeometry(1, 1);
  const starMat = new THREE.MeshBasicMaterial({
    map: starTexture, // soft round PNG
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  useFrame(({ camera }) => {
    if (!ref.current) return;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      ref.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      // Make plane face camera
      dummy.lookAt(camera.position);

      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    if (!ref.current) return;

    populateBulgeInstances({
      mesh: ref.current,
      count,
      length,
      radiusY,
      radiusZ,
    });
  }, [count, length, radiusY, radiusZ]);

  return <instancedMesh ref={ref} args={[starGeo, starMat, count]} />;
}

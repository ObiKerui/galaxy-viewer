import React, { useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';

function initRandomScales(
  count: number,
  options?: {
    base?: number; // overall size
    xVariance?: number; // horizontal stretch
    yVariance?: number; // vertical stretch
    uniformZ?: number; // usually 1 for planes
    seed?: number; // optional deterministic seed
  }
): [number, number, number][] {
  const {
    base = 1,
    xVariance = 0.6,
    yVariance = 0.4,
    uniformZ = 1,
    seed,
  } = options ?? {};

  // Optional seeded RNG (so clusters are repeatable)
  let s = seed ?? Math.random() * 1e9;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const scales: [number, number, number][] = [];

  for (let i = 0; i < count; i++) {
    const baseScale = base * (0.7 + rnd() * 0.6); // ~70–130%

    const sx = baseScale * (1 + (rnd() - 0.5) * xVariance * 2);
    const sy = baseScale * (1 + (rnd() - 0.5) * yVariance * 2);

    scales.push([sx, sy, uniformZ]);
  }

  return scales;
}

type CloudQuadsProps = {
  positions: Float32Array | number[]; // [x1,y1,z1, x2,y2,z2, ...]
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
  const initialized = useRef(false);

  // Per-instance scale data must survive re-renders
  const scalesRef = useRef<[number, number, number][]>([]);

  const texture = useLoader(THREE.TextureLoader, 'textures/instmesh.png');
  const count = positions.length / 3;

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    // Initialise once
    if (scalesRef.current.length !== count) {
      scalesRef.current = initRandomScales(count, {
        base: size,
        xVariance: 0.8,
        yVariance: 0.4,
        seed: 1337, // optional
      });
    }

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      dummy.current.position.set(x, y, z);

      dummy.current.rotation.set(0, 0, 0);

      const [sx, sy, sz] = scalesRef.current[i];
      dummy.current.scale.set(sx, sy, sz);
      // dummy.current.scale.set(3, 1, 1);
      dummy.current.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, positions, size]);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.frustumCulled = false;
  }, []);

  /* -----------------------------------------------------------
   * BILLBOARD UPDATE (rotate only, keep position + scale)
   * --------------------------------------------------------- */
  useFrame(({ camera }) => {
    if (!meshRef.current || !initialized.current) return;

    for (let i = 0; i < count; i++) {
      const scale = scalesRef.current[i];
      if (!scale) continue; // extra safety

      meshRef.current.getMatrixAt(i, dummy.current.matrix);
      dummy.current.position.setFromMatrixPosition(dummy.current.matrix);

      dummy.current.lookAt(camera.position);
      dummy.current.rotation.z = 0;

      dummy.current.scale.set(...scale);
      dummy.current.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  /* -----------------------------------------------------------
   * GEOMETRY (faces +Z, perfect for billboards)
   * --------------------------------------------------------- */
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        blending,
        opacity: 0.5,
        color: 'white',
      }),
    [texture, blending]
  );

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

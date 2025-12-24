import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useState } from 'react';
// import { InstancedBulgeStars } from './InstancedBulgeStars';
import { PeanutBulgeGeometry } from './PeanutBulgeGeometry';
import { InstancedBulgeStars } from './InstancedBulgeStars';

export const BULGE_LOD = {
  MESH_ONLY: 1200,
  INSTANCED: 400,
};

export function Bulge({
  position = new THREE.Vector3(),
}: {
  position?: THREE.Vector3;
}) {
  const { camera } = useThree();
  // const worldPos = useRef(new THREE.Vector3());
  const [level, setLevel] = useState<'mesh' | 'instanced' | 'volumetric'>(
    'mesh'
  );

  useFrame(() => {
    const dist = camera.position.distanceTo(position);

    let next: typeof level = 'mesh';

    if (dist <= BULGE_LOD.INSTANCED) {
      next = 'volumetric';
    } else if (dist <= BULGE_LOD.MESH_ONLY) {
      next = 'instanced';
    }

    if (next !== level) setLevel(next);
  });

  return (
    <group position={position.toArray()}>
      {/* <MeshBulge /> */}
      {/* <PeanutBulgeGeometry /> */}
      <InstancedBulgeStars />

      {/* {level !== 'mesh' && <InstancedBulgeStars />} */}

      {/* {level === 'volumetric' && <VolumetricBulge />} */}
    </group>
  );
}

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PeanutMaterial } from './shaderMaterial';
import { extend, useFrame, useLoader } from '@react-three/fiber';

extend({ PeanutMaterial });

function createPeanutBarGeometry(
  length: number,
  radiusY: number,
  radiusZ: number
) {
  // const geo = new THREE.CylinderGeometry(1, 1, length, 32, 8, true);
  const geo = new THREE.CylinderGeometry(
    1, // radiusTop (will be reshaped anyway)
    1, // radiusBottom
    length,
    64, // radialSegments (IMPORTANT for smooth texture wrap)
    64, // heightSegments (keep low)
    true // openEnded (no caps)
  );

  const pos = geo.attributes.position;
  const count = pos.count;

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // normalized y from 0 to 1 along length
    const normY = (y + length / 2) / length;

    // radius scale (peanut shape)
    const radiusScale = 0.5 + 0.5 * Math.sin(normY * Math.PI);

    // scale x,z for elliptical shape
    pos.setX(i, x * radiusScale * radiusY);
    pos.setZ(i, z * radiusScale * radiusZ);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();

  // 🔥 THIS is the key
  geo.rotateZ(Math.PI / 2);

  return geo;
}

export function PeanutBulgeGeometry({
  length = 42,
  height = 4,
  depth = 3,
  lobeOffset = 20,
  rotation = [0, Math.PI / 4, 0],
}: {
  length?: number;
  height?: number;
  depth?: number;
  lobeOffset?: number;
  rotation?: [number, number, number];
}) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  // const barTexture = useLoader(THREE.TextureLoader, '/textures/coreBar.png');
  // barTexture.wrapS = THREE.RepeatWrapping; // around cylinder
  // barTexture.wrapT = THREE.ClampToEdgeWrapping; // top/bottom
  // barTexture.repeat.set(1, 0.6); // squash vertically
  // barTexture.offset.set(0, 0.2); // re-centre it
  // barTexture.wrapS = THREE.ClampToEdgeWrapping;
  // barTexture.wrapT = THREE.ClampToEdgeWrapping;
  // barTexture.needsUpdate = true;

  const barGeometry = useMemo(
    () => createPeanutBarGeometry(length, height, depth),
    [length, height, depth]
  );

  // Update cameraDirection uniform every frame for correct rim lighting
  // useFrame(({ camera }) => {
  //   if (materialRef.current) {
  //     const camDir = new THREE.Vector3();
  //     camera.getWorldDirection(camDir);
  //     materialRef.current.uniforms.cameraDirection.value.copy(camDir);
  //   }
  // });

  // const peanutMaterial = useMemo(
  //   () =>
  //     new THREE.MeshBasicMaterial({
  //       color: '#ffb36b',
  //       transparent: true,
  //       opacity: 0.85,
  //     }),
  //   []
  // );

  return (
    <group rotation={rotation}>
      {/* Central bar */}
      <mesh
        geometry={barGeometry}
        // material={peanutMaterial}
        // rotation={[0, 0, Math.PI / 2]}
      >
        {/* <meshBasicMaterial
          map={barTexture}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        /> */}
        <peanutMaterial
          ref={materialRef}
          opacity={0.85}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Left lobe */}
      <mesh position={[-lobeOffset, 0, 0]}>
        <sphereGeometry args={[height, 24, 16]} />
        <peanutMaterial ref={materialRef} />
      </mesh>

      {/* Right lobe */}
      <mesh position={[lobeOffset, 0, 0]}>
        <sphereGeometry args={[height, 24, 16]} />
        <peanutMaterial ref={materialRef} />
      </mesh>
    </group>
  );
}

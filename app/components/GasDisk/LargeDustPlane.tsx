import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

type tLargeDustPlane = {
  position?: THREE.Vector3;
  opacity?: number;
  size?: number;
  texturePath?: string;
};

export const LargeDustPlane = ({
  position = new THREE.Vector3(0, 0, 0),
  opacity = 1.0,
  size = 20,
  texturePath = '/textures/large-base-disc-2.png',
}: tLargeDustPlane) => {
  const texture = useLoader(THREE.TextureLoader, texturePath);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[1.0, 1, 1]}
    >
      <circleGeometry args={[size, 16]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

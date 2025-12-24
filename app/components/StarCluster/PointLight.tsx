import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function GlowSprite({
  position,
  colour = new THREE.Color('orange'),
  size = 1,
}: {
  position: THREE.Vector3;
  colour?: THREE.Color;
  size?: number;
}) {
  const texture = useLoader(THREE.TextureLoader, '/textures/light-orb.png');

  const material = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: texture,
        color: colour,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    [colour, texture]
  );

  return (
    <sprite position={position} material={material} scale={[size, size, 1]} />
  );
}

export function PointLight({ position }: { position: THREE.Vector3 }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  const [intensity, setIntensity] = useState(0);

  useFrame(() => {
    if (!lightRef.current) return;

    const dist = camera.position.distanceTo(position);
    // Increase intensity when closer than 20 units, else zero
    const targetIntensity =
      dist < 20 ? THREE.MathUtils.lerp(0, 1.5, (20 - dist) / 20) : 0;

    setIntensity(targetIntensity);
    lightRef.current.intensity = targetIntensity;
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={position.toArray()}
        color="orange"
        intensity={intensity * 10}
        distance={100}
        decay={2}
      />
      <GlowSprite
        position={position}
        colour={new THREE.Color('white')}
        size={intensity * 2}
      />
    </>
  );
}

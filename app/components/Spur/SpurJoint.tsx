import { useMemo } from 'react';
import { SpurConfig } from './config';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';

type JointLayer = {
  texture: THREE.Texture;
  z: number;
  scale: number;
  rotation: number;
  opacity: number;
};

export function SpurJoint({
  position,
  textures,
  seed,
  options,
}: {
  position: [number, number, number];
  textures: THREE.Texture[];
  seed: number;
  options: SpurConfig['jointOptions'];
}) {
  const rand = useMemo(() => mulberry32(seed), [seed]);

  const count = options?.count ?? 3;
  const spread = options?.spread ?? 0.5;

  const layersData = useMemo<JointLayer[]>(() => {
    const rand = mulberry32(seed);

    const layers = visual.layers ?? 3;
    const depth = visual.depth ?? 0.6;

    const pick = <T,>(v: T | [T, T]): T =>
      Array.isArray(v) ? v[0] + rand() * (v[1] - v[0]) : v;

    return Array.from({ length: layers }).map((_, i) => {
      const texPath =
        visual.textures[Math.floor(rand() * visual.textures.length)];

      const texture = textureLookup.get(texPath)!;

      const z = (i / (layers - 1 || 1) - 0.5) * depth + (rand() - 0.5) * 0.1;

      const scale = pick(visual.scale ?? 1);
      const rotation = pick(visual.rotation ?? 0);
      const opacity = pick(visual.opacity ?? 0.5);

      return {
        texture,
        z,
        scale,
        rotation,
        opacity,
      };
    });
  }, [visual, seed]);

  return (
    <group position={position}>
      {layersData.map((layer, i) => (
        <Billboard key={i} follow lockY>
          <mesh
            position={[0, 0, layer.z]}
            rotation={[0, 0, layer.rotation]}
            scale={layer.scale}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={layer.texture}
              transparent
              opacity={layer.opacity}
              depthWrite={false}
            />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}

import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

function applyJaggedNoiseToCylinder(
  geometry: BufferGeometry,
  noiseAmplitude = 0.3,
  noiseFrequencyRadial = 1.5,
  noiseFrequencyHeight = 8.0,
  jitterAmount = 0.05
) {
  const noise3D = createNoise3D();
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);

    let radialNoise = noise3D(
      x * noiseFrequencyRadial,
      y * 1.0,
      z * noiseFrequencyRadial
    );
    radialNoise = radialNoise * 2 - 1;

    let heightNoise = noise3D(0, y * noiseFrequencyHeight, 0);
    heightNoise = heightNoise * 2 - 1;

    const jitter = (Math.random() - 0.5) * jitterAmount;

    const newX = x + radialNoise * noiseAmplitude + jitter;
    const newZ = z + radialNoise * noiseAmplitude + jitter;
    const newY = y + heightNoise * noiseAmplitude * 0.2;

    position.setX(i, newX);
    position.setZ(i, newZ);
    position.setY(i, newY);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

type DustLaneProps = {
  radius?: number;
  width?: number;
  opacity?: number;
  rotation?: number;
  y?: number;
};

export function DustLane({
  radius = 0.3,
  width = 6,
  opacity = 1,
  rotation = 0,
  y = 0,
}: DustLaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const rawTexture = useTexture('/textures/testDust.png');

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(radius, radius, 10, 18, 1, true);
    applyJaggedNoiseToCylinder(geo);
    return geo;
  }, [radius]);

  const dustTexture = useMemo(() => {
    const tex = rawTexture.clone();
    tex.colorSpace = THREE.NoColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    // 🔁 rotate UVs so long edge runs along cylinder height
    tex.center.set(0.5, 0.5);
    tex.rotation = Math.PI / 2;
    // tex.repeat.set(2, 1);
    tex.minFilter = THREE.LinearMipMapLinearFilter;
    tex.magFilter = THREE.LinearFilter;

    tex.needsUpdate = true;
    return tex;
  }, [rawTexture]);

  return (
    <mesh
      ref={meshRef}
      rotation={[Math.PI / 2, 0, rotation]}
      position={[20, y, 10]}
      geometry={geometry}
    >
      <meshBasicMaterial
        transparent
        opacity={opacity}
        alphaTest={0.01}
        depthWrite={false}
        side={THREE.DoubleSide}
        color="white"
        alphaMap={dustTexture}
      />
    </mesh>
  );
}

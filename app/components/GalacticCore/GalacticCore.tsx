import { useLoader } from '@react-three/fiber';
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CloudPoints } from '../CloudPoints/CloudPoints';

type GalacticCoreProps = {
  starCount?: number;
  radius?: number;
  color?: string;
  size?: number;
  position?: [number, number, number];
  squashFactor?: number;
  orientation?: [number, number, number];
  squashY?: number;
  stretchX?: number;
  stretchZ?: number;
};

function generateCoreStars(
  starCount: number,
  radius: number,
  squashY = 1,
  stretchX = 1,
  stretchZ = 1
) {
  const positions = new Float32Array(starCount * 3);
  const opacities = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const u = Math.random();
    const v = Math.random();

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());

    let x = r * Math.sin(phi) * Math.cos(theta);
    let y = r * Math.sin(phi) * Math.sin(theta);
    let z = r * Math.cos(phi);

    x *= stretchX;
    y *= squashY;
    z *= stretchZ;

    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // --- opacity weighting ---
    const rNorm = r / radius; // 0 → center, 1 → edge
    const falloff = 2.5; // higher = sharper core
    const baseOpacity = Math.pow(1 - rNorm, falloff);

    // small randomness so it doesn’t look artificial
    opacities[i] = baseOpacity * (0.6 + Math.random() * 0.4);
  }

  return { positions, opacities };
}

// function generateCoreStars(
//   starCount: number,
//   radius: number,
//   squashY = 1,
//   stretchX = 1,
//   stretchZ = 1
// ): Float32Array {
//   const positions = [];

//   for (let i = 0; i < starCount; i++) {
//     const u = Math.random();
//     const v = Math.random();

//     const theta = 2 * Math.PI * u;
//     const phi = Math.acos(2 * v - 1);
//     const r = radius * Math.cbrt(Math.random());

//     // base sphere coords
//     let x = r * Math.sin(phi) * Math.cos(theta);
//     let y = r * Math.sin(phi) * Math.sin(theta);
//     let z = r * Math.cos(phi);

//     // apply stretching
//     x *= stretchX;
//     y *= squashY;
//     z *= stretchZ;

//     positions.push(x, y, z);
//   }

//   return new Float32Array(positions);
// }

export const GalacticCore: React.FC<GalacticCoreProps> = ({
  starCount = 12000,
  radius = 200,
  position = [0, 0, 0],
  orientation = [0, 0, 0],
  squashY = 0.3,
  stretchX = 1.5,
  stretchZ = 1.2,
}) => {
  const atlasTexture = useLoader(
    THREE.TextureLoader,
    '/textures/med-detail-atlas.png'
  );

  const { positions, opacities } = useMemo(
    () => generateCoreStars(starCount, radius, squashY, stretchX, stretchZ),
    [starCount, radius, squashY, stretchX, stretchZ]
  );

  return (
    <group position={position} rotation={orientation}>
      <CloudPoints
        positions={positions}
        opacities={opacities}
        atlasTexture={atlasTexture}
        atlasGridSize={3}
        pointSize={600}
        opacity={1.0}
        colour={new THREE.Color(0xffc266)} // softer golden-orange
        blending={THREE.NormalBlending}
      />
    </group>
  );
};

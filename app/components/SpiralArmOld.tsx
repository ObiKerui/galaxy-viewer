import { PointMaterial, Points } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { TextureLoader } from 'three';

type tSpiralArmProps = {
  turns?: number;
  pointsPerTurn?: number;
  a?: number;
  b?: number;
  scatter?: number;
  color?: string;
  size?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

function generateSpiralArmPoints(
  turns: number,
  pointsPerTurn: number,
  a: number,
  b: number,
  scatter: number
): Float32Array {
  const positions = [];
  const totalPoints = turns * pointsPerTurn;

  for (let i = 0; i < totalPoints; i++) {
    const theta = (i / pointsPerTurn) * 2 * Math.PI;

    // Spiral radius with some noise
    const rBase = a + b * theta;

    // Density falloff: reduce star count as radius increases
    // Use exponential decay or other falloff function
    const densityFactor = Math.exp(-rBase * 0.5); // Adjust 0.5 to control falloff steepness

    // Random chance to skip point to create density falloff
    if (Math.random() > densityFactor) continue;

    // Radius with scatter perpendicular to arm
    const r = rBase + (Math.random() - 0.5) * scatter;

    // Cartesian coordinates of star
    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);

    // Scatter in perpendicular direction (thickness of arm)
    const perpScatter = (Math.random() - 0.5) * scatter * 2;
    // Calculate perpendicular vector components for scatter
    x += perpScatter * Math.cos(theta + Math.PI / 2);
    y += perpScatter * Math.sin(theta + Math.PI / 2);

    // Slight z scatter for 3D effect
    const z = (Math.random() - 0.5) * scatter;

    positions.push(x, y, z);
  }

  return new Float32Array(positions);
}

export const SpiralArm = ({
  turns = 3,
  pointsPerTurn = 100,
  a = 0.2,
  b = 0.15,
  scatter = 0.05,
  color = 'white',
  size = 0.1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: tSpiralArmProps) => {
  const circleTexture = useLoader(TextureLoader, '/textures/circle.png');

  const positions = useMemo(
    () => generateSpiralArmPoints(turns, pointsPerTurn, a, b, scatter),
    [turns, pointsPerTurn, a, b, scatter]
  );

  return (
    <group position={position} rotation={rotation}>
      <Points positions={positions} stride={3} frustumCulled>
        <PointMaterial
          map={circleTexture}
          color={color}
          size={size}
          sizeAttenuation
          transparent
          depthWrite={false}
          alphaTest={0.01}
        />
      </Points>
    </group>
  );
};

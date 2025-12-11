'use client';
// src/components/GalaxyViewer.tsx
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GalacticCore } from './GalacticCore';
import { SpiralArm } from './SpiralArm';

const GalaxyViewer = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <GalacticCore
        starCount={600}
        radius={1}
        color="orange"
        size={0.07}
        squashFactor={0.4}
      />
      <SpiralArm clustersPerTurn={100} color="cyan" />
      {/* <SpiralArm clustersPerTurn={100} color="magenta" /> */}
      <SpiralArm clustersPerTurn={100} color="white" />
      {/* <SpiralArm clustersPerTurn={100} color="lime" /> */}
      {/* <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh> */}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default GalaxyViewer;

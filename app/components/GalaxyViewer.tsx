'use client';
// src/components/GalaxyViewer.tsx
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { BarSpine } from './GalacticCore/NewPeanutCore/BarSpine';
import { InnerCore } from './GalacticCore/NewPeanutCore/InnerCore';
import { Lobe } from './GalacticCore/NewPeanutCore/Lobe';
import { OuterCore } from './GalacticCore/NewPeanutCore/OuterCore';
import { ARMS } from './SpiralArm/Configuration';
import { SpiralArm } from './SpiralArm/SpiralArm';
import { DustLane } from './DustLane/DustLane';
import GasDustDisk from './GasDisk/GasDisk';
import GalaxyDustPlane from './GasDisk/DustPlane';
import { RandomCloudQuads } from './CloudQuads/RandomCloudQuads';
import { StarClusterQuads } from './StarCluster/StarClusterQuads';

import { InnerCore as NewInnerCore } from './GalacticCore/NewQuadCore/InnerCore';
import { OuterCore as NewOuterCore } from './GalacticCore/NewQuadCore/OuterCore';
import { LargeDustPlane } from './GasDisk/LargeDustPlane';
import { GalaxyLODProvider } from '../utils/GalaxyLodProvider';

const GalaxyViewer = () => {
  const leftLobePosition = new THREE.Vector3(-12, 0, 0);
  const rightLobePosition = new THREE.Vector3(12, 0, 0);

  return (
    <Canvas camera={{ position: [100, 60, 60], fov: 60 }}>
      <GalaxyLODProvider>
        {/* Perseus */}
        <SpiralArm clusters={60} {...ARMS['perseus']} />

        {/* Norma Outer */}
        <SpiralArm clusters={60} {...ARMS['norma']} />

        {/* Scutum Centaurus */}
        <SpiralArm clusters={60} {...ARMS['centaurus']} />

        {/* Sagittaurius Arm */}
        <SpiralArm clusters={60} {...ARMS['sagittarius']} />

        {/* <mesh scale={[5.8, 2, 2]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="yellow" transparent opacity={0.9} />
      </mesh> */}

        {/* Galactic Core */}
        <group scale={[1.5, 1.5, 1.5]}>
          <NewInnerCore radius={2} opacity={0.09} />
          <NewOuterCore radius={4.0} opacity={0.01} />
          <Lobe center={leftLobePosition} />
          <Lobe center={rightLobePosition} />
        </group>

        <LargeDustPlane size={80} opacity={0.1} />
        <group position={[5, 20, 10]}>
          {/* <RandomCloudQuads count={100} spread={10} /> */}
          <StarClusterQuads spread={5} position={new THREE.Vector3(2, 1, 10)} />
        </group>

        <OrbitControls enableZoom={true} />
      </GalaxyLODProvider>
    </Canvas>
  );
};

export default GalaxyViewer;

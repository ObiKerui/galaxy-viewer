import { useFrame, useThree } from '@react-three/fiber';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import * as THREE from 'three';

// type LODEntry = {
//   distance: number;
// };

// type GalaxyLODContextType = {
//   register: (id: string, getPosition: () => THREE.Vector3) => void;
//   unregister: (id: string) => void;
//   getDistance: (id: string) => number;
// };

export const GalaxyLODContext = createContext<GalaxyLODContextType | null>(
  null
);

export function useGalaxyLOD() {
  const ctx = useContext(GalaxyLODContext);
  if (!ctx)
    throw new Error('useGalaxyLOD must be used inside GalaxyLODProvider');
  return ctx;
}

type LODBand = 'low' | 'medium' | 'high';

type LODEntry = {
  getPosition: () => THREE.Vector3;
  band: LODBand;
};

type GalaxyLODContextType = {
  register: (id: string, getPosition: () => THREE.Vector3) => void;
  unregister: (id: string) => void;
  getBand: (id: string) => LODBand;
};

export function GalaxyLODProvider({ children }: { children: ReactNode }) {
  const { camera } = useThree();

  const entries = useRef(new Map<string, LODEntry>());
  const bands = useRef(new Map<string, LODBand>());

  const [, forceUpdate] = useState(0);

  const register = (id: string, getPosition: () => THREE.Vector3) => {
    entries.current.set(id, { getPosition, band: 'low' });
    bands.current.set(id, 'low');
  };

  const unregister = (id: string) => {
    entries.current.delete(id);
    bands.current.delete(id);
  };

  const getBand = (id: string) => bands.current.get(id) ?? 'low';

  useFrame(() => {
    let changed = false;

    for (const [id, entry] of entries.current) {
      const d = camera.position.distanceTo(entry.getPosition());

      let next: LODBand = 'low';
      if (d < 20) next = 'high';
      else if (d < 40) next = 'medium';

      if (next !== entry.band) {
        entry.band = next;
        bands.current.set(id, next);
        changed = true;
      }
    }

    // if (changed) forceUpdate((n) => n + 1);
  });

  return (
    <GalaxyLODContext.Provider value={{ register, unregister, getBand }}>
      {children}
    </GalaxyLODContext.Provider>
  );
}

// export function GalaxyLODProvider({ children }: { children: ReactNode }) {
//   const { camera } = useThree();

//   const entries = useRef(
//     new Map<
//       string,
//       {
//         getPosition: () => THREE.Vector3;
//         distance: number;
//       }
//     >()
//   );

//   const register = (id: string, getPosition: () => THREE.Vector3) => {
//     entries.current.set(id, {
//       getPosition,
//       distance: Infinity,
//     });
//   };

//   const unregister = (id: string) => {
//     entries.current.delete(id);
//   };

//   const getDistance = (id: string) => {
//     return entries.current.get(id)?.distance ?? Infinity;
//   };

//   useFrame(() => {
//     for (const entry of entries.current.values()) {
//       const pos = entry.getPosition();
//       entry.distance = camera.position.distanceTo(pos);
//     }
//   });

//   return (
//     <GalaxyLODContext.Provider value={{ register, unregister, getDistance }}>
//       {children}
//     </GalaxyLODContext.Provider>
//   );
// }

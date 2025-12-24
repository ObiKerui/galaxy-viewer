import { useThree, useFrame } from '@react-three/fiber';
import { useState, useRef } from 'react';
import * as THREE from 'three';

interface CombinedLODOptions {
  position?: THREE.Vector3;
  farThreshold?: number; // beyond this only low detail shows
  fadeStart?: number; // start fading medium/high detail
  fadeEnd?: number; // fully visible medium/high detail
}

interface LODState {
  distance: number;
  showLowDetail: boolean;
  showMediumHighDetail: boolean;
  mediumHighOpacity: number;
}

/**
 * useCombinedLOD returns LOD state and opacity for smooth progressive LOD,
 * combining mutually exclusive rendering far away, and fading in closer.
 */
export function useCombinedLOD({
  position,
  farThreshold = 50,
  fadeStart = 40,
  fadeEnd = 20,
}: CombinedLODOptions): LODState {
  const { camera } = useThree();

  const stateRef = useRef<LODState>({
    distance: 0,
    showLowDetail: true,
    showMediumHighDetail: false,
    mediumHighOpacity: 0,
  });

  const [state, setState] = useState<LODState>({
    distance: 0,
    showLowDetail: true,
    showMediumHighDetail: false,
    mediumHighOpacity: 0,
  });

  useFrame(() => {
    if (!position) return;

    const dist = camera.position.distanceTo(position);

    let mediumHighOpacity = 0;
    if (dist <= fadeEnd) mediumHighOpacity = 1;
    else if (dist < fadeStart) {
      mediumHighOpacity = 1 - (dist - fadeEnd) / (fadeStart - fadeEnd);
    }

    const showLowDetail = dist > farThreshold || dist > fadeStart;
    const showMediumHighDetail = dist <= fadeStart;

    const prev = stateRef.current;

    // Only update when something VISUALLY changes
    if (
      prev.showLowDetail !== showLowDetail ||
      prev.showMediumHighDetail !== showMediumHighDetail ||
      Math.abs(prev.mediumHighOpacity - mediumHighOpacity) > 0.05
    ) {
      const next: LODState = {
        distance: dist,
        showLowDetail,
        showMediumHighDetail,
        mediumHighOpacity,
      };

      stateRef.current = next;
      setState(next);
    }
  });

  return state;
}

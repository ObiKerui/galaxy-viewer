/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as THREE from 'three';
import type { ReactThreeFiber } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      testElement: any;
      cloudPointsMaterial: ReactThreeFiber.MaterialNode<any, any>;
      // cloudPointsMaterial: ReactThreeFiber.MaterialNode<
      //   typeof import('../app/components/StarCluster').CloudPointsMaterial,
      //   [THREE.ShaderMaterialParameters]
      // >;
    }
  }
}

export {};

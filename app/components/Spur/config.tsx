export type SpurConfig = {
  joints: [number, number, number][];
  textures: string[]; // atlas or per-joint
  seed?: number;

  jointOptions?: {
    count?: number; // how many planes per joint
    scale?: [number, number];
    opacity?: [number, number];
    spread?: number; // local scatter radius
    rotation?: [number, number];
  };
};

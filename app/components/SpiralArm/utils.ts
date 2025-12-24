import { randGen } from '@/app/utils/randomOps';
import * as THREE from 'three';

function angularDistance(a: number, b: number) {
  let diff = Math.abs(a - b) % (2 * Math.PI);
  if (diff > Math.PI) diff = 2 * Math.PI - diff;
  return diff;
}

function gaussian(x: number, mean: number, stdDev: number) {
  const diff = x - mean;
  return Math.exp(-(diff * diff) / (2 * stdDev * stdDev));
}

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate points arranged like clock positions on YZ plane,
 * with radius at each angle following a "double peak" bell curve,
 * producing an eclipse/ellipse shape.
 *
 * @param origin Center point (x fixed)
 * @param numPoints Number of points
 * @param maxRadius Maximum radius at peaks (12 and 6 o'clock)
 * @param minRadius Minimum radius at valleys (3 and 9 o'clock)
 * @param sigma Width of bell lobes in radians (smaller = tighter peaks)
 */
export function generateEclipseBranchingPoints(
  numPoints: number,
  maxRadius: number,
  minRadius: number,
  sigma: number
) {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < numPoints; i++) {
    const theta = (2 * Math.PI * i) / numPoints;

    const radius =
      maxRadius *
        (gaussian(angularDistance(theta, 0), 0, sigma) +
          gaussian(angularDistance(theta, Math.PI), 0, sigma)) +
      minRadius;

    // y,z coords on circle with this radius
    const y = radius * Math.sin(theta);
    const z = radius * Math.cos(theta);
    const x = 0;

    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

export function randomizeX(
  points: THREE.Vector3[],
  spread: number,
  seed: number
): THREE.Vector3[] {
  const rand = mulberry32(seed);
  return points.map((p) => {
    // const offset = (Math.random() * 2 - 1) * spread; // random between -spread and +spread
    const offset = rand() * 2 * spread; // random +spread
    return new THREE.Vector3(p.x + offset, p.y, p.z);
  });
}

/**
 * Generate points arranged like clock positions on YZ plane,
 * with radius at each angle following a "double peak" bell curve,
 * producing an eclipse/ellipse shape.
 *
 * @param origin Center point (x fixed)
 * @param numPoints Number of points
 * @param maxRadius Maximum radius at peaks (12 and 6 o'clock)
 * @param minRadius Minimum radius at valleys (3 and 9 o'clock)
 * @param sigma Width of bell lobes in radians (smaller = tighter peaks)
 */
// export function generateEclipseBranchingPoints(
//   origin: THREE.Vector3,
//   numPoints: number,
//   maxRadius: number,
//   minRadius: number,
//   sigma: number
// ) {
//   const points: THREE.Vector3[] = [];

//   for (let i = 0; i < numPoints; i++) {
//     const theta = (2 * Math.PI * i) / numPoints;

//     const radius =
//       maxRadius *
//         (gaussian(angularDistance(theta, 0), 0, sigma) +
//           gaussian(angularDistance(theta, Math.PI), 0, sigma)) +
//       minRadius;

//     // y,z coords on circle with this radius
//     const y = origin.y + radius * Math.sin(theta);
//     const z = origin.z + radius * Math.cos(theta);
//     const x = origin.x;

//     points.push(new THREE.Vector3(x, y, z));
//   }

//   return points;
// }

/**
 * Rotate points so that the ring, originally lying on the YZ plane
 * (normal along +X), points towards `targetDir`.
 *
 * @param points array of THREE.Vector3
 * @param targetDir THREE.Vector3 - direction vector to align with (must be normalized)
 * @returns new array of rotated THREE.Vector3
 */
export function rotateToCentre(
  points: THREE.Vector3[],
  targetDir: THREE.Vector3
) {
  const rotatedPoints: THREE.Vector3[] = [];

  // Original normal vector of the ring plane is along X axis
  const originalNormal = new THREE.Vector3(1, 0, 0);

  // Compute quaternion that rotates originalNormal to targetDir
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    originalNormal,
    targetDir.clone().normalize()
  );

  for (const p of points) {
    // Apply rotation to each point relative to origin (assuming origin is 0,0,0)
    const rotated = p.clone().applyQuaternion(quaternion);
    rotatedPoints.push(rotated);
  }

  return rotatedPoints;
}

export function generateBiasedBranchPoints({
  center,
  count,
  radius,
  seed,
  yBias = 0.15,
}: {
  center: THREE.Vector3;
  count: number;
  radius: number;
  seed: number;
  yBias?: number; // 1 = no flattening, smaller = stronger bias toward center plane
}) {
  const rnd = randGen(seed);
  const arr: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(2 * rnd() - 1);
    const r = rnd() * radius;

    // direction on sphere
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );

    // apply flattening bias toward Y=0 plane
    dir.y *= yBias; // shrink vertical component => cluster around the plane
    dir.normalize();

    arr.push(
      new THREE.Vector3(
        center.x + dir.x * r,
        center.y + dir.y * r,
        center.z + dir.z * r
      )
    );
  }

  return arr;
}

export function convertToArrayBuffer(points: THREE.Vector3[]) {
  const arr = new Float32Array(points.length * 3);

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const i3 = i * 3;

    arr[i3 + 0] = p.x;
    arr[i3 + 1] = p.y;
    arr[i3 + 2] = p.z;
  }

  return arr;
}

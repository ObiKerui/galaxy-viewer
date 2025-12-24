// prettier-ignore
const majorBranchCounts = [
  0, 0, 0, 0, 0, 0, 0, 3, 3, 3,
  6, 6, 6, 6, 5, 35, 24, 24, 24, 24,
  24, 25, 25, 25, 25, 25, 22, 22, 22, 22,
  12, 11, 10, 19, 8, 7, 7, 7, 7, 7,
  7, 6, 6, 6, 6, 5, 4, 3, 3, 3,
  3, 3, 3, 3, 3, 2, 2, 2, 2, 1,
];

// prettier-ignore
const majorGlowRadius = [
  0, 0, 0, 0, 0, 3, 3, 3, 3, 3,
  6, 6, 6, 8, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  10, 10, 10, 10, 10, 10, 10, 10,
  10, 8, 8, 8, 6, 6, 6, 6,
  4, 4, 4, 4, 4, 3, 3, 3, 3, 3,
  2, 2, 2, 2, 2, 2, 0, 0, 0, 0,
];

// prettier-ignore
const majorRadiusValues = [
  0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.6, 0.5, 0.5, 0.5,
  0.8, 1.0, 1.2, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5,
  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5,
  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5,
  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5,
  1.0, 1.0, 0.5, 0.5, 0.2, 0.2, 0.2, 0.1, 0.1, 0.1,
];

// prettier-ignore
const majorOpacityValues = [
  0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.25, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
];

// prettier-ignore
const minorBranchCounts = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
  5, 10, 10, 10, 20, 20, 12, 13, 18, 14,
  14, 15, 15, 15, 15, 15, 12, 12, 12, 12,
  20, 13, 13, 13, 13, 14, 14, 14, 14, 15,
  14, 19, 18, 17, 16, 15, 14, 13, 12, 11,
  10, 9, 8, 7, 17, 18, 19, 20, 20, 20,
  20, 19, 18, 17, 16, 15, 14, 13, 12, 11,
  10, 19, 8, 7, 7, 7, 7, 7, 7, 6,
  6, 6, 20, 5, 4, 3, 3, 3, 3, 2,
  2, 2, 2, 2, 2, 1, 1, 1, 1, 0,
];

// prettier-ignore
const minorGlowRadius = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 3, 8, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 7, 7, 7, 7, 6,
  6, 6, 6, 6, 6, 4, 4, 4,
  3, 3, 3, 3, 3, 2, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

// prettier-ignore
const minorRadiusValues = [
  0.0, 0.0, 0.2, 0.4, 0.4, 0.6, 0.6, 0.5, 0.5, 0.5,
  0.8, 1.0, 1.2, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5,
  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5,
  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5,
  1.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.2, 0.2,
  0.5, 0.5, 0.5, 0.5, 0.2, 0.2, 0.2, 0.1, 0.1, 0.1,
];

// prettier-ignore
const minorOpacityValues = [
  0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
  0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
  0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
  0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
  0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
  0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04,
];

const persiusBranchCounts = majorBranchCounts;
const persiusGlowRadius = majorGlowRadius;
const perseusRadiusValues = majorRadiusValues;
const perseusOpacityValues = majorOpacityValues;

const centaurusBranchCounts = majorBranchCounts;
const centaurusGlowRadius = majorGlowRadius;
const centaurusRadiusValues = majorRadiusValues;
const centaurusOpacityValues = majorOpacityValues;

const sagittariusBranchCounts = minorBranchCounts;
const sagittariusGlowRadius = minorGlowRadius;
const sagittariusRadiusValues = minorRadiusValues;
const sagittariusOpacityValues = minorOpacityValues;

const normaBranchCounts = minorBranchCounts;
const normaGlowRadius = minorGlowRadius;
const normaRadiusValues = minorRadiusValues;
const normaOpacityValues = minorOpacityValues;

const armLabels = ['perseus', 'sagittarius', 'centaurus', 'norma'] as const;
type tArmLabels = (typeof armLabels)[number];

type tSpiralArmConfig = {
  name: string;
  armOffset: number; // offset angle for separate arms
  pitch: number; // tilt angle of the arm
  branchProfile?: number[]; // array defining number of branches at intervals along the arm
  radialProfile?: number[]; // optional array defining radius at intervals along the arm
  radiusProfile?: number[]; // radius of points helps to create narrowing of arms
  opacityProfile?: number[];
};

export const ARMS: Record<tArmLabels, tSpiralArmConfig> = {
  perseus: {
    name: 'Perseus',
    armOffset: 0,
    pitch: 0.18,
    branchProfile: persiusBranchCounts,
    radialProfile: persiusGlowRadius,
    radiusProfile: perseusRadiusValues,
    opacityProfile: perseusOpacityValues,
  },
  sagittarius: {
    name: 'Sagittarius',
    armOffset: Math.PI * 1.45,
    pitch: 0.2, // slightly tighter
    branchProfile: sagittariusBranchCounts,
    radialProfile: sagittariusGlowRadius,
    radiusProfile: sagittariusRadiusValues,
    opacityProfile: sagittariusOpacityValues,
  },
  centaurus: {
    name: 'Centaurus',
    armOffset: Math.PI,
    pitch: 0.18,
    branchProfile: centaurusBranchCounts,
    radialProfile: centaurusGlowRadius,
    radiusProfile: centaurusRadiusValues,
    opacityProfile: centaurusOpacityValues,
  },
  norma: {
    name: 'Norma',
    armOffset: Math.PI * 0.55,
    pitch: 0.22, // tightest
    branchProfile: normaBranchCounts,
    radialProfile: normaGlowRadius,
    radiusProfile: normaRadiusValues,
    opacityProfile: normaOpacityValues,
  },
};

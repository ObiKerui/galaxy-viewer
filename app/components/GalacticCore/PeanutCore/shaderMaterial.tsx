import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const vertexShader = `
precision mediump float;

varying float vLengthPos;
varying vec3 vNormal;

void main() {
  // Pass Y coordinate (assuming bar along Y axis) normalized for gradient
  // Assuming length centered at origin from -length/2 to +length/2
  vLengthPos = (position.y + 21.0) / 42.0; // normalize between 0 and 1 for length=42

  vNormal = normalMatrix * normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
precision mediump float;

uniform vec3 baseColor;
uniform float opacity;

varying float vLengthPos;
varying vec3 vNormal;

void main() {
  // Normalized normal-to-view facing fade (rim lighting)
  float facing = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
  float rimFade = smoothstep(0.0, 0.6, facing);

  // Length fade: fade alpha near ends of peanut along Y axis (vLengthPos from 0 to 1)
  float lengthFade = smoothstep(0.1, 0.5, vLengthPos) * smoothstep(0.9, 0.5, vLengthPos);

  // Combine rim and length fades for final alpha
  float alpha = opacity * rimFade * lengthFade;

  // Blend base color and add a bit of glow on rim edges
  vec3 color = baseColor + vec3(0.2, 0.1, 0.0) * (1.0 - rimFade);

  gl_FragColor = vec4(color, alpha);

  if(alpha < 0.01) discard;
}
`;

// const vertexShader = `
// precision mediump float;

// varying float vRadiusPos; // distance from axis normalized
// varying vec3 vNormal;

// void main() {
//   // Compute distance from Y axis (radius in XZ plane)
//   // float radius = length(position.xz);
//   float radius = length(vec2(position.y, position.z));

//   // Max radius assumed ~ radiusY or radiusZ (here normalized by 1.5 as approx max radius)
//   // Adjust 1.5 to your max radius for correct fade range
//   vRadiusPos = radius / 1.5;

//   vNormal = normalMatrix * normal;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// const fragmentShader = `
// precision mediump float;

// uniform vec3 baseColor;
// uniform float opacity;

// varying float vRadiusPos;
// varying vec3 vNormal;

// void main() {
//   // Rim fade based on normal facing camera
//   float facing = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
//   float rimFade = smoothstep(0.0, 0.6, facing);

//   // Fade alpha by distance from axis: full opacity near center (vRadiusPos=0), fade out at edges (vRadiusPos>=1)
//   float radiusFade = 1.0 - smoothstep(0.7, 1.0, vRadiusPos);

//   // Combine rim fade and radius fade for final alpha
//   float alpha = opacity * rimFade * radiusFade;

//   // Color base plus some glow near edges
//   vec3 color = baseColor + vec3(0.2, 0.1, 0.0) * (1.0 - rimFade);

//   gl_FragColor = vec4(color, alpha);

//   if (alpha < 0.01) discard;
// }
// `;

// Create shader material with your shaders and uniforms
export const PeanutMaterial = shaderMaterial(
  {
    baseColor: new THREE.Color('#ffb36b'),
    glowColor: new THREE.Color('#ffd98c'),
    opacity: 0.85,
  },
  vertexShader,
  fragmentShader,
  (material) => {
    if (!material) return;
    material.transparent = true;
    material.depthWrite = false;
    material.blending = THREE.NormalBlending;
  }
);

import * as THREE from 'three';

export default function createCircleTexture(size = 64, color = '#ffffff') {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const center = size / 2;

  ctx.beginPath();
  ctx.arc(center, center, center, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

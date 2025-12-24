export function MeshBulge() {
  return (
    <mesh>
      <boxGeometry args={[10, 4, 2]} />
      <meshBasicMaterial color="#ffb36b" transparent opacity={0.85} />
      {/* <meshStandardMaterial
        emissive="#ffb36b"
        emissiveIntensity={1.2}
        transparent
        opacity={0.85}
      /> */}
    </mesh>
  );
}

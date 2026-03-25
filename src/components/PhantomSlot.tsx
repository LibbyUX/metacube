interface PhantomSlotProps {
  position: [number, number, number];
  dimensions: [number, number, number];
  opacity: number;
}

/** Faint wireframe box for an empty/unexplored cell */
export function PhantomSlot({ position, dimensions, opacity }: PhantomSlotProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={dimensions} />
      <meshBasicMaterial
        color="#c0c8d0"
        transparent
        opacity={opacity}
        depthWrite={false}
        wireframe
      />
    </mesh>
  );
}

import { Edges } from "@react-three/drei";

interface PhantomSlotProps {
  position: [number, number, number];
  dimensions: [number, number, number];
  opacity: number;
}

/** Faint wireframe outline for an empty/unexplored cell — light grey for light mode */
export function PhantomSlot({ position, dimensions, opacity }: PhantomSlotProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={dimensions} />
      <meshBasicMaterial
        color="#d0d5dd"
        transparent
        opacity={opacity * 0.4}
        depthWrite={false}
      />
      <Edges threshold={0} color="#c0c8d0" lineWidth={0.5} />
    </mesh>
  );
}

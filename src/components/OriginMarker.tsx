import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Edges } from "@react-three/drei";

interface OriginMarkerProps {
  position: [number, number, number];
  dimensions: [number, number, number];
}

/**
 * Glowing red wireframe box that marks the origin —
 * the starting point from which the search space expands.
 * Pulses gently to draw attention.
 */
export function OriginMarker({ position, dimensions }: OriginMarkerProps) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      const t = clock.getElapsedTime();
      matRef.current.opacity = 0.06 + 0.04 * Math.sin(t * 1.5);
    }
  });

  return (
    <mesh position={position}>
      <boxGeometry args={dimensions} />
      <meshBasicMaterial
        ref={matRef}
        color="#ff2222"
        transparent
        opacity={0.08}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
      <Edges threshold={0} color="#ff4444" lineWidth={2} />
    </mesh>
  );
}

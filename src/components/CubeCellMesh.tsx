import { useRef, useState } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { CubeCell } from "../data/datasets";

interface CubeCellMeshProps {
  cell: CubeCell;
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  opacity: number;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: (cell: CubeCell | null) => void;
  onClick: (cell: CubeCell) => void;
}

export function CubeCellMesh({
  cell,
  position,
  dimensions,
  color,
  opacity,
  isSelected,
  isHovered,
  isDimmed,
  onHover,
  onClick,
}: CubeCellMeshProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [localHover, setLocalHover] = useState(false);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHover(true);
    onHover(cell);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHover(false);
    onHover(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(cell);
  };

  const finalOpacity = isDimmed ? opacity * 0.15 : opacity;
  const emissiveIntensity = isHovered || localHover ? 0.4 : isSelected ? 0.25 : 0;

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <boxGeometry args={dimensions} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={finalOpacity}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
      <Edges
        threshold={0}
        color={isHovered || localHover ? "#1f2937" : isSelected ? "#d97706" : "#9ca3af"}
        lineWidth={isHovered || localHover ? 2 : 1}
      />
    </mesh>
  );
}

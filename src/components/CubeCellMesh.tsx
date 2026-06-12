import { useRef, useState } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import type { CubeCell } from "../data/dataModel";
import { useTheme } from "../data/themeContext";

interface CubeCellMeshProps {
  cell: CubeCell;
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  opacity: number;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isGhost: boolean;
  isGhostHighlighted?: boolean;
  isAccent?: boolean;
  accentColor?: string;
  /** When true (gradient/size_colour mode), render data cells unlit so the encoded
   * colour is faithful — scene lighting must not modulate a value-carrying hue. */
  unlit?: boolean;
  onHover: (cell: CubeCell | null) => void;
  onClick: (cell: CubeCell) => void;
}

export function CubeCellMesh({
  cell, position, dimensions, color, opacity,
  isSelected, isHovered, isDimmed, isGhost, isGhostHighlighted = false,
  isAccent = false, accentColor, unlit = false,
  onHover, onClick,
}: CubeCellMeshProps) {
  const { theme } = useTheme();
  const ref = useRef<THREE.Mesh>(null);
  const [localHover, setLocalHover] = useState(false);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setLocalHover(true); onHover(cell); };
  const handlePointerOut  = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setLocalHover(false); onHover(null); };
  const handleClick       = (e: ThreeEvent<MouseEvent>)   => { e.stopPropagation(); onClick(cell); };

  const finalOpacity = isGhost
    ? (isHovered || localHover ? 0.15 : isGhostHighlighted ? 0.18 : 0.0)
    : isSelected ? 1.0 : isDimmed ? Math.min(opacity, 0.12) : opacity;
  const finalColor = isGhost ? "#d1d5db" : isAccent ? (accentColor ?? theme.cell_accent) : color;
  // Base glow so cells self-illuminate against the dark gradient stage.
  const emissiveIntensity = isHovered || localHover ? 0.55 : isSelected ? 0.4 : 0.22;
  const edgeColor = isGhost
    ? (isHovered || localHover ? "#9fb4af" : isGhostHighlighted ? "#9fb4af" : "#6f8580")
    : isAccent
      ? (isHovered || localHover ? "#ecd6f5" : isSelected ? "#ecd6f5" : theme.edge_selected)
      : (isHovered || localHover ? theme.edge_hover : isSelected ? theme.edge_selected : theme.edge);
  const edgeWidth = isGhost
    ? (isHovered || localHover ? 2.5 : isGhostHighlighted ? 2.0 : 1.5)
    : (isHovered || localHover ? 2 : 1);

  return (
    <mesh ref={ref} position={position} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={handleClick}>
      <boxGeometry args={dimensions} />
      {unlit && !isGhost && !isAccent ? (
        // Unlit: displayed colour == finalColor exactly, independent of lighting/normals,
        // so the value-encoding gradient reads faithfully. Hover/selection emphasis is
        // carried by the Edges below.
        <meshBasicMaterial color={finalColor} transparent opacity={finalOpacity} />
      ) : (
        <meshStandardMaterial color={finalColor} transparent opacity={finalOpacity} emissive={finalColor} emissiveIntensity={isGhost ? 0 : emissiveIntensity} />
      )}
      <Edges threshold={0} color={edgeColor} lineWidth={edgeWidth} />
    </mesh>
  );
}

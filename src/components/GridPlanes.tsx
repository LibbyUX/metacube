import React from "react";
import * as THREE from "three";
import { useTheme } from "../data/themeContext";

interface GridPlanesProps {
  organisms: string[];
  modalities: string[];
  cubeSize: number;
  gap: number;
}

/** Translucent divider planes between organism columns and modality rows */
export function GridPlanes({ organisms, modalities, cubeSize, gap }: GridPlanesProps) {
  const { theme } = useTheme();
  const half = cubeSize / 2;
  const orgCount = organisms.length;
  const modCount = modalities.length;
  const bandW = (cubeSize - gap * (orgCount + 1)) / orgCount;
  const bandH = (cubeSize - gap * (modCount + 1)) / modCount;

  const planes: React.JSX.Element[] = [];

  // Vertical planes between organism columns (YZ planes)
  for (let i = 1; i < orgCount; i++) {
    const x = -half + gap * i + bandW * i + gap / 2;
    planes.push(
      <mesh key={`vplane-${i}`} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[cubeSize, cubeSize]} />
        <meshBasicMaterial
          color={theme.grid}
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    );
  }

  // Horizontal planes between modality rows (XZ planes)
  for (let j = 1; j < modCount; j++) {
    const y = -half + gap * j + bandH * j + gap / 2;
    planes.push(
      <mesh key={`hplane-${j}`} position={[0, y, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[cubeSize, cubeSize]} />
        <meshBasicMaterial
          color={theme.grid}
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    );
  }

  return <group>{planes}</group>;
}

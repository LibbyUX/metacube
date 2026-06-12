import * as THREE from "three";
import { useTheme } from "../data/themeContext";

interface OuterCubeProps {
  size: number;
}

export function OuterCube({ size }: OuterCubeProps) {
  const { theme } = useTheme();
  return (
    <group>
      {/* Clean 12-edge wireframe only — no face mesh to avoid diagonal seams */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color={theme.wire} transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}

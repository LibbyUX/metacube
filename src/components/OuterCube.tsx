import * as THREE from "three";

interface OuterCubeProps {
  size: number;
  opacity: number;
}

export function OuterCube({ size, opacity }: OuterCubeProps) {
  const showFaces = opacity > 0.01;

  return (
    <group>
      {/* Wireframe edges — light grey */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#b0b8c0" transparent opacity={0.6} />
      </lineSegments>

      {showFaces && (
        <mesh>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color="#e8ecf0"
            transparent
            opacity={opacity}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

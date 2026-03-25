import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  generateUmapPoints,
  generateTrajectories,
  clusters,
  UmapPoint,
} from "./umapData";

/** Instanced point cloud for the UMAP embedding */
function PointCloud({ points }: { points: UmapPoint[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => {
    const arr = new Float32Array(points.length * 3);
    const c = new THREE.Color();
    points.forEach((p, i) => {
      c.set(p.color);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    });
    return arr;
  }, [points]);

  useMemo(() => {
    if (!meshRef.current) return;
    points.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [points, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshStandardMaterial vertexColors={false} />
      <instancedBufferAttribute
        attach="geometry-attributes-color"
        args={[colorArray, 3]}
      />
    </instancedMesh>
  );
}

/** Simpler approach: individual small spheres (fine for ~700 points) */
function Points({ points }: { points: UmapPoint[] }) {
  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.035, 5, 5]} />
          <meshStandardMaterial color={p.color} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** Trajectory curves with arrowhead at the end */
function Trajectories() {
  const trajectories = useMemo(() => generateTrajectories(), []);

  return (
    <group>
      {trajectories.map((traj, i) => {
        const pts = traj.points.map(
          (p) => new THREE.Vector3(p.x, p.y, p.z)
        );
        const curve = new THREE.CatmullRomCurve3(pts);
        const curvePoints = curve.getPoints(40);

        // Arrowhead direction
        const last = curvePoints[curvePoints.length - 1];
        const prev = curvePoints[curvePoints.length - 3];
        const dir = new THREE.Vector3().subVectors(last, prev).normalize();

        return (
          <group key={i}>
            <Line
              points={curvePoints.map((p) => [p.x, p.y, p.z] as [number, number, number])}
              color={traj.color}
              lineWidth={2.5}
              transparent
              opacity={0.7}
            />
            {/* Arrowhead */}
            <mesh position={last} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)}>
              <coneGeometry args={[0.06, 0.18, 6]} />
              <meshStandardMaterial color={traj.color} transparent opacity={0.8} />
            </mesh>
            {/* Label */}
            <Text
              position={[last.x + dir.x * 0.25, last.y + dir.y * 0.25 + 0.12, last.z + dir.z * 0.25]}
              fontSize={0.1}
              color={traj.color}
              anchorX="center"
              anchorY="bottom"
              fontWeight="bold"
            >
              {traj.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

/** Cluster labels at cluster centers */
function ClusterLabels() {
  return (
    <group>
      {clusters.map((cl) => (
        <Text
          key={cl.name}
          position={[cl.center[0], cl.center[1] + 0.55, cl.center[2]]}
          fontSize={0.085}
          color="#3a3a50"
          anchorX="center"
          anchorY="bottom"
          fontWeight="bold"
        >
          {cl.name}
        </Text>
      ))}
    </group>
  );
}

/** Slow auto-rotation */
function AutoRotate() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });
  return <group ref={groupRef} />;
}

function UmapContent() {
  const points = useMemo(() => generateUmapPoints(), []);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <Points points={points} />
      <Trajectories />
      <ClusterLabels />
    </group>
  );
}

export function UmapScene() {
  return (
    <Canvas
      camera={{ position: [4, 2.5, 4], fov: 35, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
      style={{ width: "100%", height: "100%", background: "#ffffff" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={0.5} />
      <directionalLight position={[-3, 2, -2]} intensity={0.2} />
      <UmapContent />
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={3}
        maxDistance={12}
      />
    </Canvas>
  );
}

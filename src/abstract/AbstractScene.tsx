import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  rawRecords,
  buildCubeCells,
  TRIMMED_ORGANISMS,
  TRIMMED_MODALITIES,
  TRIMMED_ORGANS,
  isOriginCell,
  distanceFromOrigin,
} from "../data/datasets";
import { createSizeColorScale } from "../data/colors";

const CUBE_SIZE = 3.8;
const GAP = 0.025;

function AbstractCube() {
  const cells = useMemo(() => buildCubeCells(rawRecords), []);

  const allOrganisms = [...TRIMMED_ORGANISMS] as string[];
  const allModalities = [...TRIMMED_MODALITIES] as string[];
  const allOrgans = [...TRIMMED_ORGANS] as string[];

  const dataKeys = new Set(cells.map((c) => `${c.organism}|${c.modality}|${c.organ}`));
  const maxSize = Math.max(...cells.map((c) => c.size), 1);
  const sizeColor = createSizeColorScale(maxSize);

  const half = CUBE_SIZE / 2;
  const orgCount = allOrganisms.length;
  const modCount = allModalities.length;
  const organCount = allOrgans.length;

  const bandX = (CUBE_SIZE - GAP * (orgCount + 1)) / orgCount;
  const bandY = (CUBE_SIZE - GAP * (modCount + 1)) / modCount;
  const bandZ = (CUBE_SIZE - GAP * (organCount + 1)) / organCount;
  const cellSize = Math.min(bandX, bandY, bandZ);

  const xFor = (i: number) => -half + GAP * (i + 1) + bandX * i + bandX / 2;
  const yFor = (j: number) => -half + GAP * (j + 1) + bandY * j + bandY / 2;
  const zFor = (k: number) => -half + GAP * (k + 1) + bandZ * k + bandZ / 2;

  const maxDist = Math.sqrt(orgCount ** 2 + modCount ** 2 + organCount ** 2) / 2;

  // Indices for labeled organisms/modalities/organs (ones with data)
  const dataOrgs = new Set(cells.map((c) => c.organism));
  const dataMods = new Set(cells.map((c) => c.modality));
  const dataOrgans = new Set(cells.map((c) => c.organ));

  return (
    <group>
      {/* Outer cube — edges only */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)]} />
        <lineBasicMaterial color="#b0b8c0" transparent opacity={0.6} />
      </lineSegments>

      {/* Phantom slots near center */}
      {allOrganisms.map((org, oi) =>
        allModalities.map((mod, mi) =>
          allOrgans.map((organ, ti) => {
            const key = `${org}|${mod}|${organ}`;
            if (dataKeys.has(key)) return null;
            const dist = distanceFromOrigin(oi, mi, ti, allOrganisms, allModalities, allOrgans);
            if (dist > maxDist * 0.45) return null;
            const normDist = dist / maxDist;
            const opacity = Math.max(0.01, 0.08 * (1 - normDist * 1.5));
            return (
              <mesh key={`p-${key}`} position={[xFor(oi), yFor(mi), zFor(ti)]}>
                <boxGeometry args={[cellSize, cellSize, cellSize]} />
                <meshBasicMaterial color="#c0c8d0" transparent opacity={opacity} depthWrite={false} />
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(cellSize, cellSize, cellSize)]} />
                  <lineBasicMaterial color="#b0bcc5" transparent opacity={opacity * 2} />
                </lineSegments>
              </mesh>
            );
          })
        )
      )}

      {/* Origin markers */}
      {allOrganisms.map((org, oi) =>
        allModalities.map((mod, mi) =>
          allOrgans.map((organ, ti) => {
            if (!isOriginCell(org, mod, organ)) return null;
            return (
              <mesh key={`o-${org}|${mod}|${organ}`} position={[xFor(oi), yFor(mi), zFor(ti)]}>
                <boxGeometry args={[cellSize + 0.025, cellSize + 0.025, cellSize + 0.025]} />
                <meshBasicMaterial color="#cc0000" transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} />
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(cellSize + 0.025, cellSize + 0.025, cellSize + 0.025)]} />
                  <lineBasicMaterial color="#cc2222" linewidth={2} />
                </lineSegments>
              </mesh>
            );
          })
        )
      )}

      {/* Data cells */}
      {cells.map((cell) => {
        const oi = allOrganisms.indexOf(cell.organism);
        const mi = allModalities.indexOf(cell.modality);
        const ti = allOrgans.indexOf(cell.organ);
        if (oi === -1 || mi === -1 || ti === -1) return null;

        const color = sizeColor(cell.size);
        return (
          <mesh
            key={`${cell.organism}|${cell.modality}|${cell.organ}`}
            position={[xFor(oi), yFor(mi), zFor(ti)]}
          >
            <boxGeometry args={[cellSize, cellSize, cellSize]} />
            <meshStandardMaterial color={color} transparent opacity={0.92} />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(cellSize, cellSize, cellSize)]} />
              <lineBasicMaterial color="#555555" transparent opacity={0.3} />
            </lineSegments>
          </mesh>
        );
      })}

      {/* Axis labels — X: Organism */}
      {allOrganisms.map((org, i) => {
        const hasData = dataOrgs.has(org);
        return (
          <Text
            key={`xl-${org}`}
            position={[xFor(i), -half - 0.18, half + 0.05]}
            fontSize={hasData ? 0.075 : 0.055}
            color={hasData ? "#2a2a3e" : "#a0a8b0"}
            anchorX="center"
            anchorY="top"
            rotation={[-0.25, 0, 0]}
          >
            {org}
          </Text>
        );
      })}
      <Text position={[0, -half - 0.38, half + 0.05]} fontSize={0.065} color="#5a5a7a" anchorX="center" anchorY="top" rotation={[-0.25, 0, 0]} fontWeight="bold">
        Organism
      </Text>

      {/* Axis labels — Y: Modality */}
      {allModalities.map((mod, j) => {
        const hasData = dataMods.has(mod);
        return (
          <Text
            key={`yl-${mod}`}
            position={[-half - 0.08, yFor(j), half + 0.05]}
            fontSize={hasData ? 0.06 : 0.045}
            color={hasData ? "#2a2a3e" : "#a0a8b0"}
            anchorX="right"
            anchorY="middle"
            rotation={[-0.25, 0, 0]}
          >
            {mod}
          </Text>
        );
      })}
      <Text position={[-half - 0.08, 0, half + 0.05]} fontSize={0.065} color="#5a5a7a" anchorX="right" anchorY="middle" rotation={[-0.25, 0, -Math.PI / 2]} fontWeight="bold">
        Modality
      </Text>

      {/* Axis labels — Z: Organ */}
      {allOrgans.map((organ, k) => {
        const hasData = dataOrgans.has(organ);
        return (
          <Text
            key={`zl-${organ}`}
            position={[half + 0.08, -half - 0.18, zFor(k)]}
            fontSize={hasData ? 0.065 : 0.05}
            color={hasData ? "#2a2a3e" : "#a0a8b0"}
            anchorX="left"
            anchorY="top"
            rotation={[0, Math.PI / 2, 0]}
          >
            {organ}
          </Text>
        );
      })}
      <Text position={[half + 0.08, -half - 0.38, 0]} fontSize={0.065} color="#5a5a7a" anchorX="center" anchorY="top" rotation={[0, Math.PI / 2, 0]} fontWeight="bold">
        Organ / Tissue
      </Text>

      {/* Annotation: arrow + label pointing at origin */}
      <Text
        position={[xFor(5) + 0.6, yFor(7) + 0.7, zFor(4) + 0.6]}
        fontSize={0.09}
        color="#cc2222"
        anchorX="left"
        anchorY="bottom"
        fontWeight="bold"
      >
        Origin
      </Text>
      <Text
        position={[xFor(5) + 0.6, yFor(7) + 0.55, zFor(4) + 0.6]}
        fontSize={0.06}
        color="#666680"
        anchorX="left"
        anchorY="bottom"
      >
        {"Human × scRNA-seq × Brain"}
      </Text>
    </group>
  );
}

export function AbstractScene() {
  return (
    <Canvas
      camera={{ position: [5, 4, 5], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
      style={{ width: "100%", height: "100%", background: "#ffffff" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <directionalLight position={[-4, 3, -2]} intensity={0.25} />
      <AbstractCube />
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={3}
        maxDistance={12}
      />
    </Canvas>
  );
}

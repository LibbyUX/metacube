/**
 * 3D drill-down cube: shows dataset × cell_type matrix for a selected outer cube cell.
 * Loads data from /census_drilldown.json on demand.
 */

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { scaleSqrt } from "d3-scale";

interface DrilldownEntry {
  d: string; // dataset title
  c: string; // cell type
  n: number; // count
}

interface DrilldownCubeProps {
  organism: string;
  organ: string;
  assay: string;
  onClose: () => void;
}

// Distinct colors for datasets
const DATASET_COLORS = [
  "#e53935", "#8e24aa", "#3949ab", "#00897b", "#43a047",
  "#f4511e", "#1e88e5", "#fdd835", "#6d4c41", "#546e7a",
  "#d81b60", "#00acc1", "#7cb342", "#ff8f00", "#5e35b1",
];

const CUBE_SIZE = 4;
const GAP = 0.06;
const MAX_DATASETS = 12;
const MAX_CELLTYPES = 15;

function DrilldownScene({
  entries,
  organism,
  organ,
  assay,
}: {
  entries: DrilldownEntry[];
  organism: string;
  organ: string;
  assay: string;
}) {
  // Aggregate: dataset → cell_type → count
  const matrix = useMemo(() => {
    const map = new Map<string, Map<string, number>>();
    for (const e of entries) {
      if (!map.has(e.d)) map.set(e.d, new Map());
      const inner = map.get(e.d)!;
      inner.set(e.c, (inner.get(e.c) || 0) + e.n);
    }
    return map;
  }, [entries]);

  // Top datasets and cell types by total count
  const { datasets, cellTypes, maxCount } = useMemo(() => {
    const dsTotals = new Map<string, number>();
    const ctTotals = new Map<string, number>();
    for (const [ds, cts] of matrix) {
      let dsSum = 0;
      for (const [ct, n] of cts) {
        dsSum += n;
        ctTotals.set(ct, (ctTotals.get(ct) || 0) + n);
      }
      dsTotals.set(ds, dsSum);
    }
    const datasets = [...dsTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_DATASETS)
      .map(([name]) => name);
    const cellTypes = [...ctTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_CELLTYPES)
      .map(([name]) => name);
    let max = 0;
    for (const ds of datasets) {
      for (const ct of cellTypes) {
        const v = matrix.get(ds)?.get(ct) || 0;
        if (v > max) max = v;
      }
    }
    return { datasets, cellTypes, maxCount: max };
  }, [matrix]);

  const half = CUBE_SIZE / 2;
  const nx = datasets.length;
  const ny = cellTypes.length;
  const bandX = (CUBE_SIZE - GAP * (nx + 1)) / nx;
  const bandY = (CUBE_SIZE - GAP * (ny + 1)) / ny;
  const cellW = Math.min(bandX, bandY);
  const xOf = (i: number) => -half + GAP * (i + 1) + bandX * i + bandX / 2;
  const yOf = (j: number) => -half + GAP * (j + 1) + bandY * j + bandY / 2;

  const depthScale = useMemo(
    () =>
      scaleSqrt<number>()
        .domain([0, maxCount])
        .range([0.02, 1.5])
        .clamp(true),
    [maxCount],
  );

  const colorScale = useMemo(
    () =>
      scaleSqrt<string>()
        .domain([0, maxCount * 0.25, maxCount])
        .range(["#e8eaf6", "#e65100", "#ffee58"])
        .clamp(true),
    [maxCount],
  );

  // Tooltip state
  const [hovered, setHovered] = useState<{
    ds: string;
    ct: string;
    count: number;
  } | null>(null);

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={12}
      />

      {/* Title */}
      <Text
        position={[0, half + 0.4, 0]}
        fontSize={0.14}
        color="#1a1a2e"
        anchorX="center"
        anchorY="bottom"
        fontWeight="bold"
      >
        {organism} — {assay} — {organ}
      </Text>

      {/* Dataset labels (X axis) */}
      {datasets.map((ds, i) => {
        // Truncate long names
        const label = ds.length > 30 ? ds.slice(0, 28) + "..." : ds;
        return (
          <Text
            key={`xl-${i}`}
            position={[xOf(i), -half - 0.15, half]}
            fontSize={0.06}
            color="#2a2a3e"
            anchorX="center"
            anchorY="top"
            maxWidth={bandX * 1.5}
          >
            {label}
          </Text>
        );
      })}
      <Text
        position={[0, -half - 0.45, half]}
        fontSize={0.08}
        color="#5a5a7a"
        anchorX="center"
        anchorY="top"
        fontWeight="bold"
      >
        Dataset
      </Text>

      {/* Cell type labels (Y axis) */}
      {cellTypes.map((ct, j) => (
        <Text
          key={`yl-${j}`}
          position={[-half - 0.08, yOf(j), half]}
          fontSize={0.06}
          color="#2a2a3e"
          anchorX="right"
          anchorY="middle"
          maxWidth={1.5}
        >
          {ct}
        </Text>
      ))}
      <Text
        position={[-half - 0.08, 0, half]}
        fontSize={0.08}
        color="#5a5a7a"
        anchorX="right"
        anchorY="middle"
        rotation={[0, 0, Math.PI / 2]}
        fontWeight="bold"
      >
        Cell Type
      </Text>

      {/* 3D bars */}
      {datasets.map((ds, i) =>
        cellTypes.map((ct, j) => {
          const count = matrix.get(ds)?.get(ct) || 0;
          if (count === 0) return null;
          const depth = depthScale(count);
          const color = colorScale(count);
          return (
            <mesh
              key={`${i}-${j}`}
              position={[xOf(i), yOf(j), -depth / 2]}
              onPointerOver={() => setHovered({ ds, ct, count })}
              onPointerOut={() => setHovered(null)}
            >
              <boxGeometry args={[cellW * 0.9, cellW * 0.9, depth]} />
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.88}
              />
              <lineSegments>
                <edgesGeometry
                  args={[
                    new THREE.BoxGeometry(cellW * 0.9, cellW * 0.9, depth),
                  ]}
                />
                <lineBasicMaterial color="#999" transparent opacity={0.3} />
              </lineSegments>
            </mesh>
          );
        }),
      )}

      {/* Tooltip as 3D text */}
      {hovered && (
        <Text
          position={[0, half + 0.15, 1]}
          fontSize={0.09}
          color="#333"
          anchorX="center"
          anchorY="bottom"
        >
          {hovered.ct} — {hovered.count.toLocaleString()} cells
        </Text>
      )}
    </>
  );
}

export function DrilldownCube({
  organism,
  organ,
  assay,
  onClose,
}: DrilldownCubeProps) {
  const [entries, setEntries] = useState<DrilldownEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = `${organism}|${organ}|${assay}`;
    fetch(`${import.meta.env.BASE_URL}census_drilldown.json`)
      .then((r) => r.json())
      .then((data) => {
        const rows = data[key];
        if (rows) {
          setEntries(rows);
        } else {
          setError(`No drill-down data for ${key}`);
        }
      })
      .catch((e) => setError(e.message));
  }, [organism, organ, assay]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.97)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 12,
          right: 16,
          zIndex: 110,
          background: "#e53935",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "8px 18px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        Close
      </button>

      {error && (
        <div style={{ padding: 40, color: "#c00", fontSize: 16 }}>{error}</div>
      )}

      {!entries && !error && (
        <div
          style={{
            padding: 40,
            color: "#666",
            fontSize: 16,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          Loading drill-down data...
        </div>
      )}

      {entries && (
        <Canvas
          camera={{
            position: [4, 3, 5],
            fov: 40,
            near: 0.01,
            far: 100,
          }}
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
          style={{ flex: 1 }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color("#fafafa");
          }}
        >
          <DrilldownScene
            entries={entries}
            organism={organism}
            organ={organ}
            assay={assay}
          />
        </Canvas>
      )}
    </div>
  );
}

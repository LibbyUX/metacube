/**
 * Animated graphical-abstract video.
 *
 * Sequence:
 *   0-3 s    Full cube – isometric view of all dataset cells
 *   3-6 s    Zoom in – camera moves to Human/scRNA-seq/Brain cell
 *   6-10 s   Treemap – overlay shows sub-datasets
 *  10-13 s   Zoom out – camera returns to full cube
 *  14-20 s   Dissolve → Brain – cubes fade, 10K dots stream to brain
 *  20-24 s   Orbit brain – with ghost mesh + shadow
 *  24-28 s   UMAP – brain morphs to 2D UMAP embedding
 *  28-33 s   Hold – final 2D view with cluster labels
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Billboard, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  rawRecords,
  buildCubeCells,
  isOriginCell,
  distanceFromOrigin,
} from "../data/datasets";
import { createSizeColorScale } from "../data/colors";
import { brainPoints } from "./brainPoints";

/* ══════════════════════════════════════════════════════════════
   Trimmed axes — only categories with data + 1 neighbor each side
   ══════════════════════════════════════════════════════════════ */
const ORGANISMS = [
  "Rat", "Mouse", "Human", "Macaque", "Marmoset",
] as const;

const VIDEO_MODALITIES = [
  "WGS",
  "small RNA-seq",
  "scRNA-seq",
  "Multiome",
  "bulk RNA-seq",
  "scRNA (blood)",
  "Proteomics",
] as const;

const VIDEO_ORGANS = [
  "Heart",
  "CSF",
  "Brain",
  "Blood",
  "Multi-region",
  "Kidney",
] as const;

/* ══════════════════════════════════════════════════════════════
   UMAP clusters – neurons grouped upper half, non-neuronal lower
   ══════════════════════════════════════════════════════════════ */
const VIDEO_CLUSTERS = [
  // Neuronal (upper)
  { name: "Dopaminergic neurons", center: [-1.8, 2.2, 0] as [number,number,number], spread: 0.35, count: 140, color: "#e53935" },
  { name: "GABAergic neurons",    center: [0.3, 2.8, 0]  as [number,number,number], spread: 0.35, count: 120, color: "#8e24aa" },
  { name: "Glutamatergic neurons",center: [2.2, 2.0, 0]  as [number,number,number], spread: 0.35, count: 110, color: "#3949ab" },
  // Non-neuronal (lower)
  { name: "Astrocytes",           center: [-2.2, -1.0, 0] as [number,number,number], spread: 0.4, count: 130, color: "#00897b" },
  { name: "Microglia",            center: [0.0, -1.8, 0]  as [number,number,number], spread: 0.35, count: 100, color: "#f4511e" },
  { name: "Oligodendrocytes",     center: [2.2, -1.2, 0]  as [number,number,number], spread: 0.4, count: 110, color: "#1e88e5" },
  { name: "OPCs",                 center: [-1.0, -3.0, 0] as [number,number,number], spread: 0.3, count: 65,  color: "#43a047" },
  { name: "Endothelial",          center: [1.2, -3.0, 0]  as [number,number,number], spread: 0.3, count: 55,  color: "#fdd835" },
];

/* ══════════════════════════════════════════════════════════════
   Timeline
   ══════════════════════════════════════════════════════════════ */
const T = {
  CUBE: 0,
  ZOOM_IN: 3,
  TREEMAP: 5,
  ZOOM_OUT: 10,
  CUBE_BACK: 13,
  DISSOLVE: 14,
  DISSOLVE_END: 15.5,
  BRAIN: 20,
  ORBIT: 20,
  TO_UMAP: 24,
  UMAP: 28,
  END: 33,
};

/* ══════════════════════════════════════════════════════════════
   Math
   ══════════════════════════════════════════════════════════════ */
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ss = (x: number) => { const c = clamp01(x); return c * c * (3 - 2 * c); };
const remap = (t: number, a: number, b: number) => (t - a) / (b - a);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function mkRng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function gaussPair(rng: () => number): [number, number] {
  const u1 = rng(), u2 = rng();
  const r = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10)));
  return [r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)];
}

/* ══════════════════════════════════════════════════════════════
   Cube grid layout
   ══════════════════════════════════════════════════════════════ */
const SZ = 3.8, GP = 0.025, HF = SZ / 2;
const NX = ORGANISMS.length, NY = VIDEO_MODALITIES.length, NZ = VIDEO_ORGANS.length;
const bx = (SZ - GP * (NX + 1)) / NX;
const by = (SZ - GP * (NY + 1)) / NY;
const bz = (SZ - GP * (NZ + 1)) / NZ;
const cs = Math.min(bx, by, bz);
const xOf = (i: number) => -HF + GP * (i + 1) + bx * i + bx / 2;
const yOf = (j: number) => -HF + GP * (j + 1) + by * j + by / 2;
const zOf = (k: number) => -HF + GP * (k + 1) + bz * k + bz / 2;

const BRAIN_POS: [number, number, number] = [
  xOf(ORGANISMS.indexOf("Human")),
  yOf((VIDEO_MODALITIES as readonly string[]).indexOf("scRNA-seq")),
  zOf((VIDEO_ORGANS as readonly string[]).indexOf("Brain")),
];

/* ══════════════════════════════════════════════════════════════
   Camera keyframes — one fewer brain orbit turn
   ══════════════════════════════════════════════════════════════ */
const CK = [
  { t: 0,  p: [5, 3.5, 5], a: [0, 0, 0] },
  { t: 3,  p: [5, 3.5, 5], a: [0, 0, 0] },
  { t: 5.5, p: [BRAIN_POS[0]+0.55, BRAIN_POS[1]+0.2, BRAIN_POS[2]+0.55], a: [...BRAIN_POS] },
  { t: 10, p: [BRAIN_POS[0]+0.55, BRAIN_POS[1]+0.2, BRAIN_POS[2]+0.55], a: [...BRAIN_POS] },
  { t: 13, p: [5, 3.5, 5], a: [0, 0, 0] },
  { t: 15, p: [6, 4, 5], a: [0, 0, 0] },
  // Brain phase — further back, single orbit
  { t: 20, p: [8, 3, 7], a: [0, 0, 0] },
  { t: 24, p: [-7, 3, 7], a: [0, 0, 0] },
  // Front view for UMAP
  { t: 27, p: [0, 0.5, 10], a: [0, 0.5, 0] },
  { t: 29, p: [0, 0, 10], a: [0, 0, 0] },
  { t: 33, p: [0, 0, 10], a: [0, 0, 0] },
];

function camAt(t: number) {
  let i = 0;
  for (; i < CK.length - 2; i++) if (t < CK[i + 1].t) break;
  const A = CK[i], B = CK[i + 1];
  const f = ss(clamp01(remap(t, A.t, B.t)));
  return {
    p: new THREE.Vector3(mix(A.p[0],B.p[0],f), mix(A.p[1],B.p[1],f), mix(A.p[2],B.p[2],f)),
    a: new THREE.Vector3(mix(A.a[0],B.a[0],f), mix(A.a[1],B.a[1],f), mix(A.a[2],B.a[2],f)),
  };
}

/* ══════════════════════════════════════════════════════════════
   Camera
   ══════════════════════════════════════════════════════════════ */
function Camera({ onTime }: { onTime?: (t: number) => void }) {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    onTime?.(t);
    const { p, a } = camAt(t);
    camera.position.copy(p);
    camera.lookAt(a);
  });
  return null;
}

/* ══════════════════════════════════════════════════════════════
   Cube view
   ══════════════════════════════════════════════════════════════ */
function CubeView() {
  const groupRef = useRef<THREE.Group>(null);
  const cells = useMemo(() => buildCubeCells(rawRecords), []);
  const maxSize = useMemo(() => Math.max(...cells.map(c => c.size)), [cells]);
  const sizeColor = useMemo(() => createSizeColorScale(maxSize), [maxSize]);

  const allOrgs = [...ORGANISMS] as string[];
  const allMods = [...VIDEO_MODALITIES] as string[];
  const allOrgans = [...VIDEO_ORGANS] as string[];
  const dataKeys = useMemo(
    () => new Set(cells.map(c => `${c.organism}|${c.modality}|${c.organ}`)),
    [cells],
  );
  const maxDist = Math.sqrt(NX ** 2 + NY ** 2 + NZ ** 2) / 2;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const opacity = 1 - ss(clamp01(remap(t, T.DISSOLVE, T.DISSOLVE_END)));
    groupRef.current.visible = opacity > 0.01;
    if (!groupRef.current.visible) return;
    groupRef.current.traverse((obj) => {
      const m = (obj as any).material;
      if (m) {
        m.transparent = true;
        if (m._baseOpacity === undefined) m._baseOpacity = m.opacity;
        m.opacity = m._baseOpacity * opacity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(SZ, SZ, SZ)]} />
        <lineBasicMaterial color="#b0b8c0" transparent opacity={0.6} />
      </lineSegments>

      {/* Phantom grid — all empty cells with gentle opacity */}
      {allOrgs.map((org, oi) =>
        allMods.map((mod, mi) =>
          allOrgans.map((organ, ti) => {
            const key = `${org}|${mod}|${organ}`;
            if (dataKeys.has(key)) return null;
            const dist = distanceFromOrigin(oi, mi, ti, allOrgs, allMods, allOrgans);
            if (dist > maxDist * 0.7) return null;
            const normDist = dist / maxDist;
            const op = Math.max(0.02, 0.12 * (1 - normDist));
            return (
              <group key={`p-${key}`}>
                <mesh position={[xOf(oi), yOf(mi), zOf(ti)]}>
                  <boxGeometry args={[cs, cs, cs]} />
                  <meshBasicMaterial color="#d0d6dc" transparent opacity={op * 0.5} depthWrite={false} />
                </mesh>
                <lineSegments position={[xOf(oi), yOf(mi), zOf(ti)]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(cs, cs, cs)]} />
                  <lineBasicMaterial color="#b8c0c8" transparent opacity={op} />
                </lineSegments>
              </group>
            );
          }),
        ),
      )}

      {allOrgs.map((org, oi) =>
        allMods.map((mod, mi) =>
          allOrgans.map((organ, ti) => {
            if (!isOriginCell(org, mod, organ)) return null;
            return (
              <mesh key={`o-${org}|${mod}|${organ}`} position={[xOf(oi), yOf(mi), zOf(ti)]}>
                <boxGeometry args={[cs + 0.02, cs + 0.02, cs + 0.02]} />
                <meshBasicMaterial color="#cc0000" transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} />
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(cs + 0.02, cs + 0.02, cs + 0.02)]} />
                  <lineBasicMaterial color="#cc2222" />
                </lineSegments>
              </mesh>
            );
          }),
        ),
      )}

      {cells.map((cell) => {
        const oi = allOrgs.indexOf(cell.organism);
        const mi = allMods.indexOf(cell.modality);
        const ti = allOrgans.indexOf(cell.organ);
        if (oi === -1 || mi === -1 || ti === -1) return null;
        return (
          <mesh key={`${cell.organism}|${cell.modality}|${cell.organ}`} position={[xOf(oi), yOf(mi), zOf(ti)]}>
            <boxGeometry args={[cs, cs, cs]} />
            <meshStandardMaterial color={sizeColor(cell.size)} transparent opacity={0.92} />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(cs, cs, cs)]} />
              <lineBasicMaterial color="#9ca3af" transparent opacity={0.3} />
            </lineSegments>
          </mesh>
        );
      })}

      {/* X axis: Organism — along bottom front edge */}
      {allOrgs.map((org, i) => (
        <Text key={`xl-${org}`} position={[xOf(i), -HF - 0.2, HF]}
          fontSize={cells.some(c => c.organism === org) ? 0.1 : 0.07}
          color={cells.some(c => c.organism === org) ? "#2a2a3e" : "#a0a8b0"}
          anchorX="center" anchorY="top">{org}</Text>
      ))}
      <Text position={[0, -HF - 0.48, HF]} fontSize={0.09} color="#5a5a7a" anchorX="center" anchorY="top" fontWeight="bold">Organism</Text>

      {/* Y axis: Modality — along left front edge */}
      {allMods.map((mod, j) => (
        <Text key={`yl-${mod}`} position={[-HF - 0.12, yOf(j), HF]}
          fontSize={cells.some(c => c.modality === mod) ? 0.08 : 0.06}
          color={cells.some(c => c.modality === mod) ? "#2a2a3e" : "#a0a8b0"}
          anchorX="right" anchorY="middle">{mod}</Text>
      ))}
      <Text position={[-HF - 0.12, 0, HF]} fontSize={0.09} color="#5a5a7a" anchorX="right" anchorY="middle" rotation={[0, 0, Math.PI / 2]} fontWeight="bold">Modality</Text>

      {/* Z axis: Organ — along bottom right edge */}
      {allOrgans.map((organ, k) => (
        <Text key={`zl-${organ}`} position={[HF, -HF - 0.2, zOf(k)]}
          fontSize={cells.some(c => c.organ === organ) ? 0.09 : 0.065}
          color={cells.some(c => c.organ === organ) ? "#2a2a3e" : "#a0a8b0"}
          anchorX="left" anchorY="top" rotation={[0, -Math.PI / 2, 0]}>{organ}</Text>
      ))}
      <Text position={[HF, -HF - 0.48, 0]} fontSize={0.09} color="#5a5a7a" anchorX="center" anchorY="top" rotation={[0, -Math.PI / 2, 0]} fontWeight="bold">Organ / Tissue</Text>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   Ghost brain mesh (transparent background, no shadows)
   ══════════════════════════════════════════════════════════════ */
function BrainGhost() {
  const { scene } = useGLTF("/brain.glb");
  const groupRef = useRef<THREE.Group>(null);

  const { ghost, ghostScale, center } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = (5 / maxDim) * 1.2;
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: "#d0b0b0",
          transparent: true,
          opacity: 0.08,
          depthWrite: false,
          side: THREE.DoubleSide,
          roughness: 1,
        });
      }
    });
    return { ghost: clone, ghostScale: s, center: c };
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const fadeIn = ss(clamp01(remap(t, T.DISSOLVE_END + 1, T.BRAIN)));
    const fadeOut = 1 - ss(clamp01(remap(t, T.TO_UMAP, T.TO_UMAP + 2)));
    const opacity = fadeIn * fadeOut;
    groupRef.current.visible = opacity > 0.01;
    if (!groupRef.current.visible) return;
    groupRef.current.traverse((child) => {
      const mat = (child as any).material;
      if (mat?.opacity !== undefined) mat.opacity = 0.08 * opacity;
    });
  });

  return (
    <group ref={groupRef} scale={[ghostScale, ghostScale, ghostScale]}>
      <primitive object={ghost} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   Particle data — 20 000 particles
   ══════════════════════════════════════════════════════════════ */
const PARTICLE_COUNT = 20_000;

interface PD {
  N: number;
  cubeXYZ: Float32Array;
  brainXYZ: Float32Array;
  umapXYZ: Float32Array;
  cubeRGB: Float32Array;
  brainRGB: Float32Array;
  umapRGB: Float32Array;
  tFlowDelay: Float32Array;
}

function initParticles(): PD {
  const cells = buildCubeCells(rawRecords);
  const N = PARTICLE_COUNT;
  const maxSz = Math.max(...cells.map(c => c.size));
  const szCol = createSizeColorScale(maxSz);

  const sq = cells.map(c => Math.sqrt(c.size));
  const tot = sq.reduce((a, b) => a + b, 0);
  const counts = cells.map((_, i) => Math.max(3, Math.round(N * sq[i] / tot)));
  counts[0] += N - counts.reduce((a, b) => a + b, 0);

  const cPos = cells.map(c => {
    const oi = (ORGANISMS as readonly string[]).indexOf(c.organism as any);
    const mi = (VIDEO_MODALITIES as readonly string[]).indexOf(c.modality);
    const ti = (VIDEO_ORGANS as readonly string[]).indexOf(c.organ);
    return [oi >= 0 ? xOf(oi) : xOf(0) - 0.5, yOf(mi), zOf(ti)] as [number, number, number];
  });

  // Generate UMAP points with clearer clustering
  const rngU = mkRng(77);
  const umapScale = N / VIDEO_CLUSTERS.reduce((s, c) => s + c.count, 0);
  const umapPts: { x: number; y: number; color: string }[] = [];
  for (const cl of VIDEO_CLUSTERS) {
    const cnt = Math.round(cl.count * umapScale);
    for (let i = 0; i < cnt && umapPts.length < N; i++) {
      const [gx, gy] = gaussPair(rngU);
      umapPts.push({ x: cl.center[0] + gx * cl.spread, y: cl.center[1] + gy * cl.spread, color: cl.color });
    }
  }
  while (umapPts.length < N) umapPts.push({ x: (rngU() - .5) * 4, y: (rngU() - .5) * 4, color: "#999" });

  const rng = mkRng(123);
  const cubeXYZ = new Float32Array(N * 3);
  const brainXYZ = new Float32Array(N * 3);
  const umapXYZ = new Float32Array(N * 3);
  const cubeRGB = new Float32Array(N * 3);
  const brainRGB = new Float32Array(N * 3);
  const umapRGB = new Float32Array(N * 3);
  const tFlowDelay = new Float32Array(N);

  const c3 = new THREE.Color();
  let pi = 0, ui = 0;

  for (let ci = 0; ci < cells.length; ci++) {
    const [cx, cy, cz] = cPos[ci];
    c3.set(szCol(cells[ci].size));
    for (let p = 0; p < counts[ci]; p++) {
      const j = pi * 3;
      const hc = cs * 0.42;

      cubeXYZ[j]     = cx + (rng() - 0.5) * hc * 2;
      cubeXYZ[j + 1] = cy + (rng() - 0.5) * hc * 2;
      cubeXYZ[j + 2] = cz + (rng() - 0.5) * hc * 2;

      const bp = brainPoints[pi % brainPoints.length];
      brainXYZ[j]     = bp[0] * 1.2;
      brainXYZ[j + 1] = bp[1] * 1.2;
      brainXYZ[j + 2] = bp[2] * 1.2;

      const u = umapPts[ui % umapPts.length];
      umapXYZ[j] = u.x; umapXYZ[j + 1] = u.y; umapXYZ[j + 2] = 0;

      cubeRGB[j] = c3.r; cubeRGB[j+1] = c3.g; cubeRGB[j+2] = c3.b;

      brainRGB[j]     = 0.82 + rng() * 0.12;
      brainRGB[j + 1] = 0.42 + rng() * 0.12;
      brainRGB[j + 2] = 0.35 + rng() * 0.1;

      const uc = new THREE.Color(u.color);
      umapRGB[j] = uc.r; umapRGB[j+1] = uc.g; umapRGB[j+2] = uc.b;

      tFlowDelay[pi] = rng() * 3;
      pi++; ui++;
    }
  }

  return { N, cubeXYZ, brainXYZ, umapXYZ, cubeRGB, brainRGB, umapRGB, tFlowDelay };
}

/* ══════════════════════════════════════════════════════════════
   Circle texture for point sprites
   ══════════════════════════════════════════════════════════════ */
function makeCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.7, "rgba(255,255,255,0.95)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/* ══════════════════════════════════════════════════════════════
   Particle system — 20K points (GPU-native THREE.Points)
   ══════════════════════════════════════════════════════════════ */
function Particles({ pd }: { pd: PD }) {
  const ref = useRef<THREE.Points>(null);

  const { geom, mat } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(pd.N * 3), 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(pd.N * 3), 3));

    const m = new THREE.PointsMaterial({
      size: 0.045,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      map: makeCircleTexture(),
      depthWrite: false,
    });
    return { geom: g, mat: m };
  }, [pd.N]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const posA = geom.attributes.position.array as Float32Array;
    const colA = geom.attributes.color.array as Float32Array;

    const globalAlpha = ss(clamp01(remap(t, T.DISSOLVE, T.DISSOLVE_END)));
    if (ref.current) ref.current.visible = globalAlpha > 0.001;
    if (globalAlpha <= 0.001) return;

    for (let i = 0; i < pd.N; i++) {
      const j = i * 3;
      const delay = pd.tFlowDelay[i];

      const toBrain = ss(clamp01(remap(t, T.DISSOLVE + delay * 0.5, T.DISSOLVE + delay * 0.5 + 4)));
      const uStart = T.TO_UMAP + delay * 0.5;
      const toUmap = ss(clamp01(remap(t, uStart, uStart + 3)));

      let x: number, y: number, z: number;
      if (toUmap > 0) {
        x = mix(pd.brainXYZ[j],     pd.umapXYZ[j],     toUmap);
        y = mix(pd.brainXYZ[j + 1], pd.umapXYZ[j + 1], toUmap);
        z = mix(pd.brainXYZ[j + 2], pd.umapXYZ[j + 2], toUmap);
      } else {
        x = mix(pd.cubeXYZ[j],     pd.brainXYZ[j],     toBrain);
        y = mix(pd.cubeXYZ[j + 1], pd.brainXYZ[j + 1], toBrain);
        z = mix(pd.cubeXYZ[j + 2], pd.brainXYZ[j + 2], toBrain);
      }

      y += Math.sin(t * 1.2 + i * 0.05) * 0.005;
      posA[j] = x; posA[j + 1] = y; posA[j + 2] = z;

      // Color transition
      let r: number, g: number, b: number;
      if (toUmap > 0) {
        r = mix(pd.brainRGB[j],   pd.umapRGB[j],   toUmap);
        g = mix(pd.brainRGB[j+1], pd.umapRGB[j+1], toUmap);
        b = mix(pd.brainRGB[j+2], pd.umapRGB[j+2], toUmap);
      } else {
        r = mix(pd.cubeRGB[j],   pd.brainRGB[j],   toBrain);
        g = mix(pd.cubeRGB[j+1], pd.brainRGB[j+1], toBrain);
        b = mix(pd.cubeRGB[j+2], pd.brainRGB[j+2], toBrain);
      }
      // Fade brightness with global alpha
      colA[j] = r * globalAlpha; colA[j+1] = g * globalAlpha; colA[j+2] = b * globalAlpha;
    }

    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;
  });

  return <points ref={ref} geometry={geom} material={mat} visible={false} />;
}

/* ══════════════════════════════════════════════════════════════
   Cluster labels (UMAP phase)
   ══════════════════════════════════════════════════════════════ */
function ClusterLabels() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const a = ss(clamp01(remap(t, T.UMAP + 1, T.UMAP + 3)));
    ref.current.visible = a > 0.01;
    ref.current.traverse(child => {
      const mat = (child as any).material;
      if (mat?.opacity !== undefined) mat.opacity = a;
    });
  });

  return (
    <group ref={ref}>
      {VIDEO_CLUSTERS.map(cl => (
        <Billboard key={cl.name} position={[cl.center[0], cl.center[1] + 0.5, 0.1]}>
          <Text fontSize={0.18} color="#2a2a3e" anchorX="center" anchorY="bottom" fontWeight="bold">
            {cl.name}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   Scene
   ══════════════════════════════════════════════════════════════ */
function Scene({ onTime }: { onTime?: (t: number) => void }) {
  const pd = useMemo(() => initParticles(), []);
  return (
    <>
      <Camera onTime={onTime} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />
      <CubeView />
      <Particles pd={pd} />
      <Suspense fallback={null}><BrainGhost /></Suspense>
      <ClusterLabels />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   Canvas export
   ══════════════════════════════════════════════════════════════ */
export function VideoScene({ onTime }: { onTime?: (t: number) => void }) {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.01, far: 200 }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.NoToneMapping, preserveDrawingBuffer: true }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ scene }) => { scene.background = new THREE.Color("#ffffff"); }}
    >
      <Scene onTime={onTime} />
    </Canvas>
  );
}

export const ANIMATION_DURATION = T.END;

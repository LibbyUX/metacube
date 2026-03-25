/**
 * Procedurally generated 3D UMAP-like embedding for the graphical abstract.
 * Simulates scRNA-seq cell clusters relevant to Parkinson's disease research.
 */

export interface UmapPoint {
  x: number;
  y: number;
  z: number;
  cluster: string;
  color: string;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
}

export interface Trajectory {
  points: TrajectoryPoint[];
  color: string;
  label: string;
}

// Seeded random for reproducibility
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function gaussianPair(rng: () => number): [number, number] {
  const u1 = rng();
  const u2 = rng();
  const r = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10)));
  return [r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)];
}

interface ClusterDef {
  name: string;
  center: [number, number, number];
  spread: number;
  count: number;
  color: string;
}

const clusters: ClusterDef[] = [
  { name: "Dopaminergic neurons", center: [-1.8, 1.2, 0.5], spread: 0.45, count: 120, color: "#e53935" },
  { name: "GABAergic neurons",    center: [-0.3, 2.0, -0.8], spread: 0.5, count: 100, color: "#8e24aa" },
  { name: "Glutamatergic neurons",center: [1.2, 1.5, 0.2],  spread: 0.45, count: 90, color: "#3949ab" },
  { name: "Astrocytes",           center: [1.8, -0.5, 1.0],  spread: 0.55, count: 110, color: "#00897b" },
  { name: "Microglia",            center: [0.2, -1.5, -0.5], spread: 0.45, count: 85, color: "#f4511e" },
  { name: "Oligodendrocytes",     center: [-1.2, -1.0, -1.2],spread: 0.5,  count: 95, color: "#1e88e5" },
  { name: "OPCs",                 center: [-0.5, -2.0, 0.8], spread: 0.35, count: 55, color: "#43a047" },
  { name: "Endothelial",          center: [2.2, 0.3, -1.0],  spread: 0.35, count: 50, color: "#fdd835" },
];

export function generateUmapPoints(): UmapPoint[] {
  const rng = seededRandom(42);
  const points: UmapPoint[] = [];

  for (const cl of clusters) {
    for (let i = 0; i < cl.count; i++) {
      const [gx, gy] = gaussianPair(rng);
      const [gz] = gaussianPair(rng);
      points.push({
        x: cl.center[0] + gx * cl.spread,
        y: cl.center[1] + gy * cl.spread,
        z: cl.center[2] + gz * cl.spread,
        cluster: cl.name,
        color: cl.color,
      });
    }
  }
  return points;
}

/**
 * Trajectories representing differentiation / disease progression paths.
 * DA neuron degeneration is the key PD-relevant trajectory.
 */
export function generateTrajectories(): Trajectory[] {
  return [
    {
      label: "DA neuron degeneration",
      color: "#cc0000",
      points: [
        { x: -1.8, y: 1.2, z: 0.5 },
        { x: -1.3, y: 0.6, z: 0.1 },
        { x: -0.8, y: -0.1, z: -0.3 },
        { x: -0.3, y: -0.8, z: -0.6 },
      ],
    },
    {
      label: "Neuroinflammation",
      color: "#e65100",
      points: [
        { x: 0.2, y: -1.5, z: -0.5 },
        { x: 0.6, y: -0.8, z: -0.1 },
        { x: 1.1, y: -0.3, z: 0.4 },
        { x: 1.8, y: -0.5, z: 1.0 },
      ],
    },
    {
      label: "Oligodendrocyte maturation",
      color: "#1565c0",
      points: [
        { x: -0.5, y: -2.0, z: 0.8 },
        { x: -0.7, y: -1.6, z: 0.1 },
        { x: -1.0, y: -1.2, z: -0.5 },
        { x: -1.2, y: -1.0, z: -1.2 },
      ],
    },
  ];
}

export { clusters };

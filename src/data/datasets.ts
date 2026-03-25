/**
 * Dataset records extracted from Datasets(Priority).csv.
 * Three categorical axes: organism, modality, organ.
 * Dataset size is encoded as color, not geometry.
 */

export interface DatasetRecord {
  organism: string;
  modality: string;
  organ: string;
  datasetSize: number;
  datasets: string[];
  priority: number;
}

export const rawRecords: DatasetRecord[] = [
  // Priority 1: Human brain RNA/small RNA
  // Total scRNA-seq/Brain: 1.77M + 22M + 2.1M + 2.8M + 1.2M ≈ 29.87M nuclei
  {
    organism: "Human",
    modality: "scRNA-seq",
    organ: "Brain",
    datasetSize: 29_870_000,
    datasets: [
      "Organoid Atlas (10x v3)",       // 1.77M cells (Nature 2024)
      "ROSMAP Compass (10x v3)",       // ~22M nuclei total (bioRxiv 2025)
      "AMP PD (snRNA-seq)",            // 2.1M nuclei (Sci Data 2024)
      "ASAP (snRNA-seq)",              // 2.8M nuclei (Allen Institute)
      "SEAAD (snRNA-seq)",             // 1.2M nuclei (Nat Neurosci 2024)
    ],
    priority: 1,
  },
  {
    organism: "Human",
    modality: "Multiome",
    organ: "Brain",
    datasetSize: 109_255,
    datasets: [
      "Organoid Atlas (multiome)",     // 109K cells (cellxgene)
      // ROSMAP Compass multiome included in the 22M total above
    ],
    priority: 1,
  },
  {
    organism: "Human",
    modality: "small RNA-seq",
    organ: "Multi-region",
    datasetSize: 46_997,               // 46,997 samples (NAR 2025)
    datasets: ["miRNA Tissue Atlas"],
    priority: 1,
  },
  // Priority 2: Blood
  {
    organism: "Human",
    modality: "bulk RNA-seq",
    organ: "Blood",
    datasetSize: 4_756,                // 4,756 samples / 1,570 participants (medRxiv 2021)
    datasets: ["PPMI (RNA-seq)", "AMP PD (bulk RNA-seq)"],
    priority: 2,
  },
  {
    organism: "Human",
    modality: "bulk RNA-seq",
    organ: "Brain",
    datasetSize: 211,                  // ~211 donors (Allen/ASAP PMDBS)
    datasets: ["ASAP (bulk RNA-seq)"],
    priority: 2,
  },
  {
    organism: "Human",
    modality: "small RNA-seq",
    organ: "Blood",
    datasetSize: 5_450,                // 5,450 samples / 1,614 participants (Nat Aging 2021)
    datasets: ["PPMI (smallRNAseq)"],
    priority: 2,
  },
  {
    organism: "Human",
    modality: "scRNA (blood)",
    organ: "Blood",
    datasetSize: 172_639,              // 10,466 + 103,365 + 58,808 cells
    datasets: [
      "Wang et al. B-cells",           // 10,466 cells (Front Immunol 2022)
      "Wang et al. T-cells",           // 103,365 cells (Cell Discov 2021)
      "Xiong et al. PBMCs",            // 58,808 cells (npj Park Dis 2024)
    ],
    priority: 2,
  },
  // Priority 3: Other species
  {
    organism: "Mouse",
    modality: "scRNA-seq",
    organ: "Brain",
    datasetSize: 420_000,              // unverified — ASAP mouse brain
    datasets: ["ASAP (mouse brain)"],
    priority: 3,
  },
  {
    organism: "Mouse",
    modality: "small RNA-seq",
    organ: "Multi-region",
    datasetSize: 14_596,               // 14,596 samples (NAR 2025)
    datasets: ["miRNA Tissue Atlas (mouse)"],
    priority: 3,
  },
  {
    organism: "Macaque",
    modality: "scRNA-seq",
    organ: "Brain",
    datasetSize: 2_584_000,            // 2,584,000 nuclei (Sci Adv 2024)
    datasets: ["BGI Macaque (snRNA-seq)"],
    priority: 3,
  },
  {
    organism: "Macaque",
    modality: "small RNA-seq",
    organ: "Multi-region",
    datasetSize: 18,                   // 18 tissues profiled (Nat Commun 2026)
    datasets: ["miRNA Tissue Atlas (macaque)"],
    priority: 3,
  },
  // Priority 4: DNA & Proteomics (sizes = samples/participants)
  {
    organism: "Human",
    modality: "WGS",
    organ: "Blood",
    datasetSize: 12_157,               // PPMI 1,667 + AMP PD 10,490 participants
    datasets: ["PPMI (WGS)", "AMP PD (WGS blood)"],
    priority: 4,
  },
  {
    organism: "Human",
    modality: "WGS",
    organ: "Brain",
    datasetSize: 100,                  // 100 postmortem brain WGS (AMP PD)
    datasets: ["AMP PD (WGS brain)"],
    priority: 4,
  },
  {
    organism: "Human",
    modality: "Proteomics",
    organ: "CSF",
    datasetSize: 2_348,                // ~2,348 samples across CSF/plasma/urine
    datasets: ["PPMI (MS proteomics)"],
    priority: 4,
  },
];

/** Aggregated cell: one box in the cube */
export interface CubeCell {
  organism: string;
  modality: string;
  organ: string;
  size: number;
  datasets: string[];
  priority: number;
}

export function getOrganisms(records: DatasetRecord[]): string[] {
  return [...new Set(records.map((r) => r.organism))];
}

export function getModalities(records: DatasetRecord[]): string[] {
  return [...new Set(records.map((r) => r.modality))];
}

export function getOrgans(records: DatasetRecord[]): string[] {
  return [...new Set(records.map((r) => r.organ))];
}

/** Build the cube cells from records, keyed on (organism, modality, organ) */
export function buildCubeCells(records: DatasetRecord[]): CubeCell[] {
  const map = new Map<string, CubeCell>();
  for (const r of records) {
    const key = `${r.organism}|${r.modality}|${r.organ}`;
    const existing = map.get(key);
    if (existing) {
      existing.size += r.datasetSize;
      existing.datasets.push(...r.datasets);
    } else {
      map.set(key, {
        organism: r.organism,
        modality: r.modality,
        organ: r.organ,
        size: r.datasetSize,
        datasets: [...r.datasets],
        priority: r.priority,
      });
    }
  }
  return [...map.values()];
}

// ---------------------------------------------------------------------------
// Full search space with Human/brain/scRNA at the CENTER.
// ---------------------------------------------------------------------------

export const FULL_ORGANISMS = [
  "C. elegans",
  "Drosophila",
  "Zebrafish",
  "Rat",
  "Mouse",
  "Human",       // center
  "Macaque",
  "Marmoset",
  "Dog",
  "Pig",
] as const;

export const FULL_MODALITIES = [
  "Metabolomics",
  "Hi-C",
  "CITE-seq",
  "Methylation",
  "WES",
  "WGS",
  "small RNA-seq", // center band
  "scRNA-seq",     // center band
  "Multiome",
  "bulk RNA-seq",
  "scRNA (blood)",
  "ATAC-seq",
  "Spatial transcr.",
  "Proteomics",
] as const;

export const FULL_ORGANS = [
  "Gut",
  "Lung",
  "Heart",
  "CSF",
  "Brain",          // center
  "Blood",
  "Multi-region",
  "Kidney",
  "Liver",
  "Skin",
] as const;

// ---------------------------------------------------------------------------
// Trimmed axes — only categories with data + minimal context.
// ---------------------------------------------------------------------------

export const TRIMMED_ORGANISMS = [
  "Rat",
  "Mouse",
  "Human",       // center
  "Macaque",
  "Marmoset",
] as const;

export const TRIMMED_MODALITIES = [
  "WGS",
  "small RNA-seq",
  "scRNA-seq",     // center
  "Multiome",
  "bulk RNA-seq",
  "scRNA (blood)",
  "Proteomics",
] as const;

export const TRIMMED_ORGANS = [
  "Heart",
  "CSF",
  "Brain",         // center
  "Blood",
  "Multi-region",
  "Kidney",
] as const;

/** The origin point — Human miRNA/snRNA-seq, brain */
export const ORIGIN_CELLS: { organism: string; modality: string; organ: string }[] = [
  { organism: "Human", modality: "small RNA-seq", organ: "Brain" },
  { organism: "Human", modality: "scRNA-seq", organ: "Brain" },
];

export function isOriginCell(organism: string, modality: string, organ: string): boolean {
  return ORIGIN_CELLS.some(
    (o) => o.organism === organism && o.modality === modality && o.organ === organ
  );
}

/** Euclidean distance from the nearest origin cell in 3D grid coordinates */
export function distanceFromOrigin(
  orgIdx: number,
  modIdx: number,
  organIdx: number,
  organisms: string[],
  modalities: string[],
  organs: string[]
): number {
  let minDist = Infinity;
  for (const o of ORIGIN_CELLS) {
    const oi = organisms.indexOf(o.organism);
    const mi = modalities.indexOf(o.modality);
    const ti = organs.indexOf(o.organ);
    if (oi === -1 || mi === -1 || ti === -1) continue;
    const d = Math.sqrt((orgIdx - oi) ** 2 + (modIdx - mi) ** 2 + (organIdx - ti) ** 2);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

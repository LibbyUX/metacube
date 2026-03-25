/**
 * Sub-dataset details for each (organism, modality, organ) cell.
 * Numbers verified via deep research — see data/dataset_sources.csv for references.
 */

export interface SubDataset {
  name: string;
  cells: number;
  samples: number;
  access: "open" | "restricted" | "personal";
  source: string;
}

export interface CellSubData {
  organism: string;
  modality: string;
  organ: string;
  subDatasets: SubDataset[];
}

const known: CellSubData[] = [
  {
    organism: "Human", modality: "scRNA-seq", organ: "Brain",
    subDatasets: [
      { name: "ROSMAP Compass (10x v3)", cells: 22_000_000, samples: 2058, access: "restricted", source: "Synapse" },
      { name: "ASAP (snRNA-seq)", cells: 2_800_000, samples: 383, access: "personal", source: "Allen / ASAP CRN" },
      { name: "AMP PD (snRNA-seq)", cells: 2_100_000, samples: 444, access: "restricted", source: "AMP PD" },
      { name: "Organoid Atlas (10x v3)", cells: 1_770_000, samples: 36, access: "open", source: "cellxgene" },
      { name: "SEAAD (snRNA-seq)", cells: 1_200_000, samples: 84, access: "restricted", source: "Synapse / AWS" },
    ],
  },
  {
    organism: "Human", modality: "Multiome", organ: "Brain",
    subDatasets: [
      { name: "Organoid Atlas (multiome)", cells: 109_255, samples: 2, access: "open", source: "cellxgene" },
    ],
  },
  {
    organism: "Human", modality: "small RNA-seq", organ: "Multi-region",
    subDatasets: [
      { name: "miRNA Tissue Atlas", cells: 0, samples: 46_997, access: "personal", source: "internal (NAR 2025)" },
    ],
  },
  {
    organism: "Human", modality: "bulk RNA-seq", organ: "Blood",
    subDatasets: [
      { name: "PPMI RNA-seq", cells: 0, samples: 4_756, access: "restricted", source: "PPMI" },
    ],
  },
  {
    organism: "Human", modality: "bulk RNA-seq", organ: "Brain",
    subDatasets: [
      { name: "ASAP (bulk RNA-seq)", cells: 0, samples: 211, access: "personal", source: "Allen / ASAP CRN" },
    ],
  },
  {
    organism: "Human", modality: "small RNA-seq", organ: "Blood",
    subDatasets: [
      { name: "PPMI smallRNAseq", cells: 0, samples: 5_450, access: "restricted", source: "PPMI" },
    ],
  },
  {
    organism: "Human", modality: "scRNA (blood)", organ: "Blood",
    subDatasets: [
      { name: "Wang et al. T-cells", cells: 103_365, samples: 14, access: "open", source: "GEO" },
      { name: "Xiong et al. PBMCs", cells: 58_808, samples: 6, access: "open", source: "GEO" },
      { name: "Wang et al. B-cells", cells: 10_466, samples: 14, access: "open", source: "GEO" },
    ],
  },
  {
    organism: "Mouse", modality: "scRNA-seq", organ: "Brain",
    subDatasets: [
      { name: "ASAP (mouse brain)", cells: 420_000, samples: 30, access: "personal", source: "ASAP" },
    ],
  },
  {
    organism: "Mouse", modality: "small RNA-seq", organ: "Multi-region",
    subDatasets: [
      { name: "miRNA Tissue Atlas (mouse)", cells: 0, samples: 14_596, access: "personal", source: "internal (NAR 2025)" },
    ],
  },
  {
    organism: "Macaque", modality: "scRNA-seq", organ: "Brain",
    subDatasets: [
      { name: "BGI Macaque (snRNA-seq)", cells: 2_584_000, samples: 8, access: "restricted", source: "BGI (Sci Adv 2024)" },
    ],
  },
  {
    organism: "Macaque", modality: "small RNA-seq", organ: "Multi-region",
    subDatasets: [
      { name: "miRNA Tissue Atlas (macaque)", cells: 0, samples: 18, access: "personal", source: "internal (Nat Commun 2026)" },
    ],
  },
  {
    organism: "Human", modality: "WGS", organ: "Blood",
    subDatasets: [
      { name: "AMP PD WGS (blood)", cells: 0, samples: 10_490, access: "restricted", source: "AMP PD" },
      { name: "PPMI WGS", cells: 0, samples: 1_667, access: "restricted", source: "PPMI" },
    ],
  },
  {
    organism: "Human", modality: "WGS", organ: "Brain",
    subDatasets: [
      { name: "AMP PD WGS (brain postmortem)", cells: 0, samples: 100, access: "restricted", source: "AMP PD" },
    ],
  },
  {
    organism: "Human", modality: "Proteomics", organ: "CSF",
    subDatasets: [
      { name: "PPMI proteomics (urine)", cells: 0, samples: 1_156, access: "restricted", source: "PPMI" },
      { name: "PPMI proteomics (plasma)", cells: 0, samples: 859, access: "restricted", source: "PPMI" },
      { name: "PPMI proteomics (CSF)", cells: 0, samples: 765, access: "restricted", source: "PPMI" },
    ],
  },
];

const knownIndex = new Map<string, CellSubData>();
for (const entry of known) {
  knownIndex.set(`${entry.organism}|${entry.modality}|${entry.organ}`, entry);
}

/**
 * Get sub-datasets for a given cell.
 * Returns known data if available, otherwise generates dummy entries.
 */
export function getSubDatasets(
  organism: string,
  modality: string,
  organ: string,
  datasetNames: string[],
  totalSize: number
): SubDataset[] {
  const key = `${organism}|${modality}|${organ}`;
  const entry = knownIndex.get(key);
  if (entry) return entry.subDatasets;

  const perDataset = Math.round(totalSize / Math.max(datasetNames.length, 1));
  return datasetNames.map((name) => ({
    name,
    cells: perDataset,
    samples: Math.max(5, Math.round(perDataset / 5000)),
    access: "restricted" as const,
    source: "estimated",
  }));
}

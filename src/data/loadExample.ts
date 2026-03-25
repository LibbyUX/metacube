/**
 * Load cube data for a given example.
 * Updates the mutable axis lists and rawRecords in datasets.ts.
 */

import {
  rawRecords as defaultRecords,
  TRIMMED_ORGANISMS,
  TRIMMED_MODALITIES,
  TRIMMED_ORGANS,
  setAxes,
  type DatasetRecord,
} from "./datasets";

export interface CubeData {
  records: DatasetRecord[];
  organisms: string[];
  modalities: string[];
  organs: string[];
}

// Save cellxgene defaults
const cellxgeneData: CubeData = {
  records: [...defaultRecords],
  organisms: [...TRIMMED_ORGANISMS],
  modalities: [...TRIMMED_MODALITIES],
  organs: [...TRIMMED_ORGANS],
};

const cache = new Map<string, CubeData>();
cache.set("cellxgene", cellxgeneData);

export async function loadExample(id: string): Promise<CubeData> {
  if (cache.has(id)) {
    const data = cache.get(id)!;
    setAxes(data.organisms, data.modalities, data.organs);
    return data;
  }

  if (id === "microbiome") {
    const resp = await fetch(`${import.meta.env.BASE_URL}microbiome_cube.json`);
    const json = await resp.json();
    const data: CubeData = {
      records: json.records as DatasetRecord[],
      organisms: json.organisms as string[],
      modalities: json.modalities as string[],
      organs: json.organs as string[],
    };
    cache.set(id, data);
    setAxes(data.organisms, data.modalities, data.organs);
    return data;
  }

  // Fallback to cellxgene
  return cellxgeneData;
}

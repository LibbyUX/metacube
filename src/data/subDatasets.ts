/**
 * Sub-dataset details — for the cellxgene branch, sub-datasets are the top
 * cell types within each (organism, assay, organ) cell. These are generated
 * dynamically from the dataset names in rawRecords.
 */

export interface SubDataset {
  name: string;
  cells: number;
  samples: number;
  access: "open" | "restricted" | "personal";
  source: string;
}

/**
 * Get sub-datasets for a given cell.
 * Parses "cellType (count)" format from dataset names.
 */
export function getSubDatasets(
  _organism: string,
  _modality: string,
  _organ: string,
  datasetNames: string[],
  totalSize: number
): SubDataset[] {
  return datasetNames.map((name) => {
    // Parse "cellType (1,234)" format
    const match = name.match(/^(.+?)\s*\(([\d,]+)\)$/);
    if (match) {
      return {
        name: match[1].trim(),
        cells: parseInt(match[2].replace(/,/g, ""), 10),
        samples: 0,
        access: "open" as const,
        source: "cellxgene Census",
      };
    }
    return {
      name,
      cells: Math.round(totalSize / Math.max(datasetNames.length, 1)),
      samples: 0,
      access: "open" as const,
      source: "cellxgene Census",
    };
  });
}

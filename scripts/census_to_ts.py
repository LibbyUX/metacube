"""
Convert census_nested_cell_type_counts.csv → src/data/datasets.ts
for the Cell x Gene cube branch.

Axes:
  X = organism (Homo sapiens, Mus musculus)
  Y = assay (protocol/modality)
  Z = organ
"""

import csv
import json
import sys
import numpy as np
from collections import defaultdict
from scipy.cluster.hierarchy import linkage, leaves_list
from scipy.spatial.distance import pdist


def main():
    infile = "data/census_nested_cell_type_counts.csv"

    # Read CSV
    cells = []  # (organism, organ, assay, total_cells, cell_type_dict)
    with open(infile) as f:
        reader = csv.DictReader(f)
        for row in reader:
            ct = json.loads(row["cell_type_counts"])
            total = sum(ct.values())
            cells.append({
                "organism": row["organism"],
                "organ": row["organ"],
                "assay": row["assay"],
                "total": total,
                "cell_types": ct,
            })

    # Collect unique axes
    organisms = sorted(set(c["organism"] for c in cells))
    assays = sorted(set(c["assay"] for c in cells))
    organs = sorted(set(c["organ"] for c in cells))

    # Cluster axes so similar categories are adjacent
    def cluster_axis(axis_values, axis_key, other_keys):
        """Reorder axis by hierarchical clustering on co-occurrence profiles."""
        if len(axis_values) <= 2:
            return axis_values
        # Build feature matrix: axis_value × (other combinations) → total count
        combos = sorted(set(
            "|".join(str(c[k]) for k in other_keys) for c in cells
        ))
        combo_idx = {k: i for i, k in enumerate(combos)}
        mat = np.zeros((len(axis_values), len(combos)))
        for c in cells:
            ai = axis_values.index(c[axis_key]) if c[axis_key] in axis_values else -1
            if ai == -1:
                continue
            ck = "|".join(str(c[k]) for k in other_keys)
            ci = combo_idx.get(ck)
            if ci is not None:
                mat[ai, ci] += c["total"]
        # Normalize
        norms = np.linalg.norm(mat, axis=1, keepdims=True)
        norms[norms == 0] = 1
        mat = mat / norms
        if mat.shape[0] < 3:
            return axis_values
        dist = pdist(mat, metric="cosine")
        dist = np.nan_to_num(dist, nan=1.0)
        Z = linkage(dist, method="average")
        return [axis_values[i] for i in leaves_list(Z)]

    # Sort by total cell count (descending) for trimming
    organ_totals = defaultdict(int)
    assay_totals = defaultdict(int)
    for c in cells:
        organ_totals[c["organ"]] += c["total"]
        assay_totals[c["assay"]] += c["total"]
    assays_by_count = sorted(assays, key=lambda a: assay_totals[a], reverse=True)
    organs_by_count = sorted(organs, key=lambda o: organ_totals[o], reverse=True)

    # Trim to top N first
    TOP_ASSAYS = 15
    TOP_ORGANS = 20
    top_assays = assays_by_count[:TOP_ASSAYS]
    top_organs = organs_by_count[:TOP_ORGANS]

    # Then cluster the trimmed sets for spatial coherence
    top_assays = cluster_axis(top_assays, "assay", ["organism", "organ"])
    top_organs = cluster_axis(top_organs, "organ", ["organism", "assay"])
    organisms = cluster_axis(organisms, "organism", ["assay", "organ"])

    print(f"Organisms: {len(organisms)}")
    print(f"Assays: {len(top_assays)}")
    print(f"Organs: {len(top_organs)}")
    print(f"Cube cells: {len(cells)}")
    print(f"Total cells: {sum(c['total'] for c in cells):,}")
    print(f"Trimmed to top {TOP_ASSAYS} assays, top {TOP_ORGANS} organs")

    # Filter cells to trimmed axes
    filtered = [
        c for c in cells
        if c["assay"] in top_assays and c["organ"] in top_organs
    ]
    print(f"Filtered cells: {len(filtered)}")
    print(f"Filtered total: {sum(c['total'] for c in filtered):,}")

    # Generate TypeScript
    lines = []
    lines.append('/**')
    lines.append(' * Cell x Gene Census dataset records.')
    lines.append(f' * {len(filtered)} cube cells across {len(organisms)} organisms, {TOP_ASSAYS} assays, {TOP_ORGANS} organs.')
    lines.append(f' * Generated from census_nested_cell_type_counts.csv')
    lines.append(' */')
    lines.append('')
    lines.append('export interface DatasetRecord {')
    lines.append('  organism: string;')
    lines.append('  modality: string;')
    lines.append('  organ: string;')
    lines.append('  datasetSize: number;')
    lines.append('  datasets: string[];')
    lines.append('  priority: number;')
    lines.append('}')
    lines.append('')

    # Priority: assign based on total cell count
    def priority(total):
        if total >= 10_000_000: return 1
        if total >= 1_000_000: return 2
        if total >= 100_000: return 3
        return 4

    lines.append('export const rawRecords: DatasetRecord[] = [')
    for c in sorted(filtered, key=lambda c: (-c["total"])):
        # Top 5 cell types as "datasets"
        top_ct = sorted(c["cell_types"].items(), key=lambda x: -x[1])[:5]
        ds_list = [f'{name} ({count:,})' for name, count in top_ct]
        ds_str = ", ".join(f'"{d}"' for d in ds_list)
        lines.append(f'  {{ organism: "{c["organism"]}", modality: "{c["assay"]}", organ: "{c["organ"]}", '
                     f'datasetSize: {c["total"]}, datasets: [{ds_str}], priority: {priority(c["total"])} }},')
    lines.append('];')
    lines.append('')

    # Axes
    lines.append(f'export let TRIMMED_ORGANISMS: readonly string[] = {json.dumps(organisms)};')
    lines.append(f'export let TRIMMED_MODALITIES: readonly string[] = {json.dumps(top_assays)};')
    lines.append(f'export let TRIMMED_ORGANS: readonly string[] = {json.dumps(top_organs)};')
    lines.append('')
    lines.append('export function setAxes(organisms: string[], modalities: string[], organs: string[]) {')
    lines.append('  TRIMMED_ORGANISMS = organisms;')
    lines.append('  TRIMMED_MODALITIES = modalities;')
    lines.append('  TRIMMED_ORGANS = organs;')
    lines.append('}')
    lines.append('')

    # Keep the existing interfaces/functions
    lines.append("""
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

export const ORIGIN_CELLS: { organism: string; modality: string; organ: string }[] = [];

export function isOriginCell(_organism: string, _modality: string, _organ: string): boolean {
  return false;
}

export function distanceFromOrigin(
  orgIdx: number,
  modIdx: number,
  organIdx: number,
  _organisms: string[],
  _modalities: string[],
  _organs: string[]
): number {
  return Math.sqrt(orgIdx ** 2 + modIdx ** 2 + organIdx ** 2);
}
""")

    outfile = "src/data/datasets.ts"
    with open(outfile, "w") as f:
        f.write("\n".join(lines))

    print(f"\nWrote {outfile}")


if __name__ == "__main__":
    main()

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
from collections import defaultdict


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

    # Sort organs/assays by total cell count (descending) for better layout
    organ_totals = defaultdict(int)
    assay_totals = defaultdict(int)
    for c in cells:
        organ_totals[c["organ"]] += c["total"]
        assay_totals[c["assay"]] += c["total"]

    organs = sorted(organs, key=lambda o: organ_totals[o], reverse=True)
    assays = sorted(assays, key=lambda a: assay_totals[a], reverse=True)

    print(f"Organisms: {len(organisms)}")
    print(f"Assays: {len(assays)}")
    print(f"Organs: {len(organs)}")
    print(f"Cube cells: {len(cells)}")
    print(f"Total cells: {sum(c['total'] for c in cells):,}")

    # Top 30 assays and organs for manageable cube
    TOP_ASSAYS = 15
    TOP_ORGANS = 20
    top_assays = assays[:TOP_ASSAYS]
    top_organs = organs[:TOP_ORGANS]

    print(f"\nTrimmed to top {TOP_ASSAYS} assays, top {TOP_ORGANS} organs")

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
    lines.append(f'export const TRIMMED_ORGANISMS = {json.dumps(organisms)} as const;')
    lines.append(f'export const TRIMMED_MODALITIES = {json.dumps(top_assays)} as const;')
    lines.append(f'export const TRIMMED_ORGANS = {json.dumps(top_organs)} as const;')
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

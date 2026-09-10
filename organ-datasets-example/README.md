# Organ Imaging Datasets — metacube Example

A small hand-entered dataset (7 entries) covering imaging datasets across organs,
scales, and subject ages. Built for visualizing with
[metacube](https://github.com/) — a 3D cube tool for exploring categorical data
along three axes.

## Files

- `organ_datasets_counts.csv` — one row per dataset entry
- `organ_datasets_flat.yaml` — metacube config: axes = **Scale** (x), **Age** (y),
  **Organ** (z); block size/color = count; dataset name + sex shown on click

## Data

| dataset | sex | scale | age | organ |
|---|---|---|---|---|
| bader-liver-sem-sbf | Male | 100-microns | 45 | Liver |
| lee-kidney-hipct | Male | 10-centimeters | 63 | Kidney |
| lee-kidney-hipct | Male | 10-centimeters | 85 | Kidney |
| lee-heart-hipct | Male | 10-centimeters | 63 | Heart |
| teichmann-heart-hra-pop | Male & female (multiple) | 100-microns | ~40-70 | Heart |
| zandstra-thymus-codex | Male & female (multiple) | 100-microns | 4-5 months | Thymus |
| bader-liver-xenium | Male & female (multiple) | 100-microns | 7-47 | Liver |

**Notes / caveats:**
- `lee-kidney-hipct` listed two ages (63 and 85) in the source table, so it's
  split into two rows here — same dataset, two age entries.
- `age` is mixed units and formats (single years, ranges, "~40-70", "4-5 months"),
  so metacube treats it as a categorical axis (each distinct string is its own
  tick), not a continuous numeric scale.
- `count` is always `1` — there's no real magnitude metric in this data, so
  block size/color just represents "number of dataset entries" per
  scale/age/organ combination.

## How to visualize

### Option A — metacube playground (no install, just this repo cloned)

1. Clone/pull the [metacube](https://github.com/) repo and install deps:
   ```bash
   npm install
   npm run dev
   ```
2. Open the playground in your browser (URL printed by `npm run dev`, path
   `/playground/`), e.g.:
   ```
   http://localhost:5173/metacube/playground/index.html
   ```
3. Use the **CSV data file** and **YAML config file** pickers to upload
   `organ_datasets_counts.csv` and `organ_datasets_flat.yaml` from this folder.
4. Click **Render**. Optionally use **Download HTML** in the playground to
   export a standalone, shareable HTML file of the cube.

### Option B — Python / R packages

metacube also ships `python-pkg` and `r-pkg` packages that can render this
CSV/YAML pair without the JS playground — see their READMEs for the render
command. This can be handy for scripted or headless generation of the
standalone HTML.

## Editing this data

Add or edit rows in `organ_datasets_counts.csv` (keep the header row), then
re-upload/re-render. Column meaning:

| column | used for |
|---|---|
| `dataset` | shown in click-panel (info_box) |
| `sex` | shown in click-panel (info_box) |
| `scale` | x-axis |
| `age` | y-axis |
| `organ` | z-axis |
| `count` | block size/color; keep at `1` per row unless you have a real per-row magnitude |

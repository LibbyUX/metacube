# Cube — 3D Dataset Explorer

Interactive 3D cubic map for exploring biomedical datasets across three categorical dimensions. Built for systematically mapping data landscapes in Parkinson's disease research.

![Cube visualization](https://img.shields.io/badge/React-Three.js-blue)

## What it does

Datasets are positioned inside a transparent cube:
- **X axis:** Organism (Mouse, Human, Macaque, ...)
- **Y axis:** Modality (scRNA-seq, WGS, Multiome, bulk RNA-seq, ...)
- **Z axis:** Organ / Tissue (Brain, Blood, CSF, ...)

Color encodes dataset size. Click any cell to drill down into a treemap of its sub-datasets.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Interactive 3D cube explorer with filters, tooltips, treemap drill-down |
| `/abstract.html` | Static graphical abstract (cube + UMAP side-by-side) |
| `/video.html` | Animated video: cube → brain point cloud → 2D UMAP |

## Quick Start

Requires [Pixi](https://pixi.sh) (conda-based package manager).

```bash
pixi install && pixi run npm install
pixi run dev
```

Open http://localhost:5173

## Tech Stack

- **React 19** + **TypeScript**
- **Three.js** via react-three-fiber + drei
- **d3-scale** / **d3-hierarchy** for data normalization and treemap layouts
- **Vite 8** for dev/build
- **Pixi** for environment management (Node.js 22+)

## Data

Source data lives in `data/Datasets(Priority).csv` with verified numbers in `data/dataset_sources.csv`.

Dataset records are defined in `src/data/datasets.ts` — each record has organism, modality, organ, size, and priority. Sub-dataset details (per-study cell counts, access levels) are in `src/data/subDatasets.ts`.

## Architecture

```
src/
  data/
    datasets.ts        # Data model, axes, aggregation
    subDatasets.ts      # Per-study metadata
    colors.ts           # Color scales (size, organism, modality)
  hooks/
    useStore.ts         # App state (filters, selection, opacity)
  components/
    Scene.tsx            # R3F Canvas, camera, lighting
    CubeMap.tsx          # Core layout: data → 3D grid positions
    CubeCellMesh.tsx     # Individual cuboid with interactions
    ControlPanel.tsx     # Filter sidebar
    TreemapOverlay.tsx   # Drill-down treemap view
    ...
  abstract/              # Graphical abstract (static)
  video/                 # Animated video sequence
```

## License

MIT

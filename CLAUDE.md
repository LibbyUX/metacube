# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

3D interactive cubic map visualization for exploring biomedical datasets. Datasets are positioned inside a transparent cube with:
- **X axis:** Organism (Human, Mouse, Macaque)
- **Y axis:** Modality (scRNA-seq, WGS, Multiome, etc.)
- **Z axis:** Dataset size (depth of each cuboid)

Source data: `data/Datasets(Priority).csv` — ~85 datasets across 5 priority tiers.

## Environment

- **Package manager:** [Pixi](https://pixi.sh) (conda-based, using conda-forge channel)
- **Runtime:** Node.js 22+ (managed by pixi), Python 3.14
- **Platform:** macOS ARM64

## Commands

```bash
pixi install          # Install conda environment (nodejs, python)
pixi run dev          # Start Vite dev server
pixi run build        # Production build → dist/
pixi run preview      # Preview production build
pixi run npx tsc --noEmit  # Type-check
```

After cloning, run `pixi install && pixi run npm install` to set up both environments.

## Architecture

React + Three.js (via react-three-fiber) + d3-scale for normalization.

```
src/
  data/
    datasets.ts       # Data model, aggregation, sorting (rawRecords → CubeCell[])
    colors.ts          # Color palettes per organism/modality
  hooks/
    useStore.ts        # App state: filters, scale mode, selection, opacity
  components/
    Scene.tsx          # R3F Canvas wrapper, camera control, lighting
    CubeMap.tsx        # Core layout: maps data → 3D box positions using d3 scales
    CubeCellMesh.tsx   # Individual cuboid with hover/select interactions
    OuterCube.tsx      # Transparent bounding cube shell
    GridPlanes.tsx     # Translucent divider planes between categories
    AxisLabels.tsx     # Text labels along X/Y/Z axes (drei Text)
    Tooltip.tsx        # HTML overlay following mouse on hover
    ControlPanel.tsx   # Left sidebar: filters, scale, sort, color, opacity
    DetailsPanel.tsx   # Bottom-right panel for selected cell details
    CameraPresets.tsx  # Iso/Front/Top/Side camera buttons
```

**Data flow:** `rawRecords` → filter by organism/modality → `buildCubeCells()` aggregation → d3 scale for Z depth → Three.js box geometry positioned in cube grid.

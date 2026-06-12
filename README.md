# metacube — 3D Data Cube Visualization

Interactive 3D cube visualization for exploring tabular data across three categorical dimensions. Provide a CSV and a YAML config — metacube transforms it into a self-contained HTML file or serves it locally.



**[Try it in the browser →](https://chair-for-clinical-bioinformatics.github.io/metacube/playground/)**

## Packages

| Package | Install | Docs |
|---------|---------|------|
| Python | `pip install metacube` | [python-pkg/README.md](python-pkg/README.md) |
| R | `devtools::install_github("Chair-for-Clinical-Bioinformatics/metacube", subdir = "r-pkg")` | [r-pkg/README.md](r-pkg/README.md) |

No Node.js required by end users — the JS bundle is pre-built and embedded in both packages.

## How it works

You provide two files:
- **A CSV** with one row per data point and columns for the three axes and a count/size value
- **A YAML config** that maps CSV columns to axes and enables optional features (drilldown, color gradient, 2D slice)

The transform step aggregates the data into a `CubeData` structure that drives the visualization. The result is a fully self-contained HTML file — open it in any browser, no server needed.

## Repository Layout

```
metacube/
├── src/                        # Vite + React + Three.js source (JS visualization)
├── playground/                 # Browser-based playground page (upload CSV + YAML)
├── python-pkg/                 # Python package (pip-installable)
│   └── src/metacube/
│       ├── _template.html      # Pre-built JS bundle (committed asset)
│       ├── examples/           # Bundled example CSV + YAML files
│       ├── transform.py        # CSV + config → CubeData JSON
│       ├── build.py            # CubeData JSON → standalone HTML
│       ├── serve.py            # Local HTTP server
│       └── cli.py              # Click CLI entry point
├── r-pkg/                      # R package (devtools-installable)
│   ├── R/
│   │   ├── transform.R         # data.frame + config → CubeData list
│   │   ├── build.R             # CubeData → HTML file
│   │   └── serve.R             # httpuv local server
│   └── inst/template.html      # Same pre-built JS bundle
├── public/                     # Static assets served by Vite
│   ├── examples/               # Bundled example CSV + YAML files
│   └── template.html           # Pre-built single-file bundle (for playground download)
└── pixi.toml                   # Dev environment (Node + Python via conda)
```

## Development Setup

Requires [Pixi](https://pixi.sh):

```bash
pixi install                 # Install conda environment (Node, Python)
pixi run dev                 # Start Vite dev server (hot reload)
pixi run build               # Production JS build → dist/
pixi run export-template     # Rebuild template/index.html after JS changes
pixi run package-template    # Sync template to both packages (run after export-template)
```

The npm dependencies (Vite, React, Three.js, …) are installed automatically by the
`install-js` task that every `pixi run` step depends on. To install them explicitly,
run `pixi run install-js` (or `npm ci`).

Type-check:
```bash
pixi run -e default npx tsc --noEmit
```

## Running the Playground Locally

The playground page requires the pre-built template in `public/template.html` before the dev server starts. Example data is already in `public/examples/` and committed to the repo.

```bash
pixi run export-template   # builds template and copies to public/template.html
pixi run dev               # → http://localhost:5173/playground/
```

## Updating the Pre-built Bundle

After any JS changes that should be visible to package users, run:

```bash
pixi run package-template
```

This rebuilds the single-file bundle, stages it as `public/template.html`, and copies it to `python-pkg/src/metacube/_template.html` and `r-pkg/inst/template.html`. Both package files must be committed.

## Key Features

| Feature | Config key | Description |
|---|---|---|
| Count gradient | `size_colour` | Block colour + size from a numeric column |
| Uniform colour mode | *(omit `size_colour`)* | All cells flat-coloured; useful when only presence matters |
| Zoom drilldown | `drilldown.type: zoom` | Click a cell to open a full inner 3D cube on finer axes |
| Treemap drilldown | `drilldown.type: treemap` | Click opens a hierarchical treemap of dataset/category breakdown |
| Ghost datasets | `ghost_datasets` | Matching cells render as transparent wireframe (e.g. planned data) |
| Accent datasets | `accent_datasets` / `accent_color` | Matching cells render in a fixed colour instead of the gradient |
| Multi-column axis | `columns: [col1, col2]` | Combine multiple CSV columns into one axis value with a separator |
| Per-column remapping | `column_value_labels` | Remap or drop individual components before combining |
| Explicit label order | `value_order` | Control axis label order regardless of frequency or sort_by |
| Metadata join | `metadata_csv` | Left-join a secondary CSV (title/doi/year) by key — keeps main CSV lean |
| Tooltip breakdown | `tooltip_breakdown` | Show per-cell breakdown of a column (e.g. cell types) on hover |
| Inner zoom colours | `drilldown.axis_colors` | Override axis label colours for the inner zoom cube |
| Dataset highlighting | *(click dataset card)* | In zoom mode, clicking a dataset card highlights all its inner cells |
| Filter summary | *(automatic)* | Live "selected: X entries" panel when axis labels are clicked |
| 2D slice | `slice` | Toggle a heatmap of the two free axes at the selected cell's fixed value |
| Per-cell charts | `charts_json` | Per-cell sparkline, line, or bar chart in the details panel |

## Documentation

- **[Config file reference →](docs/config.md)** — all YAML options, visualization modes, worked examples

## Tech Stack

- **Visualization:** React 19 + TypeScript + Three.js (react-three-fiber) + d3-hierarchy
- **Build:** Vite 8
- **Python package:** Click CLI, pandas, pyyaml
- **R package:** jsonlite, yaml, httpuv

## License

MIT — see [LICENSE](LICENSE).

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

## Branding and theming

Metacube uses the CIFAR Angular Material theme by default. The original `default`
theme and the ASAP/CRN `asap` theme remain available for existing visualizations:

```yaml
colour_scheme: cifar   # default when omitted
# colour_scheme: default
# colour_scheme: asap
```

The CIFAR theme is defined in
[`src/data/colour_schemes/cifar_colours.yaml`](src/data/colour_schemes/cifar_colours.yaml).
Its light and dark modes are mapped from only the stable `Schemes` groups in the
Figma token exports:

- [`src/CIFAR Light.tokens.json`](src/CIFAR%20Light.tokens.json)
- [`src/CIFAR Dark.tokens.json`](src/CIFAR%20Dark.tokens.json)

The unstable `Cosmetic`, `State layers`, and `Palettes` export groups are not used.
Metacube-specific transparency is added only where an overlay must reveal the 3D
scene beneath it.

Semantic color usage follows the Angular Material roles:

- Page and panel copy uses On Surface or On Surface Variant.
- Primary actions use Primary with On Primary text.
- Help tooltips use Inverse Surface with Inverse On Surface text.
- Outline and Outline Variant are reserved for borders, grid lines, and other
  non-text decoration.
- Cube fills, axes, categorical colors, and count gradients derive from the CIFAR
  primary, secondary, tertiary, error, and container roles.

The CIFAR text, tooltip, and primary-action combinations exceed WCAG AA contrast
requirements for normal text in both modes. Visual hierarchy is communicated with
type size and weight rather than low-contrast text.

All interface, SVG, and 3D text uses locally bundled Roboto. Browser text uses
WOFF2 files for weights 400–700 plus regular italic; the Three.js text renderer
uses WOFF regular and bold files because it does not support WOFF2. The required
assets live in [`src/fonts`](src/fonts).

When branding or typography changes, rebuild and synchronize the standalone HTML
templates with `pixi run package-template` before committing.

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
| Colour scheme | `colour_scheme` | Select `cifar` (default), `default` (classic), or `asap`; light/dark mode remains user-controlled |
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

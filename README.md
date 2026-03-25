# Cube — 3D Dataset Explorer

Interactive 3D cubic map for exploring datasets across three categorical dimensions. Click any cell to drill down into a nested treemap of studies and cell types.

**Live demo:** [maflot.github.io/cube](https://maflot.github.io/cube/)

## Examples

| Example | Axes | Size | Sources |
|---------|------|------|---------|
| **Cell x Gene Census** | Organism × Assay × Organ | 214M cells, 5 organisms | [CZ CELLxGENE](https://cellxgene.cziscience.com/), [Census API](https://chanzuckerberg.github.io/cellxgene-census/) |
| **Multi-site Microbiome** | Host × Body Site × Genus | 5,166 genome bins, 12 hosts | [Human study](https://doi.org/10.1038/s41467-024-52598-7), [Zoo study](https://doi.org/10.1038/s41467-024-52669-9) |

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173/cube/

## Deploy Your Own Data

Fork this repo and add your dataset:

### 1. Prepare your data as two JSON files

**`public/my_data.json`** — cube records:
```json
{
  "records": [
    {
      "organism": "Category A value",
      "modality": "Category B value",
      "organ": "Category C value",
      "datasetSize": 1234,
      "datasets": ["sub-item 1 (500)", "sub-item 2 (734)"],
      "priority": 1
    }
  ],
  "organisms": ["Cat A val 1", "Cat A val 2"],
  "modalities": ["Cat B val 1", "Cat B val 2"],
  "organs": ["Cat C val 1", "Cat C val 2"]
}
```

**`public/my_drilldown.json`** — drill-down data (optional):
```json
{
  "Cat A val|Cat C val|Cat B val": [
    { "d": "Study name", "c": "Sub-category", "n": 100 }
  ]
}
```

Note: the drilldown key format is `organism|organ|modality`.

### 2. Register your example

Edit `src/data/examples.ts`:
```ts
{
  id: "my-dataset",
  title: "My Dataset",
  description: "Short description",
  axisLabels: { x: "Category A", y: "Category B", z: "Category C" },
  drilldownPath: "my_drilldown.json",
  dataPath: "my_data.json",
  links: [{ label: "Publication", url: "https://..." }],
}
```

### 3. Add the loader

In `src/data/loadExample.ts`, add a case for your `id`:
```ts
if (id === "my-dataset") {
  const resp = await fetch(`${import.meta.env.BASE_URL}my_data.json`);
  // ... same pattern as microbiome
}
```

### 4. Deploy

Push to `main` — GitHub Actions builds and deploys automatically. Or run locally:

```bash
npm run build
npx vite preview
```

### Custom domain / repo name

Change `base` in `vite.config.ts` to match your repo name:
```ts
base: "/your-repo-name/"
```

## Tech Stack

- React 19 + TypeScript + Three.js (react-three-fiber)
- d3-scale + d3-hierarchy for data mapping and treemaps
- Vite 8 for build
- GitHub Actions for deployment

## License

MIT

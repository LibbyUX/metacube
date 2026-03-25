/**
 * Multi-example registry.
 * Each example defines its axes, records, drilldown path, and publication references.
 */

export interface ExampleLink {
  label: string;
  url: string;
}

export interface ExampleConfig {
  id: string;
  title: string;
  description: string;
  axisLabels: { x: string; y: string; z: string };
  drilldownPath: string;
  dataPath?: string;
  links: ExampleLink[];
}

export const EXAMPLES: ExampleConfig[] = [
  {
    id: "cellxgene",
    title: "Cell x Gene Census",
    description: "214M cells across 5 organisms, 15 assays, 20 organs",
    axisLabels: { x: "Organism", y: "Assay / Protocol", z: "Organ / Tissue" },
    drilldownPath: "census_drilldown.json",
    links: [
      { label: "CZ CELLxGENE", url: "https://cellxgene.cziscience.com/" },
      { label: "Census API Docs", url: "https://chanzuckerberg.github.io/cellxgene-census/" },
      { label: "Census Python API", url: "https://chanzuckerberg.github.io/cellxgene-census/python-api.html" },
    ],
  },
  {
    id: "microbiome",
    title: "Multi-site Microbiome",
    description: "5,166 genome bins across human body sites + 41 zoo species",
    axisLabels: { x: "Host", y: "Sampling Region", z: "Microbial Genus" },
    drilldownPath: "microbiome_drilldown.json",
    dataPath: "microbiome_cube.json",
    links: [
      { label: "Human multi-site study", url: "https://www.nature.com/articles/s41467-024-52598-7" },
      { label: "Zoo microbiome study", url: "https://www.nature.com/articles/s41467-024-52669-9" },
    ],
  },
];

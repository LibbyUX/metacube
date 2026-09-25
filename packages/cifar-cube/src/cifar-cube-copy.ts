export interface CifarCubeDimensionCopy {
  term: string;
  description: string;
}

export interface CifarCubeAttributionCopy {
  beforeLink: string;
  linkText: string;
  afterLink: string;
  href: string;
}

export interface CifarCubeVisualizationCopy {
  description: string;
  dimensionHeadings: [string, string];
  dimensions: CifarCubeDimensionCopy[];
  attribution: CifarCubeAttributionCopy;
}

export interface CifarCubeIntroCopy {
  eyebrow?: string;
  heading: string;
  visualization: CifarCubeVisualizationCopy;
  compactDescription: string;
}

export const CIFAR_CUBE_INTRO_COPY: CifarCubeIntroCopy = {
  eyebrow: "Organ imaging datasets",
  heading: "Explore multiscale human data",
  visualization: {
    description: "This visualization compares datasets across three dimensions. Select a cube to view its details.",
    dimensionHeadings: ["Dimension", "What it represents"],
    dimensions: [
      {
        term: "Spatial scale",
        description: "Physical size represented in the dataset (100 µm or 100 mm)",
      },
      {
        term: "Age (years)",
        description: "Age of the tissue donor",
      },
      {
        term: "Organ",
        description: "Tissue source",
      },
    ],
    attribution: {
      beforeLink: "Inspired by ",
      linkText: "Metacube",
      afterLink: " from the Chair for Clinical Bioinformatics.",
      href: "https://github.com/Chair-for-Clinical-Bioinformatics/metacube",
    },
  },
  compactDescription: "Browse organ-imaging datasets and compare their spatial scale, donor age, organ, and other available details. Use each card to open its metadata.",
};

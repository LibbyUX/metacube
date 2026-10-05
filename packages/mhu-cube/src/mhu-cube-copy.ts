export interface MhuCubeDimensionCopy {
  term: string;
  description: string;
}

export interface MhuCubeAttributionCopy {
  beforeLink: string;
  linkText: string;
  afterLink: string;
  href: string;
}

export interface MhuCubeVisualizationCopy {
  description: string;
  dimensionHeadings: [string, string];
  dimensions: MhuCubeDimensionCopy[];
  attribution: MhuCubeAttributionCopy;
}

export interface MhuCubeIntroCopy {
  eyebrow?: string;
  heading: string;
  visualization: MhuCubeVisualizationCopy;
  compactDescription: string;
}

export const MHU_CUBE_INTRO_COPY: MhuCubeIntroCopy = {
  eyebrow: "Organ imaging datasets",
  heading: "Explore multiscale human data",
  visualization: {
    description: "This visualization compares datasets across time, space, and organ. Select a block to view its details.",
    dimensionHeadings: ["Dimension", "What it represents"],
    dimensions: [
      {
        term: "Time",
        description: "Donor age in years; taller blocks span an age range",
      },
      {
        term: "Space",
        description: "Physical scale the dataset captures",
      },
      {
        term: "Organ",
        description: "Tissue source, listed alphabetically",
      },
    ],
    attribution: {
      beforeLink: "Inspired by ",
      linkText: "Metacube",
      afterLink: " from the Chair for Clinical Bioinformatics.",
      href: "https://github.com/Chair-for-Clinical-Bioinformatics/metacube",
    },
  },
  compactDescription: "Browse organ-imaging datasets and compare their time (donor age), space (spatial scale), organ, and other available details. Use each card to open its metadata.",
};

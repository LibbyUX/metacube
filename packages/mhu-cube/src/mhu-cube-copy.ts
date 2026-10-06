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
  /** Desktop heading, beside the visualization; it stays on one line. */
  heading: string;
  /** Compact heading, above the dataset cards; compact layouts have no body text. */
  compactHeading: string;
  visualization: MhuCubeVisualizationCopy;
}

export const MHU_CUBE_INTRO_COPY: MhuCubeIntroCopy = {
  heading: "Explore multicube data",
  compactHeading: "Explore datasets across time, space, and organ",
  visualization: {
    description: "This interactive visualization compares datasets across time, space, and organ. Select a block to view its details.",
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
};

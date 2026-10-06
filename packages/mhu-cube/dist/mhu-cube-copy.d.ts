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
export declare const MHU_CUBE_INTRO_COPY: MhuCubeIntroCopy;
//# sourceMappingURL=mhu-cube-copy.d.ts.map
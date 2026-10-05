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
export declare const MHU_CUBE_INTRO_COPY: MhuCubeIntroCopy;
//# sourceMappingURL=mhu-cube-copy.d.ts.map
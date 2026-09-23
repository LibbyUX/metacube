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
export declare const CIFAR_CUBE_INTRO_COPY: CifarCubeIntroCopy;
//# sourceMappingURL=cifar-cube-copy.d.ts.map
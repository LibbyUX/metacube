import type { CifarCubeAxes, CifarCubeItem, CifarCubePosition } from "./types";
/**
 * Creates the reference-style perspective bounding cube.
 * @returns A decorative SVG element with crisp, non-scaling frame lines.
 */
export declare function createCoordinateFrame(): SVGSVGElement;
/**
 * Creates visual labels for all three configured categorical axes.
 * @param axes - Validated axis definitions and ordered values.
 * @returns A decorative label layer positioned over the coordinate frame.
 */
export declare function createAxisLabels(axes: CifarCubeAxes): HTMLDivElement;
interface ProjectedCube {
    svg: SVGSVGElement;
    bounds: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
}
/**
 * Constructs a cube from projected 3D corners, giving every location its true perspective.
 * @param position - Validated axis indexes where x is spatial scale, y is Age, and z is Organ.
 * @param axes - Axis definitions used to normalize categorical indexes.
 * @param cubeScale - Relative cube size greater than zero and no larger than one.
 * @returns The decorative cube SVG and its exact percentage bounds.
 */
export declare function createProjectedCube(position: CifarCubePosition, axes: CifarCubeAxes, cubeScale?: number): ProjectedCube;
/**
 * Creates the screen-reader equivalent of the decorative axis labels.
 * @param axes - Validated axis definitions and ordered values.
 * @returns Visually hidden text describing all axis categories.
 */
export declare function createAccessibleAxisSummary(axes: CifarCubeAxes): HTMLParagraphElement;
/**
 * Summarizes one dataset's metadata, visualization position, and availability.
 * @param item - Dataset represented by a cube control.
 * @param axes - Axis definitions used to describe its plotted position.
 * @returns A concise accessible description for the dataset control.
 */
export declare function getAccessibleItemDescription(item: CifarCubeItem, axes: CifarCubeAxes): string;
export {};
//# sourceMappingURL=cifar-cube-visualization.d.ts.map
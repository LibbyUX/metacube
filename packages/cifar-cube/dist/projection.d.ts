import type { CifarCubeAxes, CifarCubePosition } from "./types";
export interface Point {
    x: number;
    y: number;
}
export interface NormalizedPosition {
    x: number;
    y: number;
    z: number;
}
export interface ProjectedCubeGeometry {
    corners: {
        topFront: Point;
        topLeft: Point;
        topBack: Point;
        topRight: Point;
        bottomFront: Point;
        bottomLeft: Point;
        bottomRight: Point;
    };
    bounds: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
}
/**
 * Places a categorical index at the center of its equal-width axis cell.
 * @param value - Zero-based category index.
 * @param count - Total categories on the axis.
 * @returns A normalized position between zero and one.
 */
export declare function getCategoryCenter(value: number, count: number): number;
/**
 * Projects normalized categorical coordinates onto the reference perspective.
 * @param x - Normalized spatial-scale position.
 * @param y - Normalized age position.
 * @param z - Normalized organ position.
 * @returns A percentage coordinate inside the visualization frame.
 */
export declare function projectPoint(x: number, y: number, z: number): Point;
/**
 * Maps validated categorical indexes to normalized projection coordinates.
 * @param position - Validated axis indexes.
 * @param axes - Validated axes used to normalize indexes.
 * @returns Normalized x, y, and z coordinates.
 */
export declare function getNormalizedPosition(position: CifarCubePosition, axes: CifarCubeAxes): NormalizedPosition;
/**
 * Computes CSS placement values for a validated dataset position.
 * @param position - Validated axis indexes.
 * @param axes - Validated axes used to normalize indexes.
 * @returns CSS-ready placement, stacking, and preview-side values.
 */
export declare function getScenePosition(position: CifarCubePosition, axes: CifarCubeAxes): {
    left: string;
    top: string;
    layer: string;
    cardSide: string;
};
/**
 * Computes projected corners and bounds for a cube at a validated position.
 * @param position - Validated axis indexes.
 * @param axes - Validated axes used to size and place the cube.
 * @returns Projected corners and percentage bounds.
 */
export declare function getProjectedCubeGeometry(position: CifarCubePosition, axes: CifarCubeAxes): ProjectedCubeGeometry;
//# sourceMappingURL=projection.d.ts.map
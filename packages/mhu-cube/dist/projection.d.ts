import type { MhuCubeAxes, MhuCubeItem, MhuCubeTimeAxis, MhuCubeTimeRange } from "./types";
export interface Point {
    x: number;
    y: number;
}
/** Normalized block extents where x is space (inverted), y is time, and z is organ. */
export interface Box {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    z0: number;
    z1: number;
}
export interface ProjectedBoxGeometry {
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
/** Placement, paint order, and hover-card anchoring for one plotted dataset. */
export interface PlotLayout {
    box: Box;
    geometry: ProjectedBoxGeometry;
    /** Paint order starting at one; higher values render in front. */
    layer: number;
    /** Side of the block where its hover card opens. */
    cardSide: "left" | "right";
    /** Vertical hover-card anchor as a percentage of the block's bounds. */
    cardTop: number;
}
/**
 * Places a categorical index at the center of its equal-width axis cell.
 * @param value - Zero-based category index.
 * @param count - Total categories on the axis.
 * @returns A normalized position between zero and one.
 */
export declare function getCategoryCenter(value: number, count: number): number;
/**
 * Projects normalized coordinates onto the reference perspective.
 * @param x - Normalized space position.
 * @param y - Normalized time position.
 * @param z - Normalized organ position.
 * @returns A percentage coordinate inside the visualization frame.
 */
export declare function projectPoint(x: number, y: number, z: number): Point;
/**
 * Maps a time value onto the vertical axis.
 * @param value - Time in axis units.
 * @param axis - Validated time axis with a positive span.
 * @returns A normalized height between zero and one for in-range values.
 */
export declare function getTimeCoordinate(value: number, axis: MhuCubeTimeAxis): number;
/**
 * Sizes block footprints from the denser categorical axis.
 * @param spaceCount - Number of space categories.
 * @param organCount - Number of organ categories.
 * @returns Half of a full-width block's normalized footprint.
 */
export declare function getFootprintHalfSize(spaceCount: number, organCount: number): number;
/**
 * Converts a time range to a drawn vertical extent, keeping short ranges and single ages cube-height.
 * @param range - Validated time range inside the axis domain.
 * @param axis - Validated time axis with a positive span.
 * @param minHeight - Smallest drawn height; ranges shorter than this grow around their midpoint.
 * @returns Normalized bottom and top heights, shifted inward rather than clipped at the axis ends.
 */
export declare function getRenderedTimeExtent(range: MhuCubeTimeRange, axis: MhuCubeTimeAxis, minHeight: number): {
    y0: number;
    y1: number;
};
/**
 * Computes projected corners and bounds for a block.
 * @param box - Normalized block extents.
 * @returns Projected corners and percentage bounds.
 */
export declare function getProjectedBoxGeometry(box: Box): ProjectedBoxGeometry;
/**
 * Orders datasets so reading and keyboard order follow the plot: organ, space, time, then ID.
 * @param items - Validated datasets.
 * @param axes - Validated axes whose value order defines organ and space order.
 * @returns A new array with positioned datasets first and unpositioned datasets in their original order.
 */
export declare function sortItemsForDisplay(items: readonly MhuCubeItem[], axes: MhuCubeAxes): MhuCubeItem[];
/**
 * Computes every plotted block's geometry, lane, paint order, and hover-card anchor.
 * @param items - Validated datasets; those without a position are skipped.
 * @param axes - Validated, plottable axes.
 * @returns Layout keyed by dataset ID.
 */
export declare function layoutPlot(items: readonly MhuCubeItem[], axes: MhuCubeAxes): Map<string, PlotLayout>;
//# sourceMappingURL=projection.d.ts.map
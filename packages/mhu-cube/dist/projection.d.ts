import type { MhuCubeAxes, MhuCubeItem, MhuCubeTimeAxis, MhuCubeTimeRange, MhuCubeView } from "./types";
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
/**
 * Projected block corners, named for the corner view: `front` is the corner nearest the camera, `left` sits
 * across the space axis from it, and `right` across the organ axis. The faces meeting at `front` are visible.
 */
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
/** Placement, paint order, reference lines, and hover-card anchoring for one plotted dataset. */
export interface PlotLayout {
    box: Box;
    /** The dataset's exact normalized time span, which single ages and short ranges draw larger than. */
    time: {
        start: number;
        end: number;
    };
    geometry: ProjectedBoxGeometry;
    /** The block's footprint on the floor. */
    floor: Point[];
    /** Lines from the block's visible bottom corners down to the floor; empty when it rests on the floor. */
    drops: Array<[Point, Point]>;
    /** Level lines tracing the exact start and end heights from the block to the time axis. */
    leaders: Point[][];
    /** The exact time span marked on the time axis. */
    bracket: [Point, Point];
    /** Paint order starting at one; higher values render in front. */
    layer: number;
    /** Side of the block where its hover card opens. */
    cardSide: "left" | "right";
    /** Vertical hover-card anchor as a percentage of the block's bounds. */
    cardTop: number;
}
/** Where each category sits on the floor and how much room its blocks have. */
export interface AxisLayout {
    /** Half of a full-width block's normalized footprint. */
    halfSize: number;
    /** Normalized x center for each space value, in axis order. */
    space: number[];
    /** Normalized x range each space value's lanes may occupy, in axis order. */
    spaceBands: Array<[number, number]>;
    /** Normalized z center for each organ value, in axis order. */
    organ: number[];
    /** Normalized z range each organ value's lanes may occupy, in axis order. */
    organBands: Array<[number, number]>;
}
/**
 * Places a categorical index at the center of its equal-width axis cell.
 * @param value - Zero-based category index.
 * @param count - Total categories on the axis.
 * @returns A normalized position between zero and one.
 */
export declare function getCategoryCenter(value: number, count: number): number;
/**
 * Spreads a few categories toward the ends of an axis so their blocks read as distinct groups.
 * @param value - Zero-based category index.
 * @param count - Total categories on the axis.
 * @param halfSize - Half of a block's footprint, used to keep blocks inside the frame.
 * @returns A normalized position between zero and one; never closer together than equal-width cells.
 */
export declare function getSpreadCenter(value: number, count: number, halfSize: number): number;
/**
 * Projects normalized coordinates onto the plot for a camera view.
 * @param x - Normalized space position.
 * @param y - Normalized time position.
 * @param z - Normalized organ position.
 * @param view - Camera view; defaults to the corner view.
 * @returns A percentage coordinate inside the visualization frame.
 */
export declare function projectPoint(x: number, y: number, z: number, view?: MhuCubeView): Point;
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
 * Positions every space and organ category on the floor; labels, guides, and blocks all share these centers.
 * @param axes - Validated, plottable axes.
 * @returns Footprint size, spread space centers, organ centers, and the bands their lanes may use.
 */
export declare function getAxisLayout(axes: MhuCubeAxes): AxisLayout;
/**
 * Projects the twelve edges of the bounding cube so the frame and its contents share one projection.
 * @param view - Camera view; defaults to the corner view.
 * @returns Start and end points of each frame edge in plot percentages.
 */
export declare function getFrameEdges(view?: MhuCubeView): Array<[Point, Point]>;
/**
 * Traces one time level across the two walls farthest from the camera, starting at the time ticks.
 * @param y - Normalized time height.
 * @param view - Camera view; defaults to the corner view.
 * @returns The guide's three projected points: the tick edge, the far corner, and the wall's other end.
 */
export declare function getTimeGuide(y: number, view?: MhuCubeView): Point[];
/**
 * Finds the on-screen direction pointing straight away from a frame edge, away from the cube.
 * @param start - One end of the edge in plot percentages.
 * @param end - The other end of the edge in plot percentages.
 * @param view - Camera view whose cube the normal points away from; defaults to the corner view.
 * @returns A unit vector in screen space, correcting for the plot's non-square percentages.
 */
export declare function getOutwardNormal(start: Point, end: Point, view?: MhuCubeView): Point;
/**
 * Locates the three labeled frame edges and the direction their labels sit away from the cube.
 * Points along each edge are linear in that axis's normalized coordinate.
 * @param view - Camera view; defaults to the corner view.
 * @returns For each axis, its edge's start and end points in plot percentages and its outward unit normal.
 */
export declare function getAxisEdges(view?: MhuCubeView): {
    time: {
        start: Point;
        end: Point;
        normal: Point;
    };
    space: {
        start: Point;
        end: Point;
        normal: Point;
    };
    organ: {
        start: Point;
        end: Point;
        normal: Point;
    };
};
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
 * @param view - Camera view; defaults to the corner view.
 * @returns Projected corners and percentage bounds.
 */
export declare function getProjectedBoxGeometry(box: Box, view?: MhuCubeView): ProjectedBoxGeometry;
/**
 * Orders datasets so reading and keyboard order follow the plot: organ, space, time, then ID.
 * @param items - Validated datasets.
 * @param axes - Validated axes whose value order defines organ and space order.
 * @returns A new array with positioned datasets first and unpositioned datasets in their original order.
 */
export declare function sortItemsForDisplay(items: readonly MhuCubeItem[], axes: MhuCubeAxes): MhuCubeItem[];
/**
 * Computes every plotted block's geometry, lane, paint order, reference lines, and hover-card anchor.
 * @param items - Validated datasets; those without a position are skipped.
 * @param axes - Validated, plottable axes.
 * @param view - Camera view; defaults to the corner view.
 * @returns Layout keyed by dataset ID.
 */
export declare function layoutPlot(items: readonly MhuCubeItem[], axes: MhuCubeAxes, view?: MhuCubeView): Map<string, PlotLayout>;
//# sourceMappingURL=projection.d.ts.map
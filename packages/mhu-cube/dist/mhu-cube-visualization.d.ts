import { type ProjectedBoxGeometry } from "./projection";
import type { MhuCubeAxes, MhuCubeItem, MhuCubeTimeAxis, MhuCubeTimeRange } from "./types";
/**
 * Formats a dataset's time range for labels and assistive technology.
 * @param range - Validated time range.
 * @param axis - Time axis supplying the unit.
 * @returns The range's own label, or its formatted values such as "45 years" or "7–47 years".
 */
export declare function formatTimeRange(range: MhuCubeTimeRange, axis: MhuCubeTimeAxis): string;
/**
 * Creates the reference-style perspective bounding cube with time guides on its back walls.
 * @param axes - Validated axes supplying the time ticks.
 * @returns A decorative SVG element with crisp, non-scaling frame lines.
 */
export declare function createCoordinateFrame(axes: MhuCubeAxes): SVGSVGElement;
/**
 * Creates visual labels for the time, space, and organ axes.
 * @param axes - Validated axes; organ values arrive alphabetized.
 * @returns A decorative label layer positioned over the coordinate frame.
 */
export declare function createAxisLabels(axes: MhuCubeAxes): HTMLDivElement;
/**
 * Draws a block's three visible faces from its projected corners; tall blocks become rectangular prisms.
 * @param geometry - Projected corners and percentage bounds from the plot layout.
 * @returns The decorative block SVG.
 */
export declare function createProjectedCube({ corners, bounds }: ProjectedBoxGeometry): SVGSVGElement;
/**
 * Creates the screen-reader equivalent of the decorative axis labels.
 * @param axes - Validated axes.
 * @returns Visually hidden text describing the time span and every space and organ category.
 */
export declare function createAccessibleAxisSummary(axes: MhuCubeAxes): HTMLParagraphElement;
/**
 * Summarizes one dataset's metadata, visualization position, and availability.
 * @param item - Dataset represented by a block control.
 * @param axes - Axis definitions used to describe its plotted position.
 * @returns A concise accessible description for the dataset control.
 */
export declare function getAccessibleItemDescription(item: MhuCubeItem, axes: MhuCubeAxes): string;
//# sourceMappingURL=mhu-cube-visualization.d.ts.map
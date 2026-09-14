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
  bounds: { left: number; top: number; width: number; height: number };
}

// Percentage coordinates traced from the reference perspective. Each plane is
// ordered front, left, back, right so points can be projected bilinearly.
const FRAME_PLANES = {
  top: {
    front: { x: 57.31, y: 31.81 },
    left: { x: 15.15, y: 11.92 },
    back: { x: 57.31, y: 0.53 },
    right: { x: 99.47, y: 11.92 },
  },
  bottom: {
    front: { x: 57.31, y: 99.16 },
    left: { x: 22.4, y: 67.43 },
    back: { x: 57.31, y: 46.7 },
    right: { x: 92.49, y: 67.43 },
  },
} as const;

/**
 * Places a categorical index at the center of its equal-width axis cell.
 * @param value - Zero-based category index.
 * @param count - Total categories on the axis.
 * @returns A normalized position between zero and one.
 */
export function getCategoryCenter(value: number, count: number) {
  return count > 0 ? (value + 0.5) / count : 0.5;
}

function interpolatePlane(plane: typeof FRAME_PLANES.top | typeof FRAME_PLANES.bottom, x: number, z: number): Point {
  const weights = {
    front: (1 - x) * (1 - z),
    left: x * (1 - z),
    back: x * z,
    right: (1 - x) * z,
  };
  return {
    x: plane.front.x * weights.front + plane.left.x * weights.left + plane.back.x * weights.back + plane.right.x * weights.right,
    y: plane.front.y * weights.front + plane.left.y * weights.left + plane.back.y * weights.back + plane.right.y * weights.right,
  };
}

/**
 * Projects normalized categorical coordinates onto the reference perspective.
 * @param x - Normalized spatial-scale position.
 * @param y - Normalized age position.
 * @param z - Normalized organ position.
 * @returns A percentage coordinate inside the visualization frame.
 */
export function projectPoint(x: number, y: number, z: number): Point {
  const top = interpolatePlane(FRAME_PLANES.top, x, z);
  const bottom = interpolatePlane(FRAME_PLANES.bottom, x, z);
  return {
    x: bottom.x + (top.x - bottom.x) * y,
    y: bottom.y + (top.y - bottom.y) * y,
  };
}

/**
 * Maps validated categorical indexes to normalized projection coordinates.
 * @param position - Validated axis indexes.
 * @param axes - Validated axes used to normalize indexes.
 * @returns Normalized x, y, and z coordinates.
 */
export function getNormalizedPosition(position: CifarCubePosition, axes: CifarCubeAxes): NormalizedPosition {
  return {
    x: 1 - getCategoryCenter(position.x, axes.x.values.length),
    y: getCategoryCenter(position.y, axes.y.values.length),
    z: getCategoryCenter(position.z, axes.z.values.length),
  };
}

/**
 * Computes CSS placement values for a validated dataset position.
 * @param position - Validated axis indexes.
 * @param axes - Validated axes used to normalize indexes.
 * @returns CSS-ready placement, stacking, and preview-side values.
 */
export function getScenePosition(position: CifarCubePosition, axes: CifarCubeAxes) {
  const normalized = getNormalizedPosition(position, axes);
  const point = projectPoint(normalized.x, normalized.y, normalized.z);
  return {
    left: `${point.x}%`,
    top: `${point.y}%`,
    layer: `${Math.round((2 - normalized.x - normalized.z) * 1000)}`,
    cardSide: point.x > 66 ? "left" : "right",
  };
}

/**
 * Computes projected corners and bounds for a cube at a validated position.
 * @param position - Validated axis indexes.
 * @param axes - Validated axes used to size and place the cube.
 * @param cubeScale - Relative cube size greater than zero and no larger than one.
 * @returns Projected corners and percentage bounds.
 */
export function getProjectedCubeGeometry(
  position: CifarCubePosition,
  axes: CifarCubeAxes,
  cubeScale = 1,
): ProjectedCubeGeometry {
  const center = getNormalizedPosition(position, axes);
  const halfSize = (0.5 / Math.max(axes.x.values.length, axes.y.values.length, axes.z.values.length, 1)) * cubeScale;
  const low = (value: number) => Math.max(0, value - halfSize);
  const high = (value: number) => Math.min(1, value + halfSize);
  const x0 = low(center.x);
  const x1 = high(center.x);
  const y0 = low(center.y);
  const y1 = high(center.y);
  const z0 = low(center.z);
  const z1 = high(center.z);
  const corners = {
    topFront: projectPoint(x0, y1, z0),
    topLeft: projectPoint(x1, y1, z0),
    topBack: projectPoint(x1, y1, z1),
    topRight: projectPoint(x0, y1, z1),
    bottomFront: projectPoint(x0, y0, z0),
    bottomLeft: projectPoint(x1, y0, z0),
    bottomRight: projectPoint(x0, y0, z1),
  };
  const points = Object.values(corners);
  const padding = 0.3;
  const left = Math.min(...points.map((point) => point.x)) - padding;
  const top = Math.min(...points.map((point) => point.y)) - padding;
  const right = Math.max(...points.map((point) => point.x)) + padding;
  const bottom = Math.max(...points.map((point) => point.y)) + padding;
  return { corners, bounds: { left, top, width: right - left, height: bottom - top } };
}

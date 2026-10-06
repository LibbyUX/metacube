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
  bounds: { left: number; top: number; width: number; height: number };
}

/** Placement, paint order, and hover-card anchoring for one plotted dataset. */
export interface PlotLayout {
  box: Box;
  /** The dataset's exact normalized time span, which single ages and short ranges draw larger than. */
  time: { start: number; end: number };
  geometry: ProjectedBoxGeometry;
  /** Paint order starting at one; higher values render in front. */
  layer: number;
  /** Side of the block where its hover card opens. */
  cardSide: "left" | "right";
  /** Vertical hover-card anchor as a percentage of the block's bounds. */
  cardTop: number;
}

// Percentage coordinates of the bounding cube's top and bottom faces. The low
// camera keeps the floor shallow, so depth moves a block up the screen far less
// than time does and heights stay comparable across the plot. The bottom of the
// plot is left free for the space and organ labels. Each plane is ordered front,
// left, back, right so points can be projected bilinearly.
const FRAME_PLANES = {
  top: {
    front: { x: 57.31, y: 19.2 },
    left: { x: 15.15, y: 9.6 },
    back: { x: 57.31, y: 1.8 },
    right: { x: 99.47, y: 9.6 },
  },
  bottom: {
    front: { x: 57.31, y: 90.5 },
    left: { x: 19.5, y: 77.2 },
    back: { x: 57.31, y: 65.8 },
    right: { x: 95.1, y: 77.2 },
  },
} as const;
// Plot height as a share of its width; must match the plot's CSS aspect-ratio (1000 / 868).
const PLOT_HEIGHT_RATIO = 0.868;

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
}

// Share of a categorical cell covered by a block's footprint.
const FOOTPRINT_FILL = 0.7;
// Gap kept between the outermost space blocks and the frame.
const SPACE_EDGE_MARGIN = 0.07;
// Share of a space band that lane groups may fill.
const LANE_BAND_FILL = 0.9;
// Normalized space between side-by-side lanes.
const LANE_GAP = 0.02;
// Rendered time extents closer than this share a cluster so stacked blocks never visually touch.
const OVERLAP_TOLERANCE = 0.02;
// Hover cards stay within this vertical band of the plot.
const CARD_ANCHOR_MIN = 12;
const CARD_ANCHOR_MAX = 88;
// Every edge of the unit cube as pairs of [x, y, z] corners.
const CUBE_EDGES: Array<[[number, number, number], [number, number, number]]> = [
  [[0, 0, 0], [1, 0, 0]], [[0, 0, 1], [1, 0, 1]], [[0, 1, 0], [1, 1, 0]], [[0, 1, 1], [1, 1, 1]],
  [[0, 0, 0], [0, 0, 1]], [[1, 0, 0], [1, 0, 1]], [[0, 1, 0], [0, 1, 1]], [[1, 1, 0], [1, 1, 1]],
  [[0, 0, 0], [0, 1, 0]], [[1, 0, 0], [1, 1, 0]], [[0, 0, 1], [0, 1, 1]], [[1, 0, 1], [1, 1, 1]],
];

/**
 * Places a categorical index at the center of its equal-width axis cell.
 * @param value - Zero-based category index.
 * @param count - Total categories on the axis.
 * @returns A normalized position between zero and one.
 */
export function getCategoryCenter(value: number, count: number) {
  return count > 0 ? (value + 0.5) / count : 0.5;
}

/**
 * Spreads a few categories toward the ends of an axis so their blocks read as distinct groups.
 * @param value - Zero-based category index.
 * @param count - Total categories on the axis.
 * @param halfSize - Half of a block's footprint, used to keep blocks inside the frame.
 * @returns A normalized position between zero and one; never closer together than equal-width cells.
 */
export function getSpreadCenter(value: number, count: number, halfSize: number) {
  if (count <= 1) return 0.5;
  const inset = Math.min(0.5 / count, halfSize + SPACE_EDGE_MARGIN);
  return inset + (value * (1 - 2 * inset)) / (count - 1);
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
 * Projects normalized coordinates onto the reference perspective.
 * @param x - Normalized space position.
 * @param y - Normalized time position.
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
 * Maps a time value onto the vertical axis.
 * @param value - Time in axis units.
 * @param axis - Validated time axis with a positive span.
 * @returns A normalized height between zero and one for in-range values.
 */
export function getTimeCoordinate(value: number, axis: MhuCubeTimeAxis) {
  return (value - axis.min) / (axis.max - axis.min);
}

/**
 * Sizes block footprints from the denser categorical axis.
 * @param spaceCount - Number of space categories.
 * @param organCount - Number of organ categories.
 * @returns Half of a full-width block's normalized footprint.
 */
export function getFootprintHalfSize(spaceCount: number, organCount: number) {
  return (0.5 / Math.max(spaceCount, organCount, 1)) * FOOTPRINT_FILL;
}

/**
 * Positions every space and organ category on the floor; labels, guides, and blocks all share these centers.
 * @param axes - Validated, plottable axes.
 * @returns Footprint size, spread space centers with their lane bands, and organ centers.
 */
export function getAxisLayout(axes: MhuCubeAxes): AxisLayout {
  const spaceCount = axes.space.values.length;
  const organCount = axes.organ.values.length;
  const halfSize = getFootprintHalfSize(spaceCount, organCount);
  // Space runs from the front corner (x = 0) to the left corner (x = 1); the first value sits nearest the left.
  const along = axes.space.values.map((_, index) => getSpreadCenter(index, spaceCount, halfSize));
  const space = along.map((center) => 1 - center);
  const spaceBands = along.map((center, index): [number, number] => {
    const lower = index === 0 ? 0 : (along[index - 1] + center) / 2;
    const upper = index === spaceCount - 1 ? 1 : (center + along[index + 1]) / 2;
    return [1 - upper, 1 - lower];
  });
  const organ = axes.organ.values.map((_, index) => getCategoryCenter(index, organCount));
  return { halfSize, space, spaceBands, organ };
}

/**
 * Projects the twelve edges of the bounding cube so the frame and its contents share one projection.
 * @returns Start and end points of each frame edge in plot percentages.
 */
export function getFrameEdges(): Array<[Point, Point]> {
  return CUBE_EDGES.map(([start, end]) => [projectPoint(...start), projectPoint(...end)]);
}

/**
 * Finds the on-screen direction pointing straight away from a frame edge, away from the cube.
 * @param start - One end of the edge in plot percentages.
 * @param end - The other end of the edge in plot percentages.
 * @returns A unit vector in screen space, correcting for the plot's non-square percentages.
 */
export function getOutwardNormal(start: Point, end: Point): Point {
  const dx = end.x - start.x;
  const dy = (end.y - start.y) * PLOT_HEIGHT_RATIO;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: dy / length, y: -dx / length };
  const center = projectPoint(0.5, 0.5, 0.5);
  const outward = { x: (start.x + end.x) / 2 - center.x, y: ((start.y + end.y) / 2 - center.y) * PLOT_HEIGHT_RATIO };
  return normal.x * outward.x + normal.y * outward.y < 0 ? { x: -normal.x, y: -normal.y } : normal;
}

/**
 * Locates the three labeled frame edges and the direction their labels sit away from the cube.
 * @returns For each axis, its edge's start and end points in plot percentages and its outward unit normal.
 */
export function getAxisEdges() {
  const edge = (start: [number, number, number], end: [number, number, number]) => {
    const from = projectPoint(...start);
    const to = projectPoint(...end);
    return { start: from, end: to, normal: getOutwardNormal(from, to) };
  };
  return {
    // The left vertical edge carries the time ticks; the two front floor edges carry space and organ.
    time: edge([1, 0, 0], [1, 1, 0]),
    space: edge([0, 0, 0], [1, 0, 0]),
    organ: edge([0, 0, 0], [0, 0, 1]),
  };
}

/**
 * Converts a time range to a drawn vertical extent, keeping short ranges and single ages cube-height.
 * @param range - Validated time range inside the axis domain.
 * @param axis - Validated time axis with a positive span.
 * @param minHeight - Smallest drawn height; ranges shorter than this grow around their midpoint.
 * @returns Normalized bottom and top heights, shifted inward rather than clipped at the axis ends.
 */
export function getRenderedTimeExtent(range: MhuCubeTimeRange, axis: MhuCubeTimeAxis, minHeight: number) {
  const start = getTimeCoordinate(range.start, axis);
  const end = getTimeCoordinate(range.end, axis);
  if (end - start >= minHeight) return { y0: start, y1: end };
  const height = Math.min(minHeight, 1);
  const y0 = Math.min(Math.max((start + end) / 2 - height / 2, 0), 1 - height);
  return { y0, y1: y0 + height };
}

/**
 * Computes projected corners and bounds for a block.
 * @param box - Normalized block extents.
 * @returns Projected corners and percentage bounds.
 */
export function getProjectedBoxGeometry(box: Box): ProjectedBoxGeometry {
  const corners = {
    topFront: projectPoint(box.x0, box.y1, box.z0),
    topLeft: projectPoint(box.x1, box.y1, box.z0),
    topBack: projectPoint(box.x1, box.y1, box.z1),
    topRight: projectPoint(box.x0, box.y1, box.z1),
    bottomFront: projectPoint(box.x0, box.y0, box.z0),
    bottomLeft: projectPoint(box.x1, box.y0, box.z0),
    bottomRight: projectPoint(box.x0, box.y0, box.z1),
  };
  const points = Object.values(corners);
  const padding = 0.3;
  const left = Math.min(...points.map((point) => point.x)) - padding;
  const top = Math.min(...points.map((point) => point.y)) - padding;
  const right = Math.max(...points.map((point) => point.x)) + padding;
  const bottom = Math.max(...points.map((point) => point.y)) + padding;
  return { corners, bounds: { left, top, width: right - left, height: bottom - top } };
}

function compareText(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Orders datasets so reading and keyboard order follow the plot: organ, space, time, then ID.
 * @param items - Validated datasets.
 * @param axes - Validated axes whose value order defines organ and space order.
 * @returns A new array with positioned datasets first and unpositioned datasets in their original order.
 */
export function sortItemsForDisplay(items: readonly MhuCubeItem[], axes: MhuCubeAxes) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const first = a.item.position;
      const second = b.item.position;
      if (!first || !second) return first ? -1 : second ? 1 : a.index - b.index;
      return axes.organ.values.indexOf(first.organ) - axes.organ.values.indexOf(second.organ)
        || axes.space.values.indexOf(first.space) - axes.space.values.indexOf(second.space)
        || first.time.start - second.time.start
        || first.time.end - second.time.end
        || compareText(a.item.id, b.item.id);
    })
    .map(({ item }) => item);
}

interface Placement {
  id: string;
  spaceIndex: number;
  organIndex: number;
  time: { start: number; end: number };
  y0: number;
  y1: number;
}

interface LaneSlot {
  /** Zero is the farthest lane from the viewer. */
  lane: number;
  laneCount: number;
}

/**
 * Splits one cluster of overlapping blocks into lanes, placing taller lanes farther back.
 * @param cluster - Blocks sorted by start whose drawn extents overlap transitively.
 * @param slots - Lane assignments, updated in place.
 * @returns Nothing.
 */
function assignClusterLanes(cluster: Placement[], slots: Map<string, LaneSlot>) {
  const lanes: Array<{ end: number; tallest: number; members: Placement[] }> = [];
  cluster.forEach((placement) => {
    let lane = lanes.find((candidate) => placement.y0 >= candidate.end + OVERLAP_TOLERANCE);
    if (!lane) {
      lane = { end: -Infinity, tallest: 0, members: [] };
      lanes.push(lane);
    }
    lane.end = placement.y1;
    lane.tallest = Math.max(lane.tallest, placement.y1 - placement.y0);
    lane.members.push(placement);
  });
  // A tall block in front would hide most of a shorter neighbor, so taller lanes sit behind.
  lanes
    .map((lane, index) => ({ lane, index }))
    .sort((a, b) => b.lane.tallest - a.lane.tallest || a.index - b.index)
    .forEach(({ lane }, depth) => {
      lane.members.forEach((member) => slots.set(member.id, { lane: depth, laneCount: lanes.length }));
    });
}

/**
 * Assigns lanes per overlap cluster within each space and organ cell.
 * @param placements - Blocks with their drawn time extents.
 * @returns Lane assignments; blocks that overlap nothing keep a single full-width lane.
 */
function assignLanes(placements: Placement[]) {
  const slots = new Map<string, LaneSlot>();
  const cells = new Map<string, Placement[]>();
  placements.forEach((placement) => {
    const key = `${placement.spaceIndex}:${placement.organIndex}`;
    cells.set(key, [...(cells.get(key) ?? []), placement]);
  });
  cells.forEach((cell) => {
    cell.sort((a, b) => a.y0 - b.y0 || a.y1 - b.y1 || compareText(a.id, b.id));
    let cluster: Placement[] = [];
    let clusterEnd = -Infinity;
    cell.forEach((placement) => {
      if (cluster.length > 0 && placement.y0 >= clusterEnd + OVERLAP_TOLERANCE) {
        assignClusterLanes(cluster, slots);
        cluster = [];
      }
      clusterEnd = cluster.length === 0 ? placement.y1 : Math.max(clusterEnd, placement.y1);
      cluster.push(placement);
    });
    if (cluster.length > 0) assignClusterLanes(cluster, slots);
  });
  return slots;
}

/**
 * Finds a block's extent along the space axis, narrowing it only when it shares a cluster.
 * @param center - Normalized center of the block's space value.
 * @param halfSize - Half of a full-width footprint.
 * @param band - Normalized x range the space value's lanes may occupy.
 * @param slot - The block's lane assignment.
 * @returns Normalized start and end along the space axis.
 */
function getLaneExtent(center: number, halfSize: number, band: [number, number], slot: LaneSlot): [number, number] {
  if (slot.laneCount === 1) return [center - halfSize, center + halfSize];
  // Lanes may spread a little into the band's spare width so each stays a usable target, but never past it.
  const room = 2 * Math.min(center - band[0], band[1] - center) * LANE_BAND_FILL;
  const span = Math.min(2 * halfSize * (1 + 0.5 * (slot.laneCount - 1)), room);
  const width = (span - LANE_GAP * (slot.laneCount - 1)) / slot.laneCount;
  const end = center + span / 2 - slot.lane * (width + LANE_GAP);
  return [end - width, end];
}

/**
 * Computes every plotted block's geometry, lane, paint order, and hover-card anchor.
 * @param items - Validated datasets; those without a position are skipped.
 * @param axes - Validated, plottable axes.
 * @returns Layout keyed by dataset ID.
 */
export function layoutPlot(items: readonly MhuCubeItem[], axes: MhuCubeAxes) {
  const axisLayout = getAxisLayout(axes);
  const { halfSize } = axisLayout;
  const placements: Placement[] = [];
  items.forEach((item) => {
    if (!item.position) return;
    const spaceIndex = axes.space.values.indexOf(item.position.space);
    const organIndex = axes.organ.values.indexOf(item.position.organ);
    if (spaceIndex < 0 || organIndex < 0) return;
    placements.push({
      id: item.id,
      spaceIndex,
      organIndex,
      time: {
        start: getTimeCoordinate(item.position.time.start, axes.time),
        end: getTimeCoordinate(item.position.time.end, axes.time),
      },
      ...getRenderedTimeExtent(item.position.time, axes.time, halfSize * 2),
    });
  });

  const slots = assignLanes(placements);
  const blocks = placements.map((placement) => {
    const centerX = axisLayout.space[placement.spaceIndex];
    const centerZ = axisLayout.organ[placement.organIndex];
    const slot = slots.get(placement.id) ?? { lane: 0, laneCount: 1 };
    const [x0, x1] = getLaneExtent(centerX, halfSize, axisLayout.spaceBands[placement.spaceIndex], slot);
    const box: Box = { x0, x1, y0: placement.y0, y1: placement.y1, z0: centerZ - halfSize, z1: centerZ + halfSize };
    return { id: placement.id, box, time: placement.time, cellDepth: centerX + centerZ };
  });

  // Paint farther cells, then farther lanes, then lower blocks first so nearer faces and upper blocks stay visible.
  blocks.sort((a, b) => b.cellDepth - a.cellDepth
    || (b.box.x0 + b.box.x1) - (a.box.x0 + a.box.x1)
    || a.box.y0 - b.box.y0
    || compareText(a.id, b.id));

  const layout = new Map<string, PlotLayout>();
  blocks.forEach(({ id, box, time }, rank) => {
    const geometry = getProjectedBoxGeometry(box);
    const { bounds } = geometry;
    const topCenter = projectPoint((box.x0 + box.x1) / 2, box.y1, (box.z0 + box.z1) / 2);
    const anchor = Math.min(Math.max(topCenter.y, CARD_ANCHOR_MIN), CARD_ANCHOR_MAX);
    layout.set(id, {
      box,
      time,
      geometry,
      layer: rank + 1,
      cardSide: bounds.left + bounds.width / 2 > 66 ? "left" : "right",
      cardTop: ((anchor - bounds.top) / bounds.height) * 100,
    });
  });
  return layout;
}

import {
  getAxisLayout,
  getFrameEdges,
  getTimeCoordinate,
  projectPoint,
  type PlotLayout,
  type Point,
  type ProjectedBoxGeometry,
} from "./projection";
import type { MhuCubeAxes, MhuCubeItem, MhuCubeTimeAxis, MhuCubeTimeRange } from "./types";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const NUMBER_FORMAT = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

/**
 * Builds SVG path data in plot percentages, the coordinate space shared by the frame and every block.
 * @param segments - Polylines to draw, each a list of projected points.
 * @returns Path data with one move command per polyline.
 */
function toPathData(segments: Point[][]) {
  return segments
    .filter((points) => points.length > 1)
    .map((points) => points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(""))
    .join("");
}

function createSvgElement<K extends keyof SVGElementTagNameMap>(tagName: K, attributes: Record<string, string>) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

/**
 * Formats a dataset's time range for labels and assistive technology.
 * @param range - Validated time range.
 * @param axis - Time axis supplying the unit.
 * @returns The range's own label, or its formatted values such as "45 years" or "7–47 years".
 */
export function formatTimeRange(range: MhuCubeTimeRange, axis: MhuCubeTimeAxis) {
  if (range.label) return range.label;
  const values = range.start === range.end
    ? NUMBER_FORMAT.format(range.start)
    : `${NUMBER_FORMAT.format(range.start)}–${NUMBER_FORMAT.format(range.end)}`;
  return axis.unit ? `${values} ${axis.unit}` : values;
}

/**
 * Creates the perspective bounding cube with time guides on its back walls and floor guides through every category.
 * @param axes - Validated axes supplying the time ticks and category positions.
 * @returns A decorative SVG element with crisp, non-scaling frame lines.
 */
export function createCoordinateFrame(axes: MhuCubeAxes) {
  const svg = createSvgElement("svg", {
    class: "mhu-cube__frame",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    "aria-hidden": "true",
  });
  const layout = getAxisLayout(axes);
  const timeGuides = (axes.time.ticks ?? [])
    .filter((tick) => tick > axes.time.min && tick < axes.time.max)
    .map((tick) => {
      const y = getTimeCoordinate(tick, axes.time);
      return [projectPoint(1, y, 0), projectPoint(1, y, 1), projectPoint(0, y, 1)];
    });
  // Each floor guide runs from a category label across the floor, so a block's footprint sits on its two guides.
  const floorGuides = [
    ...layout.space.map((x) => [projectPoint(x, 0, 0), projectPoint(x, 0, 1)]),
    ...layout.organ.map((z) => [projectPoint(0, 0, z), projectPoint(1, 0, z)]),
  ];
  svg.append(
    createSvgElement("path", { class: "mhu-cube__frame-guide", d: toPathData(timeGuides) }),
    createSvgElement("path", { class: "mhu-cube__frame-floor-guide", d: toPathData(floorGuides) }),
    createSvgElement("path", { class: "mhu-cube__frame-line", d: toPathData(getFrameEdges()) }),
  );
  return svg;
}

/**
 * Creates visual labels for the time, space, and organ axes.
 * @param axes - Validated axes; organ values arrive alphabetized.
 * @returns A decorative label layer positioned over the coordinate frame.
 */
export function createAxisLabels(axes: MhuCubeAxes) {
  const labels = document.createElement("div");
  labels.className = "mhu-cube__axes";
  labels.setAttribute("aria-hidden", "true");
  const addLabel = (text: string, className: string, point: Point) => {
    const label = document.createElement("span");
    label.className = className;
    label.textContent = text;
    label.style.left = `${point.x}%`;
    label.style.top = `${point.y}%`;
    labels.append(label);
  };

  addLabel(axes.time.label, "mhu-cube__axis-title mhu-cube__axis-title--time", { x: 4.5, y: 5 });
  addLabel(axes.space.label, "mhu-cube__axis-title mhu-cube__axis-title--space", { x: 30, y: 89 });
  addLabel(axes.organ.label, "mhu-cube__axis-title mhu-cube__axis-title--organ", { x: 84.5, y: 91.5 });
  (axes.time.ticks ?? []).forEach((tick) => {
    const point = projectPoint(1, getTimeCoordinate(tick, axes.time), 0);
    addLabel(NUMBER_FORMAT.format(tick), "mhu-cube__axis-value mhu-cube__axis-value--time", { x: point.x - 5, y: point.y });
  });
  const layout = getAxisLayout(axes);
  axes.space.values.forEach((value, index) => {
    const point = projectPoint(layout.space[index], 0, 0);
    addLabel(value, "mhu-cube__axis-value mhu-cube__axis-value--space", { x: point.x - 4.5, y: point.y + 1.8 });
  });
  axes.organ.values.forEach((value, index) => {
    const point = projectPoint(0, 0, layout.organ[index]);
    addLabel(value, "mhu-cube__axis-value mhu-cube__axis-value--organ", { x: point.x + 2.5, y: point.y + 1.7 });
  });
  return labels;
}

/**
 * Draws a block's three visible faces from its projected corners; tall blocks become rectangular prisms.
 * @param geometry - Projected corners and percentage bounds from the plot layout.
 * @returns The decorative block SVG.
 */
export function createProjectedCube({ corners, bounds }: ProjectedBoxGeometry) {
  const pointList = (...facePoints: Point[]) => facePoints.map((point) => `${point.x},${point.y}`).join(" ");
  const path = (...pathPoints: Point[]) => pathPoints
    .map((point, pointIndex) => `${pointIndex === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join("");
  const svg = createSvgElement("svg", {
    class: "mhu-cube__cube",
    viewBox: `${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`,
    preserveAspectRatio: "none",
    "aria-hidden": "true",
  });
  const topFace = [corners.topFront, corners.topLeft, corners.topBack, corners.topRight];
  const leftFace = [corners.topFront, corners.topLeft, corners.bottomLeft, corners.bottomFront];
  const rightFace = [corners.topFront, corners.topRight, corners.bottomRight, corners.bottomFront];
  svg.append(
    createSvgElement("polygon", { class: "mhu-cube__top", points: pointList(...topFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("polygon", { class: "mhu-cube__left", points: pointList(...leftFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("polygon", { class: "mhu-cube__right", points: pointList(...rightFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("path", {
      class: "mhu-cube__edge",
      d: [
        path(corners.topFront, corners.topBack),
        path(corners.topLeft, corners.topRight),
        path(corners.topFront, corners.bottomLeft),
        path(corners.topLeft, corners.bottomFront),
        path(corners.topFront, corners.bottomRight),
        path(corners.topRight, corners.bottomFront),
      ].join(""),
      "vector-effect": "non-scaling-stroke",
    }),
  );
  return svg;
}

/**
 * Ties a floating block to the axes: its footprint on the floor, dashed drop lines to it, and an age marker.
 * The age marker traces the exact start and end heights level to the time axis and is revealed on hover,
 * keyboard focus, or selection, so readers never have to judge height across the perspective by eye.
 * @param block - Plot layout for one dataset.
 * @returns A decorative SVG sharing the block's coordinate space, painted beneath every block.
 */
export function createBlockShadow({ box, time, geometry: { bounds } }: PlotLayout) {
  const svg = createSvgElement("svg", {
    class: "mhu-cube__shadow",
    viewBox: `${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`,
    preserveAspectRatio: "none",
    "aria-hidden": "true",
  });
  const floor = [
    projectPoint(box.x0, 0, box.z0),
    projectPoint(box.x1, 0, box.z0),
    projectPoint(box.x1, 0, box.z1),
    projectPoint(box.x0, 0, box.z1),
  ];
  svg.append(createSvgElement("polygon", {
    class: "mhu-cube__shadow-floor",
    points: floor.map((point) => `${point.x},${point.y}`).join(" "),
    "vector-effect": "non-scaling-stroke",
  }));
  if (box.y0 > 0) {
    // The three visible bottom corners drop to the floor, outlining where the block would rest.
    const corners: Array<[number, number]> = [[box.x0, box.z0], [box.x1, box.z0], [box.x0, box.z1]];
    svg.append(createSvgElement("path", {
      class: "mhu-cube__shadow-drop",
      d: toPathData(corners.map(([x, z]) => [projectPoint(x, box.y0, z), projectPoint(x, 0, z)])),
      "vector-effect": "non-scaling-stroke",
    }));
  }

  const marker = createSvgElement("g", { class: "mhu-cube__time-marker" });
  const levels = time.start === time.end ? [time.start] : [time.start, time.end];
  // Each level line stays at one height: across to the left wall, then along it to the time axis.
  marker.append(
    createSvgElement("path", {
      class: "mhu-cube__time-leader",
      d: toPathData(levels.map((y) => [projectPoint(box.x1, y, box.z0), projectPoint(1, y, box.z0), projectPoint(1, y, 0)])),
      "vector-effect": "non-scaling-stroke",
    }),
    createSvgElement("path", {
      class: "mhu-cube__time-bracket",
      d: toPathData([[projectPoint(1, time.start, 0), projectPoint(1, time.end, 0)]]),
      "vector-effect": "non-scaling-stroke",
    }),
  );
  svg.append(marker);
  return svg;
}

/**
 * Creates the screen-reader equivalent of the decorative axis labels.
 * @param axes - Validated axes.
 * @returns Visually hidden text describing the time span and every space and organ category.
 */
export function createAccessibleAxisSummary(axes: MhuCubeAxes) {
  const summary = document.createElement("p");
  summary.className = "mhu-cube__sr-only";
  const unit = axes.time.unit ? ` ${axes.time.unit}` : "";
  summary.textContent = [
    `${axes.time.label}: ${NUMBER_FORMAT.format(axes.time.min)} to ${NUMBER_FORMAT.format(axes.time.max)}${unit}`,
    `${axes.space.label}: ${axes.space.values.join(", ")}`,
    `${axes.organ.label}: ${axes.organ.values.join(", ")}`,
  ].join(". ");
  return summary;
}

/**
 * Summarizes one dataset's metadata, visualization position, and availability.
 * @param item - Dataset represented by a block control.
 * @param axes - Axis definitions used to describe its plotted position.
 * @returns A concise accessible description for the dataset control.
 */
export function getAccessibleItemDescription(item: MhuCubeItem, axes: MhuCubeAxes) {
  const metadata = Object.entries(item.metadata ?? {})
    .filter((entry): entry is [string, string | number] => entry[1] !== null && entry[1] !== undefined)
    .map(([key, value]) => `${key}: ${value}`);
  const position = item.position;
  const axisPosition = position ? [
    `${axes.time.label}: ${formatTimeRange(position.time, axes.time)}`,
    `${axes.space.label}: ${position.space}`,
    `${axes.organ.label}: ${position.organ}`,
  ] : [];
  const status = item.status ?? "available";
  const statusText = status === "current" ? "Current page" : status === "unavailable" ? "Metadata unavailable" : "Metadata available";
  const parts = [
    metadata.length > 0 ? metadata.join(", ") : "No dataset details provided",
    axisPosition.length > 0 ? `Visualization position: ${axisPosition.join(", ")}` : "Visualization position not provided",
    statusText,
  ];
  return `${parts.join(". ")}.`;
}

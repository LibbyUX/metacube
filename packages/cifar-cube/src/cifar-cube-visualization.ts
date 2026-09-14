import { getCategoryCenter, getProjectedCubeGeometry, projectPoint, type Point } from "./projection";
import type { CifarCubeAxes, CifarCubeAxis, CifarCubeItem, CifarCubePosition } from "./types";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function createSvgElement<K extends keyof SVGElementTagNameMap>(tagName: K, attributes: Record<string, string>) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

/**
 * Creates the reference-style perspective bounding cube.
 * @returns A decorative SVG element with crisp, non-scaling frame lines.
 */
export function createCoordinateFrame() {
  const svg = createSvgElement("svg", {
    class: "cifar-cube__frame",
    viewBox: "0 0 1000 868",
    preserveAspectRatio: "xMidYMid meet",
    "aria-hidden": "true",
  });
  svg.append(createSvgElement("path", {
    class: "cifar-cube__frame-line",
    d: "M573 5 152 103 573 276 995 103 573 5M152 103 224 586 573 861 925 586 995 103M573 276 573 861M573 5 573 405M224 586 573 405 925 586",
  }));
  return svg;
}

/**
 * Creates visual labels for all three configured categorical axes.
 * @param axes - Validated axis definitions and ordered values.
 * @returns A decorative label layer positioned over the coordinate frame.
 */
export function createAxisLabels(axes: CifarCubeAxes) {
  const labels = document.createElement("div");
  labels.className = "cifar-cube__axes";
  labels.setAttribute("aria-hidden", "true");
  const addLabel = (text: string, className: string, point: Point) => {
    const label = document.createElement("span");
    label.className = className;
    label.textContent = text;
    label.style.left = `${point.x}%`;
    label.style.top = `${point.y}%`;
    labels.append(label);
  };

  addLabel(axes.y.label, "cifar-cube__axis-title cifar-cube__axis-title--y", { x: 4.5, y: 7.5 });
  addLabel(axes.x.label, "cifar-cube__axis-title cifar-cube__axis-title--x", { x: 30, y: 89 });
  addLabel(axes.z.label, "cifar-cube__axis-title cifar-cube__axis-title--z", { x: 84.5, y: 91.5 });
  axes.y.values.forEach((value, index) => {
    const point = projectPoint(1, getCategoryCenter(index, axes.y.values.length), 0);
    addLabel(value, "cifar-cube__axis-value cifar-cube__axis-value--y", { x: point.x - 5, y: point.y });
  });
  axes.x.values.forEach((value, index) => {
    const x = 1 - getCategoryCenter(index, axes.x.values.length);
    const point = projectPoint(x, 0, 0);
    addLabel(value, "cifar-cube__axis-value cifar-cube__axis-value--x", { x: point.x - 4.5, y: point.y + 1.8 });
  });
  axes.z.values.forEach((value, index) => {
    const point = projectPoint(0, 0, getCategoryCenter(index, axes.z.values.length));
    addLabel(value, "cifar-cube__axis-value cifar-cube__axis-value--z", { x: point.x + 2.5, y: point.y + 1.7 });
  });
  return labels;
}

interface ProjectedCube {
  svg: SVGSVGElement;
  bounds: { left: number; top: number; width: number; height: number };
}

/**
 * Constructs a cube from projected 3D corners, giving every location its true perspective.
 * @param position - Validated axis indexes where x is spatial scale, y is Age, and z is Organ.
 * @param axes - Axis definitions used to normalize categorical indexes.
 * @param cubeScale - Relative cube size greater than zero and no larger than one.
 * @returns The decorative cube SVG and its exact percentage bounds.
 */
export function createProjectedCube(position: CifarCubePosition, axes: CifarCubeAxes, cubeScale = 1): ProjectedCube {
  const { corners, bounds } = getProjectedCubeGeometry(position, axes, cubeScale);
  const pointList = (...facePoints: Point[]) => facePoints.map((point) => `${point.x},${point.y}`).join(" ");
  const path = (...pathPoints: Point[]) => pathPoints
    .map((point, pointIndex) => `${pointIndex === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join("");
  const svg = createSvgElement("svg", {
    class: "cifar-cube__cube",
    viewBox: `${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`,
    preserveAspectRatio: "none",
    "aria-hidden": "true",
  });
  const topFace = [corners.topFront, corners.topLeft, corners.topBack, corners.topRight];
  const leftFace = [corners.topFront, corners.topLeft, corners.bottomLeft, corners.bottomFront];
  const rightFace = [corners.topFront, corners.topRight, corners.bottomRight, corners.bottomFront];
  svg.append(
    createSvgElement("polygon", { class: "cifar-cube__top", points: pointList(...topFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("polygon", { class: "cifar-cube__left", points: pointList(...leftFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("polygon", { class: "cifar-cube__right", points: pointList(...rightFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("path", {
      class: "cifar-cube__edge",
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
  return { svg, bounds };
}

/**
 * Creates the screen-reader equivalent of the decorative axis labels.
 * @param axes - Validated axis definitions and ordered values.
 * @returns Visually hidden text describing all axis categories.
 */
export function createAccessibleAxisSummary(axes: CifarCubeAxes) {
  const summary = document.createElement("p");
  summary.className = "cifar-cube__sr-only";
  summary.textContent = [axes.x, axes.y, axes.z].map((axis) => `${axis.label}: ${axis.values.join(", ")}`).join(". ");
  return summary;
}

/**
 * Summarizes one dataset's metadata, visualization position, and availability.
 * @param item - Dataset represented by a cube control.
 * @param axes - Axis definitions used to describe its plotted position.
 * @returns A concise accessible description for the dataset control.
 */
export function getAccessibleItemDescription(item: CifarCubeItem, axes: CifarCubeAxes) {
  const metadata = Object.entries(item.metadata ?? {})
    .filter((entry): entry is [string, string | number] => entry[1] !== null && entry[1] !== undefined)
    .map(([key, value]) => `${key}: ${value}`);
  const position = item.position;
  const axisEntries: Array<[CifarCubeAxis, number]> = position ? [
    [axes.x, position.x],
    [axes.y, position.y],
    [axes.z, position.z],
  ] : [];
  const axisPosition = axisEntries.map(([axis, index]) => `${axis.label}: ${axis.values[index] ?? "unknown"}`);
  const status = item.status ?? "available";
  const statusText = status === "current" ? "Current page" : status === "unavailable" ? "Metadata unavailable" : "Metadata available";
  const parts = [
    metadata.length > 0 ? metadata.join(", ") : "No dataset details provided",
    axisPosition.length > 0 ? `Visualization position: ${axisPosition.join(", ")}` : "Visualization position not provided",
    statusText,
  ];
  return `${parts.join(". ")}.`;
}

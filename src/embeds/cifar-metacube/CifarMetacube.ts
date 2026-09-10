import styles from "./cifar-metacube.css?inline";

export type CifarMetacubeItemStatus = "available" | "current" | "unavailable";
export interface CifarMetacubePosition { x: number; y: number; z: number; }
export interface CifarMetacubeAxis { label: string; values: string[]; }
export interface CifarMetacubeAxes { x: CifarMetacubeAxis; y: CifarMetacubeAxis; z: CifarMetacubeAxis; }
export interface CifarMetacubeItem {
  id: string;
  label: string;
  href: string;
  metadata?: Record<string, string | number | null | undefined>;
  position?: CifarMetacubePosition;
  status?: CifarMetacubeItemStatus;
}

export const ORGAN_DATASET_AXES: CifarMetacubeAxes = {
  x: { label: "Scale", values: ["100-microns", "10-centimeters"] },
  y: { label: "Age (years)", values: ["45", "63", "85", "~40–70", "4–5 months", "7–47"] },
  z: { label: "Organ", values: ["Thymus", "Heart", "Kidney", "Liver"] },
};

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
interface Point { x: number; y: number; }
interface NormalizedPosition { x: number; y: number; z: number; }

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

function createSvgElement<K extends keyof SVGElementTagNameMap>(tagName: K, attributes: Record<string, string>) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

/**
 * Places a categorical index at the center of its equal-width axis cell.
 * @param value - Zero-based category index.
 * @param count - Total categories on the axis.
 * @returns A normalized position between zero and one.
 */
function getCategoryCenter(value: number, count: number) {
  return count > 0 ? (value + 0.5) / count : 0.5;
}

/**
 * Projects two normalized horizontal axes onto one perspective plane.
 * @param plane - Four corners of the top or bottom plane.
 * @param x - Normalized Scale-axis position.
 * @param z - Normalized Organ-axis position.
 * @returns A percentage coordinate inside the component.
 */
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
 * Interpolates between the reference frame's bottom and top planes.
 * @param x - Normalized Scale-axis position.
 * @param y - Normalized Age-axis position.
 * @param z - Normalized Organ-axis position.
 * @returns A perspective-projected percentage coordinate.
 */
function projectPoint(x: number, y: number, z: number): Point {
  const top = interpolatePlane(FRAME_PLANES.top, x, z);
  const bottom = interpolatePlane(FRAME_PLANES.bottom, x, z);
  return {
    x: bottom.x + (top.x - bottom.x) * y,
    y: bottom.y + (top.y - bottom.y) * y,
  };
}

/**
 * Maps categorical axis indexes to the flat perspective coordinate system.
 * @param position - Axis indexes where x is Scale, y is Age, and z is Organ.
 * @param index - Item index used only when no explicit position is supplied.
 * @param axes - Axis definitions used to normalize categorical indexes.
 * @returns CSS-ready position, stacking, and tooltip placement values.
 */
function getNormalizedPosition(
  position: CifarMetacubePosition | undefined,
  index: number,
  axes: CifarMetacubeAxes,
): NormalizedPosition {
  const resolved = position ?? {
    x: index % Math.max(axes.x.values.length, 1),
    y: index % Math.max(axes.y.values.length, 1),
    z: index % Math.max(axes.z.values.length, 1),
  };
  // The first x category starts at the far-left end of the Scale axis.
  const x = 1 - getCategoryCenter(resolved.x, axes.x.values.length);
  const y = getCategoryCenter(resolved.y, axes.y.values.length);
  const z = getCategoryCenter(resolved.z, axes.z.values.length);
  return { x, y, z };
}

function getScenePosition(position: CifarMetacubePosition | undefined, index: number, axes: CifarMetacubeAxes) {
  const normalized = getNormalizedPosition(position, index, axes);
  const point = projectPoint(normalized.x, normalized.y, normalized.z);
  return {
    left: `${point.x}%`,
    top: `${point.y}%`,
    layer: `${Math.round(point.y * 10)}`,
    cardSide: point.x > 66 ? "left" : "right",
  };
}

/**
 * Creates the reference-style perspective bounding cube.
 * @returns A decorative SVG element with crisp, non-scaling frame lines.
 */
function createCoordinateFrame() {
  const svg = createSvgElement("svg", {
    class: "metacube__frame",
    viewBox: "0 0 1000 868",
    preserveAspectRatio: "xMidYMid meet",
    "aria-hidden": "true",
  });
  svg.append(createSvgElement("path", {
    class: "metacube__frame-line",
    d: "M573 5 152 103 573 276 995 103 573 5M152 103 224 586 573 861 925 586 995 103M573 276 573 861M573 5 573 405M224 586 573 405 925 586",
  }));
  return svg;
}

function createAxisLabels(axes: CifarMetacubeAxes) {
  const labels = document.createElement("div");
  labels.className = "metacube__axes";
  labels.setAttribute("aria-hidden", "true");
  const addLabel = (text: string, className: string, point: Point) => {
    const label = document.createElement("span");
    label.className = className;
    label.textContent = text;
    label.style.left = `${point.x}%`;
    label.style.top = `${point.y}%`;
    labels.append(label);
  };

  addLabel(axes.y.label, "metacube__axis-title metacube__axis-title--y", { x: 4.5, y: 7.5 });
  addLabel(axes.x.label, "metacube__axis-title metacube__axis-title--x", { x: 30, y: 89 });
  addLabel(axes.z.label, "metacube__axis-title metacube__axis-title--z", { x: 84.5, y: 91.5 });
  axes.y.values.forEach((value, index) => {
    const point = projectPoint(1, getCategoryCenter(index, axes.y.values.length), 0);
    addLabel(value, "metacube__axis-value metacube__axis-value--y", { x: point.x - 5, y: point.y });
  });
  axes.x.values.forEach((value, index) => {
    const x = 1 - getCategoryCenter(index, axes.x.values.length);
    const point = projectPoint(x, 0, 0);
    addLabel(value, "metacube__axis-value metacube__axis-value--x", { x: point.x - 4.5, y: point.y + 1.8 });
  });
  axes.z.values.forEach((value, index) => {
    const point = projectPoint(0, 0, getCategoryCenter(index, axes.z.values.length));
    addLabel(value, "metacube__axis-value metacube__axis-value--z", { x: point.x + 2.5, y: point.y + 1.7 });
  });
  return labels;
}

interface ProjectedCube {
  svg: SVGSVGElement;
  bounds: { left: number; top: number; width: number; height: number };
}

/**
 * Constructs a cube from projected 3D corners, giving every location its true perspective.
 * @param position - Axis indexes where x is Scale, y is Age, and z is Organ.
 * @param index - Item index used only when no explicit position is supplied.
 * @param axes - Axis definitions used to normalize categorical indexes.
 * @returns The decorative cube SVG and its exact percentage bounds.
 */
function createProjectedCube(
  position: CifarMetacubePosition | undefined,
  index: number,
  axes: CifarMetacubeAxes,
): ProjectedCube {
  const center = getNormalizedPosition(position, index, axes);
  const halfSize = 0.5 / Math.max(axes.x.values.length, axes.y.values.length, axes.z.values.length, 1);
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
  const pointList = (...facePoints: Point[]) => facePoints.map((point) => `${point.x},${point.y}`).join(" ");
  const path = (...pathPoints: Point[]) => pathPoints
    .map((point, pointIndex) => `${pointIndex === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join("");
  const svg = createSvgElement("svg", {
    class: "metacube__cube",
    viewBox: `${left} ${top} ${right - left} ${bottom - top}`,
    preserveAspectRatio: "none",
    "aria-hidden": "true",
  });
  const topFace = [corners.topFront, corners.topLeft, corners.topBack, corners.topRight];
  const leftFace = [corners.topFront, corners.topLeft, corners.bottomLeft, corners.bottomFront];
  const rightFace = [corners.topFront, corners.topRight, corners.bottomRight, corners.bottomFront];
  svg.append(
    createSvgElement("polygon", { class: "metacube__top", points: pointList(...topFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("polygon", { class: "metacube__left", points: pointList(...leftFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("polygon", { class: "metacube__right", points: pointList(...rightFace), "vector-effect": "non-scaling-stroke" }),
    createSvgElement("path", {
      class: "metacube__edge",
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
  return { svg, bounds: { left, top, width: right - left, height: bottom - top } };
}

/**
 * Creates the hover/focus card that also provides the native link's accessible name.
 * @param item - Dataset represented by the cube.
 * @returns A card element containing safely escaped text nodes.
 */
function createCard(item: CifarMetacubeItem) {
  const card = document.createElement("span");
  card.className = "metacube__card";
  const label = document.createElement("span");
  label.className = "metacube__label";
  label.textContent = item.label;
  card.append(label);
  const metadataEntries = Object.entries(item.metadata ?? {}).filter(
    (entry): entry is [string, string | number] => entry[1] !== null && entry[1] !== undefined,
  );
  if (metadataEntries.length > 0) {
    const metadata = document.createElement("dl");
    metadata.className = "metacube__metadata";
    metadataEntries.forEach(([key, value]) => {
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = key;
      description.textContent = String(value);
      metadata.append(term, description);
    });
    card.append(metadata);
  }
  if (item.status === "current" || item.status === "unavailable") {
    const status = document.createElement("span");
    status.className = "metacube__status";
    status.textContent = item.status === "current" ? "Current page" : "Unavailable";
    card.append(status);
  }
  return card;
}

function createAccessibleAxisSummary(axes: CifarMetacubeAxes) {
  const summary = document.createElement("p");
  summary.className = "metacube__sr-only";
  summary.textContent = [axes.x, axes.y, axes.z].map((axis) => `${axis.label}: ${axis.values.join(", ")}`).join(". ");
  return summary;
}

export class CifarMetacube extends HTMLElement {
  static observedAttributes = ["items", "axes", "label"];
  #items: CifarMetacubeItem[] = [];
  #axes: CifarMetacubeAxes = ORGAN_DATASET_AXES;
  #shadow = this.attachShadow({ mode: "open" });

  get items() { return this.#items; }
  set items(value: CifarMetacubeItem[]) {
    this.#items = Array.isArray(value) ? value : [];
    this.#render();
  }
  get axes() { return this.#axes; }
  set axes(value: CifarMetacubeAxes) {
    this.#axes = value ?? ORGAN_DATASET_AXES;
    this.#render();
  }
  connectedCallback() {
    this.#readJsonAttributes();
    this.#render();
  }
  attributeChangedCallback() {
    this.#readJsonAttributes();
    if (this.isConnected) this.#render();
  }

  #readJsonAttributes() {
    const parseAttribute = <T,>(name: string): T | undefined => {
      const serializedValue = this.getAttribute(name);
      if (!serializedValue) return undefined;
      try { return JSON.parse(serializedValue) as T; } catch { return undefined; }
    };
    const parsedItems = parseAttribute<unknown>("items");
    if (Array.isArray(parsedItems)) this.#items = parsedItems as CifarMetacubeItem[];
    const parsedAxes = parseAttribute<CifarMetacubeAxes>("axes");
    if (parsedAxes?.x && parsedAxes?.y && parsedAxes?.z) this.#axes = parsedAxes;
  }

  #render() {
    const style = document.createElement("style");
    style.textContent = styles;
    const section = document.createElement("section");
    section.className = "metacube";
    section.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets");
    section.append(createCoordinateFrame(), createAxisLabels(this.#axes), createAccessibleAxisSummary(this.#axes));
    if (this.#items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "metacube__empty";
      empty.textContent = "No datasets are available.";
      section.append(empty);
      this.#shadow.replaceChildren(style, section);
      return;
    }

    const list = document.createElement("ul");
    list.className = "metacube__list";
    this.#items.forEach((item, index) => {
      const status = item.status ?? "available";
      const position = getScenePosition(item.position, index, this.#axes);
      const cube = createProjectedCube(item.position, index, this.#axes);
      const listItem = document.createElement("li");
      listItem.className = `metacube__item metacube__item--${status} metacube__item--card-${position.cardSide}`;
      listItem.style.setProperty("--cube-left", `${cube.bounds.left}%`);
      listItem.style.setProperty("--cube-top", `${cube.bounds.top}%`);
      listItem.style.setProperty("--cube-width", `${cube.bounds.width}%`);
      listItem.style.setProperty("--cube-height", `${cube.bounds.height}%`);
      listItem.style.setProperty("--cube-layer", position.layer);
      const content = status === "unavailable" ? document.createElement("div") : document.createElement("a");
      content.className = status === "unavailable" ? "metacube__unavailable" : "metacube__link";
      if (content instanceof HTMLAnchorElement) {
        content.href = item.href;
        if (status === "current") content.setAttribute("aria-current", "page");
      }
      content.append(cube.svg, createCard(item));
      listItem.append(content);
      list.append(listItem);
    });
    section.append(list);
    this.#shadow.replaceChildren(style, section);
  }
}

export function defineCifarMetacube() {
  if (!customElements.get("cifar-metacube")) customElements.define("cifar-metacube", CifarMetacube);
}

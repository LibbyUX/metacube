import styles from "./cifar-cube.css?inline";
import { createCompactCard, createDetails, createPreviewCard, updateDetails } from "./cifar-cube-cards";

export type CifarCubeItemStatus = "available" | "current" | "unavailable";
export interface CifarCubePosition { x: number; y: number; z: number; }
export interface CifarCubeAxis { label: string; values: string[]; }
export interface CifarCubeAxes { x: CifarCubeAxis; y: CifarCubeAxis; z: CifarCubeAxis; }
export interface CifarCubeItem {
  id: string;
  label: string;
  href?: string;
  metadata?: Record<string, string | number | null | undefined>;
  position?: CifarCubePosition;
  status?: CifarCubeItemStatus;
}

export interface CifarCubeSelectionDetail {
  item: CifarCubeItem;
}

export const CIFAR_CUBE_SELECTION_EVENT = "cifar-cube-selection-change";

const EMPTY_AXES: CifarCubeAxes = {
  x: { label: "X axis", values: [] },
  y: { label: "Y axis", values: [] },
  z: { label: "Z axis", values: [] },
};

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const HTMLElementBase = (
  typeof HTMLElement === "undefined" ? class {} : HTMLElement
) as typeof HTMLElement;
interface Point { x: number; y: number; }
interface NormalizedPosition { x: number; y: number; z: number; }
let instanceCount = 0;

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
 * @param x - Normalized spatial-scale-axis position.
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
 * @param x - Normalized spatial-scale-axis position.
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
 * @param position - Axis indexes where x is spatial scale, y is Age, and z is Organ.
 * @param index - Item index used only when no explicit position is supplied.
 * @param axes - Axis definitions used to normalize categorical indexes.
 * @returns CSS-ready position, stacking, and tooltip placement values.
 */
function getNormalizedPosition(
  position: CifarCubePosition | undefined,
  index: number,
  axes: CifarCubeAxes,
): NormalizedPosition {
  const resolved = position ?? {
    x: index % Math.max(axes.x.values.length, 1),
    y: index % Math.max(axes.y.values.length, 1),
    z: index % Math.max(axes.z.values.length, 1),
  };
  // The first x category starts at the far-left end of the spatial scale axis.
  const x = 1 - getCategoryCenter(resolved.x, axes.x.values.length);
  const y = getCategoryCenter(resolved.y, axes.y.values.length);
  const z = getCategoryCenter(resolved.z, axes.z.values.length);
  return { x, y, z };
}

function getScenePosition(position: CifarCubePosition | undefined, index: number, axes: CifarCubeAxes) {
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

function createAxisLabels(axes: CifarCubeAxes) {
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
 * @param position - Axis indexes where x is spatial scale, y is Age, and z is Organ.
 * @param index - Item index used only when no explicit position is supplied.
 * @param axes - Axis definitions used to normalize categorical indexes.
 * @returns The decorative cube SVG and its exact percentage bounds.
 */
function createProjectedCube(
  position: CifarCubePosition | undefined,
  index: number,
  axes: CifarCubeAxes,
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
    class: "cifar-cube__cube",
    viewBox: `${left} ${top} ${right - left} ${bottom - top}`,
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
  return { svg, bounds: { left, top, width: right - left, height: bottom - top } };
}

function createAccessibleAxisSummary(axes: CifarCubeAxes) {
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
function getAccessibleItemDescription(item: CifarCubeItem, axes: CifarCubeAxes) {
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

export class CifarCube extends HTMLElementBase {
  static observedAttributes = ["items", "axes", "label"];
  #items: CifarCubeItem[] = [];
  #axes: CifarCubeAxes = EMPTY_AXES;
  #selectedId: string | null = null;
  #shadow = this.attachShadow({ mode: "open" });
  #instanceId = `cifar-cube-${++instanceCount}`;
  #section: HTMLElement | null = null;
  #details: HTMLElement | null = null;
  #plot: HTMLElement | null = null;
  #detailsId = `${this.#instanceId}-details`;
  #detailsHeadingId = `${this.#instanceId}-details-heading`;

  get items() { return this.#items; }
  set items(value: CifarCubeItem[]) {
    this.#items = Array.isArray(value) ? value : [];
    if (!this.#items.some((item) => item.id === this.#selectedId)) this.#selectedId = null;
    this.#render();
  }
  get axes() { return this.#axes; }
  set axes(value: CifarCubeAxes) {
    this.#axes = value ?? EMPTY_AXES;
    this.#render();
  }
  get selectedId() { return this.#selectedId; }
  set selectedId(value: string | null) {
    this.#selectedId = this.#items.some((item) => item.id === value) ? value : null;
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
    if (Array.isArray(parsedItems)) this.#items = parsedItems as CifarCubeItem[];
    const parsedAxes = parseAttribute<CifarCubeAxes>("axes");
    if (parsedAxes?.x && parsedAxes?.y && parsedAxes?.z) this.#axes = parsedAxes;
  }

  #selectItem(item: CifarCubeItem, moveFocusToAction: boolean) {
    this.#selectedId = item.id;
    this.#updateSelection();
    if (this.#details) updateDetails(this.#details, item, this.#detailsHeadingId);
    if (moveFocusToAction) {
      this.#details?.querySelector<HTMLAnchorElement>(".cifar-cube__details-action")?.focus();
    }
    this.dispatchEvent(new CustomEvent<CifarCubeSelectionDetail>(CIFAR_CUBE_SELECTION_EVENT, {
      bubbles: true,
      composed: true,
      detail: { item },
    }));
  }

  #createStructure() {
    const style = document.createElement("style");
    style.textContent = styles;
    const section = document.createElement("section");
    section.className = "cifar-cube";
    const compactIntro = document.createElement("header");
    compactIntro.className = "cifar-cube__compact-intro";
    const compactEyebrow = document.createElement("p");
    compactEyebrow.className = "cifar-cube__compact-eyebrow";
    compactEyebrow.textContent = "Organ imaging datasets";
    const compactHeading = document.createElement("h2");
    compactHeading.className = "cifar-cube__compact-section-heading";
    compactHeading.textContent = "Browse human organ imaging datasets";
    const compactDescription = document.createElement("p");
    compactDescription.className = "cifar-cube__compact-description";
    compactDescription.textContent = "Compare datasets across spatial scale, age, and organ, then open the metadata you need.";
    compactIntro.append(compactEyebrow, compactHeading, compactDescription);
    const stage = document.createElement("div");
    stage.className = "cifar-cube__stage";
    const plot = document.createElement("div");
    plot.className = "cifar-cube__plot";
    stage.append(plot);
    const details = createDetails(this.#detailsId, this.#detailsHeadingId);
    section.append(compactIntro, stage, details);
    this.#shadow.replaceChildren(style, section);
    this.#section = section;
    this.#details = details;
    this.#plot = plot;
  }

  #updateSelection() {
    const selectedItem = this.#items.find((item) => item.id === this.#selectedId) ?? null;
    this.#section?.classList.toggle("cifar-cube--has-selection", Boolean(selectedItem));
    this.#shadow.querySelectorAll<HTMLElement>(".cifar-cube__item").forEach((listItem) => {
      const button = listItem.querySelector<HTMLButtonElement>(".cifar-cube__select");
      const selected = button?.dataset.itemId === selectedItem?.id;
      listItem.classList.toggle("cifar-cube__item--selected", selected);
      button?.setAttribute("aria-pressed", String(selected));
    });
  }

  #render() {
    if (!this.#section || !this.#details || !this.#plot) this.#createStructure();
    if (!this.#section || !this.#details || !this.#plot) return;

    this.#section.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets");
    this.#plot.replaceChildren(createCoordinateFrame(), createAxisLabels(this.#axes), createAccessibleAxisSummary(this.#axes));
    const selectedItem = this.#items.find((item) => item.id === this.#selectedId) ?? null;
    this.#section.classList.toggle("cifar-cube--has-selection", Boolean(selectedItem));
    updateDetails(this.#details, selectedItem, this.#detailsHeadingId);
    if (this.#items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "cifar-cube__empty";
      empty.textContent = "No datasets are available.";
      this.#plot.append(empty);
      return;
    }

    const list = document.createElement("ul");
    list.className = "cifar-cube__list";
    this.#items.forEach((item, index) => {
      const status = item.status ?? "available";
      const selected = item.id === this.#selectedId;
      const position = getScenePosition(item.position, index, this.#axes);
      const cube = createProjectedCube(item.position, index, this.#axes);
      const listItem = document.createElement("li");
      listItem.className = `cifar-cube__item cifar-cube__item--${status} cifar-cube__item--card-${position.cardSide}`;
      if (selected) listItem.classList.add("cifar-cube__item--selected");
      listItem.style.setProperty("--cube-left", `${cube.bounds.left}%`);
      listItem.style.setProperty("--cube-top", `${cube.bounds.top}%`);
      listItem.style.setProperty("--cube-width", `${cube.bounds.width}%`);
      listItem.style.setProperty("--cube-height", `${cube.bounds.height}%`);
      listItem.style.setProperty("--cube-layer", position.layer);
      const button = document.createElement("button");
      button.className = "cifar-cube__select";
      button.type = "button";
      button.dataset.itemId = item.id;
      button.setAttribute("aria-label", `Select ${item.label}`);
      const description = document.createElement("span");
      description.className = "cifar-cube__sr-only";
      description.id = `${this.#instanceId}-item-${index}-description`;
      description.textContent = getAccessibleItemDescription(item, this.#axes);
      button.setAttribute("aria-describedby", description.id);
      button.setAttribute("aria-controls", this.#detailsId);
      button.setAttribute("aria-pressed", String(selected));
      button.append(cube.svg, createPreviewCard(item));
      button.addEventListener("click", (event) => this.#selectItem(item, event.detail === 0));
      listItem.append(description, button, createCompactCard(item));
      list.append(listItem);
    });
    this.#plot.append(list);
  }
}

export function defineCifarCube() {
  if (typeof customElements === "undefined") return;
  if (!customElements.get("cifar-cube")) customElements.define("cifar-cube", CifarCube);
}

import styles from "./cifar-cube.css?inline";
import { createCompactCard, createDetails, createPreviewCard, updateDetails } from "./cifar-cube-cards";
import { getCategoryCenter, getProjectedCubeGeometry, getScenePosition, projectPoint, type Point } from "./projection";
import type {
  CifarCubeAxes,
  CifarCubeAxis,
  CifarCubeItem,
  CifarCubePosition,
  CifarCubeSelectionDetail,
  CifarCubeValidationDetail,
  CifarCubeValidationIssue,
} from "./types";
import { EMPTY_AXES, validateAxes, validateItems } from "./validation";

export type {
  CifarCubeAxes,
  CifarCubeAxis,
  CifarCubeItem,
  CifarCubeItemStatus,
  CifarCubePosition,
  CifarCubeSelectionDetail,
  CifarCubeValidationDetail,
  CifarCubeValidationIssue,
  CifarCubeValidationSeverity,
} from "./types";

export const CIFAR_CUBE_SELECTION_EVENT = "cifar-cube-selection-change";
export const CIFAR_CUBE_VALIDATION_EVENT = "cifar-cube-validation";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const HTMLElementBase = (
  typeof HTMLElement === "undefined" ? class {} : HTMLElement
) as typeof HTMLElement;
let instanceCount = 0;

function createSvgElement<K extends keyof SVGElementTagNameMap>(tagName: K, attributes: Record<string, string>) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
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
 * @param position - Validated axis indexes where x is spatial scale, y is Age, and z is Organ.
 * @param axes - Axis definitions used to normalize categorical indexes.
 * @returns The decorative cube SVG and its exact percentage bounds.
 */
function createProjectedCube(position: CifarCubePosition, axes: CifarCubeAxes): ProjectedCube {
  const { corners, bounds } = getProjectedCubeGeometry(position, axes);
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
  #sourceItems: unknown = [];
  #items: CifarCubeItem[] = [];
  #axes: CifarCubeAxes = EMPTY_AXES;
  #axisIssues: CifarCubeValidationIssue[] = [];
  #itemIssues: CifarCubeValidationIssue[] = [];
  #attributeIssues: CifarCubeValidationIssue[] = [];
  #selectedId: string | null = null;
  #shadow = this.attachShadow({ mode: "open" });
  #instanceId = `cifar-cube-${++instanceCount}`;
  #section: HTMLElement | null = null;
  #details: HTMLElement | null = null;
  #stage: HTMLElement | null = null;
  #plot: HTMLElement | null = null;
  #detailsId = `${this.#instanceId}-details`;
  #detailsHeadingId = `${this.#instanceId}-details-heading`;

  get items() { return this.#items; }
  set items(value: CifarCubeItem[]) {
    this.#sourceItems = value;
    this.#applyItems();
    this.#render();
    this.#reportValidation();
  }
  get axes() { return this.#axes; }
  set axes(value: CifarCubeAxes) {
    this.#applyAxes(value);
    this.#render();
    this.#reportValidation();
  }
  get validationIssues() { return [...this.#attributeIssues, ...this.#axisIssues, ...this.#itemIssues]; }
  get selectedId() { return this.#selectedId; }
  set selectedId(value: string | null) {
    this.#selectedId = this.#items.some((item) => item.id === value) ? value : null;
    this.#render();
  }
  connectedCallback() {
    this.#readJsonAttribute("axes", false);
    this.#readJsonAttribute("items", false);
    this.#render();
    this.#reportValidation();
  }
  attributeChangedCallback(name: string) {
    if (name !== "label") this.#readJsonAttribute(name as "axes" | "items", true);
    if (this.isConnected) {
      this.#render();
      this.#reportValidation();
    }
  }

  #applyItems() {
    const result = validateItems(this.#sourceItems, this.#axes);
    this.#items = result.value;
    this.#itemIssues = result.issues;
    if (!this.#items.some((item) => item.id === this.#selectedId)) this.#selectedId = null;
  }

  #applyAxes(value: unknown) {
    const result = validateAxes(value);
    this.#axes = result.value;
    this.#axisIssues = result.issues;
    this.#applyItems();
  }

  #readJsonAttribute(name: "axes" | "items", clearWhenMissing: boolean) {
    this.#attributeIssues = this.#attributeIssues.filter((validationIssue) => validationIssue.path !== name);
    const serializedValue = this.getAttribute(name);
    if (serializedValue === null) {
      if (clearWhenMissing) {
        if (name === "axes") this.#applyAxes(EMPTY_AXES);
        else {
          this.#sourceItems = [];
          this.#applyItems();
        }
      }
      return;
    }

    let value: unknown;
    try { value = JSON.parse(serializedValue) as unknown; } catch {
      this.#attributeIssues.push({
        code: `${name}.json.invalid`,
        message: `${name} contains invalid JSON.`,
        path: name,
        severity: "error",
      });
    }
    if (name === "axes") this.#applyAxes(value);
    else {
      this.#sourceItems = value;
      this.#applyItems();
    }
  }

  #reportValidation() {
    if (!this.isConnected) return;
    this.dispatchEvent(new CustomEvent<CifarCubeValidationDetail>(CIFAR_CUBE_VALIDATION_EVENT, {
      bubbles: true,
      composed: true,
      detail: { issues: this.validationIssues },
    }));
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
    compactDescription.textContent = "Review key details, then open the full metadata.";
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
    this.#stage = stage;
    this.#plot = plot;
  }

  #updateSelection() {
    const selectedItem = this.#items.find((item) => item.id === this.#selectedId) ?? null;
    this.#section?.classList.toggle("cifar-cube--has-selection", Boolean(selectedItem));
    this.#shadow.querySelectorAll<HTMLButtonElement>("[data-item-id]").forEach((button) => {
      const selected = button.dataset.itemId === selectedItem?.id;
      button.closest("li")?.classList.toggle("cifar-cube__item--selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  #configureSelectionButton(button: HTMLButtonElement, item: CifarCubeItem, descriptionId: string) {
    button.type = "button";
    button.dataset.itemId = item.id;
    button.setAttribute("aria-label", `Select ${item.label}`);
    button.setAttribute("aria-describedby", descriptionId);
    button.setAttribute("aria-controls", this.#detailsId);
    button.setAttribute("aria-pressed", String(item.id === this.#selectedId));
    button.addEventListener("click", (event) => this.#selectItem(item, event.detail === 0));
  }

  #createUnpositionedList(items: CifarCubeItem[], itemIndexes: Map<string, number>) {
    const region = document.createElement("section");
    region.className = "cifar-cube__unpositioned";
    const heading = document.createElement("h2");
    heading.className = "cifar-cube__unpositioned-heading";
    heading.textContent = "Not plotted";
    const guidance = document.createElement("p");
    guidance.className = "cifar-cube__unpositioned-guidance";
    guidance.textContent = "These datasets do not include usable visualization coordinates.";
    const list = document.createElement("ul");
    list.className = "cifar-cube__unpositioned-list";
    items.forEach((item) => {
      const index = itemIndexes.get(item.id) ?? 0;
      const listItem = document.createElement("li");
      listItem.className = "cifar-cube__unpositioned-item";
      if (item.id === this.#selectedId) listItem.classList.add("cifar-cube__item--selected");
      const description = document.createElement("span");
      description.className = "cifar-cube__sr-only";
      description.id = `${this.#instanceId}-unpositioned-${index}-description`;
      description.textContent = getAccessibleItemDescription(item, this.#axes);
      const button = document.createElement("button");
      button.className = "cifar-cube__unpositioned-button";
      button.textContent = item.label;
      this.#configureSelectionButton(button, item, description.id);
      listItem.append(description, button);
      list.append(listItem);
    });
    region.append(heading, guidance, list);
    return region;
  }

  #render() {
    if (!this.#section || !this.#details || !this.#stage || !this.#plot) this.#createStructure();
    if (!this.#section || !this.#details || !this.#stage || !this.#plot) return;

    this.#section.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets");
    this.#stage.querySelector(".cifar-cube__unpositioned")?.remove();
    const axesCanBePlotted = this.#axes.x.values.length > 0 && this.#axes.y.values.length > 0 && this.#axes.z.values.length > 0;
    if (axesCanBePlotted) {
      this.#plot.replaceChildren(createCoordinateFrame(), createAxisLabels(this.#axes), createAccessibleAxisSummary(this.#axes));
    } else {
      const unavailable = document.createElement("p");
      unavailable.className = "cifar-cube__plot-unavailable";
      unavailable.textContent = "Visualization unavailable because the axis data is incomplete.";
      this.#plot.replaceChildren(unavailable);
    }
    const selectedItem = this.#items.find((item) => item.id === this.#selectedId) ?? null;
    this.#section.classList.toggle("cifar-cube--has-selection", Boolean(selectedItem));
    updateDetails(this.#details, selectedItem, this.#detailsHeadingId);
    if (this.#items.length === 0) {
      if (axesCanBePlotted) {
        const empty = document.createElement("p");
        empty.className = "cifar-cube__empty";
        empty.textContent = "No datasets are available.";
        this.#plot.append(empty);
      }
      return;
    }

    const list = document.createElement("ul");
    list.className = "cifar-cube__list";
    const itemIndexes = new Map(this.#items.map((item, index) => [item.id, index]));
    this.#items.forEach((item, index) => {
      const status = item.status ?? "available";
      const selected = item.id === this.#selectedId;
      const listItem = document.createElement("li");
      listItem.className = `cifar-cube__item cifar-cube__item--${status}`;
      if (selected) listItem.classList.add("cifar-cube__item--selected");
      if (!item.position) {
        listItem.classList.add("cifar-cube__item--unpositioned");
        listItem.append(createCompactCard(item));
        list.append(listItem);
        return;
      }

      const position = getScenePosition(item.position, this.#axes);
      const cube = createProjectedCube(item.position, this.#axes);
      listItem.classList.add(`cifar-cube__item--card-${position.cardSide}`);
      listItem.style.setProperty("--cube-left", `${cube.bounds.left}%`);
      listItem.style.setProperty("--cube-top", `${cube.bounds.top}%`);
      listItem.style.setProperty("--cube-width", `${cube.bounds.width}%`);
      listItem.style.setProperty("--cube-height", `${cube.bounds.height}%`);
      listItem.style.setProperty("--cube-layer", position.layer);
      const button = document.createElement("button");
      button.className = "cifar-cube__select";
      const description = document.createElement("span");
      description.className = "cifar-cube__sr-only";
      description.id = `${this.#instanceId}-item-${index}-description`;
      description.textContent = getAccessibleItemDescription(item, this.#axes);
      this.#configureSelectionButton(button, item, description.id);
      button.append(cube.svg, createPreviewCard(item));
      listItem.append(description, button, createCompactCard(item));
      list.append(listItem);
    });
    this.#plot.append(list);
    const unpositionedItems = this.#items.filter((item) => !item.position);
    if (unpositionedItems.length > 0) this.#stage.append(this.#createUnpositionedList(unpositionedItems, itemIndexes));
  }
}

export function defineCifarCube() {
  if (typeof customElements === "undefined") return;
  if (!customElements.get("cifar-cube")) customElements.define("cifar-cube", CifarCube);
}

import styles from "./cifar-cube.css?inline";
import dataStyles from "./cifar-cube-data.css?inline";
import { createCompactCard, createDetails, createIntro, createPreviewCard, getAccessibleDatasetName, updateDetails } from "./cifar-cube-cards";
import {
  createAccessibleAxisSummary,
  createAxisLabels,
  createCoordinateFrame,
  createProjectedCube,
  getAccessibleItemDescription,
} from "./cifar-cube-visualization";
import { DetailsTransition } from "./details-transition";
import { getScenePosition } from "./projection";
import type {
  CifarCubeAxes,
  CifarCubeItem,
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

declare global {
  interface HTMLElementTagNameMap {
    "cifar-cube": CifarCube;
  }

  interface GlobalEventHandlersEventMap {
    "cifar-cube-selection-change": CustomEvent<CifarCubeSelectionDetail>;
    "cifar-cube-validation": CustomEvent<CifarCubeValidationDetail>;
  }
}

const HTMLElementBase = (
  typeof HTMLElement === "undefined" ? class {} : HTMLElement
) as typeof HTMLElement;
let instanceCount = 0;

/** Accessible, responsive dataset preview custom element. */
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
  #updateScheduled = false;
  #validationPending = false;
  #detailsTransition = new DetailsTransition();

  /** Normalized datasets currently available to the component. */
  get items() { return this.#items; }
  set items(value: CifarCubeItem[]) {
    this.#sourceItems = value;
    this.#applyItems();
    this.#scheduleUpdate(true);
  }
  /** Normalized categorical axes used by the desktop visualization. */
  get axes() { return this.#axes; }
  set axes(value: CifarCubeAxes) {
    this.#applyAxes(value);
    this.#scheduleUpdate(true);
  }
  /** Current configuration errors and warnings. */
  get validationIssues() { return [...this.#attributeIssues, ...this.#axisIssues, ...this.#itemIssues]; }
  /** ID selected in the desktop visualization, or null. */
  get selectedId() { return this.#selectedId; }
  set selectedId(value: string | null) {
    this.#selectedId = this.#items.some((item) => item.id === value) ? value : null;
    this.#scheduleUpdate(false);
  }
  connectedCallback() {
    this.#readJsonAttribute("axes", false);
    this.#readJsonAttribute("items", false);
    this.#scheduleUpdate(true);
  }
  disconnectedCallback() {
    this.#detailsTransition.cancel();
  }
  attributeChangedCallback(name: string) {
    if (name !== "label") this.#readJsonAttribute(name as "axes" | "items", true);
    this.#scheduleUpdate(name !== "label");
  }

  /**
   * Coalesces synchronous property and attribute changes into one render and validation event.
   * @param reportValidation - Whether this update changes component configuration.
   * @returns Nothing.
   */
  #scheduleUpdate(reportValidation: boolean) {
    this.#validationPending ||= reportValidation;
    if (this.#updateScheduled) return;
    this.#updateScheduled = true;
    queueMicrotask(() => {
      this.#updateScheduled = false;
      if (!this.isConnected) return;
      this.#render();
      if (this.#validationPending) this.#reportValidation();
      this.#validationPending = false;
    });
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

  /**
   * Applies a desktop selection and coordinates focus, animation, and the public event.
   * @param item - Validated dataset selected by the user.
   * @param moveFocusToAction - Whether keyboard activation should focus the resulting metadata link.
   * @returns Nothing.
   */
  #selectItem(item: CifarCubeItem, moveFocusToAction: boolean) {
    const selectionChanged = this.#selectedId !== item.id;
    this.#selectedId = item.id;
    this.#updateSelection();
    if (selectionChanged && this.#details) {
      this.#detailsTransition.run(this.#details, () => {
        if (!this.#details) return;
        updateDetails(this.#details, item, this.#detailsHeadingId, () => this.#closeDetails());
        if (moveFocusToAction) {
          this.#details.querySelector<HTMLAnchorElement>(".cifar-cube__details-action")?.focus();
        }
      });
    } else if (moveFocusToAction) {
      this.#details?.querySelector<HTMLAnchorElement>(".cifar-cube__details-action")?.focus();
    }
    this.dispatchEvent(new CustomEvent<CifarCubeSelectionDetail>(CIFAR_CUBE_SELECTION_EVENT, {
      bubbles: true,
      composed: true,
      detail: { item },
    }));
  }

  /**
   * Clears the desktop selection, restores the dimension key, and returns focus to its cube.
   * @returns Nothing.
   */
  #closeDetails() {
    const selectedId = this.#selectedId;
    if (!selectedId || !this.#details) return;
    const selectedButton = [...this.#shadow.querySelectorAll<HTMLButtonElement>("[data-item-id]")]
      .find((button) => button.dataset.itemId === selectedId);
    this.#detailsTransition.cancel();
    this.#selectedId = null;
    this.#updateSelection();
    updateDetails(this.#details, null, this.#detailsHeadingId, () => this.#closeDetails());
    selectedButton?.focus();
    this.dispatchEvent(new CustomEvent<CifarCubeSelectionDetail>(CIFAR_CUBE_SELECTION_EVENT, {
      bubbles: true,
      composed: true,
      detail: { item: null },
    }));
  }

  /**
   * Creates the stable Shadow DOM regions that survive incremental selection updates.
   * @returns Nothing.
   */
  #createStructure() {
    const style = document.createElement("style");
    style.textContent = `${styles}\n${dataStyles}`;
    const section = document.createElement("section");
    section.className = "cifar-cube";
    const content = document.createElement("div");
    content.className = "cifar-cube__content";
    const details = createDetails(this.#detailsId);
    content.append(createIntro(details));
    const stage = document.createElement("div");
    stage.className = "cifar-cube__stage";
    const plot = document.createElement("div");
    plot.className = "cifar-cube__plot";
    stage.append(plot);
    section.append(content, stage);
    this.#shadow.replaceChildren(style, section);
    this.#section = section;
    this.#details = details;
    this.#stage = stage;
    this.#plot = plot;
  }

  /**
   * Synchronizes cube controls and visual selection classes without rebuilding the scene.
   * @returns Nothing.
   */
  #updateSelection() {
    const selectedItem = this.#items.find((item) => item.id === this.#selectedId) ?? null;
    this.#section?.classList.toggle("cifar-cube--has-selection", Boolean(selectedItem));
    this.#shadow.querySelectorAll<HTMLButtonElement>("[data-item-id]").forEach((button) => {
      const selected = button.dataset.itemId === selectedItem?.id;
      button.closest("li")?.classList.toggle("cifar-cube__item--selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  /**
   * Adds the shared accessible state and interaction behavior to a dataset control.
   * @param button - Native button associated with a dataset.
   * @param item - Validated dataset controlled by the button.
   * @param descriptionId - ID of the button's accessible dataset description.
   * @returns Nothing.
   */
  #configureSelectionButton(button: HTMLButtonElement, item: CifarCubeItem, descriptionId: string) {
    button.type = "button";
    button.dataset.itemId = item.id;
    button.setAttribute("aria-label", `Select ${getAccessibleDatasetName(item)}`);
    button.setAttribute("aria-describedby", descriptionId);
    button.setAttribute("aria-controls", this.#detailsId);
    button.setAttribute("aria-pressed", String(item.id === this.#selectedId));
    button.addEventListener("click", (event) => this.#selectItem(item, event.detail === 0));
  }

  /**
   * Creates the desktop fallback for datasets without usable plot coordinates.
   * @param items - Validated datasets that cannot be positioned on the cube.
   * @param itemIndexes - Stable source indexes used to generate unique description IDs.
   * @returns A selectable fallback region for unpositioned datasets.
   */
  #createUnpositionedList(items: CifarCubeItem[], itemIndexes: Map<string, number>) {
    const region = document.createElement("section");
    region.className = "cifar-cube__unpositioned";
    const heading = document.createElement("h3");
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

  /**
   * Reconciles validated data with the stable component structure.
   * @returns Nothing.
   */
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
    this.#detailsTransition.cancel();
    updateDetails(this.#details, selectedItem, this.#detailsHeadingId, () => this.#closeDetails());
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
      const cube = createProjectedCube(item.position, this.#axes, item.cubeScale);
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

/**
 * Registers the `cifar-cube` custom element once when the Custom Elements API is available.
 * @returns Nothing.
 */
export function defineCifarCube() {
  if (typeof customElements === "undefined") return;
  if (!customElements.get("cifar-cube")) customElements.define("cifar-cube", CifarCube);
}

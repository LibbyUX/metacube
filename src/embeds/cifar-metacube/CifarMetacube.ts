import styles from "./cifar-metacube.css?inline";

export type CifarMetacubeItemStatus = "available" | "current" | "unavailable";

export interface CifarMetacubePosition {
  x: number;
  y: number;
  z?: number;
}

export interface CifarMetacubeItem {
  id: string;
  label: string;
  href: string;
  metadata?: Record<string, string | number | null | undefined>;
  position?: CifarMetacubePosition;
  status?: CifarMetacubeItemStatus;
}

const DEFAULT_POSITION_COLUMNS = 4;

/**
 * Converts an item position into percentages within the desktop isometric scene.
 * @param position - Optional isometric grid coordinates.
 * @param index - Item index used to create a fallback grid position.
 * @returns CSS-ready position and stacking values.
 */
function getScenePosition(position: CifarMetacubePosition | undefined, index: number) {
  const fallbackX = index % DEFAULT_POSITION_COLUMNS;
  const fallbackY = Math.floor(index / DEFAULT_POSITION_COLUMNS);
  const x = position?.x ?? fallbackX;
  const y = position?.y ?? fallbackY;
  const z = position?.z ?? 0;

  return {
    left: `${50 + (x - y) * 12}%`,
    top: `${23 + (x + y) * 10 - z * 10}%`,
    layer: `${100 + x + y + z}`,
  };
}

/**
 * Creates the decorative isometric cube used inside each semantic link.
 * @returns An SVG element hidden from assistive technology.
 */
function createCubeSvg() {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  svg.setAttribute("class", "metacube__cube");
  svg.setAttribute("viewBox", "0 0 120 112");
  svg.setAttribute("aria-hidden", "true");

  const faces = [
    ["polygon", "metacube__top", "60,4 114,31 60,58 6,31"],
    ["polygon", "metacube__left", "6,31 60,58 60,108 6,81"],
    ["polygon", "metacube__right", "60,58 114,31 114,81 60,108"],
    ["path", "metacube__edge", "M6 31 60 108 114 31M6 81 60 4 114 81"],
  ] as const;

  faces.forEach(([tagName, className, geometry]) => {
    const face = document.createElementNS(namespace, tagName);
    face.setAttribute("class", className);
    face.setAttribute(tagName === "path" ? "d" : "points", geometry);
    face.setAttribute("vector-effect", "non-scaling-stroke");
    svg.append(face);
  });

  return svg;
}

/**
 * Creates the visible label and metadata card for one cube.
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

export class CifarMetacube extends HTMLElement {
  static observedAttributes = ["items", "label"];

  #items: CifarMetacubeItem[] = [];
  #shadow = this.attachShadow({ mode: "open" });

  get items() {
    return this.#items;
  }

  set items(value: CifarMetacubeItem[]) {
    this.#items = Array.isArray(value) ? value : [];
    this.#render();
  }

  connectedCallback() {
    this.#readItemsAttribute();
    this.#render();
  }

  attributeChangedCallback(name: string) {
    if (name === "items") this.#readItemsAttribute();
    if (this.isConnected) this.#render();
  }

  #readItemsAttribute() {
    const serializedItems = this.getAttribute("items");
    if (!serializedItems) return;

    try {
      const parsedItems: unknown = JSON.parse(serializedItems);
      this.#items = Array.isArray(parsedItems) ? parsedItems as CifarMetacubeItem[] : [];
    } catch {
      this.#items = [];
    }
  }

  #render() {
    const style = document.createElement("style");
    style.textContent = styles;

    const section = document.createElement("section");
    section.className = "metacube";
    section.setAttribute("aria-label", this.getAttribute("label") ?? "Metadata datasets");

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
      const position = getScenePosition(item.position, index);
      const listItem = document.createElement("li");
      listItem.className = `metacube__item metacube__item--${status}`;
      listItem.style.setProperty("--cube-left", position.left);
      listItem.style.setProperty("--cube-top", position.top);
      listItem.style.setProperty("--cube-layer", position.layer);

      const content = status === "unavailable"
        ? document.createElement("div")
        : document.createElement("a");
      content.className = status === "unavailable" ? "metacube__unavailable" : "metacube__link";

      if (content instanceof HTMLAnchorElement) {
        content.href = item.href;
        if (status === "current") content.setAttribute("aria-current", "page");
      }

      content.append(createCubeSvg(), createCard(item));
      listItem.append(content);
      list.append(listItem);
    });

    section.append(list);
    this.#shadow.replaceChildren(style, section);
  }
}

export function defineCifarMetacube() {
  if (!customElements.get("cifar-metacube")) {
    customElements.define("cifar-metacube", CifarMetacube);
  }
}


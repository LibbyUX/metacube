import type { CifarCubeItem } from "./types";
import { CIFAR_CUBE_INTRO_COPY } from "./cifar-cube-copy";

type MetadataEntry = [string, string | number];

/**
 * Creates the Material close glyph used by the desktop details button.
 * @returns A decorative 24-pixel SVG icon that inherits the button color.
 */
function createCloseIcon() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("cifar-cube__details-close-icon");
  icon.setAttribute("width", "24");
  icon.setAttribute("height", "24");
  icon.setAttribute("viewBox", "0 -960 960 960");
  icon.setAttribute("fill", "currentColor");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z");
  icon.append(path);
  return icon;
}

/**
 * Creates the component introduction shared by desktop and compact layouts.
 * @param details - Persistent desktop details region displayed in place of the dimension key.
 * @returns A heading group containing the configured introduction copy and details region.
 */
export function createIntro(details: HTMLElement) {
  const intro = document.createElement("header");
  intro.className = "cifar-cube__intro";
  if (CIFAR_CUBE_INTRO_COPY.eyebrow) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "cifar-cube__intro-eyebrow";
    eyebrow.textContent = CIFAR_CUBE_INTRO_COPY.eyebrow;
    intro.append(eyebrow);
  }
  const heading = document.createElement("h2");
  heading.className = "cifar-cube__intro-heading";
  heading.textContent = CIFAR_CUBE_INTRO_COPY.heading;

  const visualization = document.createElement("div");
  visualization.className = "cifar-cube__intro-visualization";
  const visualizationDescription = document.createElement("p");
  visualizationDescription.className = "cifar-cube__intro-summary";
  visualizationDescription.textContent = CIFAR_CUBE_INTRO_COPY.visualization.description;
  const dimensionHeadings = document.createElement("div");
  dimensionHeadings.className = "cifar-cube__intro-dimensions-header";
  dimensionHeadings.setAttribute("aria-hidden", "true");
  CIFAR_CUBE_INTRO_COPY.visualization.dimensionHeadings.forEach((headingText) => {
    const dimensionHeading = document.createElement("span");
    dimensionHeading.textContent = headingText;
    dimensionHeadings.append(dimensionHeading);
  });
  const dimensions = document.createElement("dl");
  dimensions.className = "cifar-cube__intro-dimensions";
  CIFAR_CUBE_INTRO_COPY.visualization.dimensions.forEach((dimension) => {
    const row = document.createElement("div");
    row.className = "cifar-cube__intro-dimensions-row";
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = dimension.term;
    description.textContent = dimension.description;
    row.append(term, description);
    dimensions.append(row);
  });
  const attribution = document.createElement("p");
  attribution.className = "cifar-cube__intro-attribution";
  const attributionLink = document.createElement("a");
  attributionLink.href = CIFAR_CUBE_INTRO_COPY.visualization.attribution.href;
  attributionLink.textContent = CIFAR_CUBE_INTRO_COPY.visualization.attribution.linkText;
  attribution.append(
    CIFAR_CUBE_INTRO_COPY.visualization.attribution.beforeLink,
    attributionLink,
    CIFAR_CUBE_INTRO_COPY.visualization.attribution.afterLink,
  );
  visualization.append(visualizationDescription, dimensionHeadings, dimensions, details, attribution);

  const compactDescription = document.createElement("p");
  compactDescription.className = "cifar-cube__intro-compact";
  compactDescription.textContent = CIFAR_CUBE_INTRO_COPY.compactDescription;
  intro.append(heading, visualization, compactDescription);
  return intro;
}

/**
 * Preserves present metadata while excluding explicitly absent values.
 * @param item - Dataset whose metadata should be displayed.
 * @returns Displayable metadata entries in their provided order.
 */
function getMetadataEntries(item: CifarCubeItem): MetadataEntry[] {
  return Object.entries(item.metadata ?? {}).filter(
    (entry): entry is MetadataEntry => entry[1] !== null && entry[1] !== undefined,
  );
}

/**
 * Combines a concise visible label with available metadata for a unique accessible name.
 * @param item - Dataset whose label and metadata should be described.
 * @returns A descriptive dataset name suitable for controls and links.
 */
export function getAccessibleDatasetName(item: CifarCubeItem) {
  const metadata = getMetadataEntries(item).map(([key, value]) => `${key}: ${value}`).join(", ");
  return metadata ? `${item.label}; ${metadata}` : item.label;
}

/**
 * Builds the semantic metadata definition list shared by dataset cards.
 * @param item - Dataset whose metadata should be displayed.
 * @returns A grouped definition list, or null when the dataset has no present metadata.
 */
function createMetadataList(item: CifarCubeItem) {
  const entries = getMetadataEntries(item);
  if (entries.length === 0) return null;

  const metadata = document.createElement("dl");
  metadata.className = "cifar-cube__details-metadata";
  entries.forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "cifar-cube__details-metadata-row";
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = key;
    description.textContent = String(value);
    row.append(term, description);
    metadata.append(row);
  });
  return metadata;
}

/**
 * Builds the dataset destination or its unavailable-state message.
 * @param item - Dataset whose destination should be exposed.
 * @param actionClassName - CSS class applied when an actionable link is available.
 * @returns A direct link or a noninteractive availability message.
 */
function createDestination(item: CifarCubeItem, actionClassName: string) {
  const status = item.status ?? "available";
  if (status === "unavailable" || !item.href) {
    const unavailable = document.createElement("p");
    unavailable.className = "cifar-cube__details-unavailable";
    unavailable.textContent = "Metadata is not currently available for this dataset.";
    return unavailable;
  }

  const action = document.createElement("a");
  action.className = actionClassName;
  action.href = item.href;
  action.setAttribute("aria-label", `View metadata for ${getAccessibleDatasetName(item)}${status === "current" ? ", current page" : ""}`);
  action.textContent = "View metadata";
  return action;
}

/**
 * Creates the transient preview shown beside a desktop cube.
 * @param item - Dataset represented by the cube.
 * @returns A presentation-only card containing safely escaped text nodes.
 */
export function createPreviewCard(item: CifarCubeItem) {
  const card = document.createElement("span");
  card.className = "cifar-cube__card";
  card.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.className = "cifar-cube__label";
  label.textContent = item.label;
  card.append(label);

  const entries = getMetadataEntries(item);
  if (entries.length > 0) {
    const metadata = document.createElement("span");
    metadata.className = "cifar-cube__metadata";
    entries.forEach(([key, value]) => {
      const term = document.createElement("span");
      const description = document.createElement("span");
      term.className = "cifar-cube__metadata-key";
      description.className = "cifar-cube__metadata-value";
      term.textContent = key;
      description.textContent = String(value);
      metadata.append(term, description);
    });
    card.append(metadata);
  }

  if (item.status === "current" || item.status === "unavailable") {
    const status = document.createElement("span");
    status.className = "cifar-cube__status";
    status.textContent = item.status === "current" ? "Current page" : "Unavailable";
    card.append(status);
  }
  return card;
}

/**
 * Creates the persistent live region for desktop dataset details.
 * @param detailsId - Stable ID used by dataset controls to reference the panel.
 * @returns An empty live region populated after a dataset is selected.
 */
export function createDetails(detailsId: string) {
  const details = document.createElement("div");
  details.className = "cifar-cube__details";
  details.id = detailsId;
  details.setAttribute("aria-live", "polite");
  details.setAttribute("aria-atomic", "true");
  return details;
}

/**
 * Updates the mounted desktop details region after selection changes.
 * @param details - Stable details landmark whose content should be replaced.
 * @param item - Selected dataset, or null before a selection is made.
 * @param headingId - Stable ID used to label the details landmark.
 * @param closeDetails - Clears the current desktop selection.
 * @returns The updated details landmark.
 */
export function updateDetails(details: HTMLElement, item: CifarCubeItem | null, headingId: string, closeDetails: () => void) {
  details.replaceChildren();
  if (!item) return details;

  const card = document.createElement("article");
  card.className = "cifar-cube__details-card";
  card.setAttribute("aria-labelledby", headingId);
  const header = document.createElement("div");
  header.className = "cifar-cube__details-header";
  const title = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "cifar-cube__details-eyebrow";
  eyebrow.textContent = "Selected dataset";
  const heading = document.createElement("h3");
  heading.className = "cifar-cube__details-heading";
  heading.id = headingId;
  heading.textContent = item.label;
  const close = document.createElement("button");
  close.className = "cifar-cube__details-close";
  close.type = "button";
  close.setAttribute("aria-label", "Close dataset details");
  close.append(createCloseIcon());
  close.addEventListener("click", closeDetails);
  title.append(eyebrow, heading);
  header.append(title, close);
  card.append(header);

  const metadata = createMetadataList(item);
  if (metadata) card.append(metadata);
  card.append(createDestination(item, "cifar-cube__details-action"));
  details.append(card);
  return details;
}

/**
 * Creates a self-contained dataset card for layouts without the cube canvas.
 * @param item - Dataset represented by the card.
 * @returns A card with metadata and a direct destination action.
 */
export function createCompactCard(item: CifarCubeItem) {
  const card = document.createElement("article");
  card.className = "cifar-cube__compact-card";
  const heading = document.createElement("h3");
  heading.className = "cifar-cube__compact-heading";
  heading.textContent = item.label;
  card.append(heading);

  const metadata = createMetadataList(item);
  if (metadata) card.append(metadata);
  card.append(createDestination(item, "cifar-cube__compact-action"));
  return card;
}

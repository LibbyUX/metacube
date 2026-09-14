import type { CifarCubeItem } from "./types";
import { CIFAR_CUBE_INTRO_COPY } from "./cifar-cube-copy";

type MetadataEntry = [string, string | number];

/**
 * Creates the component introduction shared by desktop and compact layouts.
 * @returns A heading group containing the configured introduction copy.
 */
export function createIntro() {
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
  const description = document.createElement("p");
  description.className = "cifar-cube__intro-description";
  description.textContent = CIFAR_CUBE_INTRO_COPY.description;
  intro.append(heading, description);
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
 * Builds the semantic metadata definition list shared by dataset cards.
 * @param item - Dataset whose metadata should be displayed.
 * @returns A definition list, or null when the dataset has no present metadata.
 */
function createMetadataList(item: CifarCubeItem) {
  const entries = getMetadataEntries(item);
  if (entries.length === 0) return null;

  const metadata = document.createElement("dl");
  metadata.className = "cifar-cube__details-metadata";
  entries.forEach(([key, value]) => {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = key;
    description.textContent = String(value);
    metadata.append(term, description);
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
  action.setAttribute("aria-label", `View metadata for ${item.label}${status === "current" ? ", current page" : ""}`);
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
 * @returns The updated details landmark.
 */
export function updateDetails(details: HTMLElement, item: CifarCubeItem | null, headingId: string) {
  details.replaceChildren();
  if (!item) return details;

  const card = document.createElement("article");
  card.className = "cifar-cube__details-card";
  card.setAttribute("aria-labelledby", headingId);
  const eyebrow = document.createElement("p");
  eyebrow.className = "cifar-cube__details-eyebrow";
  eyebrow.textContent = "Selected dataset";
  const heading = document.createElement("h3");
  heading.className = "cifar-cube__details-heading";
  heading.id = headingId;
  heading.textContent = item.label;
  card.append(eyebrow, heading);

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

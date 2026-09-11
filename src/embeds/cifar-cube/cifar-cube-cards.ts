import type { CifarCubeItem } from "./cifar-cube";

type MetadataEntry = [string, string | number];

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
 * Creates the persistent desktop details region for the selected dataset.
 * @param detailsId - Stable ID used by dataset controls to reference the panel.
 * @param headingId - Stable ID used to label the details landmark.
 * @returns An accessible details panel with an explicit destination action.
 */
export function createDetails(detailsId: string, headingId: string) {
  const details = document.createElement("aside");
  details.className = "cifar-cube__details";
  details.id = detailsId;
  details.setAttribute("aria-live", "polite");
  details.setAttribute("aria-atomic", "true");
  details.setAttribute("aria-labelledby", headingId);
  updateDetails(details, null, headingId);
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

  const eyebrow = document.createElement("p");
  eyebrow.className = "cifar-cube__details-eyebrow";
  eyebrow.textContent = item ? "Selected dataset" : "Organ imaging datasets";
  const heading = document.createElement("h2");
  heading.className = "cifar-cube__details-heading";
  heading.id = headingId;
  heading.textContent = item?.label ?? "Explore organ imaging datasets";
  details.append(eyebrow, heading);

  if (!item) {
    const guidance = document.createElement("p");
    guidance.className = "cifar-cube__details-guidance";
    guidance.textContent = "Select a dataset to inspect its details.";
    details.append(guidance);
    return details;
  }

  const metadata = createMetadataList(item);
  if (metadata) details.append(metadata);
  details.append(createDestination(item, "cifar-cube__details-action"));
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

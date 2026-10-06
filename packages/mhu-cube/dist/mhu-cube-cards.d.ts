import type { MhuCubeAxes, MhuCubeItem } from "./types";
/**
 * Creates the component introduction shared by desktop and compact layouts.
 * @param details - Persistent desktop details region displayed in place of the dimension key.
 * @returns A heading group containing the configured introduction copy and details region.
 */
export declare function createIntro(details: HTMLElement): HTMLElement;
/**
 * Combines a concise visible label with available metadata for a unique accessible name.
 * @param item - Dataset whose label and metadata should be described.
 * @returns A descriptive dataset name suitable for controls and links.
 */
export declare function getAccessibleDatasetName(item: MhuCubeItem): string;
/**
 * Creates the transient preview shown beside a desktop cube.
 * @param item - Dataset represented by the cube.
 * @returns A presentation-only card containing safely escaped text nodes.
 */
export declare function createPreviewCard(item: MhuCubeItem): HTMLSpanElement;
/**
 * Creates the persistent live region for desktop dataset details.
 * @param detailsId - Stable ID used by dataset controls to reference the panel.
 * @returns An empty live region populated after a dataset is selected.
 */
export declare function createDetails(detailsId: string): HTMLDivElement;
/**
 * Updates the mounted desktop details region after selection changes.
 * @param details - Stable details landmark whose content should be replaced.
 * @param item - Selected dataset, or null before a selection is made.
 * @param headingId - Stable ID used to label the details landmark.
 * @param closeDetails - Clears the current desktop selection.
 * @returns The updated details landmark.
 */
export declare function updateDetails(details: HTMLElement, item: MhuCubeItem | null, headingId: string, closeDetails: () => void): HTMLElement;
/**
 * Creates a self-contained dataset card for layouts without the cube canvas: a square image, time and space,
 * the organ as the title, and the remaining metadata. The image and title both open the metadata page; with a
 * touch screen, the title link stretches over the whole card.
 * @param item - Dataset represented by the card.
 * @param axes - Validated axes used for dimension labels and the time unit.
 * @returns A card whose links share the dataset's metadata destination.
 */
export declare function createCompactCard(item: MhuCubeItem, axes: MhuCubeAxes): HTMLElement;
//# sourceMappingURL=mhu-cube-cards.d.ts.map
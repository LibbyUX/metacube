import type { CifarCubeItem } from "./types";
/**
 * Creates the transient preview shown beside a desktop cube.
 * @param item - Dataset represented by the cube.
 * @returns A presentation-only card containing safely escaped text nodes.
 */
export declare function createPreviewCard(item: CifarCubeItem): HTMLSpanElement;
/**
 * Creates the persistent desktop details region for the selected dataset.
 * @param detailsId - Stable ID used by dataset controls to reference the panel.
 * @param headingId - Stable ID used to label the details landmark.
 * @returns An accessible details panel with an explicit destination action.
 */
export declare function createDetails(detailsId: string, headingId: string): HTMLElement;
/**
 * Updates the mounted desktop details region after selection changes.
 * @param details - Stable details landmark whose content should be replaced.
 * @param item - Selected dataset, or null before a selection is made.
 * @param headingId - Stable ID used to label the details landmark.
 * @returns The updated details landmark.
 */
export declare function updateDetails(details: HTMLElement, item: CifarCubeItem | null, headingId: string): HTMLElement;
/**
 * Creates a self-contained dataset card for layouts without the cube canvas.
 * @param item - Dataset represented by the card.
 * @returns A card with metadata and a direct destination action.
 */
export declare function createCompactCard(item: CifarCubeItem): HTMLElement;
//# sourceMappingURL=cifar-cube-cards.d.ts.map
import type { CifarCubeItem } from "./types";
/**
 * Creates the component introduction shared by desktop and compact layouts.
 * @returns A heading group containing the configured introduction copy.
 */
export declare function createIntro(): HTMLElement;
/**
 * Creates the transient preview shown beside a desktop cube.
 * @param item - Dataset represented by the cube.
 * @returns A presentation-only card containing safely escaped text nodes.
 */
export declare function createPreviewCard(item: CifarCubeItem): HTMLSpanElement;
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
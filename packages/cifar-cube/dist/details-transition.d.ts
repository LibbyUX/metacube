/** Coordinates a short, cancellable fade between desktop detail-card states. */
export declare class DetailsTransition {
    #private;
    /**
     * Cancels any active transition and prevents its deferred update from running.
     * @returns Nothing.
     */
    cancel(): void;
    /**
     * Fades out a detail card, updates its content, and fades the updated card in.
     * @param details - Stable detail-card element being updated.
     * @param updateContent - Callback that replaces the card content at minimum opacity.
     * @returns Nothing.
     */
    run(details: HTMLElement, updateContent: () => void): void;
}
//# sourceMappingURL=details-transition.d.ts.map
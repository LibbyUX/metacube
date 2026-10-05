import type { MhuCubeAxes, MhuCubeItem, MhuCubeSelectionDetail, MhuCubeValidationDetail, MhuCubeValidationIssue } from "./types";
export type { MhuCubeAxes, MhuCubeCategoryAxis, MhuCubeItem, MhuCubeItemStatus, MhuCubePosition, MhuCubeSelectionDetail, MhuCubeTimeAxis, MhuCubeTimeRange, MhuCubeValidationDetail, MhuCubeValidationIssue, MhuCubeValidationSeverity, } from "./types";
export declare const MHU_CUBE_SELECTION_EVENT = "mhu-cube-selection-change";
export declare const MHU_CUBE_VALIDATION_EVENT = "mhu-cube-validation";
declare global {
    interface HTMLElementTagNameMap {
        "mhu-cube": MhuCube;
    }
    interface GlobalEventHandlersEventMap {
        "mhu-cube-selection-change": CustomEvent<MhuCubeSelectionDetail>;
        "mhu-cube-validation": CustomEvent<MhuCubeValidationDetail>;
    }
}
declare const HTMLElementBase: typeof HTMLElement;
/** Accessible, responsive dataset preview custom element. */
export declare class MhuCube extends HTMLElementBase {
    #private;
    static observedAttributes: string[];
    /** Normalized datasets currently available to the component. */
    get items(): MhuCubeItem[];
    set items(value: MhuCubeItem[]);
    /** Normalized time, space, and organ axes used by the desktop visualization. */
    get axes(): MhuCubeAxes;
    set axes(value: MhuCubeAxes);
    /** Current configuration errors and warnings. */
    get validationIssues(): MhuCubeValidationIssue[];
    /** ID selected in the desktop visualization, or null. */
    get selectedId(): string | null;
    set selectedId(value: string | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
}
/**
 * Registers the `mhu-cube` custom element once when the Custom Elements API is available.
 * @returns Nothing.
 */
export declare function defineMhuCube(): void;
//# sourceMappingURL=mhu-cube.d.ts.map
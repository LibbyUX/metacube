import type { CifarCubeAxes, CifarCubeItem, CifarCubeSelectionDetail, CifarCubeValidationDetail, CifarCubeValidationIssue } from "./types";
export type { CifarCubeAxes, CifarCubeAxis, CifarCubeItem, CifarCubeItemStatus, CifarCubePosition, CifarCubeSelectionDetail, CifarCubeValidationDetail, CifarCubeValidationIssue, CifarCubeValidationSeverity, } from "./types";
export declare const CIFAR_CUBE_SELECTION_EVENT = "cifar-cube-selection-change";
export declare const CIFAR_CUBE_VALIDATION_EVENT = "cifar-cube-validation";
declare global {
    interface HTMLElementTagNameMap {
        "cifar-cube": CifarCube;
    }
    interface GlobalEventHandlersEventMap {
        "cifar-cube-selection-change": CustomEvent<CifarCubeSelectionDetail>;
        "cifar-cube-validation": CustomEvent<CifarCubeValidationDetail>;
    }
}
declare const HTMLElementBase: typeof HTMLElement;
/** Accessible, responsive dataset preview custom element. */
export declare class CifarCube extends HTMLElementBase {
    #private;
    static observedAttributes: string[];
    /** Normalized datasets currently available to the component. */
    get items(): CifarCubeItem[];
    set items(value: CifarCubeItem[]);
    /** Normalized categorical axes used by the desktop visualization. */
    get axes(): CifarCubeAxes;
    set axes(value: CifarCubeAxes);
    /** Current configuration errors and warnings. */
    get validationIssues(): CifarCubeValidationIssue[];
    /** ID selected in the desktop visualization, or null. */
    get selectedId(): string | null;
    set selectedId(value: string | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
}
/**
 * Registers the `cifar-cube` custom element once when the Custom Elements API is available.
 * @returns Nothing.
 */
export declare function defineCifarCube(): void;
//# sourceMappingURL=cifar-cube.d.ts.map
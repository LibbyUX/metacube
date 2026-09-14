/** A dataset's availability in the metadata experience. */
export type CifarCubeItemStatus = "available" | "current" | "unavailable";
/** Zero-based indexes into the configured x, y, and z axis values. */
export interface CifarCubePosition {
    /** Spatial-scale index. */
    x: number;
    /** Age index. */
    y: number;
    /** Organ index. */
    z: number;
}
/** One categorical axis displayed by the desktop visualization. */
export interface CifarCubeAxis {
    /** Human-readable axis name. */
    label: string;
    /** Ordered, unique category labels. */
    values: string[];
}
/** The three categorical axes required by the desktop visualization. */
export interface CifarCubeAxes {
    x: CifarCubeAxis;
    y: CifarCubeAxis;
    z: CifarCubeAxis;
}
/** A dataset displayed as a cube or compact card. */
export interface CifarCubeItem {
    /** Stable, unique dataset identity. */
    id: string;
    /** Human-readable dataset name. */
    label: string;
    /** Relative, hash, HTTP, or HTTPS metadata destination. */
    href?: string;
    /** Ordered label-value pairs displayed as dataset details. */
    metadata?: Record<string, string | number | null | undefined>;
    /** Optional categorical indexes; omitted datasets remain available but unplotted. */
    position?: CifarCubePosition;
    /** Optional relative cube size greater than zero and no larger than one. */
    cubeScale?: number;
    /** Availability state; defaults to available when a valid destination exists. */
    status?: CifarCubeItemStatus;
}
/** Detail emitted when a dataset is selected on the desktop canvas. */
export interface CifarCubeSelectionDetail {
    item: CifarCubeItem;
}
export type CifarCubeValidationSeverity = "error" | "warning";
/** One actionable problem found while normalizing component input. */
export interface CifarCubeValidationIssue {
    code: string;
    message: string;
    path: string;
    severity: CifarCubeValidationSeverity;
    itemId?: string;
}
/** Detail emitted after connected configuration changes are coalesced. */
export interface CifarCubeValidationDetail {
    issues: readonly CifarCubeValidationIssue[];
}
//# sourceMappingURL=types.d.ts.map
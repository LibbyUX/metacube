/** A dataset's availability in the metadata experience. */
export type MhuCubeItemStatus = "available" | "current" | "unavailable";
/** Zero-based indexes into the configured x, y, and z axis values. */
export interface MhuCubePosition {
    /** Spatial-scale index. */
    x: number;
    /** Age index. */
    y: number;
    /** Organ index. */
    z: number;
}
/** One categorical axis displayed by the desktop visualization. */
export interface MhuCubeAxis {
    /** Human-readable axis name. */
    label: string;
    /** Ordered, unique category labels. */
    values: string[];
}
/** The three categorical axes required by the desktop visualization. */
export interface MhuCubeAxes {
    x: MhuCubeAxis;
    y: MhuCubeAxis;
    z: MhuCubeAxis;
}
/** A dataset displayed as a cube or compact card. */
export interface MhuCubeItem {
    /** Stable, unique dataset identity. */
    id: string;
    /** Human-readable dataset name. */
    label: string;
    /** Relative, hash, HTTP, or HTTPS metadata destination. */
    href?: string;
    /** Ordered label-value pairs displayed as dataset details. */
    metadata?: Record<string, string | number | null | undefined>;
    /** Optional categorical indexes; omitted datasets remain available but unplotted. */
    position?: MhuCubePosition;
    /** Optional relative cube size greater than zero and no larger than one. */
    cubeScale?: number;
    /** Availability state; defaults to available when a valid destination exists. */
    status?: MhuCubeItemStatus;
}
/** Detail emitted when a desktop selection changes. */
export interface MhuCubeSelectionDetail {
    item: MhuCubeItem | null;
}
export type MhuCubeValidationSeverity = "error" | "warning";
/** One actionable problem found while normalizing component input. */
export interface MhuCubeValidationIssue {
    code: string;
    message: string;
    path: string;
    severity: MhuCubeValidationSeverity;
    itemId?: string;
}
/** Detail emitted after connected configuration changes are coalesced. */
export interface MhuCubeValidationDetail {
    issues: readonly MhuCubeValidationIssue[];
}
//# sourceMappingURL=types.d.ts.map
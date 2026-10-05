import type { MhuCubeAxes, MhuCubeItem, MhuCubeValidationIssue } from "./types";
export declare const EMPTY_AXES: MhuCubeAxes;
/** A normalized value and the issues found while producing it. */
export interface ValidationResult<T> {
    value: T;
    issues: MhuCubeValidationIssue[];
}
/**
 * Determines whether a metadata destination uses an allowed web URL form.
 * @param value - Candidate destination supplied by component data.
 * @returns Whether the destination is relative, same-page, HTTP, or HTTPS.
 */
export declare function isSafeMetadataHref(value: string): boolean;
/**
 * Validates and normalizes the three categorical axes without shifting indexes.
 * @param input - Unknown value received through a property or JSON attribute.
 * @returns Safe axes and actionable validation issues.
 */
export declare function validateAxes(input: unknown): ValidationResult<MhuCubeAxes>;
/**
 * Validates dataset identity, display metadata, destination, status, and position.
 * @param input - Unknown value received through a property or JSON attribute.
 * @param axes - Already validated axes used for position bounds.
 * @returns Safe datasets and actionable validation issues.
 */
export declare function validateItems(input: unknown, axes: MhuCubeAxes): ValidationResult<MhuCubeItem[]>;
//# sourceMappingURL=validation.d.ts.map
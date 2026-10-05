import type { MhuCubeAxes, MhuCubeItem, MhuCubeValidationIssue } from "./types";
export declare const EMPTY_AXES: MhuCubeAxes;
/** A normalized value and the issues found while producing it. */
export interface ValidationResult<T> {
    value: T;
    issues: MhuCubeValidationIssue[];
}
/**
 * Orders organ names alphabetically, ignoring case and accents, with a stable tie-breaker.
 * @param a - First organ name.
 * @param b - Second organ name.
 * @returns A negative, zero, or positive sort result.
 */
export declare function compareOrganNames(a: string, b: string): number;
/**
 * Determines whether validated axes contain enough information to draw the plot.
 * @param axes - Validated axes.
 * @returns Whether time has a positive span and both categorical axes have values.
 */
export declare function canPlotAxes(axes: MhuCubeAxes): boolean;
/**
 * Determines whether a metadata destination uses an allowed web URL form.
 * @param value - Candidate destination supplied by component data.
 * @returns Whether the destination is relative, same-page, HTTP, or HTTPS.
 */
export declare function isSafeMetadataHref(value: string): boolean;
/**
 * Validates and normalizes the time, space, and organ axes. Organs are always sorted alphabetically.
 * @param input - Unknown value received through a property or JSON attribute.
 * @returns Safe axes and actionable validation issues.
 */
export declare function validateAxes(input: unknown): ValidationResult<MhuCubeAxes>;
/**
 * Validates dataset identity, display metadata, destination, status, and position.
 * @param input - Unknown value received through a property or JSON attribute.
 * @param axes - Already validated axes that positions must reference.
 * @returns Safe datasets and actionable validation issues.
 */
export declare function validateItems(input: unknown, axes: MhuCubeAxes): ValidationResult<MhuCubeItem[]>;
//# sourceMappingURL=validation.d.ts.map
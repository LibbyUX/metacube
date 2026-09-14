import type {
  CifarCubeAxes,
  CifarCubeItem,
  CifarCubeItemStatus,
  CifarCubePosition,
  CifarCubeValidationIssue,
} from "./types";

export const EMPTY_AXES: CifarCubeAxes = {
  x: { label: "X axis", values: [] },
  y: { label: "Y axis", values: [] },
  z: { label: "Z axis", values: [] },
};

/** A normalized value and the issues found while producing it. */
export interface ValidationResult<T> {
  value: T;
  issues: CifarCubeValidationIssue[];
}

const ITEM_STATUSES = new Set<CifarCubeItemStatus>(["available", "current", "unavailable"]);
const AXIS_KEYS: Array<keyof CifarCubeAxes> = ["x", "y", "z"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function issue(
  code: string,
  message: string,
  path: string,
  severity: CifarCubeValidationIssue["severity"],
  itemId?: string,
): CifarCubeValidationIssue {
  return { code, message, path, severity, ...(itemId ? { itemId } : {}) };
}

/**
 * Determines whether a metadata destination uses an allowed web URL form.
 * @param value - Candidate destination supplied by component data.
 * @returns Whether the destination is relative, same-page, HTTP, or HTTPS.
 */
export function isSafeMetadataHref(value: string) {
  const href = value.trim();
  if (!href) return false;
  try {
    const parsed = new URL(href, "https://cifar-cube.invalid/");
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates and normalizes the three categorical axes without shifting indexes.
 * @param input - Unknown value received through a property or JSON attribute.
 * @returns Safe axes and actionable validation issues.
 */
export function validateAxes(input: unknown): ValidationResult<CifarCubeAxes> {
  const issues: CifarCubeValidationIssue[] = [];
  if (!isRecord(input)) {
    return {
      value: EMPTY_AXES,
      issues: [issue("axes.invalid", "Axes must be an object with x, y, and z definitions.", "axes", "error")],
    };
  }

  const axes = {} as CifarCubeAxes;
  AXIS_KEYS.forEach((key) => {
    const rawAxis = input[key];
    const fallbackLabel = `${key.toUpperCase()} axis`;
    if (!isRecord(rawAxis)) {
      axes[key] = { label: fallbackLabel, values: [] };
      issues.push(issue("axis.invalid", `${fallbackLabel} must provide a label and values.`, `axes.${key}`, "error"));
      return;
    }

    const label = typeof rawAxis.label === "string" && rawAxis.label.trim() ? rawAxis.label.trim() : fallbackLabel;
    if (label === fallbackLabel && rawAxis.label !== fallbackLabel) {
      issues.push(issue("axis.label.invalid", `${fallbackLabel} is using a fallback label.`, `axes.${key}.label`, "warning"));
    }

    const rawValues = rawAxis.values;
    if (!Array.isArray(rawValues) || rawValues.length === 0) {
      axes[key] = { label, values: [] };
      issues.push(issue("axis.values.invalid", `${label} must provide at least one value.`, `axes.${key}.values`, "error"));
      return;
    }

    const valuesAreValid = rawValues.every((value) => typeof value === "string" && value.trim().length > 0);
    const values = valuesAreValid ? rawValues.map((value) => (value as string).trim()) : [];
    if (!valuesAreValid) {
      issues.push(issue("axis.value.invalid", `${label} contains an empty or non-text value.`, `axes.${key}.values`, "error"));
    } else if (new Set(values).size !== values.length) {
      values.length = 0;
      issues.push(issue("axis.values.duplicate", `${label} contains duplicate values and cannot be plotted safely.`, `axes.${key}.values`, "error"));
    }
    axes[key] = { label, values };
  });

  return { value: axes, issues };
}

function validateMetadata(
  input: unknown,
  path: string,
  itemId: string,
  issues: CifarCubeValidationIssue[],
) {
  if (input === undefined) return undefined;
  if (!isRecord(input)) {
    issues.push(issue("item.metadata.invalid", "Metadata must be an object.", path, "warning", itemId));
    return undefined;
  }

  const metadata: NonNullable<CifarCubeItem["metadata"]> = {};
  Object.entries(input).forEach(([key, value]) => {
    if (!key.trim()) {
      issues.push(issue("item.metadata.key.invalid", "Metadata field with an empty name was omitted.", path, "warning", itemId));
      return;
    }
    if (typeof value === "string" || (typeof value === "number" && Number.isFinite(value)) || value === null || value === undefined) {
      metadata[key] = value;
    } else {
      issues.push(issue("item.metadata.value.invalid", `Metadata field “${key}” was omitted because its value is unsupported.`, `${path}.${key}`, "warning", itemId));
    }
  });
  return metadata;
}

function validatePosition(
  input: unknown,
  axes: CifarCubeAxes,
  path: string,
  itemId: string,
  issues: CifarCubeValidationIssue[],
): CifarCubePosition | undefined {
  if (input === undefined || input === null) {
    issues.push(issue("item.position.missing", "Dataset is available but will not be plotted because it has no position.", path, "warning", itemId));
    return undefined;
  }
  if (!isRecord(input)) {
    issues.push(issue("item.position.invalid", "Position must provide integer x, y, and z indexes.", path, "warning", itemId));
    return undefined;
  }

  const position = { x: input.x, y: input.y, z: input.z };
  const indexes = [position.x, position.y, position.z];
  if (!indexes.every((value) => typeof value === "number" && Number.isInteger(value) && value >= 0)) {
    issues.push(issue("item.position.invalid", "Position must provide non-negative integer x, y, and z indexes.", path, "warning", itemId));
    return undefined;
  }

  const typedPosition = position as CifarCubePosition;
  const inRange = typedPosition.x < axes.x.values.length
    && typedPosition.y < axes.y.values.length
    && typedPosition.z < axes.z.values.length;
  if (!inRange) {
    issues.push(issue("item.position.out-of-range", "Position falls outside the configured axes and will not be plotted.", path, "warning", itemId));
    return undefined;
  }
  return typedPosition;
}

/**
 * Validates dataset identity, display metadata, destination, status, and position.
 * @param input - Unknown value received through a property or JSON attribute.
 * @param axes - Already validated axes used for position bounds.
 * @returns Safe datasets and actionable validation issues.
 */
export function validateItems(input: unknown, axes: CifarCubeAxes): ValidationResult<CifarCubeItem[]> {
  const issues: CifarCubeValidationIssue[] = [];
  if (!Array.isArray(input)) {
    return {
      value: [],
      issues: [issue("items.invalid", "Items must be an array.", "items", "error")],
    };
  }

  const ids = new Set<string>();
  const positions = new Set<string>();
  const items: CifarCubeItem[] = [];
  input.forEach((candidate, index) => {
    const path = `items[${index}]`;
    if (!isRecord(candidate)) {
      issues.push(issue("item.invalid", "Dataset must be an object and was excluded.", path, "error"));
      return;
    }

    const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
    if (!id) {
      issues.push(issue("item.id.invalid", "Dataset requires a nonempty text ID and was excluded.", `${path}.id`, "error"));
      return;
    }
    if (ids.has(id)) {
      issues.push(issue("item.id.duplicate", `Duplicate dataset ID “${id}” was excluded.`, `${path}.id`, "error", id));
      return;
    }
    ids.add(id);

    const suppliedLabel = typeof candidate.label === "string" ? candidate.label.trim() : "";
    const label = suppliedLabel || id;
    if (!suppliedLabel) {
      issues.push(issue("item.label.invalid", "Dataset label is missing; its ID is shown instead.", `${path}.label`, "warning", id));
    }

    let href: string | undefined;
    if (candidate.href !== undefined) {
      if (typeof candidate.href === "string" && isSafeMetadataHref(candidate.href)) href = candidate.href.trim();
      else issues.push(issue("item.href.unsafe", "Metadata destination was removed because it is invalid or uses an unsafe protocol.", `${path}.href`, "error", id));
    }

    let status: CifarCubeItemStatus = "available";
    if (candidate.status !== undefined) {
      if (typeof candidate.status === "string" && ITEM_STATUSES.has(candidate.status as CifarCubeItemStatus)) {
        status = candidate.status as CifarCubeItemStatus;
      } else {
        issues.push(issue("item.status.invalid", "Unknown status was replaced with “available”.", `${path}.status`, "warning", id));
      }
    }

    if (!href && status === "available") {
      status = "unavailable";
      issues.push(issue("item.href.missing", "Dataset has no metadata destination and is treated as unavailable.", `${path}.href`, "warning", id));
    }

    const metadata = validateMetadata(candidate.metadata, `${path}.metadata`, id, issues);
    let cubeScale: number | undefined;
    if (candidate.cubeScale !== undefined) {
      if (typeof candidate.cubeScale === "number" && Number.isFinite(candidate.cubeScale)
        && candidate.cubeScale > 0 && candidate.cubeScale <= 1) {
        cubeScale = candidate.cubeScale;
      } else {
        issues.push(issue("item.cube-scale.invalid", "Cube scale must be greater than zero and no larger than one; the default size is used.", `${path}.cubeScale`, "warning", id));
      }
    }
    let position = validatePosition(candidate.position, axes, `${path}.position`, id, issues);
    if (position) {
      const positionKey = `${position.x}:${position.y}:${position.z}`;
      if (positions.has(positionKey)) {
        issues.push(issue("item.position.duplicate", "Position is already occupied; this dataset remains available but is not plotted.", `${path}.position`, "warning", id));
        position = undefined;
      } else positions.add(positionKey);
    }
    items.push({
      id,
      label,
      ...(href ? { href } : {}),
      ...(metadata ? { metadata } : {}),
      ...(position ? { position } : {}),
      ...(cubeScale !== undefined ? { cubeScale } : {}),
      status,
    });
  });

  return { value: items, issues };
}

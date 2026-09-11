export type CifarCubeItemStatus = "available" | "current" | "unavailable";

export interface CifarCubePosition {
  x: number;
  y: number;
  z: number;
}

export interface CifarCubeAxis {
  label: string;
  values: string[];
}

export interface CifarCubeAxes {
  x: CifarCubeAxis;
  y: CifarCubeAxis;
  z: CifarCubeAxis;
}

export interface CifarCubeItem {
  id: string;
  label: string;
  href?: string;
  metadata?: Record<string, string | number | null | undefined>;
  position?: CifarCubePosition;
  status?: CifarCubeItemStatus;
}

export interface CifarCubeSelectionDetail {
  item: CifarCubeItem;
}

export type CifarCubeValidationSeverity = "error" | "warning";

export interface CifarCubeValidationIssue {
  code: string;
  message: string;
  path: string;
  severity: CifarCubeValidationSeverity;
  itemId?: string;
}

export interface CifarCubeValidationDetail {
  issues: readonly CifarCubeValidationIssue[];
}

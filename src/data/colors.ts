import type { CubeConfig, ColorPaletteConfig } from "./config";
import * as chromatic from "d3-scale-chromatic";
import { ASAP, SCHEMES, DEFAULT_SCHEME, type Theme } from "./theme";

// Active palette — set by the ThemeProvider. Axis / group / cell / size-scale
// colours are resolved from it so they track the light/dark toggle and scheme.
let active: Theme = SCHEMES[DEFAULT_SCHEME].light;

/** Called by ThemeProvider when the active palette changes. Clears the
 *  value→colour assignment caches so they re-derive from the new palette. */
export function setActiveTheme(t: Theme): void {
  if (t === active) return;
  active = t;
  assignedColors.clear();
  assignedGroupColors.clear();
}

// X / Y / Z axis label tints — read live from the active palette.
export const AXIS_COLORS: Record<"x" | "y" | "z", string> = {
  get x() { return active.axis.x; },
  get y() { return active.axis.y; },
  get z() { return active.axis.z; },
} as Record<"x" | "y" | "z", string>;

// Default categorical palette (axis values) and a rotated variant for groups.
function defaultPalette(): string[] { return active.categorical; }
function groupPalette(): string[] { return [...active.categorical.slice(1), active.categorical[0]]; }

/** The active palette's categorical colours (for treemap / cell-type swatches). */
export function categoricalPalette(): string[] { return active.categorical; }

// ── d3-scale-chromatic interpolator lookup ────────────────────────────────────
// Maps matplotlib/d3 palette names to their interpolator function.

type Interpolator = (t: number) => string;

const INTERPOLATORS: Record<string, Interpolator> = {
  // Diverging
  RdYlGn:   chromatic.interpolateRdYlGn,
  RdYlBu:   chromatic.interpolateRdYlBu,
  RdBu:     chromatic.interpolateRdBu,
  RdGy:     chromatic.interpolateRdGy,
  PiYG:     chromatic.interpolatePiYG,
  PRGn:     chromatic.interpolatePRGn,
  PuOr:     chromatic.interpolatePuOr,
  BrBG:     chromatic.interpolateBrBG,
  Spectral: chromatic.interpolateSpectral,
  RdGn: makeCustomInterpolator("#c0392b", "#f5f5f5", "#27ae60"),
  // ASAP brand ramps (green ↔ purple)
  ASAP: makeCustomInterpolator("#e7f4ee", ASAP.green, ASAP.purpleDark),
  PuGn: makeCustomInterpolator(ASAP.purple, "#f4f1f7", ASAP.green),
  // Sequential (perceptually uniform, matplotlib-origin)
  viridis:  chromatic.interpolateViridis,
  plasma:   chromatic.interpolatePlasma,
  inferno:  chromatic.interpolateInferno,
  magma:    chromatic.interpolateMagma,
  cividis:  chromatic.interpolateCividis,
  // Sequential (single-hue)
  Blues:    chromatic.interpolateBlues,
  Greens:   chromatic.interpolateGreens,
  Oranges:  chromatic.interpolateOranges,
  Purples:  chromatic.interpolatePurples,
  Reds:     chromatic.interpolateReds,
  // Sequential (multi-hue)
  YlOrRd:   chromatic.interpolateYlOrRd,
  YlOrBr:   chromatic.interpolateYlOrBr,
  YlGnBu:   chromatic.interpolateYlGnBu,
  GnBu:     chromatic.interpolateGnBu,
  BuPu:     chromatic.interpolateBuPu,
  OrRd:     chromatic.interpolateOrRd,
};

// Known-diverging palette names — used for auto-detection when type is omitted.
const DIVERGING_NAMES = new Set([
  "RdYlGn", "RdYlBu", "RdBu", "RdGy", "PiYG", "PRGn", "PuOr", "BrBG", "Spectral", "RdGn", "PuGn",
]);

// ── Axis / group color utilities (unchanged) ──────────────────────────────────

const assignedColors = new Map<string, string>();
const assignedGroupColors = new Map<string, string>();

export function getGroupColor(value: string, config?: CubeConfig): string {
  if (config?.colors?.[value]) return config.colors[value];
  if (config?.axes) {
    for (const axis of Object.values(config.axes)) {
      if (axis.colors?.[value]) return axis.colors[value];
    }
  }
  if (!assignedGroupColors.has(value)) {
    const gp = groupPalette();
    assignedGroupColors.set(value, gp[assignedGroupColors.size % gp.length]);
  }
  return assignedGroupColors.get(value)!;
}

export function getAxisColor(value: string, config?: CubeConfig): string {
  if (config?.colors?.[value]) return config.colors[value];
  if (config?.axes) {
    for (const axis of Object.values(config.axes)) {
      if (axis.colors?.[value]) return axis.colors[value];
    }
  }
  if (!assignedColors.has(value)) {
    const dp = defaultPalette();
    assignedColors.set(value, dp[assignedColors.size % dp.length]);
  }
  return assignedColors.get(value)!;
}

export function getAxisColorDim(value: string, config?: CubeConfig): string {
  // Dim toward the active palette's muted/dim text, NOT white — so dimmed labels
  // read as "less prominent" on both light and dark backgrounds (blending toward
  // white only dims on a light page; on the dark stage it brightens instead).
  return lerpHex(getAxisColor(value, config), active.text_dim, 0.55);
}

// ── Hex helpers ───────────────────────────────────────────────────────────────

export function blendToWhite(hex: string, t: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.round(r + (255 - r) * t),
    Math.round(g + (255 - g) * t),
    Math.round(b + (255 - b) * t),
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(
    Math.round(ar + (br - ar) * t),
    Math.round(ag + (bg - ag) * t),
    Math.round(ab + (bb - ab) * t),
  );
}

function makeCustomInterpolator(low: string, mid: string, high: string): Interpolator {
  return (t: number) => {
    // Quadratic curve keeps colors saturated for most of the range, fading to mid only near center
    if (t <= 0.5) return lerpHex(low, mid, Math.pow(t * 2, 2));
    return lerpHex(mid, high, Math.pow((t - 0.5) * 2, 2));
  };
}

// ── Legacy default scale (kept for backwards compat / no-palette fallback) ────

export function createSizeColorScale(maxSize: number): (size: number) => string {
  // Sequential low → mid → high ramp from the active palette's size_scale.
  const { low, mid, high } = active.size_scale;
  return (size: number) => {
    const t = maxSize > 0 ? Math.min(1, size / maxSize) : 0;
    if (t <= 0.5) return lerpHex(low, mid, t * 2);
    return lerpHex(mid, high, (t - 0.5) * 2);
  };
}

// ── Main scale factory ────────────────────────────────────────────────────────

/**
 * Resolve the effective scale type given the palette config and the actual
 * data domain [minVal, maxVal].
 *
 * Rules:
 *   1. Explicit type in config wins.
 *   2. Named diverging palette → diverging.
 *   3. minVal < 0 → diverging.
 *   4. Fallback → sequential.
 */
function resolveType(
  palette: ColorPaletteConfig | undefined,
  minVal: number,
): "sequential" | "diverging" {
  if (palette?.type) return palette.type;
  if (palette?.name && DIVERGING_NAMES.has(palette.name)) return "diverging";
  if (minVal < 0) return "diverging";
  return "sequential";
}

export function createColorScale(
  maxVal: number,
  minVal: number,
  palette?: ColorPaletteConfig,
): (val: number) => string {
  const type = resolveType(palette, minVal);
  const interpolator = palette?.name ? INTERPOLATORS[palette.name] : undefined;

  if (type === "diverging") {
    const absMax = Math.max(Math.abs(minVal), Math.abs(maxVal), 1);
    if (interpolator) {
      // Map [-absMax, +absMax] → [0, 1] with 0.5 at the midpoint.
      return (val: number) => interpolator(Math.max(0, Math.min(1, (val / absMax + 1) / 2)));
    }
    // Hex fallback — ASAP purple ↔ green diverging
    const low  = palette?.low_color  ?? ASAP.purple;
    const mid  = palette?.mid_color  ?? "#f4f1f7";
    const high = palette?.high_color ?? ASAP.green;
    return (val: number) => {
      if (absMax === 0) return mid;
      const t = Math.max(-1, Math.min(1, val / absMax));
      return t < 0 ? lerpHex(low, mid, t + 1) : lerpHex(mid, high, t);
    };
  }

  // Sequential
  if (interpolator) {
    const range = Math.max(maxVal - minVal, 1);
    return (val: number) => interpolator(Math.max(0, Math.min(1, (val - minVal) / range)));
  }
  if (palette?.low_color && palette?.high_color) {
    const range = Math.max(maxVal - minVal, 1);
    return (val: number) => {
      const t = Math.max(0, Math.min(1, (val - minVal) / range));
      if (!palette.mid_color) return lerpHex(palette.low_color!, palette.high_color!, t);
      if (t <= 0.5) return lerpHex(palette.low_color!, palette.mid_color, t * 2);
      return lerpHex(palette.mid_color, palette.high_color!, (t - 0.5) * 2);
    };
  }
  return createSizeColorScale(maxVal);
}

// ── Legend stops ──────────────────────────────────────────────────────────────

const LEGEND_STOPS = 20;

export function getColorScaleLegendStops(
  maxVal: number,
  minVal: number,
  palette?: ColorPaletteConfig,
): { color: string }[] {
  const type = resolveType(palette, minVal);
  const scale = createColorScale(maxVal, minVal, palette);
  const absMax = Math.max(Math.abs(minVal), Math.abs(maxVal), 1);

  return Array.from({ length: LEGEND_STOPS }, (_, i) => {
    const t = i / (LEGEND_STOPS - 1);
    const val = type === "diverging"
      ? -absMax + t * 2 * absMax
      : minVal + t * (maxVal - minVal);
    return { color: scale(val) };
  });
}

/** @deprecated Use getColorScaleLegendStops */
export function getSizeLegendStops(maxSize: number): { color: string }[] {
  return getColorScaleLegendStops(maxSize, 0, undefined);
}

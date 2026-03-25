import { scaleSqrt, scaleLinear } from "d3-scale";

const ORGANISM_PALETTE: Record<string, string> = {
  Human: "#4fc3f7",
  Mouse: "#81c784",
  Macaque: "#ffb74d",
};

const MODALITY_PALETTE: Record<string, string> = {
  "scRNA-seq": "#ef5350",
  Multiome: "#ab47bc",
  "small RNA-seq": "#66bb6a",
  "bulk RNA-seq": "#42a5f5",
  "scRNA (blood)": "#ff7043",
  WGS: "#5c6bc0",
  WES: "#26a69a",
  Methylation: "#8d6e63",
  Proteomics: "#ec407a",
};

const FALLBACK_COLORS = [
  "#78909c",
  "#9575cd",
  "#4db6ac",
  "#f06292",
  "#aed581",
  "#ffca28",
  "#26c6da",
];

let fallbackIdx = 0;

export function getOrganismColor(organism: string): string {
  if (ORGANISM_PALETTE[organism]) return ORGANISM_PALETTE[organism];
  const c = FALLBACK_COLORS[fallbackIdx % FALLBACK_COLORS.length];
  fallbackIdx++;
  ORGANISM_PALETTE[organism] = c;
  return c;
}

export function getModalityColor(modality: string): string {
  if (MODALITY_PALETTE[modality]) return MODALITY_PALETTE[modality];
  const c = FALLBACK_COLORS[fallbackIdx % FALLBACK_COLORS.length];
  fallbackIdx++;
  MODALITY_PALETTE[modality] = c;
  return c;
}

/**
 * Sequential color scale for dataset size.
 * Cold (dark blue) → warm (bright yellow/white) for small → large.
 */
export function createSizeColorScale(maxSize: number) {
  const scale = scaleSqrt<string>()
    .domain([0, maxSize * 0.25, maxSize])
    .range(["#1a237e", "#e65100", "#ffee58"])
    .clamp(true);

  return (size: number): string => scale(size);
}

/**
 * Discrete legend stops for the size color scale.
 */
export function getSizeLegendStops(maxSize: number) {
  const steps = 5;
  const scale = createSizeColorScale(maxSize);
  const stops: { value: number; color: string }[] = [];
  for (let i = 0; i <= steps; i++) {
    const v = (maxSize * i) / steps;
    stops.push({ value: Math.round(v), color: scale(v) });
  }
  return stops;
}

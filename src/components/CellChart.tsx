import { PriceSparkline } from "./PriceSparkline";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import type { ChartSpec } from "../data/dataModel";

interface CellChartProps {
  name: string;
  spec: ChartSpec;
  height?: number;
}

/**
 * Dispatches a per-cell chart to the renderer named by `spec.type`. A bare
 * `{ price: [...] }` (no `type`) renders as a sparkline for backward compatibility.
 */
export function CellChart({ name, spec, height }: CellChartProps) {
  const type = spec.type ?? "sparkline";

  if (type === "line") {
    const series = spec.data ?? spec.price ?? [];
    return <LineChart name={name} data={series} xLabel={spec.x_label} yLabel={spec.y_label} color={spec.color} height={height} />;
  }

  if (type === "bar") {
    const series = spec.data ?? spec.price ?? [];
    return <BarChart name={name} data={series} yLabel={spec.y_label} color={spec.color} height={height} />;
  }

  // Sparkline (default). PriceSparkline expects date-string x values.
  const price = (spec.price ?? spec.data) as [string, number][] | undefined;
  if (!price || price.length < 2) return null;
  return <PriceSparkline ticker={name} data={{ price }} height={height} />;
}

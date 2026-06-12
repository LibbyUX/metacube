import { TEXT_BODY, TEXT_DIM } from "../data/theme";
import type { ChartPoint } from "../data/dataModel";

interface LineChartProps {
  name: string;
  data: ChartPoint[];
  xLabel?: string;
  yLabel?: string;
  color?: string;
  height?: number;
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const fmt = (v: number) =>
  Math.abs(v) >= 1000 ? v.toLocaleString(undefined, { maximumFractionDigits: 0 }) : String(v);

/** Plain line chart of a per-cell [x, value] series (no percentage transform). */
export function LineChart({ name, data, yLabel, color = "#1793ad", height = 110 }: LineChartProps) {
  if (!data || data.length < 2) return null;

  const values = data.map(([, v]) => v);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const span = maxV - minV || 1;
  const vPad = span * 0.08;
  const chartMin = minV - vPad;
  const chartMax = maxV + vPad;
  const range = chartMax - chartMin;

  const W = 260;
  const H = height;
  const padL = 8;
  const padR = 10;
  const padTop = 8;
  const padBot = 16;
  const chartH = H - padTop - padBot;
  const chartW = W - padL - padR;

  const xFor = (i: number) => padL + (i / (data.length - 1)) * chartW;
  const yFor = (v: number) => padTop + (1 - (v - chartMin) / range) * chartH;

  const pts = data.map(([, v], i): [number, number] => [xFor(i), yFor(v)]);
  const linePath =
    `M${pts[0][0]},${pts[0][1]}` + pts.slice(1).map(([x, y]) => ` L${x},${y}`).join("");

  const firstX = String(data[0][0]);
  const lastX = String(data[data.length - 1][0]);

  return (
    <div style={{ width: "100%", marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: TEXT_BODY, fontFamily: FONT }}>{name}</span>
        {yLabel && <span style={{ fontSize: 10, color: TEXT_DIM, fontFamily: FONT }}>{yLabel}</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.8} fill={color} />
        ))}
        <text x={padL} y={padTop + 4} fontSize={8} fill={TEXT_DIM} fontFamily={FONT}>{fmt(maxV)}</text>
        <text x={padL} y={padTop + chartH} fontSize={8} fill={TEXT_DIM} fontFamily={FONT}>{fmt(minV)}</text>
        <text x={padL} y={H - 4} fontSize={8} fill={TEXT_DIM} fontFamily={FONT}>{firstX}</text>
        <text x={W - padR} y={H - 4} fontSize={8} fill={TEXT_DIM} fontFamily={FONT} textAnchor="end">{lastX}</text>
      </svg>
    </div>
  );
}

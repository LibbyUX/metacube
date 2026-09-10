import { TEXT_BODY, TEXT_DIM } from "../data/theme";
import type { ChartPoint } from "../data/dataModel";

interface BarChartProps {
  name: string;
  data: ChartPoint[];
  yLabel?: string;
  color?: string;
  height?: number;
}

const FONT = "Roboto, sans-serif";

const fmt = (v: number) =>
  Math.abs(v) >= 1000 ? v.toLocaleString(undefined, { maximumFractionDigits: 0 }) : String(v);

/** Categorical bar chart of a per-cell [category, value] series. */
export function BarChart({ name, data, yLabel, color = "#1793ad", height = 130 }: BarChartProps) {
  if (!data || data.length === 0) return null;

  const values = data.map(([, v]) => v);
  const maxV = Math.max(...values, 0) || 1;

  const W = 260;
  const H = height;
  const padL = 8;
  const padR = 8;
  const padTop = 8;
  const padBot = 30;
  const chartH = H - padTop - padBot;
  const chartW = W - padL - padR;
  const n = data.length;
  const gap = 3;
  const bw = Math.max(1, (chartW - gap * (n - 1)) / n);
  const baseY = padTop + chartH;

  return (
    <div style={{ width: "100%", marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: TEXT_BODY, fontFamily: FONT }}>{name}</span>
        {yLabel && <span style={{ fontSize: 10, color: TEXT_DIM, fontFamily: FONT }}>{yLabel}</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <line x1={padL} y1={baseY} x2={padL + chartW} y2={baseY} stroke={TEXT_DIM} strokeWidth={0.5} />
        {data.map(([label, v], i) => {
          const h = Math.max(0, (v / maxV) * chartH);
          const x = padL + i * (bw + gap);
          const y = baseY - h;
          const lab = String(label);
          const tx = x + bw / 2;
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw} height={h} fill={color} rx={1} />
              <text
                x={tx}
                y={baseY + 8}
                fontSize={7}
                fill={TEXT_DIM}
                fontFamily={FONT}
                textAnchor="end"
                transform={`rotate(-40 ${tx} ${baseY + 8})`}
              >
                {lab.length > 14 ? lab.slice(0, 13) + "…" : lab}
              </text>
            </g>
          );
        })}
        <text x={padL} y={padTop + 4} fontSize={8} fill={TEXT_DIM} fontFamily={FONT}>{fmt(maxV)}</text>
      </svg>
    </div>
  );
}

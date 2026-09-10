import { TEXT_BODY, TEXT_DIM } from "../data/theme";

interface PriceSparklineProps {
  ticker: string;
  data: { price: [string, number][] };
  height?: number;
}

const FONT = "Roboto, sans-serif";

export function PriceSparkline({ ticker, data, height = 100 }: PriceSparklineProps) {
  const prices = data.price;
  if (!prices || prices.length < 2) return null;

  const rawValues = prices.map(([, v]) => v);
  const first = rawValues[0];
  const last = rawValues[rawValues.length - 1];
  const pcts = rawValues.map(v => ((v - first) / first) * 100);

  const minPct = Math.min(...pcts, 0);
  const maxPct = Math.max(...pcts, 0);
  const span = maxPct - minPct || 1;
  const vPad = span * 0.08;
  const chartMin = minPct - vPad;
  const chartMax = maxPct + vPad;
  const totalRange = chartMax - chartMin;

  const W = 260;
  const H = height;
  const padX = 10;
  const padTop = 6;
  const padBot = 14;
  const chartH = H - padTop - padBot;
  const chartW = W - padX * 2;

  const yFor = (pct: number) => padTop + (1 - (pct - chartMin) / totalRange) * chartH;
  const zeroY = yFor(0);

  const pts = pcts.map((p, i): [number, number] => [
    padX + (i / (pcts.length - 1)) * chartW,
    yFor(p),
  ]);

  const linePath = `M${pts[0][0]},${pts[0][1]}` + pts.slice(1).map(([x, y]) => ` L${x},${y}`).join("");
  const fillPath = `M${pts[0][0]},${zeroY} L${pts[0][0]},${pts[0][1]}` +
    pts.slice(1).map(([x, y]) => ` L${x},${y}`).join("") +
    ` L${pts[pts.length - 1][0]},${zeroY} Z`;

  const currentPct = pcts[pcts.length - 1];
  const isUp = currentPct >= 0;
  const dotColor = isUp ? "#27ae60" : "#c0392b";
  const pctStr = (currentPct >= 0 ? "+" : "") + currentPct.toFixed(1) + "%";

  const firstDate = prices[0][0].slice(0, 7);
  const lastDate = prices[prices.length - 1][0].slice(0, 7);

  // Unique clip IDs per ticker (avoid SVG ID collisions on multiple charts)
  const idAbove = `spa-${ticker}`;
  const idBelow = `spb-${ticker}`;

  const aboveH = Math.max(0, zeroY - padTop);
  const belowH = Math.max(0, padTop + chartH - zeroY);

  return (
    <div style={{ width: "100%", marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: TEXT_BODY, fontFamily: FONT }}>{ticker}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: dotColor, fontFamily: FONT }}>{pctStr}</span>
        <span style={{ fontSize: 10, color: TEXT_DIM, fontFamily: FONT }}>since {firstDate}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <defs>
          {/* Clip above the zero line */}
          <clipPath id={idAbove}>
            <rect x={padX - 1} y={padTop - 1} width={chartW + 2} height={aboveH + 1} />
          </clipPath>
          {/* Clip below the zero line */}
          <clipPath id={idBelow}>
            <rect x={padX - 1} y={zeroY} width={chartW + 2} height={belowH + 1} />
          </clipPath>
        </defs>

        {/* Zero baseline */}
        <line
          x1={padX} y1={zeroY} x2={padX + chartW} y2={zeroY}
          stroke={TEXT_DIM} strokeWidth={0.7} strokeDasharray="3 2"
        />

        {/* Green fill above zero */}
        <path d={fillPath} fill="rgba(39,174,96,0.13)" stroke="none" clipPath={`url(#${idAbove})`} />
        {/* Red fill below zero */}
        <path d={fillPath} fill="rgba(192,57,43,0.13)" stroke="none" clipPath={`url(#${idBelow})`} />

        {/* Green line above zero */}
        <path d={linePath} fill="none" stroke="#27ae60" strokeWidth={1.5}
          strokeLinejoin="round" strokeLinecap="round" clipPath={`url(#${idAbove})`} />
        {/* Red line below zero */}
        <path d={linePath} fill="none" stroke="#c0392b" strokeWidth={1.5}
          strokeLinejoin="round" strokeLinecap="round" clipPath={`url(#${idBelow})`} />

        {/* Dot at current value */}
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.5} fill={dotColor} />

        {/* Date labels */}
        <text x={padX} y={H - 3} fontSize={8} fill={TEXT_DIM} fontFamily={FONT}>{firstDate}</text>
        <text x={W - padX} y={H - 3} fontSize={8} fill={TEXT_DIM} fontFamily={FONT} textAnchor="end">{lastDate}</text>
      </svg>
    </div>
  );
}

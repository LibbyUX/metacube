/**
 * Treemap overlay: Studies → Cell Types (nested).
 * Cell types have consistent colors across all views.
 * Loads drill-down data from /census_drilldown.json.
 */

import { useMemo, useState, useEffect } from "react";
import { treemap, hierarchy, treemapSquarify } from "d3-hierarchy";
import { CubeCell } from "../data/datasets";

interface TreemapOverlayProps {
  cell: CubeCell;
  onClose: () => void;
  drilldownPath?: string;
}

interface DrilldownEntry {
  d: string;
  c: string;
  n: number;
}

const CT_PALETTE = [
  "#e53935", "#8e24aa", "#3949ab", "#00897b", "#43a047",
  "#f4511e", "#1e88e5", "#fdd835", "#6d4c41", "#d81b60",
  "#00acc1", "#7cb342", "#ff8f00", "#5e35b1", "#546e7a",
  "#0891b2", "#ec4899", "#059669", "#dc2626", "#7c3aed",
  "#0d9488", "#ca8a04", "#be185d", "#4338ca", "#15803d",
];

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(n);
}

const drilldownCaches = new Map<string, Record<string, DrilldownEntry[]>>();

type TreeNode = { name: string; children?: TreeNode[]; value?: number };

export function TreemapOverlay({ cell, onClose, drilldownPath = "census_drilldown.json" }: TreemapOverlayProps) {
  const [entries, setEntries] = useState<DrilldownEntry[] | null>(null);
  const [hoveredCT, setHoveredCT] = useState<string | null>(null);

  const key = `${cell.organism}|${cell.organ}|${cell.modality}`;

  useEffect(() => {
    const cached = drilldownCaches.get(drilldownPath);
    if (cached) {
      setEntries(cached[key] || []);
      return;
    }
    fetch(`${import.meta.env.BASE_URL}${drilldownPath}`)
      .then((r) => r.json())
      .then((data) => {
        drilldownCaches.set(drilldownPath, data);
        setEntries(data[key] || []);
      })
      .catch(() => setEntries([]));
  }, [key, drilldownPath]);

  const W = Math.min(window.innerWidth - 80, 900);
  const H = Math.min(window.innerHeight - 240, 520);

  const { ctColorMap, studyMap, ctTotals, studyLeaves, studyGroups } = useMemo(() => {
    const empty = {
      ctColorMap: new Map<string, string>(),
      studyMap: new Map<string, Map<string, number>>(),
      ctTotals: new Map<string, number>(),
      studyLeaves: [] as any[],
      studyGroups: [] as any[],
    };
    if (!entries || entries.length === 0) return empty;

    // Aggregate
    const sMap = new Map<string, Map<string, number>>();
    const ctMap = new Map<string, number>();
    for (const e of entries) {
      if (!sMap.has(e.d)) sMap.set(e.d, new Map());
      sMap.get(e.d)!.set(e.c, (sMap.get(e.d)!.get(e.c) || 0) + e.n);
      ctMap.set(e.c, (ctMap.get(e.c) || 0) + e.n);
    }

    // Cell type colors (by total count rank)
    const ctSorted = [...ctMap.entries()].sort((a, b) => b[1] - a[1]);
    const colors = new Map<string, string>();
    ctSorted.forEach(([ct], i) =>
      colors.set(ct, i < CT_PALETTE.length ? CT_PALETTE[i] : "#b0b8c0"),
    );

    // Studies sorted by total
    const studies = [...sMap.entries()]
      .map(([name, cts]) => ({
        name,
        total: [...cts.values()].reduce((a, b) => a + b, 0),
        cellTypes: cts,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 14);

    // Build nested hierarchy
    const rootData: TreeNode = {
      name: "root",
      children: studies.map((s) => ({
        name: s.name,
        children: [...s.cellTypes.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 18)
          .map(([ct, count]) => ({ name: ct, value: count })),
      })),
    };

    const root = hierarchy<TreeNode>(rootData)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const layout = treemap<TreeNode>()
      .size([W, H])
      .paddingTop(4)
      .paddingInner(3)
      .paddingOuter(20)
      .round(true)
      .tile(treemapSquarify);

    const laid = layout(root);

    const groups = laid
      .descendants()
      .filter((n) => n.depth === 1)
      .map((n) => ({
        x0: n.x0, y0: n.y0, x1: n.x1, y1: n.y1,
        name: n.data.name,
        total: n.value ?? 0,
      }));

    const leaves = laid.leaves().map((n) => ({
      x0: n.x0, y0: n.y0, x1: n.x1, y1: n.y1,
      cellType: n.data.name,
      count: n.data.value ?? 0,
      study: n.parent?.data.name ?? "",
      color: colors.get(n.data.name) || "#b0b8c0",
    }));

    return {
      ctColorMap: colors,
      studyMap: sMap,
      ctTotals: ctMap,
      studyLeaves: leaves,
      studyGroups: groups,
    };
  }, [entries, W, H]);

  if (!entries) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.8)" }}>
        <div style={{ color: "#666", fontSize: 16 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)",
        animation: "treemapFadeIn 0.3s ease-out",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
      onClick={onClose}
    >
      <style>{`@keyframes treemapFadeIn { from { opacity:0; transform:scale(0.95) } to { opacity:1; transform:scale(1) } }`}</style>
      <div
        style={{
          background: "#fff", border: "1px solid #d0d5dd", borderRadius: 12,
          padding: "18px 22px 14px", color: "#1a1a2e",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 2 }}>
              {cell.organism} · {cell.modality} · {cell.organ}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
              {studyGroups.length} Studies · {fmt(cell.size)} cells
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", borderRadius: 6, padding: "4px 12px", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Treemap */}
        <svg width={W} height={H} style={{ display: "block", borderRadius: 6 }}>
          <rect width={W} height={H} fill="#f9fafb" rx={6} />

          {/* Study groups — title above the cell type boxes */}
          {studyGroups.map((s, i) => {
            const gw = s.x1 - s.x0;
            return (
              <g key={`sg-${i}`}>
                <rect x={s.x0} y={s.y0} width={gw} height={s.y1 - s.y0}
                  fill="none" rx={4} stroke="#c8cdd4" strokeWidth={1} />
                {/* Title sits in the padding area above the children */}
                {gw > 30 && (
                  <text x={s.x0 + 6} y={s.y0 - 5} fontSize={12} fontWeight={700} fill="#1f2937"
                    style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    {s.name.length > gw / 7
                      ? s.name.slice(0, Math.floor(gw / 7)) + "…"
                      : s.name}
                    <tspan fill="#6b7280" fontWeight={500} fontSize={11}> ({fmt(s.total)})</tspan>
                  </text>
                )}
              </g>
            );
          })}

          {/* Cell type leaves — colored by cell type */}
          {studyLeaves.map((lf, i) => {
            const w = lf.x1 - lf.x0, h = lf.y1 - lf.y0;
            const hl = hoveredCT === lf.cellType;
            return (
              <g key={`sl-${i}`}
                onMouseEnter={() => setHoveredCT(lf.cellType)}
                onMouseLeave={() => setHoveredCT(null)}
                style={{ cursor: "pointer" }}
              >
                <rect x={lf.x0} y={lf.y0} width={w} height={h}
                  fill={lf.color}
                  opacity={hl ? 1 : hoveredCT ? 0.4 : 0.82}
                  stroke={hl ? "#111" : "rgba(255,255,255,0.6)"}
                  strokeWidth={hl ? 2 : 0.5}
                  rx={2} />
                {w > 35 && h > 14 && (
                  <text x={lf.x0 + 3} y={lf.y0 + 12} fontSize={9} fontWeight={600} fill="#fff">
                    {lf.cellType.length > w / 5.5 ? lf.cellType.slice(0, Math.floor(w / 5.5)) + "…" : lf.cellType}
                  </text>
                )}
                {w > 45 && h > 26 && (
                  <text x={lf.x0 + 3} y={lf.y0 + 23} fontSize={8} fill="rgba(255,255,255,0.75)">{fmt(lf.count)}</text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover detail — always rendered with fixed height to prevent layout shift */}
        <div style={{
          marginTop: 8, padding: "7px 14px", background: "#f3f4f6",
          borderRadius: 8, fontSize: 12, color: "#374151",
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
          height: 34, minHeight: 34,
        }}>
          {hoveredCT ? (
            <>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: ctColorMap.get(hoveredCT) || "#999", flexShrink: 0 }} />
              <strong style={{ color: "#111" }}>{hoveredCT}</strong>
              <span>{fmt(ctTotals.get(hoveredCT) || 0)} cells</span>
              <span style={{ color: "#999" }}>
                in {[...studyMap.entries()].filter(([, cts]) => cts.has(hoveredCT)).length} studies
              </span>
            </>
          ) : (
            <span style={{ color: "#aaa" }}>Hover a cell type for details</span>
          )}
        </div>
      </div>
    </div>
  );
}

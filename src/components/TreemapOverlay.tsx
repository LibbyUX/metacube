import { useMemo, useState } from "react";
import { treemap, hierarchy, treemapSquarify, HierarchyRectangularNode } from "d3-hierarchy";
import { CubeCell } from "../data/datasets";
import { getSubDatasets, SubDataset } from "../data/subDatasets";

interface TreemapOverlayProps {
  cell: CubeCell;
  onClose: () => void;
}

interface TreeLeaf {
  name: string;
  value: number;
  sub: SubDataset;
}

interface TreeRoot {
  name: string;
  children: TreeLeaf[];
}

const accessColors: Record<string, string> = {
  open: "#2e7d32",
  restricted: "#e65100",
  personal: "#c62828",
};

const accessLabels: Record<string, string> = {
  open: "Open",
  restricted: "Restricted",
  personal: "Personal",
};

// Soft, distinguishable palette for light mode
const palette = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#14b8a6",
  "#f97316", "#6366f1",
];

export function TreemapOverlay({ cell, onClose }: TreemapOverlayProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const subDatasets = useMemo(
    () => getSubDatasets(cell.organism, cell.modality, cell.organ, cell.datasets, cell.size),
    [cell]
  );

  const W = Math.min(window.innerWidth - 100, 720);
  const H = Math.min(window.innerHeight - 220, 460);

  const treeData = useMemo((): HierarchyRectangularNode<TreeRoot | TreeLeaf>[] => {
    const rootData: TreeRoot = {
      name: "root",
      children: subDatasets.map((d) => ({
        name: d.name,
        value: Math.max(d.cells || d.samples * 500, 5000),
        sub: d,
      })),
    };
    const root = hierarchy<TreeRoot | TreeLeaf>(rootData)
      .sum((d) => ("value" in d ? d.value : 0))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const layout = treemap<TreeRoot | TreeLeaf>()
      .size([W, H])
      .paddingInner(3)
      .paddingOuter(3)
      .round(true)
      .tile(treemapSquarify);

    const laid = layout(root);
    return laid.leaves() as unknown as HierarchyRectangularNode<TreeRoot | TreeLeaf>[];
  }, [subDatasets, W, H]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
        animation: "treemapFadeIn 0.35s ease-out",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes treemapFadeIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #d0d5dd",
          borderRadius: 12,
          padding: "22px 26px 18px",
          color: "#1a1a2e",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 2 }}>
              {cell.organism} · {cell.modality} · {cell.organ}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
              {subDatasets.length} Dataset{subDatasets.length !== 1 ? "s" : ""}
              <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af", marginLeft: 10 }}>
                {cell.size.toLocaleString()} total
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "1px solid #d1d5db",
              color: "#374151",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 18,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Treemap SVG */}
        <svg width={W} height={H} style={{ display: "block", borderRadius: 8, overflow: "hidden" }}>
          <rect width={W} height={H} fill="#f9fafb" rx={8} />
          {treeData.map((node, i) => {
            const leaf = node.data as TreeLeaf;
            const d = leaf.sub;
            const x0 = node.x0;
            const y0 = node.y0;
            const w = node.x1 - x0;
            const h = node.y1 - y0;
            const isHovered = hoveredIdx === i;
            const baseColor = palette[i % palette.length];

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={x0}
                  y={y0}
                  width={w}
                  height={h}
                  fill={baseColor}
                  stroke={isHovered ? "#111827" : "#ffffff"}
                  strokeWidth={isHovered ? 2.5 : 2}
                  rx={4}
                  opacity={isHovered ? 1 : 0.88}
                />

                {/* Access badge */}
                {w > 40 && h > 22 && (
                  <>
                    <rect
                      x={x0 + w - 8 - (accessLabels[d.access]?.length ?? 4) * 5.8}
                      y={y0 + 5}
                      width={(accessLabels[d.access]?.length ?? 4) * 5.8 + 6}
                      height={15}
                      rx={4}
                      fill="rgba(255,255,255,0.85)"
                    />
                    <text
                      x={x0 + w - 8}
                      y={y0 + 15.5}
                      fontSize={9}
                      fill={accessColors[d.access] ?? "#666"}
                      textAnchor="end"
                      fontWeight={700}
                    >
                      {accessLabels[d.access]}
                    </text>
                  </>
                )}

                {/* Dataset name */}
                {w > 50 && h > 26 && (
                  <text
                    x={x0 + 8}
                    y={y0 + 19}
                    fontSize={w > 130 ? 13 : 11}
                    fontWeight={700}
                    fill="#ffffff"
                  >
                    {d.name.length > w / 7.5
                      ? d.name.slice(0, Math.floor(w / 7.5)) + "…"
                      : d.name}
                  </text>
                )}

                {/* Metrics */}
                {w > 85 && h > 48 && (
                  <text x={x0 + 8} y={y0 + 35} fontSize={11} fill="rgba(255,255,255,0.8)">
                    {d.cells > 0 ? `${(d.cells / 1000).toFixed(0)}k cells` : ""}
                    {d.cells > 0 && d.samples > 0 ? "  ·  " : ""}
                    {d.samples > 0 ? `${d.samples} samples` : ""}
                  </text>
                )}

                {/* Source */}
                {w > 85 && h > 64 && (
                  <text x={x0 + 8} y={y0 + 50} fontSize={10} fill="rgba(255,255,255,0.55)">
                    {d.source}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover detail bar */}
        {hoveredIdx !== null && (
          <div style={{
            marginTop: 10,
            padding: "8px 14px",
            background: "#f3f4f6",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.7,
            display: "flex",
            gap: 18,
            alignItems: "center",
            flexWrap: "wrap",
            color: "#374151",
          }}>
            <strong style={{ color: "#111827", fontSize: 13 }}>
              {subDatasets[hoveredIdx].name}
            </strong>
            <span>
              <span style={{ color: "#9ca3af" }}>Cells: </span>
              {subDatasets[hoveredIdx].cells > 0
                ? subDatasets[hoveredIdx].cells.toLocaleString()
                : "—"}
            </span>
            <span>
              <span style={{ color: "#9ca3af" }}>Samples: </span>
              {subDatasets[hoveredIdx].samples > 0
                ? subDatasets[hoveredIdx].samples.toLocaleString()
                : "—"}
            </span>
            <span>
              <span style={{ color: "#9ca3af" }}>Access: </span>
              <span style={{ color: accessColors[subDatasets[hoveredIdx].access], fontWeight: 600 }}>
                {accessLabels[subDatasets[hoveredIdx].access]}
              </span>
            </span>
            <span>
              <span style={{ color: "#9ca3af" }}>Source: </span>
              {subDatasets[hoveredIdx].source}
            </span>
          </div>
        )}

        {/* Access legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 10, color: "#9ca3af" }}>
          {Object.entries(accessColors).map(([key, color]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              <span style={{ color: "#6b7280" }}>{accessLabels[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

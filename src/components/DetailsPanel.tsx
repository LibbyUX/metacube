import { CubeCell } from "../data/datasets";

interface DetailsPanelProps {
  cell: CubeCell | null;
  totalSize: number;
}

export function DetailsPanel({ cell, totalSize }: DetailsPanelProps) {
  if (!cell) return null;

  const pct = totalSize > 0 ? ((cell.size / totalSize) * 100).toFixed(1) : "0";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        width: 280,
        background: "rgba(255, 255, 255, 0.95)",
        border: "1px solid #d0d5dd",
        borderRadius: 10,
        padding: "14px 16px",
        fontSize: 13,
        color: "#374151",
        zIndex: 100,
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#111827" }}>
        {cell.organism} · {cell.modality} · {cell.organ}
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ color: "#9ca3af" }}>Dataset Size: </span>
        {cell.size.toLocaleString()}
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ color: "#9ca3af" }}>Share of Total: </span>
        {pct}%
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ color: "#9ca3af" }}>Priority: </span>
        {cell.priority}
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ color: "#9ca3af", marginBottom: 4, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>
          Datasets ({cell.datasets.length})
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#4b5563" }}>
          {cell.datasets.map((d, i) => (
            <li key={i} style={{ marginBottom: 2 }}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

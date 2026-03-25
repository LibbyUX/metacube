import { useEffect, useState } from "react";
import { CubeCell } from "../data/datasets";

interface TooltipProps {
  cell: CubeCell | null;
}

export function Tooltip({ cell }: TooltipProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!cell) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x + 14,
        top: pos.y + 14,
        background: "rgba(255, 255, 255, 0.95)",
        border: "1px solid #d0d5dd",
        borderRadius: 8,
        padding: "10px 14px",
        pointerEvents: "none",
        zIndex: 1000,
        maxWidth: 320,
        fontSize: 13,
        lineHeight: 1.5,
        color: "#374151",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#111827" }}>
        {cell.organism} · {cell.modality} · {cell.organ}
      </div>
      <div>
        <span style={{ color: "#9ca3af" }}>Size: </span>
        {cell.size.toLocaleString()}
      </div>
      <div>
        <span style={{ color: "#9ca3af" }}>Priority: </span>
        {cell.priority}
      </div>
      <div style={{ marginTop: 6, fontSize: 12, color: "#9ca3af" }}>
        Datasets:
      </div>
      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#4b5563" }}>
        {cell.datasets.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

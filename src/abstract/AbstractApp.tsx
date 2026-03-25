import { AbstractScene } from "./AbstractScene";
import { UmapScene } from "./UmapScene";
import { getSizeLegendStops } from "../data/colors";
import { rawRecords } from "../data/datasets";
import { clusters } from "./umapData";

const maxSize = Math.max(...rawRecords.map((r) => r.datasetSize));
const legendStops = getSizeLegendStops(maxSize);

export function AbstractApp() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      {/* Header */}
      <div style={{ padding: "24px 36px 0", flexShrink: 0 }}>
        <h1 style={{ fontSize: 21, fontWeight: 700, color: "#1a1a2e", marginBottom: 4, letterSpacing: -0.3 }}>
          From Multi-modal Data Integration to Parkinson's Disease Mechanisms
        </h1>
        <p style={{ fontSize: 13, color: "#5a5a7a", maxWidth: 1000, lineHeight: 1.55 }}>
          A three-axis search space maps <strong>organism</strong>, <strong>modality</strong>, and <strong>organ</strong> dimensions
          to systematically identify and integrate datasets.
          From the <span style={{ color: "#cc2222", fontWeight: 600 }}>origin</span> (Human brain scRNA-seq / miRNA),
          the investigation expands outward across species and assay types.
          Integrated data feeds into downstream single-cell analysis — clustering, trajectory inference,
          and identification of cell-type-specific mechanisms of neurodegeneration.
        </p>
      </div>

      {/* Main content: two panels side by side */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, padding: "8px 0" }}>

        {/* LEFT: Dataset Cube */}
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          {/* Panel label */}
          <div style={{
            position: "absolute", top: 8, left: 24, zIndex: 10, pointerEvents: "none",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2a2a3e", marginBottom: 2 }}>
              A. Dataset Search Space
            </div>
            <div style={{ fontSize: 11, color: "#5a5a7a", lineHeight: 1.5 }}>
              <div><strong>X</strong> Organism &nbsp; <strong>Y</strong> Modality &nbsp; <strong>Z</strong> Organ</div>
              <div>Color = dataset size</div>
            </div>
          </div>

          <AbstractScene />

          {/* Size legend */}
          <div style={{ position: "absolute", bottom: 16, left: 24, zIndex: 10, pointerEvents: "none" }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#5a5a7a", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Dataset Size
            </div>
            <div style={{ display: "flex", height: 10, width: 140, borderRadius: 2, overflow: "hidden", border: "1px solid #d0d4da" }}>
              {legendStops.map((s, i) => (
                <div key={i} style={{ flex: 1, background: s.color }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#999", marginTop: 1, width: 140 }}>
              <span>0</span>
              <span>{(maxSize / 1e6).toFixed(1)}M</span>
            </div>
          </div>

          {/* Cube legend */}
          <div style={{ position: "absolute", bottom: 16, right: 8, zIndex: 10, pointerEvents: "none", textAlign: "right" }}>
            <LegendItem border="#cc2222" bg="rgba(204,34,34,0.08)" label="Origin" />
            <LegendItem border="#b0bcc5" bg="rgba(180,190,200,0.1)" label="Unexplored" />
            <LegendItem border="#c44000" bg="#e65100" label="Dataset" />
          </div>
        </div>

        {/* CENTER ARROW — large and dominant */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          flexShrink: 0,
          zIndex: 5,
        }}>
          <svg width="120" height="260" viewBox="0 0 120 260">
            <defs>
              <marker id="arrowhead" markerWidth="14" markerHeight="12" refX="12" refY="6" orient="auto">
                <polygon points="0 0, 14 6, 0 12" fill="#2a2a3e" />
              </marker>
              <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#cc2222" />
                <stop offset="100%" stopColor="#2a2a3e" />
              </linearGradient>
            </defs>
            {/* Bold sweeping arrow */}
            <path
              d="M 15 40 C 70 40, 95 80, 95 130 S 70 220, 105 230"
              stroke="url(#arrowGrad)"
              strokeWidth="4.5"
              fill="none"
              markerEnd="url(#arrowhead)"
              strokeLinecap="round"
            />
            {/* Parallel thin accent line */}
            <path
              d="M 10 45 C 63 45, 88 85, 88 130 S 63 215, 98 228"
              stroke="#cc2222"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            fontSize: 13,
            color: "#2a2a3e",
            textAlign: "center",
            fontWeight: 800,
            lineHeight: 1.35,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginTop: -4,
          }}>
            Integration
          </div>
          <div style={{
            fontSize: 10,
            color: "#777",
            textAlign: "center",
            lineHeight: 1.4,
            marginTop: 4,
            maxWidth: 100,
          }}>
            Harmonization, batch correction &amp; joint embedding
          </div>
        </div>

        {/* RIGHT: UMAP Embedding */}
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          {/* Panel label */}
          <div style={{
            position: "absolute", top: 8, left: 16, zIndex: 10, pointerEvents: "none",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2a2a3e", marginBottom: 2 }}>
              B. Downstream: 3D Cell Atlas
            </div>
            <div style={{ fontSize: 11, color: "#5a5a7a" }}>
              Integrated snRNA-seq embedding with cell-type clustering
            </div>
          </div>

          <UmapScene />

          {/* Cluster legend */}
          <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 10, pointerEvents: "none" }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#5a5a7a", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Cell Types
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px", maxWidth: 260 }}>
              {clusters.map((cl) => (
                <div key={cl.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: cl.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: "#444" }}>{cl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PD callout */}
          <div style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 10,
            pointerEvents: "none",
            background: "rgba(204,0,0,0.06)",
            border: "1px solid rgba(204,34,34,0.25)",
            borderRadius: 6,
            padding: "8px 12px",
            maxWidth: 200,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b71c1c", marginBottom: 3 }}>
              Parkinson's Disease
            </div>
            <div style={{ fontSize: 10, color: "#5a3a3a", lineHeight: 1.45 }}>
              Dopaminergic neuron loss trajectory
              and neuroinflammatory microglial activation
              as key disease-associated signatures
              across species and modalities.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ border, bg, label }: { border: string; bg: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, justifyContent: "flex-end" }}>
      <div style={{ width: 12, height: 12, border: `1.5px solid ${border}`, borderRadius: 2, background: bg }} />
      <span style={{ fontSize: 10, color: "#555" }}>{label}</span>
    </div>
  );
}

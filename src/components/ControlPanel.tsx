import { ColorBy } from "../hooks/useStore";
import { getSizeLegendStops } from "../data/colors";

interface ControlPanelProps {
  organisms: string[];
  modalities: string[];
  organs: string[];
  colorBy: ColorBy;
  setColorBy: (c: ColorBy) => void;
  organismFilter: Set<string>;
  toggleOrganism: (o: string) => void;
  modalityFilter: Set<string>;
  toggleModality: (m: string) => void;
  organFilter: Set<string>;
  toggleOrgan: (o: string) => void;
  cubeOpacity: number;
  setCubeOpacity: (v: number) => void;
  cellOpacity: number;
  setCellOpacity: (v: number) => void;
  maxSize: number;
  onResetView: () => void;
  onClearSelection: () => void;
}

const panelStyle: React.CSSProperties = {
  position: "fixed",
  top: 12,
  left: 12,
  width: 210,
  background: "rgba(255, 255, 255, 0.92)",
  border: "1px solid #d0d5dd",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 12,
  color: "#374151",
  zIndex: 100,
  maxHeight: "calc(100vh - 24px)",
  overflowY: "auto",
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
};

const sectionStyle: React.CSSProperties = { marginBottom: 12 };
const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 3,
  fontWeight: 600,
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  color: "#6b7280",
};

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "1px 0",
        cursor: "pointer",
        fontSize: 11,
        color: checked ? "#111827" : "#9ca3af",
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

export function ControlPanel({
  organisms,
  modalities,
  organs,
  organismFilter,
  toggleOrganism,
  modalityFilter,
  toggleModality,
  organFilter,
  toggleOrgan,
  cubeOpacity,
  setCubeOpacity,
  cellOpacity,
  setCellOpacity,
  maxSize,
  onResetView,
  onClearSelection,
}: ControlPanelProps) {
  const legendStops = getSizeLegendStops(maxSize);

  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: "#111827" }}>
        Dataset Cube
      </div>

      {/* Size color legend */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Dataset Size</span>
        <div style={{ display: "flex", height: 10, borderRadius: 3, overflow: "hidden", border: "1px solid #e5e7eb", marginBottom: 3 }}>
          {legendStops.map((s, i) => (
            <div key={i} style={{ flex: 1, background: s.color }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#9ca3af" }}>
          <span>0</span>
          <span>{(maxSize / 1000).toFixed(0)}k</span>
        </div>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Organisms (X)</span>
        {organisms.map((o) => (
          <CheckItem key={o} label={o} checked={organismFilter.has(o)} onChange={() => toggleOrganism(o)} />
        ))}
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Modalities (Y)</span>
        {modalities.map((m) => (
          <CheckItem key={m} label={m} checked={modalityFilter.has(m)} onChange={() => toggleModality(m)} />
        ))}
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Organs (Z)</span>
        {organs.map((o) => (
          <CheckItem key={o} label={o} checked={organFilter.has(o)} onChange={() => toggleOrgan(o)} />
        ))}
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Cube Shell Opacity</span>
        <input type="range" min={0} max={0.08} step={0.002} value={cubeOpacity}
          onChange={(e) => setCubeOpacity(Number(e.target.value))} style={{ width: "100%", accentColor: "#3b82f6" }} />
      </div>
      <div style={sectionStyle}>
        <span style={labelStyle}>Cell Opacity</span>
        <input type="range" min={0.1} max={1} step={0.05} value={cellOpacity}
          onChange={(e) => setCellOpacity(Number(e.target.value))} style={{ width: "100%", accentColor: "#3b82f6" }} />
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={onResetView} style={{
          flex: 1, padding: "5px 8px", fontSize: 11,
          background: "#eff6ff", border: "1px solid #bfdbfe",
          color: "#2563eb", borderRadius: 5, cursor: "pointer",
        }}>Reset View</button>
        <button onClick={onClearSelection} style={{
          flex: 1, padding: "5px 8px", fontSize: 11,
          background: "#f9fafb", border: "1px solid #e5e7eb",
          color: "#6b7280", borderRadius: 5, cursor: "pointer",
        }}>Clear Sel.</button>
      </div>
    </div>
  );
}

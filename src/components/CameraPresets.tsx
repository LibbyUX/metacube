import { PANEL_BG, PANEL_BORDER, TEXT_BODY } from "../data/theme";

interface CameraPresetsProps {
  onSetCamera: (position: [number, number, number]) => void;
}

const presets: { label: string; pos: [number, number, number] }[] = [
  { label: "Iso", pos: [6.0, 4.5, 6.0] },
  { label: "Front", pos: [0, 0, 9] },
  { label: "Top", pos: [0, 9, 0.01] },
  { label: "Side", pos: [9, 0, 0] },
];

const btnStyle: React.CSSProperties = {
  padding: "5px 10px",
  fontSize: 11,
  background: PANEL_BG,
  border: `1px solid ${PANEL_BORDER}`,
  color: TEXT_BODY,
  borderRadius: 5,
  cursor: "pointer",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
};

export function CameraPresets({ onSetCamera }: CameraPresetsProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        display: "flex",
        gap: 4,
        zIndex: 100,
      }}
    >
      {presets.map((p) => (
        <button key={p.label} style={btnStyle} onClick={() => onSetCamera(p.pos)}>
          {p.label}
        </button>
      ))}
    </div>
  );
}

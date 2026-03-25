interface CameraPresetsProps {
  onSetCamera: (position: [number, number, number]) => void;
}

const presets: { label: string; pos: [number, number, number] }[] = [
  { label: "Iso", pos: [4.5, 3.5, 4.5] },
  { label: "Front", pos: [0, 0, 7] },
  { label: "Top", pos: [0, 7, 0.01] },
  { label: "Side", pos: [7, 0, 0] },
];

const btnStyle: React.CSSProperties = {
  padding: "5px 10px",
  fontSize: 11,
  background: "rgba(255, 255, 255, 0.92)",
  border: "1px solid #d0d5dd",
  color: "#374151",
  borderRadius: 5,
  cursor: "pointer",
  backdropFilter: "blur(8px)",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
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

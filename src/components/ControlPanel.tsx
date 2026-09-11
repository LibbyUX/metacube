import { useState } from "react";
import type { CubeConfig, ColorPaletteConfig, AxisGroup } from "../data/config";
import { getColorScaleLegendStops, getGroupColor } from "../data/colors";
import { useTheme } from "../data/themeContext";
import {
  PANEL_BG, PANEL_BORDER, CARD_BG, TEXT, TEXT_BODY, TEXT_MUTED, TEXT_DIM,
  ACCENT, ACCENT_SOFT_BG, ACCENT_SOFT_BORDER, TOOLTIP_BG, TOOLTIP_TEXT,
} from "../data/theme";

const DIVERGING_NAMES = new Set([
  "RdYlGn", "RdYlBu", "RdBu", "RdGy", "PiYG", "PRGn", "PuOr", "BrBG", "Spectral", "RdGn",
]);

function resolveScaleType(palette: ColorPaletteConfig | undefined, minVal: number): "sequential" | "diverging" {
  if (palette?.type) return palette.type;
  if (palette?.name && DIVERGING_NAMES.has(palette.name)) return "diverging";
  if (minVal < 0) return "diverging";
  return "sequential";
}

function fmt(v: number): string {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

interface ControlPanelProps {
  xs: string[];
  ys: string[];
  zs: string[];
  config: CubeConfig;
  xGroups?: AxisGroup[];
  yGroups?: AxisGroup[];
  zGroups?: AxisGroup[];
  xFilter: Set<string>;
  toggleX: (v: string) => void;
  setXFilter: (f: Set<string>) => void;
  yFilter: Set<string>;
  toggleY: (v: string) => void;
  setYFilter: (f: Set<string>) => void;
  zFilter: Set<string>;
  toggleZ: (v: string) => void;
  setZFilter: (f: Set<string>) => void;
  cellOpacity: number;
  setCellOpacity: (v: number) => void;
  maxColorValue: number;
  minColorValue?: number;
  onResetView: () => void;
  onClearSelection: () => void;
}

const FONT = "Roboto, sans-serif";

function DescTooltip({ text, anchor = "bottom" }: { text: string; anchor?: "bottom" | "top" }) {
  return (
    <div style={{
      position: "absolute",
      ...(anchor === "bottom"
        ? { bottom: "calc(100% + 5px)", left: 0 }
        : { top: "calc(100% + 5px)", left: 0 }),
      background: TOOLTIP_BG, color: TOOLTIP_TEXT,
      padding: "9px 12px", borderRadius: 7,
      fontSize: 11, whiteSpace: "pre-line", minWidth: 160, maxWidth: 260,
      pointerEvents: "none", zIndex: 600,
      boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
      fontFamily: FONT, lineHeight: 1.65, fontWeight: 400,
    }}>
      {text}
    </div>
  );
}

function DescBadge({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const [pinned, setPinned] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setPinned(p => !p)}
        style={{
          fontSize: 9, cursor: "pointer",
          color: pinned ? ACCENT : TEXT_DIM,
          border: `1px solid ${pinned ? ACCENT_SOFT_BORDER : PANEL_BORDER}`,
          background: pinned ? ACCENT_SOFT_BG : "transparent",
          borderRadius: 10, padding: "0 4px", lineHeight: 1.7, fontWeight: 700,
          userSelect: "none", fontFamily: FONT,
        }}
      >?</span>
      {(show || pinned) && <DescTooltip text={text} />}
    </span>
  );
}

const panelStyle: React.CSSProperties = {
  position: "fixed",
  top: 12, left: 12, width: 224,
  background: PANEL_BG,
  border: `1px solid ${PANEL_BORDER}`,
  borderRadius: 10,
  padding: "10px 13px",
  fontSize: 13, color: TEXT_BODY,
  zIndex: 100,
  maxHeight: "calc(100vh - 76px)",
  overflowY: "auto",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
  fontFamily: FONT,
};

const sectionStyle: React.CSSProperties = { marginBottom: 8 };
const labelStyle: React.CSSProperties = {
  fontWeight: 600, fontSize: 11,
  textTransform: "uppercase", letterSpacing: 0.5, color: TEXT_MUTED,
};
const allNoneBtn: React.CSSProperties = {
  padding: "1px 6px", fontSize: 10, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: 0.3,
  background: "transparent", border: `1px solid ${PANEL_BORDER}`,
  color: TEXT_MUTED, borderRadius: 3, cursor: "pointer", lineHeight: 1.4,
};

function CheckItem({ label, checked, onChange, indent = false }: {
  label: string; checked: boolean; onChange: () => void; indent?: boolean;
}) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "2px 0", paddingLeft: indent ? 14 : 0,
      cursor: "pointer", fontSize: 12,
      color: checked ? TEXT_BODY : TEXT_DIM,
    }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function AxisSection({
  label, values, filter, toggle, setFilter,
  groups, config, description,
}: {
  label: string;
  values: string[];
  filter: Set<string>;
  toggle: (v: string) => void;
  setFilter: (f: Set<string>) => void;
  groups?: AxisGroup[];
  config?: CubeConfig;
  description?: string;
}) {
  const [show, setShow] = useState(false);
  const [pinned, setPinned] = useState(false);
  return (
    <div style={sectionStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 3 }}>
          <span
            style={{
              ...labelStyle,
              cursor: description ? "pointer" : undefined,
              color: pinned && description ? ACCENT : TEXT_MUTED,
            }}
            onMouseEnter={description ? () => setShow(true) : undefined}
            onMouseLeave={description ? () => setShow(false) : undefined}
            onClick={description ? () => setPinned(p => !p) : undefined}
          >{label}</span>
          {description && (
            <span style={{
              fontSize: 8, position: "relative", top: -3,
              color: pinned ? ACCENT : TEXT_DIM,
              fontWeight: 700, lineHeight: 1, cursor: "pointer",
              pointerEvents: "none",
            }}>?</span>
          )}
          {description && (show || pinned) && <DescTooltip text={description} anchor="top" />}
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          <button style={allNoneBtn} onClick={() => setFilter(new Set(values))}>all</button>
          <button style={allNoneBtn} onClick={() => setFilter(new Set())}>none</button>
        </div>
      </div>
      {groups ? (
        groups.map((group) => {
          const allOn = group.members.every((m) => filter.has(m));
          const anyOn = group.members.some((m) => filter.has(m));
          const groupColor = config ? getGroupColor(group.label, config) : TEXT;
          return (
            <div key={group.label}>
              <label style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "2px 0 1px", cursor: "pointer",
                fontSize: 12, fontWeight: 700,
                color: anyOn ? groupColor : TEXT_MUTED,
              }}>
                <input
                  type="checkbox"
                  checked={allOn}
                  ref={(el) => { if (el) el.indeterminate = anyOn && !allOn; }}
                  onChange={() => {
                    const next = new Set(filter);
                    if (allOn) group.members.forEach((m) => next.delete(m));
                    else group.members.forEach((m) => next.add(m));
                    setFilter(next);
                  }}
                />
                {group.label}
              </label>
              {group.members.map((m) => {
                const sub = m.slice(group.label.length + group.separator.length);
                return (
                  <CheckItem key={m} label={sub} checked={filter.has(m)} onChange={() => toggle(m)} indent />
                );
              })}
            </div>
          );
        })
      ) : (
        values.map((v) => (
          <CheckItem key={v} label={v} checked={filter.has(v)} onChange={() => toggle(v)} />
        ))
      )}
    </div>
  );
}

export function ControlPanel({
  xs, ys, zs, config, xGroups, yGroups, zGroups,
  xFilter, toggleX, setXFilter,
  yFilter, toggleY, setYFilter,
  zFilter, toggleZ, setZFilter,
  cellOpacity, setCellOpacity,
  maxColorValue, minColorValue = 0, onResetView, onClearSelection,
}: ControlPanelProps) {
  const { theme } = useTheme();
  // Only show the count gradient when the cube is actually gradient-coloured
  // (size_colour/colour set). A uniform cube has counts too, so gating on
  // maxColorValue alone wrongly shows a scale for single-coloured cubes.
  const showScale = !!config.hasColorValues && !config.uniformCellColor;
  const legendStops = showScale && maxColorValue > 0
    ? getColorScaleLegendStops(maxColorValue, minColorValue, config.colorPalette)
    : null;

  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: TEXT }}>
        {config.title}
      </div>

      {(config.accent_datasets || config.ghost_datasets) && (
        <div style={sectionStyle}>
          <span style={labelStyle}>Cell type</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {legendStops ? (
                <div style={{ display: "flex", width: 22, height: 12, borderRadius: 2, overflow: "hidden", flexShrink: 0, border: `1px solid ${PANEL_BORDER}` }}>
                  {legendStops.map((s, i) => (
                    <div key={i} style={{ flex: 1, background: s.color }} />
                  ))}
                </div>
              ) : (
                <div style={{ width: 22, height: 12, borderRadius: 2, background: config.uniformCellColor ?? theme.cell_default, flexShrink: 0, border: `1px solid ${PANEL_BORDER}` }} />
              )}
              <span style={{ fontSize: 12, color: TEXT_BODY }}>Primary tissue</span>
            </div>
            {config.accent_datasets && (
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 22, height: 12, borderRadius: 2, background: config.accent_color ?? "#f59e0b", flexShrink: 0, border: `1px solid ${PANEL_BORDER}` }} />
                <span style={{ fontSize: 12, color: TEXT_BODY }}>{config.accent_label ?? config.accent_datasets}</span>
              </div>
            )}
            {config.ghost_datasets && (
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 22, height: 12, borderRadius: 2, background: "transparent", flexShrink: 0, border: `1.5px solid ${TEXT_DIM}`, boxSizing: "border-box" }} />
                <span style={{ fontSize: 12, color: TEXT_BODY }}>Planned</span>
              </div>
            )}
          </div>
        </div>
      )}

      {legendStops && (
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
            <span style={labelStyle}>Color scale</span>
            {config.colorLabel && <DescBadge text={config.colorLabel} />}
          </div>
          <div style={{ display: "flex", height: 10, borderRadius: 3, overflow: "hidden", border: `1px solid ${PANEL_BORDER}`, marginBottom: 3 }}>
            {legendStops.map((s, i) => <div key={i} style={{ flex: 1, background: s.color }} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: TEXT_DIM }}>
            {resolveScaleType(config.colorPalette, minColorValue) === "diverging" ? (
              <>
                <span>{fmt(-Math.max(Math.abs(minColorValue), Math.abs(maxColorValue)))}</span>
                <span>0</span>
                <span>{fmt(Math.max(Math.abs(minColorValue), Math.abs(maxColorValue)))}</span>
              </>
            ) : (
              <>
                <span>{fmt(minColorValue)}</span>
                <span>{fmt(maxColorValue)}</span>
              </>
            )}
          </div>
        </div>
      )}

      <AxisSection
        label={`${config.axes.x.label} (X)`}
        values={xs}
        filter={xFilter}
        toggle={toggleX}
        setFilter={setXFilter}
        groups={xGroups}
        config={config}
        description={config.axes.x.description}
      />
      <AxisSection
        label={`${config.axes.y.label} (Y)`}
        values={ys}
        filter={yFilter}
        toggle={toggleY}
        setFilter={setYFilter}
        groups={yGroups}
        config={config}
        description={config.axes.y.description}
      />
      <AxisSection
        label={`${config.axes.z.label} (Z)`}
        values={zs}
        filter={zFilter}
        toggle={toggleZ}
        setFilter={setZFilter}
        groups={zGroups}
        config={config}
        description={config.axes.z.description}
      />

      <div style={sectionStyle}>
        <span style={labelStyle}>Cell Opacity</span>
        <input type="range" min={0.1} max={1} step={0.05} value={cellOpacity}
          onChange={(e) => setCellOpacity(Number(e.target.value))}
          style={{ width: "100%", accentColor: ACCENT }} />
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={onResetView} style={{
          flex: 1, padding: "5px 8px", fontSize: 11,
          background: ACCENT_SOFT_BG, border: `1px solid ${ACCENT_SOFT_BORDER}`,
          color: ACCENT, borderRadius: 5, cursor: "pointer",
        }}>Reset View</button>
        <button onClick={onClearSelection} style={{
          flex: 1, padding: "5px 8px", fontSize: 11,
          background: CARD_BG, border: `1px solid ${PANEL_BORDER}`,
          color: TEXT_MUTED, borderRadius: 5, cursor: "pointer",
        }}>Clear Sel.</button>
      </div>
    </div>
  );
}

import { Fragment } from "react";
import type { CubeCell, InfoEntry } from "../data/dataModel";
import type { CubeConfig } from "../data/config";
import { AXIS_COLORS } from "../data/colors";
import {
  PANEL_BG_SOLID, PANEL_BORDER, CARD_BG, CARD_BG_ACTIVE, BACKDROP,
  TEXT_BODY, TEXT_MUTED, TEXT_DIM, ACCENT, ACCENT_SOFT_BORDER,
} from "../data/theme";

interface InfoPanelProps {
  cell: CubeCell;
  entries: InfoEntry[];
  config: CubeConfig;
  onClose: () => void;
  hoveredStudy?: string | null;
  onStudyHover?: (study: string | null) => void;
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export function InfoPanel({ cell, entries, config, onClose, hoveredStudy, onStudyHover }: InfoPanelProps) {
  const zDisplay = cell.z.includes(" - ") ? cell.z.split(" - ").slice(1).join(" - ") : cell.z;
  const cellVals: ["x" | "y" | "z", string][] = [["x", cell.x], ["y", cell.y], ["z", zDisplay]];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: BACKDROP, backdropFilter: "blur(8px)",
        fontFamily: FONT,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: PANEL_BG_SOLID, border: `1px solid ${PANEL_BORDER}`, borderRadius: 12,
          backdropFilter: "blur(10px)",
          padding: "20px 24px", maxWidth: 700, width: "calc(100vw - 80px)",
          maxHeight: "80vh", overflowY: "auto",
          boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", marginBottom: 6 }}>
              {cellVals.map(([ax, val], i) => {
                const color = config.axisColors?.[ax] ?? AXIS_COLORS[ax];
                return (
                  <span key={ax} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {i > 0 && <span style={{ color: PANEL_BORDER, marginRight: 6 }}>·</span>}
                    <span style={{ fontSize: 11, color: TEXT_MUTED }}>{config.axes[ax].label}</span>
                    <span style={{
                      padding: "1px 7px", borderRadius: 9, fontSize: 11,
                      background: `${color}14`, color,
                      border: `1px solid ${color}34`, fontWeight: 600,
                    }}>
                      {val}
                    </span>
                  </span>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: TEXT_DIM }}>
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: CARD_BG, border: `1px solid ${PANEL_BORDER}`, color: TEXT_BODY,
            borderRadius: 6, padding: "4px 12px", fontSize: 18, cursor: "pointer", lineHeight: 1,
            fontFamily: FONT,
          }}>×</button>
        </div>

        {/* Entry list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {entries.map((entry, i) => {
            const entryValues = Object.values(entry).filter(Boolean);
            const isHighlighted = hoveredStudy != null && entryValues.includes(hoveredStudy);
            return (
            <div key={i}
              style={{
                padding: "10px 12px",
                background: isHighlighted ? CARD_BG_ACTIVE : CARD_BG,
                border: `1px solid ${isHighlighted ? ACCENT_SOFT_BORDER : PANEL_BORDER}`,
                borderRadius: 8,
                cursor: onStudyHover ? "pointer" : undefined,
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={() => onStudyHover?.(entryValues[0] ?? null)}
              onMouseLeave={() => onStudyHover?.(null)}
            >
              {(entry.title ?? entry.dataset) && (
                <div style={{ fontWeight: 700, fontSize: 13, color: TEXT_BODY, marginBottom: 6, wordBreak: "break-word" }}>
                  {entry.title ?? entry.dataset}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "max-content 1fr", rowGap: 3, columnGap: 10 }}>
                {Object.entries(entry).filter(([k, v]) => !!v && k !== "dataset" && k !== "title").map(([key, val]) => {
                  const isDoi = key === "doi";
                  const isLink = key === "url" || isDoi;
                  return (
                    <Fragment key={key}>
                      <span style={{ color: TEXT_MUTED, fontWeight: 600, textTransform: "capitalize", fontSize: 12 }}>
                        {key}
                      </span>
                      {isLink ? (
                        <a
                          href={isDoi ? `https://doi.org/${val}` : val}
                          target="_blank" rel="noopener noreferrer"
                          style={{ color: ACCENT, textDecoration: "none", wordBreak: "break-all", fontSize: 12 }}
                        >
                          {val}
                        </a>
                      ) : (
                        <span style={{ color: TEXT_BODY, wordBreak: "break-word", fontSize: 12 }}>{val}</span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}

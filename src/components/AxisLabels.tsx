import { useState } from "react";
import { Text, Billboard, Html } from "@react-three/drei";
import type { AxisGroup } from "../data/config";
import { getAxisColor, getAxisColorDim, AXIS_COLORS } from "../data/colors";
import type { CubeConfig } from "../data/config";
import { useTheme } from "../data/themeContext";
import { TOOLTIP_BG, TOOLTIP_TEXT } from "../data/theme";
import { ROBOTO_BOLD_3D_URL, ROBOTO_REGULAR_3D_URL } from "../data/typography";

interface AxisLabelsProps {
  xs: string[];
  ys: string[];
  zs: string[];
  cubeSize: number;
  gap: number;
  bandX: number;
  bandY: number;
  bandZ: number;
  config: CubeConfig;
  dataXs?: Set<string>;
  dataYs?: Set<string>;
  dataZs?: Set<string>;
  fontScale?: number;
  hideAxisTitles?: boolean;
  activeXs?: Set<string>;
  activeYs?: Set<string>;
  activeZs?: Set<string>;
  partialXs?: Set<string>;
  partialYs?: Set<string>;
  partialZs?: Set<string>;
  filterMatchXs?: Set<string>;
  filterMatchYs?: Set<string>;
  filterMatchZs?: Set<string>;
  xGroups?: AxisGroup[];
  yGroups?: AxisGroup[];
  zGroups?: AxisGroup[];
  onToggleX?: (v: string) => void;
  onToggleY?: (v: string) => void;
  onToggleZ?: (v: string) => void;
  onLabelHover?: (axis: "x" | "y" | "z", value: string) => void;
  onLabelHoverEnd?: () => void;
}

function BillboardLabel({
  position, text, fontSize, color, anchorX, anchorY, fontWeight, rotation, onClick, onPointerOver, onPointerOut,
}: {
  position: [number, number, number];
  text: string;
  fontSize: number;
  color: string;
  anchorX?: "left" | "center" | "right";
  anchorY?: "top" | "middle" | "bottom";
  fontWeight?: "bold" | "normal";
  /** In-plane rotation (radians) applied within the camera-facing billboard. e.g. [0,0,Math.PI/2] → text reads bottom-to-top. */
  rotation?: [number, number, number];
  onClick?: (event: any) => void;
  onPointerOver?: (event: any) => void;
  onPointerOut?: (event: any) => void;
}) {
  const { theme, mode } = useTheme();
  // The text outline separates labels from the busy dark stage. In light mode
  // (dark text on a light page) it's an unwanted halo, so drop it there.
  const outline = mode === "dark";
  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <Text
        font={fontWeight === "bold" ? ROBOTO_BOLD_3D_URL : ROBOTO_REGULAR_3D_URL}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX ?? "center"}
        anchorY={anchorY ?? "middle"}
        fontWeight={fontWeight}
        rotation={rotation}
        outlineWidth={outline ? fontSize * 0.14 : 0}
        outlineColor={theme.axis_outline}
        outlineOpacity={outline ? 0.9 : 0}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {text}
      </Text>
    </Billboard>
  );
}

export function AxisLabels({
  xs, ys, zs,
  cubeSize, gap, bandX, bandY, bandZ,
  config,
  dataXs, dataYs, dataZs,
  fontScale = 1.3,
  hideAxisTitles = false,
  activeXs, activeYs, activeZs,
  partialXs, partialYs, partialZs,
  filterMatchXs, filterMatchYs, filterMatchZs,
  xGroups, yGroups,
  onToggleX, onToggleY, onToggleZ,
  onLabelHover, onLabelHoverEnd,
}: AxisLabelsProps) {
  const { theme } = useTheme();
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [hoverTooltip, setHoverTooltip] = useState<{ text: string; pos: [number, number, number] } | null>(null);
  const [pinnedTooltip, setPinnedTooltip] = useState<{ text: string; pos: [number, number, number] } | null>(null);

  const titleHandlers = (desc: string | undefined, pos: [number, number, number]) => {
    if (!desc) return {};
    return {
      onPointerOver: (e: any) => { e.stopPropagation(); setHoverTooltip({ text: desc, pos }); document.body.style.cursor = "pointer"; },
      onPointerOut:  (e: any) => { e.stopPropagation(); setHoverTooltip(null); document.body.style.cursor = ""; },
      onClick:       (e: any) => { e.stopPropagation(); setPinnedTooltip(p => p?.text === desc ? null : { text: desc, pos }); },
    };
  };
  const half = cubeSize / 2;
  const fs = (base: number) => base * fontScale;
  const titleOffset = 0.22 * fontScale;

  const hoverHandlers = (key: string, axis: "x" | "y" | "z", value: string) =>
    onToggleX || onToggleY || onToggleZ
      ? {
          onPointerOver: (e: any) => { e.stopPropagation(); setHoveredLabel(key); document.body.style.cursor = "pointer"; onLabelHover?.(axis, value); },
          onPointerOut:  (e: any) => { e.stopPropagation(); setHoveredLabel(null); document.body.style.cursor = ""; onLabelHoverEnd?.(); },
        }
      : {};

  const xPos = (i: number) => -half + gap * (i + 1) + bandX * i + bandX / 2;
  const yPos = (j: number) => -half + gap * (j + 1) + bandY * j + bandY / 2;
  const subLabel = (val: string, group: AxisGroup) => val.slice(group.label.length + group.separator.length);

  // Per-axis colors: use config.axisColors overrides when available (e.g. inner zoom cube)
  // Per-axis colors: use config.axisColors overrides when available (e.g. inner zoom cube)
  const axColorX = config.axisColors?.x ?? AXIS_COLORS.x;
  const axColorY = config.axisColors?.y ?? AXIS_COLORS.y;
  const axColorZ = config.axisColors?.z ?? AXIS_COLORS.z;

  const axLabelColor = (axColor: string, isActive: boolean, isPartial: boolean, isHovered: boolean, hasData: boolean, inFilter: boolean) => {
    if (!hasData) return theme.text_dim;
    if (isActive) return axColor;                     // in filter → full axis colour
    if (isPartial || isHovered) return axColor;       // involved → prominent (was a white blend, invisible on light)
    if (inFilter) return theme.text;                  // matches filter → bright text
    return theme.text_muted;                          // resting / dimmed → clearly below the bright states
  };

  // X axis label / group positions (y coords)
  // Bar and group-header offsets scale with fontScale so spacing grows with label size.
  const yInd   = -half - 0.16;
  const yBar   = -half - 0.30 * fontScale;
  const yGroup = -half - 0.44 * fontScale;
  const yTitle = -half - 0.16 - (xGroups ? 0.58 * fontScale : titleOffset);

  // Y axis label / group positions (x coords, mirrored)
  const xInd   = -half - 0.16;
  const xBar   = -half - 0.30 * fontScale;
  const xGroup = -half - 0.47 * fontScale;
  const xTitle = xInd - (yGroups ? 0.55 * fontScale : titleOffset);


  const handleGroupClick = (group: AxisGroup, e: any) => {
    e.stopPropagation();
    if (!onToggleX) return;
    const allOn = group.members.every((m) => activeXs?.has(m));
    if (allOn) group.members.filter((m) => activeXs?.has(m)).forEach((m) => onToggleX(m));
    else group.members.filter((m) => !activeXs?.has(m)).forEach((m) => onToggleX(m));
  };

  const handleGroupClickY = (group: AxisGroup, e: any) => {
    e.stopPropagation();
    if (!onToggleY) return;
    const allOn = group.members.every((m) => activeYs?.has(m));
    if (allOn) group.members.filter((m) => activeYs?.has(m)).forEach((m) => onToggleY(m));
    else group.members.filter((m) => !activeYs?.has(m)).forEach((m) => onToggleY(m));
  };

  return (
    <group>
      {/* X axis value labels */}
      {xs.map((val, i) => {
        const x = xPos(i);
        const hasData = dataXs ? dataXs.has(val) : true;
        const isActive = activeXs?.has(val) ?? false;
        const isPartial = !isActive && (partialXs?.has(val) ?? false);
        const isHovered = hoveredLabel === `x-${val}`;
        const group = xGroups?.find((g) => g.members.includes(val));
        const displayText = group ? subLabel(val, group) : val;
        const inFilter = filterMatchXs ? filterMatchXs.has(val) : true;

        let color: string;
        if (!hasData) {
          color = theme.text_dim;
        } else if (group) {
          const sc = getAxisColor(group.label, config);
          const scDim = getAxisColorDim(group.label, config);
          color = isActive || isPartial || isHovered || inFilter ? sc : scDim;
        } else {
          color = axLabelColor(axColorX, isActive, isPartial, isHovered, true, inFilter);
        }

        return (
          <BillboardLabel
            key={`x-${val}`}
            position={[x, yInd, half + 0.12]}
            text={displayText}
            fontSize={fs(hasData ? 0.055 : 0.04)}
            color={color}
            onClick={onToggleX ? (e) => { e.stopPropagation(); onToggleX(val); } : undefined}
            {...hoverHandlers(`x-${val}`, "x", val)}
          />
        );
      })}

      {/* X axis group headers + bracket bars */}
      {xGroups?.map((group) => {
        const indices = group.members.map((m) => xs.indexOf(m)).filter((i) => i >= 0).sort((a, b) => a - b);
        if (indices.length === 0) return null;

        // Place the group label in the gap between the two middle members
        // (even N → exact centre gap; odd N → gap just above the middle item).
        const mid = Math.floor((indices.length - 1) / 2);
        const cx = indices.length === 1
          ? xPos(indices[0])
          : (xPos(indices[mid]) + xPos(indices[mid + 1])) / 2;
        const xLeft  = xPos(indices[0]) - bandX * 0.42;
        const xRight = xPos(indices[indices.length - 1]) + bandX * 0.42;
        const barCx  = (xLeft + xRight) / 2;
        const barWidth = xRight - xLeft;

        const allOn = group.members.every((m) => activeXs?.has(m));
        const anyOn = group.members.some((m) => activeXs?.has(m));
        const anyMatch = filterMatchXs ? group.members.some((m) => filterMatchXs.has(m)) : true;
        const isHovered = hoveredLabel === `grp-${group.label}`;
        const sc = getAxisColor(group.label, config);
        const labelColor = anyOn || isHovered ? sc : anyMatch ? sc : getAxisColorDim(group.label, config);
        const barOpacity = anyOn ? 0.85 : anyMatch ? 0.35 : 0.12;

        return (
          <group key={`grp-${group.label}`}>
            <BillboardLabel
              position={[cx, yGroup, half + 0.12]}
              text={`${allOn ? "▼ " : anyOn ? "◆ " : "▷ "}${group.label}`}
              fontSize={fs(0.078)}
              color={labelColor}
              fontWeight="bold"
              onClick={(e) => handleGroupClick(group, e)}
              onPointerOver={(e: any) => { e.stopPropagation(); setHoveredLabel(`grp-${group.label}`); document.body.style.cursor = "pointer"; }}
              onPointerOut={(e: any) => { e.stopPropagation(); setHoveredLabel(null); document.body.style.cursor = ""; }}
            />
          </group>
        );
      })}

      {/* X axis title */}
      {!hideAxisTitles && (() => {
        const desc = config.axes.x.description;
        const qPos: [number, number, number] = [0.28, yTitle + 0.05, half + 0.12];
        return (
          <>
            <BillboardLabel
              position={[0, yTitle, half + 0.12]}
              text={config.axes.x.label}
              fontSize={fs(0.09)}
              color={pinnedTooltip?.text === desc ? theme.accent : theme.axis_title}
              fontWeight="bold"
              {...titleHandlers(desc, qPos)}
            />
            {desc && (
              <BillboardLabel
                position={qPos}
                text="?"
                fontSize={fs(0.034)}
                color={pinnedTooltip?.text === desc ? theme.accent : theme.axis_title}
                {...titleHandlers(desc, qPos)}
              />
            )}
          </>
        );
      })()}

      {/* Y axis value labels */}
      {ys.map((val, j) => {
        const y = yPos(j);
        const hasData = dataYs ? dataYs.has(val) : true;
        const isActive = activeYs?.has(val) ?? false;
        const isPartial = !isActive && (partialYs?.has(val) ?? false);
        const isHovered = hoveredLabel === `y-${val}`;
        const group = yGroups?.find((g) => g.members.includes(val));
        const displayText = group ? subLabel(val, group) : val;
        const inFilter = filterMatchYs ? filterMatchYs.has(val) : true;

        let color: string;
        if (!hasData) {
          color = theme.text_dim;
        } else if (group) {
          const sc = getAxisColor(group.label, config);
          const scDim = getAxisColorDim(group.label, config);
          color = isActive || isPartial || isHovered || inFilter ? sc : scDim;
        } else {
          color = axLabelColor(axColorY, isActive, isPartial, isHovered, hasData, inFilter);
        }

        return (
          <BillboardLabel
            key={`y-${val}`}
            position={[xInd, y, half + 0.12]}
            text={displayText}
            fontSize={fs(hasData ? 0.055 : 0.04)}
            color={color}
            anchorX="right"
            onClick={onToggleY ? (e) => { e.stopPropagation(); onToggleY(val); } : undefined}
            {...hoverHandlers(`y-${val}`, "y", val)}
          />
        );
      })}

      {/* Y axis group headers + vertical bracket bars */}
      {yGroups?.map((group) => {
        const indices = group.members.map((m) => ys.indexOf(m)).filter((i) => i >= 0).sort((a, b) => a - b);
        if (indices.length === 0) return null;

        // Place the group label in the gap between the two middle members.
        const ymid = Math.floor((indices.length - 1) / 2);
        const cy = indices.length === 1
          ? yPos(indices[0])
          : (yPos(indices[ymid]) + yPos(indices[ymid + 1])) / 2;
        const yTop    = yPos(indices[0]) + bandY * 0.42;
        const yBottom = yPos(indices[indices.length - 1]) - bandY * 0.42;
        const barCy   = (yTop + yBottom) / 2;
        const barHeight = Math.max(yTop - yBottom, 0.006 * fontScale);

        const allOn    = group.members.every((m) => activeYs?.has(m));
        const anyOn    = group.members.some((m) => activeYs?.has(m));
        const anyMatch = filterMatchYs ? group.members.some((m) => filterMatchYs.has(m)) : true;
        const isHovG   = hoveredLabel === `grp-y-${group.label}`;
        const sc       = getAxisColor(group.label, config);
        const labelColor = anyOn || isHovG ? sc : anyMatch ? sc : getAxisColorDim(group.label, config);
        const barOpacity = anyOn ? 0.85 : anyMatch ? 0.35 : 0.12;

        // Rotated header sits just left of THIS group's own value labels (so a
        // small group with short labels stays close to the cube instead of being
        // pushed out by some other group's long label).
        // When tilt_group_labels is set, the header is rotated to run vertically
        // (parallel to the Y axis): placed just left of THIS group's own value
        // labels, and font-scaled to fit the group's span so short groups don't
        // overflow into neighbours or the axis title. Otherwise it stays a plain
        // horizontal header in the gap between the two middle members.
        const tilt = config.tiltGroupLabels ?? false;
        // Group's true vertical extent (barHeight is clamped to a tiny floor and
        // unusable here); ~0.55 em average glyph advance.
        const groupHeight = Math.abs(yPos(indices[indices.length - 1]) - yPos(indices[0])) + bandY;
        const headerChars = group.label.length + 2; // + "▷ " prefix
        const headerFs = Math.min(fs(0.072), Math.max(0.038, (groupHeight * 0.9) / (headerChars * 0.55)));
        // Place the rotated header clear of THIS group's widest value label: its
        // text width (right-anchored at xInd, extending left) + half the header's
        // own line height + a small margin.
        const grpMaxLen = group.members.reduce((m, mem) => Math.max(m, subLabel(mem, group).length), 1);
        const headerX = xInd - grpMaxLen * 0.55 * fs(0.055) - headerFs * 0.6 - 0.07 * fontScale;

        return (
          <group key={`grp-y-${group.label}`}>
            <BillboardLabel
              position={tilt ? [headerX, barCy, half + 0.12] : [xGroup, cy, half + 0.12]}
              text={`${allOn ? "▼ " : anyOn ? "◆ " : "▷ "}${group.label}`}
              fontSize={tilt ? headerFs : fs(0.078)}
              color={labelColor}
              fontWeight="bold"
              anchorX={tilt ? "center" : "right"}
              anchorY={tilt ? "middle" : "middle"}
              rotation={tilt ? [0, 0, Math.PI / 2] : undefined}
              onClick={(e) => handleGroupClickY(group, e)}
              onPointerOver={(e: any) => { e.stopPropagation(); setHoveredLabel(`grp-y-${group.label}`); document.body.style.cursor = "pointer"; }}
              onPointerOut={(e: any) => { e.stopPropagation(); setHoveredLabel(null); document.body.style.cursor = ""; }}
            />
          </group>
        );
      })}

      {!hideAxisTitles && (() => {
        const desc = config.axes.y.description;
        const qPos: [number, number, number] = [xTitle + 0.03, half + 0.19, half + 0.12];
        return (
          <>
            <BillboardLabel
              position={[xTitle, half + 0.16, half + 0.12]}
              text={config.axes.y.label}
              fontSize={fs(0.09)}
              color={pinnedTooltip?.text === desc ? theme.accent : theme.axis_title}
              anchorX="right"
              fontWeight="bold"
              {...titleHandlers(desc, qPos)}
            />
            {desc && (
              <BillboardLabel
                position={qPos}
                text="?"
                fontSize={fs(0.034)}
                color={pinnedTooltip?.text === desc ? theme.accent : theme.axis_title}
                anchorX="left"
                {...titleHandlers(desc, qPos)}
              />
            )}
          </>
        );
      })()}

      {/* Z axis value labels */}
      {zs.map((val, k) => {
        const z = -half + gap * (k + 1) + bandZ * k + bandZ / 2;
        const hasData = dataZs ? dataZs.has(val) : true;
        const isActive = activeZs?.has(val) ?? false;
        const isPartial = !isActive && (partialZs?.has(val) ?? false);
        const isHovered = hoveredLabel === `z-${val}`;
        const inFilter = filterMatchZs ? filterMatchZs.has(val) : true;
        const displayVal = val.includes(" - ") ? val.split(" - ").slice(1).join(" - ") : val;
        return (
          <BillboardLabel
            key={`z-${val}`}
            position={[half + 0.16, -half - 0.16, z]}
            text={displayVal}
            fontSize={fs(hasData ? 0.06 : 0.045)}
            color={axLabelColor(axColorZ, isActive, isPartial, isHovered, hasData, inFilter)}
            anchorX="left"
            onClick={onToggleZ ? (e) => { e.stopPropagation(); onToggleZ(val); } : undefined}
            {...hoverHandlers(`z-${val}`, "z", val)}
          />
        );
      })}
      {!hideAxisTitles && (() => {
        const desc = config.axes.z.description;
        const qPos: [number, number, number] = [half + 0.65, -half - 0.16 - titleOffset + 0.05, 0];
        return (
          <>
            <BillboardLabel
              position={[half + 0.16, -half - 0.16 - titleOffset, 0]}
              text={config.axes.z.label}
              fontSize={fs(0.09)}
              color={pinnedTooltip?.text === desc ? theme.accent : theme.axis_title}
              anchorX="left"
              fontWeight="bold"
              {...titleHandlers(desc, qPos)}
            />
            {desc && (
              <BillboardLabel
                position={qPos}
                text="?"
                fontSize={fs(0.034)}
                color={pinnedTooltip?.text === desc ? theme.accent : theme.axis_title}
                anchorX="left"
                {...titleHandlers(desc, qPos)}
              />
            )}
          </>
        );
      })()}

      {/* Description tooltip (hover or pinned) */}
      {(pinnedTooltip ?? hoverTooltip) && (() => {
        const t = pinnedTooltip ?? hoverTooltip!;
        return (
          <Html position={t.pos} center zIndexRange={[400, 0]} style={{ pointerEvents: "none" }}>
            <div style={{
              transform: "translateY(calc(-100% - 10px))",
              background: TOOLTIP_BG, color: TOOLTIP_TEXT,
              padding: "10px 14px", borderRadius: 8,
              fontSize: 12, minWidth: 180, maxWidth: 320, whiteSpace: "pre-line",
              pointerEvents: "none",
              fontFamily: "Roboto, sans-serif",
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              lineHeight: 1.65, textAlign: "left",
              outline: pinnedTooltip ? `2px solid ${theme.accent}` : "none",
              outlineOffset: 2,
            }}>
              {t.text}
            </div>
          </Html>
        );
      })()}
    </group>
  );
}

import { useMemo, useCallback, useState } from "react";
import {
  CubeCell, buildCubeCells, getXs, getYs, getZs, CubeRecord,
  distanceFromOrigin, cellKey,
} from "../data/dataModel";
import { createColorScale } from "../data/colors";
import { useTheme } from "../data/themeContext";

import type { CubeConfig, AxisGroup } from "../data/config";
import { OuterCube } from "./OuterCube";
import { CubeCellMesh } from "./CubeCellMesh";
import { AxisLabels } from "./AxisLabels";

interface CubeMapProps {
  records: CubeRecord[];
  scaleMode: string;
  sortMode: string;
  config: CubeConfig;
  cellOpacity: number;
  xFilter: Set<string>;
  yFilter: Set<string>;
  zFilter: Set<string>;
  hoveredCell: CubeCell | null;
  selectedCell: CubeCell | null;
  selectedCells?: Set<string>;
  onHover: (c: CubeCell | null) => void;
  onSelect: (c: CubeCell) => void;
  axisXs?: string[];
  axisYs?: string[];
  axisZs?: string[];
  fontScale?: number;
  hideAxisTitles?: boolean;
  xGroups?: AxisGroup[];
  yGroups?: AxisGroup[];
  zGroups?: AxisGroup[];
  onToggleX?: (v: string) => void;
  onToggleY?: (v: string) => void;
  onToggleZ?: (v: string) => void;
  uniformCellColor?: string;
}

const CUBE_SIZE = 3.8;
const GAP = 0.025;

export function CubeMap({
  records, config,
  cellOpacity,
  xFilter, yFilter, zFilter,
  hoveredCell, selectedCell, selectedCells,
  onHover, onSelect,
  axisXs, axisYs, axisZs,
  xGroups, yGroups, zGroups, fontScale, hideAxisTitles,
  onToggleX, onToggleY, onToggleZ,
  uniformCellColor,
}: CubeMapProps) {
  const { theme } = useTheme();
  const cells = useMemo(() => buildCubeCells(records, config?.colorAggregation), [records, config?.colorAggregation]);

  const hasActiveFilter = xFilter.size > 0 || yFilter.size > 0 || zFilter.size > 0;

  const cellMatchesFilter = useCallback((cell: { x: string; y: string; z: string }) => {
    if (!hasActiveFilter) return true;
    const xMatch = xFilter.size === 0 || xFilter.has(cell.x);
    const yMatch = yFilter.size === 0 || yFilter.has(cell.y);
    const zMatch = zFilter.size === 0 || zFilter.has(cell.z);
    return xMatch && yMatch && zMatch;
  }, [hasActiveFilter, xFilter, yFilter, zFilter]);

  const allXs = useMemo(() => axisXs ?? getXs(records), [axisXs, records]);
  const allYs = useMemo(() => axisYs ?? getYs(records), [axisYs, records]);
  const allZs = useMemo(() => axisZs ?? getZs(records), [axisZs, records]);

  const hasColorValues = config?.hasColorValues ?? false;
  const maxColorValue = useMemo(
    () => Math.max(...cells.map(c => c.color ?? 0), 1),
    [cells],
  );
  const minColorValue = useMemo(
    () => Math.min(...cells.map(c => c.color ?? 0), 0),
    [cells],
  );
  const colorScale = useMemo(
    () => createColorScale(maxColorValue, minColorValue, config?.colorPalette),
    [maxColorValue, minColorValue, config?.colorPalette],
  );

  const hasIndividualSelection = (selectedCells?.size ?? 0) > 0;

  const partialXs = useMemo(() => {
    if (!selectedCells?.size) return undefined;
    const s = new Set<string>();
    for (const k of selectedCells) { const x = k.split("|")[0]; if (!xFilter.has(x)) s.add(x); }
    return s.size > 0 ? s : undefined;
  }, [selectedCells, xFilter]);

  const partialYs = useMemo(() => {
    if (!selectedCells?.size) return undefined;
    const s = new Set<string>();
    for (const k of selectedCells) { const y = k.split("|")[1]; if (y !== undefined && !yFilter.has(y)) s.add(y); }
    return s.size > 0 ? s : undefined;
  }, [selectedCells, yFilter]);

  const partialZs = useMemo(() => {
    if (!selectedCells?.size) return undefined;
    const s = new Set<string>();
    for (const k of selectedCells) { const z = k.split("|")[2]; if (z !== undefined && !zFilter.has(z)) s.add(z); }
    return s.size > 0 ? s : undefined;
  }, [selectedCells, zFilter]);

  const half = CUBE_SIZE / 2;
  const xCount = allXs.length;
  const yCount = allYs.length;
  const zCount = allZs.length;

  const bandX = (CUBE_SIZE - GAP * (xCount + 1)) / xCount;
  const bandY = (CUBE_SIZE - GAP * (yCount + 1)) / yCount;
  const bandZ = (CUBE_SIZE - GAP * (zCount + 1)) / zCount;
  const cellSize = Math.min(bandX, bandY, bandZ);

  const xFor = (i: number) => -half + GAP * (i + 1) + bandX * i + bandX / 2;
  const yFor = (j: number) => -half + GAP * (j + 1) + bandY * j + bandY / 2;
  const zFor = (k: number) => -half + GAP * (k + 1) + bandZ * k + bandZ / 2;

  const maxDist = useMemo(
    () => Math.sqrt(xCount ** 2 + yCount ** 2 + zCount ** 2) / 2,
    [xCount, yCount, zCount]
  );

  const hasSelection = selectedCell !== null;

  const [hoveredAxisSlice, setHoveredAxisSlice] = useState<{ axis: "x" | "y" | "z"; value: string } | null>(null);

  const dataXs = useMemo(() => new Set(getXs(records)), [records]);
  const dataYs = useMemo(() => new Set(getYs(records)), [records]);
  const dataZs = useMemo(() => new Set(getZs(records)), [records]);

  const filterMatchXs = useMemo(() => {
    if (!hasActiveFilter) return undefined;
    const s = new Set<string>();
    for (const cell of cells) { if (cellMatchesFilter(cell)) s.add(cell.x); }
    return s;
  }, [cells, hasActiveFilter, cellMatchesFilter]);

  const filterMatchYs = useMemo(() => {
    if (!hasActiveFilter) return undefined;
    const s = new Set<string>();
    for (const cell of cells) { if (cellMatchesFilter(cell)) s.add(cell.y); }
    return s;
  }, [cells, hasActiveFilter, cellMatchesFilter]);

  const filterMatchZs = useMemo(() => {
    if (!hasActiveFilter) return undefined;
    const s = new Set<string>();
    for (const cell of cells) { if (cellMatchesFilter(cell)) s.add(cell.z); }
    return s;
  }, [cells, hasActiveFilter, cellMatchesFilter]);

  return (
    <group>
      <OuterCube size={CUBE_SIZE} />
      <AxisLabels
        xs={allXs} ys={allYs} zs={allZs}
        cubeSize={CUBE_SIZE} gap={GAP}
        bandX={bandX} bandY={bandY} bandZ={bandZ}
        config={config}
        dataXs={dataXs} dataYs={dataYs} dataZs={dataZs}
        fontScale={fontScale}
        hideAxisTitles={hideAxisTitles}
        activeXs={xFilter} activeYs={yFilter} activeZs={zFilter}
        partialXs={partialXs} partialYs={partialYs} partialZs={partialZs}
        filterMatchXs={filterMatchXs} filterMatchYs={filterMatchYs} filterMatchZs={filterMatchZs}
        xGroups={xGroups}
        yGroups={yGroups}
        zGroups={zGroups}
        onToggleX={onToggleX} onToggleY={onToggleY} onToggleZ={onToggleZ}
        onLabelHover={(axis, value) => setHoveredAxisSlice({ axis, value })}
        onLabelHoverEnd={() => setHoveredAxisSlice(null)}
      />

      {cells.map((cell) => {
        const xi = allXs.indexOf(cell.x);
        const yi = allYs.indexOf(cell.y);
        const zi = allZs.indexOf(cell.z);
        if (xi === -1 || yi === -1 || zi === -1) return null;

        const dist = distanceFromOrigin(xi, yi, zi);
        const normDist = dist / maxDist;
        const distanceFade = Math.max(0.5, 1 - normDist * 0.5);

        const color = uniformCellColor
          ?? (config?.hasColorValues ? colorScale(cell.color ?? 0) : theme.cell_default);
        const key = cellKey(cell);

        const isHovered =
          (hoveredCell?.x === cell.x && hoveredCell?.y === cell.y && hoveredCell?.z === cell.z) ||
          (hoveredAxisSlice?.axis === "x" && hoveredAxisSlice.value === cell.x) ||
          (hoveredAxisSlice?.axis === "y" && hoveredAxisSlice.value === cell.y) ||
          (hoveredAxisSlice?.axis === "z" && hoveredAxisSlice.value === cell.z);

        const isIndividuallySelected = selectedCells?.has(key) ?? false;
        const isSelected =
          (selectedCell?.x === cell.x && selectedCell?.y === cell.y && selectedCell?.z === cell.z) ||
          isIndividuallySelected;
        const isDimmed = hasSelection && !isSelected;
        const matchesFilter = cellMatchesFilter(cell);
        const anySelectionActive = hasActiveFilter || hasIndividualSelection;
        const filterOpacity = anySelectionActive
          ? ((hasActiveFilter && matchesFilter) || isIndividuallySelected ? 1.0 : 0.15)
          : cellOpacity * distanceFade;

        const ghostPattern = config?.ghost_datasets;
        const isGhost = ghostPattern
          ? cell.datasets.length > 0 && cell.datasets.every((d) => d.includes(ghostPattern))
          : false;
        const isGhostHighlighted = isGhost && anySelectionActive &&
          ((hasActiveFilter && matchesFilter) || isIndividuallySelected);

        const accentPattern = config?.accent_datasets;
        const isAccent = !isGhost && accentPattern
          ? cell.datasets.length > 0 && cell.datasets.some((d) => d.includes(accentPattern))
          : false;

        return (
          <CubeCellMesh
            key={key}
            cell={cell}
            position={[xFor(xi), yFor(yi), zFor(zi)]}
            dimensions={[cellSize, cellSize, cellSize]}
            color={color}
            opacity={filterOpacity}
            isHovered={isHovered}
            isSelected={isSelected}
            isDimmed={isDimmed && !hasActiveFilter}
            isGhost={isGhost}
            isGhostHighlighted={isGhostHighlighted}
            isAccent={isAccent}
            accentColor={config?.accent_color ?? theme.cell_accent}
            unlit={!!config?.hasColorValues}
            onHover={onHover}
            onClick={onSelect}
          />
        );
      })}
    </group>
  );
}

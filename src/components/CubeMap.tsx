import { useMemo } from "react";
import {
  CubeCell,
  buildCubeCells,
  getOrganisms,
  getModalities,
  getOrgans,
  DatasetRecord,
  TRIMMED_ORGANISMS,
  TRIMMED_MODALITIES,
  TRIMMED_ORGANS,
  isOriginCell,
  distanceFromOrigin,
} from "../data/datasets";
import { createSizeColorScale } from "../data/colors";
import { ColorBy } from "../hooks/useStore";
import { OuterCube } from "./OuterCube";
import { CubeCellMesh } from "./CubeCellMesh";
import { PhantomSlot } from "./PhantomSlot";
import { OriginMarker } from "./OriginMarker";
import { AxisLabels } from "./AxisLabels";

interface CubeMapProps {
  records: DatasetRecord[];
  scaleMode: string;
  sortMode: string;
  colorBy: ColorBy;
  cubeOpacity: number;
  cellOpacity: number;
  organismFilter: Set<string>;
  modalityFilter: Set<string>;
  organFilter: Set<string>;
  hoveredCell: CubeCell | null;
  selectedCell: CubeCell | null;
  onHover: (c: CubeCell | null) => void;
  onSelect: (c: CubeCell) => void;
  axisOrganisms?: string[];
  axisModalities?: string[];
  axisOrgans?: string[];
}

const CUBE_SIZE = 3.8;
const GAP = 0.025;

export function CubeMap({
  records,
  colorBy,
  cubeOpacity,
  cellOpacity,
  organismFilter,
  modalityFilter,
  organFilter,
  hoveredCell,
  selectedCell,
  onHover,
  onSelect,
  axisOrganisms,
  axisModalities,
  axisOrgans,
}: CubeMapProps) {
  const filteredRecords = useMemo(
    () => {
      const filtered = records.filter(
        (r) =>
          organismFilter.has(r.organism) &&
          modalityFilter.has(r.modality) &&
          organFilter.has(r.organ)
      );
      // If filters eliminated everything, skip them (stale filters from dataset switch)
      if (filtered.length === 0 && records.length > 0) return records;
      return filtered;
    },
    [records, organismFilter, modalityFilter, organFilter]
  );

  const cells = useMemo(() => buildCubeCells(filteredRecords), [filteredRecords]);

  // Spatial ordering — from props or static defaults
  const allOrganisms = useMemo(() => axisOrganisms ?? [...TRIMMED_ORGANISMS] as string[], [axisOrganisms]);
  const allModalities = useMemo(() => axisModalities ?? [...TRIMMED_MODALITIES] as string[], [axisModalities]);
  const allOrgans = useMemo(() => axisOrgans ?? [...TRIMMED_ORGANS] as string[], [axisOrgans]);

  const dataKeys = useMemo(
    () => new Set(cells.map((c) => `${c.organism}|${c.modality}|${c.organ}`)),
    [cells]
  );

  const maxSize = useMemo(
    () => Math.max(...cells.map((c) => c.size), 1),
    [cells]
  );

  const sizeColor = useMemo(() => createSizeColorScale(maxSize), [maxSize]);

  const half = CUBE_SIZE / 2;
  const orgCount = allOrganisms.length;
  const modCount = allModalities.length;
  const organCount = allOrgans.length;

  // Uniform cell size
  const bandX = (CUBE_SIZE - GAP * (orgCount + 1)) / orgCount;
  const bandY = (CUBE_SIZE - GAP * (modCount + 1)) / modCount;
  const bandZ = (CUBE_SIZE - GAP * (organCount + 1)) / organCount;
  const cellSize = Math.min(bandX, bandY, bandZ);

  const xFor = (i: number) => -half + GAP * (i + 1) + bandX * i + bandX / 2;
  const yFor = (j: number) => -half + GAP * (j + 1) + bandY * j + bandY / 2;
  const zFor = (k: number) => -half + GAP * (k + 1) + bandZ * k + bandZ / 2;

  const maxDist = useMemo(
    () => Math.sqrt(orgCount ** 2 + modCount ** 2 + organCount ** 2) / 2,
    [orgCount, modCount, organCount]
  );

  const hasSelection = selectedCell !== null;

  // Collect data organisms/modalities/organs for label styling
  const dataOrganisms = useMemo(
    () => new Set(getOrganisms(filteredRecords)),
    [filteredRecords]
  );
  const dataModalities = useMemo(
    () => new Set(getModalities(filteredRecords)),
    [filteredRecords]
  );
  const dataOrgans = useMemo(
    () => new Set(getOrgans(filteredRecords)),
    [filteredRecords]
  );

  return (
    <group>
      <OuterCube size={CUBE_SIZE} opacity={cubeOpacity} />
      <AxisLabels
        organisms={allOrganisms}
        modalities={allModalities}
        organs={allOrgans}
        cubeSize={CUBE_SIZE}
        gap={GAP}
        bandX={bandX}
        bandY={bandY}
        bandZ={bandZ}
        dataOrganisms={dataOrganisms}
        dataModalities={dataModalities}
        dataOrgans={dataOrgans}
      />

      {/* Phantom slots — only render within a distance threshold to keep mesh count down */}
      {allOrganisms.map((org, oi) =>
        allModalities.map((mod, mi) =>
          allOrgans.map((organ, ti) => {
            const key = `${org}|${mod}|${organ}`;
            if (dataKeys.has(key)) return null;
            const dist = distanceFromOrigin(oi, mi, ti, allOrganisms, allModalities, allOrgans);
            // Pseudo-random selection: hash the indices to scatter phantoms
            const hash = ((oi * 7 + mi * 13 + ti * 23) * 2654435761) >>> 0;
            const rand = (hash & 0xffff) / 0xffff; // 0..1
            // Keep ~15% of cells, biased toward low-index corner
            const normDist = dist / maxDist;
            if (rand > 0.15 + 0.3 * (1 - normDist)) return null;
            const phantomOpacity = Math.max(0.01, 0.1 * (1 - normDist * 0.8));
            return (
              <PhantomSlot
                key={`p-${key}`}
                position={[xFor(oi), yFor(mi), zFor(ti)]}
                dimensions={[cellSize, cellSize, cellSize]}
                opacity={phantomOpacity}
              />
            );
          })
        )
      )}

      {/* Origin markers */}
      {allOrganisms.map((org, oi) =>
        allModalities.map((mod, mi) =>
          allOrgans.map((organ, ti) => {
            if (!isOriginCell(org, mod, organ)) return null;
            return (
              <OriginMarker
                key={`o-${org}|${mod}|${organ}`}
                position={[xFor(oi), yFor(mi), zFor(ti)]}
                dimensions={[cellSize + 0.02, cellSize + 0.02, cellSize + 0.02]}
              />
            );
          })
        )
      )}

      {/* Data cells — uniform cubes, colored by size */}
      {cells.map((cell) => {
        const oi = allOrganisms.indexOf(cell.organism);
        const mi = allModalities.indexOf(cell.modality);
        const ti = allOrgans.indexOf(cell.organ);
        if (oi === -1 || mi === -1 || ti === -1) return null;

        const dist = distanceFromOrigin(oi, mi, ti, allOrganisms, allModalities, allOrgans);
        const normDist = dist / maxDist;
        const distanceFade = Math.max(0.5, 1 - normDist * 0.5);

        const color = colorBy === "size"
          ? sizeColor(cell.size)
          : colorBy === "organism"
            ? sizeColor(cell.size)  // default to size
            : sizeColor(cell.size);

        const isHovered =
          hoveredCell?.organism === cell.organism &&
          hoveredCell?.modality === cell.modality &&
          hoveredCell?.organ === cell.organ;
        const isSelected =
          selectedCell?.organism === cell.organism &&
          selectedCell?.modality === cell.modality &&
          selectedCell?.organ === cell.organ;
        const isDimmed = hasSelection && !isSelected;

        return (
          <CubeCellMesh
            key={`${cell.organism}|${cell.modality}|${cell.organ}`}
            cell={cell}
            position={[xFor(oi), yFor(mi), zFor(ti)]}
            dimensions={[cellSize, cellSize, cellSize]}
            color={color}
            opacity={cellOpacity * distanceFade}
            isHovered={isHovered}
            isSelected={isSelected}
            isDimmed={isDimmed}
            onHover={onHover}
            onClick={onSelect}
          />
        );
      })}
    </group>
  );
}

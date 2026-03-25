import { useRef, useMemo, useCallback, useState } from "react";
import {
  rawRecords,
  getOrganisms,
  getModalities,
  getOrgans,
  TRIMMED_ORGANISMS,
  TRIMMED_MODALITIES,
  TRIMMED_ORGANS,
  CubeCell,
} from "./data/datasets";
import { useStore } from "./hooks/useStore";
import { Scene, SceneHandle } from "./components/Scene";
import { Tooltip } from "./components/Tooltip";
import { ControlPanel } from "./components/ControlPanel";
import { DetailsPanel } from "./components/DetailsPanel";
import { CameraPresets } from "./components/CameraPresets";
import { TreemapOverlay } from "./components/TreemapOverlay";

const CUBE_SIZE = 3.8;
const GAP = 0.025;

/** Compute the world position of a cell in the cube grid */
function cellWorldPosition(cell: CubeCell): [number, number, number] {
  const allOrgs = [...TRIMMED_ORGANISMS] as string[];
  const allMods = [...TRIMMED_MODALITIES] as string[];
  const allOrgans = [...TRIMMED_ORGANS] as string[];

  const half = CUBE_SIZE / 2;
  const bandX = (CUBE_SIZE - GAP * (allOrgs.length + 1)) / allOrgs.length;
  const bandY = (CUBE_SIZE - GAP * (allMods.length + 1)) / allMods.length;
  const bandZ = (CUBE_SIZE - GAP * (allOrgans.length + 1)) / allOrgans.length;

  const oi = allOrgs.indexOf(cell.organism);
  const mi = allMods.indexOf(cell.modality);
  const ti = allOrgans.indexOf(cell.organ);

  const x = -half + GAP * (oi + 1) + bandX * oi + bandX / 2;
  const y = -half + GAP * (mi + 1) + bandY * mi + bandY / 2;
  const z = -half + GAP * (ti + 1) + bandZ * ti + bandZ / 2;

  return [x, y, z];
}

export default function App() {
  const dataOrganisms = useMemo(() => getOrganisms(rawRecords), []);
  const dataModalities = useMemo(() => getModalities(rawRecords), []);
  const dataOrgans = useMemo(() => getOrgans(rawRecords), []);
  const store = useStore(dataOrganisms, dataModalities, dataOrgans);
  const sceneRef = useRef<SceneHandle>(null);

  const [treemapCell, setTreemapCell] = useState<CubeCell | null>(null);
  const [zoomTarget, setZoomTarget] = useState<[number, number, number] | null>(null);
  const [showTreemap, setShowTreemap] = useState(false);
  const [zoomingBack, setZoomingBack] = useState(false);

  const displayOrganisms = useMemo(
    () => (TRIMMED_ORGANISMS as readonly string[]).filter((o) => dataOrganisms.includes(o)),
    [dataOrganisms]
  );
  const displayModalities = useMemo(
    () => (TRIMMED_MODALITIES as readonly string[]).filter((m) => dataModalities.includes(m)),
    [dataModalities]
  );
  const displayOrgans = useMemo(
    () => (TRIMMED_ORGANS as readonly string[]).filter((o) => dataOrgans.includes(o)),
    [dataOrgans]
  );

  const totalSize = useMemo(
    () => rawRecords.reduce((sum, r) => sum + r.datasetSize, 0),
    []
  );
  const maxSize = useMemo(
    () => Math.max(...rawRecords.map((r) => r.datasetSize)),
    []
  );

  const handleResetView = useCallback(() => {
    setShowTreemap(false);
    setTreemapCell(null);
    setZoomTarget(null);
    setZoomingBack(true);
    store.setSelectedCell(null);
  }, [store.setSelectedCell]);

  const handleSetCamera = useCallback(
    (pos: [number, number, number]) => {
      sceneRef.current?.setCamera(pos);
      setZoomTarget(null);
      setShowTreemap(false);
      setZoomingBack(false);
    },
    []
  );

  const handleClearSelection = useCallback(() => {
    if (showTreemap) {
      // Close treemap and zoom back
      setShowTreemap(false);
      setTreemapCell(null);
      setZoomTarget(null);
      setZoomingBack(true);
      store.setSelectedCell(null);
    } else {
      store.setSelectedCell(null);
      setZoomTarget(null);
    }
  }, [store.setSelectedCell, showTreemap]);

  const handleSelect = useCallback(
    (cell: CubeCell | null) => {
      if (zoomingBack) return; // ignore clicks during zoom-back
      store.setSelectedCell(cell);
      if (cell) {
        setTreemapCell(cell);
        setZoomTarget(cellWorldPosition(cell));
        setShowTreemap(false);
        setZoomingBack(false);
      } else {
        setZoomTarget(null);
        setShowTreemap(false);
        setTreemapCell(null);
      }
    },
    [store.setSelectedCell, zoomingBack]
  );

  const handleZoomComplete = useCallback(() => {
    setShowTreemap(true);
  }, []);

  const handleCloseTreemap = useCallback(() => {
    setShowTreemap(false);
    setTreemapCell(null);
    setZoomTarget(null);
    setZoomingBack(true);
    store.setSelectedCell(null);
  }, [store.setSelectedCell]);

  const handleZoomBackDone = useCallback(() => {
    setZoomingBack(false);
  }, []);

  return (
    <>
      <Scene
        ref={sceneRef}
        records={rawRecords}
        scaleMode={store.scaleMode}
        sortMode={store.sortMode}
        colorBy={store.colorBy}
        cubeOpacity={store.cubeOpacity}
        cellOpacity={store.cellOpacity}
        organismFilter={store.organismFilter}
        modalityFilter={store.modalityFilter}
        organFilter={store.organFilter}
        hoveredCell={store.hoveredCell}
        selectedCell={store.selectedCell}
        onHover={store.setHoveredCell}
        onSelect={handleSelect}
        zoomTarget={zoomTarget}
        onZoomComplete={handleZoomComplete}
        zoomingBack={zoomingBack}
        onZoomBackDone={handleZoomBackDone}
      />
      <Tooltip cell={store.hoveredCell} />
      {!showTreemap && (
        <ControlPanel
          organisms={displayOrganisms}
          modalities={displayModalities}
          organs={displayOrgans}
          colorBy={store.colorBy}
          setColorBy={store.setColorBy}
          organismFilter={store.organismFilter}
          toggleOrganism={store.toggleOrganism}
          modalityFilter={store.modalityFilter}
          toggleModality={store.toggleModality}
          organFilter={store.organFilter}
          toggleOrgan={store.toggleOrgan}
          cubeOpacity={store.cubeOpacity}
          setCubeOpacity={store.setCubeOpacity}
          cellOpacity={store.cellOpacity}
          setCellOpacity={store.setCellOpacity}
          maxSize={maxSize}
          onResetView={handleResetView}
          onClearSelection={handleClearSelection}
        />
      )}
      {!showTreemap && <DetailsPanel cell={store.selectedCell} totalSize={totalSize} />}
      {!showTreemap && <CameraPresets onSetCamera={handleSetCamera} />}
      {showTreemap && treemapCell && (
        <TreemapOverlay cell={treemapCell} onClose={handleCloseTreemap} />
      )}
    </>
  );
}

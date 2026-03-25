import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import {
  getOrganisms,
  getModalities,
  getOrgans,
  CubeCell,
  DatasetRecord,
} from "./data/datasets";
import { EXAMPLES, ExampleConfig } from "./data/examples";
import { loadExample, CubeData } from "./data/loadExample";
import { useStore } from "./hooks/useStore";
import { Scene, SceneHandle } from "./components/Scene";
import { Tooltip } from "./components/Tooltip";
import { ControlPanel } from "./components/ControlPanel";
import { DetailsPanel } from "./components/DetailsPanel";
import { CameraPresets } from "./components/CameraPresets";
import { TreemapOverlay } from "./components/TreemapOverlay";

const CUBE_SIZE = 3.8;
const GAP = 0.025;

function cellWorldPosition(
  cell: CubeCell,
  allOrgs: string[],
  allMods: string[],
  allOrgans: string[],
): [number, number, number] {
  const half = CUBE_SIZE / 2;
  const bandX = (CUBE_SIZE - GAP * (allOrgs.length + 1)) / allOrgs.length;
  const bandY = (CUBE_SIZE - GAP * (allMods.length + 1)) / allMods.length;
  const bandZ = (CUBE_SIZE - GAP * (allOrgans.length + 1)) / allOrgans.length;

  const oi = allOrgs.indexOf(cell.organism);
  const mi = allMods.indexOf(cell.modality);
  const ti = allOrgans.indexOf(cell.organ);

  return [
    -half + GAP * (oi + 1) + bandX * oi + bandX / 2,
    -half + GAP * (mi + 1) + bandY * mi + bandY / 2,
    -half + GAP * (ti + 1) + bandZ * ti + bandZ / 2,
  ];
}

export default function App() {
  const [exampleId, setExampleId] = useState(EXAMPLES[0].id);
  const [cubeData, setCubeData] = useState<CubeData | null>(null);
  const currentExample = EXAMPLES.find((e) => e.id === exampleId)!;

  useEffect(() => {
    setCubeData(null);
    loadExample(exampleId).then(setCubeData);
  }, [exampleId]);

  if (!cubeData) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Helvetica Neue', sans-serif", color: "#666" }}>
        Loading {currentExample.title}...
      </div>
    );
  }

  return (
    <CubeView
      key={exampleId}
      records={cubeData.records}
      organisms={cubeData.organisms}
      modalities={cubeData.modalities}
      organs={cubeData.organs}
      currentExample={currentExample}
      exampleId={exampleId}
      onSwitchExample={setExampleId}
    />
  );
}

interface CubeViewProps {
  records: DatasetRecord[];
  organisms: string[];
  modalities: string[];
  organs: string[];
  currentExample: ExampleConfig;
  exampleId: string;
  onSwitchExample: (id: string) => void;
}

function CubeView({
  records,
  organisms,
  modalities,
  organs,
  currentExample,
  exampleId,
  onSwitchExample,
}: CubeViewProps) {
  const dataOrganisms = useMemo(() => getOrganisms(records), [records]);
  const dataModalities = useMemo(() => getModalities(records), [records]);
  const dataOrgans = useMemo(() => getOrgans(records), [records]);
  const store = useStore(dataOrganisms, dataModalities, dataOrgans);
  const sceneRef = useRef<SceneHandle>(null);

  const [treemapCell, setTreemapCell] = useState<CubeCell | null>(null);
  const [zoomTarget, setZoomTarget] = useState<[number, number, number] | null>(null);
  const [showTreemap, setShowTreemap] = useState(false);
  const [zoomingBack, setZoomingBack] = useState(false);

  const displayOrganisms = useMemo(
    () => organisms.filter((o) => dataOrganisms.includes(o)),
    [organisms, dataOrganisms],
  );
  const displayModalities = useMemo(
    () => modalities.filter((m) => dataModalities.includes(m)),
    [modalities, dataModalities],
  );
  const displayOrgans = useMemo(
    () => organs.filter((o) => dataOrgans.includes(o)),
    [organs, dataOrgans],
  );

  const totalSize = useMemo(() => records.reduce((s, r) => s + r.datasetSize, 0), [records]);
  const maxSize = useMemo(() => Math.max(...records.map((r) => r.datasetSize)), [records]);

  const handleResetView = useCallback(() => {
    setShowTreemap(false);
    setTreemapCell(null);
    setZoomTarget(null);
    setZoomingBack(true);
    store.setSelectedCell(null);
  }, [store.setSelectedCell]);

  const handleSetCamera = useCallback((pos: [number, number, number]) => {
    sceneRef.current?.setCamera(pos);
    setZoomTarget(null);
    setShowTreemap(false);
    setZoomingBack(false);
  }, []);

  const handleClearSelection = useCallback(() => {
    setShowTreemap(false);
    setTreemapCell(null);
    setZoomTarget(null);
    setZoomingBack(true);
    store.setSelectedCell(null);
  }, [store.setSelectedCell]);

  const handleSelect = useCallback(
    (cell: CubeCell | null) => {
      if (zoomingBack) return;
      store.setSelectedCell(cell);
      if (cell) {
        setTreemapCell(cell);
        setZoomTarget(cellWorldPosition(cell, organisms, modalities, organs));
        setShowTreemap(false);
        setZoomingBack(false);
      } else {
        setZoomTarget(null);
        setShowTreemap(false);
        setTreemapCell(null);
      }
    },
    [store.setSelectedCell, zoomingBack, organisms, modalities, organs],
  );

  const handleZoomComplete = useCallback(() => setShowTreemap(true), []);

  const handleCloseTreemap = useCallback(() => {
    setShowTreemap(false);
    setTreemapCell(null);
    setZoomTarget(null);
    setZoomingBack(true);
    store.setSelectedCell(null);
  }, [store.setSelectedCell]);

  const handleZoomBackDone = useCallback(() => setZoomingBack(false), []);

  return (
    <>
      <Scene
        ref={sceneRef}
        records={records}
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
        axisOrganisms={organisms}
        axisModalities={modalities}
        axisOrgans={organs}
      />
      <Tooltip cell={store.hoveredCell} />

      {/* Example switcher + publication links */}
      <div style={{
        position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
        zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "6px 8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSwitchExample(ex.id)}
              style={{
                padding: "6px 14px", fontSize: 12, fontWeight: exampleId === ex.id ? 700 : 400,
                background: exampleId === ex.id ? "#3b82f6" : "transparent",
                color: exampleId === ex.id ? "#fff" : "#374151",
                border: "none", borderRadius: 6, cursor: "pointer",
              }}
            >
              {ex.title}
            </button>
          ))}
        </div>
        {currentExample.links.length > 0 && (
          <div style={{ display: "flex", gap: 10, fontSize: 10, color: "#6b7280" }}>
            {currentExample.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >{link.label}</a>
            ))}
          </div>
        )}
      </div>

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
        <TreemapOverlay cell={treemapCell} onClose={handleCloseTreemap} drilldownPath={currentExample.drilldownPath} />
      )}
    </>
  );
}

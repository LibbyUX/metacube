import { useRef, useImperativeHandle, forwardRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CubeMap } from "./CubeMap";
import { DatasetRecord, CubeCell } from "../data/datasets";
import { ScaleMode, SortMode, ColorBy } from "../hooks/useStore";

interface SceneProps {
  records: DatasetRecord[];
  scaleMode: ScaleMode;
  sortMode: SortMode;
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
  onZoomComplete?: () => void;
  zoomTarget?: [number, number, number] | null;
  zoomingBack?: boolean;
  onZoomBackDone?: () => void;
  axisOrganisms?: string[];
  axisModalities?: string[];
  axisOrgans?: string[];
}

export interface SceneHandle {
  setCamera: (pos: [number, number, number]) => void;
  resetView: () => void;
}

const DEFAULT_CAM = new THREE.Vector3(4.5, 3.5, 4.5);
const ZOOM_OFFSET = 0.6;

function CameraController(
  {
    zoomTarget,
    onZoomComplete,
    zoomingBack,
    onZoomBackDone,
  }: {
    zoomTarget?: [number, number, number] | null;
    onZoomComplete?: () => void;
    zoomingBack?: boolean;
    onZoomBackDone?: () => void;
  },
  ref: React.ForwardedRef<SceneHandle>
) {
  const { camera } = useThree();
  const isZooming = useRef(false);
  const hasNotified = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useImperativeHandle(ref, () => ({
    setCamera(pos: [number, number, number]) {
      camera.position.set(...pos);
      camera.lookAt(0, 0, 0);
    },
    resetView() {
      // Hard reset — used by preset buttons
      camera.position.copy(DEFAULT_CAM);
      camera.lookAt(0, 0, 0);
      isZooming.current = false;
      hasNotified.current = false;
    },
  }));

  useFrame(() => {
    // Zoom INTO a cell
    if (zoomTarget && !zoomingBack) {
      if (!isZooming.current) {
        isZooming.current = true;
        hasNotified.current = false;
        const cellPos = new THREE.Vector3(...zoomTarget);
        const camDir = new THREE.Vector3()
          .subVectors(camera.position, cellPos)
          .normalize();
        targetPos.current.copy(cellPos).addScaledVector(camDir, ZOOM_OFFSET);
        targetLookAt.current.copy(cellPos);
      }

      camera.position.lerp(targetPos.current, 0.07);
      const lookTarget = new THREE.Vector3();
      camera.getWorldDirection(lookTarget);
      const desiredDir = new THREE.Vector3()
        .subVectors(targetLookAt.current, camera.position)
        .normalize();
      lookTarget.lerp(desiredDir, 0.1);
      camera.lookAt(
        camera.position.x + lookTarget.x,
        camera.position.y + lookTarget.y,
        camera.position.z + lookTarget.z
      );

      const dist = camera.position.distanceTo(targetPos.current);
      if (dist < 0.03 && !hasNotified.current) {
        hasNotified.current = true;
        onZoomComplete?.();
      }
    }
    // Zoom BACK to default
    else if (zoomingBack) {
      camera.position.lerp(DEFAULT_CAM, 0.05);

      // Smoothly look back at origin
      const lookTarget = new THREE.Vector3();
      camera.getWorldDirection(lookTarget);
      const toOrigin = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), camera.position)
        .normalize();
      lookTarget.lerp(toOrigin, 0.08);
      camera.lookAt(
        camera.position.x + lookTarget.x,
        camera.position.y + lookTarget.y,
        camera.position.z + lookTarget.z
      );

      const dist = camera.position.distanceTo(DEFAULT_CAM);
      if (dist < 0.08) {
        camera.position.copy(DEFAULT_CAM);
        camera.lookAt(0, 0, 0);
        isZooming.current = false;
        hasNotified.current = false;
        onZoomBackDone?.();
      }
    } else {
      isZooming.current = false;
      hasNotified.current = false;
    }
  });

  return null;
}

const CameraControllerForwarded = forwardRef(CameraController);

export const Scene = forwardRef<SceneHandle, SceneProps>(function Scene(props, ref) {
  const camRef = useRef<SceneHandle>(null);

  useImperativeHandle(ref, () => ({
    setCamera(pos) {
      camRef.current?.setCamera(pos);
    },
    resetView() {
      camRef.current?.resetView();
    },
  }));

  const isAnimating = !!(props.zoomTarget || props.zoomingBack);

  return (
    <Canvas
      camera={{ position: [DEFAULT_CAM.x, DEFAULT_CAM.y, DEFAULT_CAM.z], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
      style={{ width: "100%", height: "100%", background: "#ffffff" }}
      onPointerMissed={() => { if (!isAnimating) props.onSelect(null!); }}
    >
      <CameraControllerForwarded
        ref={camRef}
        zoomTarget={props.zoomTarget}
        onZoomComplete={props.onZoomComplete}
        zoomingBack={props.zoomingBack}
        onZoomBackDone={props.onZoomBackDone}
      />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <directionalLight position={[-3, 3, -2]} intensity={0.25} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={0.3}
        maxDistance={15}
        enabled={!isAnimating}
      />
      <CubeMap
        records={props.records}
        scaleMode={props.scaleMode}
        sortMode={props.sortMode}
        colorBy={props.colorBy}
        cubeOpacity={props.cubeOpacity}
        cellOpacity={props.cellOpacity}
        organismFilter={props.organismFilter}
        modalityFilter={props.modalityFilter}
        organFilter={props.organFilter}
        hoveredCell={props.hoveredCell}
        selectedCell={props.selectedCell}
        onHover={props.onHover}
        onSelect={props.onSelect}
        axisOrganisms={props.axisOrganisms}
        axisModalities={props.axisModalities}
        axisOrgans={props.axisOrgans}
      />
    </Canvas>
  );
});

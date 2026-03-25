import { useState, useCallback } from "react";
import { CubeCell } from "../data/datasets";

export type ScaleMode = "linear" | "sqrt" | "log";
export type SortMode = "size" | "alpha";
export type ColorBy = "size" | "organism" | "modality" | "organ";

export interface StoreState {
  scaleMode: ScaleMode;
  setScaleMode: (m: ScaleMode) => void;
  sortMode: SortMode;
  setSortMode: (m: SortMode) => void;
  colorBy: ColorBy;
  setColorBy: (c: ColorBy) => void;
  hoveredCell: CubeCell | null;
  setHoveredCell: (c: CubeCell | null) => void;
  selectedCell: CubeCell | null;
  setSelectedCell: (c: CubeCell | null) => void;
  organismFilter: Set<string>;
  toggleOrganism: (o: string) => void;
  modalityFilter: Set<string>;
  toggleModality: (m: string) => void;
  organFilter: Set<string>;
  toggleOrgan: (o: string) => void;
  cubeOpacity: number;
  setCubeOpacity: (v: number) => void;
  cellOpacity: number;
  setCellOpacity: (v: number) => void;
}

export function useStore(
  allOrganisms: string[],
  allModalities: string[],
  allOrgans: string[]
): StoreState {
  const [scaleMode, setScaleMode] = useState<ScaleMode>("sqrt");
  const [sortMode, setSortMode] = useState<SortMode>("size");
  const [colorBy, setColorBy] = useState<ColorBy>("size");
  const [hoveredCell, setHoveredCell] = useState<CubeCell | null>(null);
  const [selectedCell, setSelectedCell] = useState<CubeCell | null>(null);
  const [organismFilter, setOrganismFilter] = useState<Set<string>>(
    () => new Set(allOrganisms)
  );
  const [modalityFilter, setModalityFilter] = useState<Set<string>>(
    () => new Set(allModalities)
  );
  const [organFilter, setOrganFilter] = useState<Set<string>>(
    () => new Set(allOrgans)
  );
  const [cubeOpacity, setCubeOpacity] = useState(0.0);
  const [cellOpacity, setCellOpacity] = useState(0.88);

  const toggleOrganism = useCallback((o: string) => {
    setOrganismFilter((prev) => {
      const next = new Set(prev);
      if (next.has(o)) next.delete(o);
      else next.add(o);
      return next;
    });
  }, []);

  const toggleModality = useCallback((m: string) => {
    setModalityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  }, []);

  const toggleOrgan = useCallback((o: string) => {
    setOrganFilter((prev) => {
      const next = new Set(prev);
      if (next.has(o)) next.delete(o);
      else next.add(o);
      return next;
    });
  }, []);

  return {
    scaleMode,
    setScaleMode,
    sortMode,
    setSortMode,
    colorBy,
    setColorBy,
    hoveredCell,
    setHoveredCell,
    selectedCell,
    setSelectedCell,
    organismFilter,
    toggleOrganism,
    modalityFilter,
    toggleModality,
    organFilter,
    toggleOrgan,
    cubeOpacity,
    setCubeOpacity,
    cellOpacity,
    setCellOpacity,
  };
}

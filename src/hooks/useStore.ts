import { useState, useCallback } from "react";
import type { CubeCell } from "../data/dataModel";

export type ScaleMode = "linear" | "sqrt" | "log";
export type SortMode = "size" | "alpha";
export type ColorBy = "size" | "x" | "y" | "z";

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
}

export function useStore(): StoreState {
  const [scaleMode, setScaleMode] = useState<ScaleMode>("sqrt");
  const [sortMode, setSortMode] = useState<SortMode>("size");
  const [colorBy, setColorBy] = useState<ColorBy>("size");
  const [hoveredCell, setHoveredCell] = useState<CubeCell | null>(null);
  const [selectedCell, setSelectedCell] = useState<CubeCell | null>(null);
  const [xFilter, setXFilter] = useState<Set<string>>(() => new Set());
  const [yFilter, setYFilter] = useState<Set<string>>(() => new Set());
  const [zFilter, setZFilter] = useState<Set<string>>(() => new Set());
  const [cellOpacity, setCellOpacity] = useState(0.88);

  const toggleX = useCallback((v: string) => {
    setXFilter((prev) => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next; });
  }, []);

  const toggleY = useCallback((v: string) => {
    setYFilter((prev) => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next; });
  }, []);

  const toggleZ = useCallback((v: string) => {
    setZFilter((prev) => { const next = new Set(prev); next.has(v) ? next.delete(v) : next.add(v); return next; });
  }, []);

  return {
    scaleMode, setScaleMode,
    sortMode, setSortMode,
    colorBy, setColorBy,
    hoveredCell, setHoveredCell,
    selectedCell, setSelectedCell,
    xFilter, toggleX, setXFilter,
    yFilter, toggleY, setYFilter,
    zFilter, toggleZ, setZFilter,
    cellOpacity, setCellOpacity,
  };
}

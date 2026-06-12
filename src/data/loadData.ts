import type { CubeData } from "./dataModel";

declare global {
  interface Window {
    __CUBE_DATA__: CubeData;
  }
}

export function loadData(): CubeData {
  if (!window.__CUBE_DATA__) {
    throw new Error("window.__CUBE_DATA__ is not defined. Inject cube data before the app loads.");
  }
  return window.__CUBE_DATA__;
}

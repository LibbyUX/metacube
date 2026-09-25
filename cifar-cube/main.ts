import {
  CifarCube,
  defineCifarCube,
  type CifarCubeAxes,
  type CifarCubeItem,
} from "../packages/cifar-cube/src";

const SPATIAL_SCALES = {
  hundredMicrons: { label: "100 µm" },
  tenCentimeters: { label: "100 mm" },
} as const;

/**
 * Formats preview dataset titles in a consistent identifying sequence.
 * @param organ - Tissue source represented by the dataset.
 * @param spatialScale - Display scale assigned to the dataset.
 * @returns A title ordered by organ and scale.
 */
function createDatasetLabel(organ: string, spatialScale: { label: string }) {
  return `${organ}, ${spatialScale.label}`;
}

const ORGAN_DATASET_AXES: CifarCubeAxes = {
  x: { label: "Spatial scale", values: [SPATIAL_SCALES.hundredMicrons.label, SPATIAL_SCALES.tenCentimeters.label] },
  y: { label: "Age (years)", values: ["45", "63", "85", "~40–70", "4–5 months", "7–47"] },
  z: { label: "Organ", values: ["Thymus", "Heart", "Kidney", "Liver"] },
};

type PreviewDataset = CifarCubeItem & { href: string };

const datasets: PreviewDataset[] = [
  {
    id: "bader-liver-sbf-sem",
    label: createDatasetLabel("Liver", SPATIAL_SCALES.hundredMicrons),
    href: "#metadata-bader-liver-sbf-sem",
    metadata: { Organ: "Liver", "Spatial scale": SPATIAL_SCALES.hundredMicrons.label, Age: "45", Sex: "Male", "Lead author": "Gary Bader" },
    position: { x: 0, y: 0, z: 3 },
    cubeScale: 0.82,
  },
  {
    id: "lee-kidney-hipct-63",
    label: createDatasetLabel("Kidney", SPATIAL_SCALES.tenCentimeters),
    href: "#metadata-lee-kidney-hipct-63",
    metadata: { Organ: "Kidney", "Spatial scale": SPATIAL_SCALES.tenCentimeters.label, Age: "63", Sex: "Male", "Lead author": "Peter D. Lee" },
    position: { x: 1, y: 1, z: 2 },
  },
  {
    id: "lee-kidney-hipct-85",
    label: createDatasetLabel("Kidney", SPATIAL_SCALES.tenCentimeters),
    href: "#metadata-lee-kidney-hipct-85",
    metadata: { Organ: "Kidney", "Spatial scale": SPATIAL_SCALES.tenCentimeters.label, Age: "85", Sex: "Male", "Lead author": "Peter D. Lee" },
    position: { x: 1, y: 2, z: 2 },
  },
  {
    id: "lee-heart-hipct",
    label: createDatasetLabel("Heart", SPATIAL_SCALES.tenCentimeters),
    href: "#metadata-lee-heart-hipct",
    metadata: { Organ: "Heart", "Spatial scale": SPATIAL_SCALES.tenCentimeters.label, Age: "63", Sex: "Male", "Lead author": "Peter D. Lee" },
    position: { x: 1, y: 1, z: 1 },
  },
  {
    id: "teichmann-heart-hra-pop",
    label: createDatasetLabel("Heart", SPATIAL_SCALES.hundredMicrons),
    href: "#metadata-teichmann-heart-hra-pop",
    metadata: { Organ: "Heart", "Spatial scale": SPATIAL_SCALES.hundredMicrons.label, Age: "~40–70", Sex: "Multiple", "Lead author": "Sarah Teichmann" },
    position: { x: 0, y: 3, z: 1 },
  },
  {
    id: "zandstra-thymus-codex",
    label: createDatasetLabel("Thymus", SPATIAL_SCALES.hundredMicrons),
    href: "#metadata-zandstra-thymus-codex",
    metadata: { Organ: "Thymus", "Spatial scale": SPATIAL_SCALES.hundredMicrons.label, Age: "4–5 months", Sex: "Multiple", "Lead author": "Peter W. Zandstra" },
    position: { x: 0, y: 4, z: 0 },
  },
  {
    id: "bader-liver-xenium",
    label: createDatasetLabel("Liver", SPATIAL_SCALES.hundredMicrons),
    href: "#metadata-bader-liver-xenium",
    metadata: { Organ: "Liver", "Spatial scale": SPATIAL_SCALES.hundredMicrons.label, Age: "7–47", Sex: "Multiple", "Lead author": "Gary Bader" },
    position: { x: 0, y: 5, z: 3 },
  },
];

defineCifarCube();

const cifarCube = document.querySelector("cifar-cube") as CifarCube | null;
if (cifarCube) {
  cifarCube.axes = ORGAN_DATASET_AXES;
  cifarCube.items = datasets;
}

const THEME_STORAGE_KEY = "metacube-theme-mode";
const themeButtons = document.querySelectorAll<HTMLButtonElement>("[data-theme-option]");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let followsSystemTheme = true;

function setTheme(mode: "light" | "dark", persist = true) {
  document.documentElement.dataset.theme = mode;
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === mode));
  });
  if (persist) {
    followsSystemTheme = false;
    try { localStorage.setItem(THEME_STORAGE_KEY, mode); } catch { /* localStorage unavailable */ }
  }
}

let initialTheme: "light" | "dark" = "light";
try {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    initialTheme = savedTheme;
    followsSystemTheme = false;
  } else if (systemTheme.matches) initialTheme = "dark";
} catch {
  if (systemTheme.matches) initialTheme = "dark";
}
setTheme(initialTheme, false);

systemTheme.addEventListener("change", (event) => {
  if (followsSystemTheme) setTheme(event.matches ? "dark" : "light", false);
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeOption as "light" | "dark"));
});

const metadataDestinations = document.querySelector("#metadata-destinations");
const uniqueDestinations = new Map(datasets.map((dataset) => [dataset.href, dataset]));

uniqueDestinations.forEach((dataset, href) => {
  const article = document.createElement("article");
  article.id = href.slice(1);
  article.tabIndex = -1;

  const heading = document.createElement("h3");
  heading.textContent = dataset.label;

  const identifier = document.createElement("p");
  identifier.textContent = `Metadata ID: ${dataset.id}`;

  article.append(heading, identifier);
  metadataDestinations?.append(article);
});

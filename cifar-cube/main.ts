import {
  CifarCube,
  defineCifarCube,
  type CifarCubeAxes,
  type CifarCubeItem,
} from "../packages/cifar-cube/src";

const ORGAN_DATASET_AXES: CifarCubeAxes = {
  x: { label: "Spatial scale", values: ["100-microns", "10-centimeters"] },
  y: { label: "Age (years)", values: ["45", "63", "85", "~40–70", "4–5 months", "7–47"] },
  z: { label: "Organ", values: ["Thymus", "Heart", "Kidney", "Liver"] },
};

type PreviewDataset = CifarCubeItem & { href: string };

const datasets: PreviewDataset[] = [
  {
    id: "bader-liver-sem-sbf",
    label: "Bader liver SEM/SBF",
    href: "#metadata-bader-liver-sem-sbf",
    metadata: { Organ: "Liver", "Spatial scale": "100-microns", Age: "45", Sex: "Male" },
    position: { x: 0, y: 0, z: 3 },
  },
  {
    id: "lee-kidney-hipct-63",
    label: "Lee kidney HiP-CT — age 63",
    href: "#metadata-lee-kidney-hipct-63",
    metadata: { Organ: "Kidney", "Spatial scale": "10-centimeters", Age: "63", Sex: "Male" },
    position: { x: 1, y: 1, z: 2 },
  },
  {
    id: "lee-kidney-hipct-85",
    label: "Lee kidney HiP-CT — age 85",
    href: "#metadata-lee-kidney-hipct-85",
    metadata: { Organ: "Kidney", "Spatial scale": "10-centimeters", Age: "85", Sex: "Male" },
    position: { x: 1, y: 2, z: 2 },
  },
  {
    id: "lee-heart-hipct",
    label: "Lee heart HiP-CT",
    href: "#metadata-lee-heart-hipct",
    metadata: { Organ: "Heart", "Spatial scale": "10-centimeters", Age: "63", Sex: "Male" },
    position: { x: 1, y: 1, z: 1 },
  },
  {
    id: "teichmann-heart-hra-pop",
    label: "Teichmann heart HRA population",
    href: "#metadata-teichmann-heart-hra-pop",
    metadata: { Organ: "Heart", "Spatial scale": "100-microns", Age: "~40–70", Sex: "Multiple" },
    position: { x: 0, y: 3, z: 1 },
  },
  {
    id: "zandstra-thymus-codex",
    label: "Zandstra thymus CODEX",
    href: "#metadata-zandstra-thymus-codex",
    metadata: { Organ: "Thymus", "Spatial scale": "100-microns", Age: "4–5 months", Sex: "Multiple" },
    position: { x: 0, y: 4, z: 0 },
  },
  {
    id: "bader-liver-xenium",
    label: "Bader liver Xenium",
    href: "#metadata-bader-liver-xenium",
    metadata: { Organ: "Liver", "Spatial scale": "100-microns", Age: "7–47", Sex: "Multiple" },
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
  identifier.textContent = `Metadata ID: ${dataset.id.replace(/-\d+$/, "")}`;

  article.append(heading, identifier);
  metadataDestinations?.append(article);
});

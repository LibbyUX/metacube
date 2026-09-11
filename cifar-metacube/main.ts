import {
  CifarMetacube,
  defineCifarMetacube,
  ORGAN_DATASET_AXES,
  type CifarMetacubeItem,
} from "../src/embeds/cifar-metacube";

const datasets: CifarMetacubeItem[] = [
  {
    id: "bader-liver-sem-sbf",
    label: "Bader liver SEM/SBF",
    href: "#metadata-bader-liver-sem-sbf",
    metadata: { Organ: "Liver", Scale: "100-microns", Age: "45", Sex: "Male" },
    position: { x: 0, y: 0, z: 3 },
  },
  {
    id: "lee-kidney-hipct-63",
    label: "Lee kidney HiP-CT",
    href: "#metadata-lee-kidney-hipct",
    metadata: { Organ: "Kidney", Scale: "10-centimeters", Age: "63", Sex: "Male" },
    position: { x: 1, y: 1, z: 2 },
  },
  {
    id: "lee-kidney-hipct-85",
    label: "Lee kidney HiP-CT",
    href: "#metadata-lee-kidney-hipct",
    metadata: { Organ: "Kidney", Scale: "10-centimeters", Age: "85", Sex: "Male" },
    position: { x: 1, y: 2, z: 2 },
  },
  {
    id: "lee-heart-hipct",
    label: "Lee heart HiP-CT",
    href: "#metadata-lee-heart-hipct",
    metadata: { Organ: "Heart", Scale: "10-centimeters", Age: "63", Sex: "Male" },
    position: { x: 1, y: 1, z: 1 },
  },
  {
    id: "teichmann-heart-hra-pop",
    label: "Teichmann heart HRA population",
    href: "#metadata-teichmann-heart-hra-pop",
    metadata: { Organ: "Heart", Scale: "100-microns", Age: "~40–70", Sex: "Multiple" },
    position: { x: 0, y: 3, z: 1 },
  },
  {
    id: "zandstra-thymus-codex",
    label: "Zandstra thymus CODEX",
    href: "#metadata-zandstra-thymus-codex",
    metadata: { Organ: "Thymus", Scale: "100-microns", Age: "4–5 months", Sex: "Multiple" },
    position: { x: 0, y: 4, z: 0 },
  },
  {
    id: "bader-liver-xenium",
    label: "Bader liver Xenium",
    href: "#metadata-bader-liver-xenium",
    metadata: { Organ: "Liver", Scale: "100-microns", Age: "7–47", Sex: "Multiple" },
    position: { x: 0, y: 5, z: 3 },
  },
];

defineCifarMetacube();

const metacube = document.querySelector("cifar-metacube") as CifarMetacube | null;
if (metacube) {
  metacube.axes = ORGAN_DATASET_AXES;
  metacube.items = datasets;
}

const THEME_STORAGE_KEY = "metacube-theme-mode";
const themeButtons = document.querySelectorAll<HTMLButtonElement>("[data-theme-option]");

function setTheme(mode: "light" | "dark", persist = true) {
  document.documentElement.dataset.theme = mode;
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === mode));
  });
  if (persist) {
    try { localStorage.setItem(THEME_STORAGE_KEY, mode); } catch { /* localStorage unavailable */ }
  }
}

let initialTheme: "light" | "dark" = "light";
try {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") initialTheme = savedTheme;
  else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) initialTheme = "dark";
} catch {
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) initialTheme = "dark";
}
setTheme(initialTheme, false);

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

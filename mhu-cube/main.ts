import {
  MhuCube,
  defineMhuCube,
  type MhuCubeAxes,
  type MhuCubeItem,
  type MhuCubePosition,
} from "../packages/mhu-cube/src";

const SPACE = {
  hundredMicrons: "100 µm",
  hundredMillimeters: "100 mm",
} as const;

const ORGAN_DATASET_AXES: MhuCubeAxes = {
  time: { label: "Time", unit: "years", min: 0, max: 100 },
  space: { label: "Space", values: [SPACE.hundredMicrons, SPACE.hundredMillimeters] },
  // The component always displays organs alphabetically.
  organ: { label: "Organ", values: ["Heart", "Kidney", "Liver", "Thymus"] },
};

/**
 * Formats preview time ranges the same way the component does when no label is supplied.
 * @param time - Dataset time range in years.
 * @returns Display text such as "45 years" or "7–47 years".
 */
function formatTime(time: MhuCubePosition["time"]) {
  return time.label ?? (time.start === time.end ? `${time.start} years` : `${time.start}–${time.end} years`);
}

/**
 * Builds a preview dataset whose title and metadata agree with its plotted position.
 * @param id - Stable dataset identity used for the metadata destination.
 * @param position - Time, space, and organ placement.
 * @param details - Remaining metadata shown after the plotted dimensions.
 * @returns A dataset with a consistent organ, space, and time title.
 */
function createDataset(id: string, position: MhuCubePosition, details: { Sex: string; "Lead author": string }) {
  const time = formatTime(position.time);
  return {
    id,
    label: `${position.organ}, ${position.space}, ${time}`,
    href: `#metadata-${id}`,
    metadata: { Time: time, Space: position.space, Organ: position.organ, ...details },
    position,
  };
}

type PreviewDataset = MhuCubeItem & { href: string };

const datasets: PreviewDataset[] = [
  createDataset(
    "bader-liver-sbf-sem",
    { time: { start: 45, end: 45 }, space: SPACE.hundredMicrons, organ: "Liver" },
    { Sex: "Male", "Lead author": "Gary Bader" },
  ),
  createDataset(
    "lee-kidney-hipct-63",
    { time: { start: 63, end: 63 }, space: SPACE.hundredMillimeters, organ: "Kidney" },
    { Sex: "Male", "Lead author": "Peter D. Lee" },
  ),
  createDataset(
    "lee-kidney-hipct-85",
    { time: { start: 85, end: 85 }, space: SPACE.hundredMillimeters, organ: "Kidney" },
    { Sex: "Male", "Lead author": "Peter D. Lee" },
  ),
  createDataset(
    "lee-heart-hipct",
    { time: { start: 63, end: 63 }, space: SPACE.hundredMillimeters, organ: "Heart" },
    { Sex: "Male", "Lead author": "Peter D. Lee" },
  ),
  createDataset(
    "teichmann-heart-hra-pop",
    { time: { start: 40, end: 70, label: "~40–70 years" }, space: SPACE.hundredMicrons, organ: "Heart" },
    { Sex: "Multiple", "Lead author": "Sarah Teichmann" },
  ),
  createDataset(
    "zandstra-thymus-codex",
    { time: { start: 4 / 12, end: 5 / 12, label: "4–5 months" }, space: SPACE.hundredMicrons, organ: "Thymus" },
    { Sex: "Multiple", "Lead author": "Peter W. Zandstra" },
  ),
  createDataset(
    "bader-liver-xenium",
    { time: { start: 7, end: 47 }, space: SPACE.hundredMicrons, organ: "Liver" },
    { Sex: "Multiple", "Lead author": "Gary Bader" },
  ),
];

defineMhuCube();

const mhuCube = document.querySelector("mhu-cube") as MhuCube | null;
if (mhuCube) {
  mhuCube.axes = ORGAN_DATASET_AXES;
  mhuCube.items = datasets;
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

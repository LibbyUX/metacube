import {
  CifarMetacube,
  defineCifarMetacube,
  type CifarMetacubeItem,
} from "../src/embeds/cifar-metacube";

const datasets: CifarMetacubeItem[] = [
  {
    id: "bader-liver-sem-sbf",
    label: "Bader liver SEM/SBF",
    href: "#metadata-bader-liver-sem-sbf",
    metadata: { Organ: "Liver", Scale: "100-microns", Age: "45", Sex: "Male" },
  },
  {
    id: "lee-kidney-hipct-63",
    label: "Lee kidney HiP-CT",
    href: "#metadata-lee-kidney-hipct",
    metadata: { Organ: "Kidney", Scale: "10-centimeters", Age: "63", Sex: "Male" },
  },
  {
    id: "lee-kidney-hipct-85",
    label: "Lee kidney HiP-CT",
    href: "#metadata-lee-kidney-hipct",
    metadata: { Organ: "Kidney", Scale: "10-centimeters", Age: "85", Sex: "Male" },
  },
  {
    id: "lee-heart-hipct",
    label: "Lee heart HiP-CT",
    href: "#metadata-lee-heart-hipct",
    metadata: { Organ: "Heart", Scale: "10-centimeters", Age: "63", Sex: "Male" },
  },
  {
    id: "teichmann-heart-hra-pop",
    label: "Teichmann heart HRA population",
    href: "#metadata-teichmann-heart-hra-pop",
    metadata: { Organ: "Heart", Scale: "100-microns", Age: "~40–70", Sex: "Multiple" },
  },
  {
    id: "zandstra-thymus-codex",
    label: "Zandstra thymus CODEX",
    href: "#metadata-zandstra-thymus-codex",
    metadata: { Organ: "Thymus", Scale: "100-microns", Age: "4–5 months", Sex: "Multiple" },
  },
  {
    id: "bader-liver-xenium",
    label: "Bader liver Xenium",
    href: "#metadata-bader-liver-xenium",
    metadata: { Organ: "Liver", Scale: "100-microns", Age: "7–47", Sex: "Multiple" },
  },
];

defineCifarMetacube();

const metacube = document.querySelector("cifar-metacube") as CifarMetacube | null;
if (metacube) metacube.items = datasets;

const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
themeToggle?.addEventListener("click", () => {
  const useDarkTheme = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = useDarkTheme ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(useDarkTheme));
  themeToggle.textContent = useDarkTheme ? "Use light theme" : "Use dark theme";
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


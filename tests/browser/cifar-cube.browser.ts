import {
  CIFAR_CUBE_SELECTION_EVENT,
  CIFAR_CUBE_VALIDATION_EVENT,
  CifarCube,
  defineCifarCube,
  type CifarCubeAxes,
  type CifarCubeItem,
} from "../../packages/cifar-cube/src";

const axes: CifarCubeAxes = {
  x: { label: "Spatial scale", values: ["small", "large"] },
  y: { label: "Age", values: ["young", "old"] },
  z: { label: "Organ", values: ["heart", "liver"] },
};
const items: CifarCubeItem[] = [
  { id: "one", label: "Dataset one", href: "#one", metadata: { Organ: "Heart" }, position: { x: 0, y: 0, z: 0 } },
  { id: "two", label: "Dataset two", href: "#two", metadata: { Organ: "Liver" }, position: { x: 1, y: 1, z: 1 } },
  { id: "unplotted", label: "Dataset without coordinates", href: "#unplotted", metadata: { Organ: "Heart" } },
];

const results = document.querySelector<HTMLOListElement>("#results");
const fixture = document.querySelector<HTMLDivElement>("#fixture");
let failures = 0;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function nextLayout() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

async function waitFor(predicate: () => boolean, timeout = 1000) {
  const start = performance.now();
  while (!predicate()) {
    if (performance.now() - start > timeout) throw new Error("Timed out waiting for the component update.");
    await nextLayout();
  }
}

async function test(name: string, callback: () => void | Promise<void>) {
  const result = document.createElement("li");
  try {
    await callback();
    result.className = "pass";
    result.textContent = `Pass: ${name}`;
  } catch (error) {
    failures += 1;
    result.className = "fail";
    result.textContent = `Fail: ${name} — ${error instanceof Error ? error.message : String(error)}`;
  }
  results?.append(result);
}

defineCifarCube();
const component = document.createElement("cifar-cube") as CifarCube;
fixture?.append(component);
component.axes = axes;
component.items = items;
await nextLayout();

const shadow = component.shadowRoot;
if (!shadow) throw new Error("Component shadow root was not created.");

await test("desktop introduction explains the visualization with semantic dimensions", () => {
  const intro = shadow.querySelectorAll(".cifar-cube__intro");
  assert(intro.length === 1, "The component should render one shared introduction.");
  assert(Boolean(intro[0].querySelector(".cifar-cube__intro-heading")), "The introduction heading is missing.");
  const visualization = intro[0].querySelector<HTMLElement>(".cifar-cube__intro-visualization");
  const compactDescription = intro[0].querySelector<HTMLElement>(".cifar-cube__intro-compact");
  assert(visualization && getComputedStyle(visualization).display !== "none", "Visualization guidance should be visible on desktop.");
  assert(compactDescription && getComputedStyle(compactDescription).display === "none", "Compact guidance should be hidden on desktop.");
  assert(
    visualization.querySelector(".cifar-cube__intro-summary")?.textContent === "This visualization compares datasets across three dimensions. Select a cube to view its details.",
    "Visualization guidance should combine the comparison and selection instructions.",
  );
  const dimensionKey = visualization.querySelector<HTMLDListElement>("dl.cifar-cube__intro-dimensions");
  const dimensionHeadings = [...visualization.querySelectorAll(".cifar-cube__intro-dimensions-header span")].map((heading) => heading.textContent);
  const terms = [...(dimensionKey?.querySelectorAll("dt") ?? [])].map((term) => term.textContent);
  assert(dimensionHeadings.join(",") === "Dimension,What it represents", "The dimension key should expose its visual column headings.");
  assert(terms.join(",") === "Spatial scale,Age (years),Organ", "Visualization dimensions should use semantic terms.");
  const attribution = visualization.querySelector<HTMLAnchorElement>(".cifar-cube__intro-attribution a");
  assert(attribution?.getAttribute("href") === "https://github.com/Chair-for-Clinical-Bioinformatics/metacube", "Visualization attribution is missing.");
  assert(
    attribution?.parentElement?.textContent === "Visualization inspired by Metacube from the Chair for Clinical Bioinformatics.",
    "Visualization attribution should credit the Metacube source.",
  );
});

await test("cube controls have unique names, descriptions, state, and details relationships", () => {
  const buttons = [...shadow.querySelectorAll<HTMLButtonElement>(".cifar-cube__select")];
  assert(buttons.length === 2, "Only positioned datasets should create cube controls.");
  buttons.forEach((button) => {
    const descriptionId = button.getAttribute("aria-describedby");
    const detailsId = button.getAttribute("aria-controls");
    assert(button.getAttribute("aria-label")?.startsWith("Select Dataset"), "Control needs a dataset-specific name.");
    assert(descriptionId && shadow.getElementById(descriptionId)?.textContent?.includes("Metadata"), "Control needs dataset context.");
    assert(detailsId && shadow.getElementById(detailsId), "Control must reference the details panel.");
    assert(button.hasAttribute("aria-pressed"), "Control must expose selection state.");
  });
});

await test("keyboard activation focuses the action and keeps the live region mounted", async () => {
  const details = shadow.querySelector<HTMLElement>(".cifar-cube__details");
  const button = shadow.querySelector<HTMLButtonElement>(".cifar-cube__select");
  assert(details && button, "Fixture is missing interaction elements.");
  button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
  await waitFor(() => Boolean(shadow.querySelector(".cifar-cube__details-action")));
  const action = shadow.querySelector<HTMLAnchorElement>(".cifar-cube__details-action");
  assert(shadow.querySelector(".cifar-cube__details") === details, "Live region was replaced.");
  assert(shadow.activeElement === action, "Keyboard selection did not move focus to the metadata action.");
  assert(action?.getAttribute("aria-label") === "View metadata for Dataset one; Organ: Heart", "Action name does not identify its dataset and metadata.");
});

await test("desktop selection swaps the dimension key for a closable dataset card", async () => {
  const section = shadow.querySelector<HTMLElement>(".cifar-cube");
  const intro = shadow.querySelector<HTMLElement>(".cifar-cube__intro");
  const details = shadow.querySelector<HTMLElement>(".cifar-cube__details");
  const dimensionKey = shadow.querySelector<HTMLElement>(".cifar-cube__intro-dimensions");
  const dimensionHeader = shadow.querySelector<HTMLElement>(".cifar-cube__intro-dimensions-header");
  const button = shadow.querySelectorAll<HTMLButtonElement>(".cifar-cube__select")[1];
  assert(section && intro && details && dimensionKey && dimensionHeader && button, "Fixture is missing desktop layout elements.");
  assert(getComputedStyle(section).gridTemplateAreas.includes("content stage"), "Desktop content should precede the visualization.");
  button.click();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    assert(details.getAnimations().length > 0, "Detail card should animate after selection.");
  }
  await waitFor(() => details.querySelector(".cifar-cube__details-heading")?.textContent === "Dataset two");
  assert(intro.isConnected, "Selecting a dataset should not replace the introduction.");
  assert(details.parentElement?.classList.contains("cifar-cube__intro-visualization"), "Details should occupy the dimension key region.");
  assert(getComputedStyle(dimensionHeader).display === "none", "The dimension headings should be hidden while details are open.");
  assert(getComputedStyle(dimensionKey).display === "none", "The dimension key should be hidden while details are open.");
  assert(details.querySelector("h3.cifar-cube__details-heading"), "The selected dataset title should be a level-three heading.");
  assert(Boolean(details.querySelector(".cifar-cube__details-card")), "Selection should render a dataset card in the introduction.");
  const metadata = details.querySelector("dl.cifar-cube__details-metadata");
  const metadataTerms = [...(metadata?.querySelectorAll("dt") ?? [])].map((term) => term.textContent);
  assert(metadata && metadataTerms.includes("Organ") && metadataTerms.includes("Lead author"), "Selected metadata needs semantic labels.");
  let clearedItem: CifarCubeItem | null | undefined;
  component.addEventListener(CIFAR_CUBE_SELECTION_EVENT, (event) => {
    clearedItem = event.detail.item;
  }, { once: true });
  const close = details.querySelector<HTMLButtonElement>(".cifar-cube__details-close");
  assert(close?.getAttribute("aria-label") === "Close dataset details", "The details card needs an accessible close button.");
  const closeIcon = close.querySelector("svg.cifar-cube__details-close-icon");
  assert(closeIcon?.getAttribute("fill") === "currentColor" && closeIcon.getAttribute("aria-hidden") === "true", "The close icon should inherit the on-surface color and remain decorative.");
  close.click();
  assert(component.selectedId === null && clearedItem === null, "Closing details should clear and report the selection.");
  assert(details.childElementCount === 0, "Closing details should clear the persistent details region.");
  assert(getComputedStyle(dimensionHeader).display === "grid", "Closing details should restore the dimension headings.");
  assert(getComputedStyle(dimensionKey).display === "block", "Closing details should restore the dimension key.");
  assert(shadow.activeElement === button, "Closing details should return focus to the previously selected cube.");
  assert([...shadow.querySelectorAll(".cifar-cube__select")].every((control) => control.getAttribute("aria-pressed") === "false"), "Closing details should clear every pressed state.");
});

await test("pointer selection retains the cube control focus", () => {
  const button = shadow.querySelectorAll<HTMLButtonElement>(".cifar-cube__select")[1];
  button.focus();
  button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
  assert(shadow.activeElement === button, "Pointer selection moved focus unexpectedly.");
});

await test("selection events cross the shadow boundary with the selected item", () => {
  let selectedId: string | undefined;
  component.addEventListener(CIFAR_CUBE_SELECTION_EVENT, (event) => {
    selectedId = (event as CustomEvent<{ item: CifarCubeItem | null }>).detail.item?.id;
  }, { once: true });
  shadow.querySelector<HTMLButtonElement>(".cifar-cube__select")?.click();
  assert(selectedId === "one", "Selection event detail was not exposed.");
});

await test("unpositioned datasets remain selectable without a fabricated cube", () => {
  const button = shadow.querySelector<HTMLButtonElement>(".cifar-cube__unpositioned-button");
  assert(button?.textContent === "Dataset without coordinates", "Unpositioned dataset is missing from the desktop fallback.");
  assert(component.validationIssues.some((issue) => issue.code === "item.position.missing"), "Missing position was not reported.");
});

await test("synchronous Angular-style property updates render and report once", async () => {
  const batchedComponent = document.createElement("cifar-cube") as CifarCube;
  let validationEventCount = 0;
  let reportedIssueCodes: string[] = [];
  batchedComponent.addEventListener(CIFAR_CUBE_VALIDATION_EVENT, (event) => {
    validationEventCount += 1;
    reportedIssueCodes = event.detail.issues.map((issue) => issue.code);
  });
  fixture?.append(batchedComponent);
  batchedComponent.items = items;
  batchedComponent.axes = axes;
  await nextLayout();
  assert(validationEventCount === 1, "Synchronous property updates should emit one final validation result.");
  assert(!reportedIssueCodes.includes("item.position.out-of-range"), "Validation reported a transient axes-order issue.");
  assert(batchedComponent.shadowRoot?.querySelectorAll(".cifar-cube__select").length === 2, "Final property values were not rendered.");
  batchedComponent.remove();
});

await test("compact mode exposes direct cards and removes the selection step", async () => {
  if (!fixture) throw new Error("Fixture container is missing.");
  fixture.style.width = "50rem";
  await nextLayout();
  const select = shadow.querySelector<HTMLElement>(".cifar-cube__select");
  const details = shadow.querySelector<HTMLElement>(".cifar-cube__details");
  const cards = [...shadow.querySelectorAll<HTMLElement>(".cifar-cube__compact-card")];
  const visualization = shadow.querySelector<HTMLElement>(".cifar-cube__intro-visualization");
  const compactDescription = shadow.querySelector<HTMLElement>(".cifar-cube__intro-compact");
  assert(select && getComputedStyle(select).display === "none", "Cube selection remains exposed in compact mode.");
  assert(details && getComputedStyle(details).display === "none", "Desktop details remain exposed in compact mode.");
  assert(visualization && getComputedStyle(visualization).display === "none", "Visualization guidance remains exposed in compact mode.");
  assert(compactDescription && getComputedStyle(compactDescription).display === "block", "Dataset guidance should be visible in compact mode.");
  assert(!compactDescription.textContent?.toLowerCase().includes("cube"), "Compact guidance should describe the datasets rather than the visualization.");
  assert(cards.length === items.length && cards.every((card) => getComputedStyle(card).display === "flex"), "Every dataset needs a compact card.");
  assert(cards.every((card) => card.querySelector("dl.cifar-cube__details-metadata")), "Every compact card needs a metadata description list.");
  const linkNames = cards.map((card) => card.querySelector("a")?.getAttribute("aria-label"));
  assert(new Set(linkNames).size === items.length, "Compact links need unique accessible names.");
});

await test("compact cards reflow from two columns to one based on component width", async () => {
  if (!fixture) throw new Error("Fixture container is missing.");
  const list = shadow.querySelector<HTMLElement>(".cifar-cube__list");
  assert(list && getComputedStyle(list).gridTemplateColumns.split(" ").length === 2, "Medium layout should use two columns.");
  fixture.style.width = "30rem";
  await nextLayout();
  assert(getComputedStyle(list).gridTemplateColumns.split(" ").length === 1, "Small layout should use one column.");
});

await test("malformed JSON attributes expose validation issues instead of retaining stale data", async () => {
  const invalidComponent = document.createElement("cifar-cube") as CifarCube;
  invalidComponent.setAttribute("axes", JSON.stringify(axes));
  invalidComponent.setAttribute("items", "{invalid");
  let reportedIssueCode: string | undefined;
  fixture?.addEventListener(CIFAR_CUBE_VALIDATION_EVENT, (event) => {
    reportedIssueCode = event.detail.issues[0]?.code;
  }, { once: true });
  fixture?.append(invalidComponent);
  await nextLayout();
  assert(invalidComponent.items.length === 0, "Malformed item data should not render stale datasets.");
  assert(invalidComponent.validationIssues.some((issue) => issue.code === "items.json.invalid"), "Malformed JSON should be reported.");
  assert(reportedIssueCode === "items.json.invalid", "Validation event must cross the component boundary.");
  invalidComponent.remove();
});

await test("incomplete axes replace the empty frame with a useful fallback", async () => {
  const invalidAxesComponent = document.createElement("cifar-cube") as CifarCube;
  invalidAxesComponent.setAttribute("axes", JSON.stringify({ ...axes, x: { label: "Spatial scale", values: [] } }));
  invalidAxesComponent.setAttribute("items", JSON.stringify([items[0]]));
  fixture?.append(invalidAxesComponent);
  await nextLayout();
  const invalidShadow = invalidAxesComponent.shadowRoot;
  assert(invalidShadow?.querySelector(".cifar-cube__plot-unavailable"), "Incomplete axes need a visible fallback message.");
  assert(invalidShadow?.querySelector(".cifar-cube__unpositioned-button"), "Dataset should remain available outside the plot.");
  invalidAxesComponent.remove();
});

document.title = failures === 0 ? "PASS — CIFAR cube browser tests" : `FAIL (${failures}) — CIFAR cube browser tests`;

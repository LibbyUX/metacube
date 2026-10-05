import {
  MHU_CUBE_SELECTION_EVENT,
  MHU_CUBE_VALIDATION_EVENT,
  MhuCube,
  defineMhuCube,
  type MhuCubeAxes,
  type MhuCubeItem,
} from "../../packages/mhu-cube/src";

const axes: MhuCubeAxes = {
  time: { label: "Time", unit: "years", min: 0, max: 100 },
  space: { label: "Space", values: ["small", "large"] },
  // Deliberately unsorted; the component displays organs alphabetically.
  organ: { label: "Organ", values: ["Liver", "Heart"] },
};
// "two" spans a range and overlaps the single age in "three", so they share their cell in lanes.
const items: MhuCubeItem[] = [
  {
    id: "one",
    label: "Dataset one",
    href: "#one",
    metadata: { Organ: "Heart", "Lead author": "Author one" },
    position: { time: { start: 20, end: 20 }, space: "small", organ: "Heart" },
  },
  {
    id: "two",
    label: "Dataset two",
    href: "#two",
    metadata: { Organ: "Liver", "Lead author": "Author two" },
    position: { time: { start: 10, end: 60 }, space: "large", organ: "Liver" },
  },
  {
    id: "three",
    label: "Dataset three",
    href: "#three",
    metadata: { Organ: "Liver", "Lead author": "Author three" },
    position: { time: { start: 30, end: 30 }, space: "large", organ: "Liver" },
  },
  { id: "unplotted", label: "Dataset without coordinates", href: "#unplotted", metadata: { Organ: "Heart", "Lead author": "Author four" } },
];
const positionedCount = items.filter((item) => item.position).length;

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

defineMhuCube();
const component = document.createElement("mhu-cube") as MhuCube;
fixture?.append(component);
component.axes = axes;
component.items = items;
await nextLayout();

const shadow = component.shadowRoot;
if (!shadow) throw new Error("Component shadow root was not created.");

await test("desktop introduction explains the visualization with semantic dimensions", () => {
  const intro = shadow.querySelectorAll(".mhu-cube__intro");
  assert(intro.length === 1, "The component should render one shared introduction.");
  assert(Boolean(intro[0].querySelector(".mhu-cube__intro-heading")), "The introduction heading is missing.");
  const visualization = intro[0].querySelector<HTMLElement>(".mhu-cube__intro-visualization");
  const compactDescription = intro[0].querySelector<HTMLElement>(".mhu-cube__intro-compact");
  assert(visualization && getComputedStyle(visualization).display !== "none", "Visualization guidance should be visible on desktop.");
  assert(compactDescription && getComputedStyle(compactDescription).display === "none", "Compact guidance should be hidden on desktop.");
  assert(
    visualization.querySelector(".mhu-cube__intro-summary")?.textContent === "This visualization compares datasets across time, space, and organ. Select a block to view its details.",
    "Visualization guidance should combine the comparison and selection instructions.",
  );
  const dimensionKey = visualization.querySelector<HTMLDListElement>("dl.mhu-cube__intro-dimensions");
  const dimensionHeadings = [...visualization.querySelectorAll(".mhu-cube__intro-dimensions-header span")].map((heading) => heading.textContent);
  const terms = [...(dimensionKey?.querySelectorAll("dt") ?? [])].map((term) => term.textContent);
  assert(dimensionHeadings.join(",") === "Dimension,What it represents", "The dimension key should expose its visual column headings.");
  assert(terms.join(",") === "Time,Space,Organ", "Visualization dimensions should use semantic terms.");
  const attribution = visualization.querySelector<HTMLAnchorElement>(".mhu-cube__intro-attribution a");
  assert(attribution?.getAttribute("href") === "https://github.com/Chair-for-Clinical-Bioinformatics/metacube", "Visualization attribution is missing.");
  assert(
    attribution?.parentElement?.textContent === "Inspired by Metacube from the Chair for Clinical Bioinformatics.",
    "Visualization attribution should credit the Metacube source.",
  );
});

await test("cube controls have unique names, descriptions, state, and details relationships", () => {
  const buttons = [...shadow.querySelectorAll<HTMLButtonElement>(".mhu-cube__select")];
  assert(buttons.length === positionedCount, "Only positioned datasets should create cube controls.");
  assert(buttons.map((button) => button.dataset.itemId).join(",") === "one,two,three", "Controls should follow organ, space, then time order.");
  buttons.forEach((button) => {
    const descriptionId = button.getAttribute("aria-describedby");
    const detailsId = button.getAttribute("aria-controls");
    assert(button.getAttribute("aria-label")?.startsWith("Select Dataset"), "Control needs a dataset-specific name.");
    assert(descriptionId && shadow.getElementById(descriptionId)?.textContent?.includes("Metadata"), "Control needs dataset context.");
    assert(detailsId && shadow.getElementById(detailsId), "Control must reference the details panel.");
    assert(button.hasAttribute("aria-pressed"), "Control must expose selection state.");
  });
});

await test("axes label time, space, and organ with organs in alphabetical order", () => {
  const labels = (selector: string) => [...shadow.querySelectorAll(selector)].map((label) => label.textContent).join(",");
  assert(labels(".mhu-cube__axis-title--time") === "Time (years)", "The time axis title should include its unit.");
  assert(labels(".mhu-cube__axis-value--time") === "0,20,40,60,80,100", "The time axis should default to five equal steps.");
  assert(labels(".mhu-cube__axis-value--space") === "small,large", "Space values should keep their supplied order.");
  assert(labels(".mhu-cube__axis-value--organ") === "Heart,Liver", "Organ values should be alphabetical.");
  assert(shadow.querySelector(".mhu-cube__frame-guide")?.getAttribute("d")?.split("M").length === 5, "Each interior tick needs a back-wall guide.");
});

await test("block descriptions state the time, space, and organ position", () => {
  const button = shadow.querySelector<HTMLButtonElement>('[data-item-id="two"]');
  const descriptionId = button?.getAttribute("aria-describedby");
  const description = descriptionId ? shadow.getElementById(descriptionId)?.textContent : undefined;
  assert(
    description?.includes("Visualization position: Time: 10–60 years, Space: large, Organ: Liver"),
    "Descriptions should name each axis with its value.",
  );
});

await test("time ranges draw taller blocks and overlapping ranges split their cell into lanes", () => {
  const block = (id: string) => shadow.querySelector<SVGSVGElement>(`[data-item-id="${id}"] .mhu-cube__cube`)?.getBoundingClientRect();
  const single = block("one");
  const range = block("two");
  const overlapping = block("three");
  assert(single && range && overlapping, "Fixture blocks are missing.");
  assert(range.height > overlapping.height, "A longer time range should draw a taller block.");
  assert(overlapping.width < single.width, "Overlapping datasets should narrow into lanes.");
});

await test("pointer input follows painted faces rather than block bounding boxes", async () => {
  const shortTop = shadow.querySelector<SVGPolygonElement>('[data-item-id="three"] .mhu-cube__top');
  const tallBlock = shadow.querySelector<HTMLButtonElement>('[data-item-id="two"]');
  assert(shortTop && tallBlock, "Fixture blocks are missing.");
  shortTop.scrollIntoView({ block: "center" });
  await nextLayout();
  const face = shortTop.getBoundingClientRect();
  const x = face.left + face.width / 2;
  const y = face.top + face.height / 2;
  const tallBounds = tallBlock.getBoundingClientRect();
  assert(
    x > tallBounds.left && x < tallBounds.right && y > tallBounds.top && y < tallBounds.bottom,
    "Fixture should place the short block inside the tall block's bounding box.",
  );
  const target = shadow.elementFromPoint(x, y)?.closest<HTMLButtonElement>("button");
  assert(target?.dataset.itemId === "three", "The visible short block should receive the pointer, not its tall neighbor.");
});

await test("keyboard activation focuses the action and keeps the live region mounted", async () => {
  const details = shadow.querySelector<HTMLElement>(".mhu-cube__details");
  const button = shadow.querySelector<HTMLButtonElement>(".mhu-cube__select");
  assert(details && button, "Fixture is missing interaction elements.");
  button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
  await waitFor(() => Boolean(shadow.querySelector(".mhu-cube__details-action")));
  const action = shadow.querySelector<HTMLAnchorElement>(".mhu-cube__details-action");
  assert(shadow.querySelector(".mhu-cube__details") === details, "Live region was replaced.");
  assert(shadow.activeElement === action, "Keyboard selection did not move focus to the metadata action.");
  assert(action?.getAttribute("aria-label") === "View metadata for Dataset one; Organ: Heart, Lead author: Author one", "Action name does not identify its dataset and metadata.");
});

await test("desktop selection swaps the dimension key for a closable dataset card", async () => {
  const section = shadow.querySelector<HTMLElement>(".mhu-cube");
  const intro = shadow.querySelector<HTMLElement>(".mhu-cube__intro");
  const details = shadow.querySelector<HTMLElement>(".mhu-cube__details");
  const dimensionKey = shadow.querySelector<HTMLElement>(".mhu-cube__intro-dimensions");
  const dimensionHeader = shadow.querySelector<HTMLElement>(".mhu-cube__intro-dimensions-header");
  const button = shadow.querySelectorAll<HTMLButtonElement>(".mhu-cube__select")[1];
  assert(section && intro && details && dimensionKey && dimensionHeader && button, "Fixture is missing desktop layout elements.");
  assert(getComputedStyle(section).gridTemplateAreas.includes("content stage"), "Desktop content should precede the visualization.");
  button.click();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    assert(details.getAnimations().length > 0, "Detail card should animate after selection.");
  }
  await waitFor(() => details.querySelector(".mhu-cube__details-heading")?.textContent === "Dataset two");
  assert(intro.isConnected, "Selecting a dataset should not replace the introduction.");
  assert(details.parentElement?.classList.contains("mhu-cube__intro-visualization"), "Details should occupy the dimension key region.");
  assert(getComputedStyle(dimensionHeader).display === "none", "The dimension headings should be hidden while details are open.");
  assert(getComputedStyle(dimensionKey).display === "none", "The dimension key should be hidden while details are open.");
  assert(details.querySelector("h3.mhu-cube__details-heading"), "The selected dataset title should be a level-three heading.");
  assert(Boolean(details.querySelector(".mhu-cube__details-card")), "Selection should render a dataset card in the introduction.");
  const metadata = details.querySelector("dl.mhu-cube__details-metadata");
  const metadataTerms = [...(metadata?.querySelectorAll("dt") ?? [])].map((term) => term.textContent);
  assert(metadata && metadataTerms.includes("Organ") && metadataTerms.includes("Lead author"), "Selected metadata needs semantic labels.");
  let clearedItem: MhuCubeItem | null | undefined;
  component.addEventListener(MHU_CUBE_SELECTION_EVENT, (event) => {
    clearedItem = event.detail.item;
  }, { once: true });
  const close = details.querySelector<HTMLButtonElement>(".mhu-cube__details-close");
  assert(close?.getAttribute("aria-label") === "Close dataset details", "The details card needs an accessible close button.");
  const closeIcon = close.querySelector("svg.mhu-cube__details-close-icon");
  assert(closeIcon?.getAttribute("fill") === "currentColor" && closeIcon.getAttribute("aria-hidden") === "true", "The close icon should inherit the on-surface color and remain decorative.");
  close.click();
  assert(component.selectedId === null && clearedItem === null, "Closing details should clear and report the selection.");
  assert(details.childElementCount === 0, "Closing details should clear the persistent details region.");
  assert(getComputedStyle(dimensionHeader).display === "grid", "Closing details should restore the dimension headings.");
  assert(getComputedStyle(dimensionKey).display === "block", "Closing details should restore the dimension key.");
  assert(shadow.activeElement === button, "Closing details should return focus to the previously selected cube.");
  assert([...shadow.querySelectorAll(".mhu-cube__select")].every((control) => control.getAttribute("aria-pressed") === "false"), "Closing details should clear every pressed state.");
});

await test("pointer selection retains the cube control focus", () => {
  const button = shadow.querySelectorAll<HTMLButtonElement>(".mhu-cube__select")[1];
  button.focus();
  button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
  assert(shadow.activeElement === button, "Pointer selection moved focus unexpectedly.");
});

await test("selection events cross the shadow boundary with the selected item", () => {
  let selectedId: string | undefined;
  component.addEventListener(MHU_CUBE_SELECTION_EVENT, (event) => {
    selectedId = (event as CustomEvent<{ item: MhuCubeItem | null }>).detail.item?.id;
  }, { once: true });
  shadow.querySelector<HTMLButtonElement>(".mhu-cube__select")?.click();
  assert(selectedId === "one", "Selection event detail was not exposed.");
});

await test("unpositioned datasets remain selectable without a fabricated cube", () => {
  const button = shadow.querySelector<HTMLButtonElement>(".mhu-cube__unpositioned-button");
  assert(button?.textContent === "Dataset without coordinates", "Unpositioned dataset is missing from the desktop fallback.");
  assert(component.validationIssues.some((issue) => issue.code === "item.position.missing"), "Missing position was not reported.");
});

await test("synchronous Angular-style property updates render and report once", async () => {
  const batchedComponent = document.createElement("mhu-cube") as MhuCube;
  let validationEventCount = 0;
  let reportedIssueCodes: string[] = [];
  batchedComponent.addEventListener(MHU_CUBE_VALIDATION_EVENT, (event) => {
    validationEventCount += 1;
    reportedIssueCodes = event.detail.issues.map((issue) => issue.code);
  });
  fixture?.append(batchedComponent);
  batchedComponent.items = items;
  batchedComponent.axes = axes;
  await nextLayout();
  assert(validationEventCount === 1, "Synchronous property updates should emit one final validation result.");
  assert(
    !reportedIssueCodes.some((code) => code.endsWith(".unknown") || code === "item.position.time.out-of-range"),
    "Validation reported a transient axes-order issue.",
  );
  assert(batchedComponent.shadowRoot?.querySelectorAll(".mhu-cube__select").length === positionedCount, "Final property values were not rendered.");
  batchedComponent.remove();
});

await test("compact mode exposes direct cards and removes the selection step", async () => {
  if (!fixture) throw new Error("Fixture container is missing.");
  fixture.style.width = "50rem";
  await nextLayout();
  const select = shadow.querySelector<HTMLElement>(".mhu-cube__select");
  const details = shadow.querySelector<HTMLElement>(".mhu-cube__details");
  const cards = [...shadow.querySelectorAll<HTMLElement>(".mhu-cube__compact-card")];
  const visualization = shadow.querySelector<HTMLElement>(".mhu-cube__intro-visualization");
  const compactDescription = shadow.querySelector<HTMLElement>(".mhu-cube__intro-compact");
  assert(select && getComputedStyle(select).display === "none", "Cube selection remains exposed in compact mode.");
  assert(details && getComputedStyle(details).display === "none", "Desktop details remain exposed in compact mode.");
  assert(visualization && getComputedStyle(visualization).display === "none", "Visualization guidance remains exposed in compact mode.");
  assert(compactDescription && getComputedStyle(compactDescription).display === "block", "Dataset guidance should be visible in compact mode.");
  assert(!compactDescription.textContent?.toLowerCase().includes("cube"), "Compact guidance should describe the datasets rather than the visualization.");
  assert(cards.length === items.length && cards.every((card) => getComputedStyle(card).display === "flex"), "Every dataset needs a compact card.");
  assert(cards.every((card) => card.querySelector("dl.mhu-cube__details-metadata")), "Every compact card needs a metadata description list.");
  const linkNames = cards.map((card) => card.querySelector("a")?.getAttribute("aria-label"));
  assert(new Set(linkNames).size === items.length, "Compact links need unique accessible names.");
  const link = cards[0].querySelector<HTMLAnchorElement>(".mhu-cube__compact-action");
  assert(link, "Compact card is missing its metadata link.");
  link.scrollIntoView({ block: "center" });
  await nextLayout();
  const linkBounds = link.getBoundingClientRect();
  const target = shadow.elementFromPoint(linkBounds.left + linkBounds.width / 2, linkBounds.top + linkBounds.height / 2);
  assert(target?.closest("a") === link, "Compact metadata links must receive pointer input.");
});

await test("compact cards reflow from two columns to one based on component width", async () => {
  if (!fixture) throw new Error("Fixture container is missing.");
  const list = shadow.querySelector<HTMLElement>(".mhu-cube__list");
  assert(list && getComputedStyle(list).gridTemplateColumns.split(" ").length === 2, "Medium layout should use two columns.");
  fixture.style.width = "30rem";
  await nextLayout();
  assert(getComputedStyle(list).gridTemplateColumns.split(" ").length === 1, "Small layout should use one column.");
});

await test("malformed JSON attributes expose validation issues instead of retaining stale data", async () => {
  const invalidComponent = document.createElement("mhu-cube") as MhuCube;
  invalidComponent.setAttribute("axes", JSON.stringify(axes));
  invalidComponent.setAttribute("items", "{invalid");
  let reportedIssueCode: string | undefined;
  fixture?.addEventListener(MHU_CUBE_VALIDATION_EVENT, (event) => {
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
  const invalidAxesComponent = document.createElement("mhu-cube") as MhuCube;
  invalidAxesComponent.setAttribute("axes", JSON.stringify({ ...axes, space: { label: "Space", values: [] } }));
  invalidAxesComponent.setAttribute("items", JSON.stringify([items[0]]));
  fixture?.append(invalidAxesComponent);
  await nextLayout();
  const invalidShadow = invalidAxesComponent.shadowRoot;
  assert(invalidShadow?.querySelector(".mhu-cube__plot-unavailable"), "Incomplete axes need a visible fallback message.");
  assert(invalidShadow?.querySelector(".mhu-cube__unpositioned-button"), "Dataset should remain available outside the plot.");
  invalidAxesComponent.remove();
});

document.title = failures === 0 ? "PASS — MHU cube browser tests" : `FAIL (${failures}) — MHU cube browser tests`;

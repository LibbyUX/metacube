import {
  CIFAR_CUBE_SELECTION_EVENT,
  CIFAR_CUBE_VALIDATION_EVENT,
  CifarCube,
  defineCifarCube,
  type CifarCubeAxes,
  type CifarCubeItem,
} from "../../src/embeds/cifar-cube";

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

await test("keyboard activation focuses the action and keeps the live region mounted", () => {
  const details = shadow.querySelector<HTMLElement>(".cifar-cube__details");
  const button = shadow.querySelector<HTMLButtonElement>(".cifar-cube__select");
  assert(details && button, "Fixture is missing interaction elements.");
  button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
  const action = shadow.querySelector<HTMLAnchorElement>(".cifar-cube__details-action");
  assert(shadow.querySelector(".cifar-cube__details") === details, "Live region was replaced.");
  assert(shadow.activeElement === action, "Keyboard selection did not move focus to the metadata action.");
  assert(action?.getAttribute("aria-label") === "View metadata for Dataset one", "Action name does not identify its dataset.");
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
    selectedId = (event as CustomEvent<{ item: CifarCubeItem }>).detail.item.id;
  }, { once: true });
  shadow.querySelector<HTMLButtonElement>(".cifar-cube__select")?.click();
  assert(selectedId === "one", "Selection event detail was not exposed.");
});

await test("unpositioned datasets remain selectable without a fabricated cube", () => {
  const button = shadow.querySelector<HTMLButtonElement>(".cifar-cube__unpositioned-button");
  assert(button?.textContent === "Dataset without coordinates", "Unpositioned dataset is missing from the desktop fallback.");
  assert(component.validationIssues.some((issue) => issue.code === "item.position.missing"), "Missing position was not reported.");
});

await test("compact mode exposes direct cards and removes the selection step", async () => {
  if (!fixture) throw new Error("Fixture container is missing.");
  fixture.style.width = "50rem";
  await nextLayout();
  const select = shadow.querySelector<HTMLElement>(".cifar-cube__select");
  const details = shadow.querySelector<HTMLElement>(".cifar-cube__details");
  const cards = [...shadow.querySelectorAll<HTMLElement>(".cifar-cube__compact-card")];
  assert(select && getComputedStyle(select).display === "none", "Cube selection remains exposed in compact mode.");
  assert(details && getComputedStyle(details).display === "none", "Desktop details remain exposed in compact mode.");
  assert(cards.length === items.length && cards.every((card) => getComputedStyle(card).display === "flex"), "Every dataset needs a compact card.");
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
    reportedIssueCode = (event as CustomEvent<{ issues: Array<{ code: string }> }>).detail.issues[0]?.code;
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

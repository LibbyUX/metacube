# MHU cube handoff package

`<mhu-cube>` is an accessible, responsive web component for comparing Multiscale Human Portal organ-imaging datasets and opening their metadata. It is the sole component handoff target from this prototype repository.

When its container is wider than `64rem`, the component keeps its introduction visible beside a perspective canvas that plots each dataset by **time** (donor age, vertical), **space** (spatial scale), and **organ** (alphabetical), and reveals the selected dataset card beneath that introduction. At `64rem` and below, it replaces the canvas and selection workflow with direct [dataset cards](#dataset-cards), as many per row as fit at the designed card width (about `16rem`).

## Handoff status

- The distributable is standards-based ESM with bundled Shadow DOM styles and TypeScript declarations.
- It has no runtime dependencies and does not require Vite in a consuming application.
- The package is marked `private` to prevent accidental registry publication. The receiving team can remove that flag if it chooses an internal registry delivery workflow.
- Vite is used only by the temporary prototype repository to produce the prebuilt ESM file and run preview pages. The Angular team may keep the prebuilt file or rebuild the source with its preferred tooling.
- No dependencies were installed, removed, or upgraded while preparing this package.
- Automated Node tests cover validation, time mapping, lane layout, paint order, package imports, and critical CSS rules.
- The browser interaction and responsive test harness is compiled in CI, but is not yet executed by a headless browser. Run it manually before release and replace or supplement it with the team's browser test framework.
- Integration has not yet been verified inside the destination Angular application.

## Package contents

```text
packages/mhu-cube/
├── dist/                  # Prebuilt ESM, source map, and TypeScript declarations
├── src/                   # Framework-independent custom element source and CSS
├── LICENSE
├── package.json
├── README.md
└── tsconfig.build.json    # Declaration-only build used by this repository
```

The package intentionally contains no `dependencies` or `devDependencies`. The root repository owns its temporary preview/build toolchain.

`dist/mhu-cube.js` is the required, framework-neutral runtime bundle. The root declaration files (`index.d.ts`, `mhu-cube.d.ts`, `types.d.ts`, and `validation.d.ts`) support TypeScript and Angular. JavaScript and declaration maps are optional debugging aids; declarations for internal source modules are harmless compiler output rather than additional public entry points. Do not edit `dist` manually—run `npm run build:embed` after changing package source.

### Source responsibilities

| Source | Responsibility |
| --- | --- |
| `src/index.ts` | Supported package exports. |
| `src/mhu-cube.ts` | Custom-element lifecycle, state, rendering coordination, and events. |
| `src/mhu-cube-cards.ts` | Intro, preview-card, selected-card, and compact-card markup. |
| `src/mhu-cube-visualization.ts` | SVG frame with time and floor guides, blocks with floor shadows and age markers, axis labels, and accessible visualization descriptions. |
| `src/projection.ts` | Framework-independent projection, category spacing, time mapping, lane layout, and paint order. |
| `src/validation.ts` | Runtime normalization, alphabetical organ order, URL safety, and validation issues. |
| `src/mhu-cube-copy.ts` | Editable introduction copy. |
| `src/mhu-cube.css` | Encapsulated responsive presentation and state styling. |
| `src/mhu-cube-data.css` | Dimension key and dataset-detail presentation. |
| `src/mhu-cube-cards.css` | Compact dataset cards, including their touch and mouse interactions. |

## Acknowledgment

The `mhu-cube` interaction and visual design were inspired by the original metacube visualization from the Chair for Clinical Bioinformatics. The component is an independent web-component implementation and does not copy substantive code from that visualization.

## Angular integration

Add the package to the Angular workspace using the team's normal internal-package or local-package process. Then register the element once in browser startup code:

```ts
import { defineMhuCube } from "@mhu/mhu-cube";

defineMhuCube();
```

`defineMhuCube()` is idempotent and safely returns when `customElements` is unavailable during server rendering. It must also run in the browser before Angular creates `<mhu-cube>`.

Allow the custom element in the Angular component or module that owns the integration, following Angular's [`CUSTOM_ELEMENTS_SCHEMA` guidance](https://angular.dev/guide/components/advanced-configuration#custom-element-schemas):

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-dataset-browser",
  templateUrl: "./dataset-browser.component.html",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DatasetBrowserComponent {}
```

Bind arrays and objects as DOM properties, not serialized HTML attributes:

```html
<mhu-cube
  label="Organ imaging datasets"
  [axes]="axes"
  [items]="items"
  [selectedId]="selectedId"
  (mhu-cube-selection-change)="handleSelection($event)"
  (mhu-cube-validation)="handleValidation($event)"
></mhu-cube>
```

Angular commonly assigns bound properties synchronously. The component coalesces those assignments into one render and one final validation event, so setting `items` before `axes` does not expose a transient unknown-value warning.

### Optional Angular wrapper

The custom element works in Angular as-is. If the team prefers typed Angular inputs and outputs over `CUSTOM_ELEMENTS_SCHEMA` in feature templates, a thin wrapper can own the element. This sketch is a starting point, not a shipped file; the package adds no Angular dependency:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from "@angular/core";
import {
  defineMhuCube,
  type MhuCubeAxes,
  type MhuCubeGuides,
  type MhuCubeItem,
  type MhuCubeSelectionDetail,
  type MhuCubeValidationDetail,
  type MhuCubeView,
} from "@mhu/mhu-cube";

defineMhuCube();

@Component({
  selector: "app-mhu-cube",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <mhu-cube
      [attr.label]="label()"
      [axes]="axes()"
      [items]="items()"
      [selectedId]="selectedId()"
      [view]="view()"
      [guides]="guides()"
      [compactMetadata]="compactMetadata()"
      [hoverMetadata]="hoverMetadata()"
      (mhu-cube-selection-change)="selectionChange.emit($event.detail)"
      (mhu-cube-validation)="validation.emit($event.detail)"
    ></mhu-cube>
  `,
})
export class MhuCubeComponent {
  readonly label = input("Organ imaging datasets");
  readonly axes = input.required<MhuCubeAxes>();
  readonly items = input.required<MhuCubeItem[]>();
  readonly selectedId = input<string | null>(null);
  readonly view = input<MhuCubeView>("corner");
  readonly guides = input<MhuCubeGuides>("full");
  readonly compactMetadata = input<string[] | null>(null);
  readonly hoverMetadata = input<string[] | null>(null);
  readonly selectionChange = output<MhuCubeSelectionDetail>();
  readonly validation = output<MhuCubeValidationDetail>();
}
```

Call `defineMhuCube()` only in the browser when the application uses server rendering.

The destination page owns external spacing. This matches the proposed Angular Material page gutters without special component configuration:

```css
.dataset-page {
  padding-inline: 20px;
}

@media (min-width: 961px) {
  .dataset-page {
    padding-inline: 40px;
  }
}

mhu-cube {
  display: block;
  width: 100%;
  height: calc(100dvh - var(--app-header-height));
}
```

The component responds to its available container width rather than the browser viewport, so page gutters and Angular layout containers are accounted for automatically. On compact layouts its height becomes content-driven.

## Public API

### Properties and JSON attributes

| Name | Type | Purpose |
| --- | --- | --- |
| `axes` | `MhuCubeAxes` | Defines the `time`, `space`, and `organ` axes. |
| `items` | `MhuCubeItem[]` | Supplies dataset labels, metadata, destinations, statuses, and plot positions. |
| `selectedId` | `string \| null` | Selects a valid dataset on the desktop canvas. Property only. |
| `label` | `string` | Gives the component section its accessible name. |
| `view` | `"corner" \| "front"` | Desktop camera. Defaults to `"corner"`. See [Prototype options](#prototype-options). |
| `guides` | `"full" \| "minimal"` | Desktop reference drawing. Defaults to `"full"`. See [Prototype options](#prototype-options). |
| `compactMetadata` | `string[] \| null` | Metadata names shown on [compact cards](#dataset-cards), in order and ignoring case. Defaults to `null`, which shows every entry the card does not already show. The selected dataset card always shows every entry. |
| `hoverMetadata` | `string[] \| null` | Metadata names shown on the desktop hover card, in order and ignoring case. Defaults to `null`, which shows every entry. Block descriptions for assistive technology always include every entry. |

`axes` and `items` may also be passed as JSON attributes for static HTML prototypes. Property binding is recommended for Angular because it preserves types and avoids serialization. `view` and `guides` work as plain attributes or properties; unknown values fall back to the default and report a `view.invalid` or `guides.invalid` warning. `compactMetadata` and `hoverMetadata` also accept `compact-metadata` and `hover-metadata` JSON attributes, such as `compact-metadata='["Corresponding authors"]'`; anything other than a list of strings falls back to `null` with a `compact-metadata.invalid` or `hover-metadata.invalid` warning.

### Prototype options

Stakeholders are reviewing three desktop presentations. Each is a combination of `view` and `guides`, and the repository preview offers a switcher with a shareable link for each (`?option=a`, `b`, or `c`):

| Option | `view` | `guides` | What it shows |
| --- | --- | --- | --- |
| A · Corner view | `corner` | `full` | A low camera across the front corner, with floor guides, block footprints, and drop lines. |
| B · No floor lines | `corner` | `minimal` | The same view without anything drawn on the floor. Back-wall time lines and the hover age marker remain. |
| C · Front view | `front` | `full` | Faces the organ axis: organs run left to right, time runs straight up, and space recedes upward into the page. |

- **Corner view:** space and organ labels run along the two front floor edges, and time ticks up the left edge.
- **Front view:** organ labels run along the level front edge, space labels along the right floor edge, and time ticks up the front-left edge. Front-row heights read against the ticks; back-row heights read against the back-wall time lines. Overlapping datasets sit side by side within their organ instead of splitting along space.
- Compact layouts are the same for every option.

Once stakeholders choose, the team can keep both properties as supported settings or fix the chosen values and remove the rest.

```html
<mhu-cube view="front" guides="full" [axes]="axes" [items]="items"></mhu-cube>
```

### Axis model

```ts
interface MhuCubeAxes {
  time: { label: string; unit?: string; min: number; max: number; ticks?: number[] };
  space: { label: string; values: string[] };
  organ: { label: string; values: string[] };
}
```

```ts
const axes: MhuCubeAxes = {
  time: { label: "Time", unit: "years", min: 0, max: 100 },
  space: { label: "Space", values: ["100 µm", "100 mm"] },
  organ: { label: "Organ", values: ["Heart", "Kidney", "Liver", "Thymus"] },
};
```

- **Time** is the continuous vertical axis, measured as donor age. `min` must be less than `max`. `ticks` are optional; the default is five equal steps (`0, 20, 40, 60, 80, 100` above). The axis title appends `unit`, as in “Time (years)”; `unit` also appears in formatted ranges, such as “7–47 years”, and in the screen-reader axis summary. Faint guide lines on the back walls mark each interior tick.
- **Space** values are displayed in the order supplied, so list them from smallest to largest.
- **Organ** values are always displayed alphabetically, regardless of the order supplied. Sorting ignores case and accents, so names that differ only that way are rejected as duplicates.
- Space and organ values must be nonempty, unique strings. The normalized `element.axes` value reflects the alphabetical organ order and the effective time ticks.

### Dataset model

```ts
interface MhuCubeItem {
  id: string;
  label: string;
  href?: string;
  image?: string;
  metadata?: Record<string, string | number | string[] | null | undefined>;
  position?: {
    time: { start: number; end: number; label?: string };
    space: string;
    organ: string;
  };
  status?: "available" | "current" | "unavailable";
}
```

```ts
const item: MhuCubeItem = {
  id: "zandstra-thymus-codex",
  label: "Thymus, 100 µm, 4–5 months",
  href: "/metadata/zandstra-thymus-codex",
  image: "/images/zandstra-thymus-codex.png",
  metadata: { "Corresponding authors": ["Peter W. Zandstra", "Fabio M.V. Rossi"] },
  position: { time: { start: 4 / 12, end: 5 / 12, label: "4–5 months" }, space: "100 µm", organ: "Thymus" },
};
```

- `id` must be nonempty and unique.
- `href` accepts relative, hash, HTTP, and HTTPS destinations. Unsafe or invalid protocols are removed.
- `image` is a square picture of the dataset with a transparent background, shown on compact cards over the primary container fill. It accepts relative, HTTP, and HTTPS URLs; unsafe ones are removed with an `item.image.unsafe` warning. A missing image, or one that fails to load, leaves the empty fill.
- `metadata` preserves supported values and their source order. A list of strings, such as several authors, shows one entry per line on compact cards and is joined with commas elsewhere, including the selected dataset card and hover card. `null`, `undefined`, and empty lists are retained in normalized data but not displayed.
- `position.space` and `position.organ` must exactly match a configured axis value. They are referenced by name, not index, so organ sorting never moves a dataset.
- `position.time` is inclusive and must lie inside the time axis, with `start` no later than `end`. A single age uses the same `start` and `end`. Use `label` when the numbers alone read poorly, for example months for infant donors; it replaces the formatted range in descriptions.
- A missing or unusable position keeps the dataset available but moves it to the desktop “Not plotted” fallback instead of inventing a block.
- A dataset without a valid destination is treated as unavailable.

### How positions are drawn

- A time range draws a block from `start` to `end`, so wider ranges become taller, rectangular blocks.
- Single ages and ranges shorter than a block's width are drawn as cubes centered on their midpoint. Near either end of the axis, the cube shifts inward rather than being clipped, so its exact time is carried by its label, metadata, and accessible description.
- Datasets that share a space and organ and whose drawn heights overlap split that cell into side-by-side lanes. Only the overlapping datasets narrow; taller blocks take the farther lanes so they never hide shorter ones.
- Datasets in the same cell that do not overlap stack vertically at full width.
- Space usually has only a few values, so they spread toward the ends of the space axis instead of filling equal cells. With two values in the corner view, one row of blocks runs along the left wall and the other along the front; in the front view they form a back row and a front row. Larger sets fall back to equal cells.
- Faint floor guides run from every space and organ label across the floor. Each block casts its footprint onto the floor where its two guides cross, with dashed drop lines from its bottom corners, so a floating block can be traced back to its labels.
- Both cameras keep the floor shallow, so depth moves a block up the screen far less than time does and heights read close to the time labels across the whole plot.
- Even so, a block's depth shifts it slightly against the time ticks. Hovering, keyboard focus, or selection reveals a bracket on the time axis for the dataset's exact start and end, plus level lines tracing those heights from the block to the axis. Single ages show a single level line and a dot.
- The plot is as large as its column allows. Each camera's frame fills a drawing area with the frame's own proportions, and labels hang into fixed `rem` gutters around that area, so they keep their room at any size. Whichever of the column's height or width runs out first sets the size; the other dimension keeps the leftover space, centered.
- Axis labels are placed from the frame itself. Each value label hangs from its axis position, offset straight out from the frame, and the space and organ titles sit in a second row beyond them. Labels stay clear of the frame and each other for values up to about `4rem` wide; longer space or organ names may need shorter display labels.
- Keyboard order, reading order, and compact-card order follow the plot: organ, then space, then time.

### Dataset cards

At `64rem` and below, each dataset is a card built from the [Figma design](https://www.figma.com/design/bSpc6bQC5nGwDaWJfx7Cen/CNS-Projects-2026?node-id=3169-242638&m=dev):

- A card on the lowest container surface (`surface-container-lowest`), white in light themes.
- The dataset's `image`, about `14rem` square, on the primary container fill. Non-square images are contained and sit on the bottom edge.
- Time and space, each after a small primary square.
- The organ as the card title.
- Below a divider, the metadata named in `compactMetadata`. Without it, every remaining entry appears, except entries whose key matches an axis label (ignoring case), because the card already shows them.
- Interaction depends on the input device, not the width:
  - **Mouse or trackpad** (`(hover: hover) and (pointer: fine)`): the image and the organ name both open the metadata page. Hovering the image grows it within its square; hovering the name underlines it. The rest of the card is not a link.
  - **Touch:** the title link stretches over the whole card, so pressing anywhere opens the metadata page.
- Unavailable datasets have no links and say that metadata is not available. The current dataset shows a “Current page” label.
- Datasets without a usable position fall back to their label as the title and all of their metadata.

Read `element.items`, `element.axes`, and `element.validationIssues` to inspect normalized values and current issues.

### Events

`mhu-cube-selection-change` fires after a desktop selection changes. Closing the selected-dataset card emits `null`:

```ts
element.addEventListener("mhu-cube-selection-change", (event) => {
  console.log(event.detail.item ?? "Selection cleared");
});
```

`mhu-cube-validation` fires after connected configuration updates have been coalesced:

```ts
element.addEventListener("mhu-cube-validation", (event) => {
  event.detail.issues.forEach((issue) => {
    console.warn(issue.code, issue.path, issue.message);
  });
});
```

Both custom events bubble through the Shadow DOM boundary and are composed. Included declarations add event-detail types and map the `mhu-cube` tag to `MhuCube`.

Image and position validation codes, all warnings that leave the dataset available but unplotted unless noted:

| Code | Cause |
| --- | --- |
| `item.image.unsafe` | `image` is not a relative, HTTP, or HTTPS URL; the dataset is shown without it. |
| `item.position.missing` | No `position` was supplied. |
| `item.position.invalid` | `position` is not an object, or uses the retired `{ x, y, z }` index format. |
| `item.position.time.invalid` | `time` lacks finite `start` and `end`, or `start` is later than `end`. |
| `item.position.time.out-of-range` | `time` falls outside the time axis. |
| `item.position.time.label.invalid` | `time.label` is empty; the dataset is still plotted with formatted values. |
| `item.position.space.unknown` | `space` does not exactly match a configured space value. |
| `item.position.organ.unknown` | `organ` does not exactly match a configured organ value. |

Axis errors use `axes.invalid`, `axis.invalid`, `axis.label.invalid`, `axis.values.invalid`, `axis.value.invalid`, `axis.values.duplicate`, `axis.time.range.invalid`, `axis.time.ticks.invalid`, and `axis.time.unit.invalid`.

## Theming

The component first uses its public CSS custom properties, then matching Angular Material system tokens, then built-in fallbacks:

```css
mhu-cube {
  --mhu-cube-surface: var(--mat-sys-surface);
  --mhu-cube-surface-container: var(--mat-sys-surface-container);
  --mhu-cube-surface-container-lowest: var(--mat-sys-surface-container-lowest);
  --mhu-cube-on-surface: var(--mat-sys-on-surface);
  --mhu-cube-on-surface-variant: var(--mat-sys-on-surface-variant);
  --mhu-cube-primary: var(--mat-sys-primary);
  --mhu-cube-on-primary: var(--mat-sys-on-primary);
  --mhu-cube-primary-container: var(--mat-sys-primary-container);
  --mhu-cube-on-primary-container: var(--mat-sys-on-primary-container);
  --mhu-cube-outline: var(--mat-sys-outline);
  --mhu-cube-outline-variant: var(--mat-sys-outline-variant);
  --mhu-cube-focus: var(--mat-sys-primary);
}
```

Do not style private Shadow DOM class names from the Angular application. They are implementation details and intentionally encapsulated.

The current handoff intentionally has no quantitative color scale. Block height encodes the dataset's time range; block fill communicates interaction and availability states only, so consuming applications should not imply a data value from its intensity.

### Typography

The component consumes Angular Material system typography properties when the host defines them and uses matching Material 3 fallbacks otherwise. The desktop introduction uses `headline-large`; the compact introduction uses `headline-medium`. Introduction headings use their role-specific weight tokens with an approved 600-weight fallback, while dimension-key headers, eyebrows, and axis titles use the approved 600-weight treatment. Other roles defer to their M3 weight tokens, while the selected-dataset heading and stat terms retain their approved 500-weight treatment. Compact card titles, facts, and metadata labels use the card design's 600 weight. The desktop intro and selected-card column does not create an independent scroll region.

The host application owns font loading. The Roboto files used by this repository belong to the preview page and are not runtime dependencies of the web component.

### Intro copy

The prototype introduction is managed in `src/mhu-cube-copy.ts`. `heading` appears beside the desktop canvas and stays on one line, so keep it to about 28 characters at the default type size. `compactHeading` replaces it at `64rem` and below and may wrap. Above `64rem`, a compact, divider-separated dimension key with visual column headings explains time, space, and organ and includes selection guidance. Selecting a block replaces the dimension key and its headings with a closable dataset card in the same left-column position; closing it restores the key and returns focus to the selected block. The Metacube acknowledgment remains anchored to the bottom of the desktop content column in either state. At `64rem` and below, visualization-specific content is removed from the layout and accessibility tree, leaving the compact heading alone above the dataset cards; there is no compact body text.

The dimension key and dataset cards use semantic definition lists with subtle row separators. The selected desktop card uses the container surface; compact cards are described under [Dataset cards](#dataset-cards). The preview titles use a consistent organ, space, and time sequence so datasets sharing a cell stay distinguishable; the component itself continues to display whatever label the host supplies.

The structured copy includes the desktop `heading` and `visualization` copy and a `compactHeading`; `eyebrow` is optional and currently omitted; when absent it leaves no empty element. This is an internal handoff configuration, not a public custom-element property. The receiving team can keep it internal or expose host-provided copy if reuse requires that flexibility.

## Accessibility behavior

- Desktop blocks are native buttons with unique accessible names, descriptions, selected state, and a relationship to the persistent details region. Descriptions state the time, space, and organ position, such as “Time: 7–47 years, Space: 100 µm, Organ: Liver”.
- Only a block's painted faces receive pointer input, so a tall block's bounding box never intercepts clicks meant for a neighbor. Keyboard and reading order follow organ, space, and time.
- Keyboard activation moves focus directly to the selected dataset's metadata action. Pointer activation keeps focus on the block.
- Compact layouts remove the selection step. Each card's organ title is its one keyboard-reachable link; hidden text adds the time and space, such as “Liver, 7–47 years, 100 µm”, so cards that share an organ still have unique link names. The image link repeats it for pointer users and is removed from the tab order and accessibility tree, and its image has empty alternative text. The current dataset's link carries `aria-current="page"`.
- Visualization dimensions and card metadata use semantic definition lists.
- The introduction remains visible after desktop selection. The persistent details region replaces the dimension key with a semantically headed dataset card and announces selection changes politely. Closing the card restores the key and returns focus to the previously selected block.
- Current, unavailable, hover, focus, and selected states do not rely on color alone.
- Reduced-motion and Windows forced-colors preferences are supported.
- Axis text has an equivalent screen-reader summary; decorative SVG geometry is hidden from assistive technology.

These measures improve accessibility but are not a claim of formal WCAG conformance. The receiving team should test the component with its supported browser and assistive-technology matrix after Angular integration.

## Repository preview and validation

From the repository root, using the already-present dependencies:

```bash
npm run dev
```

Open `/mhu-cube/index.html` for the component preview. The switcher above it moves between the [prototype options](#prototype-options); add `?option=b` or `?option=c` to link straight to one. Narrow the window below `64rem` to see the dataset cards, and use the browser's device emulation to try the touch interaction.

The example configuration plots donor age from 0 to 100 years and displays its space categories as `100 µm` and `100 mm`. These are preview data rather than hard-coded component defaults, and the preview uses them consistently in the axes, dataset headings, metadata, and accessible descriptions. Its two Liver · 100 µm datasets (age 45 and ages 7–47) demonstrate lanes, and the infant Thymus dataset demonstrates a time label, the inward shift at the axis floor, a card image, and two corresponding authors. The preview labels a single author “Corresponding author” and several “Corresponding authors”, and sets `compactMetadata` to both names. `hoverMetadata` is set to time, space, organ, and sex. So the selected dataset card shows everything, the hover card leaves out the authors, and the compact cards show only the authors. Every preview dataset has a square image in `mhu-cube/images/`, mapped to its dataset ID in `mhu-cube/main.ts`.

Run the non-installing validation commands:

```bash
npm run typecheck
npm test
npm run build:embed
npm run test:embed
npm run test:browser:build
npm run test:package
```

For manual browser checks, run `npm run test:browser` and open the local URL it prints. A passing harness changes the document title to `PASS — MHU cube browser tests`. Check keyboard use, zoom, light/dark themes, forced colors, widths on both sides of `64rem`, and the compact cards with both a mouse and a touch screen. Because hit testing relies on SVG `pointer-events`, also confirm clicks and hover cards in Firefox and Safari, and that lane blocks just above `64rem` remain comfortable pointer targets.

## Rebuilding or replacing the toolchain

The checked-in `dist/mhu-cube.js` is the consumable module. It contains the component styles and does not import Vite, React, Angular, or any other package at runtime.

This prototype repository currently uses its existing Vite configuration to bundle the TypeScript and inline CSS. That choice is not part of the component contract. If the receiving team rebuilds from `src/`, its chosen compiler must bundle `mhu-cube.css` as the string imported by `mhu-cube.ts`, or replace that internal style-loading step with an equivalent supported by its Angular build system. Public properties, events, DOM behavior, and CSS custom properties should remain unchanged.

Before accepting the handoff, the developer team should decide:

1. Whether to consume the prebuilt local package or migrate the source into its Angular workspace.
2. Where dataset configuration and metadata URLs will be owned.
3. Which automated browser runner will execute the included behavioral scenarios.
4. Which supported-browser and assistive-technology matrix is required for release.

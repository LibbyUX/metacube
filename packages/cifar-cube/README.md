# CIFAR cube handoff package

`<cifar-cube>` is an accessible, responsive web component for comparing organ-imaging datasets and opening their metadata. It is the sole component handoff target from this prototype repository.

When its container is wider than `64rem`, the component keeps its introduction visible beside a cube canvas and reveals the selected dataset card beneath that introduction. At `64rem` and below, it replaces the canvas and selection workflow with direct dataset cards. Cards use two columns above `40rem` and one column at `40rem` and below.

## Handoff status

- The distributable is standards-based ESM with bundled Shadow DOM styles and TypeScript declarations.
- It has no runtime dependencies and does not require Vite in a consuming application.
- The package is marked `private` to prevent accidental registry publication. The receiving team can remove that flag if it chooses an internal registry delivery workflow.
- Vite is used only by the temporary prototype repository to produce the prebuilt ESM file and run preview pages. The Angular team may keep the prebuilt file or rebuild the source with its preferred tooling.
- No dependencies were installed, removed, or upgraded while preparing this package.
- Automated Node tests cover validation, projection, package imports, and critical CSS rules.
- The browser interaction and responsive test harness is compiled in CI, but is not yet executed by a headless browser. Run it manually before release and replace or supplement it with the team's browser test framework.
- Integration has not yet been verified inside the destination Angular application.

## Package contents

```text
packages/cifar-cube/
├── dist/                  # Prebuilt ESM, source map, and TypeScript declarations
├── src/                   # Framework-independent custom element source and CSS
├── LICENSE
├── package.json
├── README.md
└── tsconfig.build.json    # Declaration-only build used by this repository
```

The package intentionally contains no `dependencies` or `devDependencies`. The root repository owns its temporary preview/build toolchain.

`dist/cifar-cube.js` is the required, framework-neutral runtime bundle. The root declaration files (`index.d.ts`, `cifar-cube.d.ts`, `types.d.ts`, and `validation.d.ts`) support TypeScript and Angular. JavaScript and declaration maps are optional debugging aids; declarations for internal source modules are harmless compiler output rather than additional public entry points. Do not edit `dist` manually—run `npm run build:embed` after changing package source.

### Source responsibilities

| Source | Responsibility |
| --- | --- |
| `src/index.ts` | Supported package exports. |
| `src/cifar-cube.ts` | Custom-element lifecycle, state, rendering coordination, and events. |
| `src/cifar-cube-cards.ts` | Intro, preview-card, selected-card, and compact-card markup. |
| `src/cifar-cube-visualization.ts` | SVG frame, cubes, axis labels, and accessible visualization descriptions. |
| `src/projection.ts` | Framework-independent projection calculations. |
| `src/validation.ts` | Runtime normalization, URL safety, and validation issues. |
| `src/cifar-cube-copy.ts` | Editable introduction copy. |
| `src/cifar-cube.css` | Encapsulated responsive presentation and state styling. |

## Acknowledgment

The `cifar-cube` interaction and visual design were inspired by the original metacube visualization from the Chair for Clinical Bioinformatics. The component is an independent web-component implementation and does not copy substantive code from that visualization.

## Angular integration

Add the package to the Angular workspace using the team's normal internal-package or local-package process. Then register the element once in browser startup code:

```ts
import { defineCifarCube } from "@cifar/cifar-cube";

defineCifarCube();
```

`defineCifarCube()` is idempotent and safely returns when `customElements` is unavailable during server rendering. It must also run in the browser before Angular creates `<cifar-cube>`.

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
<cifar-cube
  label="Organ imaging datasets"
  [axes]="axes"
  [items]="items"
  [selectedId]="selectedId"
  (cifar-cube-selection-change)="handleSelection($event)"
  (cifar-cube-validation)="handleValidation($event)"
></cifar-cube>
```

Angular commonly assigns bound properties synchronously. The component coalesces those assignments into one render and one final validation event, so setting `items` before `axes` does not expose a transient out-of-range warning.

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

cifar-cube {
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
| `axes` | `CifarCubeAxes` | Defines the categorical `x`, `y`, and `z` axes. |
| `items` | `CifarCubeItem[]` | Supplies dataset labels, metadata, destinations, statuses, plot positions, and optional visual scale adjustments. |
| `selectedId` | `string \| null` | Selects a valid dataset on the desktop canvas. Property only. |
| `label` | `string` | Gives the component section its accessible name. |

`axes` and `items` may also be passed as JSON attributes for static HTML prototypes. Property binding is recommended for Angular because it preserves types and avoids serialization.

### Axis model

```ts
interface CifarCubeAxes {
  x: { label: string; values: string[] };
  y: { label: string; values: string[] };
  z: { label: string; values: string[] };
}
```

Axis values must be nonempty, unique strings. Positions are zero-based indexes into these arrays; the component does not infer or fabricate coordinates.

### Dataset model

```ts
interface CifarCubeItem {
  id: string;
  label: string;
  href?: string;
  metadata?: Record<string, string | number | null | undefined>;
  position?: { x: number; y: number; z: number };
  cubeScale?: number;
  status?: "available" | "current" | "unavailable";
}
```

- `id` must be nonempty and unique.
- `href` accepts relative, hash, HTTP, and HTTPS destinations. Unsafe or invalid protocols are removed.
- `metadata` preserves supported values and their source order. `null` and `undefined` values are retained in normalized data but not displayed.
- `position` must contain in-range, nonnegative integer indexes. A missing or unusable position keeps the dataset available but moves it to the desktop “Not plotted” fallback instead of inventing a cube.
- `cubeScale` optionally reduces a desktop cube relative to the default size. It is a presentational adjustment—not a quantitative data encoding—and has no effect in compact card layouts. It must be greater than `0` and no larger than `1`; invalid values fall back to the default size and produce a validation warning.
- Only one dataset can occupy a position. Later duplicates remain available but are not plotted.
- A dataset without a valid destination is treated as unavailable.

Read `element.items`, `element.axes`, and `element.validationIssues` to inspect normalized values and current issues.

### Events

`cifar-cube-selection-change` fires after a desktop dataset is selected:

```ts
element.addEventListener("cifar-cube-selection-change", (event) => {
  console.log(event.detail.item);
});
```

`cifar-cube-validation` fires after connected configuration updates have been coalesced:

```ts
element.addEventListener("cifar-cube-validation", (event) => {
  event.detail.issues.forEach((issue) => {
    console.warn(issue.code, issue.path, issue.message);
  });
});
```

Both custom events bubble through the Shadow DOM boundary and are composed. Included declarations add event-detail types and map the `cifar-cube` tag to `CifarCube`.

## Theming

The component first uses its public CSS custom properties, then matching Angular Material system tokens, then built-in fallbacks:

```css
cifar-cube {
  --cifar-cube-surface: var(--mat-sys-surface);
  --cifar-cube-surface-container: var(--mat-sys-surface-container);
  --cifar-cube-on-surface: var(--mat-sys-on-surface);
  --cifar-cube-on-surface-variant: var(--mat-sys-on-surface-variant);
  --cifar-cube-primary: var(--mat-sys-primary);
  --cifar-cube-on-primary: var(--mat-sys-on-primary);
  --cifar-cube-primary-container: var(--mat-sys-primary-container);
  --cifar-cube-on-primary-container: var(--mat-sys-on-primary-container);
  --cifar-cube-outline: var(--mat-sys-outline);
  --cifar-cube-outline-variant: var(--mat-sys-outline-variant);
  --cifar-cube-focus: var(--mat-sys-primary);
}
```

Do not style private Shadow DOM class names from the Angular application. They are implementation details and intentionally encapsulated.

The current handoff intentionally has no quantitative color scale. Cube fill communicates interaction and availability states only; consuming applications should not imply a data value from its intensity.

### Typography

The component consumes Angular Material system typography properties when the host defines them and uses matching Material 3 fallbacks otherwise. The desktop introduction uses `display-small`; the compact introduction uses `headline-medium`. The intro, eyebrows, and axis titles are the only intentional 600-weight treatments. Other label roles defer to their M3 weight tokens, while dataset-card headings and stat terms retain their approved 500-weight treatment. The desktop intro and selected-card column does not create an independent scroll region.

The host application owns font loading. The Roboto files used by this repository belong to the preview page and are not runtime dependencies of the web component.

### Intro copy

The prototype introduction is managed in `src/cifar-cube-copy.ts`. `heading` and `description` are required; `eyebrow` is optional and disappears without leaving an empty element when omitted. This is an internal handoff configuration, not a public custom-element property. The receiving team can keep it internal or expose host-provided copy if reuse requires that flexibility.

## Accessibility behavior

- Desktop cubes are native buttons with unique accessible names, descriptions, selected state, and a relationship to the persistent details region.
- Keyboard activation moves focus directly to the selected dataset's metadata action. Pointer activation keeps focus on the cube.
- Compact layouts remove the selection step and expose a direct metadata link on every card.
- The introduction remains visible after desktop selection. The details region remains mounted, inserts a semantically headed dataset card beneath it, and announces selection changes politely.
- Current, unavailable, hover, focus, and selected states do not rely on color alone.
- Reduced-motion and Windows forced-colors preferences are supported.
- Axis text has an equivalent screen-reader summary; decorative SVG geometry is hidden from assistive technology.

These measures improve accessibility but are not a claim of formal WCAG conformance. The receiving team should test the component with its supported browser and assistive-technology matrix after Angular integration.

## Repository preview and validation

From the repository root, using the already-present dependencies:

```bash
npm run dev
```

Open `/cifar-cube/index.html` for the component preview.

Run the non-installing validation commands:

```bash
npm run typecheck
npm test
npm run build:embed
npm run test:embed
npm run test:browser:build
npm run test:package
```

For manual browser checks, run `npm run test:browser` and open the local URL it prints. A passing harness changes the document title to `PASS — CIFAR cube browser tests`. Check keyboard use, zoom, light/dark themes, forced colors, and widths on both sides of `64rem` and `40rem`.

## Rebuilding or replacing the toolchain

The checked-in `dist/cifar-cube.js` is the consumable module. It contains the component styles and does not import Vite, React, Angular, or any other package at runtime.

This prototype repository currently uses its existing Vite configuration to bundle the TypeScript and inline CSS. That choice is not part of the component contract. If the receiving team rebuilds from `src/`, its chosen compiler must bundle `cifar-cube.css` as the string imported by `cifar-cube.ts`, or replace that internal style-loading step with an equivalent supported by its Angular build system. Public properties, events, DOM behavior, and CSS custom properties should remain unchanged.

Before accepting the handoff, the developer team should decide:

1. Whether to consume the prebuilt local package or migrate the source into its Angular workspace.
2. Where dataset configuration and metadata URLs will be owned.
3. Which automated browser runner will execute the included behavioral scenarios.
4. Which supported-browser and assistive-technology matrix is required for release.

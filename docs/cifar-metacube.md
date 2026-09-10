# CIFAR Metacube embed

`<cifar-metacube>` is a lightweight, framework-independent visualization for linking datasets to their metadata pages. It uses native links and inline decorative SVG cubes; it does not include the 3D renderer, camera controls, file upload, or visualization control panel.

## User experience

- Selecting a cube navigates immediately to its `href`.
- On wide screens, the dataset name and metadata appear on pointer hover or keyboard focus.
- Axis titles and values are selectable HTML text, with a concise equivalent summary for screen readers.
- Keyboard users follow the same link order as the document and receive a high-contrast focus indicator.
- Wide screens use a flat isometric arrangement. Below 768 px, the links reflow into a card grid instead of shrinking the interaction targets.
- `current` items remain links and expose `aria-current="page"`. `unavailable` items are displayed without a link.

## Angular integration

Import and register the custom element once in the browser entry point:

```ts
import { defineCifarMetacube } from "../src/embeds/cifar-metacube";

defineCifarMetacube();
```

Add `CUSTOM_ELEMENTS_SCHEMA` to the Angular module or standalone component that owns the template:

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <cifar-metacube
      label="Organ imaging datasets"
      [axes]="axes"
      [items]="datasets"
    ></cifar-metacube>
  `,
})
export class OrganDatasetsComponent {
  axes = {
    x: { label: "Scale", values: ["100-microns", "10-centimeters"] },
    y: { label: "Age (years)", values: ["45", "63", "85", "~40–70", "4–5 months", "7–47"] },
    z: { label: "Organ", values: ["Thymus", "Heart", "Kidney", "Liver"] },
  };

  datasets = [
    {
      id: "bader-liver-sem-sbf",
      label: "Bader liver SEM/SBF",
      href: "/metadata/bader-liver-sem-sbf",
      metadata: { Organ: "Liver", Scale: "100-microns", Age: "45" },
      position: { x: 0, y: 0, z: 3 },
    },
    {
      id: "lee-heart-hipct",
      label: "Lee heart HiP-CT",
      href: "/metadata/lee-heart-hipct",
      metadata: { Organ: "Heart", Scale: "10-centimeters", Age: "63" },
      position: { x: 1, y: 1, z: 1 },
    },
  ];
}
```

Angular property binding is preferred. For a static non-Angular page, `items` also accepts a JSON-encoded attribute.

## Theme contract

The component has no theme switch and does not inspect `prefers-color-scheme`. Its shadow root inherits CSS custom properties from the Angular Material host page. It uses the following Material system tokens when available:

- `--mat-sys-surface`
- `--mat-sys-surface-container`
- `--mat-sys-on-surface`
- `--mat-sys-on-surface-variant`
- `--mat-sys-primary`
- `--mat-sys-primary-container`
- `--mat-sys-on-primary-container`
- `--mat-sys-outline`

Each role can be overridden for this component without changing the page theme:

```css
cifar-metacube {
  --cifar-metacube-primary: var(--mat-sys-primary);
  --cifar-metacube-primary-container: var(--mat-sys-primary-container);
  --cifar-metacube-on-primary-container: var(--mat-sys-on-primary-container);
  --cifar-metacube-surface: var(--mat-sys-surface);
  --cifar-metacube-surface-container: var(--mat-sys-surface-container);
  --cifar-metacube-on-surface: var(--mat-sys-on-surface);
  --cifar-metacube-on-surface-variant: var(--mat-sys-on-surface-variant);
  --cifar-metacube-outline: var(--mat-sys-outline);
  --cifar-metacube-focus: var(--mat-sys-primary);
}
```

The built-in fallback colors use the CIFAR light scheme only as a safeguard for pages that omit a token. The Angular Material tokens remain the source of truth for both light and dark modes.

## Data contract

```ts
interface CifarMetacubeItem {
  id: string;
  label: string;
  href: string;
  metadata?: Record<string, string | number | null | undefined>;
  position?: { x: number; y: number; z: number };
  status?: "available" | "current" | "unavailable";
}
```

`position` contains zero-based categorical indexes: x is Scale, y is Age, and z is Organ. Categories are projected from the center of their cells rather than the frame vertices, keeping every interactive cube inside the canvas. Array order determines keyboard, screen-reader, and mobile grid order, so provide items in a meaningful sequence.

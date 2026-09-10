# CIFAR Metacube embed

`<cifar-metacube>` is a lightweight, framework-independent visualization for linking datasets to their metadata pages. It uses native links and inline decorative SVG cubes; it does not include the 3D renderer, camera controls, file upload, or visualization control panel.

## User experience

- Selecting a cube navigates immediately to its `href`.
- The dataset name and metadata remain visible without hover.
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
      [items]="datasets"
    ></cifar-metacube>
  `,
})
export class OrganDatasetsComponent {
  datasets = [
    {
      id: "bader-liver-sem-sbf",
      label: "Bader liver SEM/SBF",
      href: "/metadata/bader-liver-sem-sbf",
      metadata: { Organ: "Liver", Scale: "100-microns", Age: "45" },
      position: { x: 0, y: 2, z: 1 },
    },
    {
      id: "lee-heart-hipct",
      label: "Lee heart HiP-CT",
      href: "/metadata/lee-heart-hipct",
      metadata: { Organ: "Heart", Scale: "10-centimeters", Age: "63" },
      position: { x: 2, y: 1, z: 0 },
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
  position?: { x: number; y: number; z?: number };
  status?: "available" | "current" | "unavailable";
}
```

`position` affects only the wide-screen isometric arrangement. Array order determines keyboard, screen-reader, and mobile grid order, so provide items in a meaningful sequence.

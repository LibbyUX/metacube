# CIFAR cube component prototype

This temporary repository contains the design prototype and developer handoff for `<cifar-cube>`, an accessible, responsive web component for exploring organ-imaging datasets and opening their metadata.

The component package is the sole handoff target. The inherited React, Python, R, and playground code remains available as reference material but is not intended for continued product development here.

## Component handoff

Start with [`packages/cifar-cube/README.md`](packages/cifar-cube/README.md). It documents:

- Angular integration
- properties, events, and validated data contracts
- responsive behavior and theming
- accessibility behavior and testing
- the prebuilt ESM delivery format

The package contains its canonical TypeScript and CSS source, a prebuilt JavaScript module, source maps, and TypeScript declarations. Consuming applications do not need Vite or any runtime dependency.

## Local preview

The repository toolchain requires Node.js 22. For a new checkout, restore the locked development dependencies once:

```bash
npm ci
```

Start the preview site:

```bash
npm run dev
```

Open `http://localhost:5173/metacube/cifar-cube/index.html`. The port may change when another local server is already running.

## Validation

```bash
npm run typecheck
npm test
npm run build
npm run build:embed
npm run test:embed
npm run test:browser:build
npm run test:package
```

## Repository map

| Path | Purpose |
| --- | --- |
| [`packages/cifar-cube`](packages/cifar-cube) | Canonical component source, distribution, license, and handoff guide |
| [`cifar-cube`](cifar-cube) | Preview page and example dataset configuration |
| [`tests`](tests) | Component data, projection, style, package, and browser-harness checks |
| [`playground`](playground) and [`src`](src) | Inherited metacube demo and supporting application |
| [`docs`](docs) | Documentation index and legacy configuration reference |

## Licensing

The inherited repository remains available under its original MIT license in [`LICENSE`](LICENSE). The independently implemented `cifar-cube` package is copyright Cyberinfrastructure for Network Science Center and is distributed under its own [MIT license](packages/cifar-cube/LICENSE).

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../packages/cifar-cube/src/cifar-cube.css", import.meta.url), "utf8");
const dataStyles = await readFile(new URL("../packages/cifar-cube/src/cifar-cube-data.css", import.meta.url), "utf8");
const previewStyles = await readFile(new URL("../cifar-cube/styles.css", import.meta.url), "utf8");
const navigationStyles = await readFile(new URL("../src/components/global-navigation.css", import.meta.url), "utf8");
const previewMarkup = await readFile(new URL("../cifar-cube/index.html", import.meta.url), "utf8");

test("component styles preserve non-color states and forced-colors support", () => {
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /cifar-cube__item--unavailable[\s\S]*stroke-dasharray/);
  assert.doesNotMatch(styles, /\.cifar-cube__item--unavailable\s*\{\s*opacity:/);
  assert.match(styles, /--mat-sys-body-small-size, 0\.75rem/);
  assert.match(styles, /cifar-cube__top,[\s\S]*?stroke-linejoin: bevel;/);
  assert.match(styles, /cifar-cube__item--unavailable \.cifar-cube__cube \{ opacity: 1; filter: none; \}/);
});

test("public typography follows Material 3 roles with limited semibold overrides", () => {
  [styles, dataStyles, previewStyles, navigationStyles].forEach((stylesheet) => {
    assert.doesNotMatch(stylesheet, /font-weight:\s*700/);
  });
  assert.match(styles, /cifar-cube__intro-heading[\s\S]*?--mat-sys-headline-large-size, 2rem[\s\S]*?--mat-sys-headline-large-weight, 600[\s\S]*?white-space: nowrap/);
  assert.match(styles, /cifar-cube__intro-heading[\s\S]*?--mat-sys-headline-medium-size, 1\.75rem[\s\S]*?--mat-sys-headline-medium-weight, 600[\s\S]*?white-space: normal/);
  assert.match(styles, /cifar-cube__axis-title[\s\S]*?font-weight: 600/);
  assert.match(styles, /cifar-cube__intro-eyebrow,[\s\S]*?cifar-cube__details-eyebrow[\s\S]*?font-weight: 600/);
  assert.match(styles, /cifar-cube__details-heading[\s\S]*?--mat-sys-title-large-size, 1\.375rem[\s\S]*?font-weight: 500/);
  assert.match(dataStyles, /cifar-cube__details-metadata \{[\s\S]*?--mat-sys-body-medium-size, 0\.875rem/);
  assert.match(styles, /cifar-cube__intro-visualization \{[\s\S]*?--mat-sys-body-medium-size, 0\.875rem/);
  assert.match(styles, /cifar-cube__intro-compact,[\s\S]*?--mat-sys-body-large-size, 1rem/);
  assert.match(dataStyles, /cifar-cube__details-metadata dt \{ color: var\(--_on-surface\); font-weight: 500; \}/);
  assert.match(dataStyles, /cifar-cube__details-metadata dd \{ color: var\(--_on-surface-variant\); \}/);
  assert.match(dataStyles, /cifar-cube__intro-dimensions dt \{ color: var\(--_on-surface\); font-weight: 500; white-space: nowrap; \}/);
  assert.match(previewStyles, /\.metadata-preview h2[\s\S]*?--mat-sys-headline-medium-weight, 400/);
  assert.match(navigationStyles, /\.global-navigation__link[\s\S]*?--mat-sys-label-large-weight, 500/);
  assert.match(previewStyles, /roboto-latin-600-normal\.woff2/);
  assert.match(previewStyles, /roboto-latin-ext-600-normal\.woff/);
});

test("preview opens directly on the component", () => {
  assert.doesNotMatch(previewMarkup, /class="preview-header"/);
  assert.match(previewMarkup, /<h1 class="visually-hidden">Preview component<\/h1>/);
  assert.match(previewStyles, /\.visually-hidden \{[\s\S]*?clip: rect\(0, 0, 0, 0\);/);
});

test("small-screen navigation reflows without page-level horizontal scrolling", () => {
  assert.doesNotMatch(navigationStyles, /overflow-x: auto/);
  assert.match(navigationStyles, /grid-template-areas:[\s\S]*?"brand theme"[\s\S]*?"navigation navigation"/);
  assert.match(navigationStyles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(navigationStyles, /\.global-navigation__link \{[\s\S]*?white-space: normal;/);
  assert.match(navigationStyles, /@media \(max-width: 30rem\)/);
});

test("the visualization preview cannot expand the page scroll width", () => {
  assert.match(previewStyles, /\.cifar-cube-preview \{[\s\S]*?overflow-x: clip;/);
});

test("selection preserves scene depth while active preview cards remain visible", () => {
  assert.doesNotMatch(styles, /\.cifar-cube__item--selected \{[^}]*z-index:/);
  assert.match(styles, /\.cifar-cube__item:not\(\.cifar-cube__item--selected\):hover,[\s\S]*?z-index: 20000;/);
  assert.match(styles, /\.cifar-cube__item--selected \.cifar-cube__select \.cifar-cube__card \{ opacity: 0; \}/);
});

test("desktop content precedes the visualization and selected details use a card", () => {
  assert.match(styles, /grid-template-columns: minmax\(22rem, 28rem\) minmax\(0, 1fr\)/);
  assert.match(styles, /grid-template-rows: minmax\(0, 1fr\)/);
  assert.match(styles, /grid-template-areas: "content stage"/);
  assert.match(styles, /\.cifar-cube__content \{[\s\S]*?align-self: stretch;[\s\S]*?flex-direction: column;[\s\S]*?height: 100%;[\s\S]*?min-height: 0;[\s\S]*?padding: 0 0 1rem;/);
  assert.doesNotMatch(styles, /\.cifar-cube__content \{[^}]*overflow: auto/);
  assert.match(previewStyles, /:root \{[\s\S]*?--mat-sys-surface-container: #eceff1;/);
  assert.match(previewStyles, /:root\[data-theme="dark"\] \{[\s\S]*?--mat-sys-surface-container: #222a30;/);
  assert.match(styles, /\.cifar-cube__details-card,[\s\S]*?\.cifar-cube__compact-card \{[\s\S]*?border: 1px solid[\s\S]*?background: var\(--_surface-container\)[\s\S]*?box-shadow:/);
});

test("responsive introductions separate visualization guidance from dataset guidance", () => {
  assert.match(styles, /\.cifar-cube__intro-compact \{ display: none; \}/);
  assert.match(styles, /@container cifar-cube-host \(max-width: 64rem\)[\s\S]*?\.cifar-cube__intro-visualization \{ display: none; \}/);
  assert.match(styles, /@container cifar-cube-host \(max-width: 64rem\)[\s\S]*?\.cifar-cube__intro-compact \{ display: block;/);
});

test("desktop guidance uses a compact dimension key and tighter details spacing", () => {
  assert.match(styles, /\.cifar-cube__content \{[\s\S]*?gap: clamp\(1\.5rem, 3vh, 2\.5rem\);/);
  assert.match(styles, /\.cifar-cube__intro \{[\s\S]*?flex-direction: column;[\s\S]*?height: 100%;/);
  assert.match(styles, /\.cifar-cube__intro-visualization \{[\s\S]*?display: flex;[\s\S]*?flex: 1;/);
  assert.match(dataStyles, /\.cifar-cube__intro-attribution \{[\s\S]*?margin-top: auto;[\s\S]*?padding-top: 1rem;/);
  assert.match(dataStyles, /\.cifar-cube__intro-dimensions \{[\s\S]*?margin: 0;/);
  assert.match(dataStyles, /\.cifar-cube__intro-dimensions-header,[\s\S]*?\.cifar-cube__intro-dimensions-row \{[\s\S]*?grid-template-columns: minmax\(7rem, 32%\) minmax\(0, 1fr\);/);
  assert.match(dataStyles, /\.cifar-cube__intro-dimensions-header \{[\s\S]*?margin-top: 1\.5rem;[\s\S]*?font-weight: 600;/);
  assert.match(dataStyles, /\.cifar-cube__intro-dimensions-row \{[\s\S]*?grid-template-columns: minmax\(7rem, 32%\) minmax\(0, 1fr\);[\s\S]*?padding: 0\.5rem 0;/);
  assert.match(dataStyles, /\.cifar-cube--has-selection \.cifar-cube__intro-dimensions-header,[\s\S]*?\.cifar-cube--has-selection \.cifar-cube__intro-dimensions \{ display: none; \}/);
  assert.match(dataStyles, /\.cifar-cube__details \{ margin: 1\.5rem 0 0; \}/);
  assert.match(dataStyles, /\.cifar-cube__details-header \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto;/);
  assert.match(dataStyles, /\.cifar-cube__details-close \{[\s\S]*?width: 2\.75rem;[\s\S]*?height: 2\.75rem;[\s\S]*?border: 0;[\s\S]*?border-radius: 50%;[\s\S]*?color: var\(--_on-surface\);/);
  assert.match(dataStyles, /\.cifar-cube__details-close:hover \{ background: color-mix\(in srgb, var\(--_on-surface\) 8%, transparent\); \}/);
  assert.match(dataStyles, /\.cifar-cube__details-close:focus-visible \{[\s\S]*?var\(--_on-surface\) 10%, transparent/);
  assert.match(dataStyles, /\.cifar-cube__details-close:active \{ background: color-mix\(in srgb, var\(--_on-surface\) 10%, transparent\); \}/);
  assert.match(dataStyles, /\.cifar-cube__details-close-icon \{[\s\S]*?fill: currentColor;/);
});

test("dimension key and dataset details use scannable separation", () => {
  assert.match(dataStyles, /\.cifar-cube__intro-dimensions-row \{[\s\S]*?border-bottom: 1px solid var\(--_outline-variant\);/);
  assert.match(dataStyles, /\.cifar-cube__intro-dimensions-row:last-child \{ border-bottom: 0; \}/);
  assert.match(dataStyles, /\.cifar-cube__intro-dimensions dd \{ color: var\(--_on-surface-variant\); \}/);
  assert.match(dataStyles, /\.cifar-cube__details-metadata-row \{[\s\S]*?grid-template-columns: minmax\(5\.5rem, 38%\) minmax\(0, 1fr\);[\s\S]*?border-bottom: 1px solid var\(--_outline-variant\);/);
  assert.match(dataStyles, /\.cifar-cube__details-metadata-row:last-child \{ border-bottom: 0; \}/);
  assert.match(dataStyles, /@media \(forced-colors: active\)[\s\S]*?border-color: CanvasText;/);
});

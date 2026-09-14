import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../packages/cifar-cube/src/cifar-cube.css", import.meta.url), "utf8");
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
  [styles, previewStyles, navigationStyles].forEach((stylesheet) => {
    assert.doesNotMatch(stylesheet, /font-weight:\s*700/);
  });
  assert.match(styles, /cifar-cube__intro-heading[\s\S]*?--mat-sys-display-small-size, 2\.25rem[\s\S]*?font-weight: 600/);
  assert.match(styles, /cifar-cube__axis-title[\s\S]*?font-weight: 600/);
  assert.match(styles, /cifar-cube__intro-eyebrow,[\s\S]*?cifar-cube__details-eyebrow[\s\S]*?font-weight: 600/);
  assert.match(styles, /cifar-cube__details-heading[\s\S]*?--mat-sys-title-large-size, 1\.375rem[\s\S]*?font-weight: 500/);
  assert.match(styles, /cifar-cube__details-metadata \{[\s\S]*?--mat-sys-body-large-size, 1rem/);
  assert.match(styles, /cifar-cube__details-metadata dt \{[\s\S]*?color: var\(--_on-surface\);[\s\S]*?font-weight: 500/);
  assert.match(styles, /cifar-cube__details-metadata dd \{[\s\S]*?color: var\(--_on-surface-variant\)/);
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
  assert.match(styles, /grid-template-columns: minmax\(18rem, 26rem\) minmax\(0, 1fr\)/);
  assert.match(styles, /grid-template-rows: minmax\(0, 1fr\)/);
  assert.match(styles, /grid-template-areas: "content stage"/);
  assert.match(styles, /\.cifar-cube__content \{[\s\S]*?align-self: start;[\s\S]*?flex-direction: column;[\s\S]*?min-height: 0;/);
  assert.doesNotMatch(styles, /\.cifar-cube__content \{[^}]*overflow: auto/);
  assert.match(styles, /\.cifar-cube__details-card,[\s\S]*?\.cifar-cube__compact-card \{[\s\S]*?border: 1px solid[\s\S]*?background: var\(--_surface-container\)[\s\S]*?box-shadow:/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../packages/cifar-cube/src/cifar-cube.css", import.meta.url), "utf8");

test("component styles preserve non-color states and forced-colors support", () => {
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /cifar-cube__item--unavailable[\s\S]*stroke-dasharray/);
  assert.doesNotMatch(styles, /\.cifar-cube__item--unavailable\s*\{\s*opacity:/);
  assert.match(styles, /font-size: clamp\(0\.75rem, 1vw, 0\.85rem\)/);
  assert.match(styles, /cifar-cube__item--unavailable \.cifar-cube__cube \{ opacity: 1; filter: none; \}/);
});

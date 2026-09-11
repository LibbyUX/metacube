import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCubeCells,
  computeDominance,
  DEFAULT_CONCENTRATION_THRESHOLDS,
} from "../src/data/dataModel.ts";

test("buildCubeCells combines matching coordinates and removes duplicate datasets", () => {
  const cells = buildCubeCells([
    { x: "a", y: "b", z: "c", size: 2, color: 4, datasets: ["one", "shared"] },
    { x: "a", y: "b", z: "c", size: 3, color: 8, datasets: ["shared", "two"] },
  ]);

  assert.deepEqual(cells, [{
    x: "a",
    y: "b",
    z: "c",
    size: 5,
    color: 12,
    datasets: ["one", "shared", "two"],
  }]);
});

test("buildCubeCells averages only records that provide a color value", () => {
  const cells = buildCubeCells([
    { x: "a", y: "b", z: "c", size: 1, color: 2, datasets: [] },
    { x: "a", y: "b", z: "c", size: 1, datasets: [] },
    { x: "a", y: "b", z: "c", size: 1, color: 8, datasets: [] },
  ], "mean");

  assert.equal(cells[0].color, 5);
});

test("computeDominance preserves empty and non-positive input as no result", () => {
  assert.equal(computeDominance(undefined), null);
  assert.equal(computeDominance([]), null);
  assert.equal(computeDominance([{ d: "source", c: "category", n: 0 }]), null);
  assert.equal(computeDominance([{ d: "source", c: "category", n: -1 }]), null);
});

test("computeDominance groups categories by source before measuring concentration", () => {
  const result = computeDominance([
    { d: "one", c: "first", n: 1 },
    { d: "one", c: "second", n: 1 },
    { d: "two", c: "first", n: 2 },
  ]);

  assert.ok(result);
  assert.equal(result.nSources, 2);
  assert.equal(result.D, 0.5);
  assert.equal(result.nEff, 2);
  assert.equal(result.label, "skewed");
  assert.deepEqual(DEFAULT_CONCENTRATION_THRESHOLDS, [2, 5]);
});

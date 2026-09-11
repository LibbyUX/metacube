import assert from "node:assert/strict";
import test from "node:test";

import {
  getCategoryCenter,
  getNormalizedPosition,
  getProjectedCubeGeometry,
  getScenePosition,
  projectPoint,
} from "../src/embeds/cifar-cube/projection.ts";

const axes = {
  x: { label: "X", values: ["one", "two"] },
  y: { label: "Y", values: ["one", "two", "three", "four"] },
  z: { label: "Z", values: ["one", "two"] },
};

test("getCategoryCenter centers indexes within equal categorical cells", () => {
  assert.equal(getCategoryCenter(0, 2), 0.25);
  assert.equal(getCategoryCenter(1, 2), 0.75);
});

test("getNormalizedPosition maps validated indexes without fallback coordinates", () => {
  assert.deepEqual(getNormalizedPosition({ x: 0, y: 1, z: 1 }, axes), {
    x: 0.75,
    y: 0.375,
    z: 0.75,
  });
});

test("projectPoint returns finite perspective coordinates", () => {
  const point = projectPoint(0.5, 0.5, 0.5);

  assert.equal(Number.isFinite(point.x), true);
  assert.equal(Number.isFinite(point.y), true);
  assert.ok(point.x > 0 && point.x < 100);
  assert.ok(point.y > 0 && point.y < 100);
});

test("getProjectedCubeGeometry returns positive bounds around every corner", () => {
  const geometry = getProjectedCubeGeometry({ x: 1, y: 3, z: 0 }, axes);
  const corners = Object.values(geometry.corners);

  assert.ok(geometry.bounds.width > 0);
  assert.ok(geometry.bounds.height > 0);
  assert.ok(corners.every((point) => point.x >= geometry.bounds.left));
  assert.ok(corners.every((point) => point.x <= geometry.bounds.left + geometry.bounds.width));
  assert.ok(corners.every((point) => point.y >= geometry.bounds.top));
  assert.ok(corners.every((point) => point.y <= geometry.bounds.top + geometry.bounds.height));
});

test("getScenePosition provides CSS placement and deterministic layering", () => {
  const scenePosition = getScenePosition({ x: 0, y: 0, z: 0 }, axes);

  assert.match(scenePosition.left, /%$/);
  assert.match(scenePosition.top, /%$/);
  assert.match(scenePosition.layer, /^\d+$/);
  assert.ok(scenePosition.cardSide === "left" || scenePosition.cardSide === "right");
});

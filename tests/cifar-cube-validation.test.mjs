import assert from "node:assert/strict";
import test from "node:test";

import { isSafeMetadataHref, validateAxes, validateItems } from "../src/embeds/cifar-cube/validation.ts";

const validAxes = {
  x: { label: "Spatial scale", values: ["small", "large"] },
  y: { label: "Age", values: ["young", "old"] },
  z: { label: "Organ", values: ["heart", "liver"] },
};

test("validateAxes preserves valid categorical indexes", () => {
  const result = validateAxes(validAxes);

  assert.deepEqual(result.value, validAxes);
  assert.deepEqual(result.issues, []);
});

test("validateAxes rejects duplicate values without shifting positions", () => {
  const result = validateAxes({
    ...validAxes,
    x: { label: "Spatial scale", values: ["small", "small"] },
  });

  assert.deepEqual(result.value.x.values, []);
  assert.equal(result.issues[0].code, "axis.values.duplicate");
});

test("validateItems preserves incomplete datasets without inventing positions", () => {
  const result = validateItems([{
    id: "dataset-one",
    label: "Dataset one",
    href: "#dataset-one",
    metadata: { Organ: "Liver", Missing: null },
  }], validAxes);

  assert.equal(result.value.length, 1);
  assert.equal(result.value[0].position, undefined);
  assert.equal(result.value[0].metadata?.Missing, null);
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.position.missing"));
});

test("validateItems excludes unusable identities and duplicate IDs", () => {
  const result = validateItems([
    { id: "", label: "Missing identity" },
    { id: "shared", label: "First", position: { x: 0, y: 0, z: 0 } },
    { id: "shared", label: "Second", position: { x: 1, y: 1, z: 1 } },
  ], validAxes);

  assert.deepEqual(result.value.map((item) => item.label), ["First"]);
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.id.invalid"));
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.id.duplicate"));
});

test("validateItems preserves identifiable datasets with fallback labels and statuses", () => {
  const result = validateItems([{
    id: "fallback",
    label: "",
    href: "#fallback",
    status: "unexpected",
    position: { x: 0, y: 0, z: 0 },
  }], validAxes);

  assert.equal(result.value[0].label, "fallback");
  assert.equal(result.value[0].status, "available");
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.label.invalid"));
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.status.invalid"));
});

test("validateItems keeps duplicate and out-of-range positions available but unplotted", () => {
  const result = validateItems([
    { id: "first", label: "First", position: { x: 0, y: 0, z: 0 } },
    { id: "duplicate", label: "Duplicate", position: { x: 0, y: 0, z: 0 } },
    { id: "outside", label: "Outside", position: { x: 4, y: 0, z: 0 } },
  ], validAxes);

  assert.deepEqual(result.value.map((item) => item.position), [{ x: 0, y: 0, z: 0 }, undefined, undefined]);
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.position.duplicate"));
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.position.out-of-range"));
});

test("validateItems removes unsafe destinations and unsupported metadata values", () => {
  const result = validateItems([{
    id: "unsafe",
    label: "Unsafe",
    href: "javascript:alert(1)",
    metadata: { Valid: 4, Invalid: { nested: true }, "": "unnamed" },
    position: { x: 0, y: 0, z: 0 },
  }], validAxes);

  assert.equal(result.value[0].href, undefined);
  assert.equal(result.value[0].status, "unavailable");
  assert.deepEqual(result.value[0].metadata, { Valid: 4 });
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.href.unsafe"));
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.metadata.key.invalid"));
  assert.ok(result.issues.some((validationIssue) => validationIssue.code === "item.metadata.value.invalid"));
});

test("isSafeMetadataHref allows web destinations and rejects executable schemes", () => {
  assert.equal(isSafeMetadataHref("#local-metadata"), true);
  assert.equal(isSafeMetadataHref("../metadata/dataset"), true);
  assert.equal(isSafeMetadataHref("https://example.org/metadata"), true);
  assert.equal(isSafeMetadataHref("javascript:alert(1)"), false);
  assert.equal(isSafeMetadataHref("data:text/html,test"), false);
});

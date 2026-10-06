import assert from "node:assert/strict";

const mhuCubeModule = await import("../packages/mhu-cube/dist/mhu-cube.js");

assert.equal(typeof mhuCubeModule.MhuCube, "function");
assert.equal(typeof mhuCubeModule.defineMhuCube, "function");
assert.equal(typeof mhuCubeModule.validateAxes, "function");
assert.equal(typeof mhuCubeModule.validateItems, "function");
assert.equal(typeof mhuCubeModule.validateView, "function");
assert.equal(typeof mhuCubeModule.validateGuides, "function");
assert.equal(typeof mhuCubeModule.validateCompactMetadata, "function");
assert.equal(typeof mhuCubeModule.validateHoverMetadata, "function");
assert.equal(mhuCubeModule.MHU_CUBE_SELECTION_EVENT, "mhu-cube-selection-change");
assert.equal(mhuCubeModule.MHU_CUBE_VALIDATION_EVENT, "mhu-cube-validation");
assert.doesNotThrow(() => mhuCubeModule.defineMhuCube());

import assert from "node:assert/strict";

const cifarCubeModule = await import("../dist-embed/cifar-cube.js");

assert.equal(typeof cifarCubeModule.CifarCube, "function");
assert.equal(typeof cifarCubeModule.defineCifarCube, "function");
assert.equal(typeof cifarCubeModule.validateAxes, "function");
assert.equal(typeof cifarCubeModule.validateItems, "function");
assert.equal(cifarCubeModule.CIFAR_CUBE_SELECTION_EVENT, "cifar-cube-selection-change");
assert.equal(cifarCubeModule.CIFAR_CUBE_VALIDATION_EVENT, "cifar-cube-validation");
assert.doesNotThrow(() => cifarCubeModule.defineCifarCube());

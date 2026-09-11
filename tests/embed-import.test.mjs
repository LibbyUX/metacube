import assert from "node:assert/strict";

const cifarCubeModule = await import("../dist-embed/cifar-cube.js");

assert.equal(typeof cifarCubeModule.CifarCube, "function");
assert.equal(typeof cifarCubeModule.defineCifarCube, "function");
assert.equal(cifarCubeModule.CIFAR_CUBE_SELECTION_EVENT, "cifar-cube-selection-change");
assert.doesNotThrow(() => cifarCubeModule.defineCifarCube());

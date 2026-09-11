import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "packages/cifar-cube/src/index.ts"),
      formats: ["es"],
      fileName: "cifar-cube",
    },
    outDir: "packages/cifar-cube/dist",
    sourcemap: true,
  },
});

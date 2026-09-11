import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "src/embeds/cifar-cube/index.ts"),
      formats: ["es"],
      fileName: "cifar-cube",
    },
    outDir: "dist-embed",
    sourcemap: true,
  },
});

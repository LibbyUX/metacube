import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "src/embeds/cifar-metacube/index.ts"),
      formats: ["es"],
      fileName: "cifar-metacube",
    },
    outDir: "dist-embed",
    sourcemap: true,
  },
});

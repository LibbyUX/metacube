import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "path";

const singleFile = !!process.env.SF_BUILD;

export default defineConfig({
  base: singleFile ? "./" : "/metacube/",
  plugins: singleFile ? [react(), viteSingleFile()] : [react()],
  publicDir: singleFile ? false : "public",
  build: singleFile
    ? { emptyOutDir: false }
    : {
        rollupOptions: {
          input: {
            main:       resolve(__dirname, "index.html"),
            playground: resolve(__dirname, "playground/index.html"),
            cifarMetacube: resolve(__dirname, "cifar-metacube/index.html"),
          },
        },
      },
});

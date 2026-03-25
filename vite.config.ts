import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/cube/",
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        abstract: resolve(__dirname, "abstract.html"),
      },
    },
  },
});

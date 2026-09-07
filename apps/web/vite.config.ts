import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  base: "/pairgrid/",
  plugins: [react()],
  resolve: {
    alias: {
      "@pairgrid/engine": fileURLToPath(
        new URL("../../packages/engine/src/index.ts", import.meta.url),
      ),
    },
  },
});

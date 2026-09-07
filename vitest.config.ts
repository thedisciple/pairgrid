import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: {
    alias: {
      "@pairgrid/engine": fileURLToPath(new URL("./packages/engine/src/index.ts", import.meta.url)),
    },
  },
  test: { include: ["packages/engine/test/**/*.test.ts", "apps/web/src/test/**/*.test.{ts,tsx}"] },
});

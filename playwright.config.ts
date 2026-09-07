import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./apps/web/e2e",
  fullyParallel: true,
  use: {
    baseURL: process.env.PAIRGRID_TEST_URL ?? "http://127.0.0.1:4173/pairgrid/",
    browserName: "chromium",
  },
  ...(process.env.PAIRGRID_TEST_URL
    ? {}
    : {
        webServer: {
          command: "pnpm preview",
          url: "http://127.0.0.1:4173/pairgrid/",
          reuseExistingServer: !process.env.CI,
        },
      }),
});

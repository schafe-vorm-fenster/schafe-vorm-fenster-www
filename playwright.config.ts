import { defineConfig, devices } from "@playwright/test";

/**
 * E2E — the level that genuinely crosses the browser boundary
 * (verification-strategy). Routes, headers and status codes are integration
 * tests in Vitest, not here.
 *
 * Port 3100 is the run's convention: 3000 is occupied on the build machine
 * (state/open.md #15). `E2E_BASE_URL` points the same suite at a preview
 * deployment; `VERCEL_AUTOMATION_BYPASS_SECRET` gets it past Vercel
 * Deployment Protection (TS-015 D3 layer 1, D10) without ever disabling it.
 */
const PORT = Number(process.env.PORT ?? 3100);
const localBaseUrl = `http://localhost:${PORT}`;
const baseURL = process.env.E2E_BASE_URL ?? localBaseUrl;
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    extraHTTPHeaders: bypassSecret
      ? { "x-vercel-protection-bypass": bypassSecret }
      : {},
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // Only start a local server when the suite runs against localhost. CI runs
  // against the production build (`pnpm build` already ran as its own gate),
  // so it starts that build instead of paying for a dev-server boot.
  ...(baseURL === localBaseUrl
    ? {
        webServer: {
          command: process.env.CI
            ? `PORT=${PORT} pnpm start`
            : `PORT=${PORT} pnpm next dev`,
          url: localBaseUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }
    : {}),
});

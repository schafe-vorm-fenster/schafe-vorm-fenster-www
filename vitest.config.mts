import { defineConfig } from "vitest/config";

/**
 * Vitest carries two of the five verification levels (verification-strategy):
 *   unit         — pure functions, `*.test.ts`, co-located under src/
 *   integration  — Next.js routes and handlers in-process, `*.integration.test.ts`
 * `e2e/` belongs to Playwright and is excluded here.
 *
 * Path aliases resolve through Vite's native `tsconfigPaths` rather than the
 * `vite-tsconfig-paths` plugin the sibling repositories still carry — Vite
 * now does it itself and warns that the plugin is redundant (ADR-072).
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "app/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "e2e/**", "legacy-content/**"],
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "lcov"],
      reportsDirectory: "reports/coverage",
      include: ["src/lib/**"],
    },
  },
});

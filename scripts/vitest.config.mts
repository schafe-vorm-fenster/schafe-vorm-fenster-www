import { defineConfig } from "vitest/config";

/**
 * A second, narrow Vitest config for the `scripts/*.test.ts` suites.
 *
 * The root `vitest.config.ts` scopes `include` to `src/**` and `app/**`
 * (unit + integration, per verification-strategy) and is not this fix
 * round's file to touch. `scripts/check-brand.ts` and
 * `scripts/check-api-routes.ts` are static checks, not application code,
 * and their tests exercise pure functions against temporary fixtures
 * (never files committed under `scripts/`) — a small sibling config keeps
 * them running under `pnpm check` without widening the root config's
 * scope.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["scripts/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
  },
});

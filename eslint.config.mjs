import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The archive. Working rules 2 and 5 in AGENTS.md: `legacy-content/` and
    // `content/` are material to look something up in, not code this run owns.
    "legacy-content/**",
    "content/**",
    "concept/**",
    // Generated assets and reports.
    "src/generated/**",
    "reports/**",
    // Agent worktrees checked out inside the repository. ESLint 9 no longer
    // skips dot-directories, so `eslint .` would lint every worktree too.
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;

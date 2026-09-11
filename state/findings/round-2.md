# Findings — Round 2 (M4 CI)

## F-2-1 — `pnpm build` fails typecheck on `src/lib/live/last-good.ts` (implicit `any`)

- Severity: medium
- Source: ci
- Where: `src/lib/live/last-good.ts:69` (untracked at the time of this
  finding — no commit touches this file yet on `next-2026`)
- Steps: On `next-2026`, run `pnpm build` (or `pnpm typecheck`). Next.js's
  build-time type check fails:
  ```
  src/lib/live/last-good.ts(69,60): error TS7031: Binding element
  'ttlSeconds' implicitly has an 'any' type.
  src/lib/live/last-good.ts(69,72): error TS7031: Binding element
  'tags' implicitly has an 'any' type.
  ```
  The destructured parameter `{ ttlSeconds, tags }` on the `write<T>`
  method has no type annotation; the file elsewhere types the same
  shape inline (`options: { readonly ttlSeconds: number; readonly
  tags?: readonly string[] }` on a sibling function, line 38) but that
  type is not reused/applied here.
- Expected: `pnpm build` (and `pnpm check`'s `typecheck` step) exits 0
  under the repo's `"strict": true` `tsconfig.json` — this is exactly
  what M4's `check.yml` runs on every push/PR to `next-2026`.
- Observed: build red on `next-2026` HEAD (`bce229b` at the time of this
  finding) purely from this one file; unrelated to the CI work package's
  own changes (`.github/workflows/**`, `README.md`, `CONTRIBUTING.md`,
  `playwright.config.ts`).
- Round decision: (Project Manager to set)
- Note: found while dry-running M4's `check.yml` build step locally, not
  by the persona this file's format was originally written for (QA) —
  filed as instructed for a CI-discovered issue outside the CI work
  package's own ownership scope. Not fixed here (`src/lib/live/**` is
  outside `.github/workflows/**` / `README.md` / `CONTRIBUTING.md` /
  `playwright.config.ts`, this work package's owned paths).

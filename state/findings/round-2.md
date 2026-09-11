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
- Update (same round, ~10 min later): `next-2026`'s build is a moving
  target under the concurrent agents in this run. A push minutes later
  (`b4163fa`) triggered a real Vercel deployment build
  (`https://schafe-vorm-fenster-eepc12lta-schafe-vorm-fenster.vercel.app`,
  inspected via `vercel inspect --logs`) that failed typecheck on a
  **different** file: `src/components/code-snippet/copy-button.tsx(36,13)`
  — `TS2322`, a `"copy"`/`"check"` icon-name literal not assignable to the
  `lucide-react` icon-name union (consistent with `src/components/icon/`
  being under concurrent edit — `git status` showed it modified). This is
  not the same bug as the `last-good.ts` one above; it demonstrates the
  class of problem (typecheck breaks repo-wide, transiently, as other
  work packages land) rather than pinning blame on one file. Both
  `check.yml`'s `pnpm build` step and Vercel's own build are red for this
  reason whenever it recurs — worth a regression sweep once the parallel
  work packages in this run settle, not a fix chased file-by-file here.

# Preflight — before the first agent starts

`pnpm preflight` (→ [scripts/preflight.mjs](../scripts/preflight.mjs))
automates this list and prints GREEN / YELLOW / RED per item.
**Every RED blocks the start.** YELLOW items go to `state/open.md`
and the run may proceed with the documented degradation.

Verified actively, never assumed — the point is to fail in minute
one, not after two hours. After preflight, M0 (tracer bullet,
plan/projektplan.md) proves the toolchain dynamically.

## Access

- [ ] Git: repository on branch `next-2026`, push to origin works
      (SSH). `main` is not the current branch.
- [ ] GitHub CLI authenticated as `schafevormfenster`
      (`gh auth token --user schafevormfenster`) — needed for PRs.
- [ ] `GITHUB_TOKEN` available (env or `.env.local`) — needed for
      `npm.pkg.github.com` (hub packages install/update).
- [ ] Vercel CLI authenticated (`vercel whoami`) and repo linked
      (`.vercel/repo.json` → project `schafe-vorm-fenster-www`).
- [ ] `VERCEL_AUTOMATION_BYPASS_SECRET` available for e2e against the
      protected preview (sibling repos use it in every e2e job) —
      YELLOW until the preview protection story is exercised in M1.
- [ ] External services reachable: `events.api`, `geo.api-v2`,
      `assets.api` respond (the live modules build against them).

## Tools

- [ ] Node ≥ 20 and pnpm (repo pins `pnpm@10.26.0`).
- [ ] `pnpm install` clean; the 13 `@schafe-vorm-fenster/*` hub
      packages present in `node_modules`.
- [ ] `pnpm check` green (specs guard — must stay green the whole
      run).
- [ ] Local Chrome launchable for agent-driven chaos sessions
      (app present at `/Applications/Google Chrome.app` or on PATH).
- [ ] Dev-server port 3000 free.
- [ ] Playwright browsers installed — YELLOW before M1 (installed as
      part of the M1 harness work package).

## Material

- [ ] Design system readable: `concept/website-design-system.md` +
      boards in `concept/v2.0/` (Style Guide, UI Design Mobile v3).
- [ ] Specs complete: 29 tactical specs in `specs/tactical/`,
      check-specs reports 0 errors.
- [ ] Hub content reachable: sibling repo
      `~/Projects/go-to-market-os` present (concept documents,
      content sources by package name).
- [ ] Brand package pinned and importable
      (`@schafe-vorm-fenster/brand-design`, tokens + kit).

## Structure

- [ ] `plan/`, `state/status.md`, `state/open.md`,
      `state/findings/`, `reports/{qa,uat,abnahme}/` exist.
- [ ] All role files in `.agents/roles/`, playbooks in
      `.agents/playbooks/`, subagent mirrors in `.claude/agents/`.

## Manual items (not scriptable)

- Vercel dashboard: deployment protection on the preview scope
  active; `next.schafe-vorm-fenster.de` wiring is Jan's task
  (DEC-035) — the run uses the generated `*.vercel.app` preview URLs
  until then.

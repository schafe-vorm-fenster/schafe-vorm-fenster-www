# Status

Run started: 2026-09-11 (orchestrator session, model claude-fable-5-1)
Current milestone: M4 Behaviour (wiring wave) — M2 structure + M3 content built; gate 2 (structure/pages/content/M4) next (M1 closed 2026-09-11)
Current test round: — (n of 3)

## Done

- M2/M3 pages: all twelve routes built in de+en with real content and chrome (P1 home/dein-ort/starten + PageFrame; P2 mitmachen/registrieren/dein-kalender/bestellen flows; P3 region/angebot/ueber-uns/archiv/rechtliches); pnpm check green (651 tests), e2e 207 green — 2026-09-11
- M4 libraries: relevance + personalization (138 tests), live-data BFF + mocks + DEC-075, analytics registry + mock tracker, SEO builders + redirect map, locale detection + privacy e2e (25/25) — 2026-09-11
- Fix round M1: F-1-1, F-1-3, row 42 resolved (26176ff); CI check.yml + preview-e2e.yml built, blocked on GitHub Packages access (row 64) — 2026-09-11
- M3 content pipeline: src/lib/content loader (typed blocks), check:content gate (0 errors), schema extended (page_id/derived_from/provenance), ADR-074; 237 tests green — 2026-09-11
- Fix (high, rows 21/31): CSP hydration — strict-dynamic removed, per-build hash generation built (works self-hosted), preview hydrates via preview-only unsafe-inline after three delivery mechanisms failed on Vercel with evidence; production unaffected; e2e 38/38 against preview https://schafe-vorm-fenster-8bkxy2mov-schafe-vorm-fenster.vercel.app — 2026-09-11
- M2 argument-block components: 19 (B; 21 test files; dev-layout bug fixed) → all 63 inventory components exist, 172 tests green — 2026-09-11
- M3 Phase 3: gaps filled with labelled demo content (12 slots, rows 45–53) + English for all eleven pages, glossary 22 terms, frontmatter green 64 files (Content) — 2026-09-11
- M2 live-module shells + conversion/form components: 17 (C; mocks envoy/newsletter with no-`name` fields; 172 tests green) — 2026-09-11
- M3 Phase 2: German copy for eleven pages in content/pages/<route>/de.md, compliance table complete (Content) — 2026-09-11
- M2 foundation components: 27 components in src/components (A; 44 tests; gallery at /dev/components; refactored onto the route/i18n facades) — 2026-09-11
- M2 routing + locale skeleton: 24 URLs (12 pages × de/en), src/lib/routes + src/lib/i18n, metadata/hreflang, 404/error pages, 301 redirects, ADR-073; pnpm check green (106 tests), e2e 38 green, prod build 28 static pages (D) — 2026-09-11
- M1 gate closed: QA run 1 (24 pass / 0 fail / 4 not-testable, findings F-1-1..3 low/medium → PM round decision at M2), Customer ACCEPTED (reports/acceptance/M1.md), UAT n/a — 2026-09-11
- M1 Scaffold — six commits (088cc97…7b3624d): Next 16.3.4 pinned, stack.allow.json + DEC-072, pnpm check = 7-step gate, 17 unit / 4 integration / 9 e2e green, preview https://schafe-vorm-fenster-4veymgqid-schafe-vorm-fenster.vercel.app smoked 9/9 through protection bypass. UAT and chaos deliberately skipped at M1: no conversion path exists yet (first chaos/UAT at the M2 gate) — 2026-09-11
- M3 prep: content source map state/content-map.md (78 slots: 59 sourced, 11 clearance-gated → labelled Demo entries in M3, 7 Dummy-Content) — 2026-09-11
- M2 prep: plan/component-inventory.md (63 components, 7 fixed / 56 proposed, per-page composition sheets; Q-052 = DEC-059) — 2026-09-11
- M1 Scaffold — Next.js 16.3.4 App Router in the repository root, strict
  typing, `pnpm check` as the single gate (7 checks, ~3 s), Vitest +
  Playwright with one real passing test per level, brand tokens bound
  through one file, security headers and CSP live, preview deployed and
  the e2e smoke green against it through the protection bypass —
  2026-09-11. Preview:
  <https://schafe-vorm-fenster-4veymgqid-schafe-vorm-fenster.vercel.app>
- M0 Tracer bullet — all six proofs GREEN (Next.js 16.3.4; MCP endpoint needs `Accept: application/json, text/event-stream`; Playwright chromium; chaos tooling = `agent-browser`; Vercel auth + project visible; teardown clean) — 2026-09-11

## In progress

- M4 wiring wave across all twelve pages: Cache Components, live islands, relevance selection, analytics, JSON-LD, page-meta consolidation — Developer (opus)
- Round-2 triage + gate-2 scope — Project Manager (opus)

## Pending

- M2 Structure
- M3 Content
- M4 Behaviour
- M5 Final acceptance

## Last quality gate

M1 — QA: clear | Customer: accepted | UAT: n/a (no conversion path yet)

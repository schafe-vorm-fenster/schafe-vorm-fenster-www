# Status

Run started: 2026-09-11 (orchestrator session, model claude-fable-5-1)
Current milestone: DONE — prototype milestone accepted (reports/acceptance/final.md); run closed (M1 closed 2026-09-11)
Current test round: closed (gate-2 loop 3 rounds; M5 roundtrip + final fix round + retest)

## Done

- Final fix round (12/12, plan/round-4.md; F-3-10 = IntersectionObserver bug fixed), preview https://schafe-vorm-fenster-ihuc6flgy-schafe-vorm-fenster.vercel.app e2e 509/0 prod build; QA M5 run 2: 12/12 resolved, 0 critical / 0 high, 285/28/45; Customer FINAL: prototype milestone ACCEPTED, R-1…R-11 unresolved with reasons; run report reports/run-report.md — 2026-09-12
- M5 roundtrip on preview 5jupiff6w: QA run 1 285 pass / 28 fail / 45 n-t, 0 critical / 0 high, e2e 471/0 + 464/0 (reports/qa/M5-run-1.md); UAT: all nine walks reach their goal, 9/19 gate-2 hesitations gone (reports/uat/M5.md); chaos ×4 on Playwright: no double-fired events, all gate-2 defects confirmed fixed, new observations triaged to F-3-10…23; PM final decisions: 12 fix-now / 11 open-list + handover section (plan/round-4.md) — 2026-09-12
- M5 fix round: F-2-49 (proxy-level 307 hop — Cache Components serialises page redirect() into the flight payload), F-2-70 (404 via two-segment rewrite, JS-off full body both locales, closes row 37), F-2-69 (archive CLS 0.22→0), F-2-33/41 residue, F-2-71 (six hydration races), F-2-72/73/74 (real titles/descriptions from content `seo:` blocks, no geoname ids, EN legal notice); pnpm check 1073 tests; e2e 471/0 prod build, 464/0 preview; Lighthouse CLS 0; verification traps rows 147/148 — 2026-09-12
- Customer acceptance gate 2: closed with named remainder — 264 accepted / 14 as prototype / 15 rejected / 27 not in gate; 7 must-fix items for M5 incl. three new findings (reports/acceptance/gate-2.md) — 2026-09-12
- Gate 2 QA run 2 (retest): 26 resolved / 2 scoped / 5 reopened; 264 pass / 26 fail / 43 n-t; Lighthouse 95–96, CLS 0; a11y 0 serious; new F-2-69 (archive CLS), F-2-70 (German 404 blank JS-off), F-2-71 (flaky specs); loop ended by the three-round branch (reports/qa/gate-2-run-2.md) — 2026-09-12
- Round 3 fix packages: A 20/20 (F-2-30 critical closed; events once per action; 404 real; briefing links real), B 4/6 (archive filter, type floor 15 px, metric-matched font fallbacks → shift 174→≤2.4 px; F-2-39/56 Suspense reverted: contradicts JS-off ACs, row 145), C 5/6 (bypass fetch hardened, D11 lifecycle gate, /start + /llms.txt, landing rule, build guards); orchestrator sweep: pnpm check green 796 tests, build ○/◐/ƒ as decided, preview deployed — 2026-09-12
- Gate 2 QA run 1: 333 ACs — 234 pass / 52 fail / 47 not-testable; 35 findings (1 critical F-2-30 uncovered branch, 12 high); Lighthouse a11y 100; semgrep 0 true positives; differential review → F-2-36 (reports/qa/gate-2-run-1.md) — 2026-09-11
- Chaos hasty-clicker run 2 (Playwright): double-fired events C-H-6/7, 174 px shift C-H-12 — 2026-09-11
- PM round-3 decisions: 32 fix-now (1c/15h/16m) in packages A/B/C, 29 open-list (plan/round-3.md) — 2026-09-11
- Fix round 2b: F-2-2 scrim (11.9–15.7:1), F-2-28/29 contrast (axe 0 serious on 48 cases), F-2-3 breadcrumb name, F-2-4 locale props + dictionary sections, e2e env fit; preview https://schafe-vorm-fenster-cmijfafo8-schafe-vorm-fenster.vercel.app 256 passed / 0 failed — 2026-09-11
- Gate 2 strands: UAT report reports/uat/gate-2.md (5 goals walked; strongest: 404 placeholder copy, dead briefing links, Weiter/Absenden, demo organizer id, mixed-language EN registration); chaos keyboard-only (8 obs, TS-001-A7 switch bug), boundary-tester (18 obs), form-abandoner (6 obs, {county-or-organization} literal, EN labels German) — 2026-09-11
- M4 wiring wave: Cache Components on (6 static ○ / 2 ◐ / 4 ƒ), live islands + relevance selection + 9 goal events + one JSON-LD graph per page, TS-006 A1/A11 cross-page validation; pnpm check 704 tests; e2e 251 local, 221 on preview https://schafe-vorm-fenster-83x6zbys4-schafe-vorm-fenster.vercel.app (failures = known contrast + env-fit) — 2026-09-11
- Round-2 triage: 27 findings (0 critical, 1 high), 7 fix-now; plan/gate-2-scope.md (PM) — 2026-09-11
- Fix round 2a: F-1-2 CSP guard, F-2-5 geo fixture, F-2-6 axe (DEC-076, 24-route sweep → F-2-28/29 found) — 2026-09-11
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

- — (run closed; next: manual break, then the four workstreams in plan/round-4.md)

## Pending

- M2 Structure
- M3 Content
- M4 Behaviour
- M5 Final acceptance

## Last quality gate

M1 — QA: clear | Customer: accepted | UAT: n/a
Gate 2 — QA: closed with named remainder | Customer: closed with named remainder | UAT: filed
M5 — QA: 0 critical / 0 high, proceed | Customer: ACCEPTED (prototype) | UAT: all nine walks reach their goal

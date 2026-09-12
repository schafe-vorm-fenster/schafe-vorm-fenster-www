# Run Report — Website Prototype Realization

Run: 2026-09-11 → 2026-09-12 · branch `next-2026` · 214 commits since start · orchestrator session Claude Fable 5.1, subagents per the model assignment (opus/sonnet/haiku).

## Result

**The prototype milestone is accepted** (`reports/acceptance/final.md`): every route, every element, full design, full copy, full images — in German and English, with and without JavaScript, on the protected preview. Mocks and demo content are labelled and registered. It is a prototype, not a live site.

**Final preview:** https://schafe-vorm-fenster-ihuc6flgy-schafe-vorm-fenster.vercel.app (Deployment Protection on; Vercel login or the automation bypass).

## The numbers

| | |
| --- | --- |
| Routes | 12 pages × de/en = 24 URLs, plus `/start`, `/llms.txt`, sitemap, robots, 5 GET-only BFF routes |
| Components | 63 (7 from the design system, 56 derived per `plan/component-inventory.md`) |
| Content | 78 slots × 2 locales in `content/pages/**`; 22 `Dummy-Content` rows, 18 `Mock aktiv` rows |
| Gate `pnpm check` | 1 085 unit/integration tests, 55 static tests, 9 guards (specs, content, brand, CSP, API routes, stack, contrast, SEO budget, frontmatter) |
| e2e | 509 passed / 0 failed on a production build; 501–502 / ≤1 flaky on the preview |
| Accessibility | axe 0 serious/critical on 24 routes × 2 viewports (stricter rule set); Lighthouse a11y 100 everywhere; 242 tab stops, 0 without a focus ring |
| Performance | Lighthouse mobile 96–100, CLS ≤ 0.0007 (archive was 0.22) |
| Acceptance criteria | 358 in scope: 285 pass · 28 fail · 45 not-testable (QA `M5-run-2`) |
| Findings | 3 rounds: 131 findings filed, 0 critical / 0 high open at close; 14 open (8 medium, 6 low) |
| Decisions | ADRs 072–076 (stack, locale/URL layer, content pipeline, last-good store, axe) |

## How it ran

Preflight (20/3/0) → M0 tracer bullet (6/6) → M1 foundation (gate: QA clear, Customer accepted) → parallel build wave (components A/B/C/D, routing, content DE+EN, pipeline, M4 libraries) → wiring wave → gate 2 (three rounds: QA sweep + 4 chaos personas + UAT + PM triage + fix packages A/B/C + retest; closed with a named remainder, Customer accepted 264 with 7 must-fix) → M5 (fix round on the highs, full roundtrip on a production-build preview, final fix round, retest, final acceptance).

Two verification lessons the run had to learn (rows 147/148): a local production build must run with `VERCEL_ENV=preview` or the D11 gate drops every draft artefact; and the local CSP hash asset must be removed before `next start` or nothing hydrates locally.

## What the run could not close — read `state/open.md` (169 rows)

- **Row 132 — the one go-live blocker:** under DEC-045's hash-only CSP the four dynamic routes (incl. the order and registration flows) ship unhydrated in production. Invisible on the preview (`'unsafe-inline'` fallback there). Needs a DEC-045 amendment (nonce) — hardening round.
- **Row 145:** Suspense/PPR shell vs "page complete without JavaScript" — spec against spec, three criteria fail as written.
- **R-1…R-11 in the final protocol:** OG images (none), archive rows without outbound links/images, remaining German strings on English pages (F-3-24), a raw `Beleg:` id in body copy, Markdown backticks in the accessibility statement, duplicate `main` after client navigation, the performance floor (96 vs 98, no Save-Data), empty invoice accepted, a pluralisation, `lang` on legal bodies.
- **Jan, dashboard-only:** row 22 (Vercel project: yarn → pnpm, Node 24; newsletter system Q-020), row 64 (GitHub Packages "Manage Actions access" for the 11 consumed packages — CI is red at install until then).
- **Mocks:** no read token for geo-api/events-api exists in any environment (row 77) — no page has ever fetched real place data; the `Mock aktiv` register is the hardening checklist.

## After the prototype (plan/round-4.md, handover section)

Manual break, then the four workstreams: content follow-up (22 `Dummy-Content` rows), content review + tone, usability/feature feedback (the open-list findings and UAT hesitations), hardening (18 `Mock aktiv` rows, row 132, CI access).

## Where everything is

`reports/acceptance/{M1,gate-2,final}.md` · `reports/qa/{M1-run-1,gate-2-run-1,gate-2-run-2,M5-run-1,M5-run-2}.md` · `reports/uat/{gate-2,M5}.md` · `state/findings/round-{1,2,3}.md` + eight chaos files · `state/open.md` · `plan/{component-inventory,gate-2-scope,round-3,round-4}.md`.

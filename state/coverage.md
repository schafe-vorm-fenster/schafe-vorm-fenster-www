<!-- Written by `pnpm check:coverage`. Do not edit by hand: the next run overwrites it. -->

# Acceptance-criterion coverage

What verifies each acceptance criterion, at the level the criterion itself
declares. `pnpm check:coverage` writes this file; `scripts/check-coverage.ts`
says what the five verdicts mean and what gates.

**430 criteria · 252 closed · 178 open (59 % closed)**

| Verdict | Count | What it means |
| --- | --- | --- |
| VERIFIED | 252 | a test title in a file a runner runs carries the id |
| METERED | 0 | a `check:` meter in the chain, or a CI job, names it (`static` and `tool`) |
| ATTESTED | 0 | a current row in `specs/verification/manual-checks.md` (`manual` only) |
| NAMED ONLY | 32 | the id is in a runner file but in no test title — **not coverage** |
| MISSING | 146 | nothing names it |

Rule 1 (a new criterion arrives with its instrument): 2 criterion(a) new in this commit, 0 without an instrument.

## By level

| Level | Criteria | Closed | Open | Closed |
| --- | --- | --- | --- | --- |
| static | 86 | 49 | 37 | 57 % |
| unit | 30 | 26 | 4 | 87 % |
| integration | 73 | 47 | 26 | 64 % |
| e2e | 171 | 130 | 41 | 76 % |
| tool | 39 | 0 | 39 | 0 % |
| manual | 31 | 0 | 31 | 0 % |

## By tactical specification

| Spec | Criteria | Closed | Open criteria |
| --- | --- | --- | --- |
| TS-WEB-0001 | 11 | 9 | A9 A11 |
| TS-WEB-0002 | 13 | 2 | A1 A2 A4 A5 A6 A7 A8 A9 A10 A11 A12 |
| TS-WEB-0003 | 8 | 1 | A1 A2 A3 A4 A5 A6 A7 |
| TS-WEB-0004 | 11 | 8 | A6 A7 A11 |
| TS-WEB-0005 | 16 | 13 | A9 A10 A15 |
| TS-WEB-0006 | 18 | 14 | A4 A13 A14 A16 |
| TS-WEB-0007 | 16 | 5 | A2 A3 A4 A5 A6 A9 A10 A11 A13 A15 A16 |
| TS-WEB-0008 | 16 | 11 | A6 A7 A8 A12 A13 |
| TS-WEB-0009 | 14 | 7 | A1 A2 A3 A8 A9 A12 A13 |
| TS-WEB-0010 | 15 | 5 | A4 A5 A6 A7 A9 A11 A12 A13 A14 A15 |
| TS-WEB-0011 | 14 | 6 | A3 A5 A6 A8 A9 A11 A12 A13 |
| TS-WEB-0012 | 11 | 8 | A7 A8 A10 |
| TS-WEB-0013 | 8 | 3 | A3 A4 A6 A7 A8 |
| TS-WEB-0014 | 13 | 2 | A3 A4 A5 A6 A7 A8 A9 A10 A11 A12 A13 |
| TS-WEB-0015 | 12 | 1 | A2 A3 A4 A5 A6 A7 A8 A9 A10 A11 A12 |
| TS-WEB-0016 | 23 | 11 | A1 A3 A4 A6 A7 A8 A9 A11 A18 A20 A13 A14 |
| TS-WEB-0017 | 21 | 9 | A1 A2 A3 A5 A6 A7 A12 A13 A15 A17 A16 A19 |
| TS-WEB-0018 | 16 | 2 | A1 A3 A4 A5 A6 A8 A9 A10 A11 A12 A13 A14 A15 A16 |
| TS-WEB-0019 | 16 | 15 | A15 |
| TS-WEB-0020 | 13 | 12 | A13 |
| TS-WEB-0021 | 15 | 13 | A11 A15 |
| TS-WEB-0022 | 19 | 14 | A8 A10 A11 A14 A15 |
| TS-WEB-0023 | 16 | 13 | A3 A10 A16 |
| TS-WEB-0024 | 19 | 14 | A6 A7 A12 A17 A19 |
| TS-WEB-0025 | 14 | 10 | A5 A9 A12 A13 |
| TS-WEB-0026 | 17 | 12 | A9 A11 A12 A16 A17 |
| TS-WEB-0027 | 16 | 11 | A7 A10 A11 A14 A15 |
| TS-WEB-0028 | 14 | 8 | A6 A8 A9 A10 A13 A14 |
| TS-WEB-0029 | 15 | 13 | A4 A12 |

## Every open criterion

| Criterion | Level | Verdict | Where the name appears | Check |
| --- | --- | --- | --- | --- |
| TS-WEB-0001-A9 | integration | MISSING | — | Each domain of D1 resolves over HTTPS and renders in its TLD default language; the international domain is reachable once its DNS is wired (Q-0001 residual). |
| TS-WEB-0001-A11 | static | MISSING | — | The language table is the single place a language is declared: the set that ships equals phase 1 exactly (de + en on `.de`, the national language elsewhere). ** … |
| TS-WEB-0002-A1 | tool | NAMED ONLY | e2e/a11y.spec.ts — outside any test title | axe-core: zero violations on every page, in all three themes. |
| TS-WEB-0002-A2 | tool | MISSING | — | Lighthouse accessibility = 100 (mobile + desktop). |
| TS-WEB-0002-A4 | manual | NAMED ONLY | e2e/site-header.spec.ts — outside any test title | Keyboard-only walkthrough reaches every conversion (all four jobs) — manual, per release. |
| TS-WEB-0002-A5 | manual | MISSING | — | Screen-reader spot check (VoiceOver iOS + NVDA) on home, `/dein-ort`, one sell page — manual, per release. |
| TS-WEB-0002-A6 | tool | MISSING | — | envoy widget passes A1/A4 inside the page context. |
| TS-WEB-0002-A7 | e2e | MISSING | — | 320px viewport: no horizontal scroll on any page. |
| TS-WEB-0002-A8 | integration | NAMED ONLY | e2e/footer.spec.ts — outside any test title | `/rechtliches#barrierefreiheit` resolves to the accessibility statement, is footer-linked under its conventional label, and its content is current. |
| TS-WEB-0002-A9 | e2e | MISSING | — | With `prefers-reduced-motion`: no animation beyond opacity. |
| TS-WEB-0002-A10 | static | MISSING | — | No font family, size or weight is declared outside the token import; the rendered type scale equals `font.*` from the brand package, and no size below 15 px app … |
| TS-WEB-0002-A11 | tool | MISSING | — | axe-core reports no image without a text alternative; every image is either given a meaningful `alt` from content frontmatter or marked decorative with `alt=""` … |
| TS-WEB-0002-A12 | manual | MISSING | — | The published accessibility statement names its method — self-assessment backed by the acceptance regime of this spec (A1–A5) — and claims no audit that did not … |
| TS-WEB-0003-A1 | tool | MISSING | — | Lighthouse CI green on the five D7 routes, mobile + desktop. |
| TS-WEB-0003-A2 | tool | MISSING | — | Bundle guard runs on every route and writes the measured first-load bytes to the run summary; a route over the D1/D4 budget is reported as a warning. The job fa … |
| TS-WEB-0003-A3 | static | MISSING | — | Fonts: single variable woff2, preloaded, ≤ 50KB, swap. |
| TS-WEB-0003-A4 | e2e | NAMED ONLY | specs/verification/journeys/know-what-is-on.feature — outside any test title | With app APIs blocked (simulated outage): every page renders tier-2/3 content, freshness labels shown, counters hidden after stale window. |
| TS-WEB-0003-A5 | tool | MISSING | — | eTracker and envoy absent from the critical request chain of the LCP element (verified in trace). |
| TS-WEB-0003-A6 | e2e | MISSING | — | `Save-Data: on` responses are measurably lighter (≥ 30 % image bytes saved) [PROPOSED threshold]. |
| TS-WEB-0003-A7 | tool | MISSING | — | CLS < 0.1 with live modules streaming in (reserved space, no shift). |
| TS-WEB-0004-A6 | e2e | MISSING | — | No external API host appears in any client-initiated request except envoy and Portalize (verified via CSP report / network trace). |
| TS-WEB-0004-A7 | integration | MISSING | — | BFF routes return 429 beyond the rate limit and reject foreign origins. |
| TS-WEB-0004-A11 | integration | MISSING | — | Once the calendars have moved to `app.*`: a request to `/{community}` carrying `etcc_cmp`/`etcc_med` redirects to that place's calendar on `app.*` with both par … |
| TS-WEB-0005-A9 | integration | MISSING | — | The route shell renders prerendered without waiting for the engine; the static default appears before the segment variant. |
| TS-WEB-0005-A10 | e2e | MISSING | — | Place-bound proof shown to a visitor always references a covered place. |
| TS-WEB-0005-A15 | static | MISSING | — | Every claim declared in content frontmatter resolves to a proof id that exists and is cleared, or is explicitly marked as having no proof — in which case the re … |
| TS-WEB-0006-A4 | e2e | MISSING | — | On every page whose focus job is "know what is on", the first screen contains the place-search or live-dates module and its primary conversion is not a link to  … |
| TS-WEB-0006-A13 | e2e | MISSING | — | `/deine-region` shows the two-working-day promise at the quote form and in the confirmation, both from the same constant. |
| TS-WEB-0006-A14 | manual | MISSING | — | The eight-point compliance check of SRC-0001 passes for each page brief before its content ships — points 4, 7 and 8 reviewed by hand, the rest evidenced by A1– … |
| TS-WEB-0006-A16 | manual | MISSING | — | The copy rules SRC-0018 assigns to `review` pass for every slot before it is approved: a reader-directed question is answered in its block (CG-006), each sectio … |
| TS-WEB-0007-A2 | tool | NAMED ONLY | src/lib/content/content-pipeline.integration.test.ts — outside any test title | `check:content` resolves every `derived_from` entry against the installed packages; an unresolvable ref, a malformed ref, and an empty list each fail with the f … |
| TS-WEB-0007-A3 | tool | MISSING | — | Clearance re-validation: a fixture whose installed package revoked `usage_rights` makes the run exit non-zero and name file plus record. |
| TS-WEB-0007-A4 | integration | MISSING | — | The same revocation **fails the build** — no deploy artefact is produced. It is not logged as a warning. |
| TS-WEB-0007-A5 | tool | NAMED ONLY | src/lib/content/content-pipeline.integration.test.ts — outside any test title | Locale completeness and slot binding: a missing `en` sibling fails; an orphan content file fails; a required slot with no file fails. |
| TS-WEB-0007-A6 | unit | MISSING | — | Selectable types: a missing facet fails; an unassessed job parses as the lowest step and is marked unassessed; a non-default `editorial_weight` without its reas … |
| TS-WEB-0007-A9 | unit | MISSING | — | Harmonisation: locale variants of one id agree on records, claims, proof bindings, CTA target and conversion goal, filled slots, numbers and `UNKNOWN` markers — … |
| TS-WEB-0007-A10 | tool | MISSING | — | Every audience, conversion goal, offering and proof id used resolves in an installed package; no such id is defined locally. |
| TS-WEB-0007-A11 | integration | NAMED ONLY | app/[lang]/rechtliches/german-only-notice.test.ts — outside any test title | `content/legal/<locale>/` renders as the anchored sections of the one legal page in registry order; anchors match TS-WEB-0004 D8; a legal file carrying generati … |
| TS-WEB-0007-A13 | tool | NAMED ONLY | src/lib/content/validate.test.ts — outside any test title | Glossary conformance: a banned term in a field where it is banned is reported with file, field and term. |
| TS-WEB-0007-A15 | manual | MISSING | — | P7 dry run on one bumped package version: the PR touches exactly the files whose `derived_from` names a changed record, resets them to `draft`, and carries `job … |
| TS-WEB-0007-A16 | tool | MISSING | — | Segment independence: no generated string contains a resolved place name; place references occur only as named interpolation slots. |
| TS-WEB-0008-A6 | e2e | NAMED ONLY | src/lib/live/mocks/geo.test.ts — outside any test title | `/dein-ort?ort=<covered place with no dates>`: focus job and primary CTA switch to publishing, the place name appears escaped in the copy, URL and canonical are … |
| TS-WEB-0008-A7 | e2e | MISSING | — | Searching an uncovered place lands on `/dein-ort/starten?ort=…`; the live example on that page is a covered place with dates; no website path contains a place s … |
| TS-WEB-0008-A8 | e2e | MISSING | — | On `/dein-kalender` the Portalize loader is requested from the allowlisted host, position 1 is absent, and the page sets no cookie from the embed; blocking the  … |
| TS-WEB-0008-A12 | manual | MISSING | — | Q-0026 verification: the Portalize embed sets no cookie and introduces no consent duty, and the place-filter parameter behaves as documented — recorded before t … |
| TS-WEB-0008-A13 | tool | NAMED ONLY | src/lib/live/upstream-live.integration.test.ts — outside any test title | Build fetches each service's `openapi.json`, compares it with the pinned copy, and fails on drift affecting the operations in D2 (DEC-0021). |
| TS-WEB-0009-A1 | static | MISSING | — | `cacheComponents: true` is set; no `cookies()`, `headers()` or `searchParams` access occurs inside a `'use cache'` module (build succeeds, lint rule green). |
| TS-WEB-0009-A2 | tool | MISSING | — | Build manifest: every TS-WEB-0004 D1 route emits a prerendered shell; zero routes are fully dynamic. |
| TS-WEB-0009-A3 | integration | MISSING | — | With every upstream stubbed to a 5 s delay, the shell of each content page responds within the TTFB budget and contains header, footer, copy and all module skel … |
| TS-WEB-0009-A8 | tool | NAMED ONLY | src/components/archive-filter/archive-filter.test.tsx — outside any test title | CLS < 0.1 on every content page in both counter branches — counters present and counters hidden — with all islands streaming. |
| TS-WEB-0009-A9 | integration | MISSING | — | For every D3 island, the skeleton's rendered box equals the resolved module's box (height within 2 px); no skeleton renders a spinner or a placeholder figure. |
| TS-WEB-0009-A12 | tool | MISSING | — | Snapshot build step produces a file for every D3 module with fallback "tiers 1–3", produces none for counters, and fails the build if a required file is missing … |
| TS-WEB-0009-A13 | manual | MISSING | — | Screen reader: skeletons are not announced; the `/dein-ort` empty state is announced once on arrival. Under `prefers-reduced-motion` no skeleton animates. |
| TS-WEB-0010-A4 | integration | MISSING | — | Structure invariance: for one route, the section ids, order, headings, CTAs and navigation are identical across stage-0, stage-1, stage-2 and stage-3 requests;  … |
| TS-WEB-0010-A5 | integration | MISSING | — | Stage 0 completeness: with the geo flag off and no referrer, every page renders fully — place search present, no empty slot, no unresolved skeleton — and issues … |
| TS-WEB-0010-A6 | integration | MISSING | — | Cacheability: two requests for the same URL with different `Accept-Language` and different IP countries return a byte-identical shell; no `Set-Cookie` and no `V … |
| TS-WEB-0010-A7 | e2e | MISSING | — | No classification control exists on any page: no role chooser, no audience switcher, no "who are you?" interstitial. |
| TS-WEB-0010-A9 | tool | MISSING | — | Build check: every regional variant set has a neutral variant, and no variant is keyed below county level (D9). |
| TS-WEB-0010-A11 | static | MISSING | — | No IP value reaches a log, trace attribute or outbound payload: the request geo/IP headers are read in exactly one module, and no other module references them. |
| TS-WEB-0010-A12 | e2e | MISSING | — | Persistence: after a visit at stage 3, no cookie, `localStorage` entry or server session carries a location or a trait; the only stored key is the D10 session f … |
| TS-WEB-0010-A13 | e2e | MISSING | — | Language suggestion (when built): appears at most once per session, dismissal holds, navigating is a link, the served HTML is identical whether or not it applie … |
| TS-WEB-0010-A14 | e2e | MISSING | — | Focus job stability: the primary conversion of every route is identical at stage 0 and stage 3, with the empty-place-calendar case (TS-WEB-0008) as the only exc … |
| TS-WEB-0010-A15 | manual | MISSING | — | Q-0008 sign-off is recorded before IP geolocation is enabled in production; until then the flag is off in production and A5 passes. |
| TS-WEB-0011-A3 | tool | MISSING | — | Every page: exactly one `main`, exactly one `h1`, no skipped heading level, every `nav` and `aside` named. Zero HTML-validator errors. |
| TS-WEB-0011-A5 | tool | MISSING | — | Structured-data validation (schema.org validator + Rich Results Test) reports zero errors per page type, and each page emits exactly the D4 types assigned to it … |
| TS-WEB-0011-A6 | static | MISSING | — | No entity `@id`/`itemtype` appears both as JSON-LD and as microdata on the same page. |
| TS-WEB-0011-A8 | integration | MISSING | — | Every indexable page emits the complete D6 tag set with absolute URLs; `og:url` equals the canonical; `og:locale` matches `<html lang>`; `og:locale:alternate` m … |
| TS-WEB-0011-A9 | e2e | MISSING | — | The OG image of every (path, language) responds 200, is 1200×630, within the size budget, and shows text in that language. |
| TS-WEB-0011-A11 | static | MISSING | — | No route, content file, sitemap entry, metadata field, or `llms.txt` line names a competitor while Q-0009 is open. |
| TS-WEB-0011-A12 | manual | MISSING | — | Each interest landing page passes the SRC-0001 page-brief compliance check and is reviewed against D7.4 (not a keyword permutation of an existing page) before p … |
| TS-WEB-0011-A13 | manual | MISSING | — | Post-cutover watch: Search Console shows no rise in 404s on formerly indexed URLs, and the previously best-ranking legacy URLs keep their impressions within the … |
| TS-WEB-0012-A7 | integration | MISSING | — | A URL carrying `etcc_*` renders normally and emits a canonical without them; `sitemap.xml` contains no `etcc_*`; no internal link carries `etcc_*`. |
| TS-WEB-0012-A8 | tool | MISSING | — | Lighthouse/trace on the TS-WEB-0003 D7 routes: the eTracker script is deferred, is not a render-blocking resource, and does not appear in the LCP critical path. |
| TS-WEB-0012-A10 | manual | MISSING | — | In the eTracker account: website and app events arrive in one property under one secure code; a `stage: handover` and a `stage: completed` event for the same go … |
| TS-WEB-0013-A3 | static | NAMED ONLY | src/lib/live/boundary.test.ts — outside any test title | Built output and source contain no external asset URL: no `fonts.googleapis.com`, `fonts.gstatic.com`, or any CDN host; fonts, icons and libraries resolve to ow … |
| TS-WEB-0013-A4 | static | MISSING | — | The deployed CSP allowlist equals the D2 host set exactly — no wildcard, no extra host, no missing host. |
| TS-WEB-0013-A6 | unit | MISSING | — | The geo resolver returns at most county-level, writes nothing, and no returned or cached key contains an IP address. |
| TS-WEB-0013-A7 | manual | MISSING | — | Every host in D2 outside our own origin has a named section in the privacy policy on `/rechtliches#datenschutz`, and the `/dein-kalender` block claims nothing D … |
| TS-WEB-0013-A8 | manual | MISSING | — | Review gate: a PR adding an outbound request carries the D5 rung-3 evidence (allowlist diff, privacy-policy section, D2 row, no-cookie evidence) or is rejected. |
| TS-WEB-0014-A3 | e2e | MISSING | — | With CSP enforced, every page of the TS-WEB-0004 D1 inventory loads with zero CSP violations — including the Portalize embed demo and the envoy widget, in all t … |
| TS-WEB-0014-A4 | e2e | MISSING | — | A script injected from a host outside D1 (test fixture) is blocked and produces exactly one report at `/api/csp-report`; the logged `document-uri` carries no qu … |
| TS-WEB-0014-A5 | tool | MISSING | — | securityheaders.com grade A and Mozilla Observatory ≥ 90 on the production origin [PROPOSED thresholds]; csp-evaluator reports no high-severity finding beyond t … |
| TS-WEB-0014-A6 | integration | MISSING | — | `http://` on every production host answers `308` to its `https://` equivalent; HSTS present with the D4 `max-age` and without `preload`. |
| TS-WEB-0014-A7 | static | MISSING | — | No `http://` and no protocol-relative `//host/…` resource URL in source, content frontmatter, or config (prose links inside legal texts excluded). |
| TS-WEB-0014-A8 | e2e | MISSING | — | envoy widget: a submission with the honeypot filled, and one submitted faster than D9's floor, both return the normal success state and produce no lead in envoy … |
| TS-WEB-0014-A9 | e2e | MISSING | — | No captcha, challenge iframe, or third-party challenge script is present on any page or inside the widget — asserted on both the DOM and the network trace. |
| TS-WEB-0014-A10 | integration | MISSING | — | Each D10 route answers `200` below its limit and `429` with `Retry-After` beyond it; a cross-site `Origin` gets `403`; no BFF response carries an `Access-Contro … |
| TS-WEB-0014-A11 | tool | MISSING | — | CI: a dependency with a known HIGH CVE, injected into the lockfile, fails the `Quality` job, and the production promotion does not start. An expired `.trivyigno … |
| TS-WEB-0014-A12 | manual | MISSING | — | Release check: Vercel Runtime Errors, the Observability 5xx panel and the uptime monitor all show the current deployment; no third-party error SDK appears in th … |
| TS-WEB-0014-A13 | static | MISSING | — | No call site emits a request body, query string, IP address or e-mail through the logging facade (lint rule over the facade's typed signature). |
| TS-WEB-0015-A2 | tool | MISSING | — | The migration preview host answers unauthenticated requests with Vercel's protection challenge, and 200 only with a valid `x-vercel-protection-bypass` header. |
| TS-WEB-0015-A3 | static | NAMED ONLY | .github/workflows/check.yml — outside any test title | `preview.yml` and `deploy.yml` declare the D4 / D7 jobs with exactly the specified `needs` edges, and neither carries a `paths-ignore` for `**/*.md`. |
| TS-WEB-0015-A4 | tool | MISSING | — | A branch introducing a type error, a lint error, a failing test, an unused export, or a duplicated block above threshold turns the corresponding job red and lea … |
| TS-WEB-0015-A5 | tool | MISSING | — | `pnpm check` failing on an E-class error turns `Check` red; a run with only W1/W2/W3 warnings exits 0, and the warning block appears in the run summary and the  … |
| TS-WEB-0015-A6 | e2e | MISSING | — | The Playwright journey suite runs green against the preview deployment URL reached through the bypass secret. |
| TS-WEB-0015-A7 | tool | MISSING | — | On a green push to `main`: a canary production deployment is created, the D8 signals are evaluated against the canary, and `rolling-release/complete` is called  … |
| TS-WEB-0015-A8 | tool | MISSING | — | With a deliberately failing canary journey: no completion call is made, `rollback/{previousReadyProductionUid}` is called, the production alias serves the previ … |
| TS-WEB-0015-A9 | tool | MISSING | — | Lighthouse CI, the bundle guard (TS-WEB-0003 D7) and the axe sweep (TS-WEB-0002 A1) run in `Budgets` after the preview deployment and before the merge gate reso … |
| TS-WEB-0015-A10 | tool | MISSING | — | A bot PR carrying the `auto-merge` label merges only after all five required checks are green; with one check red it stays open. |
| TS-WEB-0015-A11 | integration | MISSING | — | `next.schafe-vorm-fenster.de` serves the head of `next-2026` after a push to that branch, protected and noindex. |
| TS-WEB-0015-A12 | manual | MISSING | — | Per release: branch protection on `main` lists exactly the five D5 contexts, and every D10 secret and variable is present in the repository settings. |
| TS-WEB-0016-A1 | static | MISSING | — | No submission endpoint exists in the website: no POST/PUT route or server action under `app/api/` or elsewhere accepts form data; the BFF inventory equals TS-WE … |
| TS-WEB-0016-A3 | e2e | MISSING | — | Network trace of a full submission: form values leave the browser only to the envoy host; no website request, log line or analytics call contains a field value. |
| TS-WEB-0016-A4 | static | MISSING | — | Every CSS variable published by the widget contract is mapped to a design token in the single mapping file, in all three themes; an unmapped published variable  … |
| TS-WEB-0016-A6 | e2e | MISSING | — | The order flow runs the four D8 steps with the briefing exit visible on each; step 4 shows a copyable embed code without any payment step, and no payment-provid … |
| TS-WEB-0016-A7 | static | MISSING | — | No page contains an iframe, player script or social embed from a media host; every archive entry renders an own preview image served from our own origin plus on … |
| TS-WEB-0016-A8 | tool | MISSING | — | axe-core: zero violations on every page with the widget mounted, including inside its shadow root, in light, dark and high-contrast. |
| TS-WEB-0016-A9 | manual | NAMED ONLY | e2e/pages/deine-region.spec.ts — outside any test title | Keyboard-only and screen-reader run of one full lead form per release: labels announced, an invalid submission identifies the error in text, focus moves to the  … |
| TS-WEB-0016-A11 | integration | MISSING | — | Newsletter signup: on the e-mail route no address is usable before the confirmation link is followed; neither route sets a cookie or a persistent identifier; th … |
| TS-WEB-0016-A18 | static | MISSING | — | Every conversion event name and every reporting label for the S1 rows and the S5 WhatsApp route identifies the number as an **intent**, not as a contact or a su … |
| TS-WEB-0016-A20 | e2e | MISSING | — | Where a prefilled message is rendered: the WhatsApp row's URL is `https://wa.me/<number>?text=<urlencoded>` and the mail row's `mailto:` carries a subject and a … |
| TS-WEB-0016-A13 | manual | MISSING | — | The two-working-day promise copy on `/deine-region` is present only when the lead-handling process behind it is named and signed off (C11); absent otherwise. |
| TS-WEB-0016-A14 | e2e | MISSING | — | With the widget script blocked, S2 and S4 still render the static fallback (contact link plus the booking row of the page's contact section) and no empty or per … |
| TS-WEB-0017-A1 | static | MISSING | — | `package.json`: `next` present; no dependency from the D1 deny-set; every `dependencies` entry has a reason line in `stack.allow.json`, and every register entry … |
| TS-WEB-0017-A2 | static | MISSING | — | `pnpm-lock.yaml` is the only lockfile; `packageManager` pins pnpm; `.npmrc` maps the `@schafe-vorm-fenster` scope to the private registry and the `@leafcutter-s … |
| TS-WEB-0017-A3 | static | MISSING | — | Root `tsconfig.json` exists with `strict: true`; `pnpm typecheck` is a script, is part of `pnpm check`, and exits 0. |
| TS-WEB-0017-A5 | static | MISSING | — | No colour literal and no `font-family` literal outside the single brand-token import file (`app/`, `src/`, stylesheets). |
| TS-WEB-0017-A6 | static | NAMED ONLY | e2e/routes.spec.ts — outside any test title | No logo, mark, or font file is committed in this repository; every logo reference is a brand-package subpath import. |
| TS-WEB-0017-A7 | static | MISSING | — | The brand package is pinned to an exact version; the lockfile version matches the version recorded in D3. |
| TS-WEB-0017-A12 | integration | NAMED ONLY | e2e/site-header.spec.ts — outside any test title | The persistent calendar entry is present in the header on every page and resolves to the target TS-WEB-0004 D4 fixes. |
| TS-WEB-0017-A13 | tool | MISSING | — | `pnpm check` (frontmatter + `check:specs`) exits 0 — pre-commit hook and CI; zero E-class errors. |
| TS-WEB-0017-A15 | manual | MISSING | — | Imagery review: every image shipped is checked against the imagery rules in the brand identity profile — per release, by the brand owner. |
| TS-WEB-0017-A17 | static | MISSING | — | Exactly one icon dependency; every icon name used resolves to a Lucide export. |
| TS-WEB-0017-A16 | manual | MISSING | — | Dependency review: any dependency adopted from a sibling repository is confirmed as framework-neutral intent, not a ported implementation — per PR that changes  … |
| TS-WEB-0017-A19 | static | MISSING | — | Every `var(--x)` in a stylesheet under `app/`, `src/`, `e2e/` or `scripts/` names a custom property something declares — any stylesheet, the brand token sheet i … |
| TS-WEB-0018-A1 | static | MISSING | — | Every id in a content file's `offerings: []` resolves in the pinned offering package, and its `promotion` permits the surface it is used on per D2; an unresolva … |
| TS-WEB-0018-A3 | static | MISSING | — | Price guard: every currency token in the built HTML resolves to a `publishablePrice` amount or to a reasoned allow-list entry; `4000`/`4.000 €` and `5 €` in any … |
| TS-WEB-0018-A4 | static | MISSING | — | No id from the D4 deny-list, and no hub id whose `brand` is not `schafe-vorm-fenster`, appears in any content frontmatter, the route table, the nav registry, or … |
| TS-WEB-0018-A5 | static | MISSING | — | Foreign-brand term guard over the built HTML finds no D4 term; every allow-list entry carries a reason. |
| TS-WEB-0018-A6 | static | MISSING | — | No entry of the route translation map (any language) and no label in the header, footer, or context-band registry matches the D5 product-name list. |
| TS-WEB-0018-A8 | static | MISSING | — | Content build input excludes `content/support/**` and `legacy-content/app/funktionen/**`; no content file's `derived_from` points into them; the content schema  … |
| TS-WEB-0018-A9 | static | MISSING | — | No path segment, nav label, or content id equals an audience id; every page brief declares exactly one of the four focus jobs; no two briefs with the same focus … |
| TS-WEB-0018-A10 | static | MISSING | — | **No** content file references `local-advertising` while the offering is withheld (DEC-0052 §3). Formerly a budget of one sentence; the budget is now zero. Lega … |
| TS-WEB-0018-A11 | static | MISSING | — | Every `claims[]` entry names a resolvable `proof:` with `usage_rights: cleared` or a `live:` module id from the TS-WEB-0004 D5 inventory; anything else fails th … |
| TS-WEB-0018-A12 | integration | NAMED ONLY | e2e/pages/ueber-uns.spec.ts — outside any test title | With the stats upstream stubbed empty, counter modules are absent from the rendered page and no figure stands in their place (FUN-WEB-0041, FUN-WEB-0196, FUN-WE … |
| TS-WEB-0018-A13 | e2e | MISSING | — | Every internal link resolves inside the TS-WEB-0004 D1 inventory; every help or instruction affordance targets the app host, not a website route. |
| TS-WEB-0018-A14 | manual | MISSING | — | Moment 1 (page-brief review): the SRC-0001 eight-point check plus the four boundary questions are answered and recorded on the brief before content generation s … |
| TS-WEB-0018-A15 | manual | MISSING | — | Moment 2 (content PR review): the four boundary questions are answered for the diff; a "yes" to any of them blocks the merge. |
| TS-WEB-0018-A16 | manual | MISSING | — | Moment 3 (release checklist): rendered `de` and `en` spot check for label and foreign-brand leakage, and a re-read of every guard allow-list entry for a reason  … |
| TS-WEB-0019-A15 | manual | MISSING | — | The eight-point compliance check of SRC-0001 passes for the home brief, with point 8 (stage 0 complete on its own) evidenced by A2 and A11. |
| TS-WEB-0020-A13 | manual | MISSING | — | Content review before shipping: each story reads aspect → why it matters → example → testimonial and names exactly one mechanism (TS-WEB-0006 D7); the state-B c … |
| TS-WEB-0021-A11 | static | NAMED ONLY | src/lib/routes/metadata.test.ts — outside any test title | Canonical is the parameter-free path; title and description come from the page's content frontmatter and contain no runtime value; the JSON-LD graph is `WebPage … |
| TS-WEB-0021-A15 | manual | MISSING | — | Tone review against D9 for audience 3: the reader is addressed directly, a resident who cannot publish is not instructed to, the absence of the place is framed  … |
| TS-WEB-0022-A8 | integration | MISSING | — | Events upstream answering zero dates for the first candidate → the next candidate renders; upstream failing → TS-WEB-0008 D5 tier 2/3 with its freshness label.  … |
| TS-WEB-0022-A10 | e2e | NAMED ONLY | e2e/pages/mitmachen.spec.ts — outside any test title | Stage-0 request (no geo, no referrer, no UTM, no query) and a stage-3 request yield identical block structure, identical block count and identical `focusJob`; o … |
| TS-WEB-0022-A11 | e2e | MISSING | — | The closing CTA carries the same conversion goal ID, target and label as the primary CTA, and its reassurance contains the permanence promise. With the backing  … |
| TS-WEB-0022-A14 | e2e | NAMED ONLY | e2e/pages/mitmachen.spec.ts — outside any test title | With a resolved place the primary CTA's href carries `?ort=<slug>`; with an unresolvable or free-text place it carries no `ort` parameter. |
| TS-WEB-0022-A15 | integration | MISSING | — | Navigating from the primary CTA fires no analytics event on `/mitmachen`; `register-as-publisher` with stage `handover` is emitted on `/mitmachen/registrieren`  … |
| TS-WEB-0023-A3 | e2e | MISSING | — | The URL after step 2, opened in a fresh private window, shows the same step with the same answers; the devtools Application panel shows no cookie and no `localS … |
| TS-WEB-0023-A10 | e2e | MISSING | — | The handover click fires exactly one `register-as-publisher` event with `stage=handover`; no `publish-first-event` event is fired anywhere on the website. |
| TS-WEB-0023-A16 | tool | MISSING | — | axe-core: zero violations on all three steps in all three themes; after each advance focus sits on the new step's heading. |
| TS-WEB-0024-A6 | e2e | NAMED ONLY | e2e/pages/dein-kalender.spec.ts — outside any test title | With the loader host blocked, `data-block="embed-demo"` still renders its copy and a working CTA, shows no empty frame and no error text, and the page height ab … |
| TS-WEB-0024-A7 | e2e | MISSING | — | With the loader allowed, the only third-party script request from this block goes to the allowlisted Portalize host; after full load `document.cookie` is empty  … |
| TS-WEB-0024-A12 | unit | NAMED ONLY | e2e/pages/dein-kalender.spec.ts — outside any test title | With the `run our own calendar` weight profile and a stage-2 trait outside the covered region, a high job-fit proof element outranks a geographically nearer ele … |
| TS-WEB-0024-A17 | e2e | NAMED ONLY | e2e/pages/dein-kalender.spec.ts — outside any test title | The closing CTA carries the same conversion goal id, target and label as the primary CTA and does not use the Pulse fill; the context band names exactly the thr … |
| TS-WEB-0024-A19 | manual | MISSING | — | Every sentence in `data-block="trust"` about operations and AI names a hub record in its `derived_from`. A sentence without one blocks the block from shipping;  … |
| TS-WEB-0025-A5 | integration | NAMED ONLY | e2e/pages/bestellen.spec.ts — outside any test title | The order flow issues **no** request to any ecosystem host and carries no token in the browser: the only network calls from `/dein-kalender/bestellen` are to th … |
| TS-WEB-0025-A9 | e2e | MISSING | — | Network and log trace of a full run: no invoice field value reaches our origin, any Vercel log line, or any analytics payload. |
| TS-WEB-0025-A12 | tool | MISSING | — | axe-core: zero violations on all four steps in light, dark and high contrast, including inside the order form's shadow root. |
| TS-WEB-0025-A13 | manual | MISSING | — | Keyboard-only run through all four steps: every chip is removable, focus moves to the scope-change announcement, invalid invoice fields identify the error in te … |
| TS-WEB-0026-A9 | integration | NAMED ONLY | e2e/pages/deine-region.spec.ts — outside any test title | County examples route returns empty, then 500: the module is absent from the DOM in both cases, with no error styling, warning icon or retry control; the place  … |
| TS-WEB-0026-A11 | integration | NAMED ONLY | e2e/pages/deine-region.spec.ts — outside any test title | Counters render only figures present in the upstream response; a stub omitting the places field omits the county counter entirely and substitutes no number. |
| TS-WEB-0026-A12 | e2e | MISSING | — | The embed demo loads from the allowlisted Portalize host, is labelled as an example and sets no cookie; with the loader blocked the block's copy and CTA stay in … |
| TS-WEB-0026-A16 | static | MISSING | — | Map-readiness: blocks 2 and 3 contain no copy describing the examples as a permanent state, and the interim module is imported in exactly one place, so swapping … |
| TS-WEB-0026-A17 | manual | MISSING | — | Before the page claims the map view as part of the package, the offering owner confirms it is shippable to a buyer. Unconfirmed → the claim is removed, not qual … |
| TS-WEB-0027-A7 | integration | MISSING | — | Fixture with one cleared `type: testimonial` element: the reserved slot is filled and **no** empty slot renders. Fixture with none: 6 filled + 1 empty, and the  … |
| TS-WEB-0027-A10 | e2e | NAMED ONLY | e2e/routes.spec.ts — outside any test title | The newsletter block stands after the team block and before the context band, and carries no `data-cta="primary"`; the page contains exactly one `data-cta="prim … |
| TS-WEB-0027-A11 | e2e | MISSING | — | Stage 0 and stage 1 (geo set) renders have identical block order and both contain the empty slot; only the selection and order of the six filled elements differ … |
| TS-WEB-0027-A14 | e2e | MISSING | — | No layout shift from late content: hero, proof cards and portraits declare `ratio-hero`, `ratio-proof`, `ratio-portrait` before data arrives; measured CLS on th … |
| TS-WEB-0027-A15 | manual | MISSING | — | Photo honesty: every photograph either depicts what its copy claims, or carries the badge "Nicht motivgenau · Platzhalter"; every missing photo is the "Foto ges … |
| TS-WEB-0028-A6 | e2e | MISSING | — | Filtering reorders nothing: the relative order of rows surviving a filter equals their order in the unfiltered list. |
| TS-WEB-0028-A8 | tool | NAMED ONLY | e2e/pages/archiv.spec.ts — outside any test title | Page weight: document ≤ 50 KB compressed; every image response ≤ 100 KB; at most one image request before scroll; no request to any media host; no `<video>`, `< … |
| TS-WEB-0028-A9 | e2e | NAMED ONLY | src/components/archive-filter/archive-filter.test.tsx — outside any test title | With JavaScript disabled every cleared row renders and the chip row is not visible. |
| TS-WEB-0028-A10 | tool | NAMED ONLY | e2e/pages/archiv.spec.ts — outside any test title | JSON-LD parses as one `ItemList`; `itemListElement` count equals the unfiltered visible row count; each item's `publisher` is the outlet and `url` the original. … |
| TS-WEB-0028-A13 | tool | NAMED ONLY | src/components/archive-filter/archive-filter.test.tsx — outside any test title | No layout shift from media: both row variants occupy their final height before images load; CLS measured over load plus three filter interactions stays < 0.1. |
| TS-WEB-0028-A14 | manual | MISSING | — | Three sampled rows: the outbound link opens the original at the outlet, its link text names source and subject, and it carries `rel="noopener"` where it opens i … |
| TS-WEB-0029-A4 | static | MISSING | — | Reordering the registry fixture changes section order but no `id`; renaming a section heading in a fixture changes no `id`. |
| TS-WEB-0029-A12 | tool | NAMED ONLY | e2e/a11y.spec.ts — outside any test title | axe-core: zero violations on the page in all three themes, including nav landmark naming and heading order. |

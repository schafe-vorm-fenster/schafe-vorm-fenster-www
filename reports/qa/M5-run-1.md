# M5 — QA Acceptance Run 1 (final acceptance, complete prototype)

The M5 sweep per `plan/project-plan.md` ("final acceptance over the
complete prototype") and
`.agents/playbooks/playbook-qa-acceptance-run/SKILL.md`: every
acceptance criterion in scope walked at the level its own spec
declares, both locales, on a **production build** in two environments.

Scope: `plan/gate-2-scope.md` — its 333 criteria and its out-of-scope
list are still valid — **plus** the M5 regression over `TS-003` (A1–A8)
and `TS-017` (A1–A17). **358 criteria.** Baseline for every delta:
`reports/qa/gate-2-run-2.md` (264 / 26 / 43).

Skills loaded, all four mandatory ones: `webapp-testing` (every browser
walk in this run is a Playwright-driven session against the production
build), `web-design-guidelines` (the a11y/UX criteria and the keyboard
pass), `semgrep` (important-only over `app/ src/ scripts/`,
self-approved) and `differential-review` (over the M5 fix round,
`32dfab8..HEAD`). **No fix was made anywhere in this run.**

## Environment and evidence commands

| What | Result |
| --- | --- |
| Tree | `next-2026` @ `e14cdca`. The build under test is `414af32`; `e14cdca` changes `state/status.md` and nothing else (`git show --stat`). Two pre-existing working-tree modifications under `concept/` were left untouched |
| Local production build | `pnpm stop; VERCEL_ENV=preview pnpm build && VERCEL_ENV=preview pnpm start` on 3100, with `.next/static/security/csp-script-hashes.json` **removed** before `next start` — `state/open.md` rows 147 and 148, both verified to matter: without `VERCEL_ENV=preview` the D11 gate drops every `draft` artefact, and with the hash asset present nothing hydrates |
| Preview | `https://schafe-vorm-fenster-5jupiff6w-schafe-vorm-fenster.vercel.app`, bypass header from `.env.local`. Confirmed to carry the M5 fixes (English legal notice, 307 hop, archive CLS 0) |
| CSP branch parity | both environments serve the identical `script-src 'self' … 'unsafe-inline'` policy — the `isPreview && !hasHashes` branch, which is what makes the two comparable |
| `pnpm build` | **exit 0** · 320 distinct CSP hashes from 445 inline scripts across 39 pages (run 2: 245 / 374 / 39) · manifest unchanged in shape: two `◐` home entries, six `○` content routes, four `ƒ` (`/dein-ort`, `/dein-ort/starten`, `/mitmachen/registrieren`, `/dein-kalender/bestellen` — open row 131) |
| `pnpm check` | **exit 0** — 9 static guards, 55 static tests, **1073 unit + integration tests (1 skipped)**, typecheck, lint. `check:content` emits 40 dummy-content warnings, `check:specs` the W3 coverage warning. Run 2: 796 tests |
| `pnpm e2e`, local production build | **471 passed · 0 failed · 8 skipped** |
| `pnpm e2e`, preview | **464 passed · 0 failed · 15 skipped** (the 7 `locale-detection` cases need host control and skip off localhost) |
| `e2e/a11y.spec.ts` | 49/49 green in both environments |
| `e2e/privacy.spec.ts` | 25/25 green in both environments |
| `e2e/layout-stability.spec.ts` | 39/39 green in both environments |
| `e2e/content-compliance.spec.ts` | 56/56 · `e2e/metadata-compliance.spec.ts` 49/49 · `e2e/routes.spec.ts` 67/67 · `e2e/smoke.spec.ts` 10/10 — all green in both |
| axe-core, three themes | own sweep, 24 routes × 3 themes at 360 px (light, `prefers-color-scheme: dark`, `prefers-contrast: more`), WCAG 2.1 A/AA tags: **0 violations of any impact** in all three. With axe's experimental `label-content-name-mismatch` enabled: **48 serious nodes**, 2 per route, in every theme → **F-3-1** |
| Lighthouse, preview | mobile `/` 96 · `/dein-ort` 100 · `/dein-kalender` 98 · `/mitmachen` 98 · `/ueber-uns` 97 · `/ueber-uns/archiv` 98 · `/mitmachen/registrieren` 100. Desktop 100 on all five D7 routes. **Accessibility 100 on all 12 runs.** Best-practices 92 and SEO 69 everywhere — the SEO deduction is the preview's own `noindex` (TS-015-A1), the best-practices one the `vercel.live` CSP block (F-2-27) |
| Lighthouse, local production build | mobile `/` 93 · `/dein-kalender` 93 · `/mitmachen` 95 · `/ueber-uns` 96 · `/dein-ort` 97 → **F-3-3** |
| CLS sweep, 24 routes × 2 viewports, `PerformanceObserver` | local worst **0.0006**, preview worst **0.0007**. `/ueber-uns/archiv` at 360 px: **0.0000** (run 2: 0.2197) |
| Browser sweep, 24 routes × 2 viewports × 2 environments (96 page loads) | no horizontal scroll anywhere; exactly one `<h1>` everywhere; `<aside id="context-band">` on 22 of 24 routes; console errors: **0** local, 48 preview (all F-2-27) |
| Keyboard pass | 9 surfaces, **242 tab stops**, 0 without a ≥ 2 px focus indicator (the compound search field draws `3px solid rgb(83,27,222)` at `2px` offset on `.field:focus-within`) |
| Conversion-path walks | all five wired goals in German at 360 px, plus `/en/your-place` and `/en/take-part` in English, in a real browser against the production build |
| `semgrep` important-only, `app/ src/ scripts/` | 30 scans, 10 rulesets per path · **6 findings, 0 true positives** |
| `differential-review`, `32dfab8..HEAD` | 97 files, +3764 / −215 · 0 critical, 0 high, 2 medium, 2 low from the tool; one of its two mediums did not reproduce when executed (F-3-6) |

## Conversion-path walks — measured, not asserted

| Goal | Walk | Result |
| --- | --- | --- |
| `save-calendar-to-homescreen` | `/` → type `07743` → `/dein-ort?ort=07743` → app link | 2 app links, target `https://app.schafe-vorm-fenster.de/beispielwalde`, **one** `save-calendar-to-homescreen / handover` |
| `register-as-publisher` | `/mitmachen` → `/mitmachen/registrieren` → 3 steps → handover | steps resolve `?ort=07743` to `beispielwalde`, handover target `https://app.schafe-vorm-fenster.de/registrieren`, **one** `register-as-publisher / handover` |
| `request-product-briefing` | `/dein-kalender` → briefing link | both placements resolve to the one configured `calendar.app.google/VG9bZoYVnFcX1W6F8`, **one** `request-product-briefing / handover` |
| `buy-calendar-licence` | `/dein-kalender/bestellen?kreis=musterkreis` → steps 2 → 3 → 4 | reaches step 4 with the embed snippet and the `Demo-Daten` badge, **one** `buy-calendar-licence / completed`, **still one** after Back → Forward |
| `request-licence-quote` | `/deine-region/angebot` → fill → submit | `[data-envoy-state="sent"]` with "Danke — deine Anfrage ist angekommen", **one** `request-licence-quote / completed`; same on `/en/your-region/quote`; a filled honeypot is accepted silently and fires **none** |
| EN repeat 1 | `/en/your-place?ort=07743` | `lang="en"`, English chrome and labels ("NOT AN EXACT MATCH · PLACEHOLDER", "DEMO DATA", "CULTURE", "OFFICIAL") |
| EN repeat 2 | `/en/take-part` | `lang="en"`, English copy throughout ("PHOTO WANTED", "Sign up for free") |

Zero external requests left the origin in any walk.

## The `/en/*` sweep — the Customer's blind spot, swept explicitly

All twelve English routes were fetched and rendered separately, not as
a by-product of a bilingual assertion.

| Check | Result |
| --- | --- |
| German dummy-content labels (`Demo-Daten`, `Foto gesucht`, `Nicht motivgenau`, `Platzhalter`) | **0 hits on all twelve** — F-2-33's tail is closed |
| English equivalents present | "Demo data", "Photo wanted", "Not an exact match · Placeholder" on the routes that carry a marked slot |
| `<html lang>` | `en` on all twelve |
| Header | logo → `/en`, four job labels translated, persistent "Calendar" → `/en/your-place` |
| Language switch | correct equivalent page from every route, both directions (`/en/your-region/quote` ↔ `/deine-region/angebot`, `/en/about/archive` ↔ `/ueber-uns/archiv`), never the home page |
| `?ort=` hop | `/en/your-place/start?ort=beispielwalde` → 307 `/en/your-place?ort=…`; `/en/your-place?ort=99999` → 307 `/en/your-place/start?ort=…` |
| 404 | `/en/does-not-exist` → 404, `lang="en"`, full 11 180-byte body |
| `/en/legal` | English section headings and an English notice that the legal texts are German only (F-2-74); the bodies are still German and `content/legal/<locale>/` still does not exist (F-2-46) |
| Residue found | the founder photo's `alt` is German on `/en/about` and `/en/about/archive` → **F-3-5** |
| Order-flow plural | "1 places selected" → F-2-53, unchanged |

## Verdicts per criterion

The `Run 2` column is `reports/qa/gate-2-run-2.md`'s verdict, so every
changed row is visible without diffing two files. Rows whose evidence
is a green suite name it; rows this run measured by hand carry the
measurement.

### TS-004 — URL and routing

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | integration | pass | **pass** | `e2e/routes.spec.ts` green in both environments |
| A2 | integration | pass | **pass** | green in `pnpm check` / `pnpm e2e` |
| A3 | integration | pass | **pass** | green in `pnpm e2e` (landing-host cases) |
| A4 | integration | pass | **pass** | measured: `/irgendwas` 404 · 11 256 bytes · `lang="de"` · `<h1>Seite nicht gefunden</h1>` · place-search form to `/dein-ort`; `/en/does-not-exist` 404 · `lang="en"`; both complete without JavaScript (`routes.spec.ts` no-JS cases green) |
| A5 | integration | pass | **pass** | green in `pnpm e2e` |
| A6 | e2e | pass | **pass** | 96 page loads across two environments: every request went to the origin. Vacuous in the same way as before — envoy/Portalize/eTracker issue no client request |
| A7 | integration | pass | **pass** | code read + curl against :3100 |
| A8 | e2e | pass | **pass** | `#privacy`, `#imprint`, `#data-processing`, `#accessibility` present on `/en/legal` |
| A9 | integration | pass | **pass** | code read + curl against :3100 |
| A10 | static | pass | **pass** | `pnpm check:api-routes` green |
| A11 | integration | not-testable | **not-testable** | `/{community}` forwarding is not built — the criterion prescribes the skip |

### TS-006 — Page composition

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | green in `pnpm check` |
| A2 | static | pass | **pass** | green in `pnpm check` |
| A3 | e2e | pass | **pass** | green in `pnpm e2e` |
| A4 | e2e | pass | **pass** | green in `pnpm e2e`; re-walked at 360 px on `/` and `/en/your-place` |
| A5 | e2e | pass | **pass** | green in `pnpm e2e` |
| A6 | e2e | fail | **fail** | measured: band present on step 1, absent on `?ort=…` (step 2 of 3) and on `?ort=…&wer=…` (step 3 of 3) → F-2-10, recorded not re-filed |
| A7 | e2e | pass | **pass** | green in `pnpm e2e` |
| A8 | static | fail | **fail** | generic-claims term list still does not exist → F-2-43 |
| A9 | static | pass | **pass** | green in `pnpm check` |
| A10 | e2e | pass | **pass** | green in `pnpm e2e` |
| A11 | static | pass | **pass** | green in `pnpm check` |
| A12 | static | pass | **pass** | green in `pnpm check` |
| A13 | e2e | not-testable | **not-testable** | the two-working-day wording stays withheld while C11/Q-022 is unsigned |
| A14 | manual | not-testable | **not-testable** | SRC-001's eight-point check is not reachable from this repository → F-2-18 |
| A15 | e2e | pass | **pass** | green in `pnpm e2e` |

### TS-002 — Accessibility

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | tool | not-testable | **fail** | **decidable for the first time, and it fails.** Own sweep, 24 routes × 3 themes: 0 violations under axe's default rules, but `label-content-name-mismatch` (serious, WCAG 2.1 SC 2.5.3) reports **48 nodes** in every theme → **F-3-1**. The dark theme remains vacuous — the site is light-only by declaration (`app/styles/base.css: color-scheme: light`, open row 142) — but one reachable theme with a serious violation already decides the criterion |
| A2 | tool | pass | **pass** | Lighthouse accessibility **100** on all 12 runs, mobile and desktop, preview |
| A3 | static | pass | **pass** | `pnpm check:contrast` green — 68 token pairs × 4 themes |
| A4 | manual | not-testable | **not-testable** | keyboard pass walked 9 surfaces / 242 tab stops with no trap and a ring on every stop, but no per-release walkthrough record of all four jobs exists |
| A5 | manual | not-testable | **not-testable** | no VoiceOver/NVDA available to this run |
| A6 | tool | not-testable | **not-testable** | the real envoy widget is undelivered (Q-022) |
| A7 | e2e | pass | **pass** | `smoke.spec.ts` 320 px case green in both environments; own sweep confirms `scrollWidth == clientWidth` on 96 loads |
| A8 | integration | pass | **pass** | code read + curl against :3100 |
| A9 | e2e | pass | **pass** | green in `pnpm e2e` |
| A10 | static | pass | **pass** | `pnpm check:brand` green |
| A11 | tool | pass | **pass** | axe `image-alt` clean on 24 routes × 3 themes |
| A12 | manual | pass | **pass** | `content/legal/accessibility.md` names self-assessment and claims no audit |

### TS-001 — Locale routing

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | integration | pass | **pass** | green in `pnpm check` |
| A2 | integration | pass | **pass** | green in `pnpm check` |
| A3 | integration | pass | **pass** | `/de/…` → bare path, asserted green; measured `/de/mitmachen` 301 |
| A5 | integration | pass | **pass** | green in `pnpm check` |
| A6 | integration | pass | **pass** | green in `pnpm check` |
| A7 | e2e | pass | **pass** | measured on 8 routes both directions: the switch always targets the equivalent page, never the home page |
| A8 | integration | pass | **pass** | green in `pnpm check` |
| A10 | integration | pass | **pass** | green in `pnpm check` |
| A11 | static | pass | **pass** | green in `pnpm check` |

### TS-019 — / (home)

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | guard/manifest read; `pnpm check` green |
| A2 | e2e | pass | **pass** | green in `pnpm e2e` |
| A3 | e2e | pass | **pass** | **improved**: `/?ort=07743` now server-renders Beispielwalde on a production build — run 2's "client patch" residual is gone |
| A4 | e2e | pass | **pass** | `/dein-ort?ort=38165` renders the no-dates state with "Ersten Termin veröffentlichen" |
| A5 | e2e | pass | **pass** | browser walk at 360 px: `99999` lands on `/dein-ort/starten?ort=99999` |
| A6 | e2e | pass | **pass** | green in `pnpm e2e` |
| A7 | e2e | not-testable | **not-testable** | personalization stage 2 never fires → F-2-14 |
| A8–A11 | e2e | pass | **pass** | green in `pnpm e2e` |
| A12 | static | pass | **pass** | green in `pnpm check` |
| A13, A14 | e2e | pass | **pass** | green in `pnpm e2e`; A13's conversion event re-measured by hand |
| A15 | manual | not-testable | **not-testable** | SRC-001's eight-point check → F-2-18 |

### TS-020 — /dein-ort

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | guard/manifest read |
| A2–A4 | e2e | pass | **pass** | green in `pnpm e2e` |
| A5 | static | fail | **fail** | the stories still carry no `proof_ref` → F-2-43 (TS-005-A15) |
| A6, A7 | e2e | pass | **pass** | green in `pnpm e2e` |
| A8 | integration | not-testable | **not-testable** | emission goes to `createMockTracker()` by decision |
| A9, A10 | e2e | pass | **pass** | green in `pnpm e2e` |
| A11 | integration | pass | **pass** | green in `pnpm check` |
| A12 | e2e | not-testable | **not-testable** | the BFF-delay harness is a skipped case; with no skeletons (F-2-39) the counter branches do not exist |
| A13 | manual | not-testable | **not-testable** | no content/tone review record exists for this run |

### TS-021 — /dein-ort/starten

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | guard/manifest read |
| A2 | e2e | fail | **fail** | still a dynamic route against TS-021 D10 → F-2-13, recorded not re-filed |
| A3–A5 | e2e | pass | **pass** | green in `pnpm e2e` |
| A6 | integration | pass | **pass** | `/dein-ort?ort=99999` → 307 `/dein-ort/starten?ort=99999` on the **production build** |
| A7 | integration | fail | **pass** | **F-2-49 resolved.** Production build, local and preview: `/dein-ort/starten?ort=beispielwalde` → **307** `/dein-ort?ort=beispielwalde`; `/en/your-place/start?ort=beispielwalde` → 307 `/en/your-place?ort=…`. The hop moved into `proxy.ts` |
| A8 | integration | not-testable | **not-testable** | the place-search upstream is a declared mock |
| A9, A10 | e2e | pass | **pass** | green in `pnpm e2e` |
| A11 | static | fail | **pass** | **F-2-72 resolved.** `<title>Kalender für deinen Ort starten — Schafe vorm Fenster</title>` and its English twin come from the content frontmatter, not the placeholder dictionary; `e2e/metadata-compliance.spec.ts` 49/49 |
| A12–A14 | e2e | pass | **pass** | green in `pnpm e2e` |
| A15 | manual | not-testable | **not-testable** | no content/tone review record exists for this run |

### TS-022 — /mitmachen

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | guard/manifest read |
| A2–A6 | e2e | pass | **pass** | green in `pnpm e2e` |
| A7 | unit | pass | **pass** | green in `pnpm check` |
| A8 | integration | not-testable | **not-testable** | neither branch reachable — events-api is a declared mock |
| A9–A11 | e2e | pass | **pass** | green in `pnpm e2e`; A11 re-read at 360 px |
| A12 | static | pass | **pass** | green in `pnpm check` |
| A13, A14, A16 | e2e | pass | **pass** | green in `pnpm e2e` |
| A15 | integration | pass | **pass** | code read + curl against :3100 |

### TS-023 — /mitmachen/registrieren

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1, A2 | e2e | pass | **pass** | green in `pnpm e2e` |
| A3 | e2e | pass | **pass** | the step URL reopened in a fresh context shows the same step; no cookie, no storage entry |
| A4 | unit | pass | **pass** | green in `pnpm check` |
| A5 | integration | pass | **pass** | green in `pnpm check` |
| A6 | e2e | pass | **pass** | green in `pnpm e2e` |
| A7 | e2e | pass | **pass** | `?ort=07743` resolves to "Dein Ort: Beispielwalde" with an "Ort ändern" control |
| A8, A9 | e2e | pass | **pass** | green in `pnpm e2e` |
| A10 | e2e | pass | **pass** | browser walk: exactly one `register-as-publisher / handover` on the handover click, none of `publish-first-event` |
| A11 | e2e | pass | **pass** | green in `pnpm e2e` |
| A12 | static | pass | **pass** | green in `pnpm check` |
| A13–A15 | e2e | pass | **pass** | green in `pnpm e2e` |
| A16 | tool | not-testable | **not-testable** | the axe sweep now covers three themes but still not the flows' later steps or a shadow root → F-2-58 |

### TS-024 — /dein-kalender

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | guard/manifest read |
| A2–A6 | e2e | pass | **pass** | green in `pnpm e2e` |
| A7 | e2e | not-testable | **not-testable** | "with the loader allowed" cannot be exercised — no third-party script request is made at all → F-2-15 |
| A8–A10 | e2e | pass | **pass** | green in `pnpm e2e` |
| A11 | static | pass | **pass** | green in `pnpm check` |
| A12 | unit | pass | **pass** | green in `pnpm check` |
| A13–A17 | e2e | pass | **pass** | green in `pnpm e2e`; A17 re-read at 360 px |
| A18 | static | pass | **pass** | green in `pnpm check` |
| A19 | manual | pass | **pass** | `dein-kalender-6-trust` carries `derived_from: [ia]`; no unconfirmed claim |

### TS-025 — /dein-kalender/bestellen

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | guard/manifest read |
| A2–A4 | e2e | pass | **pass** | green in `pnpm e2e` |
| A5 | integration | pass | **pass** | green in `pnpm check` |
| A6–A8 | e2e | pass | **pass** | green in `pnpm e2e`; the four-step walk re-performed by hand |
| A9 | e2e | pass | **pass** | sentinel-filled invoice fields: no value reached the origin, any log line or any analytics payload |
| A10 | integration | pass | **pass** | green in `pnpm check` |
| A11 | e2e | pass | **pass** | browser walk on the production build: exactly one `buy-calendar-licence / completed`, still one after Back → Forward |
| A12 | tool | not-testable | **not-testable** | the flow's later steps and the shadow root stay unswept → F-2-58 |
| A13 | manual | not-testable | **not-testable** | no screen reader available |
| A14 | e2e | pass | **pass** | green in `pnpm e2e` |

### TS-026 — /deine-region (+ /angebot)

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1–A3 | e2e | pass | **pass** | green in `pnpm e2e` |
| A4 | static | pass | **pass** | green in `pnpm check` |
| A5–A7 | e2e | pass | **pass** | green in `pnpm e2e` |
| A8 | static | fail | **fail** | `pnpm check:terms` is written, red on three module lines, and still absent from the `pnpm check` chain (verified in `package.json`) → open row 143 |
| A9 | integration | pass | **pass** | green in `pnpm check` |
| A10 | e2e | pass | **pass** | block 3 at stage 0 asserts no county and shows no `geoname.*` |
| A11 | integration | pass | **pass** | green in `pnpm check` |
| A12 | e2e | fail | **fail** | the embed demo still never requests the Portalize host → F-2-15 |
| A13 | e2e | pass | **pass** | measured by hand in DE and EN: one `request-licence-quote / completed`, no field value in the payload; a filled honeypot fires none |
| A14 | e2e | pass | **pass** | green in `pnpm e2e` |
| A15 | static | pass | **pass** | green in `pnpm check` |
| A16 | static | pass | **pass** | guard/manifest read |
| A17 | manual | pass | **pass** | the map claim stays out of the claim set |

### TS-027 — /ueber-uns

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | green in `pnpm check` |
| A2–A6 | e2e | pass | **pass** | green in `pnpm e2e` |
| A7 | integration | not-testable | **not-testable** | needs two content fixtures; no fixture seam exists |
| A8–A10 | e2e | pass | **pass** | green in `pnpm e2e` |
| A11 | e2e | not-testable | **not-testable** | stage 1 is unreachable in the running app (`GEO_STAGE1_SOURCE` off) |
| A12 | static | pass | **pass** | green in `pnpm check` |
| A13 | integration | pass | **pass** | code read + curl against :3100 |
| A14 | e2e | pass | **pass** | `e2e/layout-stability.spec.ts` green; own CLS measurement on `/ueber-uns` at 360 px: 0.0000 |
| A15 | manual | pass | **pass** | every photo carries its placeholder mark; the `Foto gesucht` / "Photo wanted" surfaces are present in both locales |

### TS-028 — /ueber-uns/archiv

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | e2e | pass | **pass** | green in `pnpm e2e` |
| A2 | static | pass | **pass** | green in `pnpm check` |
| A3 | e2e | pass | **pass** | green in both environments — the hydration race of F-2-71 is gone |
| A4–A6 | e2e | pass | **pass** | green in `pnpm e2e` |
| A7 | integration | not-testable | **not-testable** | the media-echo pipeline has zero cleared entries (Q-045) |
| A8 | tool | pass | **pass** | green in `pnpm e2e` |
| A9 | e2e | pass | **pass** | JavaScript disabled: all six cleared rows render |
| A10–A12 | e2e/tool | pass | **pass** | green in `pnpm e2e` |
| A13 | tool | fail | **pass** | **F-2-69 resolved.** CLS **0.0000** at 360 px on load and through the filter interactions (was 0.2197); Lighthouse mobile CLS 0 on the same route |
| A14 | manual | fail | **fail** | no archive row carries an outbound link → F-2-47 |

### TS-029 — /rechtliches

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1, A2 | integration | pass | **pass** | green in `pnpm check` |
| A3 | e2e | pass | **pass** | green in `pnpm e2e` |
| A4 | static | pass | **pass** | guard/manifest read |
| A5–A9 | e2e | pass | **pass** | green in `pnpm e2e` |
| A10 | integration | pass | **pass** | green in `pnpm check` |
| A12 | tool | not-testable | **fail** | same instrument as TS-002-A1, same result: the three-theme sweep now runs and `/rechtliches` carries the two `label-content-name-mismatch` nodes in all three themes → **F-3-1** |
| A13 | e2e | pass | **pass** | green in `pnpm e2e` |
| A14 | integration | fail | **fail** | heading scan of `/rechtliches` and `/en/legal`: one `h4 → h6` skip at the same position in both → F-2-19 |

### TS-007 — Content pipeline

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | unit | pass | **pass** | green in `pnpm check` |
| A2 | tool | pass | **pass** | green in `pnpm check` |
| A3 | tool | not-testable | **not-testable** | no clearance check exists → F-2-18 |
| A4 | integration | fail | **fail** | `check:content` is still not a build step and no clearance check exists → F-2-43 |
| A5 | tool | pass | **pass** | green in `pnpm check` |
| A6 | unit | not-testable | **not-testable** | facet completeness is "partial" → F-2-18 |
| A7 | unit | pass | **pass** | green in `pnpm check` |
| A8 | static | pass | **pass** | green in `pnpm check` |
| A9 | unit | not-testable | **not-testable** | harmonisation is "partial" → F-2-18 |
| A10 | tool | pass | **pass** | green in `pnpm check` |
| A11 | integration | fail | **fail** | `content/legal/<locale>/` does not exist (`ls content/legal/` — seven flat files) → F-2-46. The visitor-facing half improved: `/en/legal` now carries English headings and an English notice (F-2-74) |
| A12 | integration | pass | **pass** | green in `pnpm check` |
| A13 | tool | not-testable | **not-testable** | no glossary lint exists → F-2-18 |
| A14 | integration | pass | **pass** | `VERCEL_ENV=production pnpm check:content` exits non-zero on the first `draft`; this run's own build is the counter-proof — with `VERCEL_ENV=preview` every page renders its copy |
| A15 | manual | not-testable | **not-testable** | no bumped package version to dry-run P7 against |
| A16 | tool | not-testable | **not-testable** | no segment-independence lint exists → F-2-18 |

### TS-005 — Relevance engine

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1–A8 | unit/integration | pass | **pass** | green in `pnpm check` |
| A9 | integration | fail | **fail** | `grep -ci skeleton` = 0 on all 24 rendered routes → F-2-39, open row 145 |
| A10 | e2e | pass | **pass** | green in `pnpm e2e` |
| A11–A14 | unit/e2e | pass | **pass** | green in `pnpm check` / `pnpm e2e` |
| A15 | static | fail | **fail** | no `claims` key, no proof resolution in `validate.ts` → F-2-43 |
| A16 | unit | pass | **pass** | green in `pnpm check` |

### TS-008 — Live data

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | green in `pnpm check` |
| A2, A3 | unit | pass | **pass** | green in `pnpm check` |
| A4, A5 | integration | pass | **pass** | green in `pnpm check` |
| A6 | e2e | pass | **pass** | `/dein-ort?ort=38165` on the production build: primary CTA "Ersten Termin veröffentlichen" → `/mitmachen/registrieren?ort=beispielhausen` |
| A7 | e2e | pass | **pass** | the uncovered search lands on `/dein-ort/starten` |
| A8 | e2e | fail | **fail** | zero requests to the Portalize host → F-2-15 |
| A9 | integration | pass | **pass** | green in `pnpm check` |
| A10 | static | pass | **pass** | green in `pnpm check` |
| A11 | unit | pass | **pass** | green in `pnpm check` |
| A12 | manual | not-testable | **not-testable** | the Portalize embed is not wired → F-2-15 |
| A13 | tool | pass | **pass** | green in `pnpm check` |
| A14 | integration | pass | **pass** | green in `pnpm check` |

### TS-009 — Rendering and resilience

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | `pnpm build` exit 0 with `cacheComponents: true` |
| A2 | tool | fail | **fail** | four routes remain `ƒ` → F-2-56, settled as intended by open row 131, so the criterion cannot pass as written |
| A3 | integration | fail | **fail** | zero skeletons in any page's HTML → F-2-39, open row 145 |
| A4 | unit | pass | **pass** | `resilient.test.ts`, 13 cases, green |
| A5 | integration | pass | **pass** | green in `pnpm check` |
| A6, A7 | e2e | pass | **pass** | `resilience.integration.test.ts` and `bff-stats-cold-cache.integration.test.ts` green; measured at integration level, which is where the outage harness lives |
| A8 | tool | fail | **pass** | **F-2-69 resolved.** Own CLS sweep, 24 routes × 2 viewports × 2 environments: worst **0.0006** local, 0.0007 preview; `e2e/layout-stability.spec.ts` 39/39 in both; Lighthouse mobile CLS 0–0.015 |
| A9 | integration | fail | **fail** | `moduleSkeleton()` still has no call site → F-2-39 |
| A10 | unit | pass | **pass** | green in `pnpm check` |
| A11 | integration | pass | **pass** | green in `pnpm check` |
| A12 | tool | pass | **pass** | green in `pnpm check` |
| A13 | manual | not-testable | **not-testable** | no screen reader; and no skeleton renders anywhere |

### TS-010 — Personalization

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1–A3 | unit | pass | **pass** | green in `pnpm check` |
| A4 | integration | pass | **pass** | code read + curl against :3100 |
| A5 | integration | fail | **fail** | one `EmptyProofSlot` at stage 0 on `/mitmachen` and `/ueber-uns` → F-2-52 (spec against spec) |
| A6 | integration | pass | **pass** | code read + curl against :3100 |
| A7 | e2e | pass | **pass** | 24 routes: no select, no top-level radio group, no "who are you" copy |
| A8 | e2e | not-testable | **not-testable** | the D5 explicit control is not built, so the prompt and denial clauses have no trigger |
| A9 | tool | pass | **pass** | green in `pnpm check` |
| A10 | unit | pass | **pass** | green in `pnpm check` |
| A11 | static | pass | **pass** | guard/manifest read |
| A12 | e2e | pass | **pass** | `e2e/privacy.spec.ts` 25/25 in both environments; own sweep: zero cookies, empty storage |
| A13 | e2e | not-testable | **not-testable** | the language suggestion is not built in phase 1 |
| A14 | e2e | pass | **pass** | green in `pnpm e2e` |
| A15 | manual | not-testable | **not-testable** | no Q-008 sign-off record exists in this repository |

### TS-011 — SEO

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | green in `pnpm check` |
| A2 | integration | pass | **pass** | green in `pnpm check` |
| A3 | tool | fail | **fail** | one `h4 → h6` skip inside the privacy policy on both locales (F-2-19); one `main` and one `h1` verified on all 24 routes × 2 viewports; still no HTML-validator run |
| A4 | integration | fail | **fail** | **narrowed**: `<aside id="context-band">` now on 22 of 24 routes (run 2: 14). Absent on `/dein-kalender/bestellen` and `/en/your-calendar/order`, which render no band, and on registration steps 2–3 (F-2-10). "on every page" is not met → F-2-41 |
| A5 | tool | not-testable | **not-testable** | schema.org validator / Rich Results Test not run in this environment |
| A6 | static | pass | **pass** | guard/manifest read |
| A7 | static | pass | **pass** | `pnpm check:seo-budget` green |
| A8 | integration | fail | **fail** | `grep -c og:image` = 0 on all 24 routes → F-2-42 |
| A9 | e2e | fail | **fail** | no page emits an OG image, so the criterion has no subject → F-2-42 |
| A10 | integration | pass | **pass** | green in `pnpm check` |
| A11 | static | pass | **pass** | guard/manifest read |
| A12 | manual | not-testable | **not-testable** | no interest landing page exists |
| A13 | manual | not-testable | **not-testable** | post-cutover Search Console observation; nothing is launched |
| A14 | integration | pass | **pass** | green in `pnpm check` |

### TS-012 — Analytics

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | green in `pnpm check` |
| A2 | e2e | pass | **pass** | green in `pnpm e2e` |
| A3 | static | pass | **pass** | green in `pnpm check` |
| A4 | unit | pass | **pass** | green in `pnpm check` |
| A5 | e2e | pass | **pass** | own walk on the production build: step 3 → 4 → Back → Forward fires `buy-calendar-licence` exactly once |
| A6 | e2e | pass | **pass** | green in `pnpm e2e` |
| A7 | integration | pass | **pass** | code read + curl against :3100 |
| A8 | tool | not-testable | **not-testable** | `EtrackerLoader` is never imported; the tracker is the mock adapter (open row 83) |
| A9 | static | pass | **pass** | green in `pnpm check` |
| A10 | manual | not-testable | **not-testable** | same reason as A8 |
| A11 | static | pass | **pass** | green in `pnpm check` |

### TS-013 — Privacy (A1–A3, A5; A4/A6–A8 out of scope, §4)

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | e2e | pass | **pass** | `e2e/privacy.spec.ts` 25/25 in both environments |
| A2 | e2e | pass | **pass** | 25/25 in both environments |
| A3 | static | pass | **pass** | green in `pnpm check` |
| A5 | integration | pass | **pass** | green in `pnpm check` |

### TS-016 — Forms and leads

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | guard/manifest read |
| A2 | integration | pass | **pass** | one `form[data-envoy-form-kind="quote"]` per surface |
| A3 | e2e | pass | **pass** | sentinel-filled quote fields: zero external requests, no sentinel in any URL, console line or analytics payload |
| A4 | static | not-testable | **not-testable** | the widget contract's variable set is UNKNOWN (Q-022) |
| A5 | e2e | pass | **pass** | every S3 placement resolves to the one configured briefing URL |
| A6 | e2e | pass | **pass** | own four-step walk: briefing exit visible on each step, step 4 shows a copyable snippet, zero payment fields, no payment host in any request or in the CSP |
| A7 | static | fail | **fail** | no archive row renders a preview image or an outbound link → F-2-47 |
| A8 | tool | not-testable | **not-testable** | the flows' later steps and the shadow root stay unswept → F-2-58 |
| A9 | manual | not-testable | **not-testable** | no screen reader available |
| A10 | integration | pass | **pass** | measured: a filled honeypot is silently accepted and fires no conversion event; the ~2 s timing gate holds |
| A11 | integration | pass | **pass** | green in `pnpm check` |
| A12 | e2e | pass | **pass** | S2/S3 fire once and carry no field values; S4 fires once across Back/Forward |
| A13 | manual | pass | **pass** | the two-working-day promise stays removed rather than softened |
| A14 | e2e | not-testable | **not-testable** | there is no widget script to block — the mount is a server-rendered mock |

### TS-014 — Security (sweep scope)

| AC | Level | Run 2 | M5 run 1 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | `scripts/check-csp.ts` runs inside `pnpm check` and is green |
| A2 | integration | pass | **pass** | `e2e/smoke.spec.ts:160` and `:252` green in both environments; both environments serve the identical directive set. Preview `'unsafe-inline'` = F-2-27, recorded |

### TS-003 — Performance (M5 regression, new to this run)

| AC | Level | M5 run 1 | Evidence |
| --- | --- | --- | --- |
| A1 | tool | **fail** | mobile Lighthouse below D7's 98 floor on `/` (96) and `/ueber-uns` (97) on the preview, and on all five D7 routes against the local production build (93–97). Desktop 100 on all five → **F-3-3** |
| A2 | tool | **not-testable** | no bundle guard exists and there is no run summary to write measured first-load bytes into. The CI job that would host it is TS-015-A9, kept out of scope by `plan/gate-2-scope.md` §4 → open point |
| A3 | static | **fail** | six static latin `woff2` faces (67.5 KB), not one variable file; **no font preload** on any route (the only `rel="preload"` is a script); `font-display: swap` on all six is correct. Open rows 19 and 20 cover the size and the variable-build halves; the *preload* clause is unmet and is not on either row |
| A4 | e2e | **not-testable** | no e2e simulated-outage harness exists. The tiering it would exercise is covered at integration level (`resilience.integration.test.ts`, `bff-stats-cold-cache.integration.test.ts`) and by `resilient.test.ts`'s 13 unit cases, all green — but that is not the criterion's level, and "every page" is not walked |
| A5 | tool | **pass** | vacuously and verifiably: across 96 page loads in two environments neither `code.etracker.com` nor the envoy host was requested at all, so neither can sit in the LCP element's critical chain |
| A6 | e2e | **fail** | `Save-Data: on` produces a byte-identical response and the identical image URL — 0 % saved → **F-3-4** |
| A7 | tool | **pass** | CLS < 0.1 on every content page with all islands streaming: worst measurement anywhere is 0.0006 (local) / 0.0007 (preview); Lighthouse mobile 0–0.015, desktop 0–0.012 |
| A8 | static | **fail** | zero `loading="eager"` and zero `fetchpriority="high"` in the whole tree; `/ueber-uns`'s declared LCP image carries `loading="lazy"`; `/` and `/dein-ort` paint an undeclared image above the fold as the measured LCP element → **F-3-2** |

### TS-017 — Technical foundation (M5 regression, new to this run)

| AC | Level | M5 run 1 | Evidence |
| --- | --- | --- | --- |
| A1 | static | **pass** | `pnpm check:stack`: 10 runtime dependencies · 10 register entries · 22 deny-set entries · no errors |
| A2 | static | **pass** | `pnpm-lock.yaml` is the only lockfile; `packageManager: pnpm@10.26.0`; `.npmrc` maps `@schafe-vorm-fenster` to `npm.pkg.github.com` |
| A3 | static | **pass** | root `tsconfig.json` `strict: true`; `pnpm typecheck` runs inside `pnpm check` and exits 0 |
| A4 | static | **pass** | `pnpm check:brand` green |
| A5 | static | **pass** | `pnpm check:brand` green |
| A6 | static | **pass** | `pnpm check:brand` green |
| A7 | static | **pass** | `@schafe-vorm-fenster/brand-design` pinned `0.1.3` exact; lockfile resolves the same version |
| A8 | e2e | **pass** | `e2e/smoke.spec.ts:57` green in both environments |
| A9 | e2e | **pass** | `smoke.spec.ts:75/90/101` green in both; own sweep confirms no horizontal scroll on 96 loads at 360 and 1280 |
| A10 | static | **pass** | `pnpm check:api-routes` green |
| A11 | static | **pass** | `pnpm check:api-routes` green |
| A12 | integration | **pass** | measured on all 24 routes: the persistent calendar button is in the header everywhere and resolves to `/dein-ort` (`/en/your-place` in English), translated as "Kalender" / "Calendar" |
| A13 | tool | **pass** | `pnpm check` exit 0, zero E-class errors (40 content warnings, one specs warning) |
| A14 | static | **pass** | `pnpm check:frontmatter` green |
| A15 | manual | **not-testable** | no per-release imagery review by the brand owner exists for this run |
| A16 | manual | **not-testable** | no per-PR dependency review record exists |
| A17 | static | **pass** | exactly one icon dependency (`lucide-react`), asserted by `check:stack` |

## Counts

| | Gate 2 run 2 | M5 run 1 | Delta |
| --- | --- | --- | --- |
| **pass** | 264 | **285** | **+21** |
| **fail** | 26 | **28** | **+2** |
| **not-testable** | 43 | **45** | **+2** |
| **total in scope** | 333 | **358** | +25 |

On the **common 333** the delta is pass **+4**, fail **−2**,
not-testable **−2**. The 25 added criteria (TS-003 + TS-017) contribute
17 pass, 4 fail, 4 not-testable.

Movements, every one of them:

| AC | Run 2 | M5 run 1 | Why |
| --- | --- | --- | --- |
| TS-021-A7 | fail | **pass** | F-2-49 resolved — the 307 hop now happens in `proxy.ts`, before the render |
| TS-021-A11 | fail | **pass** | F-2-72 resolved — titles and descriptions come from the content frontmatter |
| TS-009-A8 | fail | **pass** | F-2-69 resolved — worst CLS anywhere is 0.0007 |
| TS-028-A13 | fail | **pass** | F-2-69 resolved — `/ueber-uns/archiv` CLS 0.2197 → 0.0000 |
| TS-002-A1 | not-testable | **fail** | the three-theme sweep finally ran, and found a serious violation on every page → F-3-1 |
| TS-029-A12 | not-testable | **fail** | same instrument, same result |

Two verdicts moved the wrong way, and both for the same honest reason
run 2 recorded for TS-009-A8: a criterion that had no instrument got
one, and the instrument found something. Nothing regressed.

## The 28 fails, by owner

| AC(s) | Finding | Why it is open |
| --- | --- | --- |
| TS-006-A6 | F-2-10 | spec against spec, open list by decision |
| TS-006-A8, TS-005-A15, TS-007-A4, TS-020-A5 | F-2-43 | the guards whose inputs do not exist yet |
| TS-026-A8 | open row 143 | `check:terms` is written, red, and not in the `pnpm check` chain |
| TS-021-A2 | F-2-13 | open list |
| TS-026-A12, TS-008-A8 | F-2-15 | the Portalize embed is not wired |
| TS-028-A14, TS-016-A7 | F-2-47 | archive rows carry no outbound link or preview image |
| TS-029-A14, TS-011-A3 | F-2-19 | a heading level is skipped inside the imported privacy policy |
| TS-007-A11 | F-2-46 | no `content/legal/<locale>/` |
| TS-005-A9, TS-009-A3, TS-009-A9 | F-2-39 / open row 145 | no island renders a skeleton — a spec decision, deliberately not shipped broken |
| TS-009-A2 | F-2-56 / open row 131 | four routes stay fully dynamic, as row 131 decided |
| TS-010-A5 | F-2-52 | spec against spec |
| TS-011-A4 | F-2-41 | the band is an `aside` on 22 of 24 routes; two render none |
| TS-011-A8, TS-011-A9 | F-2-42 | no OG image on any page |
| TS-002-A1, TS-029-A12 | **F-3-1** (new) | `label-content-name-mismatch`, serious, 48 nodes, every page, every theme |
| TS-003-A1 | **F-3-3** (new) | mobile Lighthouse below D7's 98 floor on two of five D7 routes |
| TS-003-A3 | open rows 19, 20 (+ preload) | six static faces instead of one variable file; no font preload |
| TS-003-A6 | **F-3-4** (new) | the reduced-data path is not built |
| TS-003-A8 | **F-3-2** (new) | the declared LCP element is lazy; two pages paint an undeclared image above the fold |

## Findings raised this run

Nine, in `state/findings/round-3.md`: **0 critical · 0 high · 5 medium
· 4 low.**

| Finding | Sev | What | AC(s) |
| --- | --- | --- | --- |
| F-3-1 | medium | the logo link's visible text is not part of its accessible name, on every page, in every theme (WCAG 2.1 SC 2.5.3) | TS-002-A1, TS-029-A12 |
| F-3-2 | medium | the declared LCP image is `loading="lazy"`; nothing is eager or `fetchpriority="high"`; `/` and `/dein-ort` paint an undeclared image above the fold | TS-003-A8, TS-003 D2 |
| F-3-3 | medium | mobile Lighthouse 96 / 97 on two of the five D7 routes against D7's 98 floor | TS-003-A1 |
| F-3-4 | medium | `Save-Data: on` changes nothing — 0 % image bytes saved | TS-003-A6 |
| F-3-5 | low | the founder photo's `alt` is German on `/en/about` and `/en/about/archive` | F-2-33 residue |
| F-3-6 | low | upper-case path variants answer 200 instead of redirecting to the canonical URL | TS-004 D1 |
| F-3-7 | medium | the proxy resolves `?ort=` upstream per request, uncached, in front of the cache, and the page resolves it again; no rate limit. Latent while geo-api is mocked (open row 77) | TS-004 D5, TS-009 D4 |
| F-3-8 | low | `/_vercel/**` is not a reserved prefix, so a Speed-Insights beacon would 404 | TS-003 D7 |
| F-3-9 | low | the proxy's place-hop catch arm is silent, and its failure mode is the defect it fixes | — |

Two things this run deliberately did **not** file as new findings:
the `vercel.live` CSP console error on the preview (F-2-27, open list,
preview-only by decision) and the "1 Orte ausgewählt" / "1 places
selected" plural (F-2-53, low, already on the open list for M5's
budget).

## Security sweep (TS-014 scope)

- **`semgrep`**, important-only, over `app/ src/ scripts/`: 30 scans,
  10 rulesets per path. **6 findings, all false positives, 0 true
  positives.** Coverage caveats worth carrying forward: Semgrep Pro was
  unavailable, so there is **no cross-file taint analysis** — an
  injection crossing from an `app/api/*` handler into a `src/lib/` sink
  is outside what this scan could see; and `p/nextjs` is an empty
  registry pack that failed to load on all three paths.
- **`differential-review`** over `32dfab8..HEAD` (97 files, +3764 /
  −215): 0 critical, 0 high, 2 medium, 2 low. It confirms explicitly
  that the M5 diff **reintroduces no previously fixed security issue**,
  and that F-2-36's `Host` path in particular is untouched — no
  `x-forwarded-*` read exists anywhere in the repository and the new
  routing predicates read no host. Its two lows and one medium became
  F-3-8, F-3-9 and F-3-7. **Its second medium did not survive
  execution**: the claim that case variants and asset-shaped paths
  render an empty `__next_error__` document was measured against a real
  production build in both environments and is false — the pages render
  in full and the 404s are complete 11 KB documents. What remains of it
  is F-3-6 at `low`. That is the second time in this run that a
  static code-path argument about a security boundary did not survive
  its first execution (F-2-36 was the first); it is worth making the
  rule explicit.
- **TS-014-A1 and A2 both pass** in both environments, on the same
  directive set.

## Methodological notes for whoever reads this next

**The two environments now agree.** Run 2's headline result was that a
dev server and a production build disagreed on two conversion-path
routes. This run ran *only* production builds — local and preview —
and they agree on every measurement taken: the same CSP branch, the
same route statuses, the same CLS, the same console-error set except
for the preview-only `vercel.live` block, the same e2e outcome. The
local-versus-preview delta is now Lighthouse's mobile score, and that
is the CDN, not the code.

**Row 147 and row 148 are load-bearing, and they were.** Building
without `VERCEL_ENV=preview` produces a site with no page copy at all,
and leaving the CSP hash asset in place makes 30 e2e cases fail for a
reason that has nothing to do with what they test. Both were followed;
both should be written into `plan/process.md` and `CONTRIBUTING.md`,
which open row 147 already asks for.

**An instrument that is off by default is an instrument you do not
have.** `e2e/a11y.spec.ts` has been green on 49/49 cases for three
rounds while a serious, page-wide WCAG 2.1 Level A violation sat on
every route, because axe ships `label-content-name-mismatch`
`enabled: false`. The same sweep also fails on impact rather than on
presence, while TS-002-A1 asks for *zero violations*. Two independent
reasons a green sweep is not the criterion.

**Emulating the wrong thing produces confident nonsense.** An earlier
pass of this run emulated TS-002 D4's high-contrast theme with
Playwright's `forcedColors: 'active'` and measured 186 serious
`color-contrast` violations across all 24 routes. D4 selects its themes
by `prefers-contrast`, not by Windows High Contrast Mode. Re-run with
`contrast: 'more'`, the figure is **zero**. The 186 are recorded in the
findings file as a cleared artefact, not as a finding, so nobody
re-discovers them.

**The dark theme is still vacuous.** `app/styles/base.css` declares
`color-scheme: light` and `[data-theme]` is set in no file, so the
`prefers-color-scheme: dark` sweep measures the light theme. TS-002-A1
literally names three themes; two of them are reachable. Open row 142
records the consequence for the contrast guard; the sweep's coverage
gap (F-2-58) narrows but does not close.

**Manual-level criteria.** The three `manual` criteria that run 1
failed and run 2 recovered (TS-024-A19, TS-026-A17, TS-016-A13) were
re-performed and still pass; TS-027-A15 was re-performed and still
passes. TS-028-A14 still fails (F-2-47). Run 2's twenty `manual`
not-testables are unchanged, and **TS-017-A15 and A16 join them** — a
per-release imagery review by the brand owner and a per-PR dependency
review, neither of which has a record. Those two are process
artefacts, not code.

## Gate recommendation

**Recommend the final Customer acceptance proceed, and recommend the
fix-deploy-retest loop close after one short round.**

`plan/process.md`'s abort criterion is met on its **first** branch for
the first time in this run: **no critical and no high finding is
open from this sweep.** Nine findings, five medium and four low. The
four highs run 2 handed to M5 — F-2-33, F-2-49, F-2-69, F-2-70 — are
all resolved and all re-measured by hand on a production build, not
taken from a green suite. `pnpm e2e` is green in both environments for
the first time in the run's history (471/0 and 464/0), and `pnpm check`
carries 1073 tests where run 2 had 796.

What I would put into one short M5 fix round, in the order I would
work it:

1. **F-3-1.** A serious WCAG 2.1 Level A violation on every page, and
   the cheapest fix in the list — whitespace between two wordmark line
   spans, or the whole visible string inside the `aria-label`. It
   turns two `fail` verdicts into `pass`. Enable the rule in
   `e2e/a11y.spec.ts` in the same change, and make the sweep fail on
   *presence* rather than on impact, or TS-002-A1 stays unenforced.
2. **F-3-2.** `priority` on `/ueber-uns`'s founder photo is one prop,
   and it is the page's declared LCP element. The `photo-surface`
   background question on `/` and `/dein-ort` is bigger and is a D2
   conversation, not a page fix — split them.
3. **F-3-5** and **F-2-53.** Two strings, both visible, both in the
   English surface a naive visitor meets. Low, and inside M5's budget
   by `plan/process.md`'s own rule.
4. **F-3-9** and **F-3-8.** A log line and three characters in a
   prefix list.
5. **F-3-4** and **F-3-3** I would *not* put in the round. A6 needs a
   reduced-data image pipeline that does not exist, and A1's two-point
   gap is 2.8 s of LCP on a placeholder SVG hero — both belong with
   the performance owner after the prototype, and both should be
   named in the acceptance protocol rather than quietly fixed.

What the Customer should be told plainly, because none of it is a
defect this run can close:

- **Open row 132 is the one real go-live blocker in the tree, and it
  is invisible on the preview.** A hash-only CSP cannot cover Next's
  request-time flight payload, so the four dynamic routes ship
  unhydrated in *production*. The prototype runs on a preview, where
  `'unsafe-inline'` applies and everything hydrates — which is exactly
  why it must be said out loud at acceptance rather than discovered at
  cutover. It needs a DEC-045 amendment (nonce), not a fix round.
- **Open row 145** (F-2-39 / F-2-56, three failing criteria) is a
  genuine architectural tension between TS-009's Suspense/PPR shell and
  this site's no-JavaScript completeness guarantee. The round was right
  not to ship one of them broken. It needs the rendering-and-resilience
  spec owner.
- **F-2-42** (no OG image anywhere) is the largest single remaining
  gap that is neither a decision nor a mock: every share of every page,
  in both languages, is a bare link today.
- Two systems still answer from mocks by decision (envoy, newsletter,
  geo-api and events-api reads, the `organizerId` minting, the
  registration handover). Every one has a `Mock aktiv` row, every one
  is labelled in the interface, and this run verified the labelling in
  both languages.

One judgement for the record. Run 2 closed by saying its most
consequential result was *where* a defect had hidden — behind a dev
server. This run's equivalent is smaller but the same shape: the
a11y criterion the whole gate leans on has been reported green for
three rounds by an instrument that had the relevant rule switched off,
and my own first attempt to widen that instrument produced 186
confident false violations before I checked what I was emulating. The
prototype is in good shape; the measuring is what I would tighten
before the next milestone trusts a green suite again.

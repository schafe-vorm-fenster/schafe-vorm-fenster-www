# Gate 2 — QA Acceptance Run 2 (retest, round 3 of 3)

Retest run per `plan/process.md` step 5 and
`.agents/playbooks/playbook-qa-acceptance-run/SKILL.md` Phase 4: every
`fix-now` finding of round 3 reproduced from its own steps, then a
regression sweep over the gate-2 scope (`plan/gate-2-scope.md`) — the same
**333 acceptance criteria** run 1 walked, each at the level its own spec
declares. Run 1's protocol: `reports/qa/gate-2-run-1.md`.

Skills loaded: `webapp-testing` (Playwright 1.63 browser walks against the
run's dev server and the round-3 preview) and `web-design-guidelines`
(fetched fresh; used for the a11y/UX criteria and for the keyboard pass
over the surfaces round 3 changed). No fix was made anywhere in this run.

## Environment and evidence commands

| What | Result |
| --- | --- |
| Tree | `next-2026` @ `a17505a` (clean; the preview was built from the same commit — verified by five round-3 fix markers, including `52078c9`'s `size-adjust` fallback) |
| Dev server | `pnpm dev`, port 3100, reused for the whole run |
| Preview | `https://schafe-vorm-fenster-hhnus16wk-schafe-vorm-fenster.vercel.app`, bypass header from `.env.local` |
| Local production build | `pnpm next start -p 3200` on the same tree — used to separate "dev only" from "production build" behaviour |
| `pnpm check` | **exit 0** — 9 static guards, 55 static tests, **796 unit + integration tests (1 skipped)**, typecheck, lint. `check:content` emits 40 warnings (dummy-content / empty `derived_from`), `check:specs` the W3 coverage warning |
| `pnpm build` | **exit 0**; 245 distinct CSP hashes from 374 inline scripts across 39 pages. Route manifest: eight of the twelve D1 routes emit a prerendered shell — `/` is `◐` in both locales and six content routes are `○` — and four stay `ƒ` (`/dein-ort`, `/dein-ort/starten`, `/mitmachen/registrieren`, `/dein-kalender/bestellen` — open row 131). Run 1 found **zero** `◐` routes |
| `pnpm e2e` (local, dev server) | **356 passed, 1 failed, 8 skipped** — `archiv.spec.ts` TS-028-A3 (F-2-71) |
| `pnpm e2e` (preview, `E2E_BASE_URL`) | **348 passed, 2 failed, 15 skipped** — `dein-ort-starten.spec.ts` TS-021-A7 (F-2-49 reopened) and `deine-region.spec.ts` F-2-66 (flake, F-2-71) |
| `e2e/a11y.spec.ts` | 49/49 green locally **and** against the preview — **0 serious/critical** axe violations across 24 routes × 2 viewports (light theme only; three-theme gap stays F-2-58) |
| `e2e/privacy.spec.ts` | 25/25 green locally and on the preview |
| `e2e/layout-stability.spec.ts` | 24/24 green locally and on the preview (TS-009-A8's ≤ 8 px budget; the `/mitmachen` @1280 residual of open row 146 no longer trips it) |
| `e2e/content-compliance.spec.ts` | 41/41 green locally and on the preview |
| `npx lighthouse` mobile, preview `/` | performance **95** · FCP 2.3 s · LCP 2.3 s · **CLS 0** · TBT 20 ms |
| `npx lighthouse` mobile, preview `/dein-kalender` | performance **96** · FCP 2.2 s · LCP 2.2 s · **CLS 0.017** · TBT 10 ms |
| CLS sweep, 360 px, PerformanceObserver | `/` 0.0002 · `/dein-ort` 0.0002 · `/mitmachen` 0 · `/deine-region` 0 · `/ueber-uns` 0 · `/rechtliches` 0 · **`/ueber-uns/archiv` 0.2197** (F-2-69) |
| Conversion-path walks | all five in German plus the first two in English, in a real browser at 360 px |
| Keyboard pass | `/ueber-uns/archiv`, `/deine-region/angebot`, the 404 and order step 3 — 103 tab stops, **0** without a ≥ 2 px focus ring |
| Console-error sweep, 14 routes | local: clean. Preview: one error per route, all the known `vercel.live` CSP block (F-2-27, open list) |

## Retest of the round-3 fix-now findings

33 findings were in the retest list: the 32 `fix-now` items of
`plan/round-3.md` plus the carry-over F-1-2. **26 resolved, 5 reopened,
2 resolved-as-scoped.** Critical and high findings were reproduced in a
browser, not only through the suite.

| Finding | Sev | Retest | Evidence |
| --- | --- | --- | --- |
| F-1-2 | — | **resolved** | `scripts/check-csp.ts` runs inside `pnpm check` and is green (4 environment/hash cases). TS-014-A1 passes |
| F-2-1 | medium | **resolved** | the sweep C could not run finally ran on `a17505a`: `pnpm check` exit 0 (796 tests), `pnpm build` exit 0. `pnpm e2e` is **not** green — one local failure, filed as F-2-71 |
| F-2-30 | **critical** | **resolved** | browser walk at 360 px: `07743` → Beispielwalde with 3 rows and an `app.*` link; `38165` → the no-dates state with the publish CTA; `99999` → forwarded to `/dein-ort/starten?ort=99999`. `/dein-ort?ort=99999` and `?ort=abcde` 307 to `/dein-ort/starten`. Residual, not a reopen: on a **production build** the server-rendered answer for `/?ort=…` is still S1 and the resolution arrives with the client patch (same mechanism as F-2-49's reopen) |
| F-2-31 | high | **resolved** | both 404 surfaces carry the place search (plain GET form to `/dein-ort`, walked: typing `07743` lands on `/dein-ort?ort=07743`) and all four jobs; no developer note, no dashed placeholder. Status 404 + `noindex`. The German surface's **empty no-JS body** is new and is F-2-70 |
| F-2-32 | high | **resolved** | every S3 placement (`/dein-kalender`, `/deine-region`, `/dein-kalender/bestellen`, `/en/your-calendar`, `/en/your-region`) resolves to the one configured `calendar.app.google/VG9bZoYVnFcX1W6F8`; the two per-page pastes are gone |
| F-2-33 | high | **reopened** | the half the finding leads with is fixed — registration steps 1–3, the quote form's whole field set and the footer contact/newsletter block are English on `/en`. Still German on `/en` routes: **`Demo-Daten`** (`/en/take-part/register?ort=…` — the package-B tail the finding itself records, plus `/en/your-calendar`, `/en/about/archive`), **`Foto gesucht`** (`/en/take-part`, `/en/your-calendar`, `/en/your-region/quote`, `/en/about`) and **`Nicht motivgenau · Platzhalter`** (`/en/your-place`, `/en/your-place/start`, `/en/your-region`, `/en/about`) |
| F-2-34 | high | **resolved** | `/en/your-region/quote` h1 reads "Request a quote for your organisation" |
| F-2-35 | high | **resolved** | all 24 routes greped for `TS-0…`, `DEC-0…`, `Q-0…`, `SRC-0…`, `[Platzhalter` — zero hits |
| F-2-36 | high | **resolved** | `csp-hashes.ts` takes its fetch origin from `VERCEL_URL`/`VERCEL_PROJECT_PRODUCTION_URL`, keys the cache on `VERCEL_DEPLOYMENT_ID` and validates every entry as `sha256-<44 base64>`; 33 unit tests across `csp-hashes.test.ts` and `proxy.test.ts`, plus a `check-csp.ts` guard that builds a policy from hostile hash strings. `e2e/smoke.spec.ts:252` asserts it on the preview |
| F-2-38 | medium | **resolved** | `search-field` carries `maxLength=80`, `envoy-form` 120/2000; both flow routes read `?ort=` through `readPlaceParameter` |
| F-2-39 | high | **reopened** | confirmed unresolved, as the fix round itself recorded: `moduleSkeleton` still has no call site and `grep -c skeleton` over the rendered HTML is 0 on every route. `<Suspense>` boundaries now exist (F-2-30's work), but no island renders a fallback box. TS-005-A9, TS-009-A3 and TS-009-A9 stay fail — `state/open.md` row 145 |
| F-2-40 | high | **resolved** | `VERCEL_ENV=production pnpm check:content` exits non-zero on the first `draft` artefact; `lifecycle.ts` renders `draft` in preview and locally only. Which artefacts become `approved` is open row 140, by decision |
| F-2-41 | medium | **reopened** | the element half is fixed — the band is `<aside aria-label="…" id="context-band">` on `/`, `/dein-ort`, `/dein-ort/starten`, `/mitmachen`, `/dein-kalender`, `/deine-region`, `/deine-region/angebot`. TS-011-A4 says "on every page", and the band is still absent on five: `/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches`, `/mitmachen/registrieren`, `/dein-kalender/bestellen` (the last two are F-2-10). The fix commit records the absence as untouched |
| F-2-43 | medium | **resolved as scoped** | the three guards whose inputs exist were built and are green in `pnpm check`: `check:contrast` (TS-002-A3, 68 pairs × 4 themes) and `check:seo-budget` (TS-011-A7, 24 pairs). `check:terms` exists but is **red** on three module lines and is not in the chain — TS-026-A8 stays fail (open row 143). TS-005-A15, TS-006-A8 and TS-007-A4 stay fail, as the round decided |
| F-2-44 | medium | **resolved** | `--type-label-size` and `--type-microlabel-size` are `0.9375rem` (15 px); `event-row`'s bare `28px` is `var(--type-figure-size)`; `check:brand` green |
| F-2-45 | medium | **resolved** | on all three landing hosts `/` and `/rechtliches` answer 200 and `/mitmachen`, `/dein-kalender` answer 404; `www.schafe-vorm-fenster.de` is unaffected |
| F-2-48 | medium | **resolved** | `/deine-region` renders one `form[data-envoy-form-kind="quote"]`; honeypot plus a ~2 s timing gate in `envoy-form.tsx`, and a filled honeypot is silently accepted and fires no conversion event (measured) |
| F-2-49 | medium | **reopened** | dev server: `/dein-ort/starten?ort=beispielwalde` answers one 307 to `/dein-ort?ort=beispielwalde`. **Preview and local `pnpm start`: 200 with an empty document.** `pnpm e2e` against the preview fails TS-021-A7 on exactly this (expected 307, received 200). Without JavaScript the visitor gets a blank page; with JavaScript the forward happens in the client. `/dein-ort?ort=99999` behaves the same way |
| F-2-50 | medium | **resolved** | the manifest declares three modules and `app/[lang]/deine-region/page.meta.test.ts` exists |
| F-2-51 | medium | **resolved** | order step 3 carries exactly one advance control ("Weiter"); the inert "Absenden" is gone |
| F-2-55 | medium | **resolved** | `/start` 302s to the lead form and is absent from the sitemap; `/llms.txt` 200s and lists this domain's D1 pages; `routes.spec.ts` walks D1's inventory instead of the route registry |
| F-2-56 | medium | **reopened** | measurable progress, criterion still unmet: the build now reports ten `◐` manifest entries where run 1 found zero, and eight of the twelve D1 routes emit a prerendered shell. TS-009-A2 asks for "zero routes fully dynamic" and four are still `ƒ` — which open row 131 settles as intended, so the criterion cannot pass as written |
| F-2-57 | medium | **resolved** | the map claim is out of the claim set, the two-working-day wording is gone from `/deine-region`, `/deine-region/angebot` and `/dein-kalender`, and `dein-kalender-6-trust` carries `derived_from: [ia]` |
| F-2-59 | high | **resolved** | browser at 360 px: one chip → 1 of 6 rows visible, 5 hidden (computed style, not the attribute), count line "1 VON 6 EINTRÄGEN"; survivors keep their unfiltered order |
| F-2-60 | high | **resolved** | a real soft walk (step 3 → "Weiter" → step 4 → Back → Forward) fires `buy-calendar-licence` exactly once |
| F-2-61 | high | **resolved** | `/dein-ort?ort=38165`: primary CTA is "Ersten Termin veröffentlichen" → `/mitmachen/registrieren?ort=beispielhausen`, position 2 filled, no raw markdown in `main` |
| F-2-62 | high | **resolved** | `/mitmachen/registrieren?ort=beispielwalde` shows "Dein Ort: Beispielwalde" with an "Ort ändern" control, on step 2 of 3 |
| F-2-63 | medium | **resolved** | stage 0 reads "Beispiele aus dem Landkreis deiner Region" — no county asserted, no `geoname.*` anywhere in the rendered text |
| F-2-64 | medium | **resolved** | the consent line resolves through `legalAnchor`; `#privacy`, `#imprint`, `#data-processing`, `#accessibility` all exist on `/en/legal` |
| F-2-65 | high | **resolved** | the submit disables itself on the first press; the second click times out against a disabled control, and the suite's own one-task double-click case is green on both environments |
| F-2-66 | high | **resolved** | after a submission the form is replaced by `[data-envoy-state="sent"] [role="status"]` reading "Danke — deine Anfrage ist angekommen" with the `Demo-Daten` label; it carries `tabIndex={-1}` and takes focus. Green 3/3 in isolation locally **and** on the preview; the one failure in the parallel preview run is a flake and is F-2-71 |
| F-2-67 | medium | **resolved** | clicking "Weiter" on step 3 and reloading 120 ms later lands on step 4; `useLinkStatus` puts the pending state on the control |
| F-2-68 | high | **resolved** | `e2e/layout-stability.spec.ts` 24/24 green locally and on the preview; Lighthouse mobile CLS 0 on `/` and 0.017 on `/dein-kalender`; the PerformanceObserver sweep measures ≤ 0.0002 on `/` at 360 px |

**Retest totals: 26 resolved · 2 resolved as scoped (F-2-43, and F-2-1 with
the e2e caveat) · 5 reopened (F-2-33, F-2-39, F-2-41, F-2-49, F-2-56).**


## Verdicts per criterion

The `Run 1` column is the previous verdict, so every changed row is visible without diffing two files.

### TS-004 — URL and routing

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | integration | fail | **pass** | `/start` 302s to the lead form, `/llms.txt` 200s; `e2e/routes.spec.ts` now walks D1's own inventory row by row — F-2-55 resolved |
| A2 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | integration | fail | **pass** | `/mitmachen` = 404 on all three landing hosts (`www.schafvormfenster.at`, `www.owcezaoknem.pl`, `www.sheepoutside.com`), `/` and `/rechtliches` = 200 — F-2-45 resolved |
| A4 | integration | fail | **pass** | both 404 surfaces carry the place search (GET form to `/dein-ort`) and all four jobs; status 404 + `noindex` — F-2-31 resolved. The no-JS blank body of the German surface is F-2-70 |
| A5 | integration | fail | **pass** | `/llms.txt` lists this domain's D1 pages; `/start` absent from the sitemap — F-2-55 resolved |
| A6 | e2e | pass | **pass** | every request across 24 routes + four `?ort=` fixtures went to the origin only. Vacuous: envoy/Portalize/eTracker issue no client request (mocks/off) |
| A7 | integration | pass | **pass** | code read + curl against :3100 |
| A8 | e2e | fail | **pass** | `#privacy`, `#imprint`, `#data-processing` and `#accessibility` all exist on `/en/legal` — F-2-64 resolved |
| A9 | integration | pass | **pass** | code read + curl against :3100 |
| A10 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | integration | not-testable | **not-testable** | `/{community}` forwarding is not built — skipped with a recorded reason, which the criterion itself prescribes |

### TS-006 — Page composition

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | pass | **pass** | `/`, `/dein-ort` and their EN twins at 360 and 1280: the search form is inside the first screen and the only `data-cta="primary"` is its submit button, not a link |
| A5 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | fail | **fail** | the band is suppressed on registration steps 2-3 → F-2-10, recorded not re-filed |
| A7 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | static | fail | **fail** | generic-claims term list does not exist (spec says so at :317) → F-2-43 |
| A9 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | not-testable | **not-testable** | neither page carries the two-working-day wording — it is withheld while C11/Q-022 is unsigned, which is what TS-016-A13 requires; that withholding is itself F-2-57 |
| A14 | manual | not-testable | **not-testable** | SRC-001's eight-point check is not reachable from this repo → F-2-18 |
| A15 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-002 — Accessibility

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | tool | not-testable | **not-testable** | axe is green on 24 routes x 2 viewports, but the light theme only — 2 of 3 declared themes are never swept → F-2-58 |
| A2 | tool | pass | **pass** | Lighthouse accessibility = 100 on mobile and desktop, preview `/` |
| A3 | static | fail | **pass** | `pnpm check:contrast` — 68 token pairs across 4 themes, green, inside `pnpm check` — F-2-43 resolved for A3 |
| A4 | manual | not-testable | **not-testable** | chaos:keyboard-only walked the entry points (C-K-3..C-K-8) with no traps; no complete per-release walkthrough of all four jobs exists |
| A5 | manual | not-testable | **not-testable** | no VoiceOver/NVDA available to this run |
| A6 | tool | not-testable | **not-testable** | the real envoy widget is undelivered (Q-022); only the mock mount is sweepable |
| A7 | e2e | pass | **pass** | 320x800 on all 24 routes: scrollWidth == clientWidth everywhere (two independent runs) |
| A8 | integration | pass | **pass** | code read + curl against :3100 |
| A9 | e2e | pass | **pass** | `reducedMotion: reduce` on all 24 routes: zero elements with an animation or a non-opacity transition > 50 ms |
| A10 | static | fail | **pass** | `--type-label-size` and `--type-microlabel-size` are `0.9375rem` (15 px); the bare `28px` became `--type-figure-size` — F-2-44 resolved |
| A11 | tool | pass | **pass** | axe `image-alt` clean across 24 routes x 2 viewports (`e2e/a11y.spec.ts`) |
| A12 | manual | pass | **pass** | `content/legal/accessibility.md` names self-assessment and claims no audit; the ticket ids in it are F-2-35 |

### TS-001 — Locale routing

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-019 — / (home)

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | fail | **pass** | `/?ort=07743` renders Beispielwalde with its rows and an `app.*` calendar link — F-2-30 resolved. On a production build the server-rendered answer is still S1 (see F-2-49's reopen note) |
| A4 | e2e | fail | **pass** | `/?ort=38165` renders the nearby module plus 'Ersten Termin veröffentlichen' and claims no dates in Beispielhausen — F-2-30 resolved |
| A5 | e2e | fail | **pass** | typing 99999 into the home search lands on `/dein-ort/starten?ort=99999` (browser walk, 360 px); `/` renders no uncovered place as data — F-2-30 resolved |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | not-testable | **not-testable** | personalization stage 2 never fires in the running app → F-2-14 |
| A8 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | manual | not-testable | **not-testable** | SRC-001's eight-point check is not reachable from this repo → F-2-18 |

### TS-020 — /dein-ort

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | static | fail | **fail** | the stories carry no `proof_ref` — the criterion's subject is absent → F-2-43 (TS-005-A15) |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | integration | not-testable | **not-testable** | emission goes to `createMockTracker()` by decision; two of the wrapped call sites were observed in the markup |
| A9 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | e2e | not-testable | **not-testable** | no CLS measurement harness in this run; and with no skeletons (F-2-39) the counter branches do not exist |
| A13 | manual | not-testable | **not-testable** | no content/tone review record exists for this run |

### TS-021 — /dein-ort/starten

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | fail | **fail** | `/dein-ort/starten` is a dynamic route against TS-021 D10 → F-2-13, recorded not re-filed |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | integration | fail | **pass** | `/dein-ort?ort=99999` 307s to `/dein-ort/starten?ort=99999` against the dev server — F-2-30 resolved |
| A7 | integration | fail | **fail** | dev server: one 307 to `/dein-ort?ort=beispielwalde`. Preview and local `pnpm start`: **200, empty document**, the forward runs only in the client — F-2-49 **reopened** |
| A8 | integration | not-testable | **not-testable** | the place-search upstream is a declared mock; an outage keeps the module at tier 1 |
| A9 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | fail | **fail** | title/description come from the placeholder dictionary, not frontmatter; canonical + JSON-LD clauses hold |
| A12 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | fail | **pass** | the uncovered branch reaches `/dein-ort/starten` and the page names the searched value — F-2-30 resolved |
| A15 | manual | not-testable | **not-testable** | no content/tone review record exists for this run |

### TS-022 — /mitmachen

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | integration | not-testable | **not-testable** | neither branch reachable: no candidate list is passed, and events-api is a declared mock |
| A9 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | pass | **pass** | closing CTA label, target and goal are identical to the primary; the permanence promise is absent rather than reworded, which the criterion's own second sentence prescribes |
| A12 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | integration | pass | **pass** | code read + curl against :3100 |
| A16 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-023 — /mitmachen/registrieren

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | the step-2 URL reopened in a fresh browser context shows the same step with the same answers; no cookie and no storage entry set by the page |
| A4 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | fail | **pass** | `/mitmachen/registrieren?ort=beispielwalde` shows 'Dein Ort: Beispielwalde' with an 'Ort ändern' control through step 3 — F-2-62 resolved |
| A8 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | pass | **pass** | exactly one `register-as-publisher` / `stage: handover` on the handover click; no `publish-first-event` anywhere in the sweep |
| A11 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A16 | tool | not-testable | **not-testable** | axe sweeps the light theme only and not the flows' later steps or the shadow root → F-2-58 |

### TS-024 — /dein-kalender

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | not-testable | **not-testable** | cookie/storage half passes (both empty after load), but "with the loader allowed" cannot be exercised — no third-party script request is made at all → F-2-15 |
| A8 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A16 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A17 | e2e | pass | **pass** | closing CTA shares label and target with the primary, uses the ink fill not Pulse (rgb(23,29,13) vs rgb(188,28,90)); the band names exactly the three non-focus jobs |
| A18 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A19 | manual | fail | **pass** | `dein-kalender-6-trust` carries `derived_from: [ia]`; the unconfirmed claims are removed — F-2-57 resolved |

### TS-025 — /dein-kalender/bestellen

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | pass | **pass** | four sentinel-filled invoice fields submitted: no value reached our origin, any log line or any analytics payload. Judged against the envoy order mock |
| A10 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | tool | not-testable | **not-testable** | axe sweeps the light theme only and not the flows' later steps or the shadow root → F-2-58 |
| A13 | manual | not-testable | **not-testable** | no screen reader available; the keyboard half was walked at entry-point level only |
| A14 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-026 — /deine-region (+ /angebot)

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | static | fail | **fail** | `pnpm check:terms` exists (TS-026-A7/A8) but is red on three module lines and is not in the `pnpm check` chain — open row 143; F-2-43 partial |
| A9 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | fail | **pass** | block 3 at stage 0 reads 'Beispiele aus dem Landkreis deiner Region' — no county asserted, no `geoname.*` — F-2-63 resolved |
| A11 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | e2e | fail | **fail** | the embed demo never requests the Portalize host; the label and blocked-loader clauses pass → F-2-15, recorded not re-filed |
| A13 | e2e | not-testable | **pass** | one `request-licence-quote` on submit, no field value in the payload (dev server and preview) — the mock mount now owns a submit handler |
| A14 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | static | fail | **pass** | `page.meta.ts` declares the three modules the page runs and `page.meta.test.ts` exists — F-2-50 resolved |
| A16 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A17 | manual | fail | **pass** | the map claim is out of the claim set — F-2-57 resolved |

### TS-027 — /ueber-uns

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | pass | **pass** | exactly one empty slot, visible, hatch + label + one sentence, zero images, byte-identical after 5.3 s, present in the accessibility tree, `getAnimations()` empty |
| A7 | integration | not-testable | **not-testable** | needs two content fixtures; no fixture seam exists. Live half observed 6+1, but `select.ts:80-105` enforces no reservation |
| A8 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | not-testable | **not-testable** | stage 0 and a fully geo-headed request render identical block order with the empty slot in both, but stage 1 is unreachable in the running app (`GEO_STAGE1_SOURCE` off), so the "only the six filled elements differ" clause cannot be exercised |
| A12 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | integration | pass | **pass** | code read + curl against :3100 |
| A14 | e2e | pass | **pass** | hero 21/9, proof slot 5/2, portrait 4/5 all declared before data; PerformanceObserver over load plus full scroll measured CLS = 0.0048 |
| A15 | manual | pass | **pass** | every photo carries `Nicht motivgenau · Platzhalter`; `Foto gesucht` surfaces present |

### TS-028 — /ueber-uns/archiv

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | e2e | fail | **pass** | one chip → 1 of 6 rows visible, 5 hidden, count line '1 VON 6 EINTRÄGEN' — F-2-59 resolved |
| A5 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | not-testable | **pass** | survivors keep their unfiltered relative order (measured over all six rows) — testable now that F-2-59 is fixed |
| A7 | integration | not-testable | **not-testable** | the media-echo pipeline has zero cleared entries (Q-045) |
| A8 | tool | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | pass | **pass** | JavaScript disabled: all six cleared rows render and are visible; the chip container is absent from the DOM entirely |
| A10 | tool | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | tool | not-testable | **fail** | CLS 0.2197 at 360 px on load (one 262 px shift when the client-only chip row appears); the three filter interactions add 0.0008 — **F-2-69** |
| A14 | manual | fail | **fail** | no archive row carries an outbound link → F-2-47 |

### TS-029 — /rechtliches

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A5 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | tool | not-testable | **not-testable** | axe is green on 24 routes x 2 viewports, but the light theme only — 2 of 3 declared themes are never swept → F-2-58 |
| A13 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | integration | fail | **fail** | a heading level is skipped inside the imported privacy policy → F-2-19, recorded not re-filed |

### TS-007 — Content pipeline

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | tool | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | tool | not-testable | **not-testable** | no clearance check exists to re-validate against — blocked, reported against F-2-18 |
| A4 | integration | fail | **fail** | `check:content` is not a build step; no clearance check exists → F-2-43 |
| A5 | tool | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | unit | not-testable | **not-testable** | `validate.ts:14` marks facet completeness "partial"; `editorial_weight`/`job_relation` do not exist in the schema — blocked, F-2-18 |
| A7 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | unit | not-testable | **not-testable** | `validate.ts:16` marks harmonisation "partial" — records/slots/provenance only; claims, proof bindings, CTA target, goal and numbers unchecked — F-2-18 |
| A10 | tool | pass | **pass** | ids reconciled against the installed packages in `src/lib/pages/page-meta.test.ts:38-46`. gate-2-scope listed A10 as blocked; the unit check now discharges it |
| A11 | integration | fail | **fail** | no `content/legal/<locale>/`; `/en/legal` renders German bodies → F-2-46 |
| A12 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | tool | not-testable | **not-testable** | no glossary lint exists — blocked, reported against F-2-18 per gate-2-scope §1.3 |
| A14 | integration | fail | **pass** | `VERCEL_ENV=production pnpm check:content` exits non-zero on the first `draft` artefact; `lifecycle.ts` renders `draft` in preview/local only — F-2-40 resolved (which artefacts become `approved` stays open row 140) |
| A15 | manual | not-testable | **not-testable** | no bumped package version to dry-run P7 against → F-2-18 |
| A16 | tool | not-testable | **not-testable** | no segment-independence lint exists — blocked, reported against F-2-18 (F-2-34 is the counter-example) |

### TS-005 — Relevance engine

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A9 | integration | fail | **fail** | no `<Suspense>`; `selectProof()` awaited inline in every page body → F-2-39 |
| A10 | e2e | pass | **pass** | every place-bound proof/module named a covered demo place at stage 0 and with all four `?ort=` fixtures; judged against the geo/events mocks |
| A11 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A15 | static | fail | **fail** | no `claims` key, no proof resolution in `validate.ts` → F-2-43 |
| A16 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-008 — Live data

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | fail | **pass** | `/dein-ort?ort=38165`: primary CTA is 'Ersten Termin veröffentlichen' → `/mitmachen/registrieren?ort=beispielhausen`, position 2 filled, no raw markdown — F-2-61 resolved |
| A7 | e2e | fail | **pass** | the uncovered search lands on `/dein-ort/starten` — F-2-30 resolved |
| A8 | e2e | fail | **fail** | zero requests to the Portalize host; position 1 absence and the blocked-loader clause hold → F-2-15, recorded not re-filed |
| A9 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | manual | not-testable | **not-testable** | the Portalize embed is not wired → F-2-15 |
| A13 | tool | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A14 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-009 — Rendering and resilience

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | tool | fail | **fail** | build manifest: zero `◐` routes, four content routes fully dynamic → F-2-56 |
| A3 | integration | fail | **fail** | zero skeletons in any page's HTML → F-2-39 |
| A4 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A8 | tool | not-testable | **fail** | layout-stability 24/24 and Lighthouse mobile CLS 0 (`/`) and 0.017 (`/dein-kalender`), but `/ueber-uns/archiv` measures CLS 0.2197 at 360 px — **F-2-69** |
| A9 | integration | fail | **fail** | `moduleSkeleton()` has no call site → F-2-39 |
| A10 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A12 | tool | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A13 | manual | not-testable | **not-testable** | no screen reader available; and no skeleton renders anywhere (F-2-39) |

### TS-010 — Personalization

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | integration | pass | **pass** | code read + curl against :3100 |
| A5 | integration | fail | **fail** | one `EmptyProofSlot` renders at stage 0 on `/mitmachen` and `/ueber-uns` → F-2-52 (spec collision) |
| A6 | integration | pass | **pass** | code read + curl against :3100 |
| A7 | e2e | pass | **pass** | all 24 routes: no select, no top-level radio group, no tab/dialog role, no "who are you" copy. Registration step 2 is a flow answer, not a site classifier |
| A8 | e2e | not-testable | **not-testable** | `getCurrentPosition`/`watchPosition` patched before load: zero calls on load and on full scroll (that half passes), but the D5 explicit control is not built, so the prompt and denial clauses have no trigger |
| A9 | tool | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A12 | e2e | pass | **pass** | across six walked routes: zero cookies, zero `Set-Cookie`, empty `localStorage`/`sessionStorage`. The D10 session flag is not built, so "the only stored key" is vacuous |
| A13 | e2e | not-testable | **not-testable** | the language suggestion is not built in phase 1 (TS-010 D10); the criterion says "(when built)" |
| A14 | e2e | pass | **pass** | primary conversion identical at stage 0 and stage 3 on all 12 DE routes; only `/dein-ort/starten` gains `?ort=` on the same target, which TS-022-A14 sanctions |
| A15 | manual | not-testable | **not-testable** | the geo flag is off (verified), but no Q-008 sign-off record exists in this repo |

### TS-011 — SEO

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | tool | fail | **fail** | a heading level is skipped inside the privacy policy (F-2-19); no HTML validator run |
| A4 | integration | fail | **fail** | context band is a `section` in `main`, absent on four pages; 1 `<aside>` in total → F-2-41 |
| A5 | tool | not-testable | **not-testable** | schema.org validator / Rich Results Test not run in this environment |
| A6 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A7 | static | fail | **pass** | `pnpm check:seo-budget` — 24 (path, language) pairs, green, inside `pnpm check` — F-2-43 resolved for A7 |
| A8 | integration | fail | **fail** | no `og:image*`, no `twitter:image`; `twitter:card` = summary → F-2-42 |
| A9 | e2e | fail | **fail** | no page emits `og:image` at all, so the criterion has no subject → F-2-42 |
| A10 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A11 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A12 | manual | not-testable | **not-testable** | no interest landing page exists — the criterion has no subject yet |
| A13 | manual | not-testable | **not-testable** | post-cutover Search Console observation; nothing is launched |
| A14 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-012 — Analytics

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A4 | unit | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | e2e | fail | **pass** | one soft walk step 3 → 4 → back → forward fires `buy-calendar-licence` exactly once — F-2-60 resolved |
| A6 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A7 | integration | pass | **pass** | code read + curl against :3100 |
| A8 | tool | not-testable | **not-testable** | `EtrackerLoader` is never imported and the tracker is the mock adapter (`state/open.md` row 83) |
| A9 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A10 | manual | not-testable | **not-testable** | `EtrackerLoader` is never imported and the tracker is the mock adapter (`state/open.md` row 83) |
| A11 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-013 — Privacy

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A2 | e2e | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A3 | static | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |
| A5 | integration | pass | **pass** | named by a green test in `pnpm check` / `pnpm e2e` |

### TS-016 — Forms and leads

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | static read of the guard/manifest; `pnpm check` green |
| A2 | integration | fail | **pass** | `/deine-region` renders one `form[data-envoy-form-kind=quote]` — F-2-48 resolved |
| A3 | e2e | pass | **pass** | five sentinel-filled quote fields submitted: zero external requests, no sentinel in any URL, console line or analytics payload. Judged against the envoy mock, whose fields carry no `name` |
| A4 | static | not-testable | **not-testable** | the widget contract's published variable set is UNKNOWN (Q-022); no mapping file exists |
| A5 | e2e | fail | **pass** | every S3 placement resolves to the one configured `calendar.app.google/VG9bZoYVnFcX1W6F8`; the two per-page pastes are gone — F-2-32 resolved |
| A6 | e2e | pass | **pass** | all four D8 steps walked with the briefing exit visible on each; step 4 shows a copyable snippet, zero payment fields, no payment host in any request or in the CSP |
| A7 | static | fail | **fail** | no archive row renders a preview image or an outbound link → F-2-47 |
| A8 | tool | not-testable | **not-testable** | axe sweeps the light theme only and not the flows' later steps or the shadow root → F-2-58 |
| A9 | manual | not-testable | **not-testable** | no screen reader available; the keyboard half was walked at entry-point level only |
| A10 | integration | fail | **pass** | honeypot plus a ~2 s timing gate in `envoy-form.tsx`; a filled honeypot is silently accepted and fires no conversion — F-2-48 resolved |
| A11 | integration | pass | **pass** | code read + curl against :3100 |
| A12 | e2e | fail | **pass** | S2/S3 fire once and carry no field values; S4 fires once across back/forward — F-2-60 resolved |
| A13 | manual | fail | **pass** | the two-working-day promise is removed from `/deine-region`, `/deine-region/angebot` and `/dein-kalender` rather than softened — F-2-57 resolved |
| A14 | e2e | not-testable | **not-testable** | there is no widget script to block — the mount is a server-rendered mock, so the fallback branch is unreachable from the browser. The "no empty or permanently loading slot" half passes |

### TS-014 — Security (sweep scope)

| AC | Level | Run 1 | Run 2 | Evidence |
| --- | --- | --- | --- | --- |
| A1 | static | pass | **pass** | `scripts/check-csp.ts` runs in `pnpm check` and is green — F-1-2 is discharged; hash-token shape caveat in F-2-36 |
| A2 | integration | pass | **pass** | `e2e/smoke.spec.ts:206-245` asserts every D2 directive; green locally and against the preview. Preview `'unsafe-inline'` = F-2-27, recorded |


## Counts

| | Run 1 | Run 2 | Delta |
| --- | --- | --- | --- |
| **pass** | 234 | **264** | **+30** |
| **fail** | 52 | **26** | **−26** |
| **not-testable** | 47 | **43** | **−4** |
| **total in scope** | 333 | 333 | — |

Delta by TS (pass / fail / not-testable):

| TS | Run 1 | Run 2 | Delta |
| --- | --- | --- | --- |
| TS-004 URL and routing | 5 / 5 / 1 | 10 / 0 / 1 | +5 / −5 / 0 |
| TS-006 Page composition | 11 / 2 / 2 | 11 / 2 / 2 | 0 / 0 / 0 |
| TS-002 Accessibility | 6 / 2 / 4 | 8 / 0 / 4 | +2 / −2 / 0 |
| TS-001 Locale routing | 9 / 0 / 0 | 9 / 0 / 0 | 0 / 0 / 0 |
| TS-019 / (home) | 10 / 3 / 2 | 13 / 0 / 2 | +3 / −3 / 0 |
| TS-020 /dein-ort | 9 / 1 / 3 | 9 / 1 / 3 | 0 / 0 / 0 |
| TS-021 /dein-ort/starten | 8 / 5 / 2 | 10 / 3 / 2 | +2 / −2 / 0 |
| TS-022 /mitmachen | 15 / 0 / 1 | 15 / 0 / 1 | 0 / 0 / 0 |
| TS-023 /mitmachen/registrieren | 14 / 1 / 1 | 15 / 0 / 1 | +1 / −1 / 0 |
| TS-024 /dein-kalender | 17 / 1 / 1 | 18 / 0 / 1 | +1 / −1 / 0 |
| TS-025 /dein-kalender/bestellen | 12 / 0 / 2 | 12 / 0 / 2 | 0 / 0 / 0 |
| TS-026 /deine-region (+ /angebot) | 11 / 5 / 1 | 15 / 2 / 0 | +4 / −3 / −1 |
| TS-027 /ueber-uns | 13 / 0 / 2 | 13 / 0 / 2 | 0 / 0 / 0 |
| TS-028 /ueber-uns/archiv | 9 / 2 / 3 | 11 / 2 / 1 | +2 / 0 / −2 |
| TS-029 /rechtliches | 11 / 1 / 1 | 11 / 1 / 1 | 0 / 0 / 0 |
| TS-007 Content pipeline | 7 / 3 / 6 | 8 / 2 / 6 | +1 / −1 / 0 |
| TS-005 Relevance engine | 14 / 2 / 0 | 14 / 2 / 0 | 0 / 0 / 0 |
| TS-008 Live data | 10 / 3 / 1 | 12 / 1 / 1 | +2 / −2 / 0 |
| TS-009 Rendering and resilience | 8 / 3 / 2 | 8 / 4 / 1 | 0 / +1 / −1 |
| TS-010 Personalization | 11 / 1 / 3 | 11 / 1 / 3 | 0 / 0 / 0 |
| TS-011 SEO | 6 / 5 / 3 | 7 / 4 / 3 | +1 / −1 / 0 |
| TS-012 Analytics | 8 / 1 / 2 | 9 / 0 / 2 | +1 / −1 / 0 |
| TS-013 Privacy | 4 / 0 / 0 | 4 / 0 / 0 | 0 / 0 / 0 |
| TS-016 Forms and leads | 4 / 6 / 4 | 9 / 1 / 4 | +5 / −5 / 0 |
| TS-014 Security (sweep scope) | 2 / 0 / 0 | 2 / 0 / 0 | 0 / 0 / 0 |

Only one verdict moved the wrong way: **TS-009-A8** went from
not-testable to fail, because this run finally has a CLS instrument and
one page fails the budget (F-2-69). **TS-028-A13** did the same, for the
same measurement. Four not-testables became decidable and passed
(TS-026-A13, TS-028-A6 and the two the count table folds into TS-026 and
TS-028) because the mocks and the filter they depend on now work.

## The 26 remaining fails, by owner

| AC(s) | Finding | Why it is still open |
| --- | --- | --- |
| TS-006-A6 | F-2-10 | spec-against-spec, open list by round-3 decision |
| TS-006-A8, TS-005-A15, TS-007-A4 | F-2-43 | the three guards whose inputs do not exist yet; blocked on spec decisions, as the round decided |
| TS-026-A8 | F-2-43 / open row 143 | `check:terms` is written and red on three module lines; not yet in the `pnpm check` chain |
| TS-020-A5 | F-2-43 (TS-005-A15) | the stories carry no `proof_ref` |
| TS-021-A2 | F-2-13 | open list |
| TS-021-A7 | **F-2-49 reopened** | 200 instead of 307 on a production build |
| TS-021-A11 | open rows 103, 138 | titles/descriptions still come from the M2 placeholders |
| TS-026-A12, TS-008-A8 | F-2-15 | the Portalize embed is not wired |
| TS-028-A14, TS-016-A7 | F-2-47 | archive rows carry no outbound link or preview image |
| TS-029-A14, TS-011-A3 | F-2-19 | a heading level is skipped inside the imported privacy policy |
| TS-007-A11 | F-2-46 | no `content/legal/<locale>/`; `/en/legal` renders German bodies |
| TS-005-A9, TS-009-A3, TS-009-A9 | **F-2-39 reopened** | no island renders a skeleton — open row 145 |
| TS-009-A2 | **F-2-56 reopened** | four routes stay fully dynamic by decision (open row 131) |
| TS-009-A8, TS-028-A13 | **F-2-69 (new)** | CLS 0.2197 on `/ueber-uns/archiv` |
| TS-010-A5 | F-2-52 | spec against spec |
| TS-011-A4 | **F-2-41 reopened** | the band is an `aside` but is absent on five pages |
| TS-011-A8, TS-011-A9 | F-2-42 | no OG image on any page |

## New findings raised this run

Three, appended to `state/findings/round-2.md` as **F-2-69 … F-2-71**.
Each carries reproduction steps, the criterion it violates in the
criterion's own words, and the environment it was measured in. The
round-3 open-list items are untouched.

| Finding | Sev | What | AC(s) |
| --- | --- | --- | --- |
| F-2-69 | high | `/ueber-uns/archiv` shifts 262 px at 360 px when the client-only filter chip row appears; CLS 0.2197, local and preview | TS-028-A13, TS-009-A8 |
| F-2-70 | high | the German 404 surface renders an **empty document** without JavaScript; the English one renders in full | TS-004-A4, TS-004 D6 |
| F-2-71 | medium | two e2e assertions race hydration: `archiv.spec.ts` TS-028-A3 fails deterministically against the dev server (the local suite is red), `deine-region.spec.ts` F-2-66 flakes on the preview under parallel load. Both ACs pass when measured by hand | instrument, not product |

Two things this run deliberately did **not** file as new findings:

1. **`/`'s `?ort=` resolution is client-only on a production build.** Same
   mechanism as F-2-49's reopen (the `<Suspense>` boundary F-2-30's fix
   introduced), measured in the same session, recorded in F-2-30's retest
   line rather than split across two ids.
2. **The eight `vercel.live` CSP console errors on the preview.** Already
   F-2-27, open list, preview-only by decision.

## Methodological notes for whoever reads this next

**The dev server and a production build disagree on two conversion-path
routes.** `/dein-ort` and `/dein-ort/starten` perform their `?ort=`
resolution and their forward *in the server response* under `next dev`
(307, full body) and *in the client* under `next build` + `next start` and
on the preview (200, empty document). This was reproduced on a local
production build of the same tree, so it is not a Vercel artefact.
`plan/process.md`'s two-track table assumes the preview only shows what
cannot occur locally; here the local **dev** track hid a defect that both
production builds have. A retest that only ran against `:3100` would have
marked F-2-49 resolved.

**The W3 list is still a floor, not a measure.** Run 1 warned that a
criterion being "covered" by a test id is not evidence. That held again:
TS-028-A3's test passes on the preview and fails against the dev server
without the page behaving differently, and TS-009-A8's suite is green on
24/24 route-viewport pairs while the page it does not measure in CLS terms
is at 0.2197.

**Manual-level criteria.** The four `manual` criteria that failed in run 1
were re-performed: TS-024-A19, TS-026-A17 and TS-016-A13 now **pass**
(F-2-57), TS-028-A14 still **fails** (F-2-47, open list). The twenty
`manual` not-testables are unchanged — the instruments they need (a screen
reader, the eTracker account, Search Console, a content/tone review
record, SRC-001's eight-point check) are still absent, and run 1's open
point about the missing release checklist stands.

## Gate recommendation

**The loop ends here, and gate 2 closes with a named remainder.**

`plan/process.md`'s abort criterion has two branches. The first — "no
critical and no high findings open" — is **not** reached: no critical is
open, but **four high findings are** (F-2-33, F-2-39, F-2-69, F-2-70) plus
one high-severity reopen in medium clothing (F-2-49). The second branch —
"three rounds completed" — **is** reached. The loop therefore stops, and
whatever is open goes to `state/open.md` with the Customer's reasons.

What changed is real and worth stating plainly. The critical finding is
gone: a resident who types her own postcode now sees her own place, an
uncovered postcode now reaches the founding page instead of a stranger's
village, and both 404 surfaces have a working place search. Two of the
five wired conversion goals got their entry back. The English flows read
English where a visitor acts. `pass` went from 234 to 264 and `fail` from
52 to 26, and every one of the 26 has a named owner.

What I would put on `state/open.md`, in the order I would work it:

1. **F-2-49 / the production-build divergence (high in effect).** Two
   conversion-path routes answer a blank document to a JavaScript-less
   visitor on the deployment, and the forward that the whole
   `save-calendar-to-homescreen` path depends on runs only in the client.
   The suite catches it — `pnpm e2e` against the preview is red on
   TS-021-A7 — so this one is cheap to keep honest.
2. **F-2-70.** Same shape, smaller blast radius: the German 404 is blank
   without JavaScript while the English one is fine, which suggests one
   surface, not a policy.
3. **F-2-39 / F-2-56 (open row 145).** Not a fix-round item any more. It
   is a spec decision: TS-009's Suspense/PPR-shell mechanism and this
   codebase's no-JS completeness guarantee cannot both hold for the same
   island, and the run was right not to ship one broken. It needs the
   rendering-and-resilience spec owner, and the divergence in item 1 is
   evidence for the same conversation.
4. **F-2-69.** One page, one shift, a measured number, and the same class
   of work F-2-68 already did successfully on `/`.
5. **F-2-33's tail and F-2-41's five pages.** Both are the residue of a
   fix that did most of its job; both are small and both are visible.
6. **F-2-71.** The local e2e suite is red. `plan/guardrails.md`'s "nothing
   enters the pipeline that is not green locally" is not satisfiable until
   that assertion stops racing hydration.

One judgement I want on the record rather than buried in a table: I read
**F-2-49's reopen as the most consequential result of this run**, above
the two new highs. Not because the defect is large, but because of *where*
it was hiding. The fix was correct against the dev server, the retest
would have passed against the dev server, and the criterion is an
integration-level one that only a production build answers honestly. If
one thing changes in the loop for M5, it should be that the retest's
regression sweep runs `pnpm e2e` against a production build as well as
against `:3100` — which this run did only because the task named the
preview explicitly.

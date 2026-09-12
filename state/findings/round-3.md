# Findings — M5 round 1

Findings of the M5 QA acceptance sweep (run 1) over the **complete
prototype**, both locales, production build. Ids are `F-3-<nr>`,
severities per `plan/process.md`. Protocol: `reports/qa/M5-run-1.md`.

Environments both findings and evidence were taken in:

- **local production build** — `VERCEL_ENV=preview pnpm build &&
  VERCEL_ENV=preview pnpm start` on port 3100, with
  `.next/static/security/csp-script-hashes.json` removed before
  `next start` (`state/open.md` rows 147, 148). Build from `414af32`;
  `HEAD` is `e14cdca`, whose only change is `state/status.md`.
- **preview** —
  `https://schafe-vorm-fenster-5jupiff6w-schafe-vorm-fenster.vercel.app`,
  reached through the automation bypass.

Nine findings from the QA sweep: **0 critical · 0 high · 5 medium ·
4 low.** The PM triage of the four round-3 chaos runs and the M5 UAT
walk adds **F-3-10 … F-3-23** at the end of this file, so the round
carries **23 findings: 0 critical · 0 high · 13 medium · 10 low**.
Every finding here carries a `Round decision`; the round's work split
and the dismissals are `plan/round-4.md`.

**Round 4 (the fix round) — where to retest.** All twelve fix-now findings
carry a `Resolved: <commit>` line in their own section below. Verified on a
local production build (`VERCEL_ENV=preview pnpm build && VERCEL_ENV=preview
pnpm start` on 3100, hash asset removed — rows 147 and 148): `pnpm e2e`
**509 passed / 0 failed / 8 skipped**, including `e2e/a11y.spec.ts` with
`label-content-name-mismatch` enabled and failing on presence. Preview:
`https://schafe-vorm-fenster-ihuc6flgy-schafe-vorm-fenster.vercel.app`,
**502 passed / 0 failed / 15 skipped** through the automation bypass. Two
findings want a human eye at the retest: F-3-10 (QA verifies it either way,
by the round's own instruction) and F-3-12 (not reproducible locally in four
gestures — `state/open.md` row 159).

---

## F-3-1 — The logo link's visible text is not part of its accessible name, on every page

- Severity: medium
- Source: qa-tool (Lighthouse a11y audit, confirmed with axe-core)
- Where: `src/components/logo/logo.tsx` (header and footer instance) ·
  all 24 routes · TS-002-A1, TS-029-A12 (WCAG 2.1 SC 2.5.3 Label in
  Name, Level A)
- Steps:
  1. `VERCEL_ENV=preview pnpm start`, open any route.
  2. Read the logo anchor:
     `<a aria-label="Schafe vorm Fenster — zur Startseite" href="/">`
     containing `<span class="…wordmark"><span class="…line">Schafe
     vorm</span><span class="…line">Fenster</span></span>`.
  3. `document.querySelector('a[class*=logo]').textContent` →
     `"Schafe vormFenster"` — the two line spans are adjacent with no
     whitespace between them, so the accessible-name algorithm's
     flattened text has no space.
  4. `"Schafe vormFenster"` is not a substring of
     `"Schafe vorm Fenster — zur Startseite"`, so SC 2.5.3 fails.
- Expected: TS-002-A1 — "axe-core: zero violations on every page, in
  all three themes"; TS-029-A12 the same for `/rechtliches`.
- Observed: axe-core rule `label-content-name-mismatch`, impact
  **serious**, **48 nodes** — two per route (header + footer) across
  all 24 routes — in every theme this run could reach (light,
  `prefers-color-scheme: dark`, `prefers-contrast: more`). Lighthouse
  reports the same audit as failing on all 12 route/preset runs
  (`/`, `/dein-ort`, `/dein-kalender`, `/ueber-uns`, `/mitmachen`,
  `/ueber-uns/archiv`, `/mitmachen/registrieren`; mobile and desktop).
- Why the repository's own sweep does not see it: `e2e/a11y.spec.ts`
  runs `AxeBuilder.withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"])`
  with axe's default rule set, and `label-content-name-mismatch` is an
  **experimental** rule that axe-core ships `enabled: false`. Enabling
  it explicitly (`options({rules:{'label-content-name-mismatch':
  {enabled:true}}})`) reproduces all 48 nodes against the same build.
  So this is an instrument gap as much as a defect — `F-2-58`'s theme
  gap has a sibling.
- Practical impact, stated so the fix is not over-sold: a sighted
  speech-input user says what she *sees* ("Schafe vorm Fenster"), and
  that string does match the accessible name. The violation is caused
  by markup that omits whitespace between two visual lines, not by a
  wrong label. That is why this is medium, not high.
- Round decision: **fix-now**
- Reasoning: A serious WCAG 2.1 Level A violation on 48 nodes of every route, and
  the cheapest fix in the file — whitespace between the two wordmark line
  spans, or the whole visible string inside the `aria-label`. It turns two
  `fail` verdicts into `pass`. Enable `label-content-name-mismatch` in
  `e2e/a11y.spec.ts` in the **same** change and make the sweep fail on
  *presence* rather than on impact, or TS-002-A1 stays unenforced and the
  next round re-discovers this one.

- **Resolved: f7e7883** (round 4). Whitespace between the two wordmark line spans — `.wordmark` is a column flex container, so a white-space-only anonymous flex item is not rendered and the line boxes are unchanged (measured: both 88.27x15.75 px on `/`). `textContent` is now "Schafe vorm Fenster". `e2e/a11y.spec.ts` enables `label-content-name-mismatch` explicitly and fails on **presence** rather than impact; dropping the impact filter surfaced two pre-existing `moderate` rules (`landmark-unique`, `heading-order`), both named in `KNOWN_OPEN_RULES`, printed on every run and carried as `state/open.md` rows 155 and 156. 48/48 nodes gone; the full sweep is green on all 24 routes at both viewports.

- **Retest (M5 run 2): resolved.** Preview and local production build: the logo anchor's `textContent` is `"Schafe vorm Fenster"` on `/`, `/dein-ort?ort=07743`, `/rechtliches`, `/ueber-uns/archiv` and `/en/legal`, header and footer instance each, and it is a substring of the `aria-label` in both languages (`… — zur Startseite` / `… — to the home page`). Own axe sweep, 24 routes x 3 themes at 360 px with `label-content-name-mismatch` explicitly enabled: **0 nodes of that rule in every theme** (run 1: 48 serious per theme). Lighthouse mobile scores the `label-content-name-mismatch` audit 1 on `/`, `/dein-ort` and `/ueber-uns/archiv`; accessibility category 100 on all four runs. `e2e/a11y.spec.ts` 49/49 in both environments, failing on presence. **What does not follow: TS-002-A1 and TS-029-A12 do not flip to `pass`.** The same presence-based sweep leaves `landmark-unique(moderate)` x4 (`/`, `/dein-ort`, `/en`, `/en/your-place`) and `heading-order(moderate)` x2 (`/rechtliches`, `/en/legal`) in all three themes — `state/open.md` rows 155 and 156, opened by this very change — and both criteria read "zero violations". The 48-node serious violation this finding named is gone; the criteria stay `fail` on their own wording, with a new owner.

---

## F-3-2 — The declared LCP element is lazy-loaded, and two pages put an undeclared image above the fold

- Severity: medium
- Source: qa (browser measurement, `PerformanceObserver` for
  `largest-contentful-paint` at 360 px on the local production build)
- Where: `src/components/media-frame/*` on `/ueber-uns` ·
  `src/components/photo-surface/*` on `/` and `/dein-ort` ·
  TS-003-A8, TS-003 D2
- Steps:
  1. Open `/ueber-uns` at 360 px and read the founder photo's markup:
     `<img alt="Jan-Henrik Hempel, Gründer" loading="lazy"
     decoding="async" … src="/_next/static/media/gruender.…svg">`.
  2. Measure the LCP element on the same load: `IMG`,
     `class="media-frame-module__…__image"`, i.e. exactly the founder
     photo TS-003 D2 declares as `/ueber-uns`'s LCP element.
  3. `grep -oE 'fetchpriority="high"'` over all 24 rendered routes →
     **0 hits**; `loading="eager"` → **0 hits**.
  4. Measure the LCP element on `/` and `/dein-ort`: a `SECTION` with
     `class="photo-surface-module__…__surface"` whose LCP `url` is
     `/_next/static/media/hero.….svg` — an image, above the fold.
- Expected: TS-003-A8 — "Every image below the fold carries
  `loading="lazy"`; the declared LCP element of each page (D2) carries
  `loading="eager"` and `fetchpriority="high"`. No image outside the
  D2 table is eager." TS-003 D2 — "`/` → place-search block
  (text/input, no image)", "`/dein-ort` → place name + next dates
  (text)", and "images never above the fold without being the declared
  LCP element".
- Observed: three separate deviations in one mechanism.
  1. `/ueber-uns`'s declared image LCP carries `loading="lazy"` and no
     `fetchpriority`. It is the only lazy `<img>` on the page.
  2. No image anywhere in the tree carries `loading="eager"` or
     `fetchpriority="high"`, so the attribute half of A8 has no
     satisfied case at all.
  3. On `/` and `/dein-ort` the measured LCP element is the hero
     `photo-surface`, whose image is a CSS `background-image`
     (`--photo-image: url(…)`). D2 declares text for both pages. A CSS
     background cannot carry `loading`/`fetchpriority` at all, so as
     long as the hero surface is painted that way A8's second and third
     clauses are unreachable for those pages.
- Correlation worth recording: the two Lighthouse-mobile routes whose
  LCP is an image score lowest — `/` 96 (LCP 2.8 s) and `/ueber-uns` 97
  (LCP 2.6 s) — while the text-LCP routes score 100 (`/dein-ort` LCP
  1.0 s, `/mitmachen/registrieren` LCP 1.2 s). Same preview, same run.
- Round decision: **fix-now (the `/ueber-uns` half only)**
- Reasoning: Split, because the finding is two things. The `/ueber-uns` half is one
  prop — `priority` on the declared LCP image — and it closes the only lazy
  `<img>` on the page. The `photo-surface` half on `/` and `/dein-ort` is a
  TS-003 D2 conversation, not a page fix: a CSS `background-image` can carry
  neither `loading` nor `fetchpriority`, so A8's second and third clauses are
  unreachable for those two pages as long as the hero is painted that way.
  That half goes **open-list**, to the rendering/performance owner. Name both
  halves in the commit message so the retest can tell which one moved.

- **Resolved: 2392913** (round 4). The `/ueber-uns` half only. `media-frame` sets `loading="eager"` and `fetchPriority="high"` directly instead of Next's `priority`, which is deprecated in Next 16 in favour of `preload` — and `preload` is explicitly not what the docs recommend for a known LCP image. `origin-story` declares it, because it is `/ueber-uns`'s first block and stands on no other route. `e2e/lcp-image.spec.ts` asserts both attributes on the portrait and that no other image on the page is eager, DE and EN. The `photo-surface` half is **not** fixed and is `state/open.md` row 157.

- **Retest (M5 run 2): resolved (the `/ueber-uns` half).** Preview: `/ueber-uns` and `/en/about` render exactly **one** `<img loading="eager" fetchPriority="high">` — the founder portrait, the D2-declared LCP element — and no other image on either page is eager; `/`, `/dein-ort`, `/mitmachen` and `/dein-kalender` render **0** eager images. `e2e/lcp-image.spec.ts` green in both environments. TS-003-A8 stays `fail` on the untouched `photo-surface` half (`state/open.md` row 157).

---

## F-3-3 — Mobile Lighthouse performance is below D7's floor on two of the five D7 routes

- Severity: medium
- Source: qa-tool (Lighthouse 12 runs)
- Where: `/` and `/ueber-uns` (mobile) · TS-003-A1, TS-003 D7, D1
- Steps: `npx lighthouse <route> --only-categories=performance,…` with
  mobile emulation against the preview, and the same five routes
  against the local production build.
- Expected: TS-003-A1 — "Lighthouse CI green on the five D7 routes,
  mobile + desktop"; TS-003 D7 — "Performance < 98 fails the build".
- Observed, preview, mobile: `/` **96**, `/ueber-uns` **97**,
  `/mitmachen` 98, `/dein-kalender` 98, `/dein-ort` 100. Desktop is
  **100** on all five. Against the **local** production build, mobile
  is below the floor on all five: `/` 93, `/dein-kalender` 93,
  `/mitmachen` 95, `/ueber-uns` 96, `/dein-ort` 97.
- Caveat, stated rather than hidden: the preview runs carry the
  deployment-protection bypass in the query, which costs a redirect
  hop that Lighthouse itself prices at "Est savings of 790 ms"
  (`redirects` audit, score 0). The local runs have no such hop and
  score *lower*, so the floor is missed on the merits, not because of
  the bypass. The a11y category is **100** on every one of the 12 runs
  (TS-002-A2 holds).
- Not part of this finding: there is no Lighthouse CI job. That is
  TS-015-A9, which `plan/gate-2-scope.md` §4 keeps out of scope; A1's
  *numbers* are what this finding is about.
- Round decision: **open-list**
- Reasoning: A two-point gap on two of five routes, and the LCP it is made of is 2.8 s
  spent on a placeholder SVG hero that the content follow-up replaces anyway
  — optimising it now measures the placeholder. Performance owner, after the
  prototype. Named at the acceptance rather than quietly fixed, per QA's own
  recommendation.

---

## F-3-4 — `Save-Data: on` changes nothing: the reduced-data path is not built

- Severity: medium
- Source: qa
- Where: `src/components/photo-surface/*`, the image pipeline ·
  TS-003-A6, TS-003 D6
- Steps:
  1. `curl -s http://localhost:3100/ | wc -c` → **117 834** bytes.
  2. `curl -s -H "Save-Data: on" http://localhost:3100/ | wc -c` →
     **117 834** bytes — byte-identical.
  3. The hero image URL is the same in both responses:
     `photo-image:url("/_next/static/media/hero.16oktkbro_590.svg")`.
- Expected: TS-003-A6 — "`Save-Data: on` responses are measurably
  lighter (≥ 30 % image bytes saved)"; TS-003 D6 — hero/scene images
  drop to low-res variants, map module renders as list.
- Observed: **0 %** saved. No request header is read anywhere: no
  `Save-Data`, no `prefers-reduced-data` occurs in `app/` or `src/`.
  The criterion's threshold is `[PROPOSED]`, but the measurement is
  zero, so no threshold makes it pass.
- Round decision: **open-list**
- Reasoning: A6 needs a reduced-data image pipeline that exists nowhere in the tree:
  low-res variants, a request-header read, a list-mode map module. That is a
  work package, not an hour, and the criterion's threshold is still
  `[PROPOSED]`. Named at the acceptance alongside F-3-3.

---

## F-3-5 — The founder photo's `alt` text is German on the English pages

- Severity: low
- Source: qa (the `/en/*` sweep)
- Where: `/en/about`, `/en/about/archive` ·
  `content/pages/ueber-uns/en.md` (image alt) · F-2-33 residue
- Steps: `curl -s http://localhost:3100/en/about | grep -oE
  '<img[^>]*gruender[^>]*>'`
- Expected: an English page renders English text alternatives.
- Observed: `alt="Jan-Henrik Hempel, Gründer"` — the German job noun
  on both English pages. Everything else on those pages is English:
  the visitor-facing dummy-content labels now read "Demo data",
  "Photo wanted" and "Not an exact match · Placeholder" (F-2-33's tail
  is otherwise closed, verified over all twelve `/en` routes).
- Second instance of the same class, recorded here rather than as its
  own id because no user can perceive it: the envoy forms' honeypot
  label reads `Dieses Feld bitte frei lassen` on `/en/your-region/quote`
  too. The wrapper is `aria-hidden="true"` and positioned at
  `x = -9999`, so it reaches neither eye nor screen reader.
- Round decision: **fix-now**
- Reasoning: One `alt` string in one content file, on the English surface a naive
  visitor meets. Low, and `plan/process.md` puts low polish inside M5's
  budget. The honeypot's German label recorded under the same finding stays
  as it is — `aria-hidden`, off-screen, reaching neither eye nor screen
  reader.

- **Resolved: c7392ea** (round 4). The literal becomes a per-locale constant: `/en/about` now renders `alt="Jan-Henrik Hempel, founder"`, `/ueber-uns` is unchanged. The new assertion in `e2e/content-compliance.spec.ts` reads the **attribute**, not the rendered body, so this class cannot hide from the sweep again. The honeypot's German label stays as the finding asks.

- **Retest (M5 run 2): resolved.** Preview: `/en/about` renders `alt="Jan-Henrik Hempel, founder"`, `/ueber-uns` still `alt="Jan-Henrik Hempel, Gründer"`. The image `alt` is fixed; the **same page's proof-card attribution** still reads "Jan-Henrik Hempel, Gründer" on `/en/about`, which is a different node and a new finding (F-3-24).

---

## F-3-6 — Upper-case path variants answer 200 instead of redirecting to the canonical URL

- Severity: low
- Source: qa-tool (`differential-review` over the M5 diff), re-measured
  by hand
- Where: `src/lib/routes/not-found-routing.ts:115` (`normalisePath`
  lower-cases before the servable test) · `next.config.ts` rewrites
  (path-to-regexp, case-sensitive) · TS-004 D1
- Steps:

  | URL | status | bytes |
  | --- | --- | --- |
  | `/DEIN-ORT` | 200 | 82 668 |
  | `/Dein-Ort` | 200 | 82 668 |
  | `/MITMACHEN` | 200 | 75 809 |
  | `/EN/your-place` | 200 | 82 420 |

  Identical on the preview (`/DEIN-ORT` 200, 83 203 bytes).
- Expected: one URL per page (TS-004 D1's inventory), or a redirect to
  the canonical spelling.
- Observed: the case variant serves the full page. It is not a broken
  page and not an empty document: `<html lang="de">` is right and
  `<link rel="canonical" href="https://www.schafe-vorm-fenster.de/dein-ort">`
  points at the canonical URL, so a crawler consolidates correctly.
  What remains is a second, indexable-shaped URL for every route.
- **Correction to the source finding, recorded deliberately.** The
  differential review filed this as *medium*, arguing that these paths
  "match `app/[lang]` with a non-language `lang`, `_locale.ts` calls
  `notFound()`, and under Cache Components that is the zero-character
  `__next_error__` document". Executed against a real production build
  in both environments, **that does not reproduce** — the pages render
  in full. The same applies to the review's second class: `/bogus.json`,
  `/bogus.css`, `/uk/mitmachen.json` and `/_vercel/insights/view` all
  answer **404 with a complete 11.2–11.9 KB document**, not an empty
  one. F-2-70's fix is intact. The reviewer bundled the predicate and
  ran it in isolation; it did not run the server. Same lesson as
  F-2-36's correction: a code-path argument is a hypothesis until it
  has been executed.
- Round decision: **open-list**
- Reasoning: Measured rather than inferred: the case variant serves the full page and
  its `<link rel="canonical">` points at the canonical URL, so a crawler
  consolidates correctly and no visitor sees anything odd. One row in
  `localeRedirects()` whenever a review wants the duplicate gone — the same
  call F-2-8 got, for the same reason.

---

## F-3-7 — The proxy resolves `?ort=` upstream on every request, uncached, in front of the cache — and the page resolves it again

- Severity: medium
- Source: qa-tool (`differential-review` over the M5 diff)
- Where: `proxy.ts:93-99` → `src/lib/routes/place-hop.ts:96` →
  `src/lib/pages/live-anchor.ts` → `src/lib/live/places.ts:89-100`
  (`resolvePlace`) · TS-004 D5, TS-008, TS-009 D4
- Steps (code path; the runtime half is currently masked, see below):
  1. `GET /dein-ort?ort=<value>` reaches `proxy.ts`, which awaits
     `placeHop(pathname, searchParams)` — the F-2-49 fix's hop.
  2. `place-hop.ts:96` calls `resolvePlaceOutcome`, which reaches
     `resolvePlace` in `src/lib/live/places.ts:89`.
  3. `resolvePlace` is **not** wrapped in `resilient()` and carries no
     `use cache` — unlike its siblings at `places.ts:75` and `:141`,
     which both do. It is a direct upstream call per invocation.
  4. `app/[lang]/dein-ort/page.tsx` and
     `app/[lang]/dein-ort/starten/page.tsx` resolve the same parameter
     again in the render; nothing dedups across the proxy→render
     boundary.
- Expected: per-request work on a cached route is a cache read, not an
  upstream call (`state/open.md` row 131's own working assumption,
  TS-009 D4's tiering).
- Observed: on Vercel the proxy runs *before* any cache, so an
  unauthenticated request with a fresh `?ort=` value forces at least
  one uncached upstream call ahead of the cache, plus the render's own.
  The per-call budget is 800 ms (`src/lib/live/config.ts:101-109`).
  No rate limit exists anywhere in the repository (F-2-17 removed the
  only one as per-instance).
- Why it is medium and not high **today**: `state/open.md` row 77 —
  no geo-api read token exists in any environment, so
  `hasRealBackend("communityBySlug")` is false and every one of these
  calls answers from the in-process mock. The finding is latent: it
  becomes real on the day the token is provisioned, which is the same
  day the hardening round touches row 77.
- Secondary, same path: `resilient()` writes `place-search:<value>`
  into the shared runtime cache (`places.ts:76`) keyed on up to 80
  characters of attacker-chosen text, so the tier-2 `last-good`
  entries — the site's own degradation safety net — can be evicted by
  churn.
- Round decision: **open-list**
- Reasoning: Latent by measurement, not by hope: `hasRealBackend("communityBySlug")`
  is false in every environment (`state/open.md` row 77), so every one of
  these calls answers from the in-process mock today. It becomes real on the
  day the token is provisioned — the same day the hardening round touches
  row 77 — and tuning the caching of a mock now would be tuning the wrong
  thing. Carried as `state/open.md` row 150; the shared-cache-key half goes
  with it, and it is the one finding this round hands the hardening round
  with a name.

---

## F-3-8 — `/_vercel/**` is not a reserved prefix, so a platform beacon would 404

- Severity: low
- Source: qa-tool (`differential-review`), re-measured
- Where: `src/lib/routes/not-found-routing.ts:68` (`RESERVED_PREFIXES`
  = `/api/`, `/_next/`, `/.well-known/`)
- Steps: `curl -s -o /dev/null -w '%{http_code}'
  http://localhost:3100/_vercel/insights/view` → **404** (local and
  preview).
- Expected: platform-owned paths pass through the 404 predicate.
- Observed: `/_vercel/insights/view`, `/_vercel/speed-insights/vitals`
  and `/_vercel/image` are classified unservable and rewritten to the
  404 surface. No impact today — neither `@vercel/analytics` nor
  `@vercel/speed-insights` is a dependency — but TS-003 D7 names
  "RUM: Vercel Speed Insights (cookieless)" as the production
  mechanism, and switching it on from the dashboard would silently
  break the beacon with nothing in the repository to explain why.
- Round decision: **fix-now**
- Reasoning: Three strings in `RESERVED_PREFIXES`. TS-003 D7 names Vercel Speed
  Insights as the production RUM mechanism, and switching it on from the
  dashboard would silently break the beacon with nothing in the repository to
  explain why. The cheapest insurance in the list.

- **Resolved: b854e26** (round 4). `/_vercel/` added to `RESERVED_PREFIXES`; `not-found-routing.test.ts` walks `/_vercel/insights/view`, `/_vercel/speed-insights/vitals` and `/_vercel/image`.

- **Retest (M5 run 2): resolved.** The externally visible status cannot decide this one — an unrewritten `/_vercel/**` still 404s, because no route and no enabled platform feature serves it. The response headers do decide it: on the local production build `/dies-gibt-es-nicht` carries `x-middleware-rewrite: /__not-found/404` while `/_vercel/insights/view` carries **no** rewrite header at all, so the proxy no longer classifies platform paths as unservable. `src/lib/routes/not-found-routing.test.ts` 62/62, including the three `/_vercel/**` walks.

---

## F-3-9 — The proxy's place-hop failure arm is silent, and its failure mode is the defect it fixes

- Severity: low
- Source: qa-tool (`differential-review`)
- Where: `proxy.ts:95-99`
- Steps: code read —
  `try { hop = await placeHop(…); } catch { hop = undefined; }`
- Expected: an unexpected failure on a conversion-path hop leaves a
  trace.
- Observed: the arm is empty. `hop = undefined` means the request falls
  through to the render, which is exactly the state F-2-49 described:
  the page's own `redirect()` then produces a 200 with an empty
  document on a production build. The fall-through is deliberate and
  documented ("an upstream that cannot answer must never cost a
  visitor her page"), and it is hard to reach — `resolvePlace`
  swallows its own errors and `searchPlaces` has a tier-3 snapshot —
  but if it is ever reached, nothing anywhere says so. No test makes
  `placeHop` throw.
- Round decision: **fix-now**
- Reasoning: One log line in an empty catch arm on a conversion-path hop, plus the
  test that makes `placeHop` throw. The fall-through itself is correct and
  stays — an upstream that cannot answer must not cost a visitor her page —
  what is missing is that nothing anywhere says it happened.

- **Resolved: 30dd74a** (round 4). One `console.error` with the pathname and the message — and deliberately not `?ort=`, which is attacker-controlled text. `place-hop` is mocked over its own implementation in `proxy.test.ts` so one case can reject while every other test in the file still runs the real hop; the case asserts the log line, the 200, the absent 404 rewrite and the absent `?ort=` value. 34/34.

- **Retest (M5 run 2): resolved.** `proxy.ts:96-102` carries the log line and the reasoning; `proxy.test.ts` 34/34, including the case that mocks `placeHop` to reject and asserts the logged `"placeHop failed"`, the 200, the absent 404 rewrite and that the attacker-controlled `?ort=` value is not in the log.

---

## Checked and cleared — recorded so they are not re-opened

| What | Result |
| --- | --- |
| `label-content-name-mismatch` under forced colours | An earlier pass of this run emulated the third theme with Playwright's `forcedColors: 'active'` and measured **186 serious `color-contrast` nodes** across all 24 routes. That emulation is Windows High Contrast Mode, not TS-002 D4's `prefers-contrast`. Re-run with `contrast: 'more'` alone, the correct emulation, axe reports **zero** violations on all 24 routes. The 186 were an instrument artefact; no finding. |
| Empty-document 404 for case variants and asset-shaped paths | Did not reproduce — see F-3-6. |
| F-2-36's `Host`-spoof path | Unchanged in the M5 diff; there is no `x-forwarded-*` read anywhere in the repository, and the new routing predicates are pure functions of pathname and search params. The correction recorded under F-2-36 stands. |
| Open redirect through the new hop | `place-hop.ts:100-110` returns a registry literal plus `URLSearchParams.toString()`; `//evil.com` and `/\evil.com` are classified unservable and **rewritten**, never redirected. |
| `?ort=` into a `Location` header / reflected XSS | `src/lib/pages/place-parameter.ts:33-45` caps at 80 characters and then applies `/^[\p{L}\p{N} .'’-]+$/u`, which excludes CR, LF, `%` and `<`. |
| ReDoS in the round's new regexes | Timed by the reviewer: `GEO_IDENTIFIER` 0.10–0.18 ms on 32–50 kB adversarial input, `ALLOWED` 0.24 ms on 100 kB, `splitFrontmatter` 0.16 ms on 400 kB. All linear. |
| `semgrep`, important-only, over `app/ src/ scripts/` | 30 scans, 10 rulesets per path (`p/security-audit`, `p/secrets`, `p/javascript`, `p/typescript`, `p/react`, `p/nodejs`, `p/nextjs`, plus trailofbits, elttam and apiiro). **6 findings, all false positives, 0 true positives.** One `react-dangerouslysetinnerhtml` on `src/lib/seo/structured-data/render.ts:33`, where `JSON.stringify(graph).replace(/</g, "\\u003c")` escapes every `<` before the sink and `render.test.ts:13` pins it with a `</script><script>alert(1)</script>` payload; five third-party obfuscation heuristics firing on regex literals and one Vitest block (one of those on a blank line). Caveats: Semgrep Pro was unavailable, so there is **no cross-file taint analysis**; `p/nextjs` is an empty registry pack and failed to load on all three paths. |
| The quote form's missing conversion event | Reproduced as "no event" once, then traced: the probe had filled the **honeypot** as well, and `envoy-form.tsx` then accepts silently and fires nothing — which is F-2-48's fix working. Filling only the four labelled fields fires exactly one `request-licence-quote / completed`, in German **and** English. |
| Focus ring on the place-search input | Eight of 242 tab stops looked ringless because the `<input>` itself carries `outline-style: none` — by design: `.field:focus-within` draws `3px solid rgb(83,27,222)` at `2px` offset on the compound control (`search-field.module.css`). Measured on the parent: ring present. 242/242. |

---

## Still open from round 2, re-measured this run

| Finding | Status now | Evidence |
| --- | --- | --- |
| F-2-49 | **resolved** | production build, both locales: `/dein-ort/starten?ort=beispielwalde` → **307** to `/dein-ort?ort=beispielwalde`; `/dein-ort?ort=99999` and `?ort=abcde` → 307 to `/dein-ort/starten`; `/en/your-place/start?ort=beispielwalde` → 307 to `/en/your-place`. `/?ort=07743` now server-renders Beispielwalde (the run-2 residual is gone). |
| F-2-70 | **resolved** | `/irgendwas` 11 256 bytes · `/irgendwas/irgendwo` 11 269 · `/uk/mitmachen` 11 263, all `<html lang="de">`, all 404, all carrying `<h1>Seite nicht gefunden</h1>` and a place-search form with `action="/dein-ort"`. `/en/does-not-exist` 11 180 bytes, `lang="en"`. |
| F-2-69 | **resolved** | `/ueber-uns/archiv` CLS **0.0000** at 360 px (was 0.2197). Worst CLS anywhere in the 48-pair sweep: **0.0006** (local) / 0.0007 (preview). |
| F-2-71 | **resolved** | `pnpm e2e` 471 passed / 0 failed / 8 skipped against the local production build; 464 passed / 0 failed / 15 skipped against the preview. |
| F-2-72 | **resolved** | titles come from content frontmatter: `/dein-ort/starten` → "Kalender für deinen Ort starten — Schafe vorm Fenster"; `/en/your-place/start` → "Start the calendar for your place — …". |
| F-2-33 | **resolved** | over all twelve `/en` routes: zero hits for `Demo-Daten`, `Foto gesucht`, `Nicht motivgenau`, `Platzhalter`; the English labels "Demo data" and "Photo wanted" are present instead. Residue: the `alt` text of F-3-5. |
| F-2-41 | **narrowed, still open** | `<aside id="context-band">` now renders on **22 of 24** routes. Absent on `/dein-kalender/bestellen` and `/en/your-calendar/order`, which render no band at all, and on registration steps 2–3 (F-2-10). TS-011-A4 says "on every page". |
| F-2-39 / F-2-56 | **unchanged** | `grep -ci skeleton` = 0 on all 24 rendered routes; the build manifest still has four `ƒ` routes. Both are `state/open.md` rows 145 and 131 — a spec decision, not a fix-round item. |
| F-2-42 | **unchanged** | `grep -c og:image` = 0 on all 24 routes. |
| F-2-19 | **unchanged** | heading-level scan of `/rechtliches` and `/en/legal`: one skip, `h4 → h6`, at the same position in both. |
| F-2-46 | **unchanged** | `content/legal/<locale>/` does not exist. The visitor-facing half improved (F-2-74: `/en/legal` now carries English section headings and an English notice that the texts are German only). |
| F-2-47 | **unchanged** | zero outbound `href="http…"` on `/ueber-uns/archiv` other than the two hreflang self-links. |
| F-2-53 | **unchanged** | `/dein-kalender/bestellen?kreis=musterkreis` reads "**1 Orte ausgewählt**"; `/en/your-calendar/order?kreis=musterkreis` reads "**1 places selected**". Low, open list, `plan/process.md` puts it in M5's budget. |
| F-2-27 | **unchanged, preview-only** | one console error per route on the preview (48/48 route-viewport pairs), all the `vercel.live/_next-live/feedback/feedback.js` CSP block. Local: zero console errors on all 48. |

---

# PM triage — chaos runs and UAT (F-3-10 … F-3-23)

Per `.agents/roles/project-manager.md`, every chaos observation and every
UAT signal becomes a finding, a work package, or a one-line dismissal.
The dismissals are in `plan/round-4.md`; what survives as a defect is
below, with the severity the PM assigns (`plan/process.md`) and the chaos
or UAT id it came from. These are **not** QA measurements — they are
naive-eye and persona observations promoted to findings, and the round's
retest verifies them the same way it verifies F-3-1 … F-3-9.

Fourteen findings: **0 critical · 0 high · 8 medium · 6 low.**

---

## F-3-10 — A screen-height blank band sits between the first screen and the footer on every place-result page

- Severity: medium
- Source: uat (M5 walk, phone 360×640 and desktop 1280×800, DE and EN)
- Where: `/dein-ort`, `/en/your-place`, `/dein-ort/starten` — every
  variant walked (dates, no dates, founding page) · `app/[lang]/_islands.tsx`,
  `app/[lang]/_page-frame.tsx` · TS-020, TS-021, TS-008
- Steps:
  1. Open `/dein-ort?ort=07743` on the preview at 360 px.
  2. Scroll past the postcode search, the headline and the date list.
- Observed: roughly a full screen's height or more of blank white before
  the footer starts, with no loading indicator and nothing to suggest the
  page is unfinished rather than broken. UAT reports the content that
  should fill it — the narrative "why this matters" cards and the "Diese
  Woche in der Nähe" section — as **present in the page's text but never
  visible on screen** in any of the walks. Same gap on the founding page,
  between the green "Was es braucht…" band and the footer, where an example
  events section is likewise in the text and not on screen.
- Expected: either the module renders, or it is removed — TS-009 D6's own
  rule ("a module that has nothing is removed, never zeroed").
- Not measured by QA: the M5 sweep did not report this. Whether it is a
  reserved-space height left standing after an empty island, a module
  rendering with `display` or `visibility` lost, or the Suspense/PPR
  tension of `state/open.md` row 145 seen from the visitor's side, is
  exactly what has not been established.
- Round decision: **fix-now — verify first, and QA verifies it either way**
- Reasoning: this is the one thing in the whole triage that a reviewer or
  a first-time user trips over *first*, and it sits on the primary
  conversion path in both languages and on both viewports. It is also the
  one thing nobody has reproduced outside the UAT walk, so it enters the
  round as a **verification** before it enters as a fix: the developer
  reproduces it on the local production build (timebox ~15 minutes). If
  the cause is a reserved-space or empty-module height, he closes it in
  this round. If it turns out to be row 145's Suspense/PPR tension, he
  stops there, writes the evidence into this finding, and it moves to the
  open list with the rendering-and-resilience owner — the round does not
  buy an architecture. Either way **QA verifies this finding at the
  retest**: a blank screen on a conversion path that nobody has measured
  is not something the final acceptance should meet for the first time.

- **Resolved: 6e4d74f** (round 4). **Reproduced, and it is the reserved-space cause, not row 145.** Measured on the local production build at 360x640 on `/dein-ort?ort=07743`: after one `scrollTo(0, scrollHeight)` the value stories (1397 px), "Diese Woche in der Nähe" (647 px), the homescreen block (697 px), the context band and the closing CTA were all `opacity: 0` at full height — 3223 px of blank band. Also on `/`, so it was never place-pages-only. Root cause: `motion-reveal` arms an off-screen section to `opacity: 0` and un-arms it on an `IntersectionObserver` callback, and an `IntersectionObserver` notifies only when `isIntersecting` **changes** — a section that goes from below the viewport to above it inside one scroll step never changes it (`false` -> `false`), so no callback runs and the section stays transparent for the rest of the visit. Every ordinary jump gesture produces it: a flick to the bottom, `End`, an anchor jump, a full-page screenshot (which is how the UAT walk met it). No `<Suspense>` boundary is involved and the markup is server-rendered and present, so row 145's tension is not the cause. Fix: the observer's root now extends far above the viewport, so "intersecting" means "has entered, or has already passed above" and the skipped section's `false -> true` transition is a change the observer must report. `e2e/motion-reveal.spec.ts`: red 10/10 before, green 10/10 after, both DEC-067 viewports on the three routes named plus `/`.

- **Retest (M5 run 2): resolved, measured on the preview and again locally.** At 360x640, after one `scrollTo(0, document.documentElement.scrollHeight)` and again after `End` — the two jump gestures the finding names — the summed height of every `opacity: 0` block taller than 40 px is **0 px** on `/dein-ort?ort=07743` (run 1's measurement: 3 223 px), **0 px** on `/`, on `/dein-ort?ort=10115` and on `/dein-ort/starten?ort=99999`. Repeated at 1280x800 on the same routes plus `/en/your-place?ort=07743`: 0 px. Repeated on the local production build at 360x640 on `/dein-ort?ort=07743`, `/` and `/en/your-place?ort=07743`: 0 px. No transparent block remains anywhere on any of them, at either DEC-067 viewport, in either language. QA verified it either way, as the round instructed: the band is gone.

---

## F-3-11 — The newsletter mock's native submit wipes every other form on the page, resets the flow routes to step 1, and confirms nothing

- Severity: medium
- Source: chaos:form-abandoner (C3-A-01, C3-A-02, C3-A-03 — one defect,
  three manifestations)
- Where: `src/components/newsletter-block/newsletter-block.tsx`, in the
  footer of all 24 routes · `state/open.md` row 22 (`Mock aktiv`) ·
  TS-016 D10, the mock rule (`plan/guardrails.md`)
- Steps:
  1. On `/deine-region/angebot`, fill the quote form but do not submit it.
  2. Scroll to the footer, type a valid address into `#newsletter-email`,
     click "Anmelden".
- Observed: a real full-page GET navigation — this is the only `<form>` on
  the site with neither `action` nor `onSubmit`, so nothing intercepts it.
  Afterwards the quote form is empty; so is the footer contact form.
  On `/dein-kalender/bestellen` the navigation drops `?orte=…` and the
  selection is silently back to zero places; on `/mitmachen/registrieren`
  it drops `?ort=` and `?wer=` and the flow is back at step 1. And the
  "submission" itself produces no banner, no inline message, no sign that
  anything happened. Reproduced at 1280 and 360, DE and EN.
- Expected: the mock rule asks for a labelled **working** mock. A mock that
  resets the page it stands on is not working, and the URL-is-the-state
  design that C-A-04/C-A-05 accepted as correct is exactly what this
  destroys.
- Round decision: **fix-now**
- Reasoning: one mis-click on an ever-present footer widget throws away an
  unsent quote and, on two conversion paths, the flow's own progress. The
  pattern to copy already exists one directory away — `envoy-form-mount`
  calls `preventDefault()` and swaps in a `role="status"` confirmation —
  and copying it closes the missing-feedback half in the same change. The
  input keeps its missing `name`, so no address leaves the browser either
  way; Q-020 (row 22) stays open and untouched.

- **Resolved: 4b923da** (round 4). `newsletter-form.tsx` is the `<form>` as a client component: `preventDefault()`, a synchronous `submitted` ref so a double click cannot get past it, and the form swapped for a `role="status"` confirmation in new dictionary copy that says what did and did not happen. The block stays a server component and keeps the consent sentence. The input still carries no `name`, so no address leaves the browser in any branch, and Q-020 (row 22) is untouched. `e2e/newsletter.spec.ts`: red 3/4 before, green 4/4 after — the URL and an unsent quote form survive, the flow routes keep `?ort=`/`?wer=`, and the confirmation is English on `/en`.

- **Retest (M5 run 2): resolved.** Preview at 360 px, on `/deine-region/angebot`, `/mitmachen/registrieren?ort=07743&wer=verein` and `/dein-kalender/bestellen?kreis=musterkreis`: submitting the newsletter leaves the URL byte-identical (`?ort=`, `?wer=`, `?kreis=` all intact — no navigation at all), replaces the form with a `role="status"` confirmation ("Notiert — hier in der Demo. Das ist die Demo-Fassung des Newsletters: Deine Adresse hat den Browser nicht verlassen …"), and an unsent value typed into the page's other form is still there afterwards. All three manifestations closed. `e2e/newsletter.spec.ts` green in both environments.

---

## F-3-12 — Double-clicking "Suchen" drops the typed postcode on three of the four place-search placements

- Severity: medium
- Source: chaos:hasty-clicker (C3-H-2)
- Where: `src/components/search-field/search-field.tsx` as used on `/`
  (`#ort-suche-fokus`, `#ort-suche-abschluss`), `/dein-ort`, and the true
  404's recovery widget (`#ort-suche-404`). **Not** reproducible on
  `/dein-kalender/bestellen`'s instance (`#ort-suche`) · TS-019-A2, TS-020
- Steps: fill the field with `10115` (confirmed held by `inputValue()`
  immediately before), fire two clicks at the submit button back to back.
- Observed: navigates to `/dein-ort?ort=` — the parameter is there and
  **empty**, the typed value is gone. 100 % reproduction on the 404
  widget across repeat attempts; reproduced once each on `/` and
  `/dein-ort`. A single clean click on the same widget preserves the
  value, so this is a double-submit race, not a general defect.
- Expected: one navigation to `/dein-ort?ort=10115`.
- Round decision: **fix-now**
- Reasoning: data loss on the site's primary entry control, caused by the
  most ordinary impatient gesture there is, on three placements including
  the 404 recovery widget that F-2-31 was written to give visitors in the
  first place. `bestellen`'s instance being unaffected localises it to the
  shared submit path — one component, one file.

- **Resolved: efe16c3** (round 4). `search-form.tsx` is the `<form>` as a client component; the first submit is untouched and every further submit of the same document is cancelled, with the flag as a synchronously-set ref. Without JavaScript it is a plain `<form method="get">` again. **Recorded honestly: not reproduced locally.** `e2e/search-double-submit.spec.ts` tried four gestures (two synchronous `click()`s in one task, `dblclick`, two Playwright clicks with and without a beat) against `next dev` and against the local production build and the value survived every time, so the spec is a regression net that is green on both sides of the change rather than something this round proved red. One observation from writing it, which may be a second mechanism: on the production build `/` transiently renders a **third** search input during hydration, carrying the same `id` as block 1's — `state/open.md` row 158.

- **Retest (M5 run 2): resolved on the preview, with the reservation row 159 asked for.** The finding's own gesture, re-driven on the preview against the widget it reproduced on 100 % of the time (`#ort-suche-404` on `/dies-gibt-es-nicht-xyz`, 360 px): **five** independent double-click runs plus a single-click control, all six navigating to `/dein-ort?ort=10115` with the typed value intact — never `?ort=` empty. `e2e/search-double-submit.spec.ts` 4/4 against the preview in three isolated runs. So row 159's open question is answered in the same direction the developer recorded: the described mechanism does not reproduce on the preview at HEAD either, and the guard is a net rather than a proven cure. One caveat that belongs here: in one of three **full** preview suite runs this case timed out waiting for any navigation at all; it did not reproduce in isolation and is carried as F-3-26.

---

## F-3-13 — Asset-shaped paths that match no file render the empty `__next_error__` shell, and the tree ships no favicon at all

- Severity: medium
- Source: chaos:boundary-tester (C3-B-1)
- Where: `src/lib/routes/not-found-routing.ts` (`isUnservablePath` →
  `isAssetPath`), `src/lib/routes/landing-domain.ts`
  (`ASSET_EXTENSIONS`, `landingDomainBlocks`) · no `public/`, no
  `app/icon.*` anywhere in the tree · `state/open.md` row 153 · F-2-70
- Steps: `curl .../favicon.ico` (also `/does-not-exist.js`, `/nope.css`,
  `/nope.png`, `/robots.txt.map`).
- Observed: 404 with `content-type: text/html` and a ~11.9 KB
  `<html id="__next_error__">` body — preload links, scripts and a Flight
  payload, no literal `<h1>` in the rendered HTML. The visible "Seite
  nicht gefunden" text exists only serialized inside a
  `self.__next_f.push([…])` string. By contrast `/dies-gibt-es-nicht`,
  `/.well-known/does-not-exist` and `/en/nonexistent-page` all render the
  full styled page — F-2-70's fix works for those. `isAssetPath()` returns
  "servable, leave it alone" for anything ending in an asset extension
  regardless of whether a file exists, so those paths never reach the
  `NOT_FOUND_PATH` rewrite.
- Why it is not hypothetical: the repository ships no `public/favicon.ico`
  and no `app/icon.*`, so **every browser's automatic `GET /favicon.ico`
  on every page load hits this today**.
- Round decision: **fix-now**
- Reasoning: F-2-70 is the round-2 fix this reopens through a door nobody
  checked, and the door is opened by every single page view. Two halves,
  one item: stop exempting asset-shaped paths that match no file from the
  404 rewrite, and **ship the real favicon** from the brand package —
  `@schafe-vorm-fenster/brand-design` exports `./logo.svg` and
  `./logo.png` (`logos/Schafe-vorm-Fenster_Logo_V2.1.*`) — as `app/icon.*`.
  That asset is the brand owner's own file, not generated and not stand-in
  data, so neither the mock rule nor the dummy-content rule applies to it
  and it needs no badge. `state/open.md` row 153 (the closed
  `ASSET_EXTENSIONS` list) rides along as the test that walks `public/`.

- **Resolved: 9591a02** (round 4). Both halves. The 404: `isServableAssetPath()` replaces `isAssetPath()` in the 404 predicate — `/_next/**` always, otherwise a file this repository really ships (`PUBLIC_FILES`, empty, because `public/` does not exist). `/favicon.ico`, `/does-not-exist.js`, `/nope.css` and `/robots.txt.map` now answer 404 with the complete styled document **with JavaScript disabled**, asserted in `e2e/routes.spec.ts`. Row 153 rides along: `landing-domain.public-files.test.ts` walks `public/` and fails if a file in it would be 404'd. The icon: the brand package's `./logo.svg` subpath as `metadata.icons` in the root layout, so every page carries `<link rel="icon">` and the asset resolves 200. **Not** `app/icon.*` — TS-017-A6 forbids committing a logo file (`pnpm check:brand` enforces it) and the generated-icon Route Handler cannot read the package's bytes back, because Turbopack rewrites a `require.resolve` of an `.svg` into an asset reference and the read fails at runtime (measured). Trap worth naming: Next 16 resolves an `.svg` import to the emitted **URL string** while the ambient declaration still types it as `StaticImageData`, so reading `.src` yields `undefined`, which throws inside Next's metadata resolution and silently drops the whole `<head>` block.

- **Retest (M5 run 2): resolved, both halves.** Preview: `/favicon.ico`, `/does-not-exist.js`, `/nope.css`, `/nope.png` and `/robots.txt.map` each answer **404** with an 11 716-11 725 byte document that contains no `__next_error__` and does contain the rendered "Seite nicht gefunden" — the complete styled 404, not the empty shell. The icon: `<link rel="icon" href="/_next/static/immutable/media/Schafe-vorm-Fenster_Logo_V2.1.<hash>.svg" type="image/svg+xml">` is in `<head>` on `/`, and the asset answers 200 `image/svg+xml`. `e2e/routes.spec.ts` green in both environments.

---

## F-3-14 — The registration flow's own postcode search answers empty and junk input with nothing at all

- Severity: medium
- Source: chaos:boundary-tester (C3-B-2)
- Where: `/mitmachen/registrieren`, `/en/take-part/register`, step 1 of 3
  · TS-023
- Steps: click "Suchen"/"Search" with the field empty; separately, fill it
  with 80 characters of junk and click.
- Observed: in both cases the page silently re-renders itself with `?ort=`
  (empty, or the junk string) appended. No validation message, no
  "not found" state, no visible change. The field carries no `required`,
  so `element.validationMessage` is empty and native validation never
  engages either.
- Expected: the same value one click away on `/dein-ort?ort=99999` gets a
  designed empty state ("99999 steht noch nicht im Dorfkalender." plus a
  call to action). The registration widget has no equivalent for either
  case.
- Round decision: **fix-now**
- Reasoning: step 1 of a conversion path is the worst place on the site
  for a control that does nothing visible. The empty state to reuse
  already exists and is already translated; this is wiring an answer, not
  designing one.

- **Resolved: 6c48a24** (round 4). Two answers, neither newly designed. The empty field: `required`, threaded through `place-search` and `search-field` as an opt-in prop and set on this one instance — off elsewhere, because an empty search on `/` and `/dein-ort` is TS-020-A9's own designed row. The unresolvable value: the founding page's acknowledgment slot, read from the artifact. One constraint the fix had to bend to — TS-023-A5 says an unresolvable value is "echoed only in the search field", and the slot's "{ort} steht noch nicht…" variant would have put it in body text (`e2e/pages/registrieren.spec.ts` caught exactly that), so the heading is the artifact's own **placeless** fallback and the typed value travels only in the CTA's URL, to the one page TS-021 D6 lets name it. `e2e/registrieren-empty.spec.ts`: red 4/5 before, green 5/5 after; `registrieren.spec.ts` stays 12/12.

- **Retest (M5 run 2): resolved.** Preview, both languages. Empty field: the input now carries `required`, `validationMessage` reads "Please fill out this field.", and the click does not change the URL — the silent self-re-render is gone. 80 characters of junk: `/mitmachen/registrieren?ort=xxxx…` renders the founding page's acknowledgment — "Dieser Ort steht noch nicht im Dorfkalender. Das lässt sich ändern — mit einem WhatsApp-Foto vom nächsten Flyer." plus the "deinen Ort eintragen" call to action; `/en/take-part/register` the English equivalent. The typed value appears only in the search field's `value` attribute and in the CTA's URL, never in body text, so **TS-023-A5 keeps its `pass`** — re-checked, because the fix bent to that constraint. `e2e/registrieren-empty.spec.ts` and `e2e/pages/registrieren.spec.ts` green in both environments.

---

## F-3-15 — "KEIN NACHWEIS" and its sentence are German on the English pages

- Severity: low
- Source: uat (M5, `/en/take-part`)
- Where: `src/components/empty-proof-slot/empty-proof-slot.tsx:28`
  (`badgeLabel = "Kein Nachweis"`),
  `src/components/objection-list/objection-list.tsx:44`
  (`proofEmptySentence = "Für diesen Kanal liegt uns noch kein Nachweis
  vor."`), `app/[lang]/ueber-uns/page.tsx:262` (German literal) ·
  F-2-33 residue, same class as F-3-5
- Observed: an English visitor reading an otherwise fully translated page
  meets "KEIN NACHWEIS / Für diesen Kanal liegt uns noch kein Nachweis
  vor." partway down. The badge beside it ("FOTO GESUCHT" → "PHOTO
  WANTED") was translated in round 3; this one was not.
- Round decision: **fix-now**
- Reasoning: the same class and the same cost as F-3-5 — two hard-coded
  German defaults and one literal, moved into the dictionary the rest of
  the site already uses. Low, and `plan/process.md` puts low polish inside
  M5's budget.

- **Resolved: df1c867** (round 4). A new `proof` register in the dictionary, beside `media`'s. `empty-proof-slot` takes a `locale`, `objection-list` hands one down, and all six callers pass the page's. `/en/take-part` and `/en/about` now read "No evidence" / "We have no evidence for this channel yet." / "No cleared quote from an organiser is available yet."; the German pages are unchanged. The sweep's German-badge list gains both strings as the **exact** strings the components rendered — the bare word "Nachweis" is unusable there, because `/en/legal` carries the German legal bodies by design (row 151) and one of them contains it. 57/57.

- **Retest (M5 run 2): resolved.** Preview: `/en/take-part` renders "No evidence" and "We have no evidence for this channel yet."; `/en/about` renders "No cleared quote from an organiser is available yet."; the German pages are unchanged ("Kein Nachweis" / "Für diesen Kanal liegt uns noch kein Nachweis vor." on `/mitmachen`). The two components named here are clean. The **class** is not closed — a full sweep of all twelve `/en/*` routes found German interface strings in three other places, filed as F-3-24.

---

## F-3-16 — The true 404 has no skip link and no header or nav landmarks

- Severity: low
- Source: chaos:keyboard-only (C3-K-2)
- Where: `app/global-not-found.tsx` — the surface any genuinely unknown
  URL reaches; it renders its own `<html><body>` and bypasses
  `SiteChrome` entirely · TS-002, C-K-8
- Steps: open `/dies-gibt-es-nicht-xyz`, press Tab once.
- Observed: focus lands directly on the postcode input. The full sequence
  is input → "Suchen" → 4 job-band links → "Zur Startseite" → cycle: seven
  stops, against 26–32 on a routed page. No "Zum Inhalt springen", no
  header navigation, no breadcrumb. Every routed page, including the
  in-tree localized 404, has the skip link first.
- Round decision: **fix-now, last in the round, and only if it stays cheap**
- Reasoning: the site is otherwise consistent about the skip link, and
  consistency on an a11y affordance is worth an hour — but only if
  `global-not-found.tsx` can take the anchor and a target id without
  pulling `SiteChrome` into a file that bypasses it deliberately. If it
  costs more than that, it stops and moves to the open list: seven tab
  stops with no navigation to skip past is very little harm, and breaking
  a deliberate chrome bypass to satisfy a consistency argument is a worse
  trade than leaving it.

- **Resolved: 03fce55** (round 4). It stayed cheap: one component and one import. `SkipLink` at the top of `global-not-found.tsx`'s `<body>`; `#main` already existed, so the target needed nothing, and `SiteChrome` is **not** pulled in — the surface still has no header and no navigation, which is what keeps it a complete document. Asserted in both languages in `e2e/routes.spec.ts`: one Tab, and the focused element is the anchor to `#main`.

- **Retest (M5 run 2): resolved.** Preview: on `/dies-gibt-es-nicht-xyz` one Tab focuses `<a href="#main">Zum Inhalt springen</a>` and `#main` exists; on `/en/does-not-exist-xyz` it focuses `<a href="#main">Skip to content</a>` with `lang="en"`. The surface still renders no header and no navigation, so the deliberate `SiteChrome` bypass is intact.

---

## F-3-17 — The quote form's spam guard says nothing at all on the retry click inside its own window

- Severity: medium
- Source: chaos:hasty-clicker (C3-H-1), corroborated by uat
- Where: `src/components/envoy-form-mount/*` (`envoy-form.tsx`'s timing
  guard) on `/deine-region/angebot`, `/en/your-region/quote` ·
  `state/open.md` row 7 (`Mock aktiv`, Q-022)
- Steps: fill the form and submit within ~2 s of load; the guard shows
  "Das ging sehr schnell. Sieh die Angaben noch einmal durch und schick
  sie dann ab." Click "Absenden" again 500 ms later.
- Observed: no new feedback of any kind. The same static warning stays on
  screen, no event fires, nothing says the second click also did not
  count or how much longer to wait. The window measures elapsed time since
  load, not since the warning, so the retry lands in a dead zone. Probed:
  clicks at 2 s, 4 s and 6 s all succeed normally. UAT met the same
  message on a first honest submit and read it as the form suspecting her
  of being a robot.
- Round decision: **open-list**
- Reasoning: the guard itself is right and this round should not weaken
  it. What is missing is a second message, and it sits inside the timing
  contract of the envoy **mock** — Q-022 (row 7) has not delivered the
  real widget's spam-protection behaviour, and whatever cool-down
  messaging is written now is re-decided the day it lands. Goes to the
  hardening workstream with row 7, and the wording goes to the content
  workstream with it.

---

## F-3-18 — Reloading immediately after "Weiter" on order step 3 silently swallows the step

- Severity: medium
- Source: chaos:hasty-clicker (C-H-9, re-reproduced unchanged in round 3)
- Where: `/dein-kalender/bestellen`, step 3 → 4 · TS-025
- Steps: click "Weiter" on step 3, reload before the navigation settles.
- Observed: lands back on step 3, **0** conversion events, all fields
  empty, and no toast or message telling the visitor the click did not
  count.
- Round decision: **open-list**
- Reasoning: a reload fired inside the click-to-navigation window of a
  plain GET flow genuinely loses the navigation — the browser re-requests
  the URL it still holds. Making the click survive it means moving the
  step transition off a GET, which is TS-025's own design and not a fix
  round's call. Recorded with a name so the usability workstream and the
  TS-025 owner inherit it instead of re-finding it.

---

## F-3-19 — Order step 3 accepts entirely empty invoice fields and proceeds to step 4

- Severity: medium
- Source: uat (M5, desktop)
- Where: `/dein-kalender/bestellen` step 3 ("Wohin geht die Rechnung?"),
  `src/components/envoy-form-mount/*` · `state/open.md` row 7, TS-025
- Observed: clicking "Weiter" with organisation, contact, email and
  address all blank moves the flow to step 4. Nothing marks a field
  required and nothing stops the visitor.
- Round decision: **open-list**
- Reasoning: those fields live in the envoy mount, and field-level
  validation is precisely the part of the widget contract Q-022 has not
  delivered (row 7). Writing `required` into a mock now writes a rule the
  real widget re-decides, on a flow that is labelled a mock end to end and
  stores and sends nothing. Goes to the hardening workstream with row 7,
  next to F-3-17 and F-3-18 — all three sit on the same step, and whoever
  takes that step should take all three.

---

## F-3-20 — The footer's two-column grid sends tab order 153 px back up the page at ≥768 px

- Severity: low
- Source: chaos:keyboard-only (C3-K-1)
- Where: `src/components/site-footer/site-footer.module.css` — `.inner`
  becomes `grid-template-columns: repeat(2, 1fr)` at ≥768 px with no
  explicit order, so placement is DOM order
- Observed: on `/` at 1280, tab stop 24 is the newsletter block's consent
  link (document Y ≈ 5318) and stop 25 is "Impressum" in the legal nav
  (Y ≈ 5165). At 360 px the footer is a single flex column and the jump is
  absent.
- Round decision: **open-list**
- Reasoning: column-major tabbing through a multi-column grid is the
  standard, correct behaviour — nothing is skipped and nothing traps, and
  the chaos run declined to assert a severity for exactly that reason.
  Changing it means giving the footer an explicit grid order, which is a
  layout decision for the design-system owner, not an hour in the last
  round.

---

## F-3-21 — Back-button recovery of unsubmitted input works on one form and not on the other

- Severity: low
- Source: chaos:form-abandoner (C3-A-04)
- Where: `/mitmachen/registrieren` step-1 postcode field versus
  `/deine-region/angebot`'s quote fields
- Observed: type into the registration postcode field, navigate to `/`,
  press Back — the value is gone. Do the same on the quote form — the
  values are still there. Same gesture, same session, seconds apart, two
  outcomes. Distinct from C-A-04/C-A-05, which are about a genuinely new
  session and are settled as by design.
- Round decision: **open-list**
- Reasoning: this is browser form-restoration behaviour meeting two
  different implementations, not a defect in either — the fields that
  survive are React state, the one that does not is an uncontrolled input
  with no `defaultValue`. Making it symmetric means carrying the search
  value in the URL or in state at every placement, a consistency decision
  for the usability workstream.

---

## F-3-22 — 22 px of residual desktop layout shift between first paint and settle on `/`

- Severity: low
- Source: chaos:hasty-clicker (C3-H-3, the residue of C-H-12)
- Observed: footer-region controls still move up to 22 px at 1280×800
  between a bounding-box snapshot ~50 ms after DOMContentLoaded and one
  after networkidle. Was 174 px at gate 2. Mobile is 0 px, fully resolved.
- Round decision: **open-list**
- Reasoning: an 87 % reduction already landed, and the criterion that
  measures this — CLS — reads 0.0006 worst-case across the whole 48-pair
  sweep. Below the bar for the last round's one hour.

---

## F-3-23 — "Weiter · Moment …" is the only progress signal for several seconds on order step 3

- Severity: low
- Source: uat (M5, desktop)
- Where: `/dein-kalender/bestellen` step 3 → 4
- Observed: the button relabels itself and nothing else on the page
  changes for a few seconds. UAT could not tell whether the click had
  registered.
- Round decision: **open-list**
- Reasoning: a button that says "Moment …" *is* a progress signal; what
  UAT wanted is a second one. Polish, and it sits on the same step as
  F-3-18 and F-3-19 — the usability workstream should take the three
  together rather than have a fix round touch the step once for the
  cheapest of them.

---

# New findings — M5 run 2 (the final retest)

Three findings raised by the retest run, none of them a reopening of a
round-4 fix: **0 critical · 0 high · 2 medium · 1 low.** Protocol:
`reports/qa/M5-run-2.md`. Environments: the local production build
(`VERCEL_ENV=preview pnpm build && VERCEL_ENV=preview pnpm start` on 3100,
hash asset removed — `state/open.md` rows 147, 148) at `691f1e8`, and
`https://schafe-vorm-fenster-ihuc6flgy-schafe-vorm-fenster.vercel.app`
through the automation bypass.

---

## F-3-24 — German interface strings on the English order flow and on `/en/about`

- Severity: medium
- Source: qa (the `/en/*` sweep of run 2 — all twelve English routes
  rendered in a browser and read for German text, not only for the four
  dummy-content badge strings run 1 checked)
- Where: `src/components/step-indicator/step-indicator.tsx:27` ·
  `src/components/scope-picker/scope-picker.tsx:59-60` ·
  `app/[lang]/ueber-uns/page.tsx:229, 231, 262` ·
  `/en/your-calendar/order` (all four steps), `/en/about` ·
  F-2-33 residue, same class as F-3-5 and F-3-15
- Steps:
  1. Open `/en/your-calendar/order` on the preview at 360 px, then
     `?kreis=musterkreis`, `&schritt=2`, `&schritt=3`.
  2. Read the step badge and the scope picker's empty state.
  3. Open `/en/about` and read the proof cards and the proof stream's
     `aria-label`.
- Expected: an English page renders English interface text. The English
  strings for two of these already exist and are used elsewhere —
  `/en/take-part/register` renders "Step 2 of 3", `/en/take-part` and
  `/en/your-region` render "Example feedback" and "County commissioner,
  Example county Musterkreis".
- Observed, measured on the preview:
  1. **`/en/your-calendar/order`, every step: "Schritt 1 von 4",
     "Schritt 2 von 4", "Schritt 3 von 4"** — byte-identical to the German
     control on `/dein-kalender/bestellen`. `step-indicator` falls back to
     `` `Schritt ${step} von ${total}` `` when no `label` is passed; the
     registration flow passes the English override, the order flow does
     not. This is a wired conversion path (`buy-calendar-licence`).
  2. **`/en/your-calendar/order` step 1, the empty scope picker:** "Noch
     keine Auswahl." and "Füge oben Orte oder eine Postleitzahl hinzu." —
     the two German default parameter values of `scope-picker`.
  3. **`/en/about`:** the proof stream renders `aria-label="Belege"`; the
     founder proof card's attribution reads "Jan-Henrik Hempel, Gründer"
     (a different node from F-3-5's image `alt`, which is fixed) and its
     context line "Beleg: founder-former-volunteer-mayor (cleared)"; three
     further attributions read "Beispielhafte Rückmeldung",
     "Bürgermeisterin, Beispielgemeinde Musterdorf", "Beispielhafte
     Presseerwähnung" and "Beispielzeitung, Regionalressort".
- Not this finding, recorded so the boundary is clear: the German legal
  bodies on `/en/legal` (row 151, by decision), the German event fixture
  titles (rows 90/91, dummy content), and the two German testimonial
  quotes on `/en/about`, which are quotations from German speakers.
- Why it is not a verdict change: no acceptance criterion binds "every
  interface string follows the page language" — TS-001-A2 checks
  `<html lang>` and link prefixes only. The same was true of F-2-33,
  F-3-5 and F-3-15, all of which were handled as findings.
- Severity reasoning: `plan/process.md` — "visible defect, spec deviation
  without AC" is medium, and one leg sits on a wired conversion path in
  the surface the Customer named as the blind spot.

---

## F-3-25 — `/ueber-uns/archiv` measures CLS 0.279 on the preview under concurrent load

- Severity: medium
- Source: qa (regression sweep, `e2e/layout-stability.spec.ts` against the
  preview)
- Where: `/ueber-uns/archiv` at 360x800 · `src/components/archive-filter/**`,
  `src/components/chip/**` · `state/open.md` rows 146 and 154 · F-2-69,
  TS-009-A8, TS-028-A13
- Steps:
  1. `E2E_BASE_URL=<preview> npx playwright test e2e/layout-stability.spec.ts
     -g "CLS < 0.1 — /ueber-uns/archiv" --repeat-each=12 --workers=8`
  2. Read the reported values.
- Observed: **4 of 12 runs fail at CLS 0.2786-0.2795** — above the 0.1
  budget, and the same order of magnitude as F-2-69's original 0.2197 on
  the same page. The same command against the local production build:
  **12/12 pass.** Every isolated measurement is clean: six isolated
  repeats on the preview pass, three fresh single-context loads measure
  CLS 0.0000-0.0003, and so do three with 300 ms / 400 kbps throttling,
  one with every `woff2` delayed 2.5 s, one with every `.js` chunk delayed
  2.5 s, and eight independent concurrent browsers. Lighthouse mobile on
  the preview reports CLS **0** for this route.
- So what is measured is not a single visitor's experience but the
  criterion's **stability on the environment the acceptance runs on**, and
  the mechanism was not isolated by this run — it does not reproduce
  outside Playwright's own worker pool.
- Expected: TS-009-A8 — CLS < 0.1.
- Why the verdicts do not move: TS-009-A8 and TS-028-A13 keep their `pass`,
  because every measurement taken the way run 1 took them (one page load,
  local and preview, plus Lighthouse) is ≤ 0.0007. Recorded as a finding
  rather than as a verdict change, and named at the acceptance.
- Worth pairing with `state/open.md` row 154, which predicted exactly this
  return path: `ReservedChipRow` hand-copies `chip.module.css`'s class
  composition, and "if `Chip` changes its classes … the 262 px shift
  returns — and nothing fails, because jsdom has no layout".

---

## F-3-26 — `pnpm e2e` is never fully green against the preview in a single run

- Severity: low
- Source: qa (regression sweep)
- Where: the preview environment · `e2e/layout-stability.spec.ts`,
  `e2e/search-double-submit.spec.ts` · rows 146, 159 · F-3-25
- Steps: `E2E_BASE_URL=<preview> pnpm e2e`, three times.
- Observed: **501 passed / 1 failed / 15 skipped, all three times**, with a
  different case failing each time:
  1. `search-double-submit.spec.ts` — F-3-12's `/dies-gibt-es-nicht-xyz`
     case, 30 s timeout on `waitForURL(/[?&]ort=/)`: the double click
     produced no navigation at all.
  2. `layout-stability.spec.ts` — `TS-009-A8: CLS < 0.1 — /ueber-uns/archiv
     at 360x800`, 0.2795 → F-3-25.
  3. `layout-stability.spec.ts` — `TS-009-A8 — /mitmachen ≤ 8px cumulative
     shift at 1280x800`, 32 px → the known residual of `state/open.md`
     row 146, which also failed 1 of 6 isolated repeats on the preview and
     0 of 6 locally.
  Every one of them passes in isolation: F-3-12's four cases 4/4 in three
  separate runs, the archive CLS case 6/6, `/mitmachen` 5/6. The local
  production build ran the full suite **509 passed / 0 failed / 8 skipped**
  twice, with no failure of any kind.
- Expected: the round-4 report records the preview at "502 passed / 0
  failed / 15 skipped". This run could not reproduce a zero-failure preview
  run in three attempts.
- Why it matters at this gate rather than as housekeeping: the preview is
  the instrument the final acceptance is read from, and a suite that fails
  one case per run — a different one each time — cannot distinguish a
  regression from noise. It is the same shape as run 1's own methodological
  note that a green suite is not the criterion.
- Severity reasoning: `plan/process.md` — nothing a visitor meets, and both
  underlying measurements are already carried (rows 146, 159, F-3-25), so
  `low`: polish on the instrument, for the open list.

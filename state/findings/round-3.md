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

Nine findings: **0 critical · 0 high · 5 medium · 4 low.**

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

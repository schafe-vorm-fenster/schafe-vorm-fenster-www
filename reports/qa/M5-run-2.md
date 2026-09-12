# M5 — QA Acceptance Run 2 (final retest, complete prototype)

The retest step of `plan/process.md`'s loop, run as Phase 4 of
`.agents/playbooks/playbook-qa-acceptance-run/SKILL.md`: **exactly the
twelve fix-now findings of `plan/round-4.md`**, each re-driven from the
steps its own finding records, plus a regression sweep over the M5 scope.
Both locales, production builds only, two environments.

Scope of the retest list: F-3-1, F-3-2 (the `/ueber-uns` half), F-3-5,
F-3-8, F-3-9, F-3-10, F-3-11, F-3-12, F-3-13, F-3-14, F-3-15, F-3-16.
Baseline for every delta: `reports/qa/M5-run-1.md` (285 / 28 / 45).

Skills loaded, both mandatory ones: `webapp-testing` (every browser walk
in this run is a Playwright-driven session against a production build)
and `web-design-guidelines` (fetched fresh; the a11y/focus/forms/images
rules are the audit list behind the a11y and form checks). The M4/M5
security sweep (`semgrep`, `differential-review`) was run at run 1 over
the milestone diff and is not repeated here — the round-4 diff is twelve
findings' worth of change, and `differential-review` over it belongs to
the developer's own step, which `plan/round-4.md` records. **No fix was
made anywhere in this run.**

## Environment and evidence commands

| What | Result |
| --- | --- |
| Tree | `next-2026` @ `691f1e8`, pulled clean. Two pre-existing working-tree modifications under `concept/` left untouched, as in run 1 |
| Local production build | `pnpm stop; VERCEL_ENV=preview pnpm build && VERCEL_ENV=preview pnpm start` on 3100, with `.next/static/security/csp-script-hashes.json` **removed** before `next start` — `state/open.md` rows 147 and 148, both honoured |
| Preview | `https://schafe-vorm-fenster-ihuc6flgy-schafe-vorm-fenster.vercel.app`, bypass header from `.env.local`. Confirmed to carry the round-4 fixes (English founder `alt`, `<link rel="icon">`, the `role="status"` newsletter confirmation) |
| `pnpm build` | **exit 0** · 334 distinct CSP hashes from 445 inline scripts across 39 pages (run 1: 320 / 445 / 39) · manifest unchanged in shape: the same four `ƒ` routes (`/dein-ort`, `/dein-ort/starten`, `/mitmachen/registrieren`, `/dein-kalender/bestellen` — open row 131), the same `◐`/`○` split |
| `pnpm check` | **exit 0** — 9 static guards, 55 static tests, **1 085 unit + integration tests (1 skipped)** across 122 files, typecheck, lint. Run 1: 1 073 tests. `check:content` still emits its 40 dummy-content warnings, `check:specs` the W3 coverage warning |
| `pnpm e2e`, local production build | **509 passed · 0 failed · 8 skipped** (run 1: 471 / 0 / 8). Re-run once, identical |
| `pnpm e2e`, preview | **501 passed · 1 failed · 15 skipped — three times, with a different single case failing each time** → **F-3-26**. Run 1: 464 / 0 / 15 |
| `e2e/a11y.spec.ts` | 49/49 green in both environments, with `label-content-name-mismatch` enabled and the sweep failing on **presence**. The printed known-open set is `landmark-unique(moderate)` and `heading-order(moderate)` only — rows 155, 156. **0 serious, 0 critical anywhere** |
| `e2e/privacy.spec.ts` | 25/25 green in both environments |
| `e2e/layout-stability.spec.ts` | 39/39 green locally (and 12/12 on a 12×8 stress repeat of the archive case). On the preview: 39/39 in one isolated run, 38/39 in another → rows 146 / F-3-25 |
| Own axe sweep, 24 routes × 3 themes at 360 px, WCAG 2.1 A/AA tags **plus** `label-content-name-mismatch` | light, `prefers-color-scheme: dark`, `prefers-contrast: more`: **identical in all three — `landmark-unique(moderate)` ×4, `heading-order(moderate)` ×2, nothing else, no serious, no critical.** Run 1 measured 48 serious `label-content-name-mismatch` nodes per theme |
| Lighthouse mobile, preview, all categories | `/` perf **96** / 95 on a repeat · `/dein-ort` **100** · `/ueber-uns/archiv` **97**. Accessibility **100** on every run, `label-content-name-mismatch` audit score **1**. Best practices 92 (the `vercel.live` CSP block, F-2-27). SEO 61: the preview's own `noindex` (TS-015-A1) plus a `robots-txt` deduction that is Deployment Protection answering Lighthouse's unauthenticated `/robots.txt` fetch with a 302 to the Vercel login — a protection artefact, not a defect (`/robots.txt` answers 200 `text/plain` through the bypass in both environments) |
| Conversion-path walks | all five wired German goals at 360 px on the preview in a real browser, plus the two English repeats and the English quote submission |
| `/en/*` sweep | all twelve English routes rendered and read for German text — not only for the four dummy-content badge strings run 1 checked → **F-3-24** |

## The twelve retests

Each was re-driven from the steps in its own `state/findings/round-3.md`
section, on the preview; evidence lives with the finding as a
`Retest (M5 run 2):` line.

| Finding | Sev | Retest | The measurement that decides it |
| --- | --- | --- | --- |
| F-3-1 | medium | **resolved** | `a[class*=logo]`'s `textContent` is `"Schafe vorm Fenster"` and a substring of the `aria-label`, header and footer, DE and EN. Own axe sweep 24 routes × 3 themes: **0** `label-content-name-mismatch` nodes (run 1: 48 serious per theme). Lighthouse audit score 1 |
| F-3-2 | medium | **resolved** (the `/ueber-uns` half) | `/ueber-uns` and `/en/about` render exactly one `<img loading="eager" fetchPriority="high">` — the D2-declared portrait — and no other eager image; `/`, `/dein-ort`, `/mitmachen`, `/dein-kalender` render 0 |
| F-3-5 | low | **resolved** | `/en/about` → `alt="Jan-Henrik Hempel, founder"`; `/ueber-uns` unchanged |
| F-3-8 | low | **resolved** | `/dies-gibt-es-nicht` carries `x-middleware-rewrite: /__not-found/404`, `/_vercel/insights/view` carries **no** rewrite header — the proxy no longer classifies platform paths. `not-found-routing.test.ts` 62/62 |
| F-3-9 | low | **resolved** | `proxy.ts:96-102` logs; `proxy.test.ts` 34/34 including the rejecting-`placeHop` case, which asserts the log line and that `?ort=` is *not* in it |
| F-3-10 | medium | **resolved** | 360×640 on the preview, after one `scrollTo(0, scrollHeight)` and again after `End`: **0 px** of `opacity: 0` on `/dein-ort?ort=07743` (run 1: 3 223 px), `/`, `?ort=10115`, `/dein-ort/starten?ort=99999`. Repeated at 1280×800 incl. `/en/your-place?ort=07743`, and on the local build: 0 px everywhere |
| F-3-11 | medium | **resolved** | On three routes: the newsletter submit does not navigate (URL and `?ort=` / `?wer=` / `?kreis=` byte-identical), swaps in a `role="status"` confirmation, and an unsent value in the page's other form survives. All three manifestations closed |
| F-3-12 | medium | **resolved** on the preview, with the reservation row 159 asked for | The finding's own gesture on `#ort-suche-404`, five double-click runs plus a single-click control: six of six reach `/dein-ort?ort=10115`, value intact. Spec 4/4 in three isolated preview runs. Row 159's question is answered: the mechanism does not reproduce on the preview either |
| F-3-13 | medium | **resolved**, both halves | `/favicon.ico`, `/does-not-exist.js`, `/nope.css`, `/nope.png`, `/robots.txt.map` → 404 with an 11.7 KB document, no `__next_error__`, "Seite nicht gefunden" rendered. `<link rel="icon" href="/_next/static/immutable/media/Schafe-vorm-Fenster_Logo_V2.1.<hash>.svg">`, asset 200 |
| F-3-14 | medium | **resolved** | Empty: `required`, `validationMessage`, no URL change. Junk: the placeless founding acknowledgment, DE and EN; the typed value only in the field's `value` and the CTA URL, so TS-023-A5 keeps its `pass` |
| F-3-15 | low | **resolved** | `/en/take-part` "No evidence" / "We have no evidence for this channel yet."; `/en/about` "No cleared quote from an organiser is available yet."; German pages unchanged |
| F-3-16 | low | **resolved** | One Tab → `<a href="#main">Zum Inhalt springen</a>` / "Skip to content", `#main` present, both languages, no header and no nav pulled in |

**Twelve of twelve resolved. Nothing reopened.** F-3-10 and F-3-12 — the
two the round flagged for a human eye — were both driven by hand on the
preview rather than read off a suite.

## Conversion-path walks — measured, not asserted

Real browser, 360 px, preview, console instrumented for
`[analytics:mock] conversion` and for every non-origin request.

| Goal | Walk | Result |
| --- | --- | --- |
| `save-calendar-to-homescreen` | `/` → `07743` → `/dein-ort?ort=07743` → app link | 2 app links, target `https://app.schafe-vorm-fenster.de/beispielwalde`, **one** `save-calendar-to-homescreen / handover` |
| `register-as-publisher` | `/mitmachen` → `/mitmachen/registrieren?ort=07743` → steps → handover | "Schritt 2 von 3", "Schritt 3 von 3", handover `https://app.schafe-vorm-fenster.de/registrieren`, **one** `register-as-publisher / handover` |
| `request-product-briefing` | `/dein-kalender` → briefing link | the one configured `calendar.app.google/VG9bZoYVnFcX1W6F8`, **one** `request-product-briefing / handover` |
| `buy-calendar-licence` | `/dein-kalender/bestellen` → search `17495` → add → steps 2 → 3 → 4 | `?orte=beispielhausen`, "Schritt 2/3/4 von 4", step 4 renders 2 embed-code blocks, **one** `buy-calendar-licence / completed`, **still one** after Back → Forward |
| `request-licence-quote` | `/deine-region/angebot` → fill → wait out the TS-016-A10 timing gate → submit | `[data-envoy-state="sent"]`, "Danke — deine Anfrage ist angekommen.", **one** `request-licence-quote / completed` |
| EN repeat 1 | `/en/your-place?ort=07743` | `lang="en"`, `<h1>Here's what's on in Beispielwalde</h1>`, English CTAs |
| EN repeat 2 | `/en/take-part` | `lang="en"`, English throughout, "Sign up for free" |
| EN quote | `/en/your-region/quote` | `sent`, "Thank you — your enquiry has arrived.", **one** `request-licence-quote / completed` |

Zero console errors in every walk (the preview's `vercel.live` CSP block
excluded — F-2-27). The only non-origin hosts reached were
`vercel.live` and the intended `app.schafe-vorm-fenster.de` handover.

One thing worth recording because it looked like a defect and is not:
submitting the quote form without waiting produces **no visible change at
all** — TS-016-A10's timing gate refusing silently. That is F-3-17, open
by decision.

## The `/en/*` sweep

All twelve English routes rendered in a browser and read for German text,
rather than checked against the four badge strings run 1 used.

| Check | Result |
| --- | --- |
| `<html lang>` | `en` on all twelve |
| German dummy-content badges (`Demo-Daten`, `Foto gesucht`, `Nicht motivgenau`, `Platzhalter`) | **0 hits on all twelve** |
| F-3-15's two strings | gone; English equivalents in place |
| F-3-5's `alt` | gone; English in place |
| German interface strings found | `/en/your-calendar/order` (all four steps): **"Schritt N von 4"**, plus "Noch keine Auswahl." / "Füge oben Orte oder eine Postleitzahl hinzu."; `/en/about`: `aria-label="Belege"`, "Jan-Henrik Hempel, Gründer", "Beleg: founder-former-volunteer-mayor (cleared)", "Beispielhafte Rückmeldung", "Bürgermeisterin, Beispielgemeinde Musterdorf", "Beispielhafte Presseerwähnung", "Beispielzeitung, Regionalressort" → **F-3-24** |
| German by decision, not filed | the legal bodies on `/en/legal` (row 151), the event fixture titles (rows 90/91), the two German testimonial quotes on `/en/about` |

## Verdicts that moved

The twelve fixes touch six criteria. **Two of them cannot be flipped, and
that is the single most consequential result of this run.**

| AC | M5 run 1 | M5 run 2 | Why |
| --- | --- | --- | --- |
| TS-002-A1 | fail (F-3-1) | **fail** (rows 155, 156) | F-3-1's 48 serious nodes are gone in all three themes. The criterion says "axe-core: **zero** violations on every page, in all three themes", and the presence-based sweep the same change introduced leaves `landmark-unique` on `/`, `/dein-ort`, `/en`, `/en/your-place` and `heading-order` on `/rechtliches`, `/en/legal` — six moderate nodes, in every theme. The defect moved; the verdict cannot |
| TS-029-A12 | fail (F-3-1) | **fail** (row 156) | the same, for `/rechtliches`: `heading-order(moderate)` inside the imported legal bodies |
| TS-003-A8 | fail (F-3-2) | **fail** (row 157) | the `/ueber-uns` half is closed and re-measured; A8's second and third clauses stay unreachable for `/` and `/dein-ort` while the hero is a CSS `background-image` |
| TS-023-A5 | pass | **pass** | re-checked rather than assumed, because F-3-14's fix bent to it: the unresolvable value is echoed in the search field and in the CTA's URL, never in body text |
| TS-004-A4 | pass | **pass** | the evidence widens — asset-shaped unknown paths (`/favicon.ico`, `/nope.css`, `/robots.txt.map`) now also render the complete document, with JavaScript disabled |
| TS-016 (newsletter) | — | — | no criterion binds the newsletter block; TS-016 D10 and the mock rule do. Both now hold: full UX, labelled mock, `role="status"` confirmation, no address leaves the browser, nothing else on the page destroyed |

`plan/round-4.md` expected F-3-1's fix to turn TS-002-A1 and TS-029-A12
from `fail` to `pass`. It did not, and not because the fix failed: the
fix's own instrument change — presence instead of impact, which is what
the criterion actually asks for — surfaced two further rules that the
round consciously declined to take (rows 155, 156). Per the playbook, the
criterion's wording binds and QA may not reword it to let it pass.

## Counts

| | Gate 2 run 2 | M5 run 1 | **M5 run 2** | Delta vs run 1 |
| --- | --- | --- | --- | --- |
| **pass** | 264 | 285 | **285** | **0** |
| **fail** | 26 | 28 | **28** | **0** |
| **not-testable** | 43 | 45 | **45** | **0** |
| **total in scope** | 333 | 358 | **358** | 0 |

The verdict counts do not move. What moves is underneath them: **twelve
of the round's twelve findings are closed**, three of the 28 fails have a
different owner (rows 155/156/157 instead of F-3-1 and F-3-2), the unit
and integration suite grew from 1 073 to 1 085 tests, and the local e2e
suite from 471 to 509 cases — 38 new regression nets, one per fix, all
green.

Findings: round 4 closed 12 of the round's 23. Three new ones are raised
here, so the open finding set is **11 carried + 3 new = 14: 0 critical ·
0 high · 8 medium · 6 low.**

| Finding | Sev | What | Owner |
| --- | --- | --- | --- |
| F-3-24 | medium | German interface strings on `/en/your-calendar/order` (all four step badges, the scope picker's empty state) and on `/en/about` (proof stream label, founder attribution, "Beleg:" context line, four fixture attributions) | content follow-up / the component owners; workstream 2 |
| F-3-25 | medium | `/ueber-uns/archiv` measures CLS 0.2786–0.2795 at 360×800 on the preview in 4 of 12 runs under Playwright's worker pool; 12/12 clean locally, ≤ 0.0003 in every isolated measurement, Lighthouse 0 | rendering/performance owner, with rows 146 and 154 |
| F-3-26 | low | `pnpm e2e` against the preview fails exactly one case per full run, a different one each time, in three consecutive runs; every case passes in isolation and the local suite is 509/0 twice | QA method / CI owner, with row 146 |

## The open remainder, by row and finding, with owner

Everything still open at the gate, in the four workstreams
`plan/round-4.md` hands over.

| Item | Sev | What is open | Owner |
| --- | --- | --- | --- |
| **row 132** (+ 139, 147, 148) | high | the one real go-live blocker: a hash-only CSP cannot cover Next's request-time flight payload, so the four `ƒ` routes ship unhydrated in **production**. Invisible on the preview, where `'unsafe-inline'` applies | TS-014 / DEC-045 owner — a nonce amendment, not a fix round |
| **row 145** (F-2-39, F-2-56) | — | TS-005-A9, TS-009-A3, TS-009-A9: the Suspense/PPR shell against the no-JavaScript completeness guarantee. Deliberately not shipped broken | rendering-and-resilience spec owner |
| **row 131** | — | TS-009-A2: four routes stay fully dynamic | same |
| **F-2-42** | — | TS-011-A8/A9: no OG image on any page, either language. The largest gap that is neither a decision nor a mock | SEO / brand |
| **F-3-3** | medium | mobile Lighthouse 96 on `/` against D7's 98 floor — re-measured this run, unchanged (95–96 over two runs; `/dein-ort` 100) | performance owner |
| **F-3-4** | medium | `Save-Data: on` saves 0 % | performance owner |
| **F-3-2 / row 157** | medium | the `photo-surface` half — the hero is the measured LCP element and a CSS background | rendering/performance owner, with F-3-3 |
| **F-3-7 / row 150** | medium | the proxy resolves `?ort=` upstream per request, uncached, and the page resolves it again; no rate limit. Latent while row 77 is open | backend/BFF owner, one piece of work with row 77 |
| **rows 155, 156** | medium / low | `landmark-unique` ×4 and `heading-order` ×2 — the two rules that now hold TS-002-A1 and TS-029-A12 at `fail`. Row 155 is a copy decision (TS-006 D6 forbids new text on the closing repeat), row 156 a legal-content decision | content/design owner; legal-content owner |
| **F-3-24** | medium | the German-strings class F-3-5 and F-3-15 closed two instances of | content follow-up / component owners |
| **F-3-25**, **F-3-26**, **rows 146, 154** | medium / low | the archive's 0.279 excursion, the `/mitmachen` 32 px wrap-boundary residual, the non-deterministic preview suite, and the `ReservedChipRow` class copy that predicts the first two | rendering owner + QA method |
| **F-3-17 … F-3-23** | medium / low | the seven usability findings the round put on the open list — the spam guard's silent retry, order step 3's reload/empty invoice/single progress signal, the footer tab order, Back-button recovery, 22 px of desktop shift | usability workstream (3) |
| **F-3-6 / F-2-8** | low | upper-case and `/en/dein-ort` path variants answer 200 | routing owner, one row in `localeRedirects()` |
| **row 143 / 152** | medium | `check:terms` still outside the `check` chain, so TS-026-A8 fails | one line in `package.json`, after three demo sentences go |
| **row 151** | medium | `lang="de"` missing on the German legal bodies of `/en/legal` | component owner |
| **rows 158, 159** | low | the duplicate search-input id in the hydration window, and F-3-12's non-reproduction — row 159 is now answered from the preview side too | rendering owner |
| **20 `Dummy-Content` rows**, **16 `Mock aktiv` rows**, **row 21**, **row 64**, **row 22** | high → low | the content follow-up and the mock-hardening workstreams, plus the accessibility statement awaiting legal counsel and Jan's two dashboard items | workstreams 1 and 4; Jan |

## Methodological notes

**The two environments still agree on behaviour and now disagree on
determinism.** Every functional measurement matches between the local
production build and the preview: the same CSP branch, the same route
statuses, the same 404 bodies, the same conversion events, the same axe
result, the same F-3-10 measurement. What differs is repeatability: the
local suite ran 509/0 twice, the preview suite failed one case in each of
three runs. That is a property of measuring a remote deployment under a
worker pool, and it is now written down (F-3-26) rather than averaged away.

**An expected verdict flip is not a verdict flip.** The round planned for
two `fail`s to become `pass`. They did not, because the instrument the
same change installed is stricter than the one that produced the original
verdict. This is the third run in a row in which the interesting result
was about the instrument rather than the code, and it is worth saying
plainly at the acceptance: TS-002-A1 has never yet been measured green
by an instrument that matches its own wording.

**F-3-8 could not be decided from the outside.** An unrewritten
`/_vercel/**` path still answers 404, because nothing serves it. The
response header (`x-middleware-rewrite`, present on a real unknown URL and
absent on `/_vercel/insights/view`) is what separates "the proxy claimed
it" from "nothing serves it" — recorded so the next reader does not
mistake the status code for a reopened finding.

**Lighthouse's SEO score dropped from 69 to 61 and nothing changed.** The
new deduction is `robots-txt`, because Lighthouse fetches `/robots.txt`
without the bypass header and Deployment Protection answers with a 302 to
its own login page. Through the bypass, `/robots.txt` is 200 `text/plain`
with the expected two lines in both environments.

## Gate recommendation

**Recommend the final Customer acceptance proceed.**

`plan/process.md`'s abort criterion holds on its first branch for the
second consecutive run: **no critical and no high finding is open.**
Fourteen findings stand — eight medium, six low — and every one of them
is either a decision somebody else owns, a mock with a labelled row, or
polish. The round did what it was scoped to do: twelve of twelve
resolved, none reopened, the two that needed a human eye driven by hand
on the preview, `pnpm check` green with 1 085 tests, and the local e2e
suite green at 509 cases.

Four things the acceptance protocol must **say out loud**, because none
of them is visible on the preview and none is a defect this run can
close. The first three are `plan/round-4.md`'s own list and they stand
unchanged; the fourth is this run's addition.

1. **Row 132 is the one real go-live blocker, and the prototype cannot
   show it.** The four dynamic routes ship unhydrated in production under
   DEC-045's hash-only CSP. The preview hydrates because it gets
   `'unsafe-inline'`. This needs a DEC-045 amendment, not a fix round,
   and rows 139, 147 and 148 travel with it.
2. **Row 145** — the Suspense/PPR tension, three failing criteria, left
   unresolved on purpose. It needs the rendering-and-resilience spec owner.
3. **F-2-42** — every share of every page in either language is a bare
   link today. **F-3-3 and F-3-4** — mobile Lighthouse 96 against D7's 98
   floor on `/`, re-measured and unchanged, and `Save-Data: on` saving
   0 %. **Two systems answer from mocks by decision**, every one with a
   `Mock aktiv` row and a badge in both languages, verified again here.
4. **TS-002-A1 and TS-029-A12 are still `fail`, and the Customer should
   hear why.** The serious, page-wide WCAG 2.1 violation the sweep carried
   for three rounds is gone — 48 nodes per theme down to zero, accessibility
   100 in Lighthouse on every run, zero serious and zero critical findings
   in any theme. What holds the two criteria at `fail` is six *moderate*
   nodes from two rules the round opened deliberately and declined to
   take: two identically-named search landmarks (a copy decision TS-006 D6
   constrains) and one `<h6>` inside a legal text imported verbatim. Both
   are named in `KNOWN_OPEN_RULES` and printed on every run. This is a
   much better state than run 1's, and it is still not what the criterion
   says.

One judgement for the record. Run 1 closed by saying the thing it would
tighten was the measuring. This run says the same thing from the other
side: the measuring was tightened, it worked, and the first thing it did
was refuse to let two criteria pass that everybody expected to pass. That
is the instrument behaving correctly. The other half of the lesson is
F-3-26 — the preview suite that fails a different case on every run —
and it should be fixed before the next milestone reads a verdict off it.

# Chaos Round 3 — Hasty Clicker

**Source: chaos:hasty-clicker**

Persona: Der Hektische — clicks faster than the page reacts, doubles everything,
navigates away mid-action, hammers Back/Forward through conversion flows,
reloads during submission, interleaves two tabs in the same flow.

Testing against: `https://schafe-vorm-fenster-5jupiff6w-schafe-vorm-fenster.vercel.app`
(M5 preview, via `x-vercel-protection-bypass` header, secret read from `.env.local`,
never printed).

Tools: native Playwright (`@playwright/test`'s bundled Chromium, headless, run via
plain Node against the project's `node_modules`), `extraHTTPHeaders` carrying the
bypass secret. Console instrumentation: every `page.on('console')` message
containing `analytics` was captured; the mock tracker
(`src/lib/analytics/mock-tracker.ts`) logs
`[analytics:mock] conversion {goalId, stage, attributes}` on every
`trackConversion` call, so goal fires were counted directly from these log lines.
Viewports: 360×640 and 1280×800.

Scripts, logs and screenshots:
`/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-3/`
(`run1.js`…`run11.js`, matching `*.log`, `*.png`, `lib.js` for the bypass-secret
reader).

## Routes covered

Both locales, both viewports (viewport noted per scenario):

- `/dein-kalender/bestellen` · `/en/your-calendar/order` (full order flow, all 4 steps)
- `/deine-region/angebot` · `/en/your-region/quote` (quote form)
- `/mitmachen/registrieren` (place-select step + back/forward)
- `/` (place search, layout-jump measurement)
- `/dein-ort` (place search)
- the not-found page (arbitrary nonexistent slug, place-search recovery widget)
- roam: `/dein-ort`, `/dein-ort/starten`, `/mitmachen`, `/mitmachen/registrieren`,
  `/dein-kalender`, `/dein-kalender/bestellen`, `/deine-region`,
  `/deine-region/angebot`, `/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches`, `/`
  and their `/en/...` equivalents (double-clicked first nav link on each, console
  watched for new errors)

Not separately walked this round: `/dein-ort/starten` and `/ueber-uns` as
standalone hasty flows (touched only via the roam) — no flow-specific chaos
action applies to them beyond nav double-click, which the roam already covers.

## Gate-2 observations re-run

| id | gate-2 finding | M5 result | status |
| --- | --- | --- | --- |
| C-H-6 | `buy-calendar-licence` fires twice for one order after Back/Forward hammering | Full flow replayed: place-select → Weiter → reload step3 ×3 → Weiter to completion (schritt=4) → Back ×3 → Forward ×3. Exactly **1** event logged, at the first arrival on schritt=4; the Forward-navigation revisit does **not** re-fire it. Repeated on EN (`/en/your-calendar/order`) and on mobile (360×640): same, 1 event each. | **fixed** |
| C-H-7 | `request-licence-quote` fires twice from a rapid double-click on Absenden | A new anti-bot timing guard now intercepts submissions attempted within ~2s of page load (see C3-H-1 below) and absorbs most double-click attempts before they reach the tracker. Once past that window, a true simultaneous double-click (`Promise.all` of two `.click()`s) fires the event **exactly once** — the first click's success swaps the form for the confirmation message, so the second click lands on a detached button and errors out client-side (Playwright timeout), never reaching the handler. Reproduced past-window on DE desktop, EN desktop, and DE mobile: 1 event each. | **fixed** (single-fire confirmed once the anti-bot window has passed) |
| C-H-8 | Double-click on the bestellen completion transition (step3→4) fires once (contrast/clean) | Re-run identically: 1 event, url settles once at `schritt=4`. | **unchanged / confirmed clean** |
| C-H-9 | Reload immediately after clicking "Weiter" (step3→4) silently swallows the navigation | Re-run identically: reload lands back on `schritt=3`, **0** events, all fields empty, no toast/message telling the user the click didn't count. | **still reproduces** |
| C-H-10 | angebot form gives no visible success/confirmation feedback after submit | Single clean submit (past the new anti-bot window) now shows: "Das ist die Demo-Fassung des Formulars: Es wurde nichts verschickt und nichts gespeichert. Im fertigen Dorfkalender meldet sich ein Mensch bei dir." — a clear on-page confirmation replacing the form. Confirmed on DE desktop, EN desktop (equivalent English copy), and DE mobile. | **fixed** |
| C-H-11 | Two tabs, interleaved angebot submissions: no state bleed, one event per tab | Re-run with the same interleave pattern; both tabs hit the new anti-bot guard (submitted too soon after page load in both tabs) so **0** events fired in this pass rather than 2 — see C3-H-4. Tab isolation itself held: neither tab's Organisation field leaked into the other. | **clean on isolation; event count changed by the new guard, not by a regression** |
| C-H-12 | Layout jump: footer-region controls shift up to 174px (desktop) / 12px (mobile) between first paint and settled paint on `/` | Re-measured identically (bounding-box snapshot at ~50ms after DOMContentLoaded vs. after networkidle+1s). Desktop: max shift now **22px** (was 174px). Mobile: max shift now **0px** (was 12px). | **substantially fixed — desktop residual shift remains** |
| C-H-13 | registrieren: place search commits via `?ort=` directly (no chip/"Weiter" step); Back/Forward through real history clean | Re-run identically: still lands at `?ort=10115` with no intermediate chip/Weiter step, still no "Weiter" CTA found after place select. Back ×3 / Forward ×3 through real history: no stuck states, no duplicate output, no errors. | **unchanged / confirmed clean** (the `?ort=` vs bestellen's `?orte=`+chip asymmetry from C-H-13 still stands, still out of this persona's remit) |
| C-H-14 | Language switch double-click navigates once, no duplicate | Re-run from bestellen: `a[hreflang="en"]` double-clicked, navigates exactly once to `/en/your-calendar/order`. | **unchanged / confirmed clean** |
| C-H-15 | Place search on `/`: navigate-away-mid-search then Back lands cleanly | Re-run identically: Back lands on `/dein-ort?ort=10115` with the input empty, no stale value, no crash. | **unchanged / confirmed clean** |
| C-H-16 | Roam: no new console errors beyond the known preview CSP violation | Re-run across all 12 DE routes (24 double-clicks) and, newly, all 12 EN routes: 12 errors on the DE roam, 12 on the EN roam, all the identical `vercel.live/_next-live/feedback/feedback.js` CSP block (F-2-27). Zero non-CSP-known errors on either roam. | **unchanged / confirmed clean** |

## New observations — round 3

### C3-H-1 — angebot/quote anti-bot timing guard silently ignores a hasty retry click

- **Where:** `/deine-region/angebot`, `/en/your-region/quote`
- **Steps:** Fill the form fields and click "Absenden"/"Send" within roughly 2 seconds of the page finishing load (a realistic hasty-user timing, not an artificial one). Observe the response. Then, while the warning is still showing, click "Absenden" again almost immediately (500ms later).
- **Observed:** The first too-fast click does not submit; instead the page shows "Das ging sehr schnell. Sieh die Angaben noch einmal durch und schick sie dann ab." ("That went very fast. Check the details once more and then send them.") in place of a submission, and logs **0** tracker events — this is a deliberate, welcome anti-bot/anti-hasty guard, not a bug in itself. However, clicking "Absenden" again 500ms later (still within the guard's cool-down, which measures elapsed time since page load/fill rather than time since the warning appeared) produces **no new feedback of any kind** — the same static warning text stays on screen, no event fires, and nothing tells the user how much longer to wait or that the second click also didn't count. Probed the threshold: a click at 2000ms, 4000ms, and 6000ms after fill all succeeded normally (1 event, success message) with no guard shown, so the window is under ~2 seconds — but a hasty user who trips the guard and immediately retries (the exact behavior this persona embodies) lands in a dead zone with zero feedback on the retry.
- **Script:** `run3.js` (scenarios R8–R10), `run4.js` (scenario R12 threshold probe)
- **Screenshots:** `r8-after-click2.png`, `r10-final.png`
- **Source:** chaos:hasty-clicker

### C3-H-2 — Double-clicking "Suchen" on the place-search widget drops the typed postal code on three of four tested locations

- **Where:** `/` (both the "fokus" and "abschluss" search instances, ids `ort-suche-fokus` / `ort-suche-abschluss`), `/dein-ort` (`input[type=search]`), and the not-found (404) page's recovery search (`#ort-suche-404`). Does **not** reproduce on `/dein-kalender/bestellen`'s search (`#ort-suche`).
- **Steps:** Load the page, fill the postal-code field with `10115` (confirmed via `inputValue()` immediately before clicking — the field genuinely holds `10115`), then fire two `.click()` calls at the "Suchen"/"Search" button back-to-back with no wait between them (`Promise.all`, second click `force:true`), simulating a hasty double-click on the search action itself (not yet exercised by gate-2, which only double-clicked *later* CTAs like Weiter/Absenden/language switch).
- **Expected:** Navigate once to `/dein-ort?ort=10115`.
- **Observed:** Navigates to `/dein-ort?ort=` — the query parameter is present but **empty**, the typed value is lost. Reproduced on 2 repeat attempts on the 404 page (100% reproduction), and once each on `/` and `/dein-ort`. By contrast, the identical double-click pattern against bestellen's own place-search field correctly lands on `/dein-kalender/bestellen?ort=10115` — so this is specific to the place-search variant shared by `/`, `/dein-ort`, and the 404 recovery widget, not a defect in every instance of the component. A single clean click (no chaos) on the same 404-page widget correctly preserves the value, confirming this is a double-click race, not a general defect in that widget.
- **Script:** `run7.js` (scenario R22, discovery), `run9.js` (R24, confirms reproduction ×2), `run10b.js` (R25/R26, confirms on `/` and `/dein-ort`), `run11.js` (R27, confirms bestellen is unaffected)
- **Screenshot:** `r22-404.png`
- **Source:** chaos:hasty-clicker

### C3-H-3 — Layout jump (C-H-12) greatly reduced, not eliminated, on desktop

- Carried as a re-run row above; noted separately here because it's a partial fix worth its own line for whoever triages: desktop still shifts controls by up to 22px between first paint and settle (was 174px), so the hasty-click-before-settle risk C-H-12 described is much smaller now but not zero at 1280×800. Mobile (360×640) shows 0px shift, i.e. fully resolved there.
- **Script:** `run2.js` (scenario R7)
- **Source:** chaos:hasty-clicker

### C3-H-4 — angebot two-tab interleave (C-H-11) now blocked by the anti-bot guard in both tabs rather than producing two conversions

- Not a regression, but worth recording precisely: with the M5 anti-bot timing guard in place, the exact C-H-11 interleave (fill two tabs, submit both near-simultaneously) no longer produces "2 events, one per tab" — it produces 0, because both tabs' submissions land inside the guard's cool-down window. Re-running the same interleave with each tab given time past the guard window would be needed to re-confirm the original "one event per tab, no bleed" result under present conditions; this round didn't re-drive that variant given time budget. Tab isolation (no cross-tab field bleed) still held.
- **Script:** `run2.js` (scenario R6)
- **Source:** chaos:hasty-clicker

## Event-firing summary

No conversion event fired more than once for a single user action in this round's testing — the double-fire behaviors gate-2 found (C-H-6, C-H-7) both now fire exactly once under the same or harder conditions (Back/Forward hammering, past-window true double-click, tested on desktop, mobile, and EN locale). The one still-open gap from gate-2 is silence, not duplication: C-H-9's swallowed reload, and the new C3-H-1 guard-retry dead zone, both leave a hasty user's second attempt producing zero feedback and zero event — the risk this persona flags is no longer "counted twice" but "clicked and nothing visibly happened, more than once."

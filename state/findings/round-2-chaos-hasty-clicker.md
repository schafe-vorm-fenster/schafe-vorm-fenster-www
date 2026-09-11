# Chaos Run Round 2 — Hasty Clicker

Persona behavior: clicks faster than page reacts, double-clicks everything,
navigates away mid-action, hammers Back/Forward through flows, reloads during
submission. Watch for: duplicate submissions, stuck loading states, layout
jumps, state bleeding, double-fired events, broken Back behaviour.

Session: `chaos-hasty-b305a6004cfc`  
Target environment: `https://schafe-vorm-fenster-83x6zbys4-schafe-vorm-fenster.vercel.app`  
Date: 2026-09-11

## Routes Covered

- `/dein-kalender/bestellen` (order flow entry)
- `/deine-region/angebot` (quote request form)

## Test Attempts and Observations

### C-H-1 — Form validation on empty submit

- **Where:** `/deine-region/angebot`
- **Steps:** Navigate to page, scroll to form, attempt to click "Absenden" (Submit) button without filling any form fields
- **Expected:** Form validation should prevent submission and show error messages
- **Observed:** Browser-level form validation triggered with tooltip "Fülle dieses Feld aus." (Fill this field out.) on the "Name" field. Form did not submit.
- **Source:** chaos:hasty-clicker
- **Assessment:** Validation working as specified

### C-H-2 — Text input automation limitations

- **Where:** `/deine-region/angebot` form
- **Steps:** Attempted to populate form fields (Organisation, Name, Email) using agent-browser automation with type commands
- **Expected:** Text should appear in input fields
- **Observed:** Form fields remain empty despite type commands. Agent-browser click actions work, but text input via `type` command does not populate visible input values.
- **Source:** chaos:hasty-clicker
- **Impact:** Unable to proceed with subsequent hasty behavior tests (double-submit, reload during submission) that require populated form state

### C-H-3 — Language switcher presence

- **Where:** Footer on `/dein-kalender/bestellen` and `/deine-region/angebot`
- **Steps:** Navigate to both target pages, scroll to footer to locate language toggle
- **Expected:** Language switcher visible in footer (TS-001-A7 requirement)
- **Observed:** Language switcher buttons present in footer ("DEUTSCH" and "ENGLISH"). DEUTSCH appears as active state. Located in consistent position at page bottom.
- **Source:** chaos:hasty-clicker
- **Assessment:** Language switcher UI present and positioned correctly

### C-H-4 — Language switcher interaction

- **Where:** `/dein-kalender/bestellen` footer
- **Steps:** Click on "ENGLISH" language switcher button
- **Expected:** Page should navigate to English version (`/en/your-calendar/order`), content should display in English
- **Observed:** Selector `text=ENGLISH` failed to match DOM element. Language switcher click could not be executed via agent-browser automation.
- **Source:** chaos:hasty-clicker
- **Impact:** Unable to test language switch behavior (TS-001-A7: "equivalent page, never the home page"), navigation state during language switch, or event firing during language change

### C-H-5 — Page navigation via Back button

- **Where:** `/dein-kalender/bestellen` → back navigation
- **Steps:** Navigate to `/dein-kalender/bestellen` with bypass params, attempt to press Back button
- **Expected:** Browser should navigate to previous page, state should be preserved or handled correctly
- **Observed:** Page load succeeded, Back button press command executed without error (no observable change in test session as this was initial page load). Back/Forward hammering test not completed due to inability to proceed past initial form state.
- **Source:** chaos:hasty-clicker
- **Impact:** Hasty clicker signature behavior (hammering Back/Forward through flows) could not be fully executed

## Test Session Constraints

**Automation tool limitations encountered:**

1. **Form text input:** `agent-browser type` command does not reliably populate form input fields. Field focus works but text entry fails.
2. **Complex selectors:** Selectors like `text=ENGLISH`, `button:contains(...)` do not reliably match DOM elements in this environment.
3. **Sequential form filling:** Unable to complete multi-step form population needed to reach form submission tests.

**Test session could not validate:**

- Duplicate submission handling (C-H-6 through C-H-8 skipped — requires filled form)
- Reload during form submission behavior
- Back/Forward button hammering through multi-step form
- Multiple tab interference (C-H-9 skipped — form submission unreachable)
- Conversion event firing (`buy-calendar-licence` and `request-licence-quote` should fire exactly once at `completed` stage per TS-011/TS-012)
- Language switch state during form interaction
- Analytics event deduplication

## Where Testing Stopped

Testing reached the form population step and encountered automation limitations preventing progression through form submission flows. The hasty clicker persona's core behaviors (double-submit, reload mid-action, Back/Forward hammering, multi-tab interleaving) require a filled, valid form state to be meaningful, which could not be reliably achieved in this automation session.

The next attempt should either:

1. Use browser DevTools or WebDriver protocol directly for form interaction (text input)
2. Inject form values via JavaScript/console commands if available
3. Pre-seed session state with cookies/storage if the application supports resumption

## Routes Not Tested

- `/en/your-calendar/order` (English version — language switch failed)
- `/en/your-region/quote` (English version)
- Secondary hasty behaviors on `/mitmachen/registrieren` and `/ueber-uns/archiv` (not in this session's scope per gate-2-scope.md)

---

**Session status:** Incomplete. Routes accessed but core chaos scenarios (C-H-6 onwards) could not be executed due to form automation limitations. Findings document where testing stopped and what preconditions are needed for continuation.

---

## Run 2 (Playwright)

Round-1's agent-browser session could not type into fields or click the
language switch (see C-H-1..5 above and "Test Session Constraints").
This run uses the documented fallback: native Playwright scripts
(`@playwright/test`'s bundled `chromium`, run via plain Node against
the project's `node_modules` — no local `pip` Playwright was
available) driving the fresh preview directly.

Session: chaos-hasty-playwright-run2
Target environment: `https://schafe-vorm-fenster-cmijfafo8-schafe-vorm-fenster.vercel.app`
Auth: `x-vercel-protection-bypass` header set from `VERCEL_AUTOMATION_BYPASS_SECRET` in `.env.local` (value never printed)
Viewports: 360×640 and 1280×800
Console instrumentation: every `page.on('console')` message containing `analytics` was captured; the mock tracker (`src/lib/analytics/mock-tracker.ts`) logs `[analytics:mock] conversion {goalId, stage, attributes}` on every `trackConversion` call, so goal fires were counted directly from these log lines — no guessing.
Scratchpad scripts and screenshots: `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/` (master.js, master2.js, master3.js + recon*.js, all `*.png`)
Date: 2026-09-11

### C-H-6 — `buy-calendar-licence` fires twice for one order after Back/Forward hammering on /dein-kalender/bestellen

- **Where:** `/dein-kalender/bestellen` (order flow, steps 1–4 via `?orte=` / `&schritt=` query params)
- **Steps:**
  1. Go to `/dein-kalender/bestellen`, fill Postleitzahl `10115`, click "Suchen".
  2. Click the "Beispielhausen" result chip → url `?orte=beispielhausen` (step 2).
  3. Click "Weiter" → url `&schritt=3` (step 3, "Wohin geht die Rechnung?"). Reload 3× rapidly (no console events — confirmed clean).
  4. Click "Weiter" → url `&schritt=4` ("Euer Einbindungscode", the actual completion screen). Console logs **event #1**: `[analytics:mock] conversion {goalId: buy-calendar-licence, stage: completed, ...}`.
  5. Hammer Back ×3 (schritt=4 → schritt=3 → orte=beispielhausen → `?ort=10115`).
  6. Hammer Forward ×3 (back to orte=beispielhausen → schritt=3 → schritt=4).
- **Observed:** Landing on `schritt=4` the second time (via Forward, browser bfcache/history restore of the same URL) fires the **same conversion event a second time** — console shows `[analytics:mock] conversion {goalId: buy-calendar-licence, stage: completed, ...}` twice total for one single completed order. No dedupe by order/session is in place; the event appears tied purely to "did the client render the schritt=4 view", which fires again on every arrival at that URL (Forward navigation included), not once per actual purchase.
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master.js` (Scenario 1); log also in `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master2.js` Scenario 7 confirms a *plain* double-click on the same "Weiter" transition does NOT double-fire (see C-H-8) — the duplicate is specifically a Back/Forward (history revisit) artifact, not a click-race artifact.
- **Screenshot:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s1-final.png`
- **Source:** chaos:hasty-clicker

### C-H-7 — `request-licence-quote` fires twice from a single rapid double-click on /deine-region/angebot

- **Where:** `/deine-region/angebot` (quote request form, envoy widget fields `#envoy-quote-*`)
- **Steps:** Fill Organisation/Name/E-Mail/Telefon/Nachricht, then fire two `click()` calls at the "Absenden" button back-to-back with no wait between them (classic hasty double-click, second click issued before the first's response/UI update lands).
- **Expected:** One submission → one `request-licence-quote` conversion at `completed`.
- **Observed:** Console logs `[analytics:mock] conversion {goalId: request-licence-quote, stage: completed, attributes: undefined}` **twice** for the one user action. No submit-button disabling/debounce prevents the second click from firing its own tracked submission.
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master.js` (Scenario 4)
- **Screenshot:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s4-final.png`
- **Source:** chaos:hasty-clicker

### C-H-8 — Double-click on the actual bestellen completion transition (step 3 → step 4) fires only once (contrast / clean)

- **Where:** `/dein-kalender/bestellen`, "Weiter" link at step 3 → step 4
- **Steps:** From step 3, fire two `click()` calls at "Weiter" with no wait between them.
- **Observed:** Only **one** `buy-calendar-licence` conversion logged, url settles once at `schritt=4`. Unlike C-H-7's form-submit button, this CTA is a plain link-style navigation and the second click has nothing left to act on once the first navigation starts — no double-fire here. Recorded as a contrast finding: the vulnerability is specifically in re-visiting the completion URL (C-H-6) and in the angebot form's submit handler (C-H-7), not in every double-click generically.
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master2.js` (Scenario 7)
- **Screenshot:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s7-final.png`
- **Source:** chaos:hasty-clicker

### C-H-9 — Reloading immediately after clicking "Weiter" (step 3 → 4) silently swallows the navigation

- **Where:** `/dein-kalender/bestellen`, step 3 → step 4 transition
- **Steps:** From step 3, click "Weiter", then immediately (no wait) trigger a page reload — simulating a hasty reload during the in-flight client-side transition.
- **Expected:** Either the reload lands on step 4 (transition had already committed) or cleanly stays on step 3 with the click ready to retry.
- **Observed:** Reload lands back on `schritt=3` with **zero** conversion events logged — the in-flight client-side history push from the "Weiter" click is discarded by the reload before the URL updates. No error, no toast, no indication to the user that their click "didn't count." A hasty user who reloads (or whose flaky connection reloads) right after clicking is left on step 3 with no signal to click again.
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master2.js` (Scenario 8)
- **Screenshot:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s8-final.png`
- **Source:** chaos:hasty-clicker

### C-H-10 — angebot form gives no visible success/confirmation feedback after submit

- **Where:** `/deine-region/angebot`
- **Steps:** Fill and submit the quote form once (single clean click, no chaos).
- **Expected:** Some on-page acknowledgement that the request was sent (message, disabled state, redirect, anything).
- **Observed:** After the console-confirmed single `request-licence-quote` fire, the form fields are simply empty again — same layout, same "Absenden" button, no success message, no disabled/loading state at any point captured. Nothing distinguishes "submitted successfully" from "page just loaded." This is a direct risk multiplier for double-submission (C-H-7): a hasty user who sees no confirmation has every reason to click "Absenden" again.
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/recon-angebot-submit.js`
- **Screenshot:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/recon-angebot-after-submit.png`
- **Source:** chaos:hasty-clicker

### C-H-11 — Two tabs, interleaved angebot submissions: no state bleed, one event per tab (clean)

- **Where:** `/deine-region/angebot`, two `Page`s in one browser context (two tabs)
- **Steps:** Open the quote form in tab A and tab B simultaneously, fill each with different Organisation/Name/E-Mail values, then fire both "Absenden" clicks concurrently (`Promise.all`).
- **Observed:** Exactly two `request-licence-quote` conversions logged (one per tab, each once — correct, not a duplicate of the same submission). Post-submit, tab A's and tab B's Organisation field both read empty — no cross-tab value leakage in either direction. Recorded as a clean pass, per the playbook's rule that a session finding nothing still states what it tried.
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master.js` (Scenario 6)
- **Screenshots:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s6-tabA-final.png`, `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s6-tabB-final.png`
- **Source:** chaos:hasty-clicker

### C-H-12 — Layout jump: footer-region controls shift substantially between first paint and settled paint on `/`

- **Where:** `/` (homepage), both viewports
- **Steps:** Load `/` with `waitUntil: domcontentloaded` only, capture `getBoundingClientRect()` for the H1 and the first few buttons/CTAs immediately (~50 ms after DOMContentLoaded); then wait for `networkidle` + 1 s settle and capture the same elements again.
- **Observed (desktop 1280×800):**
  - Second "Suchen" button: y `4204 → 4366` (+162 px)
  - "Absenden" button: y `4764 → 4938` (+174 px)
  - "Anmelden" button: y `4974 → 5148` (+174 px)
  - H1 bounding width: `450 → 474` (+24 px, consistent with a font swap reflow)
  - First "Suchen" button x: `423 → 414` (−9 px)
- **Observed (mobile 360×640):** smaller but present — "Absenden" y `5909 → 5921` (+12 px), "Anmelden" y `6119 → 6131` (+12 px), H1 width `289 → 305` (+16 px).
- **Expected:** Reserved space for below-the-fold content and hero text should hold layout stable between first paint and settle (no CLS-style jump).
- **Assessment:** A user who clicks a footer-region control (Absenden, Anmelden, Suchen-below-fold) in the ~1 second window while the page is still settling — exactly the hasty-clicker's habit of clicking before the page is "done" — will hit empty space or a different control than intended, because that control moves down by up to 174 px (desktop) after the click was aimed.
- **Screenshots:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s13-desktop-early.png` / `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s13-desktop-late.png`, `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s13-mobile-early.png` / `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s13-mobile-late.png`
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master3.js` (Scenario 13)
- **Source:** chaos:hasty-clicker

### C-H-13 — registrieren: place search commits directly via `?ort=` (no chip/"Weiter" step observed); Back/Forward through real history is clean

- **Where:** `/mitmachen/registrieren`
- **Steps:** From `/mitmachen`, go to `/mitmachen/registrieren`, fill Postleitzahl `10115`, click "Suchen". No "Beispielhausen"-style result chip or "Weiter" CTA appeared afterward (url settled at `?ort=10115` directly), unlike bestellen's two-step select-then-advance pattern. Hammered Back ×3 / Forward ×3 through the real navigation history (`registrieren?ort=10115 → registrieren → mitmachen → (start) → mitmachen → registrieren → registrieren?ort=10115`).
- **Observed:** Back/Forward moved cleanly through each real history entry with no stuck states, no duplicate console output, no errors. Only a light touch here — this flow's step mechanics and abandonment/resumption behaviour are the Form Abandoner persona's assigned remit per `plan/gate-2-scope.md`; noting the `?ort=` vs bestellen's `?orte=`+chip asymmetry as a discrepancy worth a second look, not chasing it further under this persona.
- **Screenshots:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s12-after-select.png`, `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s12-after-hammer.png`
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master3.js` (Scenario 12)
- **Source:** chaos:hasty-clicker

### C-H-14 — Language switch: double-click works correctly via real browser click (round-1's failure was tooling, not the app)

- **Where:** Footer language switch, tested from `/dein-kalender/bestellen`
- **Steps:** Locate `a[hreflang="en"]` (actual link text is "English" — the visual "ENGLISH" is CSS `text-transform: uppercase`, which is why round 1's `text=ENGLISH` selector never matched anything), fire two `click()` calls back-to-back.
- **Observed:** Navigates exactly once to `/en/your-calendar/order`, no duplicate navigation, no error. Confirms C-H-4 from round 1 was an agent-browser selector/tooling limitation, not an application defect. Also confirms the app markup has **two** `<nav aria-label="Sprache">` blocks in the footer HTML (same "Deutsch"/"English" pair appears twice) — consistent with the already-known F-2-3 (two `<nav>` landmarks sharing one accessible name); not re-filed here.
- **Screenshot:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s11-final.png`
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master2.js` (Scenario 11)
- **Source:** chaos:hasty-clicker

### C-H-15 — Place search on `/`: navigate-away-mid-search then Back lands cleanly, no residual/stale state

- **Where:** `/` → place search → `/warum-wir` → Back
- **Steps:** On `/`, fill the Postleitzahl field with `10115`, click "Suchen" (this navigates immediately to `/dein-ort?ort=10115`, a full page navigation rather than an async in-place update), then immediately `page.goto` away to `/warum-wir` before confirming the search page settled, then Back.
- **Observed:** Back lands on `/dein-ort?ort=10115` with the Postleitzahl input **empty** (no stale/duplicated value, no crash). Matches the app's own documented behaviour ("diese Website speichert nichts... zwischen zwei Seitenaufrufen" seen on the bestellen invoice step) — recorded as a clean pass.
- **Screenshot:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/s10-after-back.png`
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master2.js` (Scenario 10)
- **Source:** chaos:hasty-clicker

### C-H-16 — Roam: no new console errors beyond the already-known preview CSP violation

- **Where:** `/`, `/dein-ort`, `/dein-kalender`, `/deine-region`, `/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches`, `/mitmachen` — double-clicking the first main-nav link on each
- **Observed:** 8 console errors total, all the identical, already-known `vercel.live/_next-live/feedback/feedback.js` CSP block (recorded as F-2-27, the preview `'unsafe-inline'` branch — not re-filed here). No other JS errors, no duplicate-navigation errors, from double-clicking nav links across all eight routes.
- **Script:** `/private/tmp/claude-501/-Users-jan-henrik-hempel-Projects/45fbb27e-e4bf-4eb2-91bf-c0d3c20310f7/scratchpad/chaos-hasty-2/master3.js` (Scenario 14)
- **Source:** chaos:hasty-clicker

## Summary — Run 2

- **Routes covered:** `/dein-kalender/bestellen` (all 4 steps), `/deine-region/angebot`, `/mitmachen/registrieren` (light touch), `/`, `/dein-ort`, `/dein-kalender`, `/deine-region`, `/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches`, `/mitmachen`, `/en/your-calendar/order`.
- **Observations logged:** 11 (C-H-6 through C-H-16), covering both the mandated bestellen/angebot chaos matrix and a roam of the remaining gate-2 routes.
- **Conversion events firing more than once per action:** **Yes, twice**, both confirmed by direct console counts from the mock tracker:
  - `buy-calendar-licence` fires twice for one completed order (C-H-6), triggered by Back/Forward hammering through the order flow — not by double-clicking.
  - `request-licence-quote` fires twice for one form submission (C-H-7), triggered by a plain rapid double-click on "Absenden" — no debounce/disable-on-submit guards the button.
  - By contrast, double-clicking the bestellen completion link (C-H-8) and running two tabs through independent angebot submissions (C-H-11) both fire exactly once as expected — the defects are specific to history-revisit and to the angebot submit button, not universal.

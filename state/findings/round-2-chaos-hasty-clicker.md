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

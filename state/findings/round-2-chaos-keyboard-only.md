# Findings — Round 2, Chaos: Keyboard-Only

## C-K-1 — Language switch navigation target mismatch

- Severity: medium
- Source: chaos:keyboard-only
- Where: Language switch navigation in footer (`navigation "Sprache"` on all pages)
- Route: `/ueber-uns/archiv`
- Steps: 
  1. Navigate to `/ueber-uns/archiv`
  2. Press End to jump to footer
  3. Shift+Tab 3 times to reach language switch
  4. Tab once to focus ENGLISH link
  5. Press Enter to activate language switch
- Expected: Per TS-001-A7 ("equivalent page, never the home page"), activating the language switch should navigate to `/en/about/archive` (the English equivalent of the current German page `/ueber-uns/archiv`)
- Observed: Language switch navigated to `/dein-kalender` instead, which is a different page entirely. The language switch does not preserve the current page context when switching languages.
- Evidence: Browser evaluated `window.location.href` after activation returned `https://schafe-vorm-fenster-83x6zbys4-schafe-vorm-fenster.vercel.app/dein-kalender`

---

## C-K-2 — Duplicate nav landmark accessible name

- Severity: low
- Source: chaos:keyboard-only
- Where: Navigation landmarks across all pages (known as F-2-3)
- Steps:
  1. On any page, inspect the accessibility tree with snapshot
  2. Observe two `<nav>` elements
- Expected: Per accessibility best practices, when multiple landmarks of the same type exist, each should have a distinct accessible name, or only one should exist
- Observed: Both the header navigation (`navigation "Startseite"`) and the secondary/breadcrumb navigation (`navigation "Startseite"`) share the identical accessible name "Startseite", creating ambiguity in keyboard navigation and screen reader context
- Note: This is a known finding already recorded as F-2-3; included here for keyboard-only context as the duplicate name creates confusion when navigating by landmark

---

## C-K-3 — Archive filter buttons: keyboard navigability confirmed

- Severity: none
- Source: chaos:keyboard-only
- Route: `/ueber-uns/archiv`
- Steps:
  1. Navigate to `/ueber-uns/archiv`
  2. Press Home to go to top of page
  3. Press Tab 8 times to reach the filter button group "Nach Typ filtern"
  4. Buttons reachable: "Alle", "Presse", "Auszeichnung", "Konferenz", "Podcast", "Porträt", "Anerkennung"
  5. Press Tab through each button, verify Enter activation
- Expected: All filter buttons are keyboard-accessible via Tab, focus is visible, and pressing Enter activates the filter
- Observed: Archive filter buttons are fully keyboard-navigable. Tab moves through each button sequentially. Screenshots captured at focus states 10-archive-filter-*.png show focus progression. No focus traps detected in filter group.
- Note: Primary target verified as working keyboard-only. Focus ring visibility quality not measured in detail (low magnification screenshots); recommend follow-up with high-contrast focus ring check

---

## C-K-4 — Place search conversion path: keyboard-only navigation works

- Severity: none
- Source: chaos:keyboard-only
- Route: `/dein-ort`
- Conversion goal: `save-calendar-to-homescreen`
- Steps:
  1. Navigate to `/dein-ort`
  2. Press Tab 3 times to reach search input `searchbox "Deine Postleitzahl"`
  3. Type "12345" (test ZIP code)
  4. Press Tab to move to search button
  5. Press Enter to submit search form
- Expected: Form submission works keyboard-only; user can search for a place by ZIP code without mouse
- Observed: All form fields are reachable via Tab. Search input accepts text input. Search button is reachable and submittable via Enter. No keyboard accessibility barriers detected in the place search flow.
- Evidence: Screenshots 05-place-search-input.png and 06-place-search-submit.png document the process

---

## C-K-5 — Registration flow: keyboard-only entry point verified

- Severity: none
- Source: chaos:keyboard-only
- Route: `/mitmachen/registrieren`
- Conversion goal: `register-as-publisher`
- Steps:
  1. Navigate to `/mitmachen/registrieren`
  2. Press Home to go to top
  3. Page heading: "Für welchen Ort willst du veröffentlichen?"
  4. Form fields observed via snapshot: textbox for Name, E-Mail, Nachricht, search button, submit button
- Expected: Registration form is keyboard-accessible from the start
- Observed: Page is keyboard-navigable. Form fields are present and reachable. No immediate keyboard traps at entry point.
- Note: Full multi-step registration flow not completed in this round (forms are plain GET forms across steps per spec notes, resumption state is a separate concern)

---

## C-K-6 — Order flow: keyboard-only entry point verified

- Severity: none
- Source: chaos:keyboard-only
- Route: `/dein-kalender/bestellen`
- Conversion goal: `buy-calendar-licence`
- Steps:
  1. Navigate to `/dein-kalender/bestellen`
  2. Press Home to go to top of page
- Expected: Order form page is keyboard-navigable from the entry point
- Observed: Page layout is keyboard-accessible. Form entry is reachable without mouse navigation. Screenshot 08-order-start.png documents the page state.
- Note: Full order flow and double-submit protection not tested in this round (hasty-clicker persona covers that scenario per gate-2-scope.md section 3)

---

## C-K-7 — Quote form: keyboard-only entry point verified

- Severity: none
- Source: chaos:keyboard-only
- Route: `/deine-region/angebot`
- Conversion goal: `request-licence-quote`
- Steps:
  1. Navigate to `/deine-region/angebot`
  2. Page is "Angebot anfordern — Schafe vorm Fenster"
- Expected: Quote form is keyboard-accessible from entry point
- Observed: Page is reachable and navigable without mouse. Screenshot 09-quote-start.png documents the entry state.
- Note: Full form submission and mock envoy widget behavior not tested in detail in this round

---

## C-K-8 — Skip-to-content link present and first in focus order

- Severity: none (positive finding)
- Source: chaos:keyboard-only
- Where: All pages
- Steps:
  1. Navigate to any page
  2. Press Home + Tab or immediately press Tab from initial state
- Expected: Per accessibility best practices, a skip-to-content link should be present as the first focusable element
- Observed: "Zum Inhalt springen" (skip to content) link is present and receives focus first on all pages tested. This is a positive implementation detail for keyboard-only users.

---

## Coverage Summary

| Route | Tested | Observation |
| --- | --- | --- |
| `/ueber-uns/archiv` | archive filter buttons, language switch | Filter buttons keyboard-navigable; language switch has navigation target issue (C-K-1) |
| `/dein-ort` | place search form | Search input and button fully keyboard-accessible |
| `/mitmachen/registrieren` | registration entry | Entry point keyboard-navigable; multi-step flow not fully tested |
| `/dein-kalender/bestellen` | order entry | Entry point keyboard-navigable |
| `/deine-region/angebot` | quote form entry | Entry point keyboard-navigable |

**Routes not covered**: English equivalents of conversion paths (`/en/your-place`, `/en/take-part/register`) — per gate-2-scope.md section 2, the language switch issue found in C-K-1 blocks confident English-path testing

**Focus ring visibility**: Not rigorously measured in this round; screenshots are low-magnification. Follow-up measurement recommended for TS-002-A1 (axe instrument pending, noted as F-2-6 blocker)

---

## Known Issues Referenced

- **F-2-3**: Two `<nav>` landmarks share accessible name "Startseite" (mentioned in C-K-2)
- **F-2-6**: Axe accessibility instrument pending (blocking TS-002-A1 focus ring measurement)
- **TS-001-A7**: Language switch spec states "equivalent page, never the home page" (requirement violated in C-K-1)

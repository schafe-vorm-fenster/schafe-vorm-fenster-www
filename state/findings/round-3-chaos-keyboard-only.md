# Chaos Round 3 — Keyboard-Only

**Source: chaos:keyboard-only**

Testing against: https://schafe-vorm-fenster-5jupiff6w-schafe-vorm-fenster.vercel.app (M5 preview, via `x-vercel-protection-bypass`)

Tools: Playwright (Chromium, headless, `extraHTTPHeaders` carrying the bypass secret from `.env.local`, never printed). Every step used `page.keyboard.press` only — Tab, Shift+Tab, Enter, Space — never a mouse or `.click()`. `document.activeElement` was read after every Tab (tag, text, role, bounding box, computed `outline`/`box-shadow`, and — since a ring can legitimately live on an ancestor via `:focus-within` — the nearest ancestor that shows one too).

## Session scope

Re-ran every gate-2 keyboard-only observation (C-K-1…8). Where gate 2 verified only the *entry point* of a conversion path (C-K-4…7), this round drove each path to completion keyboard-only, in both languages, and — for the order flow, which needs a scope selection the field alone doesn't provide — added the missing chip-activation step gate 2 didn't script. Full top-to-bottom Tab walks (up to 90 stops, cycle-detected) were run on six routes × two locales × two viewports (360, 1280): home, `/ueber-uns/archiv`, `/dein-ort`, `/mitmachen/registrieren`, `/dein-kalender/bestellen`, `/deine-region/angebot`. The true "unknown URL" 404 (`app/global-not-found.tsx`, not the in-tree `/en/anything`-style 404) was walked separately at 1280 in both languages.

**A methodology note, because it cost real time this round:** two apparent bugs turned out to be artifacts of the test script, not the site, and are recorded here so a future round doesn't re-discover them the hard way:

- The place-search input (`search-field.module.css`) sets `.input:focus-visible { outline: none }` deliberately — the *compound* control's wrapper (`.field:focus-within`) owns the ring instead ("the field owns the focus ring; the input inside it must not draw a second"). Checking only the focused element's own computed style flags this as invisible focus; checking the ancestor shows a correct, visible 3px solid ring. Not a defect — recorded so nobody logs it again as C-K-style "invisible focus."
- The `/deine-region/angebot` and `/en/your-region/quote` quote form appeared to never leave `data-envoy-state="open"` on submit. Root cause: the test typed a non-email string into the `type="email"` field, which native HTML5 constraint validation blocks before the form's own `onSubmit` ever runs — the browser silently refuses the submit and returns focus to the invalid field. With a syntactically valid email, the form submits, `data-envoy-state` becomes `"sent"`, and focus moves to the `role="status"` success message exactly as `envoy-form.tsx` documents (TS-016-A9). Confirmed in both locales.

---

## Gate-2 observations re-run

| id | gate-2 finding | M5 result | status |
| --- | --- | --- | --- |
| C-K-1 | Language switch navigates to the wrong page (`/ueber-uns/archiv` → `/dein-kalender` instead of `/en/about/archive`) | Re-tested href correctness on all 6 routes × 2 locales (12 combinations) and live-activated the link on 6 route/direction pairs (archive de→en, archive en→de, register de→en, register en→de, home de→en, regionQuote en→de). Every `href` matches the exact TS-001-A7 equivalent page; every live activation landed on that exact page. | **fixed** |
| C-K-2 | Two `<nav>` landmarks share the accessible name "Startseite" | Landmark accessible names captured on all 6 routes × 2 locales × 2 viewports (24 combinations). Every page now carries 4–5 distinctly-named `<nav>`s: header ("Startseite"/"Home"), breadcrumb ("Seitenpfad"/"Page path"), context band ("Heute mit einem anderen Anliegen hier?"/"Here for something else today?" — only on pages that have one), footer legal ("Impressum"/"Imprint"), language switch ("Sprache"/"Language"). No duplicate name found anywhere. | **fixed** |
| C-K-3 | Archive filter buttons keyboard-navigable, ring not rigorously measured | Reachable at tab-stop 9 in both locales; Enter activates the focused chip ("Alle"/"All"); focus stays on the button afterward (no loss); ring confirmed visible (3px solid, see below). | **confirmed — ring now measured, holds** |
| C-K-4 | Place search: only the entry point verified | Driven to completion: type a postcode, Tab to "Suchen"/"Search", Enter → lands on `?ort=12345` with the resolved place page rendered. Confirmed in both locales at **both** 360 and 1280. | **confirmed — full path completes** |
| C-K-5 | Registration flow: only the entry point verified | Driven through all 3 steps keyboard-only: postcode search → Tab+Space to pick a "wer" radio → Enter on "Weiter" → Tab+Space to pick a "weg" radio → Enter on "Weiter" → final URL carries `ort`, `wer`, and `weg`. Confirmed in both locales at 1280; DE re-confirmed at 360. | **confirmed — full 3-step flow completes** |
| C-K-6 | Order flow: only the entry point verified | Driven through all 4 steps: postcode search → **Tab to the "+ <place>" add-chip and Enter** (this step is not optional — the "Weiter" button is gated on `hasScope`/≥1 selected place and never renders until a chip is added) → Enter on "Weiter" (step 2→3) → Enter on "Weiter" again (step 3→4, past the invoice-mount fields) → lands on `schritt=4` (the demo code snippet). Confirmed in both locales at 1280; DE re-confirmed at 360. | **confirmed — full 4-step flow completes, chip step included** |
| C-K-7 | Quote form: only the entry point verified | Driven to completion: Tab through Organisation/Name/E-Mail/Telefon/Nachricht, wait past the 2.5 s anti-bot timing gate, Enter on "Absenden"/"Send". `data-envoy-state` flips to `"sent"`, form is replaced by the success message, and focus moves onto it (`role="status"`, `tabindex="-1"`) — exactly as TS-016-A9 specifies. Confirmed in both locales at 1280. | **confirmed — full path completes, success focus move verified** |
| C-K-8 | Skip-to-content link present and first in focus order | Confirmed first stop on all 6 routed pages × both locales × both viewports. **New finding below (C3-K-2): the true 404 for an unknown URL has no skip link at all** — gate 2 didn't test that surface. | **confirmed for routed pages; gap found on the true 404 — see C3-K-2** |

---

## New observations — C3-K-*

### C3-K-1 — Footer's two-column grid puts tab order out of step with visual order at ≥768px

- **Where:** `site-footer.module.css` — `.inner` is `display:flex;flex-direction:column` below 768px, but becomes `display:grid;grid-template-columns:repeat(2,1fr)` at ≥768px with no explicit `grid-template-areas`/`order`, so the two-column arrangement is pure DOM-order auto-placement. Reproduced on the home page at 1280 (footer has contact + newsletter + legal nav, i.e. the tallest footer configuration); the site-footer markup is shared, so any page with the same three slots at ≥768px is affected the same way.
- **Steps:** on `/` at 1280×900, focus the skip link and press Tab 29 times in a row (or Tab from the "Anmelden" newsletter button, 3 more times).
- **Observed:** tab stop 24 lands on "Datenschutzerklärung" (the newsletter block's own inline consent link, absolute document Y ≈ 5318). Tab stop 25 lands on "Impressum" (the footer's legal `<nav>`, document Y ≈ 5165) — **153px higher on the page than the stop just left.** Tab stop 26, "Datenschutz", sits at the same Y as stop 25.
- **Why:** the newsletter slot (left grid column) is taller than the legal nav (right grid column) in the same row, because its own consent paragraph sits below the email field + button. Tab order is column-major (finish the left column, then the right), so the last item of a tall left column can sit visually lower than the first item of a shorter right column in the same row — DOM/reading order and Tab order both do this legitimately, but neither matches strict top-to-bottom screen position.
- **Confirmed absent at 360px:** at that width `.inner` is a single flex column, so DOM order and visual order coincide exactly; no jump.
- **Note:** this is the standard "read column, then next column" tradeoff of any multi-column CSS grid tabbed in DOM order, not a broken tab sequence (nothing is skipped, nothing traps) — flagging as a keyboard-only observation per the persona brief ("focus order jumping visually"), not asserting a severity.

### C3-K-2 — The true 404 (unknown URL) has no skip link and no header/nav landmarks at all

- **Where:** `app/global-not-found.tsx` — the surface any genuinely unknown URL reaches (confirmed via `/dies-gibt-es-nicht-xyz` → 404 and `/en/this-does-not-exist-xyz` → 404). This file renders its own bare `<html><body>`, bypassing `SiteChrome` entirely — it never runs the header, breadcrumb, or skip-link component tree.
- **Steps:** navigate to `/dies-gibt-es-nicht-xyz` (or the English equivalent), press Tab once.
- **Observed:** focus lands directly on the place-search postcode input (`#ort-suche-404`) — tab stop 1. The full stop sequence is: input → "Suchen"/"Search" button → 4 job-band links → "Zur Startseite"/home link → (cycle). No "Zum Inhalt springen" skip link, no header navigation, no breadcrumb — 7 focusable stops total versus 26–32 on a routed page.
- **Contrast:** C-K-8 (gate 2) confirmed the skip link first on every *routed* page; gate 2 never drove a genuinely unknown URL, so this gap wasn't visible until this round.
- **Note:** the page is a single short article with no long navigation to skip past, so the practical value of a skip link here is small — flagging as an observation for QA to weigh (the site is otherwise consistent about providing one), not asserting a defect.

### C3-K-3 — Tab-stop counts are identical at 360 and 1280 on every route tested (positive)

- **Where:** all 6 routes × 2 locales.
- **Observed:** the full-cycle tab-stop count is exactly the same at 360 and 1280 for every route: home 30, archive 32, place 30, register 27, order 26, regionQuote 32. No element is reachable at one breakpoint and not the other; nothing appears or disappears from the tab sequence between mobile and desktop layout.

### C3-K-4 — Focus ring is a consistent, visible 3px solid violet across the site (positive)

- **Where:** every control checked in every tab walk.
- **Observed:** `outline: solid 3px rgb(83, 27, 222)` (a violet, matching the persona brief's "3px violet ring") on links, buttons, radios, and text inputs directly; on the compound search-field control the same ring appears on the `.field` wrapper via `:focus-within` (see methodology note above) rather than on the `<input>` itself. Across ~700 recorded tab stops (24 route/locale/viewport tab walks) no control was found with neither its own nor an ancestor's ring — once the wrapper-ring pattern is accounted for, invisible focus was not reproduced anywhere in this round.

---

## Coverage summary

| Route | de | en | 360 | 1280 | Conversion path driven to completion |
| --- | --- | --- | --- | --- | --- |
| `/` (home) | ✓ | ✓ | ✓ | ✓ | — |
| `/ueber-uns/archiv` | ✓ | ✓ | ✓ | ✓ | archive filter (chip activation) |
| `/dein-ort` | ✓ | ✓ | ✓ | ✓ | save-calendar-to-homescreen |
| `/mitmachen/registrieren` | ✓ | ✓ | ✓ (de) | ✓ | register-as-publisher |
| `/dein-kalender/bestellen` | ✓ | ✓ | ✓ (de) | ✓ | buy-calendar-licence |
| `/deine-region/angebot` | ✓ | ✓ | not re-driven | ✓ | request-licence-quote |
| unknown-URL 404 | ✓ | ✓ | not re-driven | ✓ | 404 place search → `/dein-ort?ort=…` |
| language switch | ✓ | ✓ | — | ✓ | all 6 routes, both directions |

**Not covered, out of this round's named scope:** `placeStart`, `takePart`, `region` (parent pages), `legal`. `/deine-region/angebot` and the 404 were not re-walked at 360 — DE was re-verified at 360 for the other two conversion paths (place, register, order) and no viewport-dependent difference showed up there, so a regression specific to quote/404 at 360 is possible but unconfirmed either way.

---

## Session completion

**Routes covered:** 6 routed pages + the true 404, both locales, both viewports for the tab-walk/landmark checks; all 4 conversion paths (place search, registration, order, quote) driven to completion keyboard-only in both languages.

**Gate-2 items still reproducing:** none. C-K-1 and C-K-2 are fixed and verified with direct evidence (not just absence-of-observation). C-K-3–7 are upgraded from "entry point only" to "full path confirmed." C-K-8 holds for every routed page; a related gap (no skip link on the true 404) is newly recorded as C3-K-2.

**Tab-stop counts (cycle length, identical at 360 and 1280):** home 30 · archive 32 · place 30 · register 27 · order 26 · regionQuote 32 · unknown-URL 404: 7.

**Invisible focus:** none reproduced once the search field's documented wrapper-ring pattern (`:focus-within` on `.field`, not on the `<input>` itself) is accounted for — see the methodology note and C3-K-4.

**Three most striking new observations:**

1. **C3-K-1** — the footer's 2-column CSS grid (≥768px) sends tab order 153px up the page between stop 24 and stop 25 (newsletter's own consent link → the separate legal nav beside it), a reproducible visual/tab-order mismatch inherent to column-major tabbing through a multi-column grid.
2. **C3-K-2** — the *true* 404 (an actually unknown URL, `app/global-not-found.tsx`) has no skip link and no header navigation at all, unlike every routed page including the in-tree localized 404 — gate 2's C-K-8 never tested this surface because gate 2 didn't drive a genuinely unknown URL.
3. **C3-K-4 / methodology** — the site's `:focus-within`-on-wrapper pattern for the search field is real and correct, but a check that only inspects the focused element itself (rather than the nearest ancestor) will misreport it as invisible focus — worth carrying forward into how future rounds implement the "focus ring visible" check.

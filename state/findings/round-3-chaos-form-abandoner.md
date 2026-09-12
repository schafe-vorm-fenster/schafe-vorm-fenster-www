# Round 3 — Chaos Testing: Form Abandoner Persona

Test session for the Form Abandoner (Der Abbrecher) persona.

**Source:** chaos:form-abandoner
**Environment:** https://schafe-vorm-fenster-5jupiff6w-schafe-vorm-fenster.vercel.app (M5 preview)
**Test routes:** `/mitmachen/registrieren` (+ `/en/take-part/register`), `/dein-kalender/bestellen` (+ `/en/your-calendar/order`), `/deine-region/angebot` (+ `/en/your-region/quote`), the footer newsletter block (site-wide), the footer contact form (site-wide), `/dein-ort` (place search, two search widgets on one page)
**Viewports:** 1280×900 and 360×780
**Locales:** de and en
**Session ID:** chaos-abandon-run-3

Method: fresh `BrowserContext`s were used to simulate "coming back later" /
a new session (no cookies, no storage carried over); ordinary `page.goBack()`
was used to simulate the Back button; direct `page.goto()` to simulate
typing/bookmarking a URL.

---

## Gate-2 observations re-run

| Gate-2 ID | Still reproduces? | Notes |
| --- | --- | --- |
| C-A-01 (`{county-or-organization}` unsubstituted in EN quote heading) | **Fixed** | `/en/your-region/quote` now renders `Request a quote for your organisation` — no raw template token. |
| C-A-02 (German labels on EN quote form) | **Fixed** | All checked labels (`E-Mail-Adresse`→`Email address`, `Telefon`→`Phone (optional)`, `Worum geht es?`→`What is it about?`, `Absenden`→`Send`, `Nachricht`→`Message`) are English on the EN form. Note: the label "Organisation" is unchanged between locales — that is **not** a residual German string, it's the deliberate EN copy too (`src/components/envoy-form-mount/fields.ts:61`, `label: { de: "Organisation", en: "Organisation" }`, a valid English spelling). My first automated pass flagged it as a false positive; visual/DOM inspection confirms it's intentional. |
| C-A-03 (mixed-language footer on EN quote page) | **Fixed** | Footer and quote form both read English after switching to `ENGLISH`. |
| C-A-04 (billing/contact fields not retained across sessions) | **Still true — by design, unchanged** | Same on-page disclaimer, same behaviour. Not a defect. |
| C-A-05 (registration restarts at step 1 in a fresh session via bare URL) | **Still true — by design, unchanged** | Confirmed intentional: the flow's *entire* state lives in the URL query string (`?ort=&wer=&weg=`), never in storage — matches `e2e/pages/registrieren.spec.ts` (`TS-023-A2/A3/A7`). A bookmarked/full URL *does* resume correctly mid-flow (verified in C3-A-04 below); only a bare route restarts. Not a defect. |
| C-A-06 (quote form data lost across a DE→EN→DE language-switch round trip) | **Still reproduces** | Filled `#envoy-quote-organisation`, switched to `ENGLISH` then back to `DEUTSCH`: field is empty on return, same URL (`/deine-region/angebot`). |

---

## New observations (round 3)

### C3-A-01 — Footer newsletter signup silently wipes unsaved input in every other form on the same page

- Source: chaos:form-abandoner
- Where: footer `NewsletterBlock` (`src/components/newsletter-block/newsletter-block.tsx`), present on every route
- Steps:
  1. On `/deine-region/angebot`, fill in the quote form (`#envoy-quote-organisation`, `#envoy-quote-name`, …) but do not submit it.
  2. Scroll to the footer, type a validly-formatted address into the newsletter email field (`#newsletter-email`), click "Anmelden".
- Observed: the page performs a real full-page navigation (a native GET submit — the newsletter `<form>` has no `action`/`onSubmit`, and its `<input>` deliberately carries no `name`, per the component's own doc comment). The quote form's fields are empty afterwards. Reproduced identically against the footer contact form (`#envoy-contact-*`) on the same page. Root cause: this is the *only* form on the site whose submission is not intercepted by client-side JS — its sibling forms (`envoy-form-mount`) call `preventDefault()` and swap in a success message in place, which is why filling and abandoning *those* forms and pressing Back preserves the values (see C3-A-04), while a newsletter-signup click destroys anything else on the page.
- Reproducible: yes, deterministically, on `/deine-region/angebot` (quote + footer contact) and `/mitmachen/registrieren`, `/dein-kalender/bestellen` (see C3-A-02). Confirmed at 1280 and 360, DE and EN.

### C3-A-02 — Same newsletter-submit bug also drops the order/registration flow's own URL state, resetting it to step 1

- Source: chaos:form-abandoner
- Where: `/dein-kalender/bestellen`, `/mitmachen/registrieren` (and their `/en/…` equivalents) — flows whose entire progress lives in the query string
- Steps:
  1. `/dein-kalender/bestellen`: search a postcode (`17495`), add the resulting place to the selection (`?orte=beispielhausen`).
  2. Scroll to the footer, fill the newsletter email, click "Anmelden".
- Observed: navigates to `/dein-kalender/bestellen` with the `?orte=…` parameter gone — the selected-places state (which the whole flow relies on, per C-A-05's own "state lives in the URL" design) is silently reset to zero places, no confirmation, no warning. Reproduced the same way on `/mitmachen/registrieren?ort=…&wer=opt-1` → `wer` and `ort` both dropped, flow reset to step 1.
- Reproducible: yes. Confirmed on DE and EN (`/en/your-calendar/order`) and at 360px viewport.
- Note: because the persona-brief's own accepted framing for C-A-04/C-A-05 is "state lives in the URL, and that's fine, a bare-URL restart is by design" — this finding is exactly the failure mode that design otherwise avoids: a single mis-click on an unrelated, ever-present footer widget throws away the one thing (the URL) the flow was relying on to survive a session.

### C3-A-03 — Newsletter signup gives no success/confirmation feedback of any kind

- Source: chaos:form-abandoner
- Where: footer `NewsletterBlock`, any route
- Steps: fill a validly-formatted email, click "Anmelden".
- Observed: the page reloads to its own bare URL. No success banner, no inline message, no visible sign that a double opt-in email is supposedly on its way (the component is a labelled `Demo-Daten` mock and genuinely sends nothing, per its own doc comment — but the UI doesn't say so at the moment of "submission" either). A visitor who filled it in, then wandered off (the persona's whole M.O.), has no way to tell on return whether the signup "took".
- Reproducible: yes, every time.

### C3-A-04 — Back-button recovery of unsubmitted input is inconsistent across forms

- Source: chaos:form-abandoner
- Where: `/mitmachen/registrieren` step 1 postcode field vs. `/deine-region/angebot` quote form fields
- Steps:
  1. On `/mitmachen/registrieren`, type a partial postcode (`"101"`) into the search field without submitting. Navigate to `/` (a real link/full navigation), then press Back.
  2. On `/deine-region/angebot`, type into `#envoy-quote-organisation` and `#envoy-quote-name` without submitting. Navigate to `/`, then press Back.
- Observed: (1) the postcode field is empty again — the partial input is gone. (2) the quote form's fields still hold exactly what was typed. Same persona action ("type something, wander off, hit Back"), two different outcomes depending which page it happened on. Confirmed the loss in (1) also happens at 360px.
- Reproducible: yes, both directions, repeatably.
- Note: this is distinct from gate-2's C-A-04/C-A-05 (which are about a genuinely new session / long pause and are accepted as by-design). This is the same tab, same session, an ordinary Back press seconds later — the kind of recovery a visitor reasonably expects to work everywhere once she's seen it work once.

### C3-A-05 — Ambiguous-postcode disambiguation is not reachable via the live postcode search (informational, not a defect)

- Source: chaos:form-abandoner
- Where: `/dein-ort` postcode search
- Steps: searched the fixture's own "ambiguous" zip (`18299`, `AMBIGUOUS_DEMO_ZIP` in `src/lib/live/mocks/fixtures.ts`).
- Observed: resolves straight through to a single place page ("Musterhausen"), no multi-candidate picker to leave unanswered. This matches the codebase's own admission (`e2e/pages/registrieren.spec.ts` doc comment: multi-suggestion municipality hits have "no naturally-occurring fixture… not e2e-walkable today"). Recorded so the round doesn't read as "checked and found nothing" — there was a one-off disambiguation prompt to hunt for, per the persona brief, and it isn't wired into the live zip-search path yet.
- Also checked: `/dein-ort` renders **two** identical postcode-search widgets on the same page (`#ort-suche-fokus` near the top, `#ort-suche-abschluss` near the bottom). Typing into one does not leak into the other — verified clean, no cross-talk.

### C3-A-06 — The "language-suggestion" one-off prompt does not exist yet at M5 (informational, not a defect)

- Source: chaos:form-abandoner
- Where: site-wide (`proxy.ts`)
- Observed: the persona brief specifically calls out leaving "the language-suggestion … prompt unanswered". `proxy.ts` computes a `suggestedLanguage` signal and exposes it only as a `Server-Timing` response header; its own comment says outright: "the deferred client-side banner (Q-011) is not built here". No banner appeared in any test (Accept-Language mismatches were not specifically forced via headers, but no UI consumer of the signal exists in the client bundle either). Recording this so its absence isn't mistaken for "nothing to report" — the feature this instruction targets isn't shipped yet.

---

## Routes covered

1. `/mitmachen/registrieren` — all 3 steps, DE and EN (`/en/take-part/register`), 1280 and 360
2. `/dein-kalender/bestellen` — steps 1–4, DE and EN (`/en/your-calendar/order`), 1280 and 360
3. `/deine-region/angebot` — DE and EN (`/en/your-region/quote`), 1280
4. Footer newsletter block — every route it renders on, DE and EN, 1280 and 360
5. Footer contact form (`envoy-contact-*`) — `/deine-region/angebot`
6. `/dein-ort` — postcode search (both on-page widgets), covered/uncovered/ambiguous zips
7. Language switch (DEUTSCH/ENGLISH) on `/deine-region/angebot`

Not covered / skipped: `/dein-ort/starten` beyond the uncovered-zip hop-through (place-hop already exercises it); no attempt was made to force an `Accept-Language` mismatch to test C3-A-06 more directly, since the client-side consumer doesn't exist to test against yet.

## Summary

- **Total new observations**: 6 (C3-A-01 … C3-A-06), 3 of them the same underlying newsletter-submit defect manifesting three ways
- **Gate-2 items still reproducing**: 1 of 6 (C-A-06); 3 fixed (C-A-01/02/03); 2 unchanged by-design (C-A-04/05)
- **Most striking findings**:
  1. C3-A-01/02 — the footer newsletter "Anmelden" button is a live landmine on every single page: because it's the only form on the site without a JS submit handler, clicking it (with any validly-formatted email) does a real page navigation that silently destroys unsaved input in whatever other form shares the page — including, on the order and registration flows, the flow's own progress, since that progress lives entirely in the URL the navigation just discarded.
  2. C3-A-03 — that same "successful" newsletter submission gives no feedback whatsoever, so a visitor can't tell the difference between "it worked" and "nothing happened".
  3. C3-A-04 — Back-button recovery of an abandoned, unsubmitted field is inconsistent: it works on the quote form, it doesn't on the registration search field, with no visible reason a visitor could infer why.

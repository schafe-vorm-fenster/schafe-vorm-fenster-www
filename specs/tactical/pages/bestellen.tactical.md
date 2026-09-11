---
artefact: tactical-spec
id: TS-025
profile: interaction
status: DRAFT
implements: [WEB-F-015]
sources: [SRC-001, SRC-003, SRC-008, SRC-011, SRC-014]
decisions: [DEC-010, DEC-011, DEC-013, DEC-024, DEC-025, DEC-030, DEC-034, DEC-036, DEC-051, DEC-056]
---

# TS-025 — Order the Calendar (`/dein-kalender/bestellen`)

## Purpose

The page brief of `/dein-kalender/bestellen` (SRC-003 §Order the calendar) in
buildable form: how the scope drives a live preview, what the invoice step demands
of the Verwaltung, what leaves the page in step 4. Page-specific matter only —
composition TS-006 · components SRC-014 · routes and BFF TS-004 · live modules
TS-008 · fallback tiers TS-009 · forms, briefing exit and the four-step model
TS-016 D7/D8 · events TS-012 D4 · rate limits TS-014 D9–D11 · SEO TS-011. Two
suppliers gate the page: the handover belongs to envoy (DEC-051, open as Q-022),
the embed code to Portalize (DEC-030, D7).

## Determinations

### D1 — Page manifest [FIXED: SRC-003; representation per TS-006 D1]

| Field | Value |
| --- | --- |
| `focusJob` | run our own calendar |
| `primaryConversion` | `buy-calendar-licence` |
| `equalWeightConversion` | `null` — the briefing is an exit on every step (D5), not a second goal; equal weight lives on `/dein-kalender` (WEB-F-014) |
| `audiences` | municipalities, institutions (in that order) |
| `liveModules` · `proofSlots` | the scope preview (D4), and no proof slot — the decision was made on `/dein-kalender`; the flow does not re-argue it |

One route, not four (TS-004 D1/D2); TS-006 D2's blocks 3 and 4 render once, after step 4.

### D2 — Step model [FIXED: TS-016 D8, SRC-003]

Steps and their binding properties are TS-016 D8. This page adds: the step travels
as `schritt=1..4`, so back and forward work and no step is reachable past an
unsatisfied one — `schritt=3` without a scope lands on step 1. Steps 1 and 2 share
one screen (tick → preview beside it).

### D3 — Scope selection [FIXED: DEC-024, TS-008 D7; realisation PROPOSED]

| Mode | Input | Resolution | State today |
| --- | --- | --- | --- |
| Places | the place search component (TS-008 D7), unchanged | each hit becomes a removable chip carrying the geo-api `slug` | ZIP-only until Q-025 lands — a Verwaltung normally types its municipality name, so this bites hardest here |
| Postcode | 5 digits | resolves to the places the ZIP covers; each becomes its own chip, never a single opaque "ZIP" item | works today |
| County | county selection | one chip for the county; the places behind it are **not** expanded into chips (DEC-034) | no contracted route returns the places of a county — UNKNOWN, see Open points |

The selection lives in the URL (D8), never in a path segment (WEB-F-023, DEC-037);
above 12 chips the row collapses to "n Orte ausgewählt" plus a disclosure. No cap
on the scope — what a scope costs is open (Open points).

### D4 — The live preview: what it shows and what it costs [PROPOSED]

The preview answers "what would be in my calendar", not "what will my calendar look
like": rendering the product needs the loader's place filter (Q-026), and an
unfiltered reference calendar would misrepresent the purchase.

| Aspect | Determination |
| --- | --- |
| Content | number of places in scope · number of upcoming dates · up to 5 next dates as event rows (SRC-014) · for a county additionally the active example places (DEC-034) |
| Source and cost | one BFF route, `GET /api/scope/preview?orte=&plz=&kreis=` — an addition to the TS-004 D5 inventory, upstream events-api + geo-api. At most one request per scope change, debounced 400 ms, the in-flight request cancelled by the next, results cached per scope key. Never a per-place fan-out from the browser |
| Layout | the preview box declares its height before the data arrives (WEB-Q-009, SRC-014 §Reserved space): fixed-height counter badges, five reserved event rows at 76 px, skeleton per TS-009 D7. Ticking a box never moves anything below the preview |
| Scope extremes | empty scope: no request, designed empty state, step 3 unreachable. Zero dates *in* a scope: the honest publishing invitation, never a fabricated figure (WEB-F-041). County: never a place list (DEC-034) — counters plus examples, same fixed box, same one request |
| Failure / 429 | tiers per TS-009 D4; a `429` renders as a component state (TS-014 D10), never an error page. A failed preview never blocks the order — step 3 stays reachable |

### D5 — The briefing exit, on every step [FIXED: DEC-010, DEC-013, TS-016 D7]

One outbound link to the configured appointment schedule, visible on all four
steps, secondary treatment, never above the primary CTA (TS-006 D3). No embed,
iframe, Google script or font on any step. Leaving is a plain navigation — the
scope is in the URL, so back restores it (D8).

### D6 — Invoice details are addressed to an authority [DEMANDED — the form belongs to envoy (DEC-051), field set PROPOSED]

Step 3 is an envoy instance under TS-016 D2/D5 — mount point only, nothing
held, no endpoint. The field set is a **row of the Q-022 demand**.

| Field | Required | Why it is not a consumer field |
| --- | --- | --- |
| Körperschaft / Behörde (legal name), Amt / Abteilung | yes / no | the buyer is the authority; a person's name never stands alone, and invoices inside a Verwaltung are routed by department |
| Rechnungsanschrift (Straße, PLZ, Ort), abweichende Rechnungsstelle | yes / no | an official address, never a private one; commonly the Kämmerei receives what the Amt ordered |
| Ansprechperson + dienstliche E-Mail | yes | contact for the order, not the contracting party |
| Bestellzeichen, Leitweg-ID (E-Rechnung), USt-IdNr. | no | offered because public-sector accounting routes on them; without a Bestellzeichen or a Leitweg-ID the invoice may bounce |

Forbidden: any payment field (DEC-011), any private address, any field the invoice
does not need. Price per WEB-F-020 / TS-006 D10. Tone: an office doing its job.

### D7 — What "embed code out immediately" is [FIXED that it is immediate: DEC-011; artefact UNKNOWN]

The artefact is the DEC-030 loader snippet — the two lines `/dein-kalender`
promises: `<script src=".../api/{organizerId}/load.js">` plus its mount element,
carrying the organizer id created by this order. What is unclear is not its shape
but where it comes from.

| Aspect | State |
| --- | --- |
| Rendering | selectable text in a code block plus a copy control; the text is server-rendered content, never produced by a download or a script-only path |
| Who mints `organizerId` | Portalize. **No contracted provisioning endpoint exists** — Q-026 covers cookie-freedom and the place filter only. UNKNOWN |
| Synchronicity | TS-016 D8 requires the receiving system to produce the code synchronously. Until Portalize confirms it can, DEC-011's "immediately" is unbacked — this is the page's hardest blocker, not a detail |
| If it cannot be issued synchronously | step 4 shows the confirmation, names when the code arrives, and the `buy-calendar-licence` event does **not** fire (D11) — a confirmation without a code is not the goal |
| Second copy | the code must also reach the visitor by email, so closing the tab does not lose the purchase — an unanswered row of the envoy/Portalize demand |

### D8 — The flow across a reload: nothing is stored [FIXED: WEB-Q-020/023, TS-013 D1; carrier PROPOSED]

The website sets no cookie and writes no `localStorage`, `sessionStorage`
or IndexedDB entry — here as everywhere. No "pending" state is ever held.

| What | Carrier | Reload behaviour |
| --- | --- | --- |
| Scope + step | URL query (D2, D3) | survives; the URL is also shareable and pasteable into a mail to the Kämmerei, which is a real use in a Verwaltung |
| Invoice details | component state inside the envoy widget | **lost**. The visitor returns to step 3 with the scope intact, the fields empty, and a visible note saying so — never a silent blank form |
| Embed code | not held anywhere by the website | lost on reload; step 4 says "kopiere den Code jetzt" as permanent copy next to it, not as a dialog or an unload prompt |

### D9 — The flow is `noindex` [PROPOSED — TS-011 D9 says otherwise and must be amended]

`noindex, follow` as both `X-Robots-Tag` and meta tag on every response; the route
is absent from `sitemap.xml`. `/dein-kalender` is the search surface, its checkout
is not. **TS-011 D9 does not cover this** — it names `/dein-kalender/bestellen`
explicitly as "indexable, no special treatment ... not funnels". Wrong here: scope
parameters would produce unbounded near-duplicate URLs, and a searcher landing
mid-flow has skipped the argument. Until it is resolved (Open points) the two specs
disagree in writing rather than silently.

### D10 — Security: the one flow that takes billing data [FIXED: TS-014 D9–D11, TS-016 D5, WEB-Q-038]

| Rule | Here |
| --- | --- |
| Billing data never traverses the website | no POST route, no server action, no edge function — envoy receives directly (DEC-025); no field value appears in Vercel runtime logs, error reports or D11's payloads |
| Rate limit, origin check, spam layers | the preview route joins TS-014 D10 at 30/min per IP, `429` + `Retry-After: 60`, limits high for carrier-NAT villages; TS-014 D11 unchanged and no CORS headers on it; honeypot and timing belong to envoy (TS-014 D9) — the website adds no competing layer and no captcha, here least of all |
| CSP | envoy and Portalize hosts are allowlist entries (TS-014 D1) — both UNKNOWN. No payment-provider host exists in the policy, now or later (DEC-011) |

### D11 — Measurement [FIXED: TS-012 D4]

One `buy-calendar-licence` event, stage `completed`, fired once when step 4 renders
a code — not on reaching step 4, not on submitting step 3 (D7). A briefing click
fires `request-product-briefing`, stage `handover`. Payloads carry goal ID, route
and step, never a field value. Both wait on envoy's event contract (Q-022 C3).

## Free for the generator

- [FREE] Arrangement of scope input and preview, within D4 and SRC-014.
- [FREE] Stepper, back navigation, file layout — within D2 and TS-016 D8.
- [FREE] Copy, labels and empty/lost-state notes (WEB-F-087), within D6.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-025-A1 | static | `page.meta.ts` for the route matches D1 field for field; `primaryConversion` resolves in the hub goal set; `equalWeightConversion` is `null`. |
| TS-025-A2 | e2e | All four steps are walked; on each one the briefing link is visible and navigates to the configured Google Calendar URL; no step loads a Google script, iframe or font, and no Google host appears in any request. |
| TS-025-A3 | e2e | With a layout-shift observer running, ticking three places one after another updates the preview each time and produces zero layout shift in and below the preview box. |
| TS-025-A4 | e2e | With no place selected: no preview request is fired, the empty state is visible, and step 3 cannot be reached — neither by the CTA nor by editing `schritt=3` into the URL. Selecting a county then renders counters plus at most five example places, no place list, and fires exactly one preview request. |
| TS-025-A5 | integration | Every preview request goes to the same-origin BFF route; no ecosystem host and no token appears in the browser; the 31st request within a minute returns `429` with `Retry-After`, and the page shows a component state, not an error page. |
| TS-025-A6 | e2e | No step contains a card, IBAN or payment field; no payment-provider host appears in any request or in the CSP; step 4 is reached without any payment interaction. |
| TS-025-A7 | e2e | Step 4 shows the embed code as selectable text with a copy control, and no "pending payment" or "code follows after payment" state exists anywhere in the flow. |
| TS-025-A8 | e2e | Reload on step 2 restores the scope from the URL. Reload on step 3 restores the scope, leaves the invoice fields empty and shows the note. After a full run no cookie is set and `localStorage` / `sessionStorage` / IndexedDB are empty. |
| TS-025-A9 | e2e | Network and log trace of a full run: no invoice field value reaches our origin, any Vercel log line, or any analytics payload. |
| TS-025-A10 | integration | Every step URL returns `noindex, follow` in both the `X-Robots-Tag` header and the meta tag; the route does not appear in `sitemap.xml`. |
| TS-025-A11 | e2e | Exactly one `buy-calendar-licence` event with stage `completed` fires, and only when a code is shown; a run ending without a code fires none; each briefing click fires one `request-product-briefing` handover event. |
| TS-025-A12 | tool | axe-core: zero violations on all four steps in light, dark and high contrast, including inside the order form's shadow root. |
| TS-025-A13 | manual | Keyboard-only run through all four steps: every chip is removable, focus moves to the preview update announcement, invalid invoice fields identify the error in text, and the code in step 4 is reachable and copyable. |
| TS-025-A14 | e2e | With the envoy script blocked, step 3 renders the static fallback (contact link plus briefing link) — never an empty slot and never a spinner that does not resolve. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-015 (`/dein-kalender/bestellen`, focus job "run our own calendar", conversion `buy-calendar-licence`) | D1 brief · D2, D5 flow and exit · D3, D4 scope and preview · D6 invoice step · D7 code · D8 no storage · D9 indexing · D10 security · D11 measurement · A1–A14 |

Served, not claimed: WEB-F-093/094 · WEB-Q-009 · WEB-Q-038 · WEB-Q-028 ·
WEB-F-020 · WEB-F-041.

## Open points

- **Portalize (Q-026 extension) — synchronous organizer provisioning.** Nothing
  mints an `organizerId` during an order, so DEC-011's "code immediately" has no
  mechanism behind it. Blocks D7, A7, A11 — this page's release blocker. Also
  demanded: the snippet text and the loader's place filter (D4).
- **envoy (Q-022) — the order form kind.** DEC-051 fixes that envoy receives, but
  the contract holds no order form: field set (D6), the event carrying the scope,
  the `success` payload handing back the code, an emailed second copy. Blocks D6,
  D7, D11, A14.
- **TS-011 owner — D9 contradiction.** TS-011 D9 calls this route indexable, TS-025
  D9 sets `noindex, follow`. Both cannot ship.
- **TS-004 owner — `GET /api/scope/preview` is a new BFF route** absent from the D5
  inventory; **TS-014 owner — it needs a limit row** (30/min, D10). Without it the
  preview degenerates into browser-side fan-out.
- **geo-api (Q-025 + new) — county scope.** No contracted operation returns a
  county's places or their event counts, so D3's county mode and D4's county preview
  rest on nothing. ZIP-only search hurts most here.
- **Product / pricing (SRC-003 pricing rule) — what does a scope cost?** 480 €/year
  is published for "your places" with no rule for how many, none for a county; the
  flow can assemble a scope it cannot price.
- **TS-016 owner** — D8's "two candidates for step 3" is stale; DEC-051 chose envoy.
- [PROPOSED]: D2, D3 realisation, D4, D6 field set, D8 carrier, D9, D10's limit row.

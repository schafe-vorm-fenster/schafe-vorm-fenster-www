---
artefact: tactical-spec
id: TS-016
profile: interaction
status: DRAFT
implements: [WEB-F-090, WEB-F-091, WEB-F-092, WEB-F-093, WEB-F-094, WEB-F-095, WEB-F-096]
sources: [SRC-003, SRC-008, SRC-011]
decisions: [DEC-009, DEC-010, DEC-011, DEC-013, DEC-014, DEC-015, DEC-025, DEC-026, DEC-030]
---

# TS-016 — Forms, Leads and Outbound Handovers

## Purpose

Every place where the website takes something from a visitor or hands
them onward: lead forms (owned by the envoy widget), briefing booking
(an outbound Google Calendar link), the on-invoice order flow, external
media (own previews plus outbound links), and newsletter signup.

**This spec is partly blocked and says so.** The envoy widget is not
finished and its contract is an open demand (Q-022): the CSS variable
set, the emitted events, the spam handling, the accessibility
conformance and the delivery date are all UNKNOWN. Nothing here invents
them. What is determined is the website side — where forms appear, what
the website supplies, what it must never hold, and how the boundary is
verified — plus the demand itself (D4), written so that integration is a
day's work once the contract lands.

Conversion goal IDs referenced below are defined in
`@schafe-vorm-fenster/goals` (SRC-008) and
are never redefined here. Routes are TS-004 D1; the link facade is
TS-001 D5.

## Determinations

### D1 — Lead and handover surface inventory [FIXED: SRC-003, pages.req.md; in-page placement PROPOSED]

Every surface that takes input or hands the visitor onward. One row =
one surface. "Owner" says which system receives the interaction —
the website receives none of them.

| # | Surface | Route(s) | Kind | Owner | Conversion goal |
| --- | --- | --- | --- | --- | --- |
| S1 | Contact | footer, every page (WEB-F-021) | lead form | envoy widget | none (service contact) |
| S2 | Quote request, with the two-working-day promise (WEB-F-022) | `/deine-region`, `/deine-region/angebot` | lead form | envoy widget | `request-licence-quote` |
| S3 | Briefing booking | `/dein-kalender`, `/deine-region`, every step of S4 | outbound link | Google Calendar appointment schedule | `request-product-briefing` |
| S4 | Order the calendar | `/dein-kalender/bestellen` | multi-step order, concludes on invoice | open (D8) | `buy-calendar-licence` |
| S5 | Newsletter signup | footer (WEB-F-021); inline placement still open in SRC-003 | signup form, double opt-in | UNKNOWN (Q-020) | none defined |
| S6 | External media preview | `/ueber-uns/archiv`, inline proof anywhere | own preview + outbound link | none (static link) | none |
| S7 | Registration handover | `/mitmachen/registrieren` | handover to the app | app (DEC-029) | `register-as-publisher` → `publish-first-event` |

S7 is listed for completeness of the "hands them onward" set and is
specified elsewhere (DEC-029); it is not a form and is not claimed by
this spec's `implements`.

Rules that hold for every row: the website ships **no form backend and
no form route** — nothing under `app/api/` accepts a submission
(WEB-F-090, DEC-025); the BFF inventory (TS-004 D5) stays read-only and
gains no POST route from this spec. envoy and Portalize talk to their
own backends directly and are **not** proxied through the BFF.

### D2 — Embedding model for the envoy widget [FIXED: DEC-009, DEC-015, DEC-025; mechanics PROPOSED]

| Aspect | Determination | Tag |
| --- | --- | --- |
| Form of integration | A custom element (web component) placed by the page; the website renders the mount point and nothing else | FIXED: DEC-009 |
| Loading | Widget script loaded deferred, never render-blocking, excluded from the LCP path (TS-003 D2/D5) | FIXED: TS-003 |
| Placement | One instance per surface in D1; never more than one instance of the same form kind per page | PROPOSED |
| Configuration | Passed as attributes on the element: form kind, page language (TS-001), source route, and the offering/goal context of the surface — attribute *names* are part of Q-022 | PROPOSED |
| Network path | Direct browser → envoy host. Not proxied; CSP `connect-src`/`script-src` entry for that host (WEB-Q-030/031) | FIXED: DEC-025, DEC-015 |
| Host value | UNKNOWN — SRC-011 records envoy-api's host as not yet published. The CSP entry cannot be written until it is (Q-022) | UNKNOWN |
| Server rendering | The page renders and is fully usable without the widget having loaded; no page is blocked on it (TS-005/WEB-F-106 skeleton rules apply to the slot) | FIXED: DEC-019 |
| Isolation | The widget may use a shadow root; the page must not reach into it, and no page CSS may target its internals — theming happens only through D3 | PROPOSED |

### D3 — Theming handoff: CSS variables on a wrapper [PROPOSED — content blocked by Q-022]

The website styles the widget by declaring CSS custom properties on the
element that wraps the mount point (WEB-F-091). The website side is
determined now; the variable *names* are not.

1. Values come from the brand token set — the same tokens the rest of
   the site uses (TS-002 D4), never literals repeated for the widget.
2. Because tokens are defined for light, dark and high-contrast, the
   widget inherits all three themes automatically; no widget-specific
   theme switching exists, and no theme toggle exists at all (TS-002 D4).
3. Contrast rules bind the mapped values as they bind everything else
   (TS-002 D3) — in particular the brand green is never mapped to a
   variable that ends up as text colour on light ground.
4. Font-size values are rem-based (TS-002 D4); the widget must not fix
   px sizes.
5. **The mapping table is empty on purpose.** Once Q-022 publishes the
   variable set, exactly one file holds `widgetVariable → design token`
   and a build check fails on any published variable left unmapped
   (A4). No variable is guessed in advance.

### D4 — The demand to envoy (Q-022), as the website needs it [FIXED as demand: DEC-009, DEC-014, TS-002, WEB-F-022; answers UNKNOWN]

This is the concrete form of the open demand. Every row is unanswered
today; each is what the website needs in order to integrate, and the
"Website depends on it for" column says what stalls without it.

| # | Demanded | Website depends on it for | State |
| --- | --- | --- | --- |
| C1 | The complete CSS variable set, with defaults and semantics | D3 mapping file, A4 | UNKNOWN |
| C2 | Element name, attribute names and allowed values (form kind, language, source, context) | D2 configuration row | UNKNOWN |
| C3 | Emitted DOM events for `submit`, `success`, `error`, `validation-error`, with a payload that carries **no field values** | D12 conversion measurement, D6 error handling, D5 boundary | UNKNOWN |
| C4 | Spam handling: honeypot field, submission-timing check, server-side rate limiting, **no captcha of any kind** | WEB-Q-035, DEC-014 — binding on the widget, not negotiable | DEMANDED, unconfirmed |
| C5 | Accessibility conformance: WCAG 2.2 AA inside the host page — label association, error identification, focus management, visible focus, target sizes | TS-002 D5/A6, this spec A8/A9 | UNKNOWN |
| C6 | Testability of the above: the widget's DOM reachable for axe-core and for keyboard/screen-reader runs even behind a shadow root | A8 | UNKNOWN |
| C7 | Cookie-freedom and no persistent identifiers in the browser | WEB-Q-020/023 — the banner-free promise must stay true | DEMANDED, unconfirmed |
| C8 | Production host(s) for script and submissions | D2 CSP entry, A1 | UNKNOWN |
| C9 | Localization: German and English form copy and error messages, selected by the page language | TS-001, DEC-026 | UNKNOWN |
| C10 | Delivery date | D6 contingency, launch scope | UNKNOWN |
| C11 | Lead handling behind the widget fast enough to keep the two-working-day response promise on S2 — an operational commitment, not a technical one (WEB-F-022) | The promise copy may not ship without it (A13) | DEMANDED, unconfirmed |

C4, C7 and C11 are not questions to envoy — they are constraints the
website has already fixed and the widget must satisfy. C1–C3, C5, C6,
C8–C10 are genuinely open.

### D5 — Data boundary: the website holds nothing [FIXED: DEC-009, WEB-F-092]

| Rule | Consequence |
| --- | --- |
| Submissions never traverse the website | No POST route, no server action, no edge function touches form data |
| No field value is logged | Vercel logs, error reports and monitoring (DEC-017) must not contain form input; error payloads from C3 carry codes, not content |
| No submission data at rest | The website has no store for leads, no email relay, no queue |
| No field value reaches analytics | Conversion measurement records the goal ID and the route only (D12, WEB-Q-028) |
| Data protection texts follow the fact | The processing description for lead data belongs to envoy-api and is referenced from `/rechtliches#datenschutz` (TS-004 D8), not authored as if the website were the processor |
| Prefill is one-way | A prefilled place or offering context is passed *into* the widget as configuration (D2); nothing comes back out that the website stores |

### D6 — Degradation, failure and the not-yet-delivered case [PROPOSED]

The widget is unfinished and its delivery date is UNKNOWN (C10). The
website must be buildable and shippable regardless.

| Case | Behaviour |
| --- | --- |
| Widget script fails to load or errors | The surface renders a visible, static fallback: the contact route of last resort (an email address rendered as a link) plus, on S2 and S4, the briefing link (S3). Never an empty slot, never a spinner that never resolves |
| Widget reports a submission error (C3) | The widget owns the message; the page adds nothing and does not retry on the visitor's behalf |
| Widget not delivered by launch | Lead surfaces ship with the same static fallback. `/deine-region`'s quote request degrades to briefing link plus email; the two-working-day promise copy is withheld under A13 either way |
| JavaScript disabled | Same static fallback — the fallback is server-rendered markup, not script-generated |

The fallback is one component reused by every surface, so removing it
later is one deletion.

### D7 — Briefing booking is an outbound link [FIXED: DEC-010, DEC-013]

| Aspect | Determination |
| --- | --- |
| Mechanism | A plain link to a Google Calendar appointment schedule URL. No embed, no iframe, no Google script, no click-to-load layer |
| Why it stays off the CSP | An outbound navigation loads nothing into the page, so the allowlist is untouched (DEC-015). Anything that would need a CSP entry is by definition not this |
| URL source | One configured value (environment/config), referenced by every S3 placement — never pasted per page |
| Link attributes | Opens in the same tab by default; if a new tab is used it carries `rel="noopener"` and the link text says so (TS-002 D2, 2.4.9 link purpose) |
| Link text | Names the action and its destination, not "hier klicken"; the label is content (WEB-F-087 placeholder rules apply) |
| Localization | The link *text* is localized; the appointment page itself is an original artifact under Google's terms and is not localized by us (DEC-026) |
| Placement | `/dein-kalender` (equal-weight with the order CTA, WEB-F-014), `/deine-region`, and visible on **every step** of S4 (SRC-003) |
| Measurement | Click completes `request-product-briefing` as a conversion event (D12); the booking itself happens off-site and is not observable to the website |

### D8 — The order flow concludes on invoice [FIXED: DEC-011, SRC-003; submission target OPEN]

Four steps on `/dein-kalender/bestellen` (WEB-F-015):

| Step | Content | Notes |
| --- | --- | --- |
| 1 | Scope: places, postcode, or county | Uses the read-only place BFF routes (TS-004 D5); selection lives in client state only |
| 2 | Live preview that updates with the selection | Portalize loader per DEC-030; talks to its own backend, not proxied |
| 3 | Invoice details, addressed to the Verwaltung | The one input step. Receiving system open — see below |
| 4 | Embed code, delivered immediately | Shown on screen and copyable; delivery is not conditional on payment |

Binding properties:

- **No payment provider.** No payment SDK, no card form, no redirect to
  a PSP, no such host in the CSP (DEC-011, A6).
- The embed code is handed over **in step 4, immediately** — the invoice
  follows out of band (DEC-011). No "pending payment" state exists.
- The briefing exit (S3) is visible on every step (SRC-003).
- Step state is client-side and non-persistent; the website stores no
  order (D5). A reload may restart the flow — acceptable, and preferable
  to holding buyer data.
- Price display follows WEB-F-020 (480 €/year public; net/VAT wording is
  content, not spec).
- **Open, deliberately unresolved here:** which system receives step 3
  and issues the embed code. Two candidates — an order variant of the
  envoy widget (D2 applies unchanged), or a Portalize order endpoint
  (its own backend, DEC-030 pattern). This depends on Q-017 (invoicing
  process: issuing, addressing, dunning) and Q-022 (whether envoy covers
  an order form kind at all). Until one of them answers, step 3 is
  specified only by its constraints: it is not a website endpoint
  (D5), it is not a payment step, and whatever receives it must be able
  to produce the embed code synchronously.

### D9 — External media are own previews plus outbound links [FIXED: DEC-013]

Applies to every media reference — podcast, TV, radio, press, social —
on `/ueber-uns/archiv` and to inline proof anywhere.

| Rule | Detail |
| --- | --- |
| No third-party embed | No iframe, no player script, no social embed, no click-to-load consent layer. There is nothing to consent to, which is the point (DEC-013) |
| Preview composition | Own preview image plus an own short quote/summary, both sourced from the media-echo entry (WEB-F-086, build-time fetch) |
| Image origin | Preview images are served from our own origin or assets-api — never hotlinked from the media host, which would leak the visitor's request |
| Outbound link | One link per entry to the original, link text naming source and subject (2.4.9, TS-002 D2); `rel="noopener"` when opened in a new tab |
| Original artifacts stay original | A quoted headline or clipping remains in its source language even on EN pages (DEC-026); surrounding context is localized |
| Static | The archive is fully static from the build-time fetch (TS-004 D6); no client request ever goes to a media host |

### D10 — Newsletter signup [PROPOSED — sending system blocked by Q-020]

Website-side contract, valid whichever system Q-020 picks:

| Property | Determination | Tag |
| --- | --- | --- |
| Consent model | Double opt-in: the address is unusable until the confirmation link is followed | FIXED: WEB-F-096 |
| Cookieless | Signup sets no cookie and no persistent identifier; the banner-free promise holds here too | FIXED: WEB-Q-020/023 |
| Backend | Not the website. No subscriber endpoint, no list, no address ever at rest here (same boundary as D5) | FIXED: DEC-009 pattern |
| Confirmation URL | Owned by the sending system, not a website route — the website has no DOI endpoint to build | PROPOSED |
| Fields | Email address only; anything more is a decision Q-020 has not made | PROPOSED |
| Placement | Footer on every page (WEB-F-021). Inline placement on trust pages is an open point in SRC-003 and is **not** built until it closes | FIXED: WEB-F-021 / open for inline |
| Legal text | Consent wording and the processing reference point at `/rechtliches#datenschutz` (TS-004 D8) | FIXED: DEC-039 |
| Likely realisation | If envoy covers newsletter subscription, S5 is another widget instance under D2–D3 and nothing else changes. If it does not, Q-020's tool decides, and its embed must satisfy C4, C5 and C7 before it is allowed on the page | PROPOSED |
| Until Q-020 answers | The footer carries the newsletter entry only when a sending system exists; no placeholder form that discards addresses is ever shipped | PROPOSED |

### D11 — Spam protection and accessibility across the boundary [FIXED: DEC-014, TS-002 D5]

The forms belong to the widget; the acceptance belongs to the website.
That is not a contradiction — the website tests the rendered page, and a
widget that fails inside the page fails the website's release.

| Concern | Where it is implemented | How the website verifies it |
| --- | --- | --- |
| Honeypot field | Widget (C4) | Present in the rendered DOM, hidden from assistive technology, never focusable (A10) |
| Submission timing check | Widget (C4) | Behavioural check against envoy staging (A10) |
| Rate limiting | envoy-api (C4); the website's own read endpoints keep theirs (TS-004 D5/A7) | Out of the website's reach; asserted in the contract, not in a website test |
| Captcha | Nowhere. No captcha library, no captcha host, in the page or in the CSP | Static check (A10) |
| Label association, error identification, focus management | Widget (C5) | axe-core on the page with the widget mounted, in all three themes (A8); manual keyboard + screen-reader run of one full form per release (A9) |
| Shadow DOM | Widget (C6) | If automated checks cannot see into it, C6 is unmet and the widget is not release-ready — the untestable case is a failure, not an exemption |

Gate: no envoy release is integrated into production before A8 and A9
pass against it. TS-002 A6 is the same gate seen from the accessibility
side.

### D12 — Conversion measurement of these flows [PROPOSED; frame FIXED: WEB-Q-028]

| Surface | Event fires on | Goal ID |
| --- | --- | --- |
| S2 quote request | widget `success` event (C3) | `request-licence-quote` |
| S3 briefing link | click on the outbound link | `request-product-briefing` |
| S4 order | reaching step 4 (embed code shown) | `buy-calendar-licence` |
| S1 contact, S5 newsletter, S6 media links | no conversion event | — |

Rules: one eTracker event per conversion goal ID, fired at most once per
completed flow (WEB-Q-028); the payload carries the goal ID and the
route, never a field value (D5). S2 and S4 depend on C3 — until the
event contract exists, the measurement cannot be wired, and guessing an
event name would produce silent zero-counts. Goal IDs are consumed from
SRC-008 and never invented here.

## Free for the generator

- [FREE] Visual design of the widget wrapper, the static fallback
  (D6) and the media preview card (D9), within TS-002 contrast, target
  size and focus rules.
- [FREE] The step UI of S4 (stepper, progress, back navigation) and how
  selection state is held client-side, within D8.
- [FREE] Component and file organisation of the shared fallback and the
  media preview, within TS-004 D2.
- [FREE] Copy for every label, link text and confirmation message —
  placeholders during the specification phase (WEB-F-087).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-016-A1 | static | No submission endpoint exists in the website: no POST/PUT route or server action under `app/api/` or elsewhere accepts form data; the BFF inventory equals TS-004 D5. |
| TS-016-A2 | integration | Every D1 lead surface (S1, S2) renders the envoy mount point with the D2 attributes for its form kind, language and source route; a submission against envoy staging is accepted by envoy. |
| TS-016-A3 | e2e | Network trace of a full submission: form values leave the browser only to the envoy host; no website request, log line or analytics call contains a field value. |
| TS-016-A4 | static | Every CSS variable published by the widget contract is mapped to a design token in the single mapping file, in all three themes; an unmapped published variable fails the build. |
| TS-016-A5 | e2e | The briefing CTA on `/dein-kalender`, `/deine-region` and every step of `/dein-kalender/bestellen` navigates to the configured Google Calendar URL; the pages load no Google script, iframe or font, and the CSP contains no Google host. |
| TS-016-A6 | e2e | The order flow runs the four D8 steps with the briefing exit visible on each; step 4 shows a copyable embed code without any payment step, and no payment-provider host appears in any request or in the CSP. |
| TS-016-A7 | static | No page contains an iframe, player script or social embed from a media host; every archive entry renders an own preview image served from our own origin plus one outbound link with descriptive text. |
| TS-016-A8 | tool | axe-core: zero violations on every page with the widget mounted, including inside its shadow root, in light, dark and high-contrast. |
| TS-016-A9 | manual | Keyboard-only and screen-reader run of one full lead form per release: labels announced, an invalid submission identifies the error in text, focus moves to the first error and to the success message. |
| TS-016-A10 | integration | Honeypot field present, hidden from assistive technology and not focusable; a submission faster than the timing threshold is rejected; no captcha library or captcha host exists in the bundle or the CSP. |
| TS-016-A11 | integration | Newsletter signup: no address is usable before the confirmation link is followed; signup sets no cookie and no persistent identifier; the website exposes no subscriber endpoint. |
| TS-016-A12 | e2e | Each of S2, S3, S4 fires exactly one eTracker event carrying its conversion goal ID and route, once per completed flow, with no field values in the payload. |
| TS-016-A13 | manual | The two-working-day promise copy on `/deine-region` is present only when the lead-handling process behind it is named and signed off (C11); absent otherwise. |
| TS-016-A14 | e2e | With the widget script blocked, every lead surface still renders the static fallback (contact link; plus the briefing link on S2 and S4) and no empty or permanently loading slot. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-090 (all lead forms are the envoy widget; no own form backend) | D1, D2, D5, D6 · A1, A2, A14 |
| WEB-F-091 (theming via website-supplied CSS variables) | D3, D4 (C1) · A4 |
| WEB-F-092 (envoy owns storage; website holds no submission data) | D5, D2 network path · A1, A3 |
| WEB-F-093 (briefing = Google Calendar link, no embed) | D7 · A5 |
| WEB-F-094 (purchase concludes on invoice, embed code immediately) | D8 · A6 |
| WEB-F-095 (external media as own previews + outbound links) | D9 · A7 |
| WEB-F-096 (newsletter: double opt-in, cookieless, GDPR) | D10 · A11 |

Cross-cutting requirements this spec serves without claiming: WEB-Q-035
(spam, D11 · A10), WEB-Q-030/031 (CSP entries, D2 · A5, A6), WEB-Q-028
(conversion measurement, D12 · A12), WEB-F-022 (response promise, D4 C11
· A13), WEB-Q-010–013 across the widget boundary (D11 · A8, A9 — the
website-side half of TS-002 A6).

## Open points

- **Q-022 (demand to envoy) blocks D3 content, D2's host and attribute
  names, D12's wiring, and A2/A4/A8/A9/A10/A12 as executable tests.** All
  eleven rows of D4 are the concrete form of this question. Nothing in
  this spec guesses at an answer; the integration is written to be
  completable once the contract exists.
- envoy-api's production host is UNKNOWN (SRC-011), so the CSP allowlist
  entry required by WEB-Q-030 cannot be written yet. Part of Q-022 (C8).
- The widget's delivery date is UNKNOWN (C10). D6 defines the shippable
  state without it; the decision on whether to launch with the fallback
  is not this spec's to make.
- **Q-017 (invoicing process — issuing, addressing, dunning)** leaves D8
  step 3's receiving system open. Payment method itself is decided
  (DEC-011); the receiving system is not, and the two candidates named in
  D8 differ in integration work, not in constraints.
- **Q-020 (newsletter sending system)** leaves D10's confirmation URL,
  field set and realisation [PROPOSED]. No signup ships before a system
  exists.
- SRC-003 leaves newsletter placement open (footer only versus inline on
  trust pages). D10 builds footer only until it closes.
- WEB-F-022's two-working-day promise is an operational commitment with
  no owner recorded (D4 C11). A13 withholds the copy rather than
  publishing a promise the process cannot keep.
- D1 in-page placement, D2 mechanics, D3, D6, D10 and D12 are
  [PROPOSED].

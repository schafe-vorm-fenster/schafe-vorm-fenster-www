---
artefact: tactical-spec
id: TS-WEB-0016
kind: interaction
status: DRAFT
implements: [FUN-WEB-0090, FUN-WEB-0091, FUN-WEB-0092, FUN-WEB-0093, FUN-WEB-0094, FUN-WEB-0095, FUN-WEB-0096]
sources: [SRC-0003, SRC-0008, SRC-0011]
decisions: [DEC-0004, DEC-0009, DEC-0010, DEC-0011, DEC-0013, DEC-0014, DEC-0015, DEC-0025, DEC-0026, DEC-0030, DEC-0051, DEC-0052, DEC-0081, DEC-0082, DEC-0083]
---

# TS-WEB-0016 — Forms, Leads and Outbound Handovers

## Purpose

Every place where the website takes something from a visitor or hands
them onward: lead forms (owned by the envoy widget), the contact section
and the briefing booking inside it, the on-invoice order flow, external
media (own previews plus outbound links), and newsletter signup.

**There is no general contact form** (DEC-0081). Contact is a standing
section of four static channel rows — video appointment, WhatsApp, phone,
e-mail (D13) — rendered by the layout on every page (TS-WEB-0006 D2), and the
briefing's outbound Google Calendar link is its first action row. The
widget carries the two forms that remain.

**Reaching out is now a conversion goal of its own** (2026-09-24):
`make-contact` counts the act, whatever the errand, and
`request-product-briefing` stays the qualified goal above it. What the
website can actually observe is an **intent** per channel — three of the
four rows hand the visitor to another application — and this spec names
it as intent wherever it appears (D12, D13). The newsletter likewise has
a goal now, `subscribe-to-newsletter`, and reaches people on **two**
channels: e-mail or WhatsApp, WhatsApp preferred (D10, DEC-0052 §4 as
amended).

**This spec is partly blocked and says so.** The envoy widget is not
finished and its contract is an open demand (Q-0022): the CSS variable
set, the emitted events, the spam handling, the accessibility
conformance and the delivery date are all UNKNOWN. Nothing here invents
them. What is determined is the website side — where forms appear, what
the website supplies, what it must never hold, and how the boundary is
verified — plus the demand itself (D4), written so that integration is a
day's work once the contract lands.

Conversion goal IDs referenced below are defined in
`@schafe-vorm-fenster/goals` (SRC-0008) and
are never redefined here. Routes are TS-WEB-0004 D1; the link facade is
TS-WEB-0001 D5.

## Determinations

### D1 — Lead and handover surface inventory [FIXED: SRC-0003, pages.req.md; in-page placement PROPOSED]

Every surface that takes input or hands the visitor onward. One row =
one surface. "Owner" says which system receives the interaction —
the website receives none of them.

| # | Surface | Route(s) | Kind | Owner | Conversion goal |
| --- | --- | --- | --- | --- | --- |
| S1 | Contact section | standing section on every page, between the closing CTA and the footer (TS-WEB-0006 D2) | four static channel rows — appointment link, WhatsApp, `tel:`, `mailto:`, in that order — no form (D13) | none; the website renders links | `make-contact` on **every** row, as an intent, per channel; the first row additionally completes `request-product-briefing` (D12) |
| S2 | Quote request, with the two-working-day promise (FUN-WEB-0022) | `/deine-region`, `/deine-region/angebot` | lead form | envoy widget | `request-licence-quote` |
| S3 | Briefing booking | the first action row of S1 — therefore every page | outbound link | Google Calendar appointment schedule | `request-product-briefing` |
| S4 | Order the calendar | `/dein-kalender/bestellen` | multi-step order, concludes on invoice | open (D8) | `buy-calendar-licence` |
| S5 | Newsletter signup | footer on every page (FUN-WEB-0021), plus inline on `/ueber-uns` at secondary treatment (DEC-0052 §4 as amended, TS-WEB-0027 D8) | **two routes** — WhatsApp (preferred) and e-mail with double opt-in (D10) | envoy for the e-mail route (DEC-0051); **nothing for the WhatsApp route** (D10) | `subscribe-to-newsletter` |
| S6 | External media preview | `/ueber-uns/archiv`, inline proof anywhere | own preview + outbound link | none (static link) | none |
| S7 | Registration handover | `/mitmachen/registrieren` | handover to the app | app (DEC-0029) | `register-as-publisher` → `publish-first-event` |

S7 is listed for completeness of the "hands them onward" set and is
specified elsewhere (DEC-0029); it is not a form and is not claimed by
this spec's `implements`.

S1 and S3 are one surface seen twice: the section is where a visitor
reaches a person, and the booking is its first row. They are kept as two
rows because they answer to different things — the section to the design
system's component rules (SRC-0014), the booking to DEC-0010's mechanism —
and because only one of them fires an event.

Rules that hold for every row: the website ships **no form backend and
no form route** — nothing under `app/api/` accepts a submission
(FUN-WEB-0090, DEC-0025); the BFF inventory (TS-WEB-0004 D5) stays read-only and
gains no POST route from this spec. envoy and Portalize talk to their
own backends directly and are **not** proxied through the BFF.

### D2 — Embedding model for the envoy widget [FIXED: DEC-0009, DEC-0015, DEC-0025; mechanics PROPOSED]

| Aspect | Determination | Tag |
| --- | --- | --- |
| Form of integration | A custom element (web component) placed by the page; the website renders the mount point and nothing else | FIXED: DEC-0009 |
| Loading | Widget script loaded deferred, never render-blocking, excluded from the LCP path (TS-WEB-0003 D2/D5) | FIXED: TS-WEB-0003 |
| Placement | One instance per surface in D1; never more than one instance of the same form kind per page | PROPOSED |
| Configuration | Passed as attributes on the element: form kind, page language (TS-WEB-0001), source route, and the offering/goal context of the surface — attribute *names* are part of Q-0022 | PROPOSED |
| Network path | Direct browser → envoy host. Not proxied; CSP `connect-src`/`script-src` entry for that host (NFR-WEB-0030/031) | FIXED: DEC-0025, DEC-0015 |
| Host value | UNKNOWN — SRC-0011 records envoy-api's host as not yet published. The CSP entry cannot be written until it is (Q-0022) | UNKNOWN |
| Server rendering | The page renders and is fully usable without the widget having loaded; no page is blocked on it (TS-WEB-0005/FUN-WEB-0106 skeleton rules apply to the slot) | FIXED: DEC-0019 |
| Isolation | The widget may use a shadow root; the page must not reach into it, and no page CSS may target its internals — theming happens only through D3 | PROPOSED |

### D3 — Theming handoff: CSS variables on a wrapper [PROPOSED — content blocked by Q-0022]

The website styles the widget by declaring CSS custom properties on the
element that wraps the mount point (FUN-WEB-0091). The website side is
determined now; the variable *names* are not.

1. Values come from the brand token set — the same tokens the rest of
   the site uses (TS-WEB-0002 D4), never literals repeated for the widget.
2. Because tokens are defined for light, dark and high-contrast, the
   widget inherits all three themes automatically; no widget-specific
   theme switching exists, and no theme toggle exists at all (TS-WEB-0002 D4).
3. Contrast rules bind the mapped values as they bind everything else
   (TS-WEB-0002 D3) — in particular the brand green is never mapped to a
   variable that ends up as text colour on light ground.
4. Font-size values are rem-based (TS-WEB-0002 D4); the widget must not fix
   px sizes.
5. **The mapping table is empty on purpose.** Once Q-0022 publishes the
   variable set, exactly one file holds `widgetVariable → design token`
   and a build check fails on any published variable left unmapped
   (A4). No variable is guessed in advance.

### D4 — The demand to envoy (Q-0022), as the website needs it [FIXED as demand: DEC-0009, DEC-0014, TS-WEB-0002, FUN-WEB-0022; answers UNKNOWN]

This is the concrete form of the open demand. Every row is unanswered
today; each is what the website needs in order to integrate, and the
"Website depends on it for" column says what stalls without it.

| # | Demanded | Website depends on it for | State |
| --- | --- | --- | --- |
| C1 | The complete CSS variable set, with defaults and semantics | D3 mapping file, A4 | UNKNOWN |
| C2 | Element name, attribute names and allowed values (form kind, language, source, context). The demanded form kinds are **quote** and **order** — the contact kind left the demand with DEC-0081 | D2 configuration row | UNKNOWN |
| C3 | Emitted DOM events for `submit`, `success`, `error`, `validation-error`, with a payload that carries **no field values** | D12 conversion measurement, D6 error handling, D5 boundary | UNKNOWN |
| C4 | Spam handling: honeypot field, submission-timing check, server-side rate limiting, **no captcha of any kind** | NFR-WEB-0035, DEC-0014 — binding on the widget, not negotiable | DEMANDED, unconfirmed |
| C5 | Accessibility conformance: WCAG 2.2 AA inside the host page — label association, error identification, focus management, visible focus, target sizes | TS-WEB-0002 D5/A6, this spec A8/A9 | UNKNOWN |
| C6 | Testability of the above: the widget's DOM reachable for axe-core and for keyboard/screen-reader runs even behind a shadow root | A8 | UNKNOWN |
| C7 | Cookie-freedom and no persistent identifiers in the browser | NFR-WEB-0020/023 — the banner-free promise must stay true | DEMANDED, unconfirmed |
| C8 | Production host(s) for script and submissions | D2 CSP entry, A1 | UNKNOWN |
| C9 | Localization: German and English form copy and error messages, selected by the page language | TS-WEB-0001, DEC-0026 | UNKNOWN |
| C10 | Delivery date | D6 contingency, launch scope | UNKNOWN |
| C11 | Lead handling behind the widget fast enough to keep the two-working-day response promise on S2 — an operational commitment, not a technical one (FUN-WEB-0022) | The promise copy may not ship without it (A13) | DEMANDED, unconfirmed |

C4, C7 and C11 are not questions to envoy — they are constraints the
website has already fixed and the widget must satisfy. C1–C3, C5, C6,
C8–C10 are genuinely open.

### D5 — Data boundary: the website holds nothing [FIXED: DEC-0009, FUN-WEB-0092]

| Rule | Consequence |
| --- | --- |
| Submissions never traverse the website | No POST route, no server action, no edge function touches form data |
| No field value is logged | Vercel logs, error reports and monitoring (DEC-0017) must not contain form input; error payloads from C3 carry codes, not content |
| No submission data at rest | The website has no store for leads, no email relay, no queue |
| No field value reaches analytics | Conversion measurement records the goal ID and the route only (D12, NFR-WEB-0028) |
| Data protection texts follow the fact | The processing description for lead data belongs to envoy-api and is referenced from `/rechtliches#datenschutz` (TS-WEB-0004 D8), not authored as if the website were the processor |
| Prefill is one-way | A prefilled place or offering context is passed *into* the widget as configuration (D2); nothing comes back out that the website stores |

### D6 — Degradation, failure and the not-yet-delivered case [FIXED: DEC-0069]

The widget is unfinished and its delivery date is UNKNOWN (C10). The
website must be buildable and shippable regardless.

| Case | Behaviour |
| --- | --- |
| Widget script fails to load or errors | The surface renders a visible, static fallback: the contact route of last resort (an email address rendered as a link) plus the booking row of the contact section, which stands on the same page either way. Never an empty slot, never a spinner that never resolves |
| Widget reports a submission error (C3) | The widget owns the message; the page adds nothing and does not retry on the visitor's behalf |
| Widget not delivered by launch | The two remaining lead surfaces ship with the same static fallback. `/deine-region`'s quote request degrades to the contact section plus email; the two-working-day promise copy is withheld under A13 either way. General contact is unaffected — it is a static section, not a widget (DEC-0081 §7) |
| JavaScript disabled | Same static fallback — the fallback is server-rendered markup, not script-generated |

The fallback is one component reused by both remaining surfaces, so
removing it later is one deletion. What it no longer has to stand in for
is general contact: that surface can no longer fail, because it loads
nothing.

**What the "contact route of last resort" is** [FIXED: DEC-0069]: the
form that already runs today at `https://www.schafe-vorm-fenster.de/start`
— a Google Form. Three rules govern how it is used, and they follow from
decisions already taken:

| Rule | Why |
| --- | --- |
| **Linked, never embedded.** The fallback renders an outbound link, not an iframe. Today's `/start` embeds the form; the relaunch must not | DEC-0013 / TS-WEB-0013: no third-party embed on any page. An embedded Google Form would load Google into the page for every visitor who merely *sees* the surface |
| **The link points at our own path `/start`**, which redirects to the form — never at the `docs.google.com` URL | The target changes when envoy lands. One redirect we control means the swap touches one route, not every lead surface. `/start` joins the TS-WEB-0004 D1 route inventory as a redirect-only path |
| **The visitor is told where the link goes** before following it: it names Google as the recipient and carries the outbound marking of TS-WEB-0016 D9 | The form submits to a third country. A visitor must be able to decline it — which is only possible if the fallback also still shows the email address beside it |

The Google Form is the fallback's *target*, not its shape: the fallback
component stays one component, and the swap to envoy is a change of the
redirect behind `/start`.

### D7 — Briefing booking is the contact section's first row [FIXED: DEC-0010, DEC-0013, DEC-0081]

| Aspect | Determination |
| --- | --- |
| Mechanism | A plain link to a Google Calendar appointment schedule URL. No embed, no iframe, no Google script, no click-to-load layer |
| Where it lives | **the first action row of the contact section (S1)**, whose four rows and their order are D13 — one placement for the whole site. A booking CTA in any block on any page targets that section on its own page, in-page; it does not navigate off-site and it is not a second occurrence of the URL |
| Why it stays off the CSP | An outbound navigation loads nothing into the page, so the allowlist is untouched (DEC-0015). Anything that would need a CSP entry is by definition not this |
| URL source | One configured value (environment/config), referenced by every S3 placement — never pasted per page |
| Link attributes | Opens in the same tab by default; if a new tab is used it carries `rel="noopener"` and the link text says so (TS-WEB-0002 D2, 2.4.9 link purpose) |
| Link text | Names the action and its destination, not "hier klicken"; the label is content (FUN-WEB-0087 placeholder rules apply) |
| Localization | The link *text* is localized; the appointment page itself is an original artifact under Google's terms and is not localized by us (DEC-0026) |
| Reachability | the pages SRC-0003 names — `/dein-kalender` (equal-weight with the order CTA, FUN-WEB-0014), `/deine-region`, every step of S4, and `/ueber-uns` as its primary (DEC-0081 §6) — each carry a CTA pointing at their own contact section. Every other page reaches the booking through the standing section itself |
| Measurement | The click **on the section's row** completes `request-product-briefing` (D12). An in-page booking CTA emits nothing: it is navigation inside a document, and counting it would count one intent twice. The booking itself happens off-site and is not observable to the website |

### D8 — The order flow concludes on invoice [FIXED: DEC-0011, SRC-0003; submission target OPEN]

Four steps on `/dein-kalender/bestellen` (FUN-WEB-0015):

| Step | Content | Notes |
| --- | --- | --- |
| 1 | Scope: places, postcode, or county | Uses the read-only place BFF routes (TS-WEB-0004 D5); selection lives in client state only |
| 2 | Live preview that updates with the selection | Portalize loader per DEC-0030; talks to its own backend, not proxied |
| 3 | Invoice details, addressed to the Verwaltung | The one input step. Receiving system open — see below |
| 4 | Embed code, delivered immediately | Shown on screen and copyable; delivery is not conditional on payment |

Binding properties:

- **No payment provider.** No payment SDK, no card form, no redirect to
  a PSP, no such host in the CSP (DEC-0011, A6).
- The embed code is handed over **in step 4, immediately** — the invoice
  follows out of band (DEC-0011). No "pending payment" state exists.
- The briefing exit (S3) is visible on every step (SRC-0003).
- Step state is client-side and non-persistent; the website stores no
  order (D5). A reload may restart the flow — acceptable, and preferable
  to holding buyer data.
- Price display follows FUN-WEB-0020 (480 €/year public; net/VAT wording is
  content, not spec).
- **Open, deliberately unresolved here:** which system receives step 3
  and issues the embed code. Two candidates — an order variant of the
  envoy widget (D2 applies unchanged), or a Portalize order endpoint
  (its own backend, DEC-0030 pattern). This depends on Q-0017 (invoicing
  process: issuing, addressing, dunning) and Q-0022 (whether envoy covers
  an order form kind at all). Until one of them answers, step 3 is
  specified only by its constraints: it is not a website endpoint
  (D5), it is not a payment step, and whatever receives it must be able
  to produce the embed code synchronously.

### D9 — External media are own previews plus outbound links [FIXED: DEC-0013]

Applies to every media reference — podcast, TV, radio, press, social —
on `/ueber-uns/archiv` and to inline proof anywhere.

| Rule | Detail |
| --- | --- |
| No third-party embed | No iframe, no player script, no social embed, no click-to-load consent layer. There is nothing to consent to, which is the point (DEC-0013) |
| Preview composition | Own preview image plus an own short quote/summary, both sourced from the media-echo entry (FUN-WEB-0086, build-time fetch) |
| Image origin | Preview images are served from our own origin or assets-api — never hotlinked from the media host, which would leak the visitor's request |
| Outbound link | One link per entry to the original, link text naming source and subject (2.4.9, TS-WEB-0002 D2); `rel="noopener"` when opened in a new tab |
| Original artifacts stay original | A quoted headline or clipping remains in its source language even on EN pages (DEC-0026); surrounding context is localized |
| Static | The archive is fully static from the build-time fetch (TS-WEB-0004 D6); no client request ever goes to a media host |

### D10 — Newsletter signup: two channels, WhatsApp preferred [FIXED: DEC-0052 §4 as amended, DEC-0051, FUN-WEB-0096; the WhatsApp route is a new capability and is owed]

The newsletter is a conversion goal now — `subscribe-to-newsletter`
(SRC-0008) — and it reaches people **by e-mail or by WhatsApp, WhatsApp
preferred.** The goal counts a *confirmed* subscription, per channel.

#### The two routes

| | WhatsApp — **preferred** | E-mail |
| --- | --- | --- |
| How the visitor subscribes | a click-to-chat link opens her WhatsApp client with a prefilled subscribe message she sends | a form takes her address |
| Confirmation | the opt-in message arrives on the company's number | double opt-in: the address is unusable until the confirmation link is followed |
| Who receives it | **nobody yet** — no system covers this route | envoy (DEC-0051) |
| Website's part | render a link. No form, no field, no submission | render the envoy mount point (D2–D3) |

**Preferred means offered first, not offered alone.** A signup surface
that offers e-mail only does not satisfy the goal (DEC-0052 §4 as
amended). Both routes are always present; which one leads is a design
question inside that rule, not a licence to drop one.

The preference and its reasons belong to the hub record, not to this
spec. What binds here is the consequence: two routes, WhatsApp first.

#### Website-side contract

| Property | Determination | Tag |
| --- | --- | --- |
| Consent model | E-mail route: double opt-in, the address unusable until the confirmation link is followed. WhatsApp route: the visitor's own sent message **is** the opt-in — she composes and sends it from her own client, so there is no second confirmation step to build and none to fake | FIXED: FUN-WEB-0096 |
| Cookieless | Neither route sets a cookie or a persistent identifier; the banner-free promise holds here too | FIXED: NFR-WEB-0020/023 |
| Backend | Not the website, on either route. No subscriber endpoint, no list, no address and no phone number ever at rest here (same boundary as D5) | FIXED: DEC-0009 pattern |
| Confirmation URL | E-mail route only; owned by the sending system, not a website route — the website has no DOI endpoint to build | PROPOSED |
| Fields | E-mail route: address only. WhatsApp route: **no field at all** — a link, not a form. Anything more on either route is a decision nobody has taken | PROPOSED |
| Placement | Footer on every page (FUN-WEB-0021), plus inline on `/ueber-uns` at secondary treatment below the booking (DEC-0052 §4 as amended, TS-WEB-0027 D8). SRC-0003's open point on inline placement is closed by that amendment | FIXED: FUN-WEB-0021, DEC-0052 §4 |
| Weight | Secondary wherever it stands. It is never a page's primary conversion and never carries `data-cta="primary"` (DEC-0082) | FIXED: DEC-0082 |
| Legal text | Consent wording and the processing reference point at `/rechtliches#datenschutz` (TS-WEB-0004 D8), on both routes — the WhatsApp route hands data to a third party too, and the fact that the visitor sends the message herself does not remove the duty to say who receives it | FIXED: DEC-0039 |
| Measurement | The website observes a **signup intent**, not a subscription: the e-mail route's widget `success` event and the WhatsApp route's click are both handovers, and the confirmation happens where the website cannot see it. The goal's number is the confirmation, counted by the sending system and by hand on WhatsApp (D12) | PROPOSED |
| Until a sending system exists | Neither entry is built — not in the footer, not inline. No placeholder form that discards addresses, and no click-to-chat link whose arriving message nobody records | FIXED: DEC-0052 §4 as amended |

#### What the WhatsApp route needs, and does not have

**This is a new capability.** Nothing on either side of the boundary
covers it today, and the parts are not all the website's to build:

| # | Needed | Whose | State |
| --- | --- | --- | --- |
| N1 | A click-to-chat link, `https://wa.me/<number>?text=<urlencoded>`, to the company's WhatsApp number — the same number as the contact section's row 2, resolving from the hub record, never typed (D13) | website | buildable today |
| N2 | The **prefilled subscribe message**: an intent line complete on its own, and the origin as a closing postscript (D14 governs its shape; the sentences are copy) | content, under SRC-0017 | owed — no rule id exists yet (D14) |
| N3 | A place where the arriving opt-in is **recorded as a subscription** and added to the broadcast list | envoy or ops | **does not exist.** The customer newsletter is a manual broadcast to a hand-maintained contact list |
| N4 | An unsubscribe that is as easy as the subscribe, and a record of it | envoy or ops | **does not exist.** A broadcast list with no way out is a contact list, not a subscription |
| N5 | The confirmed-subscription count per channel, so the goal can be read | envoy or ops | **does not exist** |

N1 is a day's work and is blocked by nothing except N3: shipping a link
whose arriving messages nobody records would collect opt-ins into an
inbox and lose them. **N3, N4 and N5 are demanded and unowned** — they
are not part of the Q-0022 envoy contract as it stands, which covers
signup and double opt-in for the e-mail route only (DEC-0051). The demand
is **Q-0073**, addressed to envoy/ops. This spec records it; it does not
assign it.

#### The e-mail route's realisation

envoy covers newsletter subscription (DEC-0051), so the e-mail route is
another widget instance under D2–D3 and nothing else changes. It
inherits C4, C5, C7 and C9 unchanged, and it inherits C10: the widget is
undelivered and its date is UNKNOWN.

### D11 — Spam protection and accessibility across the boundary [FIXED: DEC-0014, TS-WEB-0002 D5]

The forms belong to the widget; the acceptance belongs to the website.
That is not a contradiction — the website tests the rendered page, and a
widget that fails inside the page fails the website's release.

| Concern | Where it is implemented | How the website verifies it |
| --- | --- | --- |
| Honeypot field | Widget (C4) | Present in the rendered DOM, hidden from assistive technology, never focusable (A10) |
| Submission timing check | Widget (C4) | Behavioural check against envoy staging (A10) |
| Rate limiting | envoy-api (C4); the website's own read endpoints keep theirs (TS-WEB-0004 D5/A7) | Out of the website's reach; asserted in the contract, not in a website test |
| Captcha | Nowhere. No captcha library, no captcha host, in the page or in the CSP | Static check (A10) |
| Label association, error identification, focus management | Widget (C5) | axe-core on the page with the widget mounted, in all three themes (A8); manual keyboard + screen-reader run of one full form per release (A9) |
| Shadow DOM | Widget (C6) | If automated checks cannot see into it, C6 is unmet and the widget is not release-ready — the untestable case is a failure, not an exemption |

Gate: no envoy release is integrated into production before A8 and A9
pass against it. TS-WEB-0002 A6 is the same gate seen from the accessibility
side.

### D12 — Conversion measurement of these flows [PROPOSED; frame FIXED: NFR-WEB-0028]

| Surface | Event fires on | Goal ID | Counts |
| --- | --- | --- | --- |
| S1 contact rows, **each of the four** | click on the row, carrying **the channel** and the route the section was rendered on | `make-contact` | an **intent** |
| S3 briefing link = S1 row 1 | the same click, additionally | `request-product-briefing` | an **intent** |
| S2 quote request | widget `success` event (C3) | `request-licence-quote` | a submission |
| S4 order | reaching step 4 (embed code shown) | `buy-calendar-licence` | a completed order |
| S5 newsletter, either route | e-mail route: widget `success` (C3). WhatsApp route: click on the click-to-chat link | `subscribe-to-newsletter` | an **intent** — the confirmation is not observable (D10) |
| S6 media links | no conversion event | — | — |
| in-page booking CTAs, and any in-page link that scrolls to the contact section | no event — the section's rows are the single firing point | — | — |

#### Intent is named as intent

**Three of the four contact rows leave the site with the visitor**, and
so does the WhatsApp newsletter route: a `tel:`, a `mailto:` and a
click-to-chat hand over to another application, and the website sees the
handover and nothing after it. The fourth row navigates to Google.

So the event is an **intent event**, and it is named as one — in the
event name, in any report built on it, and in this spec. Calling the
number "contacts" or "subscriptions" would claim knowledge of
conversations and confirmations that were never observed. Where the
number is reported, it is reported as *intents per channel*.

The per-channel dimension is part of the event, not an afterthought:
`make-contact`'s number is meaningless without it, because a phone
intent and a mail intent are worth different things and neither is
worth what a booking is worth.

#### Row 1 carries two goals, and that is not double counting

The appointment row fires `make-contact` **and**
`request-product-briefing` on one click. Two goals on one action is a
ladder — one counts the act of reaching out, the other counts the
qualified errand — not one goal counted twice. The rule that must hold
is narrower and is checked:

- **one event per goal id per click.** No goal fires twice for the same
  interaction.
- **no in-page CTA fires anything.** A booking CTA in an argument block,
  and any link that scrolls to the section, emit nothing. Counting them
  would count one intent twice, which is the double counting this rule
  is actually about (DEC-0081 §4).
- **rows 2–4 never fire `request-product-briefing`.** That goal's errand
  test cannot be applied to a click, and a WhatsApp message about a
  quote is not a briefing request. Whether a contact was a briefing
  request is decided where the message arrives, not on the website.

#### The rest

Because the section stands on every page, the **route** is what
distinguishes one intent from another; no page adds an event of its
own, and DEC-0071 §3 still forbids any geographic value in the payload.

Rules: one eTracker event per conversion goal ID, fired at most once per
completed flow or per click (NFR-WEB-0028); the payload carries the goal
ID, the channel where there is one, and the route — never a field value
(D5), and never a per-visitor identifier (D14). S2, S4 and S5's e-mail
route depend on C3 — until the event contract exists, the measurement
cannot be wired, and guessing an event name would produce silent
zero-counts. The S1 rows depend on nothing: they are ordinary clicks on
static markup and can be wired today. Goal IDs are consumed from SRC-0008
and never invented here.

### D13 — The contact section's four channel rows [FIXED: DEC-0081, SRC-0014, SRC-0008; values are content]

S1 is four rows and nothing else. This determination fixes **which
channels, in which order, and what each one does** — not what any of them
says and not what any of them is set to.

| # | Row | What it does | Scheme | Event |
| --- | --- | --- | --- | --- |
| 1 | Video appointment | Hands the visitor to the configured appointment schedule to book a briefing. The outbound row, and the only one (D7) | `https:` to the configured appointment URL | `make-contact` **and** `request-product-briefing`, both with channel and route (D12) |
| 2 | WhatsApp | Opens a chat with the company's number in the visitor's WhatsApp client, with a prefilled message (D14) | `https:` to the WhatsApp click-to-chat host | `make-contact`, channel `whatsapp` |
| 3 | Phone | Places a call to the company's number | `tel:` | `make-contact`, channel `phone` |
| 4 | E-mail | Opens the visitor's mail client addressed to the company's address, with a prefilled subject and body (D14) | `mailto:` | `make-contact`, channel `mail` |

**The order is fixed** and is SRC-0014 §"Contact section" — it is what the
filled/outlined treatment is built on: row 1 takes the filled treatment,
rows 2–4 are outlined, and rows 3 and 4 carry the hairline variant. The
order does not change per page, per audience or per locale; the section
is one component rendered once from the layout (DEC-0081 §2), so there is
one order for the whole site.

**Rows 2 and 3 are one number and two rows.** The same line takes a
message and a call. They stay separate rows because they are two
affordances with two schemes and two situations — a visitor who will
write is not a visitor who will ring. A build that renders three rows
because the two addresses matched has a defect, not an optimisation.

**Four rows, four intents — and one of them is also a briefing.** Every
row's *click* is observable, including `tel:` and `mailto:`, and each
fires `make-contact` with its channel. What is **not** observable is
whether the contact happened: the call may not be placed, the mail may
not be sent. That is why D12 counts and names an intent rather than a
contact, and why the conversation itself is still counted by hand where
it arrives, which is the hub goal's own instrumentation.

Row 1 additionally completes `request-product-briefing`, because its
destination is the booking. Rows 2–4 never do — see D12.

This supersedes the earlier reading that the section "fires exactly one
event for four rows". That was true while `request-product-briefing` was
the only goal the section could serve; it stopped being true when
reaching out became a goal of its own.

#### Where the values come from

| Value | Source |
| --- | --- |
| The appointment URL | one configured value (environment/config), per D7 |
| The phone number, the WhatsApp number, the e-mail address | the hub record `contact-channels.md` in `@schafe-vorm-fenster/goals` (SRC-0008), reaching the site through the content pipeline at build time; the same values also arrive with the legal import that produces `content/legal/**` |
| Who answers | the same hub record — one person for all four channels |

**No determination and no criterion here states any of those values**
(DEC-0083 §1): a number and an address are content, and content is not a
spec's to carry. What this spec fixes is that the row exists, which
scheme it uses, and that its value resolves from the hub record rather
than being typed per page. A row whose value is missing is a build
failure, not an empty row.

#### No response expectation

**The section states no response time, on any row.** The hub record
carries none, and no cleared source states one — the only response
promise anywhere in the model is the two-working-day promise on the quote
request (S2), a different goal on a different surface, and itself
demanded and unconfirmed (D4 C11, A13). A sub-label that implies a speed
of answer is out of budget for the same reason A13 withholds the S2
promise: no process is held to it. SRC-0017 CG-031 carries the wording
rule.

### D14 — The prefilled message: context, never identity [FIXED: owner decision 2026-09-24, DEC-0004, DEC-0083; the sentences are copy]

The CRM sees every inbound WhatsApp message and e-mail. This
determination is how a website-side intent is joined to the message that
arrives — and, more importantly, how it is **not**.

#### 1. Context, never identity

The marker names **the page and the channel the contact came from.**
Nothing else.

| Allowed | Forbidden |
| --- | --- |
| the origin page | a per-click random token |
| the channel | a pseudonymous or hashed visitor identifier |
| | anything that distinguishes one visitor from another |

A per-click token would make the message personal data: it would link an
anonymous read to an identified person, which puts it in the privacy
policy and, on one reading, behind consent — and the cookieless,
consent-free posture (DEC-0004, NFR-WEB-0020/023) is not worth trading for
an attribution number.

Attribution is therefore **aggregate**: "this came from `/dein-kalender`
via WhatsApp", never "this is the person who viewed X".

#### 2. It is a real message, not a tracking string

The prefilled text is written **from the visitor's perspective** and
must be a message a person sends without discomfort. A bare reference
code reads as surveillance and gets deleted before sending, which
destroys both the attribution and the contact.

The shape, and this spec fixes the shape and not the words (DEC-0083):

| Part | What it must do |
| --- | --- |
| greeting | open the message as a person would |
| **the intent line** | say what she wants, **complete on its own** |
| sign-off | close it as a person would |
| **postscript** | name where she came from — this is the entire attribution mechanism |

**The intent line must be complete as it stands.** A prefill that leaves
the visitor to fill in a gap in the middle is worse than an empty field:
an empty field she writes; a half-sentence she has to repair before she
can send, in an app where she is now doing our editing work.

#### 3. Per page, per errand

Each page prefills an intent that fits **its own** errand, so the
visitor can send the message as it stands or edit it. The contact
section is one component on every page, so the intent resolves from the
route the section was rendered on — the same value D12 puts in the
event, and the same mechanism, one place to change.

#### 4. Mechanics

| Row | How the text is carried |
| --- | --- |
| WhatsApp (D13 row 2, and S5's WhatsApp route) | `https://wa.me/<number>?text=<urlencoded>` |
| E-mail (D13 row 4) | `mailto:` with a prefilled `subject` and `body` |
| Phone (D13 row 3) | **not correlatable at all.** A call carries no text, and call-tracking numbers are out of proportion to what the answer is worth. The phone row is an intent and stays one |
| Appointment (D13 row 1) | no prefill; the destination is a booking page, not a message |

**Best-effort by construction, and the spec says so.** The visitor can
edit or delete the text before sending, and should be able to. The
postscript is a signal, not a key, and a message that arrives without it
is a normal contact, not a defect.

#### 5. What this does not give us

**No exact per-click conversion rate.** The website-side number stays an
intent per channel and per route (D12); the CRM side is where a contact
is actually observed; the two are joined **by page and channel, never by
visitor**. "Seven intents from `/dein-kalender` via WhatsApp, four
conversations that month naming that origin" is the shape of the answer.
Dividing those two numbers into a rate would claim a match that was
never made.

#### 6. The sentences are owed

The greeting, the intent lines, the sign-off and the postscript are
**copy**, and live in the content artifacts under SRC-0017 (DEC-0083 §1/§3).
This spec states what the message must contain and that the origin rides
in a postscript; it states no sentence.

**What is owed:** a copy-guide rule governing the prefilled message —
its register, the postscript's form, and the per-page intent lines for
every route the contact section stands on. No such rule id exists in
SRC-0017 today. Addressee: the owner of the copy guide (DEC-0080). This
spec does not edit the guide; the WhatsApp and mail rows carry no
prefill until the rule and the sentences exist, and a row without a
prefill is a working row, not a broken one.

## Free for the generator

- [FREE] Visual design of the widget wrapper, the static fallback
  (D6) and the media preview card (D9), within TS-WEB-0002 contrast, target
  size and focus rules.
- [FREE] The step UI of S4 (stepper, progress, back navigation) and how
  selection state is held client-side, within D8.
- [FREE] Component and file organisation of the shared fallback and the
  media preview, within TS-WEB-0004 D2.
- [FREE] Copy for every label, link text and confirmation message —
  placeholders during the specification phase (FUN-WEB-0087).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0016-A1 | static | No submission endpoint exists in the website: no POST/PUT route or server action under `app/api/` or elsewhere accepts form data; the BFF inventory equals TS-WEB-0004 D5. |
| TS-WEB-0016-A2 | integration | Every D1 lead surface that is a form (S2, and S4 step 3 once its receiver is decided) renders the envoy mount point with the D2 attributes for its form kind, language and source route; a submission against envoy staging is accepted by envoy. No envoy mount point exists on any other route, and no page renders a general contact form. |
| TS-WEB-0016-A3 | e2e | Network trace of a full submission: form values leave the browser only to the envoy host; no website request, log line or analytics call contains a field value. |
| TS-WEB-0016-A4 | static | Every CSS variable published by the widget contract is mapped to a design token in the single mapping file, in all three themes; an unmapped published variable fails the build. |
| TS-WEB-0016-A5 | e2e | The briefing CTA on `/dein-kalender`, `/deine-region`, `/ueber-uns` and every step of `/dein-kalender/bestellen` resolves to the contact section of the same page, not to an external host. The section's first action row navigates to the configured Google Calendar URL, and it is the only element on the page carrying that href. The pages load no Google script, iframe or font, and the CSP contains no Google host. |
| TS-WEB-0016-A6 | e2e | The order flow runs the four D8 steps with the briefing exit visible on each; step 4 shows a copyable embed code without any payment step, and no payment-provider host appears in any request or in the CSP. |
| TS-WEB-0016-A7 | static | No page contains an iframe, player script or social embed from a media host; every archive entry renders an own preview image served from our own origin plus one outbound link with descriptive text. |
| TS-WEB-0016-A8 | tool | axe-core: zero violations on every page with the widget mounted, including inside its shadow root, in light, dark and high-contrast. |
| TS-WEB-0016-A9 | manual | Keyboard-only and screen-reader run of one full lead form per release: labels announced, an invalid submission identifies the error in text, focus moves to the first error and to the success message. |
| TS-WEB-0016-A10 | integration | Honeypot field present, hidden from assistive technology and not focusable; a submission faster than the timing threshold is rejected; no captcha library or captcha host exists in the bundle or the CSP. |
| TS-WEB-0016-A11 | integration | Newsletter signup: on the e-mail route no address is usable before the confirmation link is followed; neither route sets a cookie or a persistent identifier; the website exposes no subscriber endpoint. Where the signup renders at all, it offers **both** routes — a page that offers e-mail only fails (D10). |
| TS-WEB-0016-A12 | e2e | Each of S2, S4 and S5 fires exactly one eTracker event carrying its conversion goal ID and route, once per completed flow, with no field values in the payload. |
| TS-WEB-0016-A17 | e2e | Each of the four contact rows fires exactly one `make-contact` event on click, carrying its channel and the route the section was rendered on. Row 1 fires `request-product-briefing` in addition, on the same click; rows 2–4 never fire it. No goal id fires twice for one click. Clicking an in-page booking CTA, or any in-page link that scrolls to the section, fires nothing. |
| TS-WEB-0016-A18 | static | Every conversion event name and every reporting label for the S1 rows and the S5 WhatsApp route identifies the number as an **intent**, not as a contact or a subscription (D12). |
| TS-WEB-0016-A19 | static | No prefilled message on any contact row or newsletter link contains a per-click token, a random value, a hash or any per-visitor identifier; the only varying parts are the page of origin and the channel (D14). The same check applies to the `text`, `subject` and `body` parameters of the rendered URLs. |
| TS-WEB-0016-A20 | e2e | Where a prefilled message is rendered: the WhatsApp row's URL is `https://wa.me/<number>?text=<urlencoded>` and the mail row's `mailto:` carries a subject and a body; the decoded text ends with a postscript naming the page of origin, and contains no empty placeholder or unresolved token for the visitor to fill in (D14). The phone row carries no text parameter. |
| TS-WEB-0016-A21 | static | Neither the footer newsletter entry nor the inline block on `/ueber-uns` renders while no sending system accepts a subscription: no form that posts nowhere, and no click-to-chat link whose arriving message nothing records (D10, DEC-0052 §4 as amended). |
| TS-WEB-0016-A13 | manual | The two-working-day promise copy on `/deine-region` is present only when the lead-handling process behind it is named and signed off (C11); absent otherwise. |
| TS-WEB-0016-A14 | e2e | With the widget script blocked, S2 and S4 still render the static fallback (contact link plus the booking row of the page's contact section) and no empty or permanently loading slot. The contact section itself renders unchanged, since it loads nothing. |
| TS-WEB-0016-A15 | e2e | The contact section renders exactly four action rows, in the D13 order: row 1's href is the configured appointment URL, row 2's is a WhatsApp click-to-chat URL, row 3's scheme is `tel:` and row 4's is `mailto:`. No row is omitted or merged, including when rows 2 and 3 resolve to the same number. Only row 1 emits an event. |
| TS-WEB-0016-A16 | static | Every value rendered in a contact row resolves from the hub record or the configured appointment URL — no phone number, WhatsApp number or contact e-mail address is hard-coded in a page, a component or a spec file. A row whose value does not resolve fails the build rather than rendering empty. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0090 (the remaining lead forms are the envoy widget; no own form backend; no general contact form) | D1, D2, D5, D6 · A1, A2, A14 |
| FUN-WEB-0091 (theming via website-supplied CSS variables) | D3, D4 (C1) · A4 |
| FUN-WEB-0092 (envoy owns storage; website holds no submission data) | D5, D2 network path · A1, A3 |
| FUN-WEB-0093 (booking resolves to the contact section; its first row is the Google Calendar link, no embed; `make-contact` as an intent on every row) | D7, D12, D13, D14 · A5, A12, A15, A16, A17, A18, A19, A20 |
| FUN-WEB-0094 (purchase concludes on invoice, embed code immediately) | D8 · A6 |
| FUN-WEB-0095 (external media as own previews + outbound links) | D9 · A7 |
| FUN-WEB-0096 (newsletter: two channels, WhatsApp preferred; double opt-in on the e-mail route, cookieless, GDPR) | D10, D12 · A11, A12, A21 |

Cross-cutting requirements this spec serves without claiming: NFR-WEB-0035
(spam, D11 · A10), NFR-WEB-0030/031 (CSP entries, D2 · A5, A6), NFR-WEB-0028
(conversion measurement, D12 · A12, A17, A18), NFR-WEB-0020/023
(cookie-freedom across the prefilled message, D14 · A19), FUN-WEB-0022
(response promise, D4 C11 · A13), NFR-WEB-0010–013 across the widget
boundary (D11 · A8, A9 — the website-side half of TS-WEB-0002 A6).

## Open points

- **Q-0022 (demand to envoy) blocks D3 content, D2's host and attribute
  names, D12's wiring for S2/S4, and A2/A4/A8/A9/A10 as executable
  tests.** All eleven rows of D4 are the concrete form of this question.
  It no longer blocks a visitor's ability to reach a person at all: that
  is the standing contact section, which needs no widget (DEC-0081 §7).
- **Q-0072 is closed (2026-09-24).** The hub carries `contact-channels.md`
  in `@schafe-vorm-fenster/goals` (SRC-0008): four channels, their
  addresses, the goal each serves and who answers. The phone row ships,
  and D13 carries its position, its scheme and where its value resolves
  from. This spec still states no value for it — that is DEC-0083, not a
  gap. What the closure did **not** produce is a response expectation:
  none is recorded on any channel, so no row states one (D13).
- envoy-api's production host is UNKNOWN (SRC-0011), so the CSP allowlist
  entry required by NFR-WEB-0030 cannot be written yet. Part of Q-0022 (C8).
- The widget's delivery date is UNKNOWN (C10). D6 defines the shippable
  state without it; the decision on whether to launch with the fallback
  is not this spec's to make.
- **Q-0017 (invoicing process — issuing, addressing, dunning)** leaves D8
  step 3's receiving system open. Payment method itself is decided
  (DEC-0011); the receiving system is not, and the two candidates named in
  D8 differ in integration work, not in constraints.
- **Q-0020 is closed as a question and open as a delivery.** `DEC-0051`
  resolved *which* system: envoy carries signup and double opt-in. **No
  sending system is in operation** — Q-0022's measurement of 2026-09-11
  says so in as many words, and the widget's date is UNKNOWN (C10).
  Choosing a system did not produce one, so no signup ships (A21). What
  stays [PROPOSED] in D10 is the confirmation URL and the field set.
- **Q-0073 — the WhatsApp newsletter route is a new capability and three
  of its five parts do not exist** (D10, N3–N5): nothing records an
  arriving opt-in as a subscription, there is no unsubscribe, and there
  is no per-channel confirmed-subscription count. They are **not** part
  of the Q-0022 contract, which covers the e-mail route only. Demanded
  and unowned. Addressee: envoy/ops.
- **The prefilled message has no copy-guide rule** (D14 §6). SRC-0017
  carries none, and the WhatsApp and mail rows carry no prefill until
  one and its sentences exist. Addressee: the owner of the copy guide
  (DEC-0080).
- ~~SRC-0003 leaves newsletter placement open (footer only versus inline
  on trust pages).~~ **Closed by `DEC-0052` §4 as amended (2026-09-24):**
  footer everywhere plus inline on `/ueber-uns`, secondary, below the
  booking. The amendment also re-derives the reason, which the page's
  new primary conversion had spent.
- FUN-WEB-0022's two-working-day promise is an operational commitment with
  no owner recorded (D4 C11). A13 withholds the copy rather than
  publishing a promise the process cannot keep.
- D1 in-page placement, D2 mechanics, D3, D6, D10 and D12 are
  [PROPOSED].

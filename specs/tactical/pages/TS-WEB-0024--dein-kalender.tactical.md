---
artefact: tactical-spec
id: TS-WEB-0024
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0014, BUS-WEB-0015, FUN-WEB-0202]
sources: [SRC-0001, SRC-0003, SRC-0014]
decisions: [DEC-0011, DEC-0030, DEC-0036, DEC-0048, DEC-0052, DEC-0056, DEC-0081, DEC-0082, DEC-0083]
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-11T07:13:07+02:00"
---

# TS-WEB-0024 — `/dein-kalender`

## Purpose

The page that asks for 480 €: focus job *run our own calendar*, the product
named once, three tiers under one heading, and the paid conversion beside
the consult without breaking the one-primary rule.

Composition and pricing rules are TS-WEB-0006 (D10 is this page's); components and
rhythm `concept/website-design-system.md`; routes TS-WEB-0004 · proof TS-WEB-0005 ·
embed demo TS-WEB-0008 · rendering TS-WEB-0009 · forms TS-WEB-0016 · events TS-WEB-0012 · SEO
TS-WEB-0011 · boundaries TS-WEB-0018 · no-tracking claim TS-WEB-0013. None of it is restated.

## Determinations

### D1 — Page manifest [FIXED: FUN-WEB-0014, SRC-0003, TS-WEB-0006 D1]

`app/dein-kalender/page.meta.ts`:

| Field | Value |
| --- | --- |
| `focusJob` | `run-our-own-calendar` |
| `primaryConversion` | `buy-calendar-licence` |
| `equalWeightConversion` | `request-product-briefing` |
| `audiences` | `municipalities`, `institutions`, `actors`, `counties` in that order (SRC-0003); `counties` is served by the tier-3 link, not by a block |
| `liveModules` | position 1′ embed demo (TS-WEB-0008 D1/D6), with the declared empty state |
| `proofSlots` | `tiers-480`, `contrast`, `trust` — three inline slots, 3 elements each (DEC-0048) |

`request-licence-quote` is **not** declared here — it belongs to `/deine-region` (FUN-WEB-0016); tier 3 links there, it opens no quote.

### D2 — Argument blocks, fixed order [FIXED: SRC-0003 §Run our own calendar]

TS-WEB-0006 D2 block 2, expanded. Each block carries a stable `data-block` id.

| # | `data-block` | Content | Notes |
| --- | --- | --- | --- |
| 1 | `focus` | ownership headline — your calendar, your website, your name, and nobody in the office types dates any more — plus both CTAs (D3) | TS-WEB-0006 D2 block 1 |
| 2 | `contrast` | today versus with the product, four rows (D4) | |
| 3 | `embed-demo` | the real widget, position 1′ (D5) | |
| 4 | `tiers` | three tiers under one heading (D6) | carries the one product name (D7) |
| 5 | `proof` | proof, sell-weighted, with images (D9) | |
| 6 | `trust` | data protection, operations, AI — one block (D10) | |
| — | — | context band, closing CTA, then the contact section | rendered by the layout (TS-WEB-0006 D2/D5/D6, DEC-0081) |

Section rhythm is [FREE], with one binding consequence: `tiers` sits between
the two photo-wanting blocks, so "never two photo sections in a row" holds.

### D3 — Two equal-weight conversions, one primary treatment [FIXED: TS-WEB-0006 D3; Pulse placement PROPOSED]

TS-WEB-0006 D3's resolution applies unchanged and fits this page:

| Element | Treatment | Target | Marked |
| --- | --- | --- | --- |
| order the calendar | **Pulse** (`himbeere-600`; design system: paid conversion only) | `/dein-kalender/bestellen` via the route facade | `data-cta="primary"` |
| book a briefing | Secondary, adjacent, in the **same** block | **this page's contact section** — in-page, not outbound. The appointment URL occurs once on the page, in the section's first action row (DEC-0081 §3, TS-WEB-0016 D7) | `data-cta="equal-weight"` |
| closing CTA | Primary on light/dark — **not** Pulse | same goal, target and label as the primary | not `data-cta="primary"` |
| tier-2 CTA (D6) | Primary on light — **not** Pulse | `/dein-kalender/bestellen` | not `data-cta="primary"` |

Pulse therefore occurs **exactly once**, in `focus` — keeping both TS-WEB-0006 D3
("visually unrivalled") and the one-himbeere rule true without reasoning per
screen. Equal weight is adjacency and equal offer, not a second Pulse.

This is the two-CTA hero DEC-0082 §3 settles — order beside consult — and it
is now the rule rather than TS-WEB-0006 D3's proposal. The consult half no
longer leaves the site from here: it hands the visitor to the contact
section, where appointment, WhatsApp, phone and mail stand together and
where the conversion is measured (TS-WEB-0016 D12).

### D4 — Today versus with your calendar: four rows [FIXED: SRC-0003, DEC-0106 §2; shape PROPOSED]

Exactly four rows, two columns — **today** and **with your calendar** —
derived from `portalize-calendar`'s problem and benefit sections; never copied,
never a fifth row to fit a feature. Not a scene block (TS-WEB-0006 D7), not a
feature list (CON-WEB-0010): one sentence per cell, no checkmark column.

**The second column names no product.** It used to read "with the product",
which is the placeholder the review rejected and which `SRC-0017` CG-039 fails
a build on. It is not replaced by a name: `CG-038` allows the name once on this
page, at the 480 € tier, and spending that occurrence on a table column takes
it from where the price is read. So this determination stands whichever way the
naming question (`Q-0077`) goes. What either cell *says* is copy (DEC-0083 §1).

### D5 — Embed demo [FIXED: DEC-0030, TS-WEB-0008 D6]

TS-WEB-0008 D6 governs loader, host, lazy loading, cookies, failure. Page-local:

| Aspect | Determination |
| --- | --- |
| Position | block 3, after the contrast, before the tiers — the argument is "this is the actual product", so it stands before the price |
| Heading | states the radius/filter it is actually showing (TS-WEB-0008 D1 rule) |
| Label while Q-0026 is open | the demo renders the reference organizer and is labelled an example; it must not say "your place" |
| Reserved space | the container declares its height before the loader runs; the page never reflows |
| Failure | static copy and the block's CTA remain; no empty frame, no error sentence |

### D6 — Three tiers under one heading [FIXED: SRC-0003, DEC-0083; amended by DEC-0060, see D6a; module shape PROPOSED]

One module, **one heading that frames the three tiers by the single
criterion separating them** — where the calendar runs (D6a) — and three
tiers in that order.

The heading's wording and its grammatical form are copy, written under
SRC-0017 (CG-022); this spec supplies no sentence and requires no form —
not a question, not a statement (DEC-0083 §2). The earlier "one question
heading" is withdrawn: it demanded exactly the form CG-005 fails a build
on.

Facts come from `@schafe-vorm-fenster/offerings`; this spec references ids
only.

| # | Tier | Offering id | Price shown | CTAs |
| --- | --- | --- | --- | --- |
| 1 | your village | `community-calendar` | free — a permanence statement, not a price (TS-WEB-0006 D10) | open the calendar · publish dates (Quiet) |
| 2 | under your name | `portalize-calendar` | 480 €/year, net (D8) | order (Primary) · briefing (Quiet) |
| 3 | for a whole region | `portalize-enterprise` | "auf Anfrage" — no figure, no range, no "ab" | continue to `/deine-region` via the route facade (Quiet) |

Tier 3 keeps **one** CTA, and it is the link onward: `/deine-region` owns
the quote conversion (FUN-WEB-0016), and DEC-0082 §4 points a module's CTA at
the deeper page's primary. The review's "the region tier gets a booking
plus contact" is satisfied without a second CTA inside the tier — the
contact section stands on this page below the closing CTA, and the consult
CTA in `focus` already points at it.

- The tiers are **not** an audience selector (TS-WEB-0018 D7, TS-WEB-0006 D8): one
  question answered three times. No tab, toggle or "which are you?" control.
- No feature matrix — a tier is a short argument plus its CTA; the boundary
  is scale, not a checkmark grid.
- Every tier CTA is secondary; none carries `data-cta="primary"`
  (DEC-0082 §1). Tier 1's CTAs are links into the community calendar and the
  publisher registration, **not** declared conversions of this page (D1) —
  an in-body link to another page's goal is a link, not a declaration
  (DEC-0082 §4).

### D7 — "Portalize" is named exactly once [FIXED: DEC-0052 §1, resolves Q-0012]

The name appears once in the rendered text of this route, in tier 2's body
copy, in one sentence saying the calendar under your name is called
Portalize. Absent everywhere else: headings, tier and CTA labels, `<title>`,
meta description, structured data, nav, footer, breadcrumb, URL.

This **fixes the floor** TS-WEB-0018 D5 left open: on this route the count is
exactly 1, not ≤ 1. Its exemptions (loader origin, CSP, `data-*`) stand and
do not count towards it.

### D8 — Pricing on this page [FIXED: BUS-WEB-0015, FUN-WEB-0202, TS-WEB-0006 D10]

| Rule | Realisation |
| --- | --- |
| one figure | exactly one numeric price token renders on this page: `portalize-calendar`'s 480 |
| sourced, not typed | amount, currency, interval and `vat: excluded` are read from the offering package; the net qualifier is rendered because the package says `excluded`, not because copy remembers to add it |
| enterprise | `portalize-enterprise` is `price_status: on-request` and `promotion: promoted` — mentioned, never priced. The internal 4.000 € figure may not appear in markup, comment, JSON-LD, or `data-*` |
| free tier | not a price; its permanence statement is content, backed by the 2022 public commitment |
| structured data | the `Offer` of TS-WEB-0011 carries the same 480 from the same source — one number, two renderings, no second constant |

### D9 — Proof: job fit outranks proximity [FIXED: TS-WEB-0005 D5, DEC-0048]

The page uses the `run our own calendar` weight profile (`w_geo 0.20 · w_ctx
0.25 · w_job 0.40 · w_time 0.15`), so a mayor from Baden-Württemberg is
served by Rubkow rather than by a nearer clipping with no job fit —
deliberate, and not to be "fixed" by raising `w_geo` here.

- 3 elements per inline slot (DEC-0048), ordered per TS-WEB-0005 D6, from a pool
  biased to the proof ids `portalize-calendar` references.
- **With images**: a card whose image has no cleared usage right renders the
  placeholder treatment (hatch + "Foto gesucht") — never a borrowed photo,
  never a text-only card without the badge.
- An empty slot weakens the claim; it is never filled by invention (SRC-0001 §4).

### D10 — Data protection, operations and AI: one block that must stay true [FIXED: FUN-WEB-0125, CON-WEB-0033, TS-WEB-0013 D1; the operations and AI sentences PROPOSED]

One block, three subjects, no second occurrence on the page.

| Subject | What the block may assert | What keeps it true |
| --- | --- | --- |
| data protection | the claim set of TS-WEB-0013 D1 — no tracking cookies, no persistent identifier, no consent banner, no third-party trackers beyond the named one | TS-WEB-0013 D2's closed host inventory; the embed of D5 is inside that inventory and its cookie-freedom is Q-0026 |
| operations | who runs the service and where | **UNKNOWN — no source.** No sentence ships without a hub record behind it |
| AI | how AI is and is not used on the data | **UNKNOWN — no source.** Same rule |

The block links to `/rechtliches#datenschutz` and `/rechtliches#auftragsverarbeitung`
(DEC-0052 §5) — the AV contract is public so a municipality can check it
before buying.

No wording may claim more than TS-WEB-0013 D2 supports: "no third-party services at
all" is false, and a defect rather than a variant.

### D11 — Local advertising appears nowhere [FIXED: DEC-0052 §3, resolves Q-0006]

While `local-advertising` is `promotion: withheld`, this page carries **zero**
occurrences: no sentence, no `withheld_mention` field, no CTA, no link, no
`request-ad-placement` call site. The guard checks absence, not a ceiling —
TS-WEB-0018 D8's budget constant is 0 for this route.

## Free for the generator

- [FREE] All copy. Nothing quoted in this spec is copy.
- [FREE] Section colours, photo choices, and the visual form of the tier
  module (columns, panels, scroller) as long as D6's order and CTA treatments hold.
- [FREE] Component and file naming; the contrast block as table, list or two
  columns, as long as D4's four rows are machine-countable.
- [FREE] Whether the briefing CTA repeats below the fold — never in Pulse.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0024-A1 | static | `page.meta.ts` for `/dein-kalender` matches D1 exactly: `focusJob`, `primaryConversion`, `equalWeightConversion`, the four audiences in order, position 1′ as live module, three proof slots. `request-licence-quote` is absent. |
| TS-WEB-0024-A2 | e2e | Load `/dein-kalender`. The elements carrying `data-block` appear in DOM order `focus`, `contrast`, `embed-demo`, `tiers`, `proof`, `trust`, then the context band, then the closing CTA, then the contact section. Nothing but the global footer follows it. |
| TS-WEB-0024-A3 | e2e | Exactly one element has `data-cta="primary"`; it links to `/dein-kalender/bestellen` and is the only element on the page using the Pulse fill. Exactly one `data-cta="equal-weight"` exists, inside `data-block="focus"`, in secondary treatment. |
| TS-WEB-0024-A4 | e2e | At 360 × 640 and at 1280 × 800 both the primary and the equal-weight CTA are fully visible without scrolling. |
| TS-WEB-0024-A5 | e2e | `data-block="contrast"` contains exactly four rows, each with a today cell and a with-your-calendar cell; no checkmark/cross column and no row beyond four. Neither column label nor any cell contains a product name or the words the avoid list carries for it ("das Produkt", "mit dem Produkt" — SRC-0017 CG-039). The criterion asserts the two cells and the absence, never their wording (DEC-0083, DEC-0106 §2). |
| TS-WEB-0024-A6 | e2e | With the loader host blocked, `data-block="embed-demo"` still renders its copy and a working CTA, shows no empty frame and no error text, and the page height above the block is unchanged from the unblocked run (no reflow). |
| TS-WEB-0024-A7 | e2e | With the loader allowed, the only third-party script request from this block goes to the allowlisted Portalize host; after full load `document.cookie` is empty and `localStorage`/`sessionStorage` hold no entry set by the embed. |
| TS-WEB-0024-A8 | e2e | `data-block="tiers"` has exactly one heading element and exactly three tier elements in the order `community-calendar`, `portalize-calendar`, `portalize-enterprise` (readable from each tier's `data-offering`); each tier carries at most the CTAs D6 lists for it, none of them `data-cta="primary"`. Tier 3's CTA resolves to `/deine-region`. No tab, toggle, radio or `select` exists anywhere on the page. The heading's wording and form are not asserted (DEC-0083). |
| TS-WEB-0024-A9 | e2e | The rendered text of the page contains the string "Portalize" exactly once (case-insensitive), and that occurrence is inside `data-block="tiers"`, inside the `portalize-calendar` tier, and not inside any heading, link label, `<title>`, meta description or JSON-LD. |
| TS-WEB-0024-A10 | e2e | Exactly one numeric price token renders: 480, with currency, the annual interval and the net qualifier. The strings "4.000", "4000", "ab " and any second price figure do not occur in the DOM, in JSON-LD, in HTML comments or in `data-*` attributes. |
| TS-WEB-0024-A11 | static | The rendered 480 value, its currency, interval and VAT flag come from the offering package import; no literal `480` appears in page or component source. The JSON-LD `Offer` reads from the same import. |
| TS-WEB-0024-A12 | unit | With the `run our own calendar` weight profile and a stage-2 trait outside the covered region, a high job-fit proof element outranks a geographically nearer element with low job fit; the page's profile equals TS-WEB-0005 D5's row for this focus job. |
| TS-WEB-0024-A13 | e2e | `data-block="proof"` renders three proof cards; each card shows either a cleared image or the placeholder treatment with its badge; no card is text-only without the badge. An unfilled slot renders nothing rather than a substitute. |
| TS-WEB-0024-A14 | e2e | `data-block="trust"` occurs exactly once, contains the data-protection claim, and links to both `/rechtliches#datenschutz` and `/rechtliches#auftragsverarbeitung`; both anchors exist on the target page. No stronger claim than TS-WEB-0013 D1 permits ("keine Drittanbieter" without qualification fails). |
| TS-WEB-0024-A15 | e2e | Clicking the equal-weight CTA moves to this page's contact section and emits no event. The section's first action row navigates to the configured Google Calendar URL and emits `request-product-briefing` with `stage: handover` exactly once, carrying `/dein-kalender` as the route; that row is the only element on the page carrying the appointment URL. No Google script, iframe or font is loaded by the page. |
| TS-WEB-0024-A16 | e2e | Clicking the primary CTA lands on `/dein-kalender/bestellen` and emits no conversion event from this page. |
| TS-WEB-0024-A17 | e2e | The closing CTA carries the same conversion goal id, target and label as the primary CTA and does not use the Pulse fill; the context band names exactly the three non-focus jobs. |
| TS-WEB-0024-A18 | static | No content file bound to this route references `local-advertising`, none carries a `withheld_mention` field, and the rendered page contains no advertising CTA or `request-ad-placement` call site. |
| TS-WEB-0024-A19 | manual | Every sentence in `data-block="trust"` about operations and AI names a hub record in its `derived_from`. A sentence without one blocks the block from shipping; the data-protection sentences alone may ship. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0014 (`/dein-kalender`, focus job *run our own calendar*, primary `buy-calendar-licence`, equal `request-product-briefing`) | D1, D2, D3, D4, D5, D6, D9, D10 · A1–A9, A12–A17, A19 |
| BUS-WEB-0015 (the billable unit is the organisation and not the place, …) | D6, D8, D11 · A8, A10, A11, A18 |
| FUN-WEB-0202 (publish the licence price of 480 €/year for a …) | D6, D8, D11 · A8, A10, A11, A18 |

### D6a — What the tiers actually differ by [FIXED: DEC-0060]

Corrected 2026-09-11. The tiers are **not** graded by territory (village ·
places · region) but by **where the calendar runs**, which is the real
product difference:

| Tier | Where it runs | Extra | Offering |
| --- | --- | --- | --- |
| free | in the Dorfkalender | — | `community-calendar` |
| 480 €/yr | on your own website, configured | — | `portalize-calendar` |
| on request | on your own website | map view (from January 2027, DEC-0061), white-label registration | `portalize-enterprise` |

The 480 € licence is **per organisation**, with no place limit — several
organisations in one place or region each holding their own calendar is
the intended case. The single criterion stays **where the calendar runs**,
which satisfies the IA's one-question requirement without asking the
visitor to classify herself (FUN-WEB-0009). How the heading expresses it is
copy, not a form this spec fixes (D6, DEC-0083).

## Open points

| # | Point | Addressee |
| --- | --- | --- |
| 1 | **The operations and AI sentences have no source.** SRC-0003 names the block's three subjects and nothing more; nothing in the hub states what is claimed about operations or about AI use on publisher data. Until a record exists, D10 ships the data-protection part only. | jan-henrik / gtm hub |
| 2 | **Q-0026 gates the strongest block.** Without the loader's place-filter parameter the demo stays a labelled example rather than "your place", and the cookie-freedom of the embed is unverified — which is also what A7 and the D10 claim depend on. | portalize |
| 3 | **TS-WEB-0018 D5 still reads "≤ 1, no floor"** (Q-0012 open) and **TS-WEB-0018 D8/A10 still budget one advertising sentence on this page** (Q-0006 open). DEC-0052 §1 and §3 resolved both; D7 and D11 here implement exactly 1 and exactly 0. TS-WEB-0018 must be tightened to match, or the specs disagree about a passing page. | TS-WEB-0018 owner / spec work |
| 4 | **The two equal-weight conversions are not equally observable.** `request-product-briefing` emits on this page; `buy-calendar-licence` completes only on `/dein-kalender/bestellen`. Comparing the two arms needs the internal CTA click as a measured step — TS-WEB-0012 D7 deliberately has no such event. Decide: accept the asymmetry, or add one step event. | TS-WEB-0012 owner |
| 5 | ~~**Tier-1 CTAs point at goals this page does not declare.**~~ **Closed by DEC-0082 §4:** an in-body link to another page's goal is a link, not a declaration, and TS-WEB-0006 D9's check reads declarations only. | — |
| 6 | **Pulse at tier 2 — still open, and now only a visual question.** D3 gives the paid conversion its Pulse only in the focus block, so the tier-2 order button — the moment the price is read — is the quieter of the two. DEC-0082 fixes that exactly one element carries the primary marker; *which* one does is a weight judgement inside one page that needs the design owner, not a new rule. | design / TS-WEB-0006 owner |
| 7 | **Sell-weighted proof is thin.** The `portalize-calendar` offering references four testimonials and no written-up reference case, and five proof records are still `usage_rights: unverified` (Q-0014). The 480 € page is where that shortage is most expensive. | content phase / jan-henrik |

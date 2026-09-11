---
artefact: tactical-spec
id: TS-024
profile: interaction
status: DRAFT
implements: [WEB-F-014, WEB-F-020]
sources: [SRC-001, SRC-003, SRC-014]
decisions: [DEC-011, DEC-030, DEC-036, DEC-048, DEC-052, DEC-056]
---

# TS-024 — `/dein-kalender`

## Purpose

The page that asks for 480 €: focus job *run our own calendar*, the product
named once, three tiers under one question, and the paid conversion beside
the briefing without breaking the one-primary rule.

Composition and pricing rules are TS-006 (D10 is this page's); components and
rhythm `concept/website-design-system.md`; routes TS-004 · proof TS-005 ·
embed demo TS-008 · rendering TS-009 · forms TS-016 · events TS-012 · SEO
TS-011 · boundaries TS-018 · no-tracking claim TS-013. None of it is restated.

## Determinations

### D1 — Page manifest [FIXED: WEB-F-014, SRC-003, TS-006 D1]

`app/dein-kalender/page.meta.ts`:

| Field | Value |
| --- | --- |
| `focusJob` | `run-our-own-calendar` |
| `primaryConversion` | `buy-calendar-licence` |
| `equalWeightConversion` | `request-product-briefing` |
| `audiences` | `municipalities`, `institutions`, `actors`, `counties` in that order (SRC-003); `counties` is served by the tier-3 link, not by a block |
| `liveModules` | position 1′ embed demo (TS-008 D1/D6), with the declared empty state |
| `proofSlots` | `tiers-480`, `contrast`, `trust` — three inline slots, 3 elements each (DEC-048) |

`request-licence-quote` is **not** declared here — it belongs to `/deine-region` (WEB-F-016); tier 3 links there, it opens no quote.

### D2 — Argument blocks, fixed order [FIXED: SRC-003 §Run our own calendar]

TS-006 D2 block 2, expanded. Each block carries a stable `data-block` id.

| # | `data-block` | Content | Notes |
| --- | --- | --- | --- |
| 1 | `focus` | ownership headline — your calendar, your website, your name, and nobody in the office types dates any more — plus both CTAs (D3) | TS-006 D2 block 1 |
| 2 | `contrast` | today versus with the product, four rows (D4) | |
| 3 | `embed-demo` | the real widget, position 1′ (D5) | |
| 4 | `tiers` | three tiers under one question (D6) | carries the one product name (D7) |
| 5 | `proof` | proof, sell-weighted, with images (D9) | |
| 6 | `trust` | data protection, operations, AI — one block (D10) | |
| — | — | context band, then closing CTA | rendered by the layout (TS-006 D2/D5/D6) |

Section rhythm is [FREE], with one binding consequence: `tiers` sits between
the two photo-wanting blocks, so "never two photo sections in a row" holds.

### D3 — Two equal-weight conversions, one primary treatment [FIXED: TS-006 D3; Pulse placement PROPOSED]

TS-006 D3's resolution applies unchanged and fits this page:

| Element | Treatment | Target | Marked |
| --- | --- | --- | --- |
| order the calendar | **Pulse** (`himbeere-600`; design system: paid conversion only) | `/dein-kalender/bestellen` via the route facade | `data-cta="primary"` |
| book a briefing | Secondary, adjacent, in the **same** block | the configured Google Calendar URL (TS-016 S3) | `data-cta="equal-weight"` |
| closing CTA | Primary on light/dark — **not** Pulse | same goal, target and label as the primary | not `data-cta="primary"` |
| tier-2 CTA (D6) | Primary on light — **not** Pulse | `/dein-kalender/bestellen` | not `data-cta="primary"` |

Pulse therefore occurs **exactly once**, in `focus` — keeping both TS-006 D3
("visually unrivalled") and the one-himbeere rule true without reasoning per
screen. Equal weight is adjacency and equal offer, not a second Pulse.

### D4 — Today versus with the product: four rows [FIXED: SRC-003; shape PROPOSED]

Exactly four rows, two columns (today · with the product), derived from
`portalize-calendar`'s problem and benefit sections — never copied, never a
fifth row to fit a feature. Not a scene block (TS-006 D7), not a feature list
(WEB-C-010): one sentence per cell, no checkmark column.

### D5 — Embed demo [FIXED: DEC-030, TS-008 D6]

TS-008 D6 governs loader, host, lazy loading, cookies, failure. Page-local:

| Aspect | Determination |
| --- | --- |
| Position | block 3, after the contrast, before the tiers — the argument is "this is the actual product", so it stands before the price |
| Heading | states the radius/filter it is actually showing (TS-008 D1 rule) |
| Label while Q-026 is open | the demo renders the reference organizer and is labelled an example; it must not say "your place" |
| Reserved space | the container declares its height before the loader runs; the page never reflows |
| Failure | static copy and the block's CTA remain; no empty frame, no error sentence |

### D6 — Three tiers under one question [FIXED: SRC-003; module shape PROPOSED]

One module, one question heading ("who is the calendar for?"), three tiers in
this order. Facts come from `@schafe-vorm-fenster/offerings`; this spec
references ids only.

| # | Tier | Offering id | Price shown | CTAs |
| --- | --- | --- | --- | --- |
| 1 | your village | `community-calendar` | free — a permanence statement, not a price (TS-006 D10) | open the calendar · publish dates (Quiet) |
| 2 | under your name | `portalize-calendar` | 480 €/year, net (D8) | order (Primary) · briefing (Quiet) |
| 3 | for a whole region | `portalize-enterprise` | "auf Anfrage" — no figure, no range, no "ab" | continue to `/deine-region` via the route facade (Quiet) |

- The tiers are **not** an audience selector (TS-018 D7, TS-006 D8): one
  question answered three times. No tab, toggle or "which are you?" control.
- No feature matrix — a tier is a short argument plus its CTA; the boundary
  is scale, not a checkmark grid.
- Tier 1's CTAs are links into the community calendar and the publisher
  registration, **not** declared conversions of this page (D1). See Open points.

### D7 — "Portalize" is named exactly once [FIXED: DEC-052 §1, resolves Q-012]

The name appears once in the rendered text of this route, in tier 2's body
copy, in one sentence saying the calendar under your name is called
Portalize. Absent everywhere else: headings, tier and CTA labels, `<title>`,
meta description, structured data, nav, footer, breadcrumb, URL.

This **fixes the floor** TS-018 D5 left open: on this route the count is
exactly 1, not ≤ 1. Its exemptions (loader origin, CSP, `data-*`) stand and
do not count towards it.

### D8 — Pricing on this page [FIXED: WEB-F-020, TS-006 D10]

| Rule | Realisation |
| --- | --- |
| one figure | exactly one numeric price token renders on this page: `portalize-calendar`'s 480 |
| sourced, not typed | amount, currency, interval and `vat: excluded` are read from the offering package; the net qualifier is rendered because the package says `excluded`, not because copy remembers to add it |
| enterprise | `portalize-enterprise` is `price_status: on-request` and `promotion: promoted` — mentioned, never priced. The internal 4.000 € figure may not appear in markup, comment, JSON-LD, or `data-*` |
| free tier | not a price; its permanence statement is content, backed by the 2022 public commitment |
| structured data | the `Offer` of TS-011 carries the same 480 from the same source — one number, two renderings, no second constant |

### D9 — Proof: job fit outranks proximity [FIXED: TS-005 D5, DEC-048]

The page uses the `run our own calendar` weight profile (`w_geo 0.20 · w_ctx
0.25 · w_job 0.40 · w_time 0.15`), so a mayor from Baden-Württemberg is
served by Rubkow rather than by a nearer clipping with no job fit —
deliberate, and not to be "fixed" by raising `w_geo` here.

- 3 elements per inline slot (DEC-048), ordered per TS-005 D6, from a pool
  biased to the proof ids `portalize-calendar` references.
- **With images**: a card whose image has no cleared usage right renders the
  placeholder treatment (hatch + "Foto gesucht") — never a borrowed photo,
  never a text-only card without the badge.
- An empty slot weakens the claim; it is never filled by invention (SRC-001 §4).

### D10 — Data protection, operations and AI: one block that must stay true [FIXED: WEB-Q-023, TS-013 D1; the operations and AI sentences PROPOSED]

One block, three subjects, no second occurrence on the page.

| Subject | What the block may assert | What keeps it true |
| --- | --- | --- |
| data protection | the claim set of TS-013 D1 — no tracking cookies, no persistent identifier, no consent banner, no third-party trackers beyond the named one | TS-013 D2's closed host inventory; the embed of D5 is inside that inventory and its cookie-freedom is Q-026 |
| operations | who runs the service and where | **UNKNOWN — no source.** No sentence ships without a hub record behind it |
| AI | how AI is and is not used on the data | **UNKNOWN — no source.** Same rule |

The block links to `/rechtliches#datenschutz` and `/rechtliches#auftragsverarbeitung`
(DEC-052 §5) — the AV contract is public so a municipality can check it
before buying.

No wording may claim more than TS-013 D2 supports: "no third-party services at
all" is false, and a defect rather than a variant.

### D11 — Local advertising appears nowhere [FIXED: DEC-052 §3, resolves Q-006]

While `local-advertising` is `promotion: withheld`, this page carries **zero**
occurrences: no sentence, no `withheld_mention` field, no CTA, no link, no
`request-ad-placement` call site. The guard checks absence, not a ceiling —
TS-018 D8's budget constant is 0 for this route.

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
| TS-024-A1 | static | `page.meta.ts` for `/dein-kalender` matches D1 exactly: `focusJob`, `primaryConversion`, `equalWeightConversion`, the four audiences in order, position 1′ as live module, three proof slots. `request-licence-quote` is absent. |
| TS-024-A2 | e2e | Load `/dein-kalender`. The elements carrying `data-block` appear in DOM order `focus`, `contrast`, `embed-demo`, `tiers`, `proof`, `trust`, then the context band, then the closing CTA. Nothing but the global footer follows. |
| TS-024-A3 | e2e | Exactly one element has `data-cta="primary"`; it links to `/dein-kalender/bestellen` and is the only element on the page using the Pulse fill. Exactly one `data-cta="equal-weight"` exists, inside `data-block="focus"`, in secondary treatment. |
| TS-024-A4 | e2e | At 360 × 640 and at 1280 × 800 both the primary and the equal-weight CTA are fully visible without scrolling. |
| TS-024-A5 | e2e | `data-block="contrast"` contains exactly four rows, each with a "today" and a "with the product" cell; no checkmark/cross column and no row beyond four. |
| TS-024-A6 | e2e | With the loader host blocked, `data-block="embed-demo"` still renders its copy and a working CTA, shows no empty frame and no error text, and the page height above the block is unchanged from the unblocked run (no reflow). |
| TS-024-A7 | e2e | With the loader allowed, the only third-party script request from this block goes to the allowlisted Portalize host; after full load `document.cookie` is empty and `localStorage`/`sessionStorage` hold no entry set by the embed. |
| TS-024-A8 | e2e | `data-block="tiers"` has one question heading and exactly three tier elements in the order `community-calendar`, `portalize-calendar`, `portalize-enterprise` (readable from each tier's `data-offering`). Tier 3's CTA resolves to `/deine-region`. No tab, toggle, radio or `select` exists anywhere on the page. |
| TS-024-A9 | e2e | The rendered text of the page contains the string "Portalize" exactly once (case-insensitive), and that occurrence is inside `data-block="tiers"`, inside the `portalize-calendar` tier, and not inside any heading, link label, `<title>`, meta description or JSON-LD. |
| TS-024-A10 | e2e | Exactly one numeric price token renders: 480, with currency, the annual interval and the net qualifier. The strings "4.000", "4000", "ab " and any second price figure do not occur in the DOM, in JSON-LD, in HTML comments or in `data-*` attributes. |
| TS-024-A11 | static | The rendered 480 value, its currency, interval and VAT flag come from the offering package import; no literal `480` appears in page or component source. The JSON-LD `Offer` reads from the same import. |
| TS-024-A12 | unit | With the `run our own calendar` weight profile and a stage-2 trait outside the covered region, a high job-fit proof element outranks a geographically nearer element with low job fit; the page's profile equals TS-005 D5's row for this focus job. |
| TS-024-A13 | e2e | `data-block="proof"` renders three proof cards; each card shows either a cleared image or the placeholder treatment with its badge; no card is text-only without the badge. An unfilled slot renders nothing rather than a substitute. |
| TS-024-A14 | e2e | `data-block="trust"` occurs exactly once, contains the data-protection claim, and links to both `/rechtliches#datenschutz` and `/rechtliches#auftragsverarbeitung`; both anchors exist on the target page. No stronger claim than TS-013 D1 permits ("keine Drittanbieter" without qualification fails). |
| TS-024-A15 | e2e | Clicking the equal-weight CTA navigates to the configured Google Calendar URL and emits `request-product-briefing` with `stage: handover` exactly once. No Google script, iframe or font is loaded by the page. |
| TS-024-A16 | e2e | Clicking the primary CTA lands on `/dein-kalender/bestellen` and emits no conversion event from this page. |
| TS-024-A17 | e2e | The closing CTA carries the same conversion goal id, target and label as the primary CTA and does not use the Pulse fill; the context band names exactly the three non-focus jobs. |
| TS-024-A18 | static | No content file bound to this route references `local-advertising`, none carries a `withheld_mention` field, and the rendered page contains no advertising CTA or `request-ad-placement` call site. |
| TS-024-A19 | manual | Every sentence in `data-block="trust"` about operations and AI names a hub record in its `derived_from`. A sentence without one blocks the block from shipping; the data-protection sentences alone may ship. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-014 (`/dein-kalender`, focus job *run our own calendar*, primary `buy-calendar-licence`, equal `request-product-briefing`) | D1, D2, D3, D4, D5, D6, D9, D10 · A1–A9, A12–A17, A19 |
| WEB-F-020 (pricing display: 480 € public, enterprise unpriced, withheld offerings not offered) | D6, D8, D11 · A8, A10, A11, A18 |

## Open points

| # | Point | Addressee |
| --- | --- | --- |
| 1 | **The operations and AI sentences have no source.** SRC-003 names the block's three subjects and nothing more; nothing in the hub states what is claimed about operations or about AI use on publisher data. Until a record exists, D10 ships the data-protection part only. | jan-henrik / gtm hub |
| 2 | **Q-026 gates the strongest block.** Without the loader's place-filter parameter the demo stays a labelled example rather than "your place", and the cookie-freedom of the embed is unverified — which is also what A7 and the D10 claim depend on. | portalize |
| 3 | **TS-018 D5 still reads "≤ 1, no floor"** (Q-012 open) and **TS-018 D8/A10 still budget one advertising sentence on this page** (Q-006 open). DEC-052 §1 and §3 resolved both; D7 and D11 here implement exactly 1 and exactly 0. TS-018 must be tightened to match, or the specs disagree about a passing page. | TS-018 owner / spec work |
| 4 | **The two equal-weight conversions are not equally observable.** `request-product-briefing` emits on this page; `buy-calendar-licence` completes only on `/dein-kalender/bestellen`. Comparing the two arms needs the internal CTA click as a measured step — TS-012 D7 deliberately has no such event. Decide: accept the asymmetry, or add one step event. | TS-012 owner |
| 5 | **Tier-1 CTAs point at goals this page does not declare.** `register-as-publisher` and the calendar link live in tier 1 while the conversion map assigns them elsewhere; TS-006 D9 validates the manifest in both directions. Confirm that in-body links to another page's goal are not declarations, or the check will flag this page. | TS-006 owner |
| 6 | **Pulse at tier 2.** D3 gives the paid conversion its Pulse only in the focus block, so the tier-2 order button — the moment the price is read — is the quieter of the two. If the design owner wants Pulse there instead, TS-006 D3's "exactly one primary treatment" decides which one loses it. | design / TS-006 owner |
| 7 | **Sell-weighted proof is thin.** The `portalize-calendar` offering references four testimonials and no written-up reference case, and five proof records are still `usage_rights: unverified` (Q-014). The 480 € page is where that shortage is most expensive. | content phase / jan-henrik |

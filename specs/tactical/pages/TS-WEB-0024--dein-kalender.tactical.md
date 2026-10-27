---
artefact: tactical-spec
id: TS-WEB-0024
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0014, BUS-WEB-0015, FUN-WEB-0202]
sources: [SRC-0001, SRC-0003, SRC-0014]
decisions: [DEC-0011, DEC-0030, DEC-0036, DEC-0048, DEC-0052, DEC-0056, DEC-0081, DEC-0082, DEC-0083, DEC-0131, DEC-0154, DEC-0172, DEC-0173, DEC-0174]
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
| 4 | `embed-config` | what the visitor decides about the widget above: the sources it draws from, and the settings that cut the view (D5's "Heading"/"Label" rules apply) | added 2026-09-26, DEC-0131 §1 |
| 5 | `tiers` | three tiers under one heading (D6) | carries the one product name (D7) |
| 6 | `proof` | proof, sell-weighted, as a proof stream of voices (D9) | `lime-100` |
| 7 | `trust` | data protection, operations, AI — one block (D10) | `violet-500`, never the proof's ground (DEC-0172 §4) |
| — | — | closing CTA, context band, then the contact section | rendered by the layout (TS-WEB-0006 D2/D5/D6, DEC-0081). The closing CTA — *"Euer Kalender läuft, sobald der Code auf eurer Seite steht."* — stands **before** the band, so the conversion stays with the argument it closes (owner's review 2026-10-27, issue #93, DEC-0174 §4) |

Section rhythm is [FREE], with one binding consequence: `tiers` sits between
the two photo-wanting blocks, so "never two photo sections in a row" holds.

`embed-config` is a block of its own and not part of `embed-demo`. The two
together measured 1772 px at 390 px — a screen and a half over the section
budget — and the settings read as fine print under the picture rather than as
the answer to "but can we decide what is in it?", which is the question the
480 € tier turns on (`plan/reviews/2026-09-23/spec-impact.md` §I, DEC-0131 §1).

### D3 — Two equal-weight conversions, one primary treatment [FIXED: TS-WEB-0006 D3; Pulse placement PROPOSED]

TS-WEB-0006 D3's resolution applies unchanged and fits this page:

Rung and weight are two things (DEC-0082 amendment B): the **rung** is the
`data-cta` marker, the **weight** is the button variant SRC-0014 gives the
element. Only the marker is one-per-page, and only Pulse is visually exclusive.

| Element | Rung | Weight | Target |
| --- | --- | --- | --- |
| order the calendar | `data-cta="primary"` | **Pulse** (`himbeere-600`; design system: paid conversion only) | `/dein-kalender/bestellen` via the route facade |
| book a briefing | `data-cta="equal-weight"` — secondary, adjacent, in the **same** block | secondary | **this page's contact section** — in-page, not outbound. The appointment URL occurs once on the page, in the section's first action row (DEC-0081 §3, TS-WEB-0016 D7) |
| closing CTA | **repeat** — no marker | Primary on light/dark — **not** Pulse | same goal, target and label as the primary |
| tier-2 CTA (D6) | secondary — no marker | **Primary on light** — the strong button, **not** Pulse | `/dein-kalender/bestellen` |

The last two rows were illegal under `FUN-WEB-0135` as it read until 2026-09-25
— *"every action that is not the primary conversion … at secondary treatment"* —
and they are legal now, for two different reasons. The closing CTA is the
**repeat**, which the ladder's second rung has always given the primary
treatment minus the marker. The tier-2 CTA is a **secondary-rung element with a
strong weight**, which the ladder permits because the guide gives it one: it is
the paid conversion at the moment the price is read (audit A4/A8, DEC-0082
amendment B).

Pulse therefore occurs **exactly once**, in `focus` — keeping both TS-WEB-0006 D3
("visually unrivalled") and the one-himbeere rule true without reasoning per
screen. Equal weight is adjacency and equal offer, not a second Pulse.

This is the two-CTA hero DEC-0082 §3 settles — order beside consult — and it
is now the rule rather than TS-WEB-0006 D3's proposal. The consult half no
longer leaves the site from here: it hands the visitor to the contact
section, where appointment, WhatsApp, phone and mail stand together and
where the conversion is measured (TS-WEB-0016 D12).

### D4 — Today versus with your calendar: four rows [FIXED: SRC-0003, DEC-0106 §2; shape DEC-0172 §2]

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

**Kicker and title, reopened by DEC-0154.** The review of 2026-09-22 asked
whether this section comes too early ("Was hakt denn heute?") and whether it
carries the USP (other actors take part). Only the column labels were acted on.
The kicker *"Warum es heute hakt"* over the title *"Wer euren Termin heute nicht
mitbekommt"* was then written into CG-005 as the model split, although that title
announces people and this section shows a comparison. The owner's review of
2026-10-12 reopens it. The rule that now decides it is CG-042 (solution first)
and CG-004 (a title announces what the section shows); the new kicker and title
are copy (issue #51).

**Shape (DEC-0172 §2).** Each row is one pair of two flat fields that butt
against each other — *today* on the `archive ground`, *with your calendar* on
`lime-100` — with the mono label above its sentence, stacked below `xl` and
6 + 6 from it (SRC-0014 §Comparison, A23). The hairline text table that stood
here was the 2026-09-23 draft *Heute — und mit dem Produkt*; the owner's
review of 2026-10-27 read it as ugly (#94). The review of 2026-09-22 had
already pointed at the sepia design of `/mitmachen` for this section; the
archive ground carries that design's old world into the pair, and the
solution keeps a fresh ground, because the archive ground never carries it.

### D5 — Embed demo [FIXED: DEC-0030, TS-WEB-0008 D6]

TS-WEB-0008 D6 governs loader, host, lazy loading, cookies, failure. Page-local:

| Aspect | Determination |
| --- | --- |
| Position | block 3, after the contrast, before the tiers — the argument is "this is the actual product", so it stands before the price |
| Heading | states the radius/filter it is actually showing (TS-WEB-0008 D1 rule) |
| Label while Q-0026 is open | the demo renders the reference organizer and is labelled an example; it must not say "your place" |
| Reserved space | the container declares its height before the loader runs; the page never reflows |
| Failure | static copy and the block's CTA remain; no empty frame, no error sentence |
| Theming and contrast | the widget stands on the box's `violet-100`, never on `violet-500`; its base `color` and every `--portalize-*` colour property are site tokens, and every text in its shadow root clears 4.5:1 (3:1 large text, control borders) against its composited ground (DEC-0173 §1, SRC-0014 § *Embedded calendar*) |
| Whose calendar | the configured three-village calendar, with the own-events showcase and highlight **off** (`data-own-events-showcase="false"`, `data-own-events-highlight="false"`); no title in the widget names an organizer (DEC-0173 §2) |
| Test dates | none, by the village calendar's rule: no event whose organizer id is in `MATEO_TEST_USER_IDS` (DEC-0173 §3, TS-WEB-0008 D2). The widget fetches its events itself, so the filter is in Portalize's events route (portalize#144) |

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

**Each tier carries exactly one CTA**, which is DEC-0082 §4's rule for an
explanatory module, and the **weight differs by tier**:

| # | Tier | Offering id | Price shown | Its one CTA | Weight |
| --- | --- | --- | --- | --- | --- |
| 1 | your village | `community-calendar` | free — a permanence statement, not a price (TS-WEB-0006 D10) | publish dates → `/mitmachen` via the route facade | **Quiet** |
| 2 | under your name | `portalize-calendar` | 480 €/year, net (D8) | order → `/dein-kalender/bestellen` | **Primary on light** — the strong button (D3) |
| 3 | for a whole region | `portalize-enterprise` | "auf Anfrage" — no figure, no range, no "ab" | continue to `/deine-region` via the route facade | Quiet |

**Why one each, and why these.** DEC-0082 §4 fixes one CTA per explanatory
module pointing at *"the deeper page's primary conversion"*. Tier 1 carried two
— "open the calendar" and "publish dates" — and the first is a link into the app
rather than a next step in the decision this block is about, so it goes; the one
that stays is the one the rule names. Tier 2 carried "order" plus a briefing
link, and the briefing is reachable through the contact section on this very
page — the same argument this determination already made for tier 3.

**The weight flip is deliberate and deviates from the review** (audit A4,
2026-09-25). The review said twice that the free tier belongs at the bottom;
the order is **free first**, as the IA, this determination and the design draft
have it (`plan/reviews/2026-09-23/decisions.md` point 9). What the review was
reaching for — that the paid tier should not be the quietest thing on the page —
is answered by the weight instead of by the order: the paid tier takes the
strong button, the free tier one quiet CTA. Recorded here so the next reader
does not take the order for an oversight and re-flip it.

Tier 3's CTA is the link onward: `/deine-region` owns the quote conversion
(FUN-WEB-0016). The review's "the region tier gets a booking plus contact" is
satisfied without a second CTA inside the tier — the contact section stands on
this page below the closing CTA, and the consult CTA in `focus` already points
at it.

- The tiers are **not** an audience selector (TS-WEB-0018 D7, TS-WEB-0006 D8): one
  question answered three times. No tab, toggle or "which are you?" control.
- No feature matrix — a tier is a short argument plus its CTA; the boundary
  is scale, not a checkmark grid.
- Every tier CTA is on the **secondary rung**; none carries
  `data-cta="primary"` (DEC-0082 §1). Tier 2's strong button is a weight, not a
  rung (DEC-0082 amendment B). Tier 1's CTA is a link into the publisher
  registration, **not** a declared conversion of this page (D1) — an in-body
  link to another page's goal is a link, not a declaration (DEC-0082 §4).

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
- **As voices, without image slots** (polish brief G-9, DEC-0172 §1): the
  stream is SRC-0014 §Proof stream — flat items on the section's ground, the
  claim first, a byline of initials well, name and role under it; the first
  item at sub-head size across the row, the others at card size, 6 + 6 from
  `xl` (A13, A25). A cleared portrait or logo would take the initials well's
  place; no record carries one, so no image renders and no placeholder
  stands in for one.
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

**Ground and shape (DEC-0172 §4).** The block stands on `violet-500`, the
provenance ground (SRC-0014 §Trust block): on `lime-100` it ran on from the
proof section before it as one ground, and the owner read it as the old state
(#91). The subjects stand side by side from `xl`, each a mono label over its
paragraph under a hairline in the ground's label colour (A26).

### D12 — The benefit band is a flow, not a row of pills [FIXED: DEC-0172 §3]

`embed-config`'s `lime-500` band shows where the dates come from and the one
place they land, as SRC-0014 §Source-to-target flow: a captioned plain list of
the sources, a decorative arrow, one square `paper` target field, and the
benefit sentence as the figure's caption. It was three white pills, an arrow on
a line of its own and one black pill — four things drawn as buttons that were
not controls, in two fills whose meaning nothing stated (#96). The sources are
the actors' channels and never addressed to the reader, the target is the
reader's website and appears once (SRC-0017 CG-040 as amended by DEC-0172 §3).

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
| TS-WEB-0024-A2 | e2e | Load `/dein-kalender`. The elements carrying `data-block` appear in DOM order `focus`, `contrast`, `embed-demo`, `embed-config`, `tiers`, `proof`, `trust`, then the closing CTA, then the context band — the last block in `main` (DEC-0174 §4) — then the contact section. Nothing but the global footer follows it. |
| TS-WEB-0024-A3 | e2e | Exactly one element has `data-cta="primary"`; it links to `/dein-kalender/bestellen` and is the only element on the page using the Pulse fill. Exactly one `data-cta="equal-weight"` exists, inside `data-block="focus"`, in secondary treatment. |
| TS-WEB-0024-A4 | e2e | At 360 × 640 and at 1280 × 800 both the primary and the equal-weight CTA are fully visible without scrolling. |
| TS-WEB-0024-A5 | e2e | `data-block="contrast"` contains exactly four rows, each with a today cell and a with-your-calendar cell; no checkmark/cross column and no row beyond four. Neither column label nor any cell contains a product name or the words the avoid list carries for it ("das Produkt", "mit dem Produkt" — SRC-0017 CG-039). The criterion asserts the two cells and the absence, never their wording (DEC-0083, DEC-0106 §2). |
| TS-WEB-0024-A6 | e2e | With the loader host blocked, `data-block="embed-demo"` still renders its copy and a working CTA, shows no empty frame and no error text, and the page height above the block is unchanged from the unblocked run (no reflow). |
| TS-WEB-0024-A7 | e2e | With the loader allowed, the only third-party script request from this block goes to the allowlisted Portalize host; after full load `document.cookie` is empty and `localStorage`/`sessionStorage` hold no entry set by the embed. |
| TS-WEB-0024-A8 | e2e | `data-block="tiers"` has exactly one heading element and exactly three tier elements in the order `community-calendar`, `portalize-calendar`, `portalize-enterprise` (readable from each tier's `data-offering`); **each tier carries exactly one CTA** and none of them carries `data-cta="primary"`. Tier 1's resolves to `/mitmachen`, tier 2's to `/dein-kalender/bestellen`, tier 3's to `/deine-region`. Tier 2's CTA carries the strong button variant and tiers 1 and 3 the quiet one; no tier CTA uses the Pulse fill, which occurs only in `data-block="focus"` (A3). No tab, toggle, radio or `select` exists anywhere on the page. The heading's wording and form are not asserted (DEC-0083). |
| TS-WEB-0024-A9 | e2e | The rendered text of the page contains the string "Portalize" exactly once (case-insensitive), and that occurrence is inside `data-block="tiers"`, inside the `portalize-calendar` tier, and not inside any heading, link label, `<title>`, meta description or JSON-LD. |
| TS-WEB-0024-A10 | e2e | Exactly one numeric price token renders: 480, with currency, the annual interval and the net qualifier. The strings "4.000", "4000", "ab " and any second price figure do not occur in the DOM, in JSON-LD, in HTML comments or in `data-*` attributes. |
| TS-WEB-0024-A11 | static | The rendered 480 value, its currency, interval and VAT flag come from the offering package import; no literal `480` appears in page or component source. The JSON-LD `Offer` reads from the same import. |
| TS-WEB-0024-A12 | unit | With the `run our own calendar` weight profile and a stage-2 trait outside the covered region, a high job-fit proof element outranks a geographically nearer element with low job fit; the page's profile equals TS-WEB-0005 D5's row for this focus job. |
| TS-WEB-0024-A13 | e2e | `data-block="proof"` renders three proof items, exactly one of them `data-emphasis="feature"` and two `compact`, with no image, no placeholder slot and no `Beleg` badge (D9 as amended by polish brief G-9 and DEC-0172 §1). An unfilled slot renders nothing rather than a substitute. |
| TS-WEB-0024-A14 | e2e | `data-block="trust"` occurs exactly once, contains the data-protection claim, and links to both `/rechtliches#datenschutz` and `/rechtliches#auftragsverarbeitung`; both anchors exist on the target page. No stronger claim than TS-WEB-0013 D1 permits ("keine Drittanbieter" without qualification fails). |
| TS-WEB-0024-A15 | e2e | Clicking the equal-weight CTA moves to this page's contact section and emits no event. The section's first action row navigates to the configured Google Calendar URL and emits exactly one `request-product-briefing` with `stage: handover` **and** exactly one `make-contact`, both carrying `/dein-kalender` as the route; rows 2–4 each emit exactly one `make-contact` with the row's channel and no `request-product-briefing` (TS-WEB-0016 D12/D13, DEC-0081 amendment 2026-09-25). No goal id is emitted twice for one click. That row is the only element on the page carrying the appointment URL. No Google script, iframe or font is loaded by the page. |
| TS-WEB-0024-A16 | e2e | Clicking the primary CTA lands on `/dein-kalender/bestellen` and emits no conversion event from this page. |
| TS-WEB-0024-A17 | e2e | The closing CTA carries the same conversion goal id, target and label as the primary CTA and does not use the Pulse fill; the context band names exactly the three non-focus jobs. |
| TS-WEB-0024-A18 | static | No content file bound to this route references `local-advertising`, none carries a `withheld_mention` field, and the rendered page contains no advertising CTA or `request-ad-placement` call site. |
| TS-WEB-0024-A23 | e2e | At 390 and 1280 px, `data-block="contrast"` holds four `[data-half="today"]` on `archive ground` and four `[data-half="with"]` on `lime-100`, none with a radius or a shadow; each label is a block above its sentence; the two halves of a pair butt — stacked below `xl`, side by side from it (D4, DEC-0172 §2). `e2e/module-designs.spec.ts`. |
| TS-WEB-0024-A24 | e2e | At 390 and 1280 px, the `lime-500` band of `data-block="embed-config"` holds one `figure[data-flow]` with a `figcaption`, three `li[data-flow-source]` in a list with no fill and no radius, one `[data-flow-target]` on `paper` with radius 0, a decorative arrow, and no link or button; no source text addresses the reader ("eure", "your"); the target follows the sources below `xl` and stands to their right from it (D12, DEC-0172 §3). `e2e/module-designs.spec.ts`. |
| TS-WEB-0024-A25 | e2e | At 390 and 1280 px, each of the three items of `data-block="proof"` has no fill and a `hairlineOnLime` top border, carries an `aria-hidden` 40 × 40 initials well under its claim, and from `xl` the two compact items share one row (D9, DEC-0172 §1). `e2e/module-designs.spec.ts`. |
| TS-WEB-0024-A26 | e2e | At 390 and 1280 px, `data-block="trust"` stands on `violet-500`, not on the ground of `data-block="proof"`, and its two subjects stand side by side from `xl` (D10, DEC-0172 §4). `e2e/module-designs.spec.ts`. |
| TS-WEB-0024-A19 | manual | Every sentence in `data-block="trust"` about operations and AI names a hub record in its `derived_from`. A sentence without one blocks the block from shipping; the data-protection sentences alone may ship. |
| TS-WEB-0024-A20 | e2e | With the Portalize host reachable, once the widget has rendered on `/dein-kalender`: every element inside its shadow root that carries its own text has a contrast of at least 4.5:1 (3:1 for large text) against its composited background, read across the shadow boundary; every bordered button's border clears 3:1 against the ground around it; axe's `color-contrast` rule reports nothing inside `data-block="embed-demo"` (DEC-0173 §1). |
| TS-WEB-0024-A21 | e2e | The mount in `data-block="embed-demo"` carries `data-own-events-showcase="false"` and `data-own-events-highlight="false"`; with the host reachable, the rendered widget contains no "Termine von" heading (DEC-0173 §2). |
| TS-WEB-0024-A22 | e2e | With the host reachable, the rendered widget contains no word "TEST" (DEC-0173 §3). Pending: the case is `fixme` until portalize#144 is deployed with `MATEO_TEST_USER_IDS` set. Until then the rule is evidenced by that repository's route tests. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0014 (`/dein-kalender`, focus job *run our own calendar*, primary `buy-calendar-licence`, equal `request-product-briefing`) | D1, D2, D3, D4, D5, D6, D9, D10, D12 · A1–A9, A12–A17, A19–A26 |
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
| 6 | ~~**Pulse at tier 2.**~~ **Closed by DEC-0082 amendment B and audit A4, 2026-09-25.** Pulse stays in the focus block and occurs once; the tier-2 order button takes the **strong button variant** instead, which is what the point was reaching for — the paid tier is no longer the quieter of the two at the moment the price is read, and the one-himbeere rule is untouched. Rung and weight are two things, and only the marker is one-per-page. | — |
| 7 | **Sell-weighted proof is thin.** The `portalize-calendar` offering references four testimonials and no written-up reference case, and five proof records are still `usage_rights: unverified` (Q-0014). The 480 € page is where that shortage is most expensive. | content phase / jan-henrik |

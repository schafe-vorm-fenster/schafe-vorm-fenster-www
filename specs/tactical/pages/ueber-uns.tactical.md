---
artefact: tactical-spec
id: TS-027
profile: interaction
status: DRAFT
implements: [WEB-F-017]
sources: [SRC-001, SRC-002, SRC-003, SRC-014]
decisions: [DEC-036, DEC-042, DEC-048, DEC-052, DEC-056]
---

# TS-027 — `/ueber-uns`, the Trust Surface

## Purpose

The one page that speaks **about us** rather than to the visitor. Its focus
job is *understand who is behind it*; it carries **no conversion of its
own**, and the closing block offers the three jobs that do (WEB-F-017,
SRC-003 §"Who we are").

It is read by people doing due diligence — a Landrat, a journalist, a
funder — who **scan rather than read**. Module order and acceptance
criteria are written for scanning, not narrative.

Not restated here: block order, context band, closing block and the
conversion-less case → TS-006 D2/D3/D6 · routes → TS-004 · proof
selection, ordering and this focus job's weight profile → TS-005 D5/D6,
count **seven** per DEC-048 · rendering → TS-009 · the newsletter form →
TS-016 D10 · analytics → TS-012 D4 · structured data → TS-011 D4 ·
components, photo surface, badges, ratios, page rhythm →
`concept/website-design-system.md`.

## Determinations

### D1 — Page manifest [FIXED: SRC-003, WEB-F-017, TS-006 D1; audience IDs PROPOSED]

| Field | Value |
| --- | --- |
| `focusJob` | `understand-who-is-behind-it` |
| `primaryConversion` | `null` — the page carries no CTA treatment at all (TS-006 D3) |
| `equalWeightConversion` | — |
| `audiences` | `municipalities, institutions, counties, actors, rural-residents` — SRC-003's "1 municipalities and funders · 2 everyone" resolved against `@schafe-vorm-fenster/audiences` [PROPOSED] |
| `liveModules` | `operating-counters` (D4) |
| `proofSlots` | one stream of 7, one of them type-reserved (D5) |

### D2 — Module order is a scanning order [FIXED: SRC-003 structure; sequence within block 2 PROPOSED]

| # | Block | Type | Carries |
| --- | --- | --- | --- |
| 1 | Origin | photo surface, `ratio-hero`, ink gradient | founder photo · h1 · the economic argument (D3) |
| 2 | Operating counters | colour, sober | live figures that the operation is real (D4) |
| 3 | Proof stream | colour, cards at `ratio-proof` | 7 elements incl. the one empty slot (D5) |
| 4 | Archive | colour, tight | exactly one link to `/ueber-uns/archiv` (D6) |
| 5 | Team | colour, portraits at `ratio-portrait` | profiles from `@schafe-vorm-fenster/people` (D7) |
| 6 | Newsletter | colour, secondary treatment | inline signup (D8) |
| 7 | Context band + closing CTA, merged | colour `paper` | the three jobs that carry conversions (TS-006 D6) |

Rationale: identity, then evidence, then people — a scanner gets *who,
where, why this shape* in the first screen and the first proof element in
the second. Narrative order (founder → team → proof) is rejected: it
delays the evidence a due-diligence reader came for. Page rhythm: block 1
is the only photo section; the stream's images are cards **inside** a
colour section, so no two photo sections stand in a row.

### D3 — The origin is the argument [FIXED: SRC-003, DEC-036 §3; wording of the h1 FIXED, punctuation PROPOSED]

- h1: **"Gebaut in einem Dorf, betrieben aus einem Dorf."** The
  distinctive voice of this sender surface lives here, not in the route
  (DEC-036 §3). No other page may carry this headline.
- The body states the causal chain, in this order: a village of ~400
  inhabitants cannot afford a service that needs a salesperson → therefore
  the community calendar is free and stays free → therefore the licence
  costs 480 €/year instead of a project budget. The price string is read
  from `@schafe-vorm-fenster/offerings`, never typed (TS-006 D10).
- The honorary-mayor sentence is a **claim with a proof slot**, backed by
  `founder-former-volunteer-mayor` (`usage_rights: cleared`). It is the
  one inline proof outside the stream.
- The founder photo comes from `@schafe-vorm-fenster/people`; a photo not
  depicting what the copy claims carries *"Nicht motivgenau · Platzhalter"*.

### D4 — The live module: operating counters [PROPOSED — SRC-003 names none, TS-006 D1 requires one]

| Property | Rule |
| --- | --- |
| Content | years in operation (`in-operation-since-2018`, cleared) and the live count of active places, counted at request time |
| Forbidden | any static traction figure — `reach-and-usage` is `status: expired` (SRC-001 §5) |
| Empty state | the sentence renders **without** the figure; no zero, no "ca.", no last-known value (TS-009 fallback tiers apply to the source, not to the claim) |
| Treatment | text with a fixed-height badge per the design system, so a change of digits does not reflow |

### D5 — The visible empty slot [FIXED: SRC-001 §4, SRC-003; mechanics PROPOSED]

The sharpest element of this page. A claim without cleared proof is
**weakened, never propped up** — so the gap is rendered, not hidden.

| Question | Determination |
| --- | --- |
| What is reserved | one slot of the seven is type-reserved for `type: testimonial` — the voices of publishers and mayors |
| When it appears | whenever the pool holds no `usage_rights: cleared` element of the reserved type after TS-005's clearance hard filter. **Today it always appears**: all five testimonials in `@schafe-vorm-fenster/proof` are `unverified` |
| Backfill | never. The slot is not handed to the next-highest scorer of another type; the stream renders 6 filled + 1 empty |
| Count | at most **one** empty slot is ever visible (SRC-003). Further gaps shorten the stream below seven instead of adding a second empty slot |
| Look | the placeholder hatch of the design system (`repeating-linear-gradient` of `surface-2`/`line`) at `ratio-proof`, with a label badge and one sentence naming what is missing |
| Not a skeleton | a skeleton is transitional and is replaced; this is terminal. It **does not animate** and is identical before and after hydration |
| Copy | names the gap in the visitor's own terms: the type gap at stage 0, the regional gap at stage ≥ 1 where the visitor's state has no cleared proof (the v2.0 board's "Für … liegt noch kein Beleg vor") [PROPOSED] |
| Accessibility | real content, not decoration: it is in the accessibility tree with its label and sentence, never `aria-hidden` |
| Stage invariance | present at every stage; rotation (TS-005 D7) never removes it |

### D6 — The archive is a link, not a preview [FIXED: SRC-003 §"Archive", TS-011 D3]

The archive block contains exactly **one** link to `/ueber-uns/archiv`
through the route facade and **zero** entry teasers, counts or thumbnails.
The archive exists once, for people who look for it; previewing it here
would turn the stream back into the list the IA rejects.

### D7 — Team [FIXED: SRC-003, DEC-042]

Profiles, roles and portraits are read from
`@schafe-vorm-fenster/people`; nothing about a person is written into
website copy. Portraits use `ratio-portrait` (4:5). A person whose folder
carries no usable portrait gets the *"Foto gesucht"* hatch — the person is
never omitted and the box is never left blank.

### D8 — The newsletter sits inside block 2, before the closing block [FIXED: DEC-052 §4, TS-006 D2]

Permitted here — and only here — because the page has no conversion of its
own, so it competes with nothing (WEB-F-003). It is an **argument block**:
after Team, **before** the merged context band + closing CTA, since
nothing renders after block 4 but the footer (TS-006 D2). Secondary
treatment; the page still contains zero `data-cta="primary"` elements.
Mechanics and the Q-020 block are TS-016 D10 — with no sending system at
launch the block simply does not ship.

### D9 — Nothing on this page is measured as a conversion [FIXED: TS-012 D4/D7]

No page-specific event: archive link, team and the three-job closing block
emit nothing, and counting starts on the pages that block leads to. No
ad-hoc "archive opened" or "scrolled to team" event is added.

### D10 — Structured data stays at `Organization` [FIXED: TS-011 D4]

Exactly one `Organization` node, referenced by `@id`, never a second full
node. **No `Person` nodes**, although the page shows people — TS-011 D4
assigns types per page type and its A5 checks "no more".

## Free for the generator

- [FREE] Copy, throughout, except the h1 of D3 and the price source — the
  content phase writes it.
- [FREE] Visual design inside every block, within the design system and
  TS-002.
- [FREE] Whether the stream is a grid or a scroller, as long as the empty
  slot sits in the reading order the engine gives it, and whether origin
  and counters are one component or two.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-027-A1 | static | `page.meta.ts` of `/ueber-uns` matches D1: `focusJob` `understand-who-is-behind-it`, `primaryConversion` `null`, audiences non-empty and ordered, ≥ 1 live module with a declared empty state, 7 proof slots. |
| TS-027-A2 | e2e | DOM order of the seven blocks is exactly D2; exactly one photo section exists; no two photo sections are adjacent. |
| TS-027-A3 | e2e | At 1280 × 800 the first viewport contains the h1 "Gebaut in einem Dorf, betrieben aus einem Dorf." and the honorary-mayor sentence; the first proof element of the stream is reached within the second viewport height (≤ 1 further screen of scrolling). |
| TS-027-A4 | e2e | The origin copy contains the free-calendar promise and exactly one price, `480 €`, and that string equals the value in `@schafe-vorm-fenster/offerings`. |
| TS-027-A5 | e2e | The stream renders at most 7 elements; every rendered proof id resolves to an element with `usage_rights: cleared`; no `unverified` id appears anywhere in the served HTML. |
| TS-027-A6 | e2e | Exactly one empty slot is visible. It shows the hatch, a label and one sentence; it contains no image; it is unchanged 5 s after load; it is present in the accessibility tree with its text; it carries no animation. |
| TS-027-A7 | integration | Fixture with one cleared `type: testimonial` element: the reserved slot is filled and **no** empty slot renders. Fixture with none: 6 filled + 1 empty, and the 7th position is not backfilled by another type. |
| TS-027-A8 | e2e | The archive block has exactly one outgoing link, target `/ueber-uns/archiv`, and zero list entries, thumbnails or counts. |
| TS-027-A9 | e2e | Every person in `@schafe-vorm-fenster/people` appears once, in a 4:5 media box; a person without a portrait shows the "Foto gesucht" surface — never an empty box, never omitted. |
| TS-027-A10 | e2e | The newsletter block stands after the team block and before the closing block; the page contains zero `data-cta="primary"` elements; the last block is the merged three-job block (rendered once, not twice). |
| TS-027-A11 | e2e | Stage 0 and stage 1 (geo set) renders have identical block order and both contain the empty slot; only the selection and order of the six filled elements differ. |
| TS-027-A12 | static | Structured data on the page: exactly one `Organization` reference by `@id`, zero `Person` nodes, zero `ItemList`. |
| TS-027-A13 | integration | Loading the page, clicking the archive link, and submitting the newsletter form emit no conversion event (TS-012 registry untouched by this page). |
| TS-027-A14 | e2e | No layout shift from late content: hero, proof cards and portraits declare `ratio-hero`, `ratio-proof`, `ratio-portrait` before data arrives; measured CLS on this page is ≤ 0.02. |
| TS-027-A15 | manual | Photo honesty: every photograph either depicts what its copy claims, or carries the badge "Nicht motivgenau · Platzhalter"; every missing photo is the "Foto gesucht" surface. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-017 (`/ueber-uns`: focus job "understand who is behind it", no conversion of its own, closing CTA offers all three jobs) | D1 (manifest, `primaryConversion: null`) · D2 (module order) · D3 (origin argument) · D4 (live module) · D5 (empty proof slot) · D6 (archive link) · D7 (team) · D8 (newsletter, closing block) · D9, D10 · A1–A15 |

## Open points

- **The five testimonials are unverified**, so the empty slot is permanent
  until clearance is on record. Intended behaviour, not a defect — but it
  should be a conscious launch decision. Addressee: jan-henrik (owner of
  `@schafe-vorm-fenster/proof`).
- **SRC-003 names no live module here**, while TS-006 D1 requires one. D4
  proposes the operating counters — confirm, or exempt sender surfaces
  from the live-module rule. Addressee: jan-henrik (IA owner).
- **Headline punctuation:** v1.0 has a comma, the v2.0 board a full stop.
  D3 and A3 use the comma of DEC-036 §3. Addressee: content phase.
- **Empty-slot copy has two framings** (missing type vs. missing region);
  which is spoken at which stage is [PROPOSED] in D5. Addressee: content.
- **Q-020 gates the newsletter block** (no sending system decided). If it
  is unanswered at launch, D8 does not ship. Addressee: envoy/ops.
- **TS-006 D6's merge of band and closing block is [PROPOSED]**; this page
  is one of the two depending on it. Addressee: jan-henrik.
- **Audience ID mapping for "funders"** — `institutions`, `counties`, or
  both, and in which order. D1 proposes both. Addressee: owner of
  `@schafe-vorm-fenster/audiences`.
- **The page shows people but emits no `Person` node.** Whether
  `Organization.founder` should be added is a TS-011 question. Addressee:
  owner of TS-011.

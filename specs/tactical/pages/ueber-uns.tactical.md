---
artefact: tactical-spec
id: TS-027
kind: interaction
status: DRAFT
implements: [WEB-F-017]
sources: [SRC-001, SRC-002, SRC-003, SRC-014]
decisions: [DEC-036, DEC-042, DEC-048, DEC-051, DEC-052, DEC-056, DEC-081, DEC-082, DEC-083, DEC-084]
---

# TS-027 — `/ueber-uns`, the Trust Surface

## Purpose

The one page that speaks **about us** rather than to the visitor. Its focus
job is *understand who is behind it*, and since DEC-081 §6 it carries a
conversion of its own: **the booking**. A reader who has just finished
reading about the sender is at the closest thing this site has to a sales
conversation, and the page pushes toward a conversation rather than toward
more content (WEB-F-017, SRC-003 §"Who we are").

It is read by people doing due diligence — a Landrat, a journalist, a
funder — who **scan rather than read**. Module order and acceptance
criteria are written for scanning, not narrative.

Not restated here: block order, context band, closing block, the CTA
ladder and the standing contact section → TS-006 D2/D3/D6 · routes →
TS-004 · proof
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
| `primaryConversion` | `request-product-briefing` (DEC-081 §6) — **unchanged by the 2026-09-24 amendment to DEC-052 §4** — one `data-cta="primary"` above the fold, targeting this page's contact section; the outbound appointment link is the section's first row, and the event fires there (TS-016 D7/D12) |
| `equalWeightConversion` | — |
| `audiences` | `municipalities, institutions, counties, actors, rural-residents` — SRC-003's "1 municipalities and funders · 2 everyone" resolved against `@schafe-vorm-fenster/audiences` [PROPOSED] |
| `liveModules` | `[]` — the sender-surface exemption of TS-006 D1 (DEC-084 §3). The operating-counter module is deleted; see D4 |
| `proofSlots` | one stream of 7, one of them type-reserved (D5) |

### D2 — Module order is a scanning order [FIXED: SRC-003 structure; sequence within block 2 PROPOSED]

| # | Block | Type | Carries |
| --- | --- | --- | --- |
| 1 | Origin | photo surface, `ratio-hero`, ink gradient | founder photo · h1 · the village argument (D3) · the primary CTA into the contact section |
| 2 | Proof stream | colour, cards at `ratio-proof` | 7 elements incl. the one empty slot (D5) |
| 3 | Archive | colour, tight | exactly one link to `/ueber-uns/archiv` (D6) |
| 4 | Team | colour, portraits at `ratio-portrait` | profiles from `@schafe-vorm-fenster/people` (D7) |
| 5 | Newsletter | colour, secondary treatment | inline signup (D8) |
| 6 | Context band | colour `paper` | the three non-focus jobs (TS-006 D5) |
| 7 | Closing CTA | colour `paper` | the booking again — same goal, target and label as block 1 (TS-006 D6) |
| — | Contact section | fixed ground, standing surface | rendered by the layout below block 7; the booking's outbound row lives here (TS-006 D2, DEC-081) |

Rationale: identity, then evidence, then people — a scanner gets *who,
where, why this shape* in the first screen and the first proof element in
the second. The counter block that used to stand between them is gone
(D4), which shortens the distance to the evidence rather than lengthening
it. The merged band-and-closing-block shape of TS-006 D6 no longer applies
here: the page has a conversion, so it repeats it.

Narrative order (founder → team → proof) is rejected: it
delays the evidence a due-diligence reader came for. Page rhythm: block 1
is the only photo section; the stream's images are cards **inside** a
colour section, so no two photo sections stand in a row.

### D3 — The origin is the argument [FIXED: SRC-003, DEC-084; wording is copy, DEC-083]

- **The block carries the page's `h1`**, and it is the one place where the
  distinctive voice of this sender surface lives — not the route
  (DEC-036 §3 as amended). What the `h1` must achieve: name the sender and
  where the work is done, concretely enough that a due-diligence reader
  knows what kind of organisation this is before she scrolls. **What it
  says is copy**, written in `content/pages/**` under SRC-017 (CG-020's
  budget, CG-033's truth rule). No spec states it, and the earlier fixed
  headline is released (DEC-083 §5) — it was rejected as literally untrue,
  the service running in a data centre.
- The body states the **village argument**, in this order (DEC-084 §2):
  a village needs a simple way for everyone who volunteers — Feuerwehr,
  Kirchgemeinde, Verein, the neighbour organising a Dorffest — to get a
  date in front of the people it concerns, quickly → nobody there wants to
  buy an app or build a website nobody looks at → therefore the community
  calendar is free and stays free, and running your own is priced as a
  licence rather than as a project. The price string is read from
  `@schafe-vorm-fenster/offerings`, never typed (TS-006 D10).
- **What the block may not argue:** that the price follows from what the
  village or the founder can afford, or that the absence of a salesperson
  explains anything. The direction is the need, not the constraint
  (DEC-084 §2). Any figure for the village's size is content, in the
  artefact — about 280 inhabitants, not a number this spec restates.
- **The block carries the page's primary CTA** (D1): one
  `data-cta="primary"` targeting the contact section of this page.
- The honorary-mayor sentence is a **claim with a proof slot**, backed by
  `founder-former-volunteer-mayor` (`usage_rights: cleared`). It is the
  one inline proof outside the stream.
- The founder photo comes from `@schafe-vorm-fenster/people`; a photo not
  depicting what the copy claims carries *"Nicht motivgenau · Platzhalter"*.

### D4 — The live module is deleted [FIXED: DEC-084 §3]

**This page carries no counter module and no live module at all.** The id
is kept so the deletion is visible rather than silent.

The module asked for two figures. One of them — a count of active places —
has no upstream field: `/api/stats` carries no places-per-scope count
(Q-037). The other, years in operation, is not live. Built from the
figures that *are* available it becomes a static traction claim, which
`WEB-F-041` and `TS-008-A10` forbid and which the preview shipped as a
defect. A rule that can only be satisfied by breaking another rule is not
satisfied.

So: `liveModules: []`, under the sender-surface exemption TS-006 D1 now
carries (DEC-084 §3). No year figure rendered as a module, no place count,
no badge, no "seit …" claim anywhere on the page. If a places-per-scope
count arrives upstream (Q-037), whether the trust surface wants a counter
is reopened as a question about evidence, not about compliance.

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
| Copy | names the gap in the visitor's own terms — the type gap at stage 0, the regional gap at stage ≥ 1 where the visitor's state has no cleared proof. Which of the two framings is spoken at which stage is [PROPOSED]; the sentence itself is copy, written under SRC-017 (DEC-083), and the v2.0 board carries the shape it should take |
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

### D8 — The newsletter is secondary, below the booking [FIXED: DEC-052 §4 as amended 2026-09-24, DEC-082, TS-006 D2]

It is an **argument block**: after Team, before the context band and the
closing CTA. **Secondary treatment, never the primary marker** — the
page's one primary is the booking in block 1 (D1), and the block sits
below every argument on the page. Mechanics are TS-016 D10.

**Its justification has been restated**, and the block stays. DEC-052 §4
permitted an inline signup here *because* this was the one page without
a conversion of its own; DEC-081 §6 spent that reason. The amendment of
2026-09-24 replaces it: **the two asks serve two readiness levels.**

| State the reader is in | Ask | Rung |
| --- | --- | --- |
| ready to talk | the booking | primary (D1) |
| still looking | the newsletter | secondary, here |

They do not compete, because they are not addressed to the same reader.
That is DEC-082's ladder — one primary, everything else beneath it — and
it is what lets the page carry a second ask without carrying a second
conversion declaration. The withdrawal option the old open point named
was considered by the owner and rejected.

**The block carries a named goal now.** `subscribe-to-newsletter`
(SRC-008); at the time of DEC-052 §4 the newsletter was not in the hub
model at all, which is why a placement could be decided without one.

**Two channels, WhatsApp preferred.** The signup offers e-mail **and**
WhatsApp, and a block that offers e-mail only does not satisfy the goal
(TS-016 D10). The WhatsApp route is a new capability whose receiving
side does not exist; what it needs is TS-016 D10 N1–N5, not this page's
to resolve.

**Nothing ships without a sending system.** No system is in operation
(TS-016 open points, Q-020 as answered in DEC-052 §4 as amended), so at
launch the block does not render — no form that posts nowhere, and no
click-to-chat link whose arriving message nothing records
(TS-016-A21). The page is complete without it: its primary conversion is
elsewhere.

### D9 — What is measured here, and what deliberately is not [FIXED: TS-012 D4/D7, TS-016 D12, DEC-081 §4]

Three goals can fire on a render of this page. **None of their firing
points is this page's own** — two belong to the standing contact section
and one to the newsletter block's mechanics (TS-016 D10/D12):

| Goal | Fires on | Counts |
| --- | --- | --- |
| `make-contact` | a click on any of the contact section's four rows, with the channel and `/ueber-uns` as the route | an intent |
| `request-product-briefing` | the same click, on row 1 only | an intent |
| `subscribe-to-newsletter` | the block's signup handover, either route — only once the block ships at all (D8) | an intent; the confirmation is not observable |

Row 1 carrying two goal ids on one click is a ladder, not a double
count (TS-016 D12); the two are different goals, and neither fires
twice.

**Everything this page owns stays unmeasured.** The primary CTA and the
closing CTA are in-page navigation into the section and emit nothing —
counting them would count one intent twice — and the archive link, the
team block and the context band emit nothing either. No ad-hoc "archive
opened" or "scrolled to team" event is added.

The page adds no event of its own to any of the three, and defines none:
the section is one component rendered by the layout, the newsletter
block's mechanics are TS-016's, and `/ueber-uns` appears in all three
payloads only as the route.

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
| TS-027-A1 | static | `page.meta.ts` of `/ueber-uns` matches D1: `focusJob` `understand-who-is-behind-it`, `primaryConversion` `request-product-briefing`, audiences non-empty and ordered, `liveModules` **empty** (the route is one of the three the TS-006 D1 exemption names), 7 proof slots. |
| TS-027-A2 | e2e | DOM order of the blocks is exactly D2, with the contact section after the closing CTA and the global footer last; exactly one photo section exists; no two photo sections are adjacent. No counter, no year figure and no place count renders anywhere on the page (D4). |
| TS-027-A3 | e2e | At 1280 × 800 the first viewport contains exactly one `h1`, the honorary-mayor claim with its proof element, and the primary CTA; the first proof element of the stream is reached within the second viewport height (≤ 1 further screen of scrolling). The criterion asserts the elements and their position, never their wording (DEC-083). |
| TS-027-A4 | e2e | The origin block contains the free-calendar promise and exactly one price token, and that token's value, currency and interval equal `@schafe-vorm-fenster/offerings`. No sentence in the block derives the price from affordability and none mentions a salesperson (DEC-084 §2); no figure for the village's size is hard-coded in page or component source. |
| TS-027-A5 | e2e | The stream renders at most 7 elements; every rendered proof id resolves to an element with `usage_rights: cleared`; no `unverified` id appears anywhere in the served HTML. |
| TS-027-A6 | e2e | Exactly one empty slot is visible. It shows the hatch, a label and one sentence; it contains no image; it is unchanged 5 s after load; it is present in the accessibility tree with its text; it carries no animation. |
| TS-027-A7 | integration | Fixture with one cleared `type: testimonial` element: the reserved slot is filled and **no** empty slot renders. Fixture with none: 6 filled + 1 empty, and the 7th position is not backfilled by another type. |
| TS-027-A8 | e2e | The archive block has exactly one outgoing link, target `/ueber-uns/archiv`, and zero list entries, thumbnails or counts. |
| TS-027-A9 | e2e | Every person in `@schafe-vorm-fenster/people` appears once, in a 4:5 media box; a person without a portrait shows the "Foto gesucht" surface — never an empty box, never omitted. |
| TS-027-A10 | e2e | The newsletter block stands after the team block and before the context band, and carries no `data-cta="primary"`; the page contains exactly one `data-cta="primary"`, in block 1, resolving to this page's contact section; the last block is the closing CTA with the same goal id, target and label, and the contact section follows it (TS-006-A17). |
| TS-027-A11 | e2e | Stage 0 and stage 1 (geo set) renders have identical block order and both contain the empty slot; only the selection and order of the six filled elements differ. |
| TS-027-A12 | static | Structured data on the page: exactly one `Organization` reference by `@id`, zero `Person` nodes, zero `ItemList`. |
| TS-027-A13 | integration | Loading the page, clicking the archive link, and clicking the primary or the closing CTA emit no conversion event. On the contact section's first action row, exactly one `request-product-briefing` **and** exactly one `make-contact` are emitted, both carrying `/ueber-uns` as the route; on rows 2–4, exactly one `make-contact` with the row's channel and no `request-product-briefing`. No goal id is emitted twice for one click. |
| TS-027-A16 | integration | Where the newsletter block renders, its signup handover emits exactly one `subscribe-to-newsletter` with `/ueber-uns` as the route, and the block offers both the WhatsApp and the e-mail route (TS-016-A11). Where no sending system exists, the block does not render at all and emits nothing (TS-016-A21). |
| TS-027-A14 | e2e | No layout shift from late content: hero, proof cards and portraits declare `ratio-hero`, `ratio-proof`, `ratio-portrait` before data arrives; measured CLS on this page is ≤ 0.02. |
| TS-027-A15 | manual | Photo honesty: every photograph either depicts what its copy claims, or carries the badge "Nicht motivgenau · Platzhalter"; every missing photo is the "Foto gesucht" surface. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-017 (`/ueber-uns`: focus job "understand who is behind it", booking as its primary conversion, repeated in the closing block) | D1 (manifest, `primaryConversion: request-product-briefing`) · D2 (module order) · D3 (origin argument and the primary CTA) · D4 (no live module) · D5 (empty proof slot) · D6 (archive link) · D7 (team) · D8 (newsletter) · D9, D10 · A1–A15 |

## Open points

- **The five testimonials are unverified**, so the empty slot is permanent
  until clearance is on record. Intended behaviour, not a defect — but it
  should be a conscious launch decision. Addressee: jan-henrik (owner of
  `@schafe-vorm-fenster/proof`).
- ~~**SRC-003 names no live module here**, while TS-006 D1 requires one.~~
  **Closed by DEC-084 §3.** The counter module is deleted and the sender
  surfaces are exempt: the places figure has no upstream field (Q-037) and
  the years figure is not live, so the only buildable module here would be
  the static traction claim WEB-F-041 forbids. What remains open is one
  level up — whether SRC-001's compliance check mandates a live element on
  every page, recorded as an open point on TS-006 (IA owner).
- ~~**Headline punctuation:** v1.0 has a comma, the v2.0 board a full
  stop.~~ **Void.** There is no headline in this spec to punctuate: the
  fixed h1 is released (DEC-083 §5, DEC-036 amendment) and the sentence is
  written in the content phase under SRC-017.
- ~~**DEC-052 §4's reason for the inline newsletter is spent.** It
  permitted the block here because this was the one page without a
  conversion of its own; the page now has one (DEC-081 §6).~~ **Closed
  2026-09-24 by the amendment to DEC-052 §4.** The owner restated the
  justification rather than withdrawing the block: the two asks serve
  two readiness levels — ready to talk books, still looking subscribes —
  which is DEC-082's ladder. Placement and treatment are unchanged, the
  primary stays the booking, and D8 now carries the new reason.
- **Empty-slot framing has two variants** (missing type vs. missing
  region); which is spoken at which stage is [PROPOSED] in D5. The
  sentences themselves are copy. Addressee: content.
- **Q-020 gates the newsletter block — and it is not a question any
  more, it is a delivery.** DEC-051 decided *which* system (envoy);
  **no sending system is in operation**, and the widget's date is
  UNKNOWN. If none exists at launch, D8 does not ship. The WhatsApp
  route needs three things that exist nowhere (TS-016 D10 N3–N5).
  Addressee: envoy/ops.
- ~~**TS-006 D6's merge of band and closing block is [PROPOSED]**; this
  page is one of the two depending on it.~~ **No longer this page's
  question.** With a conversion of its own it renders band *then* closing
  CTA like every other page; the merge now concerns `/ueber-uns/archiv`
  alone (TS-028).
- **Audience ID mapping for "funders"** — `institutions`, `counties`, or
  both, and in which order. D1 proposes both. Addressee: owner of
  `@schafe-vorm-fenster/audiences`.
- **The page shows people but emits no `Person` node.** Whether
  `Organization.founder` should be added is a TS-011 question. Addressee:
  owner of TS-011.

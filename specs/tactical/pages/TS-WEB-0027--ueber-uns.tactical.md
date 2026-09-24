---
artefact: tactical-spec
id: TS-WEB-0027
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0017]
sources: [SRC-0001, SRC-0002, SRC-0003, SRC-0014]
decisions: [DEC-0036, DEC-0042, DEC-0048, DEC-0051, DEC-0052, DEC-0056, DEC-0081, DEC-0082, DEC-0083, DEC-0084]
---

# TS-WEB-0027 — `/ueber-uns`, the Trust Surface

## Purpose

The one page that speaks **about us** rather than to the visitor. Its focus
job is *understand who is behind it*, and since DEC-0081 §6 it carries a
conversion of its own: **the booking**. A reader who has just finished
reading about the sender is at the closest thing this site has to a sales
conversation, and the page pushes toward a conversation rather than toward
more content (FUN-WEB-0017, SRC-0003 §"Who we are").

It is read by people doing due diligence — a Landrat, a journalist, a
funder — who **scan rather than read**. Module order and acceptance
criteria are written for scanning, not narrative.

Not restated here: block order, context band, closing block, the CTA
ladder and the standing contact section → TS-WEB-0006 D2/D3/D6 · routes →
TS-WEB-0004 · proof
selection, ordering and this focus job's weight profile → TS-WEB-0005 D5/D6,
count **seven** per DEC-0048 · rendering → TS-WEB-0009 · the newsletter form →
TS-WEB-0016 D10 · analytics → TS-WEB-0012 D4 · structured data → TS-WEB-0011 D4 ·
components, photo surface, badges, ratios, page rhythm →
`concept/website-design-system.md`.

## Determinations

### D1 — Page manifest [FIXED: SRC-0003, FUN-WEB-0017, TS-WEB-0006 D1; audience IDs PROPOSED]

| Field | Value |
| --- | --- |
| `focusJob` | `understand-who-is-behind-it` |
| `primaryConversion` | `request-product-briefing` (DEC-0081 §6) — **unchanged by the 2026-09-24 amendment to DEC-0052 §4** — one `data-cta="primary"` above the fold, targeting this page's contact section; the outbound appointment link is the section's first row, and the event fires there (TS-WEB-0016 D7/D12) |
| `equalWeightConversion` | — |
| `audiences` | `municipalities, institutions, counties, actors, rural-residents` — SRC-0003's "1 municipalities and funders · 2 everyone" resolved against `@schafe-vorm-fenster/audiences` [PROPOSED] |
| `liveModules` | `[]` — the sender-surface exemption of TS-WEB-0006 D1 (DEC-0084 §3). The operating-counter module is deleted; see D4 |
| `proofSlots` | one stream of 7, one of them type-reserved (D5) |

### D2 — Module order is a scanning order [FIXED: SRC-0003 structure; sequence within block 2 PROPOSED]

| # | Block | Type | Carries |
| --- | --- | --- | --- |
| 1 | Origin | photo surface, `ratio-hero`, ink gradient | founder photo · h1 · the village argument (D3) · the primary CTA into the contact section |
| 2 | Proof stream | colour, cards at `ratio-proof` | 7 elements incl. the one empty slot (D5) |
| 3 | Archive | colour, tight | exactly one link to `/ueber-uns/archiv` (D6) |
| 4 | Team | colour, portraits at `ratio-portrait` | profiles from `@schafe-vorm-fenster/people` (D7) |
| 5 | Newsletter | colour, secondary treatment | inline signup (D8) |
| 6 | Context band | colour `paper` | the three non-focus jobs (TS-WEB-0006 D5) |
| 7 | Closing CTA | colour `paper` | the booking again — same goal, target and label as block 1 (TS-WEB-0006 D6) |
| — | Contact section | fixed ground, standing surface | rendered by the layout below block 7; the booking's outbound row lives here (TS-WEB-0006 D2, DEC-0081) |

Rationale: identity, then evidence, then people — a scanner gets *who,
where, why this shape* in the first screen and the first proof element in
the second. The counter block that used to stand between them is gone
(D4), which shortens the distance to the evidence rather than lengthening
it. The merged band-and-closing-block shape of TS-WEB-0006 D6 no longer applies
here: the page has a conversion, so it repeats it.

Narrative order (founder → team → proof) is rejected: it
delays the evidence a due-diligence reader came for. Page rhythm: block 1
is the only photo section; the stream's images are cards **inside** a
colour section, so no two photo sections stand in a row.

### D3 — The origin is the argument [FIXED: SRC-0003, DEC-0084; wording is copy, DEC-0083]

- **The block carries the page's `h1`**, and it is the one place where the
  distinctive voice of this sender surface lives — not the route
  (DEC-0036 §3 as amended). What the `h1` must achieve: name the sender and
  where the work is done, concretely enough that a due-diligence reader
  knows what kind of organisation this is before she scrolls. **What it
  says is copy**, written in `content/pages/**` under SRC-0017 (CG-020's
  budget, CG-033's truth rule). No spec states it, and the earlier fixed
  headline is released (DEC-0083 §5) — it was rejected as literally untrue,
  the service running in a data centre.
- The body states the **village argument**, in this order (DEC-0084 §2):
  a village needs a simple way for everyone who volunteers — Feuerwehr,
  Kirchgemeinde, Verein, the neighbour organising a Dorffest — to get a
  date in front of the people it concerns, quickly → nobody there wants to
  buy an app or build a website nobody looks at → therefore the community
  calendar is free and stays free, and running your own is priced as a
  licence rather than as a project. The price string is read from
  `@schafe-vorm-fenster/offerings`, never typed (TS-WEB-0006 D10).
- **What the block may not argue:** that the price follows from what the
  village or the founder can afford, or that the absence of a salesperson
  explains anything. The direction is the need, not the constraint
  (DEC-0084 §2). Any figure for the village's size is content, in the
  artefact — about 280 inhabitants, not a number this spec restates.
- **The block carries the page's primary CTA** (D1): one
  `data-cta="primary"` targeting the contact section of this page.
- The honorary-mayor sentence is a **claim with a proof slot**, backed by
  `founder-former-volunteer-mayor` (`usage_rights: cleared`). It is the
  one inline proof outside the stream.
- The founder photo comes from `@schafe-vorm-fenster/people`; a photo not
  depicting what the copy claims carries *"Nicht motivgenau · Platzhalter"*.

### D4 — The live module is deleted [FIXED: DEC-0084 §3]

**This page carries no counter module and no live module at all.** The id
is kept so the deletion is visible rather than silent.

The module asked for two figures. One of them — a count of active places —
has no upstream field: `/api/stats` carries no places-per-scope count
(Q-0037). The other, years in operation, is not live. Built from the
figures that *are* available it becomes a static traction claim, which
`FUN-WEB-0041` and `TS-WEB-0008-A10` forbid and which the preview shipped as a
defect. A rule that can only be satisfied by breaking another rule is not
satisfied.

So: `liveModules: []`, under the sender-surface exemption TS-WEB-0006 D1 now
carries (DEC-0084 §3). No year figure rendered as a module, no place count,
no badge, no "seit …" claim anywhere on the page. If a places-per-scope
count arrives upstream (Q-0037), whether the trust surface wants a counter
is reopened as a question about evidence, not about compliance.

### D5 — The visible empty slot [FIXED: SRC-0001 §4, SRC-0003; mechanics PROPOSED]

The sharpest element of this page. A claim without cleared proof is
**weakened, never propped up** — so the gap is rendered, not hidden.

| Question | Determination |
| --- | --- |
| What is reserved | one slot of the seven is type-reserved for `type: testimonial` — the voices of publishers and mayors |
| When it appears | whenever the pool holds no `usage_rights: cleared` element of the reserved type after TS-WEB-0005's clearance hard filter. **Today it always appears**: all five testimonials in `@schafe-vorm-fenster/proof` are `unverified` |
| Backfill | never. The slot is not handed to the next-highest scorer of another type; the stream renders 6 filled + 1 empty |
| Count | at most **one** empty slot is ever visible (SRC-0003). Further gaps shorten the stream below seven instead of adding a second empty slot |
| Look | the placeholder hatch of the design system (`repeating-linear-gradient` of `surface-2`/`line`) at `ratio-proof`, with a label badge and one sentence naming what is missing |
| Not a skeleton | a skeleton is transitional and is replaced; this is terminal. It **does not animate** and is identical before and after hydration |
| Copy | names the gap in the visitor's own terms — the type gap at stage 0, the regional gap at stage ≥ 1 where the visitor's state has no cleared proof. Which of the two framings is spoken at which stage is [PROPOSED]; the sentence itself is copy, written under SRC-0017 (DEC-0083), and the v2.0 board carries the shape it should take |
| Accessibility | real content, not decoration: it is in the accessibility tree with its label and sentence, never `aria-hidden` |
| Stage invariance | present at every stage; rotation (TS-WEB-0005 D7) never removes it |

### D6 — The archive is a link, not a preview [FIXED: SRC-0003 §"Archive", TS-WEB-0011 D3]

The archive block contains exactly **one** link to `/ueber-uns/archiv`
through the route facade and **zero** entry teasers, counts or thumbnails.
The archive exists once, for people who look for it; previewing it here
would turn the stream back into the list the IA rejects.

### D7 — Team [FIXED: SRC-0003, DEC-0042]

Profiles, roles and portraits are read from
`@schafe-vorm-fenster/people`; nothing about a person is written into
website copy. Portraits use `ratio-portrait` (4:5). A person whose folder
carries no usable portrait gets the *"Foto gesucht"* hatch — the person is
never omitted and the box is never left blank.

### D8 — The newsletter is secondary, below the booking [FIXED: DEC-0052 §4 as amended 2026-09-24, DEC-0082, TS-WEB-0006 D2]

It is an **argument block**: after Team, before the context band and the
closing CTA. **Secondary treatment, never the primary marker** — the
page's one primary is the booking in block 1 (D1), and the block sits
below every argument on the page. Mechanics are TS-WEB-0016 D10.

**Its justification has been restated**, and the block stays. DEC-0052 §4
permitted an inline signup here *because* this was the one page without
a conversion of its own; DEC-0081 §6 spent that reason. The amendment of
2026-09-24 replaces it: **the two asks serve two readiness levels.**

| State the reader is in | Ask | Rung |
| --- | --- | --- |
| ready to talk | the booking | primary (D1) |
| still looking | the newsletter | secondary, here |

They do not compete, because they are not addressed to the same reader.
That is DEC-0082's ladder — one primary, everything else beneath it — and
it is what lets the page carry a second ask without carrying a second
conversion declaration. The withdrawal option the old open point named
was considered by the owner and rejected.

**The block carries a named goal now.** `subscribe-to-newsletter`
(SRC-0008); at the time of DEC-0052 §4 the newsletter was not in the hub
model at all, which is why a placement could be decided without one.

**Two channels, WhatsApp preferred.** The signup offers e-mail **and**
WhatsApp, and a block that offers e-mail only does not satisfy the goal
(TS-WEB-0016 D10). The WhatsApp route is a new capability whose receiving
side does not exist; what it needs is TS-WEB-0016 D10 N1–N5, not this page's
to resolve.

**Nothing ships without a sending system.** No system is in operation
(TS-WEB-0016 open points, Q-0020 as answered in DEC-0052 §4 as amended), so at
launch the block does not render — no form that posts nowhere, and no
click-to-chat link whose arriving message nothing records
(TS-WEB-0016-A21). The page is complete without it: its primary conversion is
elsewhere.

### D9 — What is measured here, and what deliberately is not [FIXED: TS-WEB-0012 D4/D7, TS-WEB-0016 D12, DEC-0081 §4]

Three goals can fire on a render of this page. **None of their firing
points is this page's own** — two belong to the standing contact section
and one to the newsletter block's mechanics (TS-WEB-0016 D10/D12):

| Goal | Fires on | Counts |
| --- | --- | --- |
| `make-contact` | a click on any of the contact section's four rows, with the channel and `/ueber-uns` as the route | an intent |
| `request-product-briefing` | the same click, on row 1 only | an intent |
| `subscribe-to-newsletter` | the block's signup handover, either route — only once the block ships at all (D8) | an intent; the confirmation is not observable |

Row 1 carrying two goal ids on one click is a ladder, not a double
count (TS-WEB-0016 D12); the two are different goals, and neither fires
twice.

**Everything this page owns stays unmeasured.** The primary CTA and the
closing CTA are in-page navigation into the section and emit nothing —
counting them would count one intent twice — and the archive link, the
team block and the context band emit nothing either. No ad-hoc "archive
opened" or "scrolled to team" event is added.

The page adds no event of its own to any of the three, and defines none:
the section is one component rendered by the layout, the newsletter
block's mechanics are TS-WEB-0016's, and `/ueber-uns` appears in all three
payloads only as the route.

### D10 — Structured data stays at `Organization` [FIXED: TS-WEB-0011 D4]

Exactly one `Organization` node, referenced by `@id`, never a second full
node. **No `Person` nodes**, although the page shows people — TS-WEB-0011 D4
assigns types per page type and its A5 checks "no more".

## Free for the generator

- [FREE] Copy, throughout, except the h1 of D3 and the price source — the
  content phase writes it.
- [FREE] Visual design inside every block, within the design system and
  TS-WEB-0002.
- [FREE] Whether the stream is a grid or a scroller, as long as the empty
  slot sits in the reading order the engine gives it, and whether origin
  and counters are one component or two.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0027-A1 | static | `page.meta.ts` of `/ueber-uns` matches D1: `focusJob` `understand-who-is-behind-it`, `primaryConversion` `request-product-briefing`, audiences non-empty and ordered, `liveModules` **empty** (the route is one of the three the TS-WEB-0006 D1 exemption names), 7 proof slots. |
| TS-WEB-0027-A2 | e2e | DOM order of the blocks is exactly D2, with the contact section after the closing CTA and the global footer last; exactly one photo section exists; no two photo sections are adjacent. No counter, no year figure and no place count renders anywhere on the page (D4). |
| TS-WEB-0027-A3 | e2e | At 1280 × 800 the first viewport contains exactly one `h1`, the honorary-mayor claim with its proof element, and the primary CTA; the first proof element of the stream is reached within the second viewport height (≤ 1 further screen of scrolling). The criterion asserts the elements and their position, never their wording (DEC-0083). |
| TS-WEB-0027-A4 | e2e | The origin block contains the free-calendar promise and exactly one price token, and that token's value, currency and interval equal `@schafe-vorm-fenster/offerings`. No sentence in the block derives the price from affordability and none mentions a salesperson (DEC-0084 §2); no figure for the village's size is hard-coded in page or component source. |
| TS-WEB-0027-A5 | e2e | The stream renders at most 7 elements; every rendered proof id resolves to an element with `usage_rights: cleared`; no `unverified` id appears anywhere in the served HTML. |
| TS-WEB-0027-A6 | e2e | Exactly one empty slot is visible. It shows the hatch, a label and one sentence; it contains no image; it is unchanged 5 s after load; it is present in the accessibility tree with its text; it carries no animation. |
| TS-WEB-0027-A7 | integration | Fixture with one cleared `type: testimonial` element: the reserved slot is filled and **no** empty slot renders. Fixture with none: 6 filled + 1 empty, and the 7th position is not backfilled by another type. |
| TS-WEB-0027-A8 | e2e | The archive block has exactly one outgoing link, target `/ueber-uns/archiv`, and zero list entries, thumbnails or counts. |
| TS-WEB-0027-A9 | e2e | Every person in `@schafe-vorm-fenster/people` appears once, in a 4:5 media box; a person without a portrait shows the "Foto gesucht" surface — never an empty box, never omitted. |
| TS-WEB-0027-A10 | e2e | The newsletter block stands after the team block and before the context band, and carries no `data-cta="primary"`; the page contains exactly one `data-cta="primary"`, in block 1, resolving to this page's contact section; the last block is the closing CTA with the same goal id, target and label, and the contact section follows it (TS-WEB-0006-A17). |
| TS-WEB-0027-A11 | e2e | Stage 0 and stage 1 (geo set) renders have identical block order and both contain the empty slot; only the selection and order of the six filled elements differ. |
| TS-WEB-0027-A12 | static | Structured data on the page: exactly one `Organization` reference by `@id`, zero `Person` nodes, zero `ItemList`. |
| TS-WEB-0027-A13 | integration | Loading the page, clicking the archive link, and clicking the primary or the closing CTA emit no conversion event. On the contact section's first action row, exactly one `request-product-briefing` **and** exactly one `make-contact` are emitted, both carrying `/ueber-uns` as the route; on rows 2–4, exactly one `make-contact` with the row's channel and no `request-product-briefing`. No goal id is emitted twice for one click. |
| TS-WEB-0027-A16 | integration | Where the newsletter block renders, its signup handover emits exactly one `subscribe-to-newsletter` with `/ueber-uns` as the route, and the block offers both the WhatsApp and the e-mail route (TS-WEB-0016-A11). Where no sending system exists, the block does not render at all and emits nothing (TS-WEB-0016-A21). |
| TS-WEB-0027-A14 | e2e | No layout shift from late content: hero, proof cards and portraits declare `ratio-hero`, `ratio-proof`, `ratio-portrait` before data arrives; measured CLS on this page is ≤ 0.02. |
| TS-WEB-0027-A15 | manual | Photo honesty: every photograph either depicts what its copy claims, or carries the badge "Nicht motivgenau · Platzhalter"; every missing photo is the "Foto gesucht" surface. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0017 (`/ueber-uns`: focus job "understand who is behind it", booking as its primary conversion, repeated in the closing block) | D1 (manifest, `primaryConversion: request-product-briefing`) · D2 (module order) · D3 (origin argument and the primary CTA) · D4 (no live module) · D5 (empty proof slot) · D6 (archive link) · D7 (team) · D8 (newsletter) · D9, D10 · A1–A15 |

## Open points

- **The five testimonials are unverified**, so the empty slot is permanent
  until clearance is on record. Intended behaviour, not a defect — but it
  should be a conscious launch decision. Addressee: jan-henrik (owner of
  `@schafe-vorm-fenster/proof`).
- ~~**SRC-0003 names no live module here**, while TS-WEB-0006 D1 requires one.~~
  **Closed by DEC-0084 §3.** The counter module is deleted and the sender
  surfaces are exempt: the places figure has no upstream field (Q-0037) and
  the years figure is not live, so the only buildable module here would be
  the static traction claim FUN-WEB-0041 forbids. What remains open is one
  level up — whether SRC-0001's compliance check mandates a live element on
  every page, recorded as an open point on TS-WEB-0006 (IA owner).
- ~~**Headline punctuation:** v1.0 has a comma, the v2.0 board a full
  stop.~~ **Void.** There is no headline in this spec to punctuate: the
  fixed h1 is released (DEC-0083 §5, DEC-0036 amendment) and the sentence is
  written in the content phase under SRC-0017.
- ~~**DEC-0052 §4's reason for the inline newsletter is spent.** It
  permitted the block here because this was the one page without a
  conversion of its own; the page now has one (DEC-0081 §6).~~ **Closed
  2026-09-24 by the amendment to DEC-0052 §4.** The owner restated the
  justification rather than withdrawing the block: the two asks serve
  two readiness levels — ready to talk books, still looking subscribes —
  which is DEC-0082's ladder. Placement and treatment are unchanged, the
  primary stays the booking, and D8 now carries the new reason.
- **Empty-slot framing has two variants** (missing type vs. missing
  region); which is spoken at which stage is [PROPOSED] in D5. The
  sentences themselves are copy. Addressee: content.
- **Q-0020 gates the newsletter block — and it is not a question any
  more, it is a delivery.** DEC-0051 decided *which* system (envoy);
  **no sending system is in operation**, and the widget's date is
  UNKNOWN. If none exists at launch, D8 does not ship. The WhatsApp
  route needs three things that exist nowhere (TS-WEB-0016 D10 N3–N5).
  Addressee: envoy/ops.
- ~~**TS-WEB-0006 D6's merge of band and closing block is [PROPOSED]**; this
  page is one of the two depending on it.~~ **No longer this page's
  question.** With a conversion of its own it renders band *then* closing
  CTA like every other page; the merge now concerns `/ueber-uns/archiv`
  alone (TS-WEB-0028).
- **Audience ID mapping for "funders"** — `institutions`, `counties`, or
  both, and in which order. D1 proposes both. Addressee: owner of
  `@schafe-vorm-fenster/audiences`.
- **The page shows people but emits no `Person` node.** Whether
  `Organization.founder` should be added is a TS-WEB-0011 question. Addressee:
  owner of TS-WEB-0011.

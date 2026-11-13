---
id: dein-kalender-de
page_id: TS-WEB-0024
route: "/dein-kalender"
seo:
  "/dein-kalender":
    title: "A calendar for your website"
    description: "Your calendar on your website. Nobody types dates anymore. See the real calendar, configure your own view, or book a briefing appointment first."
    provenance: generated
content_type: section
status: approved
reviewed_by: "Owner (Jan-Henrik Hempel), DEC-0222"
reviewed_at: "2026-11-13"
locale: en
sources:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#community-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar"
  - "@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"
  - "@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow"
  - "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow"
  - "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"
  - "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"
  - "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "mixed — 7 sourced (slot 5 now carries the three real, verbatim proof quotes in translation, clearance pending; slot 6 carries a sourced operations sentence), 1 generated demo addition left (slot 6 AI-use placeholder — no hub record documents AI handling of publisher data); EN translation of content/pages/dein-kalender/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-WEB-0024"
schema_note: "see content/pages/home/de.md — same TS-WEB-0007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #19 — the trust block's AI-use sentence is still withheld: no hub record documents how AI handles publisher data. The operations sentence is resolved and sourced (people#jan-henrik-hempel, proof#in-operation-since-2018)"
  - "Clearance pending — the three proof quotes in slot 5 (wendt-rubkow, zschiesche-gross-kiesow, eichler-wasserschloss-quilow) carry `usage_rights: unverified` (Q-0014). They render in the protected preview only; go-live needs written clearance per quote or the card drops"
price_source_note: >-
  Every price token below (480, per year, net; portalize-enterprise
  on request) must render from the offerings package at build time,
  never as a typed literal (TS-WEB-0024 D8) — this file records the source
  value for the page developer, it is not the rendering mechanism.
images:
  - id: dein-kalender-hero
    slot: dein-kalender-1-focus
    ratio: hero
    provenance: real
    source: >-
      Wikimedia Commons, File:Lübbenow, Amt Gemeinde Uckerland.jpg —
      https://commons.wikimedia.org/wiki/File:L%C3%BCbbenow,_Amt_Gemeinde_Uckerland.jpg —
      Eigenaufnahme von Schafe vorm Fenster (Commons-Konto „Schafevormfenster", own work), Mai 2025,
      3604×2229. Nachweis hinter dem ©-Zeichen am Bild.
    alt: The municipal office of Uckerland in Lübbenow, a long building on the village street.
    licence: CC0 1.0
    credit: "Schafe vorm Fenster, CC0 1.0, via Wikimedia Commons"
    credit_title: "Lübbenow, Amt Gemeinde Uckerland"
    credit_url: "https://commons.wikimedia.org/wiki/File:L%C3%BCbbenow,_Amt_Gemeinde_Uckerland.jpg"
    focal:
      x: 45
      "y": 55
    status: real
    file: /images/real/dein-kalender-hero.avif
    width: 800
    height: 900
    wide_file: /images/real/dein-kalender-hero-wide.webp
    wide_width: 1400
    wide_height: 600
  - id: dein-kalender-proof-rubkow
    slot: dein-kalender-5-proof-demo
    ratio: proof
    provenance: real
    source: >-
      @schafe-vorm-fenster/proof@0.3.5#wendt-rubkow — Testimonial von Holger Wendt, Bürgermeister in
      Rubkow. `usage_rights: unverified`, kein Bildasset vorhanden. Ein Beleg wird nie mit einer
      Rendition bebildert (DEC-0068 Regel 3, `src/generated/placeholders/README.md`); bis zur
      Freigabe zeigt die Karte die Fläche „Foto gesucht“ (TS-WEB-0024-A13).
    alt: Holger Wendt outside the council office in Rubkow.
    status: needed
  - id: dein-kalender-proof-gross-kiesow
    slot: dein-kalender-5-proof-demo
    ratio: proof
    provenance: real
    source: >-
      @schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow — Testimonial von Dr. A. Zschiesche,
      Bürgermeisterin Groß Kiesow. `usage_rights: unverified`, kein Bildasset vorhanden. Gleiche
      Regel wie bei `dein-kalender-proof-rubkow`.
    alt: Dr. A. Zschiesche outside the council office in Groß Kiesow.
    status: needed
  - id: dein-kalender-proof-quilow
    slot: dein-kalender-5-proof-demo
    ratio: proof
    provenance: real
    source: >-
      @schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow — Testimonial von Uwe Eichler,
      Wasserschloss Quilow. `usage_rights: unverified`, kein Bildasset vorhanden. Gleiche Regel wie
      bei `dein-kalender-proof-rubkow`.
    alt: Uwe Eichler outside Wasserschloss Quilow.
    status: needed
---

# Your calendar (`/dein-kalender`)

"Portalize" appears on this page **never** (TS-WEB-0024 D7, DEC-0205). No local `local-advertising` anywhere on the page
(TS-WEB-0024 D11). Two equally weighted conversions: order (Pulse, primary)
and book a briefing (secondary, same visibility) — Pulse appears only
in the focus block (TS-WEB-0024 D3).

## Slot 1 — Focus block

<!-- id: dein-kalender-1-focus; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: approved -->

**Headline:** Your calendar on your website. Nobody types dates anymore.

**CTA label (primary, Pulse):** Order the calendar → `/dein-kalender/bestellen`

**CTA label (equally weighted, secondary):** Book a briefing → `#kontakt`, this page's contact section

<!-- note: authoring note from here on, not copy — the passage quotes forbidden terms in order to forbid them (DEC-0142 §1) -->

Source: `headline` from `municipalities--portalize-calendar` — "Our
calendar is current again — and nobody here maintains it."

The headline is the one the 2026-09-22 review asks for (`/dein-kalender`
→ hero). The old one broke CG-001 (three possessives for one thought;
"your name" promises something nobody receives) and CG-036 ("in the
office" as the only addressee).

## Slot 2 — Contrast: today and with your calendar (4 rows)

<!-- id: dein-kalender-2-contrast; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar", "@schafe-vorm-fenster/messaging@0.1.0#municipalities--portalize-calendar"]; status: approved -->

**Heading:** Why a dates module of your own rarely works

| Today | With your calendar |
| --- | --- |
| A dates module in the CMS is a website project that ends up in an empty database. | Your view shows dates that are already there and shared with others. |
| Keeping it current needs someone the administration doesn't have. | Local groups maintain their own dates. Your view stays current along the way. |
| Hardly any group takes on a second login and a second form. | Local groups publish the way they already do: flyer, own calendar, own website. |
| Your calendar ends at your own jurisdiction; people's interest doesn't. | You choose places or a whole county. You draw the boundary yourself. |

<!-- note: authoring note from here on, not copy — the passage quotes forbidden terms in order to forbid them (DEC-0142 §1) -->

**Version of issue #159 (2026-11-12, DEC-0203), a draft translation.** The
heading and the four right-hand sentences translate the owner's German
wording from the issue and wait for the owner's review (`state/open.md`
row 295). The German heading is itself marked "suggestion, still open" there.

Four rows, derived from `portalize-calendar` (`summary`, category) and
the `pains[]`/`gains[]`/`relievers[]` fields of
`municipalities--portalize-calendar` — not copied verbatim, no fifth
row for an extra feature (TS-WEB-0024 D4).

Column labels "Today" / "With your calendar" per
`plan/reviews/2026-09-23/decisions.md` line 18 (DEC-0106 §2): the
comparison column names no product. The earlier heading "Who misses
your event today" announced people where the section shows a comparison
(issue #51); it belongs to `/mitmachen`. Row 4 no longer
names a postcode — the copy guide's avoid list (DEC-0079).

## Slot 3 — Embedding demo

<!-- id: dein-kalender-3-embed-demo; content_type: live-module-frame; provenance: sourced; derived_from: [ia]; status: approved -->

**Heading:** A real calendar from the municipality of Rothenklempenow

Here is what is coming up in Rothenklempenow, Dorotheenwalde, Glashütte and Mewegen over the
next few weeks.

One sentence instead of two (2026-09-22 review, "How it works"; issue #163,
DEC-0206, DEC-0213): the intro shares no word stem with the heading, and the
transition "This is what it looks like once it sits on your site:" is gone, as
it is no text level of its own. The place names come from
`src/lib/embed/portalize.ts` (`DEIN_KALENDER_SHOWCASE`), not from the dictation.

## Slot 3b — What it holds is up to you (configuration block)

<!-- id: dein-kalender-3b-embed-config; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar", ia]; status: approved -->

**Heading:** What it holds is up to you.

You embed the calendar on your website and it appears in your design: without a Schafe vorm Fenster logo, matching the fonts and colours of your site. You decide which dates appear, whether they arrive by WhatsApp, from a Google Calendar or from a club's website.

**Settings heading:** What you can set

| Setting | Core | Example | Chips |
| --- | --- | --- | --- |
| Places | You choose single places or whole municipalities. | A town's cultural society shows only the town area. Dates from neighbouring places do not appear. | Town area, Districts, ~~Neighbouring places~~ |
| Organisers | You show only the organisers that belong to you. | A foundation shows only its partners and the projects from its own funding programmes. | Partners, Grantees, ~~Everyone else~~ |
| Categories | You choose which kind of dates you carry. | A cultural calendar shows culture, tourism, education and health, but no everyday supply. A community calendar shows everything. | Culture, Tourism, Education, ~~Everyday supply~~ |
| Window | You decide how far ahead the calendar looks. | | |
| Presentation | The calendar takes your design and adapts to your site. Anyone who wants to can set the details. It also works without that. | | |
| Updates | The calendar is current on every page view. To keep it fast we cache the dates for a few minutes. | | |

**Link label:** All settings in detail

<!-- note: from here to the next field an authoring note, not copy — the four deviation lists quote forbidden terms in order to forbid them (src/lib/content/blocks.ts, DEC-0142) -->

Kicker, headings, benefit sentence and the six setting sentences are the
ones in `Design -. Portalize Einstellungen 1.png` /
`Design -. Portalize Einstellungen 2.png` and the 2026-09-22 review
("What it holds is up to you"). The deviations, each with a source:

- **No radius** under Places — `plan/reviews/2026-09-23/spec-impact.md`
  line 315: "Umkreis" is in no offering record and collides with
  `TS-WEB-0026-A2` and `TS-WEB-0005 D1`.
- **Bold "Example:"** in front of the example sentences (#162, DEC-0204).
  `setting-row` renders it; the artifact does not carry the word.
- **Source-to-target flow removed** (#162, DEC-0204): the channels are in the
  lead; the lime band is gone.
- **Window without example and chips**, carrying the "being checked"
  marker instead (review: "we have to look at what Portalize actually
  does"). The marker is the placeholder badge, not copy.

The "All settings in detail" link points at the Portalize config repo. Its
URL is in no record of this repository (`state/open.md`) — without a
configured URL the link does not render.

## Slot 4 — Three tiers under one question

<!-- id: dein-kalender-4-tiers; content_type: tier; provenance: sourced; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#community-calendar", "@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar", "@schafe-vorm-fenster/offerings@0.3.5#portalize-enterprise"]; status: approved -->

**Heading:** Three ways to your calendar

**Framing:** The price depends on one thing only: where the calendar is going to sit.

Kicker ("What it costs", from the site vocabulary), heading and framing
line are the ones in `Design - Preis Section 1.png` and the 2026-09-22
review ("What it costs"). The earlier question heading falls under CG-005
(a section title is a statement, not a question) and was never the spec's
business anyway (TS-WEB-0024 D6, DEC-0083 §2).

### Tier 1 — in the village calendar

**Tier kicker:** In the village calendar

**Title:** The village calendar / for your place

**CTA (secondary):** Sign up now → `/take-part/register`

Offering id: `community-calendar`; price from the package (`interval: forever`,
`price_status: fixed`) — rendered as a figure with the explanation "free,
permanently", the number read from the package (DEC-0205).
The two CTAs became one with DEC-0082 §4 (TS-WEB-0024 D6). The title's line
break is the ` / ` in the copy and is fixed (DEC-0205).

### Tier 2 — on your own website

**Tier kicker:** On your website

**Title:** Your own / calendar

**CTA (primary on light):** Order the calendar → `/your-calendar/order`

<!-- note: from here an authoring note, not copy — it records the removal of the product-name sentence (DEC-0142 §1) -->

Offering id: `portalize-calendar`; price 480/EUR/year, `vat: excluded` —
read from the package, never typed (TS-WEB-0024 D8), explained as "per year,
excl. VAT". The sentence that named the product is gone (DEC-0205). The
tier's briefing link is gone: it is reachable through the contact section,
and every tier carries exactly one CTA (TS-WEB-0024 D6, DEC-0082 §4).

### Tier 3 — as a regional calendar

**Tier kicker:** As a regional calendar

**Title:** A calendar for / your region

**CTA (secondary):** Request a calendar → `/your-region`

<!-- note: author note from here, not copy — the paragraph names the internal €4,000 figure in order to forbid it (DEC-0142 §1, DEC-0145) -->

Offering id: `portalize-enterprise`, `price_status: on-request` — never
a number, never "from", never an order of magnitude (TS-WEB-0024 D8). The
internal €4,000 figure from the package must never appear anywhere on this
page. "On request" is as large as the other prices, explained as "depending
on area and scope" (DEC-0205). The CTA target is unchanged, `/deine-region`.

## Slot 4b — Checks per tier (draft, unconfirmed)

<!-- id: dein-kalender-4-tiers-checks-demo; content_type: tier; provenance: generated; derived_from: []; status: approved; demo: true -->

**Checks per tier (draft, not yet confirmed by the owner):**

| Tier | Check 1 | Check 2 | Check 3 |
| --- | --- | --- | --- |
| community-calendar | The calendar for your place and around it | Publish dates, over WhatsApp too | For clubs, municipalities, traders, everyone |
| portalize-calendar | Under your name, in your design | With your places, categories and organisers | Dates arrive by themselves |
| portalize-enterprise | For regions, foundations or counties | Also as a topic calendar, for culture for example | Map view from January 2027 |

The nine lines are the ones in `Design - Preis Section 1.png` and
`Design - Preis Section 2.png`. The owner has not confirmed them, so the
slot is `provenance: generated; demo: true` with a row in `state/open.md`
(DEC-0068, DEC-0131). One deviation from the draft: "plus a map view"
becomes "map view from January 2027" — the map view is announced with its
date, never listed as a shipped feature (DEC-0061,
`plan/reviews/2026-09-23/decisions.md` line 19).

Tier 3 follows the wording of owner issue #165 since DEC-0205. Checked against
the hub (`@schafe-vorm-fenster/offerings@0.3.5`): "foundations" is carried by
`portalize-enterprise` (audience "Landesbehörde, Stiftung, or network"), "map
view from January 2027" by DEC-0061. Deviation: "Also as a topic calendar, for
culture for example" — the hub lists no topic calendar as a feature of
`portalize-enterprise` (only "cultural categories" as a filter); the claim
stands on the owner's instruction, DEM-0078 against the source.

## Slot 5 — Proof (3 elements, with images)

<!-- id: dein-kalender-5-proof; content_type: proof-card; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/offerings@0.3.5#portalize-calendar"]; status: approved -->

Pool: the four proof ids `portalize-calendar` references
(`kulturlandbuero-broellin`, `eichler-wasserschloss-quilow`,
`zschiesche-gross-kiesow`, `wendt-rubkow`) — all `unverified` today
(Q-0014). For production this slot stays empty until a clearance
exists. In the protected preview the slot below shows three of those
elements verbatim, clearance open; the clearance is tracked in the
frontmatter and in `state/open.md`, not on the page.

<!-- id: dein-kalender-5-proof-demo; content_type: proof-card; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#wendt-rubkow", "@schafe-vorm-fenster/proof@0.3.5#zschiesche-gross-kiesow", "@schafe-vorm-fenster/proof@0.3.5#eichler-wasserschloss-quilow"]; status: approved -->

**Proof cards (real quotes, clearance pending):** Three voices from
`portalize-calendar`'s pool, verbatim from the proof records:

1. "The self-managed and automated provision of the date data reduces our municipality's workload." — Holger Wendt, mayor of Rubkow
2. "For this project I see our rural population, and mobile traders too, as the winners." — Dr A. Zschiesche, mayor of Groß Kiesow
3. "The service helps make what's on offer more visible and easier to find across a thinly settled area." — Uwe Eichler, Wasserschloss Quilow

**Link:** View in the archive

None of the three records names an article with a link — the hub's proof
schema carries no such field
(`plan/reviews/2026-09-23/spec-impact.md:99-102`). The three quotes
therefore stand here as proof cards and not as quote cards: "a quote
without a named source and a working link does not ship"
(`concept/website-design-system.md` §Quote card, CG-028). A source alone
is not enough for that: the quote card needs two things — the source as a
link at the end of the line **and** a three-part attribution. The shape
that reaches a quote card is
`"…" — <Name>, <Role>, <Organisation> — [<Publication>, "<Title>"](https://…)`.
The three lines above carry only `Who, Where`, and
`parseDemoProofElement` splits the attribution at the first `, ` — in
"Holger Wendt, mayor of Rubkow" the role stands alone and `quoteAuthor`
returns `null`. A link on its own therefore changes **nothing** on these
three lines; whoever adds a source writes the attribution with it
(DEC-0143 §3, `state/open.md` row 284).

All three records carry `usage_rights: unverified` (Q-0014). The cards
therefore stand in the protected preview, not on a public surface:
before go-live there is a written clearance per quote, or the card
goes (`state/open.md`). The quotes are German originals, translated
here; the German file carries the source wording. Since #160 (DEC-0209)
the translation of Holger Wendt's quote keeps his sentence as it stands
(subject, tense, no added "ourselves"). With no cleared
image right, every card shows a calm brand-colour surface,
never a borrowed photo.

## Slot 6 — Trust block: data protection, operations, AI

<!-- id: dein-kalender-6-trust; content_type: section; provenance: mixed; derived_from: [ia, "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel", "@schafe-vorm-fenster/proof@0.3.5#in-operation-since-2018"]; status: approved -->

**Heading:** How your data is handled here

<!-- note: author note, not copy — the transition "Which leaves the question of who you are actually giving your data to." is gone (DEC-0206, DEC-0213): no text level of its own, and it repeats "data" from the heading. -->

**Data protection:** No tracking cookies, no persistent user identifier, no consent banner, no third parties beyond those named in our privacy policy. → [`/rechtliches#datenschutz`](/rechtliches#datenschutz), [`/rechtliches#auftragsverarbeitung`](/rechtliches#auftragsverarbeitung)

**Operations:** Behind the service is Jan-Henrik Hempel, founder and technical lead; he lives in Schlatkow in Vorpommern. The village calendar has been running since 2018 — not a pilot, not a prototype.

**AI use (missing, not generated):** *No sentence — no hub record documents how AI handles publisher data.*

The data-protection paragraph rests on TS-WEB-0013 D1/D2. The operations
sentence rests on `people@0.3.6#jan-henrik-hempel` (role, place of
residence) and `proof@0.3.5#in-operation-since-2018` (`cleared`), which
satisfies TS-WEB-0024-A19: it names a hub record. Legal form and operating
address live in the imprint and in no hub record, so they stay out of
this block. The AI statement stays unpublished until a hub record
exists (`state/open.md` #19).

<!-- id: dein-kalender-6-trust-demo; content_type: section; provenance: generated; derived_from: []; status: approved; demo: true -->

**Interim sentence on AI use (prototype, `demo: true` in the frontmatter):**
For the full prototype impression, this view shows one sentence instead
of an empty area. The marking lives in the frontmatter and in
`state/open.md`, not in the visible copy (Jan, 2026-09-18):

**AI use:** Publisher data is only processed for the calendar function itself, never for training AI models.

The sentence carries no confirmed technical claim yet and is replaced once
a hub record closes the gap (`state/open.md`, row 19). The operations
sentence has a source as of this pass and sits in the slot above.

## Slot 7 — Closing CTA

<!-- source_note: The heading repeats what slot 3 already shows (the calendar runs as soon as the code sits on the page) and claims no lead time: nothing cleared backs "next week". -->
<!-- id: dein-kalender-7-closing; content_type: closing-cta; provenance: sourced; derived_from: [ia]; status: approved -->

**Closing heading:** Your calendar is running as soon as the code sits on your page.

**CTA label (identical to the focus block, primary):** Order the calendar

The page used to end on a button with no sentence above it. Block 4
repeats the same conversion as the focus block — same goal, same label —
without Pulse. The quiet second way under it is gone: the appointment URL
occurs exactly once on this page, in the first action row of the contact
section directly below this block (DEC-0081 §3, TS-WEB-0016 D7,
TS-WEB-0024-A15).

## Verification — local advertising

<!-- id: dein-kalender-9-no-advertising; content_type: section; provenance: sourced; derived_from: [ia]; status: approved -->

A negative check, not a text slot: `local-advertising` (`promotion:
withheld`) must occur zero times on this page — no sentence, no field,
no CTA, no link (TS-WEB-0024 D11).

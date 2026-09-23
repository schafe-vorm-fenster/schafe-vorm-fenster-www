# Spec impact of the 2026-09-22 preview review

Derived from `2026-09-22 Review SVF Preview Website.md` (473 lines, 14 design
drafts) by three cross-checks: review → STRICT specs, review → go-to-market-os
(tone, offerings, proof), designs → design guide and brand tokens. This file
names the **global** themes, what the specs say today, what changes where, and
which decisions are still Jan's. It does not carry the per-page items — those
stay in the review.

Order of work follows `specs/README.md` rule 4: a concept document in
`go-to-market-os` changes first, the website spec cites it afterwards. Every
new requirement needs a `DEC-###` to reach S3. Next free ids: **DEC-079**,
**Q-071**.

---

## 0. Two findings that frame everything

**There is no wording rule set anywhere.** Tone exists as brand adjectives
(`brand-identity/tone-of-voice.md`, still framing "Sie" as normal) and as a
personal voice profile scoped to direct correspondence. The website specs carry
one copy requirement (`WEB-F-008`) and one structural determination
(`TS-006 D7`), and D7 *requires* the question-opener the review rejects. The
rule "positive first" the review cites as existing is written nowhere. Most of
theme A is therefore new text, not a correction.

**The place-search premise in the specs is inverted.** `WEB-F-046`, `TS-008 D7`,
`Q-025` and six page specs assume "ZIP works, name search is blocked". The
geo-api measurement was right (`community/search` has no name parameter, still
true on `main` 3.1.3), but the conclusion was wrong: the website searches by
**name** over the covered-community index and ZIP is not wanted as a product
feature at all. Decided by Jan 2026-09-23. See theme E.

---

## A. Copy rules — one global rule set

**Review demands.** Self-contained sections (no "Beides gibt es", no "der Name
der Firma"); section titles as positive statements; questions only when
addressed to the reader and answered in the next sentence; concrete people with
roles ("die Nachbarn, das Nachbardorf, die Neuen") instead of "die Leute" or
abstractions; the benefit, not the concept ("eure Veranstaltungen auf eurer
Website", not "ein Kalender auf der Website"); short words, short sentences, no
word doubling; headings casual but not flat ("Wo das herkommt", "Wer das schon
macht" rejected) and no AI-flavoured abstractions ("Warum das zählt"); no
internal meta lines on a public page ("Presse- und Auftrittshistorie
2018–2026"); nothing literally untrue ("betrieben aus einem Dorf"); "im Amt" is
never the only addressee (Vereine, Stiftungen); `du` to the person, `ihr` to
the organisation, both informal.

**Today.** `WEB-F-008` (scene, one mechanism, no generic claims) · `TS-006 D7`
(question opener **required**; generic-claims lint list "PROPOSED — does not
exist") · `TS-019-A6`, `TS-022-A4` assert the question mark · `DEC-066` (one
register, `du`) says nothing about number · `TS-007 D5/D9/D12` (schema
`describe()`/`max()`, glossary as production input) · `glossary.md` has no
use/avoid columns · `WEB-C-012` (municipalities and institutions not
separated).

**Change.**
- `go-to-market-os/concept/website-communication-principles.concept.md`: new
  principle "Wie wir schreiben" carrying the rules above; rewrite §1a's
  question-opener rule; §1b gains "du an die Person, ihr an die Organisation".
- `brand-identity/tone-of-voice.md`: word-level rules and anti-patterns
  (banned words, doubling, heading register); retire the formal-register
  framing.
- Website: new `specs/requirements/functional/content-and-copy.req.md`
  (`WEB-F-###` rows citing the principle); `TS-006 D7` rewritten (statement
  titles, reader-directed questions only, self-contained blocks) with A8 and
  the page-level opener criteria; `TS-007 D5` `describe()` per field type,
  `D9`/`D12` a real use/avoid list per locale in `glossary.md` and a
  `check:content` row; one `DEC-079` "global copy rules".

---

## B. Proof and social proof

**Review demands.** Two sections with different sources: "Wer das schon macht"
= customer proofs (Lebendiges Lehre, VHS, Kulturlandbüro, Wolgast, Ivenack,
Stolpe), "Was andere sagen" = press and appearances (Nordkurier, NØRD Award,
IHK podcast, RAA portrait). Proof is persuasion, not a report ("wir haben
gewonnen", patronage named). Deliberate type mix (local success · award ·
customer · partner). Quotes verbatim with the concrete article as source.
Proofs vary across pages, never identical wording. Attribution corrected
(Stiftung Lebendiges Lehre, not Gemeinde; "Volkshochschulen in
Vorpommern-Greifswald"). Quote + source as one designed element.

**Today.** One relevance-scored stream per surface (`TS-005 D5–D7`, `DEC-048`
counts 3/5/7, `TS-027 D2` "one stream of 7") — no type split, no type spread,
no cross-page de-duplication. `WEB-F-036` proof-slot rule. Proof schema has no
`quote`, `quote_author`, `source_url`, no `geo` on any of 21 files, no class
field to drive a customer/press split. Clearance: only NØRD and the founder
proof are `cleared`; Lehre, VHS, Kulturlandbüro are `unverified` → currently
unpublishable under `WEB-F-033`. `lehre-lelender.proof.md` says "Eine
Gemeinde betreibt…" (wrong per review). Wolgast, Ivenack, Stolpe have no
record. Bio facts differ (proof: moved 2008, Kulturverein 2014; review: 2011,
"mitgegründet").

**Change.**
- Hub: proof schema gains `quote`, `quote_author`, `quote_date`, `source_url`
  (or a required `media_echo` ref), `geo`, `proof_class` (customer | press |
  award | partner); records corrected and created; clearances requested for
  the four the review wants on the page.
- Website: `WEB-F-031` gains type spread; new requirement for the two proof
  sections; `TS-005 D5/D6` partition on `proof_class`, `D7` cross-page
  rotation; `DEC-048` amended to counts **per section**; `TS-027 D2/D5`,
  `TS-019 D4`, `TS-022 D6`, `TS-024 D9` block lists; `TS-007 D5`
  `describe()` for `proof-card` ("state the win"). Quote card component
  (theme H).

---

## C. Conversion architecture

**Review demands.** Every explanatory module ends in its own CTA (WhatsApp
chat, register, register website). Hooks from home scenes into the deeper
page. Funnel discipline: `/ueber-uns` should push toward a booking, not open
content. Two-CTA hero for order vs. consult is acceptable. "Beratungstermin
buchen" leads to an on-site contact section, not an external Google link with
a disclaimer. No generic contact form. One contact section (video appointment
· WhatsApp · phone · mail · portrait), reusable, one fixed colour
(decided 2026-09-23). Pricing: "Kalender bestellen" is the pink primary at the
price section; the region tier gets "Beratungstermin buchen" plus contact.

**Today.** `WEB-F-003`/`TS-006 D3` one primary per page (scene CTAs secondary
allowed) · `TS-022 D4` has no per-path CTA · `WEB-F-093`/`DEC-010`/`TS-016 D7`
booking is an outbound Google link, event on click (`TS-016 D12`) ·
`WEB-F-090`/`DEC-009`/`TS-016 D1` contact = envoy lead form in the footer ·
`WEB-F-017`/`TS-027 D1` `/ueber-uns` has `primaryConversion: null` · `TS-006`
open point "equal weight vs visually unrivalled" · `TS-024` open point 6
"Pulse at tier 2" · `TS-024 D6` tier 3 = quiet link to `/deine-region` ·
`request-product-briefing` goal names video, WhatsApp, e-mail; **phone appears
nowhere**.

**Change.**
- New rule "every explanatory module carries one CTA at secondary treatment,
  pointing at the deeper page's primary" (`WEB-F-###`, `TS-006 D3`, `TS-022
  D4` rows, `TS-019 D3a`).
- `DEC-079+` "the contact section replaces the contact form and hosts the
  booking" superseding `DEC-009`/`DEC-010`; `WEB-F-090/093/021`, `TS-016
  D1/D6/D7/D10/D12`, `TS-024 D3/A15`, `TS-025 D5`, `TS-026`; measurement
  point moves to the section's booking click.
- Close `TS-006`'s open point with a DEC (two-CTA hero for order vs consult)
  and `TS-024` open point 6 (Pulse at tier 2, hero keeps `primary` marker →
  needs the "one primary" wording to allow one *repeat*).
- `TS-024 D6` tier 3 CTA = booking into the contact section.
- Decision needed: does `/ueber-uns` get a primary conversion (booking)? That
  supersedes `WEB-F-017` and `TS-027 D1/D8/A10`.
- Add phone as a contact channel in the hub goal and channel matrix.

---

## D. The explanation module (3 steps)

**Review demands.** A fixed component: one big ordinal, one title, three
graphics (carousel states, next one cropped in, active step highlighted),
three step lines — bold core + normal detail, each single-line on a phone —
the whole module plus lines within one phone screen, a CTA per module, image
briefs per graphic, hard text-length limits. Reused on home and `/mitmachen`.
Step order for calendar and website paths swapped (use as usual → register
once → runs automatically).

**Today.** `TS-022 D4`: "three steps is a working assumption, not a rule",
render form and step count **FREE**. Design system: one motion only, "no
looping animation", skeletons don't animate. `Q-044` lists the component as
missing. Step order derives from the hub offering.

**Change.** `TS-022 D4` fixed structure + `A5`; `TS-019 D3a` (scene block
becomes the module or coexists — decide); `TS-007 D5` `max()` per line and
an `image_brief` field; design system: component definition + motion
exception with `prefers-reduced-motion` fallback; `contracts/design-system-
contract.md` §1/§3; hub offering `community-calendar` step order.

---

## E. Place search — by name, no ZIP

**Decided (Jan, 2026-09-23).** The website searches places by **name**; ZIP is
not offered. Source of names is an implementation detail (today the committed
covered-community index from the public calendar site; later a geo-api name
endpoint — geo-api #130, `Q-025` stays as the upstream demand but no longer
blocks). Autosuggest overlay: 3–4 rows, "Ort (Gemeinde)", matching place and
municipality names, overlay so nothing shifts. Geolocation button is already
specified (`WEB-F-053`, `TS-010 D5`).

**Cascade.** `WEB-F-046` rewritten; `TS-008 D2/D7` + `A14` (the "ZIP hint"
criterion inverts); `TS-019` open point, `TS-020`, `TS-021`, `TS-023`,
`TS-025 D3` interim text removed; `Q-025` re-scoped; design system "Search
field" gains the result overlay; contract states; `DEC-079+` "place search is
by name".

**Open.** `DEC-024` says the search covers all of Germany. The index covers
the ~1,760 covered communities only; an uncovered name gets no suggestion and
must still reach `/dein-ort/starten`. Options: (1) Germany-wide name search
via geo-api (needs the endpoint + token, index as fallback); (2) covered-only
suggestions now, free text without a hit routes to `starten`. Proposal: fix
(2) as current state, (1) as target with the geo-api requirement.

---

## F. Live data as illustration

**Review demands.** The list under the hero is a curated selection (the
flyer-selection logic from `entre`), not simply the next dates; geo-localised
and swapped on search (already so). Lists on the website must look like the
app's calendar. `/mitmachen`'s example section becomes source → calendar
pairs (Abfallkalender site · Google Kalender · Ratsinformationssystem ·
WhatsApp photo), one per path. The Portalize embed shows a sensible place
with sensible data. A coverage gap is turned into activation ("Fehlt deine
Veranstaltung?") rather than hidden behind a big counter.

**Today.** `TS-008 D1` = "next 3 dates"; no curation for live events
(`TS-005` scores proof only). No rule binds the website's event row to the
app's rendering — and the new designs drop the category badge the guide
requires (theme H, D-19). `TS-022 D5` live example with "never an uncovered
place" rule, purpose questioned by the review. `Q-026`/`TS-024` open point 2
carry the embed config. `WEB-F-045`/`TS-008 D4` empty state as conversion
occasion (place-level only).

**Change.** `TS-008 D1/D3` curation determination (source: `entre` selection
logic, register as a source); `TS-022 D5` purpose + the pairs module; design
system "Event row" parity rule with the app; `Q-026` sharpened ("sensible
place"); `WEB-F-045` extended to corpus gaps as hook.

---

## G. Hero and photo system

**Review demands.** Neutral (black-based) scrim instead of dark green, max
0.72, multi-stop, text on the photo, soft text shadow — for all heroes.
Crop rules: motif position matters (sky-heavy villages get covered by the
fade); per-motif crops or focal points. Header controls (logo, calendar,
burger) need contrast on any photo — blur behind them. Motif rules per page
(villages with activity on `/`; culture/community houses on `/dein-kalender`;
not dark or sad). Home claim more concrete than "Was ist bei dir los?".

**Today.** Design system "Photo surface": ink gradient, 0.82–0.86 mid, 0.96
bottom, violet for the municipal path; "no drop shadows". `WEB-Q-011`
contrast measured against photo + gradient (S3, `DEC-056`). `DEC-077` two
renditions per hero (aspect, not motif). `DEC-059` keeps the home hero's
structure. No header-over-photo treatment specified; no blur primitive.

**Change.** Design system "Photo surface" → measured-floor rule (composite ≥
4.5:1 behind body, ≥ 3:1 behind display, measured per photo) instead of fixed
stops, scrim from `ink`/`dark.paper` tokens not `rgba(0,0,0)`; `DEC-056`
amendment; `DEC-077` gains focal-point/crop guidance for real photos;
`WEB-Q-011` re-verification at 0.72; header treatment decided (blur primitive
vs solid wells — `TS-003` cost if blur); imagery motif rules per page in
`brand-identity/imagery.md`.

---

## H. Design system and tokens — alignment and change requests

**Finding.** The 14 drafts follow the website guide and the built site; the
**token package is the outlier** in several places. Colours are on-palette
(P3 screenshots shift every sample; mapped back). The pink CTA is
`himbeere-600` with paper text, 5.84:1 — compliant.

**Designs must follow the guide (13 items).** Black scrim → ink-based scrim;
no text shadow (or a rule change, theme G); 2 px lime rules between price
tiers → 1 px `line`; body copy set in `muted` instead of `text-2`; lime-500
icon wells; chip outline; kicker below the 15 px floor; event rows without
month and without category; desaturated grey carousel neighbours (the review
itself rejects that look); dashed placeholders with "or browse files" chrome
instead of the hatch + "Foto gesucht" badge; portrait as 1:1 circle vs
`ratio-portrait` 4:5; run-in labels below 15 px.

**Change requests to `@schafe-vorm-fenster/brand-design`.**
1. Scrim tokens derived from `ink`/`dark.paper` with an alpha ladder.
2. Archive / "old world" pair: ground `#FBF1DC` (already a literal in
   `app/styles/brand.css` with a "reconcile" comment) and an ink that clears
   4.5:1 **with margin** — `#9A6300` measures exactly 4.50:1.
3. `button.treatment`: tokens say weighted-base 6 px + 3 px edge; guide,
   site and all drafts use `radius.pill`, `border: 0`. Record the web variant
   or retire weighted-base.
4. `logo.*` names four files that all sit in `logos/legacy/` (never
   shipped); only `Schafe-vorm-Fenster_Logo_V2.1.svg` ships.
5. The shipped SVG contains `fill="white"` and `#222222` — neither is a token.
6. `logo.radius`: `logos/README.md` says `radius-lg` (8 px), guide and drafts
   use a full circle. One rule.
7. Mono display size role (step ordinals ~48 px, prices ~54 px).
8. One label tracking value (token 0.06em / guide 0.08em / drafts ~0.1em).
9. `font.size.label` → 0.9375rem, or record the website override.
10. `color.category` (5 keys, PROVISIONAL) vs guide category colours (6 rows)
    — two taxonomies; plus event-status roles `neu` / `verschoben` /
    `abgesagt` (all pass contrast, none named).
11. Chip "excluded" state (strikethrough) and a non-tappable `tag` size.
12. Hairline token for lime grounds (`line` vanishes on lime-100).

**Change requests to the website design system (`concept/website-design-
system.md`).** Re-measure the contrast table (seven published ratios are
wrong; `#9A6300` on `#FBF1DC` claims 6.0, is 4.50); resolve §Neutrals ↔
§Icons on icon wells; define "kicker (bare)"; define the "old world / sepia"
section type (neutral icons, not red crosses); define the two-line action row
(contact), the event-status badge, the explain module, the search overlay,
the quote card, the transparent overlay header; add a rhythm exception for
the fixed-colour contact section; define "per screen" for "exactly one
himbeere element"; settle pricing-tier rhythm (three paper tiers = rows in
one section?); decide the scrim ladder (theme G).

---

## I. Offerings — what must be sharpened in the hub

| Claim on the drafts / in the review | Status in `packages/market/offerings` |
| --- | --- |
| Dorfkalender 0 € for everyone, permanently | covered — but the review's "einige Dorfkalender kostenfrei" contradicts it; it is all, always |
| Publishing free | covered with a caveat the copy drops: after one-time registration and verification |
| 480 €/yr + VAT, "unter eurem Namen, in eurem Design, mit euren Orten, Kategorien und Akteuren", fills itself, two lines to embed | covered |
| Region "Anfrage — nach Größe" | **contradicted**: one fixed figure quoted once, explicitly not size-scaled |
| Region "zusätzlich mit Kartenansicht" | scope covered, **shipping unverified** (`DEC-061` says Jan 2027) |
| Region "eigene Registrierung unter eurem Namen" | **missing** in any offering record |
| Website as source "bisher nur für einige Webseiten" | covered (alpha) |
| Ratsinformationssystem / WordPress plugin / VHS or waste databases as free path 03 | **on the wrong side of a price boundary**: connecting an organisation's own database is the paid `custom-data-integration` add-on. The free/paid boundary is not stated for the website |
| Configuration: Orte / Gemeinden / **Umkreis** | "Umkreis" not in the offering; also collides with `TS-026-A2` (no radius wording) and `TS-005 D1` (no distance tier) |
| Configuration: Veranstalter, Kategorien | covered |
| Configuration: Zeitraum | missing — review marks it "wird geprüft" |
| Darstellung adapts, no SvF logo, pro styling optional | covered / implied |
| Aktualisierung per page view, minutes of cache | product fact, needs a Portalize source before it goes on a page |
| Product name ("Portalize" / "das Produkt") | open point recorded; `DEC-052 §1` (named once) causes "das Produkt" |
| Consult via video appointment | goal exists; phone channel missing everywhere |
| Wolgast as running example | no proof, no partner record |

**Change.** Offering records for `portalize-enterprise` (pricing wording, map
status, white-label registration), `community-calendar` (free-after-
registration, path 03 boundary vs `custom-data-integration`, step order),
`portalize-calendar` (configuration facts incl. Zeitraum and Umkreis, once
verified against the Portalize config repo), `people`/`proof` (Wolgast),
`goals` (phone). Website: `TS-024 D2` new configuration block, `D6/D6a/D7`,
`A8/A9/A10`; `TS-026`; `TS-006 D10`; `WEB-C-014`/`DEC-052 §1` reopened for
the naming decision.

---

## J. Navigation, chrome, footer

- **"Warum wir"** is the header label in `TS-004 D4`, derived from the IA in
  the hub. Rename ("Über uns" recommended; "Wer dahintersteckt" as the richer
  alternative) in the IA first, then `TS-004 D4`, then the job registry.
  `WEB-F-002` ("labels name jobs") needs a carve-out for the sender surface.
- **Context band** as a menu-like element with a half-sentence per target:
  sharpens `TS-006 D5` (currently "an offer, not a menu", one entry, no
  blurb) and needs a blurb field in `TS-007 D5`.
- **Language switch**: "Read this page in English" framing, current language
  not rendered as a control — turn the `TS-001 D5` FREE into a determination.
- **Newsletter on `/`**: the review keeps the section, `TS-019 D3` has no
  such block — add it, with benefit copy (features, offers, stories).
- **Legal footer** visually separated; **favicon** follows the logo radius
  rule (brand-design).

---

## K. Facts, numbers, fixed strings

- Schlatkow has ~280 inhabitants, not 400 — hard-coded in `TS-027 D3` and
  `DEC-066`. The causal chain in D3 ("cannot afford a service that needs a
  salesperson") is rejected as an argument; re-derive, not just renumber.
- The `/ueber-uns` h1 "Gebaut in einem Dorf, betrieben aus einem Dorf." is
  FIXED by `DEC-036 §3` and asserted by `TS-027-A3`; the review rejects it
  (untrue: it runs in a cloud). Amend the DEC.
- "Seit 2018, 120 Orte": static figures are already forbidden
  (`WEB-F-041`, `TS-008-A10`) — the preview shipped a defect. But `TS-027
  D4` *requires* a live module built from those figures with no upstream
  field for places; drop it, reopen `TS-027` open point 2.
- Founder biography: proof record says moved 2008, Kulturverein 2014; review
  says 2011, "mitgegründet", still in the Gemeindevertretung, 25 years IT.
  Reconcile in `people` before the portrait text is written.
- NØRD Award "handed over by the Latvian ambassador" appears in no record —
  needs a source. "80 Bewerbungen, Bitkom-Schirmherrschaft" are sourced.

---

## L. Section semantics — colour carries rhythm, not meaning (with one exception)

The review establishes: problem sections in a sepia "old world" look, solution
sections fresh (lime); grey-green on positive content is wrong; the contact
section keeps one fixed colour everywhere (the only meaning-bearing ground);
full-bleed images instead of framed pictures in beige sections; pricing
highlighted. Write this as a design-system rule (theme H) and as a
composition rule in `TS-006` so a generator cannot pick grounds freely.

---

## Decisions Jan owns (blocking, in order of reach)

1. **Search scope** — covered-only now + Germany-wide target (proposal), or
   Germany-wide from the start (requires geo-api name search).
2. **Free tier position** in the price section — first (IA, `TS-024 D6`,
   design draft) or last (review text).
3. **`/ueber-uns` conversion** — booking as primary (supersedes `WEB-F-017`,
   `TS-027 D1`) or stays without a primary.
4. **Hero scrim** — accept a measured contrast floor instead of the fixed
   0.96 ladder (enables the 0.72 design), and text shadow yes/no.
5. **Header contrast** — backdrop blur (new primitive, perf cost) or the
   solid wells the site has today.
6. **Product name** — keep "Portalize named once" or decide a new name.
7. **Region pricing wording** — "nach Größe" (then the offering changes) or
   fixed quote (then the draft changes); map view claim on or off.
8. **Path 03 boundary** — are Ratsinformationssystem / WordPress imports
   free, or the paid integration add-on?
9. **Category taxonomy** — tokens (5) or guide (6); and whether website event
   rows keep the category badge the drafts dropped.
10. **Explain-module animation** — exception to "no looping animation".

Everything else above is derivable and can be written without a decision.

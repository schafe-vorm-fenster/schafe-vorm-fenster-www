---
artefact: tactical-spec
id: TS-WEB-0028
kind: interaction
status: DRAFT
version: 0.1.0
implements: [FUN-WEB-0018, FUN-WEB-0037]
sources: [SRC-0001, SRC-0003, SRC-0008, SRC-0014]
decisions: [DEC-0013, DEC-0019, DEC-0022, DEC-0026, DEC-0056]
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-11T07:13:07+02:00"
---

# TS-WEB-0028 — Archive (`/ueber-uns/archiv`)

## Purpose

The full cleared record of external coverage, once. Focus job: understand
who is behind it. No conversion (FUN-WEB-0018). The only list-shaped page on
the site and deliberately not a destination — SRC-0001 §4 rejects
press-review and award-list pages as destinations, and this spec keeps that
rejection true while serving the two people who arrive on purpose: a
journalist checking a claim, a funder checking a track record. Both scan.

Composition TS-WEB-0006 · routes TS-WEB-0004 · proof data and clearance TS-WEB-0005 · content
and the build-time media-echo fetch TS-WEB-0007 · rendering TS-WEB-0009 · SEO and
structured data TS-WEB-0011 · events TS-WEB-0012 · components SRC-0014.

## Determinations

### D1 — Not a destination, and what that forbids [FIXED: SRC-0001 §4, SRC-0003#archive, FUN-WEB-0018]

| Aspect | Determination |
| --- | --- |
| Entry points | the closing link on `/ueber-uns`, the footer, direct links we hand to press. Not in the header navigation (TS-WEB-0004 D4), never teased from another page, never linked as proof |
| Conversion | `primaryConversion: null` in the page manifest (TS-WEB-0006 D1) → the closing block is the merged three-job offer (TS-WEB-0006 D6) |
| Forbidden here | own CTA, newsletter field, any form, hero photo surface, lead paragraph selling the record. A press contact, if wanted, is a plain `mailto` — a form would make this a funnel and pull it into TS-WEB-0016 scope |
| Events | none. TS-WEB-0012 D4 ships one event per conversion goal and this page has no goal, so nothing is emitted — not on filter use, not on outbound clicks. TS-WEB-0012 D7 forbids adding one for curiosity |

### D2 — Chronological, the one exception to FUN-WEB-0030 [FIXED: SRC-0003#archive; exception to TS-WEB-0005 D6]

Every other list obeys FUN-WEB-0030, which orders for *breadth*. This page is
read for *verification*, and a relevance order varies per segment and per
ISO week (TS-WEB-0005 D7/D8) — making "is that everything?" unanswerable and a
cited position unreproducible. So:

| Aspect | Determination |
| --- | --- |
| Order | `date` descending, newest first. Ties break by `id` ascending — the same tiebreak as TS-WEB-0005 D6, so the two orders stay comparable |
| Sort key | dates arrive at mixed precision (measured 2026-09-11 in `media-echo/verified/`: 3 year-only, 25 year-month, 3 full date). Normalise to the **first day of the stated precision** for sorting; display the stated precision verbatim. A day is never fabricated |
| Engine | the relevance engine is not called. The page passes no `{community, trait, job}` props, holds no ISO-week seed, has no segment variant — one build artefact for everyone (TS-WEB-0004 D6). Clearance (D3) still applies: it is a filter, not an ordering |

### D3 — Clearance is the only thing that removes an entry [FIXED: FUN-WEB-0033, TS-WEB-0005 D5, TS-WEB-0007 D7/D12]

An entry without `usage_rights: cleared` does not appear: not greyed, not
counted, not in the JSON-LD. Applied at generation, re-validated at build
(TS-WEB-0007 D12 check 4); a revocation empties the row on the next build (TS-WEB-0007
D13). An **absent** `usage_rights` is no clearance (TS-WEB-0007 D2) — blocking
today (Open points).

### D4 — The type filter [FIXED: DEC-0070]

| Aspect | Determination |
| --- | --- |
| Vocabulary | the hub's media-echo types, never a website-local list (FUN-WEB-0178, CON-WEB-0079). Labels are localized (TS-WEB-0007 D8); identifiers are not |
| Control | one row of chips (SRC-0014 badge/chip: radius 999, ≥ 40 px, tappable) plus *all*; multi-select, OR-combined, zero selected means all. **Only types with at least one cleared entry get a chip** — the control cannot offer a dead end |
| Multi-type entries | `type` is a list in the hub schema; an entry appears under every type it carries. Chip counts therefore sum above the row total, and the page never renders that sum |
| Mechanics | client-side over rows already present in the static HTML. No navigation, no refetch, no request of any kind |
| Ordering | filtering removes rows and never reorders them (D2) |
| Empty result | unreachable by construction — every chip has entries (row 2) and no filter can arrive from outside (D5). Implemented as a defensive render (an honest line naming the active filter plus *all*), never a zero-results error screen |
| Announcement | the visible row count sits in an `aria-live="polite"` region; focus stays on the pressed chip (TS-WEB-0002 D5) |

Measured stock (2026-09-11, 32 entries): `press` 15 · `award` 6 · `conference`
5 · `podcast`/`portrait`/`recognition`/`social-media` 1 each. `tv`, `video` and
the proof-package types have no entry here — Open points.

### D5 — The filter has no URL representation [FIXED: TS-WEB-0011 D9]

TS-WEB-0011 D9: a parameter changes what a page *shows*, never which page it
*is*, and the canonical strips parameters. A filtered archive is the same
page — no parameter, no hash route, no history entry; type combinations
would only mint a crawlable set that all canonicalises back here. Accepted:
a filtered view is neither shareable nor reload-proof, correct for a page
nobody bookmarks (D1). A `#typ-<type>` fragment was rejected — a scroll
target pretending to be a filter.

### D6 — Heavy media never ship [FIXED: TS-WEB-0003 D1/D8, DEC-0013, TS-WEB-0016 D9]

The stock holds artefacts the budget forbids anywhere: a 36 MB `.mp4`, a 25
MB `.mp3`, an 8 MB `.jpg`, several 5–15 MB PDFs — against ≤ 100 KB per image
and ≤ 50 KB compressed HTML (TS-WEB-0003 D1).

| Media on the source entry | What this page ships |
| --- | --- |
| image | one derived preview at `ratio-proof` (5:2), ≤ 100 KB, AVIF/WebP, served from our own origin (TS-WEB-0016 D9), box declared before load (TS-WEB-0003 D8) |
| video · audio · PDF · any hub-only asset | no player, no file, no embed, no download. A still or nothing, plus the outlet's own `url`; where the entry has none, the row carries no link. The hub package is private, and a link to a file the build did not ship is never rendered |
| none | text-only row. No "Foto gesucht" hatch — that surface is a conversion invitation (SRC-0014) and this page has no conversion (D1) |

At most one preview in the initial viewport, every other lazy and
async-decoded. No image here is the LCP element — that is the page heading
(text); TS-WEB-0003 D2 has no row for this route yet (Open points).

### D7 — What a row carries, and the year spine [FIXED: DEC-0070]

A row is the SRC-0014 **event row**, not a card: date at stated precision ·
original title in its source language (DEC-0026) · outlet · type badge(s) · one
localized context line (TS-WEB-0007 D8) · one outbound link naming source and
subject (TS-WEB-0016 D9). Two fixed row variants — with preview, without — each
declare their height, so neither varies with content (title clamps to two
lines, meta to one) nor shifts on image load. `h1` is the page, each **year**
an `h2`, a row title no heading: the outline is the year spine, which is what
a journalist scrolls. Container per TS-WEB-0011 D3 (`main > article` — the list
*is* the page). A build-time count of cleared rows is the record's length,
not a traction figure (Open points).

### D8 — Rendering, JS budget, no-JS [FIXED: TS-WEB-0004 D6, TS-WEB-0009 D3; budget PROPOSED]

Fully static from the build-time fetch: no island, no Suspense boundary, no
BFF call — outage-proof by construction (TS-WEB-0009 D3). The filter is the only
client component, ≤ 5 KB gzipped above the framework baseline, inside TS-WEB-0003
D4's route budget. Without JavaScript every cleared row renders, the chip row
**not displayed** (hidden until hydration), never dead.

### D9 — Structured data is not re-chosen here [FIXED: TS-WEB-0011 D4]

TS-WEB-0011 D4 already selects `ItemList` of `NewsArticle`/`CreativeWork`, the
**outlet** as `publisher`, `url` to the original. Two bindings this page owes
it: the JSON-LD comes from the same cleared, ordered row set as the visible
list, so they cannot disagree; and filtering never touches it.

## Free for the generator

- [FREE] Filter implementation technique, within D8's budget and D5's no-URL
  rule; year-grouping markup below D7's heading rule.
- [FREE] Preview-image derivation, within TS-WEB-0003's free scope; all wording —
  content phase (CON-WEB-0087).

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-WEB-0028-A1 | e2e | Open `/ueber-uns/archiv`: every row's date is ≤ the row above it; year `h2`s descend; the same order appears in two browser profiles with different simulated geolocation. |
| TS-WEB-0028-A2 | static | The route imports no module from `src/services/relevance/` and passes no segment props; the rendered HTML carries no ISO-week seed. |
| TS-WEB-0028-A3 | e2e | Every type chip yields ≥ 1 visible row; no chip produces zero rows; *all* restores the full row count shown at load. |
| TS-WEB-0028-A4 | e2e | Selecting two chips shows the union; an entry carrying both types appears exactly once. |
| TS-WEB-0028-A5 | e2e | Filtering changes no URL: the address bar is byte-identical before and after, and Back leaves the page rather than undoing a filter. |
| TS-WEB-0028-A6 | e2e | Filtering reorders nothing: the relative order of rows surviving a filter equals their order in the unfiltered list. |
| TS-WEB-0028-A7 | integration | An entry whose `usage_rights` is absent or not `cleared` appears in neither the HTML, nor any chip count, nor the row total, nor the JSON-LD. |
| TS-WEB-0028-A8 | tool | Page weight: document ≤ 50 KB compressed; every image response ≤ 100 KB; at most one image request before scroll; no request to any media host; no `<video>`, `<audio>` or `<iframe>` in the DOM. |
| TS-WEB-0028-A9 | e2e | With JavaScript disabled every cleared row renders and the chip row is not visible. |
| TS-WEB-0028-A10 | tool | JSON-LD parses as one `ItemList`; `itemListElement` count equals the unfiltered visible row count; each item's `publisher` is the outlet and `url` the original. The JSON-LD is byte-identical before and after filtering. |
| TS-WEB-0028-A11 | e2e | No conversion: the page contains no `<form>`, no primary CTA, no newsletter field; the last block is the three-job offer; the network log shows no analytics request beyond the pageview during filtering and outbound clicks. |
| TS-WEB-0028-A12 | e2e | Structure: heading outline is `h1` then year `h2`s with no skipped level; the row-count region is `aria-live="polite"` and announces on filter change; every chip is ≥ 40 px, keyboard-reachable, with visible focus. |
| TS-WEB-0028-A13 | tool | No layout shift from media: both row variants occupy their final height before images load; CLS measured over load plus three filter interactions stays < 0.1. |
| TS-WEB-0028-A14 | manual | Three sampled rows: the outbound link opens the original at the outlet, its link text names source and subject, and it carries `rel="noopener"` where it opens in a new tab. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| FUN-WEB-0018 (no conversion, list-shaped but not a destination) | D1, D7, D8 · A2, A9, A11, A12 |
| FUN-WEB-0037 (exists once, filterable by type, chronological) | D2–D6, D9 · A1, A3–A8, A10, A13, A14 |

## Open points

- **Blocking — no clearance field exists.** Measured 2026-09-11: 0 of 32
  files under `media-echo/verified/` carry `usage_rights`. A missing field
  is not an assertion (TS-WEB-0007 D2), so under FUN-WEB-0033 every entry is
  uncleared and this page renders empty. → **gtm** (sibling of Q-0019).
- **Scope of the record.** SRC-0003 says "every entry from the media echo",
  but `reference-case`, `testimonial`, `metric`, `partner` live in
  `@schafe-vorm-fenster/proof`. Media echo only is assumed here; widening
  changes D3, D4 and D9. → **jan-henrik / IA**.
- **Date precision is our convention.** D2's normalisation is the
  website's, not the hub's; confirm mixed precision stays. → **gtm**.
- **The archive row is not in the component set.** SRC-0014 specifies six
  components; D7's two variants are a seventh. Into Q-0044. → **design**.
- **Count line versus SRC-0001 §3.** D7 renders a count; §3 bans breadth
  asserted as a figure. Read here as a navigational affordance. → **decision
  point**. Likewise TS-WEB-0003 D2 has no LCP row for this route: add it there, or
  accept D6's declaration. → **spec work**.
- **Hub-only assets have no public home.** D6 drops slide decks; if any
  should be public they need an assets-api home and a clearance. → **gtm**.

---
id: DEC-0132
title: The trust surface books — the closing block is its one primary, the reserved proof place speaks again, and the second proof section has no cleared record to stand on
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

`/ueber-uns` shipped as the page `TS-WEB-0027` described before three amendments
landed on it. It declared `primaryConversion: null` and rendered zero
`data-cta`, carried an operating-counter section built from a live places figure
that has no upstream field, left the reserved seventh proof place silent, and
rendered the inline newsletter form.

Three decisions changed all of that, and the page did not follow them:
`DEC-0081 §6` gave the trust surface the **booking** as its own conversion;
`DEC-0082 amendment C` moved that primary into the **closing block** and made
this route the one named exception to `TS-WEB-0006 D3`'s fold clause;
`DEC-0084 §3` deleted the counter module and gave `liveModules: []` a named
exemption. The 2026-09-22 review added its own list: a released `h1`, the
village argument re-derived with the right number of inhabitants, the founder
portrait shown full width, the story told in several paragraphs with the quote
and its source as one element, a team block with one person in it, and the proof
split into press and customers.

This record holds the choices the specification left open and the places where
the task brief and the specification disagreed. It is written for `T-14`.

## Decision

### 1. The manifest declares the booking, and the closing block is the one primary

`page.meta.ts` reads `primaryConversion: request-product-briefing`, five
audiences in `D1`'s priority order, and `liveModules: []`. `PageFrame`'s
`repeat` closing block takes `marker: "primary"` and `hash: "kontakt"`, so the
page's one `data-cta="primary"` is the closing CTA and it resolves to
`/ueber-uns#kontakt` — this page's own contact section — through the route
facade. Its label is `contactSection.rows.appointment`, the same string the
section's first action row carries, so `TS-WEB-0006 D6`'s "same goal, same
target, same label" holds by construction rather than by review. The repeat rung
is empty, which is `DEC-0082 amendment C`'s own reading of `§1`.

`src/lib/pages/manifests.ts` adds `about` to `CONVERSION_MAP`'s
`request-product-briefing` row rather than to `MAP_DEVIATIONS`: a deviation row
says the manifest and the map disagree, and they do not — `SRC-0003`'s one-line
map simply predates `DEC-0081 §6`.

**No heading above the closing button.** Polish brief G-6 asks the block to end
on a promise; no sentence for one exists, the contact section's own head and
lead stand immediately below it, and writing one would be page copy nobody
ordered (working rule 4). The prop is omitted, not filled.

### 2. `D2`'s "block" is a beat; block 1 is two sections, and the proof leads the argument

`D2` lists seven blocks and `A2` asks for that order. Block 1 — "founder photo ·
h1 · the village argument" — cannot be one `<section>`: at 390 px the hero
photograph, three paragraphs of argument, a 4:5 portrait and the proof card
measure well past the 1 270 px a section may be
(`e2e/section-budget.spec.ts`, polish brief G-4, whose own remedy is "a section
that wants to be longer is two sections"). So block 1 renders as two sections —
`#herkunft` (the photo hero with the `h1`) and `dorfargument` — and `A2` is
asserted over the `data-block` sequence, which is the beat order. `/mitmachen`
took the same reading for its one `wege` slot (`DEC-0124 §1`). The story
section that used to follow `dorfargument` now stands below the stream; §8 says
why, and it is the same reading of `D2` from the other side.

Two consequences measured rather than assumed:

- **The proof card stands before the argument, not after it.** `A3` fixes a
  *position*: "at 1280 × 800 the first viewport contains exactly one `h1` and
  the honorary-mayor claim with its proof element". `ratio-hero` is 21/9 from
  `lg`, so the photograph alone is 549 px at 1280 and three paragraphs of
  argument push the proof card out of the viewport — measured, the assertion
  failed. `D3` fixes the *argument's* internal order (`DEC-0084 §2`) and says of
  the honorary-mayor sentence only that it is "the one inline proof outside the
  stream", so the claim leads the section and the argument follows it.
  `origin-story` takes a `proofPosition` prop for it.
- **`dorfargument` is a `tight` section.** On the standard density it measured
  1 278 px at 390 px. One value per section, so the whole section is tight; the
  component's own vertical gap went from `--space-6` to `--space-4` with it.

The founder portrait runs to the section's gutter below `lg` (`portraitBleed`,
review R-ueber-8) and fills its column above it. It is **not** a second photo
section: `A2` allows exactly one, and the page's one is the hero.

### 3. The reserved proof place speaks again, and it is in the accessibility tree

`D5` is explicit twice over — "with a label badge and one sentence naming what
is missing", and "real content, not decoration: it is in the accessibility tree
with its label and sentence, never `aria-hidden`". The owner's note of
2026-09-18 had removed both from every rendered surface. The amended
determination supersedes the note (`DEC-0104`: the specification carries the
truth), **for this page only**: `empty-proof-slot` gains an optional
`label`/`sentence` pair and keeps its silent flat panel wherever no
determination asks for words — `/`, `/mitmachen`, `/dein-kalender`,
`/deine-region` and `objection-list` pass neither and are unchanged.

**The page caps the gaps at one.** The relevance engine pads a surface to its
`DEC-0048` count with one `empty` entry per unfilled position, which is right
everywhere else. Here the count is 7 and five elements are cleared, so it hands
back two gaps — and `A6` says "exactly one empty slot is visible", `D5` says
"further gaps shorten the stream below seven instead of adding a second empty
slot". `oneEmptySlot()` keeps the first gap where the engine put it and drops the
rest. Nothing is backfilled.

The clearance-pending testimonial in the artifact
(`kulturlandbuero-broellin`, `usage_rights: unverified`, "nicht für neue
öffentliche Flächen verwenden") is **not rendered at all**, not even in the
protected preview: `A5` asks that no `unverified` id appear anywhere in the
served HTML.

### 4. What nobody wrote ships marked, in its own slot

Three pieces of text have no author and are placeholders under the repository's
convention (`DEC-0068`, `src/lib/content/validate.ts`) — a sibling slot with
`provenance: generated; demo: true`, `data-demo="true"` on the element, and one
row each in `state/open.md`:

| What | Slot | Why it exists at all |
| --- | --- | --- |
| three anecdote paragraphs | `ueber-uns-2a-anecdotes-demo` | review R-ueber-7 **names** the anecdotes (the lion dancers, the bee photographs, the pandemic home office) and asks for more paragraphs; it writes none |
| the village's size, "rund 280" | the same slot | `DEC-0084 §1` fixes the figure and puts it in the content artefact, never in a spec or in source; the sentence carrying it is the engineer's |
| | | **Where it stands:** the task brief puts the figure in the village argument. It ships in the anecdotes slot and therefore in the story section, because the sentence is a placeholder and a placeholder lives in a `provenance: generated; demo: true` slot of its own — moving it into `ueber-uns-1-origin` would mark a `sourced` slot as generated, and giving block 1 a third slot would add height to the one section the 1 270 px budget and `A3`'s first clause already hold at their limit. No criterion places the figure: `A4` only forbids it in page or component **source**, and `D3` says it "is content, in the artefact". When the owner writes the sentence it moves. |
| the reserved place's label and sentence | `ueber-uns-3a-empty-slot-demo` | `D5` requires both and calls the sentence copy |

Everything else on the page is the owner's or the hub's: the `h1` ("Vom Dorf
fürs Dorf", review R-ueber-2), the first two steps of the village argument
(review, "Section ‚Warum das zählt'"), the bio (review, "Section ‚Wer dahinter
steckt'"), the quote (`people@0.3.6#jan-henrik-hempel`, `press_clearance:
cleared`), its title and link (`media-echo@0.3.3#2026-01-zukunftswege-ost-
vollblutdigitalisierer`). The English file translates the owner's German, the
way every other `en.md` in this repository does.

### 5. The newsletter renders nowhere, and the two exemptions that waited on it are gone

The inline block reads `newsletterOffered()` (`DEC-0122 §3`), so with
`NEWSLETTER_SENDING_SYSTEM` `null` it renders nothing — which is `A16`'s own
sentence and `TS-WEB-0016-A21`. The slot and the component keep their shape.

`e2e/newsletter.spec.ts` and `e2e/contact-section.spec.ts` each carried a
`test.fail` entry for `about` that named T-14 as its owner and said the entry had
to be removed with the fix. Both are removed — two files this work package does
not own, edited by the line their own comments asked for.

### 6. `NO_LIVE_MODULE` gains `about`, and the `A1` conflict is recorded, not resolved

`about` joins the list with `TS-WEB-0027 D4` / `DEC-0084 §3` as its reason. The
list now mixes two kinds of entry, and the record says so rather than tidying it
away: `TS-WEB-0006-A1` permits the empty set "on exactly the three sender
surfaces D1 names … and on no other route", while `TS-WEB-0025 D1` (`order`) and
`TS-WEB-0026 D1/D2` (`regionQuote`) determine the empty set for their own routes.
Both statements cannot be true. Resolving it means amending `A1` or amending two
page specs; that is the spec owner's decision, and it is filed as an open row.

### 7. `focusJob` stays `why-us`

`A1` names the focus job "understand who is behind it", which is `SRC-0001`'s
phrase for it; `TS-WEB-0006 D1` makes the four job ids a **closed set** with one
registry, and the id for that job is `why-us` (`JOB_IDS`, `HEADER_JOBS[3]`).
The manifest declares the id. Renaming the id would be a second job vocabulary,
which `D5` forbids.

### 8. The story stands below the stream, because `A3`'s second clause is a distance

`A3` has two clauses and the second one is a measurement: "the first proof
element of the stream is reached within the second viewport height (≤ 1 further
screen of scrolling)". `D2`'s rationale states the same intent in words — "a
scanner gets *who, where, why this shape* in the first screen and the first
proof element in the second".

The first shipped composition failed it and nothing caught the failure. Measured
at 1280 × 800 against the dev server: `dorfargument` 549–1270,
`herkunftsgeschichte` 1270–2017, `belegstrom` from 2017, and the first
`[data-block='belegstrom'] article` at **y = 2087 px** against a budget of
2 × 800 = 1 600 — 487 px into the third screen. The 747 px story section was the
distance.

So the story section moves **below** the stream. It costs nothing against `A2`:
`D2` lists no story block anywhere, and the beat order it does fix — origin →
proof stream → archive → team → newsletter → band → closing — is unchanged. It
is the same reading of `D2` as §2, applied to the section that has no beat of its
own: the block that is not in the list yields to the criterion that is. Narrative
order was rejected by `D2` for exactly this reason ("it delays the evidence a
due-diligence reader came for"), and the story is narrative.

Measured after the move, same script, same server: first stream element at
**1 341 px** at 1280 × 800, inside the 1 600 px budget. The `A3` case now reads
that number off the document (`getBoundingClientRect().top + scrollY`) and fails
on the position alone, so the clause cannot silently drop again.

**The clause is read at the viewport `A3` names, and only there.** At 390 × 844
the first stream element is at 1 874 px against a 1 688 px budget, and at
360 × 640 at 1 747 px against 1 280 px. Neither is reachable by moving a
section: at 360 px the hero ends at 405 px and `dorfargument` alone is 1 278 px,
so the budget is spent before the stream can begin, and cutting into block 1
would break `A3`'s *first* clause (the claim and its proof element inside the
first viewport) and `D3`'s content. `A3`'s sentence opens "At 1280 × 800" and
both clauses hang off it; a phone reading of the second clause is a different
criterion, and writing it is the spec owner's. Filed as an open row.

### 9. The licence figure stays in the sentence, and the test binds it to the package

`D3` and `TS-WEB-0006 D10` say the price is "read from
`@schafe-vorm-fenster/offerings`, never typed". The figure appears once on the
page, in the argument's third step — the owner's sentence, which names it inside
prose ("… kostet die Lizenz für den eigenen Kalender 480 € im Jahr statt eines
Projektbudgets"); the slot's own `price-tag` is `display: "withheld"` so the
figure is not rendered twice. Two ways to satisfy D10 from there: strip the
figure out of the sentence and render a `price-tag` beside it, or bind the
rendered token to the package in the test.

The second is taken. Rewriting the sentence to remove the number is writing page
copy (working rule 4), and the sentence is the review's; a `price-tag` under a
sentence that no longer says what it costs reads worse and says the same thing.
What `A4` asks for is that "that token's value, currency and interval equal
`@schafe-vorm-fenster/offerings`", and the `A4` case now builds the token it
looks for from `publishedFigure("portalize-calendar")` and asserts the interval
word beside it, rather than from a `480 €` literal. The chain to the package is
closed at the other end by `src/lib/pricing/offerings.test.ts`, which holds that
table against `node_modules/@schafe-vorm-fenster/offerings/*.offering.md`. A
figure that changes in the hub now fails this page's own acceptance case instead
of drifting.

### 10. `D4`'s "no 'seit …' claim" is read as a claim about the service

`D4` forbids "no year figure rendered as a module, no place count, no badge, no
'seit …' claim anywhere on the page", and its whole rationale is the **static
traction claim** `FUN-WEB-0041` and `TS-WEB-0008-A10` forbid. The owner's bio
says "Beruflich mache ich seit 25 Jahren IT" — a fact about a person, the
owner's own wording (review R-ueber-10), and no claim about how long the service
has run. Read literally, `D4` would delete it; read for what it protects, it
does not reach it.

The assertion holds both halves of that reading: no `seit <year>` anywhere in
`#main` (the form the deleted counter module would have produced), and no
`seit <n> Jahren in Betrieb / online / am Netz` either. The personal sentence
stands. If `D4` is meant to reach a person's biography, that is an amendment to
`D4`, not a test change.

## Where the task brief and the specification disagreed

The specification won in all four places (`AGENTS.md` rule 8, `DEC-0104`), and
each is reported rather than absorbed:

1. **Two proof sections.** The brief asks for "Was andere sagen" (press) beside a
   customer-proof section. `D2` is `[FIXED]` at "one stream of 7", `A2` asserts
   the block order "exactly", and `A5`/`A6` are written for one stream with one
   reserved place. Independently, **no customer proof could ship even if the
   spec allowed the section**: `lehre-lelender`, `volkshochschule-uecker-randow`
   and `kulturlandbuero-broellin` all carry `usage_rights: unverified`, and
   Wolgast, Ivenack and Stolpe have no record at all — `A5` forbids an
   `unverified` id anywhere in the served HTML. `plan/reviews/2026-09-23/
   spec-impact.md` theme B says what the split needs first: a `proof_class`
   facet and four clearances in the hub. The page renders the one press stream
   under `kickers.othersSay`, which is the heading the artefact already carried.
2. **Quote cards for RAA, IHK and Nordkurier.** One is buildable: the RAA
   portrait (`Zukunftswege Ost-Vorpommern`) carries three verbatim quotes, a
   `url`, and `press_clearance: cleared` on the speaker. It stands in the story
   section. The Nordkurier article of 2019 quotes the founder only in **indirect
   speech** — there is no sentence to set in quotation marks — and the IHK
   podcast's only text is a machine transcript that misspells the company name
   in its first line. `TS-WEB-0027 D5`'s own rule for this case is the design
   system's: a quote without a working, verbatim source renders as a proof card,
   not a quote card. Both stay proof cards.
3. **The stream's sixth element.** The brief keeps six cleared elements and asks
   for "no 'seit 2018' sentence". `in-operation-since-2018`'s claim *is* that
   sentence, and `D4` forbids "no … 'seit …' claim **anywhere on the page**". The
   element leaves the pool; the stream is five filled places and one reserved.
4. **Christian Sauer and `A9`.** The review takes him off the team block; `A9`
   asks for "every person in `@schafe-vorm-fenster/people`". The page renders the
   people the **content artefact** names, which is what `D7` describes ("nothing
   about a person is written into website copy" — the pipeline supplies them),
   and his record is `status: draft` with `press_clearance: unverified`.
   Retiring the record is a demand on the hub, filed as an open row; until it
   lands, `A9`'s letter and the owner's instruction disagree and the page follows
   the owner on who appears, while keeping `A9`'s substance — the one person it
   shows appears once, in a 4:5 media box, with a cleared portrait, never a blank
   box.

## Consequences

- `app/[lang]/ueber-uns/page.tsx` renders five `data-block` sections and no
  counter island; `page.meta.ts`, `page.meta.test.ts`, `page-rhythm.test.ts`,
  `stream.ts` + `stream.test.ts` and `e2e/pages/ueber-uns.spec.ts` follow.
- `src/components/origin-story/` takes paragraphs instead of one body string,
  has **no default headline** any more (`DEC-0083 §5` released it; the gallery
  and `badge-locale.test.tsx` pass none and now render no `h1` at all), and
  gained `portraitBleed` and `proofPosition`.
- `src/components/empty-proof-slot/` has two forms; four other pages keep the
  silent one.
- `content/pages/ueber-uns/{de,en}.md`: slot 2 is the story (was the counters),
  the team entry is a labelled field rather than a bare paragraph — a bare
  paragraph made the slot's own editorial note read as a second person — and
  three slots are new, two of them `demo`.
- `src/lib/pages/manifests.ts` + test: `about` in `CONVERSION_MAP` and in
  `NO_LIVE_MODULE`.
- `state/open.md` gains one row per placeholder, one for the hub's bio dates and
  Christian Sauer's record, one for the `A1` live-module conflict, one for the
  customer-proof section the clearances gate, and row 251 for the phone reading
  of `A3`'s position clause (§8).
- The `data-block` sequence is `dorfargument · belegstrom · herkunftsgeschichte ·
  archiv-verweis · team`, and both places that declare it — the `A2` e2e case and
  `page-rhythm.test.ts` — say why the story sits where it does.
- `TS-WEB-0027` itself is **not amended**: every determination this page now
  follows was already written. What the page did was catch up.

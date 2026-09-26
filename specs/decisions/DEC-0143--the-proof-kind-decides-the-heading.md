---
id: DEC-0143
title: The proof kind decides the heading, the element decides the page — a customer pool stops borrowing the press heading, a quote needs a cited source to be a quote, and the one price on /deine-region is read
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

The 2026-09-22 review put four demands on the proof pools, and `spec-impact.md`
theme B (lines 75–108) sorted them into a hub half and a website half.

**The split.** "'Wer das schon macht' sind die Kundenbelege, 'Was andere sagen'
ist Presse und Auftritte" (review line 462). Three pages had it backwards: the
proof section on `/mitmachen` was headed **"Was andere sagen"** over three
customers who publish for themselves, `/deine-region` carried a variant of the
same heading ("Was Landkreise und Institutionen sagen") over a customer pool,
and `/dein-kalender` headed its three mayors **"Belege"** — a label, not a
heading. The copy guide is explicit that the first of those belongs to the other
kind: "Wer das schon macht → Was andere sagen *(for press proof only)*"
(`concept/website-copy-guide.md:516`, `CG-017`). The one page that *does* carry
press proof, `/ueber-uns` slot 3, already reads "Was andere sagen".

**The attributions.** "Die 'Stiftung Lebendiges Lehre' verantwortet das Lebender
Kalenderprojekt. Nicht die Gemeinde … Es sind aber 17 Ort in und um die Gemeinde
Lehre" (line 103) and "Es ist aber die 'Volkshochschulen in
Vorpommern-Greifswald'. Relevant ist auch der gewünschte Benefit …" (line 109).
`/` had both corrections since T-11; `/mitmachen` said "Die Gemeinde Lehre
betreibt …" and "Volkshochschule Uecker-Randow", and `/deine-region` carried the
proof record's own "Eine Gemeinde betreibt …".

**The same words twice.** "Proofs vary across pages, never identical wording"
(spec-impact.md:83). Two elements stood on two pages each, word for word:
`impftermine-landkreis` on `/ueber-uns` and `/deine-region`, and
`eichler-wasserschloss-quilow` on `/dein-kalender` and `/deine-region`.

**The quotes.** "Quotes verbatim with the concrete article as source. Quote +
source as one designed element" (spec-impact.md:81-84) — and the design system
does not leave that open: "A quote without a named source and a working link
does not ship" (`concept/website-design-system.md` §Quote card, `CG-028`). The
three mayors on `/dein-kalender` rendered as `proof-card`s with no source link
anywhere, and the hub's proof schema carries no `source_url` at all
(spec-impact.md:99-102) — that field is the hub's change, not this one's.

**The price.** `TS-WEB-0026-A4` asks that "no price string exists in a content
source file" and `TS-WEB-0026-A5` that the one permitted 480 € node "is produced
by the price component reading `portalize-calendar`". Block 5 of
`/deine-region` typed it: `der 480-€-Tarif` / `the €480 tier` in
`content/pages/deine-region/{de,en}.md`, with a second copy in the slot-8 note.
`TS-WEB-0006-A12` names the same figure as the only numeric price the site may
render, which makes a typed one a second source of truth for it.

## Decision

### §1 — The proof kind is a content facet, carried through the seam

`app/[lang]/_proof.ts` gains `ProofKind = "customer" | "press"` and
`ProofCandidate.proofKind`. The engine does not score on it and is not asked to:
`ProofCandidate.type` is the relevance taxonomy (`ItemType`,
`src/lib/relevance/types.ts`), which answers *what kind of element is this*, and
this answers *whose voice is it*. The hub's `proof_class` (customer | press |
award | partner) is the field that will replace it (spec-impact.md:99-102); the
two values the review names are what the pages need until it lands, which is why
the facet is written where the pages are and not in the engine's types.

### §2 — The heading is read from the kind, in one place

`proofHeading(kind, locale)` is the only thing that decides a proof section's
heading, and `selectedProofKind(selection)` is the only thing that decides which
kind it is asked about: the facet of the first element the engine actually
selected, `customer` where the slot is empty or the artifact names no facet. The
first version of this change typed `proofHeading("customer", locale)` at each of
the three call sites, which left `ProofCandidate.proofKind` written by three
pages and read by none — a heading decided by a literal per page is the
duplication this section claims to remove. With the facet read, exchanging a
pool's first element for a press one re-heads the section with no page edit. `press` reads `dictionary(locale).kickers.othersSay` — the site's own
vocabulary, unchanged. `customer` reads **"Wo es wirklich benutzt wird"** /
"Where it is really in use".

Those five German words are the owner's, from the review's own sentence about
what belongs in this section: "Also Lebendiges Lehre, die RAA, das
Kulturlandbüro, Ivenack, Stolpe an der Peene, Wolgast: Sachen, wo es wirklich
benutzt wird" (line 458). They are used with the leading noun dropped and the
position cited, which is what working rule 4 permits; they are **not** marked
`data-demo="true"`. The kicker above them stays `kickers.customers` and stays
marked, because *that* string is nobody's — `DEC-0120 §5` marked it precisely
because the review rejects "Wer das schon macht" and names no replacement. This
record does not claim it named one: a kicker names a section's role in a closed
site-wide vocabulary, and a heading says what the section shows. They are two
slots, and now they carry two different strings on all three pages instead of
one page's flat label, one page's invented variant and one page's press heading.

### §3 — A quote becomes a quote card only with a cited source and a full author

The artifact may append a citation to an authored proof line as an ordinary
markdown link, and `parseProofLine` (in `_proof.ts`) takes it off **before** the
attribution is parsed, so the ` — ` inside a source cannot be read as the
attribution separator:

    1. „Die Termindaten …" — Holger Wendt, Bürgermeister in Rubkow — [Nordkurier, „Titel"](https://…)

`/dein-kalender`'s proof block renders a `quote-card` where that citation exists
**and** the attribution yields a role *and* an organisation, and a `proof-card`
otherwise. Both conditions are the design system's, stated on the component:
"A quote without a named source and a working link does not ship" and "a name
without a role and an organisation is not a proof".

**Today that means all three mayors render as `proof-card`s**, because no record
carries a source URL. That is the honest outcome, not a deferral: the
alternative — a quote card with no link, or a fabricated one — is the thing both
rules forbid.

A citation on its own is **not** enough, and the phrase "the first quote that
gets a cleared article renders as a quote" was wrong about today's three lines.
`parseDemoProofElement` splits the attribution part at its *first* `, `, so
"Holger Wendt, Bürgermeister in Rubkow" leaves the role standing alone and
`quoteAuthor` returns `null`; the other two lines carry no comma at all. Adding a
citation to any of the three therefore changes nothing on the page. Both halves
have to be authored:

    „…" — <Name>, <Rolle>, <Organisation> — [<Publikation>, „<Titel>"](https://…)

Both conditions now live in `app/[lang]/_proof.ts` (`parseProofLine`,
`quoteAuthor`) rather than one of them in the page, so the pair is unit-tested
in one place — including the negative for today's shape and the positive for the
one that reaches a quote card. `state/open.md` row 280 states the two-part
condition rather than a citation alone.

### §4 — The one price on `/deine-region` is a token in the artifact and a node on the page

The artifact writes `{kalender-preis}` / `{calendar-price}` in block 5's benefit
sentence and no figure anywhere; the slot-8 note drops its second copy of the
same number. The page splits the sentence at the token and puts a `price-tag`
where the token stood, reading `offeringPrice("portalize-calendar", locale)`.

Two components changed for it, both minimally. `feature-benefit`'s `benefit`
prop takes a `ReactNode` instead of a `string` — it still renders exactly one
paragraph and still types no price. `price-tag` gains `inline`, which renders the
same string in a `span` instead of a `p`: the figure, its interval and its net
qualifier stay one readable string ("480 € / Jahr, zzgl. USt."), because
dropping the qualifier to fit a sentence would break `TS-WEB-0006 D10` to satisfy
`TS-WEB-0026-A5`. A sentence carrying no token comes back untouched, so a content
edit that drops it loses the price, never the sentence.

### §5 — A review correction outranks a record's wording, and is not a placeholder

`lehre-lelender`'s own `claim:` opens "Eine Gemeinde betreibt …", which the
review corrects by name. The cards write **the Stiftung**, cite line 103 in the
slot note, and are not marked `demo`: this is the specification standing over a
source (`DEC-0104`), and it is the precedent `/` already set in T-11, where the
same correction ships unmarked with the same citation. The same holds for the
county-wide Volkshochschulen name and its benefit clause (line 109) — with one
difference that has to be said plainly, because the first version of this record
said the opposite: **that card is authored throughout, not quoted.** Its first
half is written from the record's `evidence:` (the Pasewalk course programme
appearing in the village calendars), not from its `claim:`, which shares no
sentence with the card; its second half restates the review's own "da sind die
Angebote ja genauso relevant". `/mitmachen`'s first card is authored the same
way, out of `lehre-lelender`'s `evidence:` and line 103.

Neither is marked `demo`, and the task's `copy` instruction ("write it as a demo
slot line if it cannot be quoted") is not followed to the letter for one reason:
both cards name a **real, clearance-pending institution** and stand on real
evidence, and `demo: true` in this repository means labelled dummy content
(`validate.ts:112-133`). Flagging them would make a true card read as an
invented one, and it would mark the two sibling cards in the same slot too. The
placeholder convention's purpose — nothing unowned reaches the owner unseen — is
served instead by `state/open.md` **row 281**, which asks him to confirm both
lines, in the shape row 279 takes for the heading. If he would rather see them
flagged, the flag and the row are both one edit.

Two things are deliberately **not** written: the second half of the VHS benefit
("mehr Kurse in den Dörfern vor Ort anbieten") is an intention of theirs rather
than proof about the service and stands on no card, and the quotation marks came
off the two corrected lines — a line nobody said in those words is a claim, not
a quote.

### §6 — Cross-page distinctness is achieved by element choice, never by rewriting a record

Where two pages drew the same element, the page with the weaker claim to it
drops it, rather than one of them paraphrasing a record's sentence into a second
version of itself. `/deine-region` therefore exchanges
`impftermine-landkreis` (which `/ueber-uns` carries) and
`eichler-wasserschloss-quilow` (which `/dein-kalender` carries) for
`leader-foerderung-2022` and `kurzweg-baeckerei`, both verbatim from their
records' `claim:` and both on no other page. The pool keeps the review's own type
mix (line 111): success on the ground, success in funding, a voice from the
region.

`/ueber-uns` and `/` were not touched: their content belongs to T-14 and T-11,
both merged, and the exchange is cheaper on the page that carried the
duplicates.

## Consequences

- `app/[lang]/_proof.ts` carries the kind, the heading, the citation parser and
  the quote-author rule; `app/[lang]/_proof.test.ts` holds twelve cases over
  them, including both halves of the quote condition.
- `/deine-region`, `/dein-kalender` and `/mitmachen` read their proof heading
  from `proofHeading(selectedProofKind(proofSelection), locale)`.
  `/deine-region`'s `PAGE_COPY` loses `proofHeading`, `/dein-kalender` loses
  `PROOF_LABEL` and its page-local `quoteAuthor`.
- `src/components/price-tag/**` gains `inline` (+ one CSS class);
  `src/components/feature-benefit/**` widens `benefit`. Neither is another
  task's file.
- `e2e/pages/deine-region.spec.ts` gains A5's second clause per locale, a static
  A4 scan of both content files, and the customer-heading case;
  `e2e/pages/dein-kalender.spec.ts` gains the heading and the
  no-quote-card-without-a-source case; `e2e/pages/mitmachen.spec.ts` has its
  "Was andere sagen" assertion replaced and gains the attribution case.
- `state/open.md` rows 279 to 282 carry what the owner decides: the customer
  heading (279), the missing source URLs that keep three quotes out of quote
  cards and the two-part condition a quote card needs (280), the two authored
  proof lines on `/mitmachen` (281), and the `CG-027` claim budget the proof
  pools stand over (282).
- **Provenance bookkeeping follows the pool, in four places.** Exchanging two
  elements on `/deine-region` (§6) is not finished when the cards change:
  `sources:`/`derived_from:` in both locales name the three records actually
  rendered (`TS-WEB-0007 D6`, "one entry per record actually used"), the
  `provenance:` string and the clearance `open_points` say *three*
  clearance-pending elements and that the page no longer carries a `cleared`
  one, and the two clearance registers — `state/open.md` rows 160 and 179, and
  `state/content-map.md`'s follow-up table — name `leader-foerderung-2022` and
  `kurzweg-baeckerei`, because row 160 calls itself "the single place that rule
  is recorded". A record that renders and appears in no register is a clearance
  that the go-live sweep cannot see.
- **`CG-027`'s claim budget is exceeded by four of the six cards in the two
  pools, and that is registered rather than hidden** (row 282: 121 · 112 · 67 on
  `/deine-region`, 93 · 121 · 73 on `/mitmachen`, against a budget of 70). The
  two long `/deine-region` claims are verbatim record `claim:` strings and
  shortening them would be rewriting a record, which §6 forbids; `/mitmachen`'s
  authored VHS line was cut from 147 to 121 characters, as far as it goes while
  still carrying the benefit the review asks for. Nothing lints the budget, so
  `pnpm check` says nothing about it either way.
- **Not done here, and named rather than done:** `TS-WEB-0005 D7`'s cross-page
  rotation and `D5/D6`'s partition on a proof class are hub- and
  spec-owner-side (spec-impact.md, theme B "Change"). Nothing in `specs/` was
  amended by this task, and no status moved.

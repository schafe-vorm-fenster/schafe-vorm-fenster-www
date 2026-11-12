---
id: DEC-0209
title: Every proof section carries one head — "Was andere über uns sagen" over "Stimmen aus der Praxis"
status: DRAFT
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #160. The proof section had a different head per page and per kind of
proof. Customer proof on `/mitmachen`, `/dein-kalender` and `/deine-region`
stood under the placeholder kicker "Wer den Kalender nutzt" over the heading
"Wo es wirklich benutzt wird" (DEC-0120 §5, DEC-0143 §2), which repeats one
verb stem and which DEC-0206 §3 now forbids. `/` stood under the kicker "Was
andere sagen" over a heading typed into its content slot ("Auszeichnungen,
Presse und Orte, die den Dorfkalender schon nutzen"). CG-017 reserved "Was
andere sagen" for press proof only (`concept/website-copy-guide.md`, the
avoid table). Several proof lines were keyword strings without a verb, one
quotation was elided, and two lines stood in quotation marks without being
anyone's words.

The analysis on the issue
(<https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/160#issuecomment-6822798187>)
proposed three variants for the head and a reworded line per proof record.

## The owner's decision

Verbatim, issue #160, 2026-11-12
(<https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/160#issuecomment-6824901128>):

> Owner-Entscheidung 12.11.: Variante A. Kicker „Was andere über uns sagen“, Überschrift „Stimmen aus der Praxis“, kein Satz darunter. CG-017 wird per Decision Record angepasst. Die Belegzeilen werden laut Vorschlag überarbeitet.

## Decision

### 1. One head for every proof section

Every proof section carries the kicker **"Was andere über uns sagen"** over
the heading **"Stimmen aus der Praxis"**, and no intro sentence. English:
**"What others say about us"** over **"Voices from the field"** (the
analysis's own English, variant A). It holds for customers, partners, press
and the award alike. No sentence follows because the relevance engine mixes
the elements per page and build (TS-WEB-0005), and a sentence naming the
kinds would be untrue for some selection.

Kicker and heading share no word stem (DEC-0206 §3). The kicker names who is
speaking, a role the heading leaves unsaid (DEC-0206 §2).

### 2. One source in the code

The two strings live in `src/lib/i18n/dictionary.ts` as `proofSection`, and
pages read them through `proofIntro(locale)` in `app/[lang]/_proof.ts`:
`/`, `/mitmachen`, `/dein-kalender` and `/deine-region`. Gone with it:
`kickers.customers`, `kickers.othersSay`, `CUSTOMER_PROOF_HEADING`,
`proofHeading`, `selectedProofKind`, the `kickerDemo` mark on the three
customer sections and the heading field of `home-8-proof-stream`.

`ProofKind` stays as a **selection facet only**: it says which pool an
element belongs to and never decides the heading. This supersedes
DEC-0143 §2; DEC-0143 §1, §3 and the rest stand.

### 3. CG-017 and CG-019 change

- CG-017 *Use* names "Was andere über uns sagen"; the avoid table's row
  "Wer das schon macht → Was andere sagen *(for press proof only)*" now points
  to "Was andere über uns sagen", the proof kicker for every kind of proof. A
  paragraph under CG-017 states the one head.
- CG-019's role table merges the two empty proof rows into one row carrying
  the owner's kicker. The provenance row stays empty.
- `src/lib/content/validate.ts`'s avoid-list row for "Wer das schon macht"
  names the new replacement.

### 4. `/ueber-uns` takes the head too

Chapter 03 on `/ueber-uns` holds four records whose `source:` is the
company's own eu:react final report to the funder (`impftermine-landkreis`,
`ukraine-integration-dorfleben`, `google-baecker-schlatkow`,
`homeoffice-mobile-anbieter`). The first draft of this decision kept the
chapter's own heading ("Dann wurde es mehr als Brötchen.") because the report
is not "what others say about us".

The owner decided otherwise on 2026-11-12: the section carries **the same
head as every other proof section**, kicker "Was andere über uns sagen" over
"Stimmen aus der Praxis", read through `proofIntro(locale)`, even though the
entries come from the company's own report. That is expressly fine. The
attribution of each entry stays correct: it names the eu:react report. The
slot's chapter heading field ("Kapitel 03 — Überschrift") and the unrendered
"Was andere sagen" field are struck. The chapter keeps its ordinal and place
line.

The first line was attributed to "Landkreis Vorpommern-Greifswald"; its record
names the own report as source and the county only as the partner of the
work. The line now names the report, as the other three do.

Decided, no longer open: a separate proof section on `/ueber-uns` with
third-party voices is not required by this decision.

### 5. The proof lines, and the retired claim budget

The lines follow the analysis's table, one sentence per record wherever a
record stands on more than one page:

| Record | Line (DE) | Pages |
| --- | --- | --- |
| `lehre-lelender` | Die Stiftung führt den Dorfkalender für 17 Orte unter eigenem Namen: LeLender. | `/`, `/mitmachen`, `/deine-region` |
| `noerd-award-2026-smart-community` | Schafe vorm Fenster hat den NØRD Award 2026 in der Kategorie Smart Community gewonnen, deren Schirmherr der Bitkom e.V. war. | `/` |
| `volkshochschule-uecker-randow` | Die Volkshochschule veröffentlicht ihr komplettes Kursprogramm im Dorfkalender. | `/`, `/mitmachen` |
| `kulturlandbuero-broellin` | the full quotation, without the ellipsis | `/` |
| `zukunftswege-ost-newsletter` | Das Netzwerk sammelt die Termine für seinen Newsletter über den Dorfkalender. (no quotation marks; it is nobody's sentence) | `/mitmachen` |
| `kurzweg-baeckerei` | Elisabeth Kurzweg's real quotation from the record's `## Evidence` instead of the record's `claim:` in quotation marks | `/deine-region` |
| `wendt-rubkow` | EN only: the translation keeps his sentence (subject, tense) | `/dein-kalender` |
| `impftermine-landkreis` | the attribution names the eu:react report (§4) | `/ueber-uns` |

Where a line was authored differently on two pages, the pages now share it.
This amends DEC-0143 §6 (owner, 2026-11-12): **a proof has the same wording
everywhere.** The same line on several pages, `lehre-lelender` on `/`,
`/mitmachen` and `/deine-region` among them, is intended; DEC-0143 §6's rule
("the page with the weaker claim drops the element") no longer applies to the
authored lines.

Three choices inside the table, each from the record:

- The NØRD line is the neutral version, not CG-027's "Wir sind stolz …"
  example: the analysis offered both and recommended the neutral one, and the
  patron of the category is in the record's body ("Schirmherr der Kategorie
  war der Bitkom e.V.").
- The Volkshochschule line drops "in den Dörfern genauso relevant wie in der
  Stadt" and "bis in die Dörfer": no record carries them. The context line
  keeps "Volkshochschulen in Vorpommern-Greifswald", the name of the partner
  record (`@schafe-vorm-fenster/partners#volkshochschule-vorpommern-greifswald`)
  and of the review's correction.
- The verb about the Stiftung is "führt", because CG-033 avoids "betrieben"
  about the product.

**One deviation from a source.** `lehre-lelender.proof.md#L8` says "Eine
Gemeinde betreibt den Dorfkalender …"; the lines name the Stiftung, as the
review of 2026-09-22 (line 103) states and DEC-0143 §5 already did. The
specification carries the truth (DEC-0104); **DEM-0080** asks the hub to
follow. The content slots record it as a `Deviation:` line.

**The claim budget is retired.** DEC-0154 withdrew CG-027's 70-character
limit; `check:content` row 16 (`claim-budget`) and its exception list still
failed every whole sentence over 70 characters. Both are removed, the copy
contract's CG-027 row is `review` only, and `state/open.md` row 286 is closed.
A new budget stays `Q-0086`; no number is invented here.

## Consequences

- `state/open.md` rows 234, 283 and 286 are resolved.
- `e2e/pages/{home,mitmachen,dein-kalender,deine-region}.spec.ts` assert the
  shared head; `app/[lang]/_proof.test.ts` asserts the two strings and that
  they share no word.
- Issue #38 (proof lines as whole sentences): the lines are whole sentences
  and the budget that blocked them is gone. Its criterion "the copy lint
  flags a line without a verb" is not built here.
- Issue #36 (a teaser per proof with a deep link into `/ueber-uns`) is not
  touched: no anchors, no links.
- Every artefact this decision touches stays `DRAFT` (`POL-GRADED-BY-IMPACT`,
  DEC-0089).

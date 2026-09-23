---
title: "Website Copy Guide — www.schafe-vorm-fenster.de"
created_at: 2026-09-23
updated_at: 2026-09-23
status: draft
source: review
intent: inform
brand: schafe-vorm-fenster
tags: ["website", "copy", "tone-of-voice", "content", "style-guide"]
related:
  - ./website-design-system.md
  - ./website-content-production.concept.md
  - ../specs/contracts/copy-contract.md
---

## Purpose

This is the binding wording specification for `www.schafe-vorm-fenster.de`.
It is to copy what `website-design-system.md` is to the visual layer: the
website's own cut of a brand rule set that lives elsewhere, written down so a
generator, a linter and a reviewer all read the same rule.

**Inheritance.** Two documents in `go-to-market-os` own the levels above this
one, and neither is restated here:

| Level | Owner | Example of what it decides |
| --- | --- | --- |
| Brand voice — adjectives, stance, anti-patterns, register | `packages/identity/brand-identity/tone-of-voice.md` | how Schafe vorm Fenster sounds in any channel |
| What the website says — the four jobs, scenes not labels, order without exclusion, the eight-point brief check | `concept/website-communication-principles.concept.md` | that a job is introduced by a scene at all |
| **How the website writes it** | **this guide** | that the scene's opener is a statement, and how long it may be |

If this guide contradicts either of them, they win — or they are changed
first, in `go-to-market-os` (`concept/README.md` rule 2). Nothing here is
copied from them; the rows above are links, not excerpts.

**Evidence.** Every rule below was demanded by the owner's review of the
preview site (`plan/reviews/2026-09-23/2026-09-22 Review SVF Preview
Website.md`, 2026-09-22). Each carries one rejected and one accepted example,
both quoted from that review. Where the review rejects a phrasing but names no
replacement, the *use* column stays empty rather than inventing one.

**Scope.** German copy on the website, and its English sibling. Not:
correspondence, offers, print, the app. Not page copy — this guide says how
copy is written, the content phase writes it (repository working rule 4).

## The Voice in One Sentence

Write what a person in the village would say to another person in the village:
one thought per section, named people instead of categories, the benefit
before the concept, and no sentence that only exists because the previous one
was too short.

Three rules make it coherent:

1. **A section stands alone.** Someone who scrolled in here understands it
   without the section above.
2. **A title states what works.** A problem may be named inside a section; it
   never names the section.
3. **Every claim has an example.** If no example exists, the claim is too big.

---

## 1. Register and address

### CG-001 — `du` to a person, `ihr` to an organisation

Both informal. This is **number, not register**: DEC-066 fixes one register,
`du`, for the whole site including the Verwaltung, and is untouched here.
`ihr` is the plural of the same informal address, used when the thing is done
by a group rather than by one pair of hands.

| | Addressed as |
| --- | --- |
| someone who photographs a flyer, looks for the weekend, moves to the village | `du` |
| a Verein, a Gemeinde, an Amt, a Stiftung, a Kulturgesellschaft, a VHS | `ihr` |

- Use: *"Du hast den Flyer sowieso schon gedruckt, fotografier ihn, schick das
  Bild per WhatsApp."* · *"Euer Kalender auf eurer Webseite."*
- Avoid: *"Euer Kalender, eure Website, euer Name."* — three possessives for
  one thought, and `euer Name` promises something nobody receives.

### CG-002 — One address per page, declared, and a block departs whole

The page's default follows `audiences[0]` in `page.meta.ts` (TS-006 D1). A
block may take the other number only where its actor plainly is the other one,
and then for the whole block — never inside a paragraph, never inside a
sentence.

| Page | Default |
| --- | --- |
| `/`, `/dein-ort`, `/dein-ort/starten` | `du` |
| `/mitmachen`, `/mitmachen/registrieren` | `du`; the three publishing paths address `ihr`, because a committee runs them |
| `/dein-kalender`, `/dein-kalender/bestellen` | `ihr` |
| `/deine-region`, `/deine-region/angebot` | `ihr` |
| `/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches` | `du` |

- Avoid: *"Und wenn ihr sie selbst zeigen wollt. Dieselben Termine, nur auf
  eurer eigenen Seite:"* — `ihr` and `sie` in one line, and the reader knows
  neither.

### CG-003 — `Sie` does not occur

Not on a page, not in a form label, not in an error message, not in the
English mirror's tone. A register switch is a validation failure, not a
stylistic finding (DEC-066).

---

## 2. Structure

### CG-004 — A section is self-contained

No section refers back to an earlier one. Someone arrives here by scrolling,
by a deep link, by a search result. Dramaturgy still builds — reference does
not.

- Avoid: *"Beides gibt es."* · *"Der Name der Firma"* · *"Dieselben Termine"*
  — each needs a sentence the reader never read.
- Use: write the thing out once more. *"Der Name Schafe vorm Fenster …"*

### CG-005 — A section title is a statement, and it states what works

Not a question, not a label, not a problem. A problem framing may live in the
**kicker** above the title; the title says what goes.

- Avoid: *"Warum es heute hakt"* · *"Warum es hakt"* · *"Warum das, was ihr
  heute macht, nicht überall ankommt"* · *"Warum wir"*
- Use: kicker *"Warum es heute hakt"* with the title *"Wer euren Termin heute
  nicht mitbekommt"* — the review accepts exactly this split. And
  *"Was drinsteht, bestimmt ihr"* · *"So kommen eure Termine rein"* ·
  *"So sieht es aus, wenn es bei euch steht"*.

### CG-006 — A question only to the reader, answered next

A question is allowed where it is addressed to *the reader* and the next
sentence answers it. A question that rhetorically restates a fact is a
statement with the wrong punctuation.

- Avoid: *"und der Termin steht im Kalender?"* — he does stand in it; say so.
  *"Ein eigener Kalender auf der eigenen Website, ohne eigenes System
  dahinter?"*
- Use: kicker *"Was hilft euch das?"*, answered by the section beneath it.

### CG-007 — One idea per section

A second mechanism is a second block (TS-006 D7). A second argument is a
second section. A sentence that repeats the previous one is cut, not softened.

- Avoid: *"Der Termin erscheint in deinem Ort und in den Nachbarorten, ohne
  dass du ihn ein zweites Mal tippst."* — the section already said it.
- Use: *"Der Termin ist an dem Ort sichtbar und in den Orten drumherum gleich
  mit."*

### CG-008 — Every section hands off to the next

The last line of a section points forward — as a CTA, as a bridge, or as the
gap the next section closes. A coverage gap is a hand-off, not a defect to
hide.

- Use: *"Fehlt deine Veranstaltung, jetzt selbst eintragen."* — the missing
  date becomes the way into the publishing job.

---

## 3. Concreteness

### CG-009 — Real people with roles, never "die Leute"

The site talks to the people it is describing. Nobody wants to be "die Leute".
Name the role, the body, the relationship.

- Avoid: *"Sie kommen von den Leuten im Ort"*
- Use: *"die Nachbarn, das Nachbardorf, die Neuen"* — three real groups with
  a real reason to care.

### CG-010 — The benefit, not the concept

Nobody wants a calendar on their website. They want their events on their
website.

- Avoid: *"Ein eigener Kalender auf der eigenen Website"* · *"Deine Gemeinde
  bekommt ihre eigene Auswahl an Terminen"*
- Use: *"Euer Kalender auf eurer Webseite."* · *"Auch Termine von Vereinen,
  die ihren Flyer einfach per WhatsApp geschickt haben."*

### CG-011 — One example per claim

An abstract capability gets one concrete case, named. Where the offering
record carries no example, the claim is weakened, not illustrated by
invention (TS-007 D2).

- Avoid: *"Über die Einstellungen legt ihr fest, welche Orte, welcher Verein
  und welche Kategorien"* — true, unpicturable.
- Use: the review's own pattern — *Ihr seid die Kulturgesellschaft einer
  Stadt, dann definiert ihr das Verwaltungsgebiet der Stadt oder das
  Amtsgebiet.*

### CG-012 — Address whoever acts

If an organiser is reading, the date is *dein* date. Possessives are the
cheapest concreteness there is.

- Avoid: *"Der Termin erscheint in deinem Ort …"* on a page whose reader is
  the organiser.
- Use: *"Dein Termin …"*

---

## 4. Economy

### CG-013 — Short words

`fotografier` over `Fotografierst du ihn`. `Website` over `Internetpräsenz`.
Where two words mean the same, the shorter one ships.

- Avoid: *"Fotografierst ihn, schickst das Bild per WhatsApp an unsere Nummer,
  fertig"*
- Use: *"Foto machen und das Bild per WhatsApp an unsere Nummer, fertig"*

### CG-014 — Short sentences

Split rather than subordinate. A sentence with two subordinate clauses is two
sentences.

- Avoid: *"Deshalb gibt es drei Wege rein, und alle drei sind Wege, die ihr
  schon geht."*
- Use: *"Drei Wege. Alle nutzt ihr eh schon."*

### CG-015 — No word doubling

The same stem twice in one sentence or one block is a rewrite, not a style.

- Avoid: *"Wer das ehrenamtlich organisiert, hat neben der Organisation keine
  Zeit mehr fürs Bewerben …"* — `organisiert` and `Organisation`, plus a `Wer`
  and a `das` that carry nothing.

### CG-016 — No padding

A line that only confirms the previous line is deleted.

- Avoid: *"Genau so. Du druckst den Flyer sowieso aus."*
- Use: *"Fertig."* — one word, and it is doing work.

---

## 5. Headings and kickers

### CG-017 — Casual, never flat

Colloquial is right. Banal is not. A heading that would fit any product on any
site is not a heading.

- Avoid: *"Wo das herkommt"* · *"Wer das schon macht"* · *"Warum wir"*
- Use: *"Wer dahintersteckt"* · *"Was andere sagen"* · *"Vom Dorf fürs Dorf"*

### CG-018 — No abstraction heading

"Warum das zählt" is the shape a machine writes when it has nothing to say.
Ask the reader's question instead.

- Avoid: *"Warum das zählt"* · *"Neuigkeiten aus dem Projekt"*
- Use: *"Was hilft euch das?"* · *"Warum ist das wichtig?"* · *"Was sind die
  Vorteile?"*

### CG-019 — Kicker vocabulary per section role

The kicker names the role the section plays; the title says what goes
(CG-005). One kicker per section, mono uppercase (SRC-014 "Kicker").

| Section role | The kicker says | From the review |
| --- | --- | --- |
| how it works | that it gets easier | `SO GEHT'S EINFACHER` |
| benefit | what it does for you | `WAS HILFT EUCH DAS?` |
| problem / old world | why it is being raised at all | `WARUM ES HEUTE HAKT` |
| price | what it costs | `WAS ES KOSTET` |
| contact | what may be asked here | `FRAGEN ZU DEN PREISEN` |
| proof — customers | — | — |
| proof — press and appearances | — | — |
| provenance | — | — |

The three empty rows are empty on purpose: the review rejects
*"Wer das schon macht"* and *"Presse- und Auftrittshistorie 2018 bis 2026"*
without naming a replacement. Writing one here would be invention.

---

## 6. Per block type — the length budgets

**How these numbers were derived.** Content width at the authoring viewport is
`390 − 2 × 16 = 358 px` (SRC-014 "Shape and Space"). Each budget is that width
divided by the average advance of the role's type from the SRC-014 scale, minus
the block's own furniture (a disc, an icon, a trailing arrow). They are
**provisional** in the sense of TS-007's open point — the component manifest
(SRC-013 §1) replaces them with the component's own budget. The derivation is
recorded so a later number can be re-derived instead of re-guessed. In the
schema each one is a `max()` (TS-007 D5).

| # | Block / field | Type role | Budget at 390 px | The rule |
| --- | --- | --- | --- | --- |
| CG-020 | hero claim | Display 54/800 | ≤ 42 characters, ≤ 3 lines | Concrete, not cryptic. It has to work for someone who arrived from a search result with no flyer in hand. |
| CG-021 | hero lead | Lead 20/600 | ≤ 120 characters, ≤ 3 lines | One sentence that says what the reader gets, not what the product is. |
| CG-022 | section title | Section head 38/800 | ≤ 40 characters, ≤ 2 lines | Statement, positive, no question mark (CG-005). |
| CG-023 | kicker | Kicker mono 15/700 | ≤ 28 characters, 1 line | Names the section's role (CG-019). |
| CG-024 | lead paragraph | Lead 20/400 | ≤ 160 characters, ≤ 4 lines | One idea, one example. |
| CG-025 | explain-module step line | core 18/700 · detail 15/400 | core ≤ 30, detail ≤ 40 characters, **each exactly one line** | Bold core = the step, normal detail = the addition. The module plus its three lines fit one phone screen; if they do not, the copy is too long — the module does not grow (SRC-014 "Explain module"). |
| CG-026 | CTA label | Button 18/800 + arrow | ≤ 28 characters, 1 line | Verb + object. What happens on tap, in the reader's words. |
| CG-027 | proof card | Card title 21/700 + Meta | claim ≤ 70, context ≤ 140 characters | **State the win.** A proof card is a persuasion, not a report. |
| CG-028 | quote card | Lead 20/400 + mono 15 | quote ≤ 200, name ≤ 40, role + organisation ≤ 60, source ≤ 60 characters | Verbatim, never shortened in a way that changes the sentence; the concrete publication and article as source, with a working link (SRC-014 "Quote card"). |
| CG-029 | newsletter block | Section head + Lead | title ≤ 40, benefit ≤ 120 characters | Name at least two concrete things that arrive: new functions, current offers, how other places do it. |
| CG-030 | context-band entry | Card title + Meta | ≤ 80 characters | One half-sentence naming **audience and content together**, then the link. |
| CG-031 | contact section | Section head + rows | title ≤ 40, lead ≤ 100, action-row title ≤ 24, sub-label ≤ 32 characters | Concrete channels in order, no form, no "nimm Kontakt auf". |
| CG-032 | empty state | Lead + CTA | ≤ 90 characters + one CTA | An invitation, never an error (WEB-F-044/045). |

Examples, all from the review:

- CG-025 — use: core *"Flyer fotografieren"*, detail *"Der Flyer, den ihr eh
  schon gedruckt habt."*
- CG-026 — use: *"Jetzt Kalender anmelden"* (23) · *"Jetzt kostenlos
  anmelden"* (24) · *"Flyer per WhatsApp schicken"* (27). The review's longer
  draft, *"Jetzt deinen ersten Flyer per WhatsApp schicken"* (46), is over
  budget and is shortened when it is written, not when it is measured.
- CG-027 — avoid a report line; the NØRD Award is not "teilgenommen", it is
  won, under Bitkom patronage. **Say that.**
- CG-029 — avoid: *"Neuigkeiten aus dem Projekt"* with no benefit at all.
- CG-030 — use the review's own shape: *"Wie du einfach Termine per WhatsApp
  oder Kalender veröffentlichen kannst"*.
- CG-031 — the three channels in order: Videotermin buchen · per WhatsApp
  schreiben · anrufen oder Mail. Avoid: a general contact form — there is
  none.

---

## 7. Truth

### CG-033 — Nothing literally untrue

A sentence that is poetic and false is false. A reader who knows the field
notices, and the page loses the credibility it was buying.

- Avoid: *"Gebaut in einem Dorf. Betrieben aus einem Dorf."* — it runs in a
  data centre; the person sits in a village.
- Use: the direction the review names instead — *"Vom Dorf fürs Dorf"*.

### CG-034 — No volatile numbers

Traction figures are counted live or not shown (`WEB-F-041`). A number typed
into copy is stale the week after.

- Avoid: *"Seit 2018 in Betrieb, 120 Orte"* · *"8.622 Termine"* ·
  *"Ein Dorf mit rund 400 Einwohnern …"* (Schlatkow has about 280).
- Use: the live list itself, and the gap in it as a hand-off (CG-008).

### CG-035 — No internal meta lines

A label that explains the page to its own authors does not belong on the page.

- Avoid: *"Presse- und Auftrittshistorie 2018 bis 2026"*

### CG-036 — "im Amt" is never the only addressee

The reader may be a Verein, a Stiftung, a Kulturgesellschaft, a
Volkshochschule. `WEB-C-012` holds: municipalities and institutions are not
separated, so copy may not silently address only one of them.

- Avoid: *"Niemand im Amt tippt mehr Termine ein."* · *"Im Amt tippt dafür
  niemand etwas ab."*
- Use: *"Niemand tippt mehr Termine."*

### CG-037 — No promise without a process

A response time, an availability, a permanence promise appears only where an
operational commitment backs it (TS-006 D11). Where the process is unconfirmed
the promise is removed, not softened.

---

## 8. Product naming

### CG-038 — The product name appears exactly once

`DEC-052 §1` and `WEB-C-014`: "Portalize" is introduced once, on
`/dein-kalender` at the 480 € tier, in one sentence. It is never a navigation
label, never a route, never a heading.

### CG-039 — "das Produkt" is not a name

The consequence of CG-038 is that every other place has to call the thing
something. The review rejects the placeholder that produced:

- Avoid: *"und mit dem Produkt"* — the comparison column against *"HEUTE:"*.
- Use: the thing itself, in the reader's words — *"euer Kalender"*,
  *"der Dorfkalender"*.

**Open.** Whether the product keeps the name at all is an open decision (see
below). Until it is taken, CG-038 and CG-039 are in force together, and no
page writes "das Produkt" to work around them.

---

## 9. Words — use and avoid

Binding per locale. DE is authored, EN mirrors it (CG-041). The canonical
vocabulary is not here: geographic terms, product terms and roles come from
the bilingual glossary (SRC-016, becoming `@schafe-vorm-fenster/glossary`,
DEC-062). `specs/glossary/glossary.md` carries the per-term columns; this list
is the website's additions and the ones the review supplied.

### CG-040 — The avoid list fails the build

A hit in page copy is an error, not a finding (`copy-contract.md`, and
TS-007 D12).

**German**

| Avoid | Use instead | Why |
| --- | --- | --- |
| die Leute | die Nachbarn · das Nachbardorf · die Neuen · wer hier etwas organisiert | CG-009 |
| die Firma | Schafe vorm Fenster | CG-004 |
| im Amt (as the only addressee) | bei euch | CG-036 |
| das Produkt | euer Kalender · der Dorfkalender | CG-039 |
| Vereinswebseite | eure eigene Website | not only Vereine |
| Postleitzahl · PLZ | Ortsname | DEC-079 — a place name is where you are from, a postcode is an abstraction |
| Organizer | Akteur | DEC-062 — nothing user-facing says Organizer |
| Portalize (outside the one sentence) | Kalender | WEB-C-014, DEC-052 §1 |
| Warum das zählt | Was hilft euch das? | CG-018 |
| Warum wir | Über uns · Wer dahintersteckt | CG-017 |
| Wo das herkommt *(as a heading)* | | CG-017 — the review names no replacement |
| Wer das schon macht | Was andere sagen *(for press proof only)* | CG-017 |
| Warum es hakt · Warum es heute hakt *(as a title)* | | CG-005 — allowed as a kicker |
| gebaut · betrieben *(about this product)* | | CG-033 |
| einfach · digital · für alle · modern · innovativ | | generic claims are not copy (TS-006 D7, WEB-F-008) |
| Presse- und Auftrittshistorie | | CG-035 |
| Beides gibt es · Dieselben Termine · Der Name der Firma | write the thing out | CG-004 |
| Genau so. | | CG-016 |

**English** — the mirror, same rules, same ids.

| Avoid | Use instead |
| --- | --- |
| the people | the neighbours · the next village · the newcomers |
| the company | Schafe vorm Fenster |
| at the council (as the only addressee) | at your end |
| the product | your calendar · the community calendar |
| club website | your own website |
| ZIP code · postcode | place name |
| Organizer | actor |
| Portalize (outside the one sentence) | calendar |
| Why this matters | What does this do for you? |
| simple · digital · for everyone · modern · innovative | |
| built in a village · operated from a village | |

### CG-041 — EN mirrors DE, and is not a translation of the page

The English file is generated from the same source record with the same
playbook, never translated from the German file (TS-007 D8.5). What must match
is the claim, the record, the CTA target and the numbers; what may differ is
the phrasing (TS-007 D8.6). Original artifacts — a clipping headline, a quoted
sentence, an award's own name — stay in their language (DEC-026).

---

## How a generator uses this

Nothing here is read by a generation run as prose. It reaches a run in three
forms, and the binding of each rule to its form is `copy-contract.md`:

1. **The schema** (`src/domain/content/`, TS-007 D5). Every field carries a
   `describe()` naming the rule that governs it and a `max()` carrying its
   budget from §6. A guide sentence that never becomes a `describe()` or a
   `max()` is guidance a generator will not follow.
2. **The glossary** (`specs/glossary/glossary.md`, TS-007 D9). The use column
   is what a generator writes; the avoid column is what it may not. Both are a
   production input, not documentation.
3. **The lint** (`pnpm check:content`, TS-007 D12). The avoid list and the
   forbidden patterns of §2 run as rows that exit non-zero with file, field
   and term named. Nothing on that list warns.

The rules a machine cannot check — whether a heading is flat, whether an
example is picturable, whether a proof card states a win — are the human
review at the editorial gate (TS-007 D11), listed as such in the contract.

## Do Not

- No back-reference to an earlier section.
- No question as a section title, and no question that the block does not
  answer.
- No "die Leute", no abstract group where a real one exists.
- No concept where the benefit fits.
- No claim without an example.
- No word doubling, no padding line, no sentence that repeats the one above.
- No typed traction figure, no internal meta line, no sentence that is
  literally untrue.
- No `Sie`, on any page, in any field.
- No "das Produkt", and no second occurrence of the product name.

## Open decisions

Five, and the guide states the current rule for each. Until a decision is
taken, what is written above is in force.

| # | Decision | Options | In force today |
| --- | --- | --- | --- |
| 1 | **Product name** | (a) keep "Portalize", introduced once (`DEC-052 §1`, Q-012); (b) a new name that carries in the German Ehrenamt context. | (a), plus CG-039 — no page writes "das Produkt" |
| 2 | **Headings the review rejects without a replacement** | The provenance section and the two proof sections need headings. The review rejects *"Wo das herkommt"*, *"Wer das schon macht"* and *"Presse- und Auftrittshistorie"* and names a replacement for one of the three only. | The rejections hold; the empty cells stay empty until the hub's principles carry the wording |
| 3 | **Where the brand-level word rules live** | (a) the hub's `tone-of-voice.md` gains the word-level anti-patterns and this guide keeps only the website's cut; (b) this guide carries both until the hub catches up. | (a) is the target — the hub is being written in parallel; (b) is the state while it is |
| 4 | **Glossary home** | `specs/glossary/glossary.md` is a production input carrying copy words (TS-007 D9, Q-057). Does the register stay in `specs/` once it is one, or move into `@schafe-vorm-fenster/glossary`? | It stays in `specs/` and the two columns live there |
| 5 | **Budget authority** | §6's numbers are derived from the type scale. The component manifest (SRC-013 §1) is meant to own them. | §6 is in force; a component budget supersedes its row on arrival, and the row records the derivation so the replacement is comparable |

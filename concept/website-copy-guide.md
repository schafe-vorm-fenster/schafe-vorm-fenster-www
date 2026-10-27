---
title: "Website Copy Guide — www.schafe-vorm-fenster.de"
created_at: 2026-09-23
updated_at: 2026-10-27
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

Both informal. This is **number, not register**: DEC-0066 fixes one register,
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

The page's default follows `audiences[0]` in `page.meta.ts` (TS-WEB-0006 D1). A
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
stylistic finding (DEC-0066).

**One exemption, and it is a whole page: `/rechtliches`.** Decision 14
(2026-09-23) exempts the page, not only the five imported documents on it.
Impressum, Datenschutzerklärung, AGB, Widerrufsbelehrung and
Nutzungsbedingungen are rendered verbatim (TS-WEB-0029 D2, DEC-0012, DEC-0027) and
their source register is `Sie`; a page that switches to `du` in its own
headings and back to `Sie` inside every document would read as two voices
arguing, and editing the documents to fix that would change legal text.
Exempting the page instead keeps one voice on it.

The exemption is precise:

- **Scope** is the route `/rechtliches` and its localised sibling, whole —
  headings, intro lines, link labels, the table of contents, and the
  imported bodies alike.
- **Nothing inherits it.** Not a legal sentence quoted on another page, not
  a footer link label, not a form's consent line, not an error message
  — those are `du` like everything else. A carve-out that travels with the
  text would exempt the site.
- **Mechanically** it is a path allowlist of exactly one route in the
  CG-003 lint row, not a per-field opt-out and not a directive in a content
  file (`copy-contract.md`). One entry is auditable; a flag is not.
- CG-002 lists `/rechtliches` as a `du` page. That row governs *number*
  (`du` against `ihr`) and is unaffected: a page outside the register rule
  has no number to choose either.

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
- Use: *"Was drinsteht, bestimmt ihr"* · *"So kommen eure Termine rein"* ·
  *"So sieht es aus, wenn es bei euch steht"*.
- **A problem kicker is legal only after the solution has been said** (CG-042).
  Until 2026-10-12 this rule offered kicker *"Warum es heute hakt"* over title
  *"Wer euren Termin heute nicht mitbekommt"* as the model split. The owner's
  review of 2026-10-12 rejects it on two pages: on `/mitmachen` it puts the
  problem before the solution, and on `/dein-kalender` the title announces
  people while the section shows a comparison. The pair is no longer a model.

### CG-006 — A question only to the reader, answered next

A question is allowed where it is addressed to *the reader* and the next
sentence answers it. A question that rhetorically restates a fact is a
statement with the wrong punctuation.

- Avoid: *"und der Termin steht im Kalender?"* — he does stand in it; say so.
  *"Ein eigener Kalender auf der eigenen Website, ohne eigenes System
  dahinter?"*
- Use: kicker *"Was hilft euch das?"*, answered by the section beneath it.

### CG-007 — One idea per section

A second mechanism is a second block (TS-WEB-0006 D7). A second argument is a
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

### CG-042 — The solution comes first, the problem second

A section that names a problem ("Warum es heute hakt") must not also explain
the solution, and a solution must not wait behind its own problem. Owner's
review of 2026-10-12, `/mitmachen`: *"Wir können nicht die Problemfrage stellen
und die Lösung erklären."*

- Order: **the solution in one short sentence first** (*"Fotografier den
  Flyer, schick das Bild per WhatsApp, fertig."*), then the problem section
  that explains why the usual ways fall short.
- The usual ways (what people do today) come **before** the people who miss the
  date because of them. The problem section is self-contained and carries no
  instruction on how to solve it.
- A problem kicker (CG-005) opens a problem section and only that.

### CG-043 — No invented limits, no stand-in sentences

A limit that a section needs and the guide does not hold is written as
`UNKNOWN` with a question, never filled with a plausible number (AGENTS.md,
the rule that governs every requirement). A proof line is a sentence (CG-027),
not a string of keywords; a label that stands in for a sentence is a defect,
not a style.

### CG-044 — One job, one module, one heading

A page says each job once. A module and the closing block never carry two
headings for the same job, and a closing block that repeats a module's action
is that module, not a second one beside it. Owner's review of 2026-10-27,
`/dein-ort` (issue #86): *"Das erste und dritte Modul gehören zusammen und sind
inhaltlich dasselbe."* — "So landet der Kalender auf deinem Homescreen", the
context band, then "Einmal antippen, und er ist da, wo deine Apps sind." with
the same handover.

- Where a module's heading and a closing heading name the same job, the module
  keeps the heading that names what it contains; the other is removed, not
  reworded into a third (`DEC-0170` §4).
- A proof quote is the end of a story, not a caption: it never stands as text
  under a list of dates, and two quotes do not follow each other across a
  section boundary (SRC-0014 §Page Rhythm, `DEC-0170`).

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
invention (TS-WEB-0007 D2).

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

**Direct address holds on every page, `/dein-ort/starten` included — there
is no carve-out here and none is needed.** `TS-WEB-0021 D9` said the activation
page must "never" address the reader directly, and `DEC-0071 §4` carried the
same carve-out; **both are retired** by decision 15 (2026-09-23). The rule
they were written against no longer exists, so this guide does not gain an
exception to a rule nobody holds — CG-012 and CG-008 read exactly as they
did before, and they now read the same way everywhere.

Why it went: `/dein-ort/starten` is the page a person reaches after typing
their own village and not finding it. Refusing to say *dein Ort* to someone
who just typed it is the one place the distance is most expensive, and the
page's whole job — CG-008's hand-off, "Fehlt deine Veranstaltung, jetzt
selbst eintragen" — is a sentence the old rule forbade.

Anything still citing `TS-WEB-0021 D9`'s "never direct" is citing a retired
determination; the spec rows are the parallel owner's to correct.

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
- Use **as a kicker**: *"Warum ist das wichtig?"* · *"Was sind die Vorteile?"*

**Both of those are questions, and a question is not a section title.**
CG-005 makes a `?` in a section title a build failure, and these sit under a
"Headings" chapter, which read as permission to write one. It is not.

Read CG-018 as the two-part move CG-005 already describes: the reader's
question goes in the **kicker**, and the **title** beneath it answers. The
kicker/title pair must still obey CG-042 (solution first) and CG-004 (the title
has to announce what the section actually shows).

**One phrase for the whole "benefit" role, repeated on every section that
plays it, is the same defect CG-018 forbids under a different name
(DEC-0148).** `WAS HILFT EUCH DAS?` (CG-019) was one fixed string on five
sections across three pages — asking the reader the exact same question
five times reads as the internal analysis prompt it started as, not as
signposting written for a reader. CG-019's benefit row is now per section:
each instantiation names what its own section is actually about, still a
declarative kicker, not a question.

So: a question form is legal **only as a kicker**, and only where the
section that follows answers it (CG-006). A section title is a statement,
always, and CG-018 removes the abstraction from it without turning it into
a question. What CG-018 forbids is the *flat abstraction*; what it does not
grant is a question mark one line lower.

### CG-019 — Kicker vocabulary per section role

The kicker names the role the section plays; the title says what goes
(CG-005). One kicker per section, mono uppercase (SRC-0014 "Kicker").

| Section role | The kicker says | From the review |
| --- | --- | --- |
| how it works | that it gets easier | `SO GEHT'S EINFACHER` |
| benefit | what it does for you | per section, not fixed (DEC-0148) — e.g. `WAS EIN DORF BRAUCHT`, `VERSORGUNG`, `GEMEINDELEBEN` |
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
`390 − 2 × 16 = 358 px` (SRC-0014 "Shape and Space"). Each budget is that width
divided by the average advance of the role's type from the SRC-0014 scale, minus
the block's own furniture (a disc, an icon, a trailing arrow). They are
**provisional** in the sense of TS-WEB-0007's open point — the component manifest
(SRC-0013 §1) replaces them with the component's own budget. The derivation is
recorded so a later number can be re-derived instead of re-guessed. In the
schema each one is a `max()` (TS-WEB-0007 D5).

| # | Block / field | Type role | Budget at 390 px | The rule |
| --- | --- | --- | --- | --- |
| CG-020 | hero claim | Display 54/800 | ≤ 42 characters, ≤ 3 lines | Concrete, not cryptic. It has to work for someone who arrived from a search result with no flyer in hand. |
| CG-021 | hero lead | Lead 20/600 | ≤ 120 characters, ≤ 3 lines | One sentence that says what the reader gets, not what the product is. |
| CG-022 | section title | Section head 38/800 | ≤ 40 characters, ≤ 2 lines | Statement, positive, no question mark (CG-005). |
| CG-023 | kicker | Kicker mono 15/700 | ≤ 28 characters, 1 line | Names the section's role (CG-019). |
| CG-024 | lead paragraph | Lead 20/400 | ≤ 160 characters, ≤ 4 lines | One idea, one example. |
| CG-025 | explain-module step line | core 18/700 · detail 15/400 | core ≤ 30, detail ≤ 40 characters **as a target, not a clamp** | Bold core = the step, normal detail = the addition. **Never truncated:** a line that is longer wraps, and the module reserves the height of its longest step (DEC-0154, owner's review 2026-10-12: a module that explains cannot hide its explanation behind "…"). A line over the target is a lint finding, not a cut. **Readability goes before a fixed height:** shorten the copy or make the three steps equally long first, and where every step needs two lines the module's fixed height is two lines (SRC-0014 "Explain module"). |
| CG-026 | CTA label | Button 18/800 + arrow | ≤ 28 characters, 1 line | Verb + object. What happens on tap, in the reader's words. A CTA that leads to a page with more to learn (filters, configuration, white-label design) may carry **one supporting line beneath the button**, never a longer label (DEC-0154). |
| CG-027 | proof card | Card title 21/700 + Meta | claim **a full sentence with a verb** (the 70-character limit is withdrawn, DEC-0154), context ≤ 140 characters | **State the win** in a sentence, not in keywords: *"Wir sind stolz, dass wir den NØRD Award 2026 in der Kategorie Smart Community unter der Schirmherrschaft des Bitkom e.V. gewonnen haben."* — never *"NØRD Award 2026 gewonnen, Kategorie Smart Community, Schirmherr Bitkom."* The new length budget is `UNKNOWN` until the proof card is redesigned (`Q-0086`); no number is invented here (CG-043). |
| CG-028 | quote card | Lead 20/400 + mono 15 | quote ≤ 200, name ≤ 40, role + organisation ≤ 60, source ≤ 60 characters | Verbatim, never shortened in a way that changes the sentence; the concrete publication and article as source, with a working link (SRC-0014 "Quote card"). |
| CG-029 | newsletter block | Section head + Lead | title ≤ 40, benefit ≤ 120 characters | Name at least two concrete things that arrive: new functions, current offers, how other places do it. |
| CG-030 | context-band entry | Card title + Meta | ≤ 80 characters **[PROPOSED — the field does not exist yet]** | One half-sentence naming **audience and content together**, then the link. |
| CG-031 | contact section | Section head + rows | title ≤ 40, lead ≤ 100, action-row title ≤ 24, sub-label ≤ 32 characters | Four concrete channels, always all four and always in the same order, no form, no "nimm Kontakt auf" — and **no sub-label promises a response time**. |
| CG-032 | empty state | Lead + CTA | ≤ 90 characters + one CTA | An invitation, never an error (FUN-WEB-0153, FUN-WEB-0154, FUN-WEB-0045). |

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
- CG-031 — **four** channels, in this order: Videotermin buchen · per
  WhatsApp schreiben · anrufen · Mail schreiben. An earlier version of this
  line collapsed the last two into "anrufen oder Mail"; the section has four
  rows, not three (`TS-WEB-0016 D13`), and phone and mail are two of them even
  though phone and WhatsApp share one number. Avoid: a general contact form
  — there is none. Avoid too: any sub-label that states how fast an answer
  comes ("Antwort noch heute", "innerhalb von 24 Stunden"). No cleared
  source gives a response time for these channels, and CG-033 makes an
  unbacked promise a truth problem, not a tone problem. The sub-label says
  what the row *is* — the number, the address, what a booking covers — not
  what it will do for you.

**CG-030 budgets a field that does not exist**, which is why it carries the
`[PROPOSED]` marker CG-011 carries. A context-band entry is built from the
job registry (`TS-WEB-0006 D5`), and a registry entry has a label and a target
and nothing to put a half-sentence in. The budget is therefore a number
against a hole: until the field lands, a generator writes the entry from the
label alone and CG-030 governs nothing.

What the spec must add, named so it can be asked for rather than inferred:

| What | Where |
| --- | --- |
| A `blurb` field on the context-band entry type — required, one per entry, `max(80)`, `describe()` citing CG-030 | `TS-WEB-0007 D5`'s Zod hierarchy |
| The blurb as a rendered property of `TS-WEB-0006 D5`'s entry, beside label and target, and per locale | `TS-WEB-0006 D5` |
| Where the text comes from: the job registry carries it per job, so the three non-focus entries cannot drift from the fourth page's own description | the job registry, cited by `TS-WEB-0006 D5` |

Two rules already constrain that field before it is written: it is a
**statement**, because CG-005 governs it and `TS-WEB-0006 D5` no longer phrases
the band as a rhetorical question, and it names **audience and content
together**, which is what makes the band an offer rather than a menu.

---

## 7. Truth

### CG-033 — Nothing literally untrue

A sentence that is poetic and false is false. A reader who knows the field
notices, and the page loses the credibility it was buying.

- Avoid: *"Gebaut in einem Dorf. Betrieben aus einem Dorf."* — it runs in a
  data centre; the person sits in a village.
- Use: the direction the review names instead — *"Vom Dorf fürs Dorf"*.
- **A live heading names the window its rows actually span.** *"Diese Woche in
  der Nähe"* over a list that runs into next month is untrue the moment the
  list is filled past the week (issue #83). The nearby module carries the
  page's "this week" heading while every row is inside the seven days, and
  *"Demnächst in der Nähe"* / *"Coming up nearby"* (dictionary
  `live.nearbyUpcoming`) once it is not (`TS-WEB-0008 D3`).

### CG-034 — No volatile numbers

Traction figures are counted live or not shown (`FUN-WEB-0041`). A number typed
into copy is stale the week after.

- Avoid: *"Seit 2018 in Betrieb, 120 Orte"* · *"8.622 Termine"* ·
  *"Ein Dorf mit rund 400 Einwohnern …"* (Schlatkow has about 280).
- Use: the live list itself, and the gap in it as a hand-off (CG-008).
- **A live count is not automatically legal either.** *"Termine, die gerade im
  Kalender stehen — 8.543 Termine"* is counted live, so it passes the first
  sentence, and the owner's review of 2026-10-12 still removes it: the number
  tells the reader nothing. A live figure appears only where it changes what
  the reader does. The home page carries none (DEC-0154).

### CG-035 — No internal meta lines

A label that explains the page to its own authors does not belong on the page.

- Avoid: *"Presse- und Auftrittshistorie 2018 bis 2026"* · *"Beleg aus der
  Region"* (the **field name** of the geo label, printed on the page as if it
  were its text — owner's review 2026-10-12, called a rule break) · anything
  written as an instruction to the author or the generator (a field name, an
  imperative label, "TODO", "Platzhalter").
- A rendered field never takes its value from a label whose job is to tell
  authors what goes there. If the field has no real value, it renders nothing.

### CG-036 — "im Amt" is never the only addressee

The reader may be a Verein, a Stiftung, a Kulturgesellschaft, a
Volkshochschule. `BUS-WEB-0012` holds: municipalities and institutions are not
separated, so copy may not silently address only one of them.

- Avoid: *"Niemand im Amt tippt mehr Termine ein."* · *"Im Amt tippt dafür
  niemand etwas ab."*
- Use: *"Niemand tippt mehr Termine."*

### CG-037 — No promise without a process

A response time, an availability, a permanence promise appears only where an
operational commitment backs it (TS-WEB-0006 D11). Where the process is unconfirmed
the promise is removed, not softened.

### CG-044 — A claim appears once per page

A fact the page has said is not said again on the same page — not as a proof
line under the text, not as a pull quote, not as a teaser. The second time
tells the reader nothing and reads as padding (CG-016) with a source attached.
Owner's review of 2026-10-27, `/ueber-uns` (#104): the chapter text said the
name comes from the time as mayor, and the line under it said again that the
founder had been mayor.

- Avoid: text *"Der Name stammt aus der Amtszeit als Bürgermeister von
  Schmatzin …"*, and right under it *"Der Gründer war selbst ehrenamtlicher
  Bürgermeister — das Amt, dem der Dienst hilft, kennt er von innen."*
- Use: one text that says it once, with what makes it worth saying — the
  period and what followed from it: *"Von 2019 bis 2024 war Jan-Henrik Hempel
  ehrenamtlicher Bürgermeister von Schmatzin … An diese Zeit erinnert der Name
  Schafe vorm Fenster …"* (DEC-0175 §2).

### CG-045 — A source names outlet, date and a working link, or it is omitted

A source line exists so a reader can check the claim. It names the outlet, the
date of the piece and links to it — the article, the portrait, the episode. A
source that cannot be named that precisely is **left out**, and the fact stands
in the text on its own, backed by the hub record in the artefact's
`derived_from`. It is never padded into a vague one. CG-028 already asks this
of a quote card; this rule asks it of every source line.

- Avoid: *"Nordkurier, 2019 und 2022"* — a newspaper and two years, no article
  (owner's review 2026-10-27, #104: *"ohne eine genaue Quelle zu haben"*).
- Use: *"Zukunftswege Ost-Vorpommern: Der Vollblutdigitalisierer von
  Schlatkow"*, linked, with its date — or no source line at all.

---

## 8. Product naming

### CG-038 — The product name appears exactly once

`DEC-0052 §1`, `FUN-WEB-0132` and `CON-WEB-0058`: "Portalize" is introduced
once, on `/dein-kalender` at the 480 € tier, in one sentence (`FUN-WEB-0132`).
It is never a navigation label, never a route, never a heading
(`CON-WEB-0058`). `CON-WEB-0014` was retired into those two by DEC-0093.

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
the bilingual glossary (SRC-0016, becoming `@schafe-vorm-fenster/glossary`,
DEC-0062). `specs/glossary/glossary.md` carries the per-term columns; this list
is the website's additions and the ones the review supplied.

### CG-040 — The avoid list fails the build

A hit in page copy is an error, not a finding (`copy-contract.md`, and
TS-WEB-0007 D12).

**German**

| Avoid | Use instead | Why |
| --- | --- | --- |
| die Leute | die Nachbarn · das Nachbardorf · die Neuen · wer hier etwas organisiert | CG-009 |
| die Firma | Schafe vorm Fenster | CG-004 |
| im Amt (as the only addressee) | bei euch | CG-036 |
| das Produkt | euer Kalender · der Dorfkalender | CG-039 |
| Vereinswebseite | eure eigene Website · *Websites der Akteure* where *eure Website* is the target beside it (DEC-0172 §3) | not only Vereine — and a source is never addressed to the reader whose website is the target |
| Postleitzahl · PLZ | Ortsname | DEC-0079 — a place name is where you are from, a postcode is an abstraction |
| Organizer | Akteur | DEC-0062 — nothing user-facing says Organizer |
| Portalize (outside the one sentence) | Kalender | CON-WEB-0058, DEC-0052 §1 |
| Warum das zählt | Was hilft euch das? | CG-018 |
| Warum wir | Über uns · Wer dahintersteckt | CG-017 |
| Wo das herkommt *(as a heading)* | | CG-017 — the review names no replacement |
| Wer das schon macht | Was andere sagen *(for press proof only)* | CG-017 |
| Warum es hakt · Warum es heute hakt *(as a title)* | | CG-005 — allowed as a kicker |
| gebaut · betrieben *(about this product)* | | CG-033 |
| einfach · digital · für alle · modern · innovativ | | generic claims are not copy (TS-WEB-0006 D7, CON-WEB-0059) |
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
| club website | your own website · *local groups' websites* where *your website* is the target beside it |
| ZIP code · postcode | place name |
| Organizer | actor |
| Portalize (outside the one sentence) | calendar |
| Why this matters | What does this do for you? |
| simple · digital · for everyone · modern · innovative | |
| built in a village · operated from a village | |

### CG-041 — EN mirrors DE, and is not a translation of the page

The English file is generated from the same source record with the same
playbook, never translated from the German file (TS-WEB-0007 D8.5). What must match
is the claim, the record, the CTA target and the numbers; what may differ is
the phrasing (TS-WEB-0007 D8.6). Original artifacts — a clipping headline, a quoted
sentence, an award's own name — stay in their language (DEC-0026).

---

## How a generator uses this

Nothing here is read by a generation run as prose. It reaches a run in three
forms, and the binding of each rule to its form is `copy-contract.md`:

1. **The schema** (`src/domain/content/`, TS-WEB-0007 D5). Every field carries a
   `describe()` naming the rule that governs it and a `max()` carrying its
   budget from §6. A guide sentence that never becomes a `describe()` or a
   `max()` is guidance a generator will not follow.
2. **The glossary** (`specs/glossary/glossary.md`, TS-WEB-0007 D9). The use column
   is what a generator writes; the avoid column is what it may not. Both are a
   production input, not documentation.
3. **The lint** (`pnpm check:content`, TS-WEB-0007 D12). The avoid list and the
   forbidden patterns of §2 run as rows that exit non-zero with file, field
   and term named. Nothing on that list warns.

The rules a machine cannot check — whether a heading is flat, whether an
example is picturable, whether a proof card states a win — are the human
review at the editorial gate (TS-WEB-0007 D11), listed as such in the contract.

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
- No problem section that also explains its solution, and no problem before the
  solution (CG-042).
- No proof line in keywords, no truncated explanation, no field name or
  working label on the page (CG-027, CG-025, CG-035).
- No `Sie`, on any page, in any field — except `/rechtliches`, which is
  exempt as a whole page and exempts nothing else (CG-003).
- No claim twice on one page (CG-044), and no source line that names no
  article — outlet, date and link, or nothing (CG-045).
- No placeholder for a missing proof: no "Beleg fehlt", no sentence naming
  the gap. A missing proof renders nothing (DEC-0175 §3, TS-WEB-0007 D11).
- No "das Produkt", and no second occurrence of the product name.
- No "(öffnet neuen Tab)" in a link's label or a CTA label. A link to another
  origin always opens a tab (`DEC-0169`); the dictionary's `outboundLink.newTab`
  is read to a screen reader through `aria-describedby`, and the eye gets the
  `external-link` glyph. The label states the action only (CG-026).

## Open decisions

Five, and the guide states the current rule for each. Until a decision is
taken, what is written above is in force.

| # | Decision | Options | In force today |
| --- | --- | --- | --- |
| 1 | **Product name** | (a) keep "Portalize", introduced once (`DEC-0052 §1`, `FUN-WEB-0132`); (b) a new name that carries in the German Ehrenamt context. Open as **Q-0077** since DEC-0106 — Q-0012 answered only *where* the name appears. | (a), plus CG-039 — no page writes "das Produkt" |
| 2 | **Headings the review rejects without a replacement** | The provenance section and the two proof sections need headings. The review rejects *"Wo das herkommt"*, *"Wer das schon macht"* and *"Presse- und Auftrittshistorie"* and names a replacement for one of the three only. | The rejections hold; the empty cells stay empty until the hub's principles carry the wording |
| 3 | **Where the brand-level word rules live** | (a) the hub's `tone-of-voice.md` gains the word-level anti-patterns and this guide keeps only the website's cut; (b) this guide carries both until the hub catches up. | (a) is the target — the hub is being written in parallel; (b) is the state while it is |
| 4 | **Glossary home** | `specs/glossary/glossary.md` is a production input carrying copy words (TS-WEB-0007 D9, Q-0057). Does the register stay in `specs/` once it is one, or move into `@schafe-vorm-fenster/glossary`? | It stays in `specs/` and the two columns live there |
| 5 | **Budget authority** | §6's numbers are derived from the type scale. The component manifest (SRC-0013 §1) is meant to own them. | §6 is in force; a component budget supersedes its row on arrival, and the row records the derivation so the replacement is comparable |

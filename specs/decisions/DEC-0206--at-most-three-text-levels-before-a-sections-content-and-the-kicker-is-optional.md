---
id: DEC-0206
title: At most three text levels before a section's content, the kicker is optional, and the levels repeat nothing
status: DRAFT
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #163. The owner, 2026-11-12: many sections stack too many text formats
before their content — a kicker, a transition sentence, the heading, a lead,
sometimes an in-between line — and the page reads restless.

The analysis on the issue
(<https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/163#issuecomment-6822973490>)
traced the stack to one rule: polish brief G-3, *"Each section after the hero
opens with a kicker … and where the argument moves, a one-line transition
sentence"*. G-3 lives in `plan/`, not in `specs/`; it reached the
specification only through the two decisions that deviate from it (DEC-0120
§5, DEC-0129 §9), the comment on `section-shell`'s `kicker` prop, the comment
on `dictionary.ts`'s kicker vocabulary and one e2e test
(`e2e/pages/mitmachen.spec.ts`). Of 43 sections, 19 stood three or more text
levels before their content and three stood four; about twelve kickers
repeated their own heading (*"Wer den Kalender nutzt"* over *"Wo es wirklich
benutzt wird"*, three times on three pages).

## The owner's decision

Verbatim, issue #163, 2026-11-12
(<https://github.com/schafe-vorm-fenster/schafe-vorm-fenster-www/issues/163#issuecomment-6823063207>):

> Owner-Entscheidung 12.11.: Variante A in dieser Fassung:
>
> 1. Vor dem Inhalt stehen höchstens drei Textebenen: Dachzeile/Kicker, Überschrift, Einleitung. Überleitungssätze und Zwischenzeilen sind keine eigene Ebene mehr: Sie werden zur Einleitung oder entfallen.
> 2. Die Überschrift ist Pflicht. Der Kicker ist optional und steht nur da, wo er etwas sagt, was die Überschrift nicht sagt (Frage, Problemrahmung, Rolle).
> 3. Keine Wiederholung zwischen den Ebenen: Kicker, Überschrift und Einleitung wiederholen weder Wortstamm noch Aussage (z. B. nicht „Wer den Kalender nutzt“ über „Wo es wirklich benutzt wird“).
>
> Umsetzung: PR 1 Regel (DEC-0206, Regeltexte, automatischer Check zunächst als Warnung). Danach Sections seitenweise, sobald die laufenden PRs der jeweiligen Seite gemergt sind.

## Decision

### 1. At most three text levels before a section's content

Before the content of a section — its module, list, cards, form, quote —
stand at most three text levels, in this order: **kicker**, **heading**,
**intro**. A transition sentence and an in-between line are no level of their
own: each becomes the intro or goes. A label that does the kicker's job (a
chapter ordinal, an award seal) counts as the kicker.

### 2. The heading is required, the kicker optional

Every section after the hero has a heading. A kicker stands only where it says
something the heading does not: a **question** (CG-018), a **problem framing**
(CG-005) or a **role** the heading leaves unsaid. "No section may begin with
only a heading on a new colour" (G-3) is withdrawn: a strong heading on its
ground orients the reader without a label above it.

### 3. The levels repeat nothing

Kicker, heading and intro repeat neither a **word stem** nor a **statement**.
A kicker that names in other words what the heading already says goes.

### 4. Where the rule now stands

| Where | What changed |
| --- | --- |
| `TS-WEB-0006` D12 and `TS-WEB-0006-A21` | The rule as a determination of page composition, and its criterion |
| `concept/website-design-system.md` (SRC-0014) §Kicker | The kicker is optional and the head holds three levels at most |
| `concept/website-copy-guide.md` (SRC-0017) CG-005, CG-018, CG-019, CG-023, CG-024 | The kicker is optional; question and problem framing keep the kicker as their place; no stem shared with the heading; the intro is the third level |
| `plan/polish-brief.md` G-3, G-4 | G-3's duty withdrawn and pointed here; G-4's "its own kicker each" dropped |
| `src/components/section-shell/section-shell.tsx`, `src/lib/i18n/dictionary.ts` | The comments that stated the duty |
| `specs/contracts/copy-contract.md` CG-019 row | The three-level rule and the stem check named as mechanism |

### 5. The check, first as a warning

`e2e/section-heads.spec.ts` (`TS-WEB-0006-A21`) reads every section after the
hero on every measured route at 390 px, counts the text levels before its
content and compares the levels' word stems; `e2e/support/section-heads.ts`
defines both. A breach is a **warning annotation**, not a failure, because
the owner ordered the work: this rule first, the sections page by page once
each page's running PRs have landed. Each page PR clears its lines; the last
one turns the warning into an assertion. A repeated **statement** in other
words is beyond a stem and stays a review item.

The rendered DOM is the instrument, not the content files: a section's head
is composed in three places — the shell's kicker and transition, the page's
heading, a module's own lead — and only the page shows all three together.

### 6. Earlier decisions this touches, not rewritten

- **DEC-0120 §5** and **DEC-0129 §9** recorded a section without a kicker as
  a deviation from G-3. Under this decision neither is a deviation any more;
  both records stand as written.
- **DEC-0143** (the proof kicker `kickers.customers` stays while the heading
  follows the proof kind) and **DEC-0148** (a benefit kicker per section) fix
  kicker/heading pairs. Each pair is now subject to §2 and §3, and the page
  PRs decide per section whether its kicker stays. Neither record is amended
  here.
- **Polish brief Part B** prescribed kickers and transitions per page. It is
  an executed work order, not a rule, and is not carried forward where it
  conflicts with §1–§3.

### 7. Status, and the decision record beside this one

Every artefact this decision touches stays `DRAFT` (`POL-GRADED-BY-IMPACT`,
DEC-0089). `SDR-2026-1112-0001.yaml` records the decision point the owner
executed: DP-04 conflict resolution — the conflict between G-3's duty and the
sections the specification itself exempted from it (DEC-0120 §5, DEC-0129 §9)
— mode `HUMAN`, outcome resolved, record status `PROPOSED`. It moves no
status. It names its policy by its title, not by its identifier, because
`check:specs` E15 lets any record that names an artefact **and** cites the
policy identifier anchor that artefact's status move, whatever the record's
own status; a record that changes nothing should not open that door
(state/open.md).

## Consequences

- The 2026-11-12 inventory turns into the work list of the follow-up PRs
  (one per page), carried on the PR of this decision and on issue #163.
- `e2e/pages/mitmachen.spec.ts` no longer asserts a kicker on every section;
  it asserts the paths slot's three levels and, where the proof section keeps
  its stand-in kicker, its `data-demo` mark.
- `src/lib/content/validate.ts` is unchanged: a question still belongs in the
  kicker, which §2 keeps for exactly that.
- The context band (TS-WEB-0006 D5) is chrome with a heading and a kicker,
  two levels; the check leaves it out, and its kicker's position is unchanged.

---
artefact: contract
id: SRC-018
status: DRAFT
date: 2026-09-23
updated: 2026-09-24
decisions: [DEC-066, DEC-080]
---

# Copy Contract

What the website's machinery owes the copy guide. Written as a binding
between `concept/website-copy-guide.md` (SRC-017) and the mechanisms that
already exist — the Zod schema, `pnpm check:content`, the e2e suite and the
editorial gate — so that a rule in the guide is either enforced somewhere or
is recorded as human review.

It is the copy counterpart of the design-system contract (SRC-013) and reads
the same way: the guide says what is right, the contract says who catches it
being wrong.

## The rule of this contract

**Every rule of SRC-017 carries exactly one owning mechanism.** A rule with no
mechanism is not a rule; it is advice, and advice does not survive forty
content files. Where the owning mechanism is `review`, that is a
determination, not a gap — some things a linter cannot see — and it is
written down so nobody later assumes a check exists.

| Mechanism | What it is | Where it runs |
| --- | --- | --- |
| `schema` | a `max()` or a `describe()` on a field in `src/domain/content/` | TS-007 D5, checked by TS-007-A1 |
| `lint` | a row of `pnpm check:content` — exits non-zero, names file, field and term | TS-007 D12, checked by TS-007-A13 |
| `e2e` | an assertion against rendered copy at a stated viewport | the page specs' own acceptance criteria |
| `review` | the editorial decision point; a person, at the gate | TS-007 D11, TS-006-A16 |

A `lint` row never warns (TS-007 D12). A `schema` budget is the number the
generator writes against, not a limit discovered afterwards.

## The rules

`CG-###` ids are stable and citable: a spec row, an acceptance criterion or a
content `describe()` names the rule rather than restating it.

### Register

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-001 `du` to a person, `ihr` to an organisation | `schema` · `review` | Each field's `describe()` names the page's default address (SRC-017 §1); which number a given block takes is judgement. |
| CG-002 one address per page, a block departs whole | `lint` · `review` | Lint: one field containing both a `du`/`dein`/`dich` form and an `ihr`/`euer`/`euch` form fails. Whether a whole block may depart is review. |
| CG-003 no `Sie` | `lint` | A capitalised `Sie`, `Ihnen`, `Ihre*` mid-sentence, or an imperative `<Verb> Sie`, fails. This is the register check DEC-066 asks TS-007 D12 for. **One exemption, as a path allowlist of exactly one route**: `/rechtliches` and its localised sibling, whole — decision 14, 2026-09-23 (TS-029 D2, DEC-012, DEC-027). It is a route list in the lint row, never a per-field opt-out and never a flag in a content file, so the exemption is auditable in one place. Nothing inherits it: a legal sentence quoted elsewhere, a footer link, a consent line and an error message are all `du`. |

### Structure

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-004 sections are self-contained | `lint` · `review` | Lint: the back-reference phrases of the avoid list (`Beides gibt es`, `Dieselben Termine`, `Der Name der Firma`). The general rule is review. |
| CG-005 a section title is a positive statement | `lint` · `e2e` · `review` | Lint: a `?` in a section-title field fails. E2e: no `h2` of a rendered page ends in `?`. "States what works" is review. |
| CG-006 a question only to the reader, answered next | `review` | Reader-directedness and the answering sentence are meaning, not pattern. |
| CG-007 one idea per section | `schema` · `review` | Schema: a scene block declares exactly one `mechanism` (TS-006 D7, A8). A second argument in one section is review. |
| CG-008 every section hands off | `review` | — |

### Concreteness

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-009 real people with roles, never "die Leute" | `lint` | Avoid-list row. |
| CG-010 the benefit, not the concept | `review` | — |
| CG-011 one example per claim | `schema` · `review` | Schema: the claim-carrying types declare an `example` field [PROPOSED — the field does not exist yet]. Whether the example is picturable is review. |
| CG-012 address whoever acts | `review` | No page-scoped carve-out exists or is needed. `TS-021 D9`'s "never direct" on `/dein-ort/starten` and the `DEC-071 §4` exception are **retired** (decision 15, 2026-09-23); direct address holds everywhere, so this rule and CG-008 need no exception list. A spec row still citing "never direct" cites a retired determination. |

### Economy

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-013 short words | `review` | — |
| CG-014 short sentences | `schema` · `review` | The field's `max()` does the structural work; splitting versus subordinating is review. |
| CG-015 no word doubling | `lint` | The same stem (first five characters, case-insensitive, words of six characters or more) twice in one field fails. |
| CG-016 no padding | `review` | — |

### Headings

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-017 casual, never flat | `lint` · `review` | Lint: the four rejected headings are avoid-list rows. Flatness in a new heading is review. |
| CG-018 no abstraction heading | `lint` · `review` | Same shape — the rejected headings are avoid-list rows, flatness is review. CG-018's *use* examples are **question forms and are legal only as kickers**; the CG-005 lint (a `?` in a section-title field fails) is unchanged by them and is what keeps the two apart. A generator that reads CG-018 as permission to title a section *"Was hilft euch das?"* fails that row, which is the intended outcome. |
| CG-019 kicker vocabulary per section role | `review` | The role table has three deliberately empty rows (SRC-017 §5); a lint over it would enforce a gap. |

### Block budgets

All thirteen are `schema` — one `max()` per field, the number from SRC-017 §6.
**Five of them carry something a `max()` cannot express**, and each has its
own row below; the other eight share the first row and are listed there once.
(This table used to announce "three exceptions" over four rows and to name
CG-027 both in the shared row and in its own. Both are fixed: the count is
five and every rule appears exactly once.)

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-020 – CG-024, CG-029, CG-031, CG-032 | `schema` | `max()` per field; over budget fails the parse (TS-007-A1) and the `check:content` run (TS-007 D12 row 2). Eight rules. |
| CG-025 explain-module step line | `schema` · `e2e` | `max()` per line, **plus** an e2e assertion that neither line wraps at 390 px and that the module with its three lines fits one viewport height (SRC-014 "Explain module"). Both assertions are **below `lg`**: from the tablet breakpoint the three steps stand side by side and the one-viewport constraint does not apply. |
| CG-026 CTA label | `schema` · `e2e` | `max()`, plus an e2e assertion that no button label wraps at 390 px. |
| CG-027 proof card states the win | `schema` · `review` | The budget is schema; "a persuasion, not a report" is review. |
| CG-028 quote card | `schema` · `lint` · `review` **[PROPOSED — none of these fields exists yet]** | Schema: `quote`, `quote_author`, role, organisation and `source_url` all required on a quote card. Lint: a quote card whose `source_url` does not resolve fails. Verbatimness is review. **No schema carries `quote`, `quote_author`, `quote_date` or `source_url` today** — on the website's content types or on the hub's proof records — so both mechanisms are proposed, not live. The fields are a hub change request (proof schema) plus a website content type; until they land, a quote card cannot be authored at all, which is the honest state and better than a lint that silently passes over absent fields. |
| CG-030 context-band entry | `schema` **[PROPOSED — the field does not exist yet]** | `max(80)` on a `blurb` field that `TS-006 D5`'s entry and `TS-007 D5`'s hierarchy do not have. SRC-017 §6 names what must be added: a required per-entry `blurb`, sourced from the job registry so the three non-focus entries cannot drift from the fourth page's own description. Until then the budget governs nothing. |

### Truth

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-033 nothing literally untrue | `review` | The single most expensive rule to get wrong, and the only mechanism for it is a person who knows the facts. |
| CG-034 no volatile numbers | `lint` | A numeral of three digits or more, or a bare year, in a claim field of `hero`, `value-story`, `trust-block` or `proof-card` fails unless the field is read from an offering or a live module (WEB-F-041; TS-008-A10 asserts the rendered side). |
| CG-035 no internal meta lines | `lint` | Avoid-list row. |
| CG-036 "im Amt" is never the only addressee | `lint` | A field containing `im Amt` must also name one of `Verein`, `Stiftung`, `Kulturgesellschaft`, `Volkshochschule`, `Akteur` — otherwise it fails (WEB-C-012). |
| CG-037 no promise without a process | `lint` | `pnpm check:terms` already is this row for the two-working-day wording (TS-026-A8, TS-006 D11); a further promise extends the same list. |

### Naming

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-038 the product name appears exactly once | `lint` | `Portalize` occurs in exactly one content field across all locales, and that field belongs to the `/dein-kalender` tier slot. The existing navigation-label row (TS-007 D12 row 11) stays as it is. |
| CG-039 "das Produkt" is not a name | `lint` | Avoid-list row. |

### Words

| Rule | Mechanism | The check |
| --- | --- | --- |
| CG-040 the avoid list fails the build | `lint` | The list is `specs/glossary/glossary.md`'s **avoid** column plus SRC-017 §9; a hit reports file, field and term. This is TS-007 D12 row 11 widened from one term to a register. |
| CG-041 EN mirrors DE | `lint` | TS-007 D12 rows 7 and 8 already carry it — locale completeness and harmonisation (TS-007-A9). Nothing new is needed; it is listed so the guide's §9 has an owner. |

## Counts

41 rules, counted from the tables above rather than estimated: **17** carry a
`lint` row, **17** a `schema` obligation, **3** an `e2e` assertion, and **19**
name `review` as an owning or co-owning mechanism. Most rules carry two.

**Eight are review-only** — no machine sees them at all: CG-006, CG-008,
CG-010, CG-012, CG-013, CG-016, CG-019, CG-033. Three more are half-manual,
where a mechanism holds the measurable part and a person holds the judgement:
CG-001 (which number a block takes), CG-011 (whether the example is
picturable), CG-027 (whether the card states a win).

**Three are `[PROPOSED]`** — the mechanism is named and the field it would
run over does not exist yet: CG-011 (`example`), CG-028 (`quote`,
`quote_author`, `quote_date`, `source_url`) and CG-030 (`blurb`). They are
counted above because the obligation is real and citable; they are marked
here because a rule whose mechanism cannot run yet must not be mistaken for
one that passes. The counts do not change when the fields land — only the
markers go.

## The interface to TS-006 and TS-007

**TS-006 — page composition.** Owns the rules that are true of a page's
*structure*: D7 (scenes — statement openers, one mechanism, self-contained
blocks, the avoid list) and A8 (the static side of it) and A16 (the reviewed
side). The block-order, conversion and pricing rules of TS-006 are untouched
by this contract.

**TS-007 — content pipeline.** Owns the rules that are true of a *file*:

| What TS-007 owes | Where |
| --- | --- |
| a `describe()` per field naming its governing `CG-###` | D5 |
| a `max()` per field carrying its SRC-017 §6 budget | D5 |
| the glossary's use and avoid columns as a production input | D9 |
| the lint rows of this contract as `check:content` rows | D12 |
| the human rules of this contract at the editorial gate | D11 |

**What this contract does not own.** Which copy is written, and when — that is
the content phase (WEB-F-087). Which claims may be made at all — SRC-001 and
the offering records. How copy is laid out — SRC-014.

## Consequence for the specs

A spec row cites a `CG-###` instead of restating a wording rule, the same way
it cites a `DEC-###` instead of restating a decision. When a rule changes, the
guide changes and every citing row still resolves — which is the whole reason
the ids exist.

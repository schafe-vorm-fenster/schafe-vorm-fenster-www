# Specs

This folder holds the specification for the website relaunch. Writing specs
is the **current phase** of the project — see the root `README.md` for the
three phases and their order.

## The Two Sources

### 1. STRICT — how a spec is written

**Framework:** STRICT — *Systematic Thorough Requirements for Integrated
Consistency and Traceability*.

**Installed as:** `@leafcutter-strict/blueprint-complete@0.2.4`, a
devDependency of this repository (DEC-0085). The `@leafcutter-strict` and
`@leafcutter-os` scopes resolve to `https://packages.leafcutteros.ai/`
through `.npmrc`; reading them needs no credential.

All specs in this folder are written against STRICT, at that version. The
framework is an inventory of atomic, separately installable packages in
eight families — `foundation-*`, `role-*`, `method-*`, `library-schemas`,
`skill-*`, `playbook-*`, `agent-*` and `blueprint-*`. A blueprint is a
curated selection and carries no content of its own; `blueprint-complete`
selects all of them, because this repository does bootstrap, delivery and
assurance work at once (DEC-0085 §1).

**Reference a STRICT artefact by package name, never by path** — the same
rule `DEC-0042` set for hub content. `@leafcutter-strict/method-statement-grammar`,
not a directory. The nine method packages this specification leans on
hardest:

| What it settles | Package |
| --- | --- |
| identifiers and source locators | `@leafcutter-strict/method-identifier-and-locator-schema` |
| functional · quality · constraint · business rule | `@leafcutter-strict/method-requirement-classification` |
| the sentence form each class takes | `@leafcutter-strict/method-statement-grammar` |
| `S0–S3` and the gates it opens | `@leafcutter-strict/method-evidence-sufficiency-rating` |
| the six-dimension source rating behind a trust level | `@leafcutter-strict/method-source-quality-rating` |
| the chain, and what an orphan actually is | `@leafcutter-strict/method-chain-linkage` |
| admit · map · reject, and the three tiers | `@leafcutter-strict/method-glossary-policy` |
| naming a defect so it becomes a demand | `@leafcutter-strict/method-defect-taxonomy` |
| the output contracts the checker reads | `@leafcutter-strict/library-schemas` |

Where this specification's form deviates from a package's, the deviation is
listed with its price in **DEC-0085 §6** — the identifier schema, the missing
business-rule class, statement grammar, locator granularity, the source
rating vector, the need and goal layer, the decision record shape, the
conflict and defect registers, the acceptance-criterion shape, and
per-artefact versions. None of them is an oversight and none is free. Eleven
of its thirteen rows are closed — the need and goal layer by DEC-0101,
DEC-0102 and DEC-0103 on 2026-09-24, and it was the last structural one. What
stays owed is the **prompt identity** in `ai_provenance`, which is an
extraction rather than a migration; the acceptance-criterion shape is a
recorded deviation with a price and a demand upstream, not a gap.

Three of its operating principles bind everything written here:

1. **Agents propose, decision points decide.** Everything an executor emits
   is status DRAFT. It becomes effective only at the decision point named in
   the project's decision policy.
2. **No invention.** Every value is backed by an exact source locator or an
   existing artefact identifier. Where the input does not support a value,
   the output is `UNKNOWN` plus the question that would resolve it — never a
   plausible guess.
3. **Bad input becomes a demand, not an assumption.** A detected defect
   produces a formal demand addressed to someone, rather than a silent
   workaround.

For a cold start — a pile of input with no baseline — use
`@leafcutter-strict/playbook-cold-start`. For ongoing work,
`@leafcutter-strict/playbook-steady-state-increment`. The cold start ran on
2026-09-09; this specification has been in the steady-state loop since.

### 2. go-to-market-os — what is specified

This one is still not reachable from inside this repository, so it is named
with its full local path.

**Local path:** `/Users/jan-henrik.hempel/Projects/go-to-market-os`

**Repository:** <https://github.com/schafe-vorm-fenster/go-to-market-os> (private)

This is the single source of truth for the concept and for all content
([ADR-001](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/handbook/decisions/001-content-source-of-truth.adr.md)).
A spec draws its inputs from there, and references them by ID rather than
restating them.

| What | Where in `go-to-market-os` |
| --- | --- |
| Communication principles, the four jobs, the page-brief compliance check | `concept/website-communication-principles.concept.md` |
| Relevance model — proof and live-content selection and ordering | `concept/website-relevance-model.concept.md` |
| Information architecture — the eight pages, page briefs, conversion map | `concept/website-information-architecture.concept.md` |
| Audiences | `audiences/*.audience.md` |
| Conversion goals | `strategy/conversion-goals/*.conversion-goal.md` |
| Positioning, value propositions, content pillars, business goals | `strategy/` |
| Offerings and pricing | `offerings/*.offering.md` |
| Tone of voice, culture and values | `.claude/skills/foundation-tone-of-voice/`, `foundation-culture-values` |
| Brand — typography, colours, logos, imagery rules | `brands/profiles/schafe-vorm-fenster/` |
| Proof — testimonials, metrics, partners, with clearance status | `proof/*.proof.md` |
| Media echo — press, awards, appearances, with `geo` | `media-echo/verified/` |

The clickable prototype for the concept documents is in
[`../concept/v1.0/`](../concept/v1.0/); see
[`../concept/README.md`](../concept/README.md).

## Rules

1. A spec cites IDs from `go-to-market-os` — audience IDs, conversion goal
   IDs, offering IDs, proof IDs. It does not invent its own and does not
   copy the definitions in. `specs/goals/` is that rule made checkable: a
   `GOAL-WEB-####` is a reference to a hub goal with this specification's own
   judgement about it, and carries no metric, target or horizon of its own
   (DEC-0101).
2. A spec that needs a fact the sources do not carry emits `UNKNOWN` with
   the question, and a demand addressed to whoever can answer it.
3. Page copy is not written during this phase. Where a spec needs example
   text, it is marked as a placeholder.
4. If a spec contradicts a concept document, the concept document wins — or
   it is changed first, in `go-to-market-os`.

## Structure

Cold start executed on 2026-09-09 (source inventory → SSD → extraction).

```text
specs/
├── sources/            SRC-#### source inventory with trust ratings
├── ssd/                system specification document (scope, goals, stakeholders — by reference)
├── goals/              GOAL-WEB-#### level L1 — references into @schafe-vorm-fenster/goals,
│                       never copies of it (DEC-0101)
├── needs/              NEED-WEB-#### level L2 — what a stakeholder needs, read off a source
│                       line, with the goal it answers to (DEC-0102)
├── glossary/           GL-#### terms; canonical definitions stay in go-to-market-os
├── contracts/          SRC-0011 API contract register; Zod content formats (in src/domain)
├── requirements/       one document per requirement, named for its identifier;
│   │                   each directory README is the index over them
│   ├── functional/     FUN-WEB-####.md — jobs, pages, relevance, live data, personalization,
│   │                   localization, SEO, content pipeline
│   ├── quality/        NFR-WEB-####.md — performance, accessibility, privacy
│   ├── constraints/    CON-WEB-####.md — stack, brand, scope boundaries
│   └── business-rules/ BUS-WEB-####.md — true of the business, not of the solution
├── policy/             POL-* decision policy in force — who may decide what, at which impact
├── decisions/          DEC-#### decision records (S3 evidence anchor)
├── questions/          Q-#### open-question register (UNKNOWN + resolving question)
├── tactical/           TS-WEB-#### tactical specs — the generation prompts (FIXED/PROPOSED/FREE)
│                       with TS-WEB-####-A# acceptance criteria carrying a verification level
├── verification/       test strategy + Gherkin journeys (DEC-0040)
└── traceability/       RTM: requirement → source → decision → question
```

## Conventions

- **A status moves at a decision point, and one policy says which.**
  `@leafcutter-strict/foundation-draft-only-output` is a company-layer
  foundation: *"An executor that writes `status: APPROVED` has not saved a
  step; it has removed the record that makes the approval auditable."* The
  decision point that may move it is named by the project's decision policy,
  and since DEC-0088 this repository has one: `POL-GRADED-BY-IMPACT` in
  [`policy/`](policy/graded-by-impact.decision-policy.md). It is graded by
  impact — an agent may decide at the **low** level of
  `@leafcutter-strict/method-impact-level-assignment`, inside four bounds and
  with a decision record; from medium upward, and at the four decision points
  the impact method leaves undefined, the owner decides. **Everything is still
  `DRAFT`**, and now for a measured reason rather than a missing document:
  low impact means *"no dependants"*, and every one of the 196 requirements is
  implemented by a tactical spec while every one of the 29 tactical specs
  carries 8 to 21 acceptance criteria. Nothing in the repository is on an agent
  row — DEC-0089 is the run of the policy over all 185 artefacts, with the
  impact level and the escalation for each. `check:specs` E15 enforces the policy — exactly one binds, every pair of
  decision point and impact level is bound to a declared mode, and a status off
  `DRAFT` needs a decision record that names the artefact, cites the policy and
  names a decision point. W5 reports the resolution: the impact level of every
  governed artefact, how many land on an agent row, and the evidence gates
  (*"Nothing is decided at … requirement approval below S2"*). Evidence for a
  decision, never the decision.
- **Every artefact that the contract gives a `version` carries one, at
  `0.1.0`.** `@leafcutter-strict/method-version-increment` is a rule for
  increments and nothing else — its inputs are *"the artefact's current
  version and its diff"* — so it says nothing about the first version of
  an artefact that predates versioning, and the schemas type `version` as
  a bare string. `0.1.0` is therefore argued, not read off: no artefact
  here has passed a decision point, DP-13 baseline release has never run,
  and a `1.x` would claim a baseline nobody released. The first increment
  the method governs is the one after the first approval, and its reason
  goes in the change record — *"a version bumped without one cannot be
  reviewed"*. Three contracts carry the field, so three kinds of artefact
  do: requirement, tactical specification, specification document.
  `check:specs` E16 enforces it.
- Statements in the slot form their class prescribes
  (`@leafcutter-strict/method-statement-grammar`), recorded on the artefact
  as `form`; where a statement is not in its form yet, `form` ends in `0`
  and `check:specs` W4 counts it. The status vocabulary is the
  requirement-shell contract's, and `check:specs` reads it out of the
  installed package (E11).
- Every requirement carries source locator(s) and an evidence level
  `S0–S3` (`@leafcutter-strict/method-evidence-sufficiency-rating`; the
  project's reading of it is in `sources/README.md`).
- **The identifier scheme is the method's** (DEC-0086):
  `<TYPE>-<DOMAIN>-<NNNN>` from
  `@leafcutter-strict/method-identifier-and-locator-schema`, with the type
  tokens the installed contracts fix and four-digit numbering.
  `specs/traceability/identifier-map.md` maps every pre-DEC-0086 identifier
  to the one it holds now; no number was reassigned. A file that holds one
  identified artefact is named for it — `DEC-####--<slug>.md`,
  `TS-WEB-####--<slug>.tactical.md`.
- The three-class split and the statement grammar are still documented
  project conventions that **deviate** from the packages. They are not
  pending a reconciliation — DEC-0085 §6 says what each deviation is and
  what closing it would cost, and `CON-WEB-0006` names the dependency.
- **The chain is goal → need → requirement → tactical specification →
  verification**, and it is checked in both directions (DEC-0101, DEC-0102,
  DEC-0103). A goal is a reference into `@schafe-vorm-fenster/goals` and never
  a copy of one; a need is read off a source line and never reconstructed
  behind a requirement; a requirement names at least one need or the
  contract's `UNKNOWN`. `check:specs` E24–E26 check the links and W9 reports
  the four link findings of `@leafcutter-strict/method-chain-linkage` as
  fractions — never as a bare percentage — with the fifth, the unverified
  requirement, counted once by W7.
- **Consistency is machine-checked**: `pnpm check:specs`
  (`scripts/check-specs.ts`, part of `pnpm check` and the pre-commit
  hook) validates frontmatter, ID uniqueness, row shape, the S3-needs-a-
  decision rule, reference integrity across all ID families,
  implements↔Coverage symmetry, the decisions index, acceptance-criterion
  IDs and levels, and that tests reference only ids that exist. It closes
  the requirement → acceptance criterion → test matrix and reports every
  gap: requirements without a tactical spec (W1), covered requirements
  discharged by no acceptance criterion (W2), acceptance criteria no test
  references (W3). It also prints the verification pyramid.
- **Five of its vocabularies come from the package, not from the script**
  (DEC-0085 §4): the `S0–S3` ladder (E3/E4), the requirement status set
  (E11), the tactical status set and the four tactical `kind` values (E12),
  and the source trust levels (E13). They are read out of
  `@leafcutter-strict/library-schemas` at startup, so a version bump moves
  the checks. Since DEC-0086 the three identifier **patterns** the contracts
  declare come from the same place — requirement, tactical specification and
  source — with the package's doubled backslashes collapsed at the one place
  that reads them, and since DEC-0103 the goal and need patterns and their
  field lists are read out of `@leafcutter-os/schemas`' `goal.schema.mjs` and
  `need.schema.mjs`. What the script still owns — `DEC-####`, `Q-####` and
  `GL-####`, the chain this repository actually has, and everything
  grammar-shaped — is listed at the top of `scripts/check-specs.ts` with the
  reason.

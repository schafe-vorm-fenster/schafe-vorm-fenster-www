# Specs

This folder holds the specification for the website relaunch. Writing specs
is the **current phase** of the project — see the root `README.md` for the
three phases and their order.

## The Two Sources

Neither source is reachable from inside this repository. Both are named
here with their full local paths so an agent can find them.

### 1. STRICT — how a spec is written

**Framework:** STRICT — *Systematic Thorough Requirements for Integrated
Consistency and Traceability*.

**Local path:** `/Users/jan-henrik.hempel/LeafcutterOS/leafcutter-strict`

**Repository:** `LeafcutterOS/leafcutter-strict` (private)

All specs in this folder are written against STRICT. The repository is the
executing layer of that framework: an inventory of atomic, separately
installable packages in nine families — `foundations`, `contracts`, `roles`,
`methods`, `policies`, `skills`, `playbooks`, `agents`, and `config`. Start
at its `README.md`, then take the artefacts a given task needs rather than
the whole framework.

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
`playbook-cold-start`. For ongoing work, `playbook-steady-state-increment`.

### 2. go-to-market-os — what is specified

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
   copy the definitions in.
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
├── sources/            SRC-### source inventory with trust ratings
├── ssd/                system specification document (scope, goals, stakeholders — by reference)
├── glossary/           GL-### terms; canonical definitions stay in go-to-market-os
├── contracts/          SRC-011 API contract register; Zod content formats (in src/domain)
├── requirements/
│   ├── functional/     WEB-F-### — jobs, pages, relevance, live data, personalization,
│   │                   localization, SEO, content pipeline
│   ├── quality/        WEB-Q-### — performance, accessibility, privacy
│   └── constraints/    WEB-C-### — stack, brand, scope boundaries
├── decisions/          DEC-### decision records (S3 evidence anchor)
├── questions/          Q-### open-question register (UNKNOWN + resolving question)
├── tactical/           TS-### tactical specs — the generation prompts (FIXED/PROPOSED/FREE)
└── traceability/       RTM: requirement → source → decision → question
```

## Conventions

- Statements in shall-form, status `DRAFT` until their decision point.
- Every requirement row carries source locator(s) and an evidence level
  `S0–S3` (defined in `sources/README.md`).
- The STRICT Core Specification is not yet locally available; ID scheme,
  class split, and grammar are documented project conventions to be
  reconciled against it (see `constraints/technical.req.md` WEB-C-006).
- **Consistency is machine-checked**: `pnpm check:specs`
  (`scripts/check-specs.ts`, part of `pnpm check` and the pre-commit
  hook) validates frontmatter, ID uniqueness, row shape, the S3-needs-a-
  decision rule, reference integrity across all ID families,
  implements↔Coverage symmetry, and the decisions index — and reports
  which requirements no tactical spec covers yet.

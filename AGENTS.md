# AGENTS

This repository is the home of the official Schafe vorm Fenster website,
rebuilt from scratch. `CLAUDE.md` and `.github/copilot-instructions.md` are
symlinks to this file.

## Project Context

The relaunch runs in three phases:

1. **Concept — done.** Communication principles, relevance model, and
   information architecture live in `go-to-market-os`; the clickable
   prototype is in `concept/v1.0/`.
2. **Specification — current phase.** Specs are derived from the concept
   documents, the IA, and the wireframes, and written to `specs/`.
3. **Content — after the specs.** Page copy is produced once the specs
   exist.

`legacy-content/` and `content/` predate the relaunch: an archive to look a
phrase, a legal text or a support article up in, never a specification or a
starting point. (`docs/` held stale product-doc copies and was deleted;
DEC-0001, DEC-0008.)

## Read First

- `concept/README.md` — where the binding website concept lives (outside this repository)
- `README.md` — purpose and current state
- `specs/README.md` — how specifications are written: sources, rules, structure, conventions
- `CONTRIBUTING.md` — branches and PRs, local development, the `pnpm check` gate, the checked rules
- `.agents/roles/orchestrator.md` — before delegating, whenever this session coordinates several changes (see **Change Queue**)

## Content and Concept Sources

`go-to-market-os` is the single source of truth for the concept and for all
content
([ADR-001](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/handbook/decisions/001-content-source-of-truth.adr.md)):
local path `/Users/jan-henrik.hempel/Projects/go-to-market-os`, repository
<https://github.com/schafe-vorm-fenster/go-to-market-os> (private).
`specs/README.md` §2 maps each of its documents to its path.

Conversion goal, audience, offering and proof IDs are defined there. This
repository cites them and links to the documents; it defines no IDs of its
own and copies no content or concept text in.

## The Specification Method

Specs follow **STRICT**, installed as the devDependency
`@leafcutter-strict/blueprint-complete` (DEC-0085; the private registry and
its token are in `CONTRIBUTING.md`). `specs/README.md` carries the method's
rules and conventions. These guardrails bind every change under `specs/`:

- **Cite a STRICT artefact by package name** —
  `@leafcutter-strict/method-statement-grammar`, never a path under
  `LeafcutterOS/`.
- **No invention.** A value no source supports — a threshold, a line number,
  a need — is `UNKNOWN` plus a `Q-####` and a demand. An unlocatable source is
  a defect of the source, recorded as such.
- **Identifiers** are the method's `<TYPE>-<DOMAIN>-<NNNN>`: `FUN-WEB`,
  `NFR-WEB`, `CON-WEB`, `BUS-WEB`, `TS-WEB` (criteria `TS-WEB-####-A#`),
  `GOAL-WEB`, `NEED-WEB`, plus `DEC`, `Q`, `SRC`, `GL`, `CONF`, `DEM`. These
  families are the complete set. A file holding one artefact is named for it
  (`DEC-####--<slug>.md`, `TS-WEB-####--<slug>.tactical.md`, `FUN-WEB-####.md`).
  A split retires the parent into `specs/traceability/identifier-map.md` and
  gives the children new numbers; a reclassification keeps the number where it
  is free in the target class and otherwise takes the next above the family's
  highest.
- **One requirement, one document** under `specs/requirements/<class>/<id>.md`;
  the directory README is the index. A business rule and the requirement that
  applies it are two artefacts (DEC-0094).
- **`source` is a locator** `{source_id, loc, excerpt}`: `<file>#L<n>` plus at
  most 25 words copied verbatim from that position. Further references and
  what reading the source found go in the `## Source` section (DEC-0097).
- **A source's trust level is computed**: the minimum of the six dimensions of
  `@leafcutter-strict/method-source-quality-rating` (DEC-0098).
- **The chain** is goal → need → requirement → tactical spec → verification.
  A goal references `@schafe-vorm-fenster/goals`; a need is read off a source
  line (exact-substring locator, `inferred: false`) and names a stakeholder
  `SSD-WEB-0001` lists — adding a stakeholder is DP-07, the owner's. Without a
  source the requirement carries `needs: [UNKNOWN]` and a demand (DEC-0101–0103).
- **Registers are filled from records.** `specs/conflicts/` and
  `specs/demands/demand-register.md` take their entries from decision records
  and the question register (DEC-0099).
- **An ADR and a STRICT decision record are two artefacts**, both kept:
  `DEC-####--<slug>.md` beside `SDR-<yyyy>-<mmdd>-<nnnn>.yaml` (DEC-0100).
- **The specification carries the truth** (DEC-0104). Where spec and source
  disagree, the spec stands and the deviation is recorded twice: a
  `Deviation:` line in the requirement's `## Source` naming the source line and
  why, and a `DEM-####` against the source (`check:specs` E27, W10).
  `concept/website-design-system.md` (SRC-0014) and
  `concept/website-copy-guide.md` (SRC-0017) are specification-side: a spec
  contradicting one of them is a defect in the spec.
- **Every status stays `DRAFT`.** `POL-GRADED-BY-IMPACT` (`specs/policy/`) lets
  an agent decide only at low impact, which no artefact here reaches
  (DEC-0089); a status off `DRAFT` needs an SDR (`check:specs` E15). Passing
  tests are evidence for a decision, never the decision. The policy itself
  changes only at DP-14, the owner's.
- **DEC-0085 §6 lists the deliberate deviations** from the packages, each with
  its price. One closes only through a decision record.

`pnpm check:specs` enforces most of this; its codes are listed at the top of
`scripts/check-specs.ts`.

## Working Rules

1. Build forward from the concept documents and the specs, not from what is already in this repository.
2. A difference between the archive (`legacy-content/`, `content/`) and the concept documents is expected; leave it unreported. The archive folders stay where they are.
3. While the specification phase runs, page copy is a marked placeholder.
4. A new technical foundation updates `README.md` and `CONTRIBUTING.md` in the same change.
5. Every change lives on its own branch, in its own worktree, and reaches `next-2026` through a PR (`CONTRIBUTING.md` → Branches and Pull Requests). The main checkout stays on a clean, current `next-2026`. `main` and production belong to the owner.

## Change Queue

When the chat names two or more fixes, adjustments or change requests, names
an issue selection to work through (a title prefix, a label, issue numbers),
or asks for an orchestrator, this session becomes the **orchestrator**:
it turns each change into an issue, delegates each issue to a subagent in its
own worktree, and merges the PRs into `next-2026` itself, in queue order,
without a round trip per PR. Read `.agents/roles/orchestrator.md` before the
first delegation; it holds the queue, the lanes, the model choice and the
merge loop.

## Working Economically

Re-reading the context is the dominant cost of agent work here: across 69
sessions in September 2026 it cost about 4.5 times everything the sessions
produced (`leafcutter-os/spec/reports/token-cost-2026-09-25.md`). Two habits
follow:

1. **Batch independent tool calls** into one request; each extra request
   re-reads the whole context. Calls that need an earlier answer wait for it.
2. **Keep a session scoped and delegate exploration.** A search that ends in
   one answer belongs in a subagent, whose context dies with it.

Semantic indexes, de-duplicated reads and capped tool output each address
well under 1 % of the cost.

## Typical Tasks

- implement an issue against its tactical spec, on a branch, as a PR to `next-2026`
- work a list of fixes and change requests as a change queue
- turn an owner review into issues (`plan/process.md` → Review intake)
- write or refine a specification in `specs/`
- resolve an open point in the concept documents (in `go-to-market-os`)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS

This repository is the home of the official Schafe vorm Fenster website.

## Project Context

This repository is the relaunch of the Schafe vorm Fenster website. The
site is being rebuilt from scratch, in three phases:

1. **Concept — done.** Communication principles, relevance model, and
   information architecture live in `go-to-market-os`; the clickable
   prototype is in `concept/v1.0/`.
2. **Specification — current phase.** Specs are derived from the concept
   documents, the IA, and the wireframes, and written to `specs/`.
3. **Content — after the specs.** Page copy is produced once the specs
   exist, never before.

Everything else in this repository predates the relaunch. `legacy-content/`
and `content/` are archive: material to look something up in, not a
specification and not a starting point. (`docs/` was deleted — it held stale
product-doc copies; see DEC-0001 and DEC-0008.)

## Read First

- `concept/README.md` for where the binding website concept lives — it is **not** in this repository
- `README.md` for the repository purpose and current state
- `specs/README.md` for how specifications are written — the current phase
- `CONTRIBUTING.md` for the current development workflow
- `.github/copilot-instructions.md` for mirrored agent bootstrap instructions

## Content and Concept Sources

`go-to-market-os` is the single source of truth for the concept and for all
content
([ADR-001](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/handbook/decisions/001-content-source-of-truth.adr.md)).

- **Local path:** `/Users/jan-henrik.hempel/Projects/go-to-market-os` — a sibling of this repository in the workspace
- **Repository:** <https://github.com/schafe-vorm-fenster/go-to-market-os> (private)

It holds the three documents that govern this website — communication
principles, relevance model, information architecture — and also the
audiences, conversion goals, positioning and value propositions, offerings
and pricing, tone of voice, brand, proof, and media echo.
`specs/README.md` maps each of them to its path; `concept/README.md` covers
the three concept documents.

Conversion goal IDs, audience IDs, offering IDs, and proof IDs are defined
in `go-to-market-os`. This repository consumes them; it does not define its
own.

## The Specification Method

Specs are written against **STRICT**, which is installed here:
`@leafcutter-strict/blueprint-complete@0.2.4`, a devDependency (DEC-0085).
It is no longer a path on one laptop — it is a versioned dependency, and
`.npmrc` resolves the `@leafcutter-strict` and `@leafcutter-os` scopes from
`https://packages.leafcutteros.ai/` without a credential.

Cite a STRICT artefact **by package name**, the way DEC-0042 has you cite hub
content — `@leafcutter-strict/method-statement-grammar`, never a directory
under `LeafcutterOS/`. `specs/README.md` lists the nine packages this
specification leans on, and **DEC-0085 §6** lists every place where this
repository's form deviates from the packages, with what closing it would
cost. Do not silently "fix" one of those deviations.

The identifiers are no longer one of them. DEC-0086 moved every family onto
the method's `<TYPE>-<DOMAIN>-<NNNN>`: `FUN-WEB-####`, `NFR-WEB-####`,
`CON-WEB-####`, `BUS-WEB-####`, `TS-WEB-####` (with `TS-WEB-####-A#`
acceptance criteria), `DEC-####`, `Q-####`, `SRC-####`, `GL-####`, and since
DEC-0101/DEC-0102 `GOAL-WEB-####` and `NEED-WEB-####`. No number
was reassigned, and `specs/traceability/identifier-map.md` maps every old id
to its new one and registers the ones a later decision retired. A file that
holds one identified artefact is named for it — `DEC-####--<slug>.md`,
`TS-WEB-####--<slug>.tactical.md`, `FUN-WEB-####.md`. Do not invent a family
the method does not define and this repository does not hold.

The artefact shape is no longer one of them either. DEC-0087 made **one
requirement one document** under `specs/requirements/<class>/<id>.md` — the
directory README is the index, not a second home for the statement — added
the `BUS` class, put 47 of the 155 statements into the slot form of
`@leafcutter-strict/method-statement-grammar` (`form: F1`; `form: F0` means
not yet, and `check:specs` W4 counts them), and gave every versioned artefact
`version: 0.1.0`.

DEC-0092 then took the whole quality class through it. A quality requirement
**is** a measure, so a statement carrying several was split into one
requirement per measure, a statement carrying none was reclassified out of the
class by the method's tree, and the five that were single measures took their
value from the artefact that already enforces it — `TS-WEB-0003` D1,
`TS-WEB-0002` D2, `scripts/check-contrast.ts`, `e2e/layout-stability.spec.ts`.
**No number was invented, and none may be.** If a requirement needs a
threshold this repository does not hold, the fit criterion is `UNKNOWN` and a
question is raised; it is never filled with a plausible figure. A split retires
the parent into `specs/traceability/identifier-map.md` and gives the children
new numbers; a reclassification keeps the number where it is free in the target
class and takes the next one above the family's highest where it is not.

DEC-0093 then split the remaining 71 compounds, DEC-0094 extracted the four
business rules that were buried inside other requirements — a rule and the
requirement that applies it are two artefacts — and DEC-0095 filled
`fit_criterion` on all 273 from what already checks each requirement, with
`UNKNOWN` wherever no acceptance criterion of a requirement is referenced by
a test. **273 requirements · 10 still outside their slot form**, and each of
those ten says on the artefact why.

DEC-0097 then gave every requirement the locator the method asks for. `source`
is no longer a source id but the contract's `{source_id, loc, excerpt}` —
`<file>#L102` plus at most 25 words copied from that exact position — and the
reference list the contract has no room for lives in a `## Source` section of
the document, together with what reading the source found. **186 of 273
resolve to a line; 87 are `UNKNOWN`**, 64 of them because `SRC-0006` is one
line with no line terminators and supports no position scheme at all. Never
invent a line number: an unlocatable source is a defect of the source.

DEC-0098 made a source's trust level **computed**: the six-dimension vector of
`@leafcutter-strict/method-source-quality-rating`, and the level is the
minimum, never the average. 15 of the 18 levels changed and not one source
did. DEC-0099 created the two registers the method defines and this repository
did not have — `specs/conflicts/` (24 `CONF-####`) and
`specs/demands/demand-register.md` (65 `DEM-####`) — populated from the
decision records and the question register, never from an invented conflict.
DEC-0100 settled the decision-record shape: an ADR and a STRICT decision
record are **two artefacts**, both are kept, and `specs/decisions/` now holds
`DEC-####--<slug>.md` beside `SDR-<yyyy>-<mmdd>-<nnnn>.yaml`.

DEC-0101, DEC-0102 and DEC-0103 closed the last structural row of DEC-0085
§6: **the chain**. `specs/goals/` holds 13 `GOAL-WEB-####` at level L1 —
*references* into `@schafe-vorm-fenster/goals`, never copies of it, because
rule 7 below and `specs/README.md` rule 1 forbid copying and because the
extraction-result contract's own goal item carries `matched_existing` for
exactly this case. `specs/needs/` holds 34 `NEED-WEB-####` at level L2, every
one **read off a source line** — 31 from the six audience files, 3 from
SRC-0001 — with a locator verified as an exact substring, and `inferred:
false` on all of them. Nothing here was reconstructed behind a requirement,
and nothing may be: a need no source supports is a guess, and the requirement
gets `needs: [UNKNOWN]` and a demand instead. **222 of 273 requirements name
a need; 51 carry `UNKNOWN`**, 38 of them because the specification lists no
supply-side stakeholder (DEM-0063) and 13 because no audience states a need
for the expansion `GOAL-WEB-0002` carries. A need may name only a stakeholder
`SSD-WEB-0001`'s `stakeholders[]` lists; adding one is DP-07, not an
executor's.

**The specification carries the truth, and a source is cited rather than
obeyed (DEC-0104).** Until 2026-09-25 `specs/README.md` rule 4 said the
opposite — a concept document won over a spec — which let `SRC-0003`, trust
`low`, overrule two `S3` requirements. It now reads the method's way:
`foundation-evidence-discipline` makes the relation a **citation** with a
position and an excerpt, `method-source-quality-rating` exists so the method
*"can refuse to build on [a bad source] silently"*, and the source-inventory
contract gives every source a defect list and a demand channel. Three
consequences bind every change here:

1. Where the specification and a source disagree, **the specification stands**.
   That is not a licence to invent or to copy: rule 1 (cite hub ids, never
   restate them) and working rule 7 below are untouched.
2. **The deviation is recorded twice** — a `Deviation:` line in the
   requirement's `## Source` section naming the source line and why, and a
   `DEM-####` against the source. `check:specs` **E27** enforces the shape,
   **W10** reports the contradiction that no record carries.
3. `concept/website-design-system.md` (SRC-0014) and
   `concept/website-copy-guide.md` (SRC-0017) are the exception because they are
   not input: they are **specification-side**, bound by their contracts under
   `specs/contracts/`, so a spec contradicting one is a defect in the spec.
   Both stay in `concept/` and both stay `status: draft`; DEC-0104 §3 says why
   neither file moved.

`check:specs` runs E1–E27 and reports W1–W10. W3 (untested criteria) and W7
(unknown fit criteria) are the same gap seen from two ends; W8 is the locator
fill rate; W9 is the chain report in both directions — orphan requirement,
orphan need, uncovered need, uncovered goal, each as a fraction, with the
fifth finding of `method-chain-linkage` counted once by W7. The test-reference scan behind W3 is read off the runners
themselves — both Vitest configs and the `check` chain — so it cannot drift
from what actually runs (DEC-0096).

A status moves at a decision point, and since DEC-0088 one policy says which:
`POL-GRADED-BY-IMPACT` in `specs/policy/`. It grades by impact — an agent may
decide at the **low** impact level, inside four bounds and with a decision
record; from medium upward, and at every decision point the impact method
leaves undefined, the decision is the owner's. **In practice that still means
`DRAFT`**: every artefact here has at least one dependant, so none of them
reaches the low level (DEC-0089). Every requirement and tactical specification
now carries the `ai_provenance` the separation-of-duties bound reads (DEC-0091,
`check:specs` E17), but the prompt identity behind the 2026-09 authoring run
was never recorded, so `prompt_id` and `prompt_version` are `UNKNOWN` and
bound 3 still escalates. `check:specs` E15 enforces the policy —
it validates that every pair is bound, and refuses a status off `DRAFT` that
no **SDR** anchors. Since DEC-0100 an ADR is not that anchor: the record of an
executed decision point is, and there are none yet. Passing tests are evidence for a decision, not
the decision. Do not edit the policy: changing it is DP-14, governance
change, and that is never an agent's.

## Working Rules

1. Build forward from the concept documents, not from what is already in this repository.
2. Do not audit new work against `legacy-content/` or `content/`. A difference between them and the concept documents is expected, not a defect. Do not report it as one.
3. Consult the archive only when explicitly looking something up — a phrase, a legal text, a support article.
4. Do not write page copy or content while the specification phase is running. If a spec needs example copy, mark it as a placeholder.
5. Preserve the archive folders as they are; do not move them back into the repository root or reorganise them unless explicitly asked.
6. When adding a new technical foundation, update `README.md` and `CONTRIBUTING.md` in the same change.
7. Never copy content or concept documents from `go-to-market-os` into this repository. Link to them.
8. The specification carries the truth; a hub concept document is input and evidence (DEC-0104, `specs/README.md` rules 4–6). Where they disagree, the spec stands **and** the deviation is recorded — on the artefact and as a `DEM-####`. Never silently, and never by the source winning by default. The two local guides are specification-side and are the exception.

## Typical Tasks

- write or refine a specification in `specs/` from a page brief
- resolve an open point in the concept documents (in `go-to-market-os`)
- add baseline repository structure and technical foundations for the rebuild
- document development conventions as the new stack takes shape

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

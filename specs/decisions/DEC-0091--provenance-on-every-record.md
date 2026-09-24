---
id: DEC-0091
title: Provenance is on every record — the model and the hour come from the commit that wrote it, the prompt identity is UNKNOWN and says so
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0088 §4 adopted four bounds on every agent row of
`POL-GRADED-BY-IMPACT`, and reported that the third of them could not be
evaluated at all:

> **Separation of duties, checked against `ai_provenance`.** No artefact in
> this repository carries the field — 0 of 155 requirements, 0 of 29 tactical
> specifications — although both contracts require it. […] An unverifiable
> check is a failed check, so this bound escalates on every existing artefact
> until the field is filled.

The policy itself closes on the same note: *"One change does not need a
profile move and is expected to come first: filling in `ai_provenance`."*
This is that change.

Two things had to be settled before a single field could be written, and
both are decisions rather than lookups.

### The contract requires it; its schema forgot to

`requirement-shell.contract.md` and `tactical-specification.contract.md`
close with the same sentence:

> Every record additionally carries `ai_provenance` — the prompt, its
> version, the model and the time of the run.

Both schemas type it in `$defs` as an object requiring exactly `prompt_id`,
`prompt_version`, `model` and `generated_at`, with
`additionalProperties: false`. Neither schema lists `ai_provenance` in its
own top-level `required` array. That is why 184 artefacts could carry none
and still validate, and it is the same class of upstream slip as the
over-escaped `pattern` values DEC-0085 recorded: the prose is the contract,
the schema is the floor under it. The field is treated as required here, as
DEC-0085's ground rule has it — derive the canonical form from the prose,
never from what the JSON happens to enforce.

### What the repository actually knows about who wrote what

`@leafcutter-strict/foundation-evidence-discipline` decides the rest:

> Every artefact, statement, value and link is backed by a source locator or
> by an existing artefact identifier supplied as input. Where the input does
> not support a value, write `UNKNOWN`. […] A fabricated value is a defect —
> and the worse kind, because it reads exactly like a supported one.

So the question is not what would look complete. It is which of the four
fields this repository can evidence.

## Decision

### 1. `model` and `generated_at` come from the commit that introduced the artefact

Every commit in this repository carries a `Co-Authored-By` trailer naming
the model of the session that produced it. That trailer is a record, not an
inference, and it is the only record of the kind the repository holds.

For each of the 155 requirements and 29 tactical specifications, the
provenance commit is the **first** commit under `specs/` whose diff adds the
artefact's identifier inside its own layer — `specs/requirements/**` for a
requirement, `specs/tactical/**` for a tactical specification — resolved
through `specs/traceability/identifier-map.md` so that the pre-DEC-0086
identifier counts. `model` is that commit's trailer; `generated_at` is its
author date, to the second, with its offset.

Scoping the search to the artefact's own layer matters. An identifier often
appears first in a tactical specification that cites it, and the commit that
cites a requirement is not the commit that wrote it.

| Introduced by | Commit | Artefacts |
| --- | --- | --- |
| `feat(specs): STRICT specification foundation` | `699c4aa`, 2026-09-09 16:07 +02:00 | 135 requirements |
| `feat(specs): tactical layer test run` | `5da6363`, 2026-09-09 | 3 tactical specs |
| `specs: 18 decisions from the grill and design rounds` | `266b563`, 2026-09-10 | 18 requirements |
| `feat(specs): tactical layer — routing, relevance engine` | `b6e481c`, 2026-09-10 | 2 tactical specs |
| `feat(specs): thirteen tactical specs, written in parallel` | `8912e9d`, 2026-09-10 | 13 tactical specs |
| `feat(concept): the design system lands` | `864b9f5`, 2026-09-10 | 2 requirements |
| `feat(specs): eleven page specs — W1 reaches zero` | `4a87175`, 2026-09-11 | 11 tactical specs |

All seven trailers name the same model, so `model` is
`Claude Opus 5 (1M context)` on all 184 records. That is a finding, not a
convenience: the specification layer of this repository was written by one
model in one three-day stretch, and the build run that followed — Fable 5.1
orchestrating 65 subagents across Opus, Sonnet and Haiku, per
`reports/statistics.md` — touched application code and tests, not the
statements.

### 2. `prompt_id` and `prompt_version` are `UNKNOWN`, on all 184

Nothing in this repository records which prompt produced a requirement.
The question was asked of every place that could have answered it:

- **The STRICT skills.** `prompt_id` in the contracts means the skill that
  emitted the record — `/extraction` for a requirement shell,
  `/tactical-spec` for a tactical specification. Neither ran. STRICT arrived
  as an installed dependency on 2026-09-24 (DEC-0085); on 2026-09-09 it was
  a path on one laptop, and the method was followed by reading rather than
  by executing a skill.
- **`.agents/playbooks/`.** Seven playbooks exist and each carries an
  identity. All seven are the *build* run's — page implementation, content
  production, QA acceptance, UAT, chaos, customer acceptance, website
  foundation. None wrote a specification.
- **`reports/statistics.md` and `reports/run-report.md`.** Both are
  measurements of the build run of 2026-09-11/12, and both name models
  rather than prompts.
- **The commit messages.** They say what changed. None names a prompt.

So the honest value is `UNKNOWN` on both fields, on every record. The
foundation's own condition on it is met here rather than in a shrug: *"An
`UNKNOWN` without its question is a shrug."* **The question is: which prompt,
at which version, produced this statement?** What answers it is re-deriving
the layer through `/extraction` and `/tactical-spec` against the 18 sources,
which would produce new records with real prompt identities — and would be
an extraction, not a migration. It stays owed, and it is added to
DEC-0085 §6 as its own row rather than folded into another.

The consequence is stated plainly because it is the point of the field:
**bound 3 of `POL-GRADED-BY-IMPACT` still escalates.** Provenance that
cannot identify the executor cannot be compared with the executor taking the
decision, and *"an unverifiable check is a failed check, never a passed
one."* What changed is that two of the four fields are now evidence instead
of absence, and the gap has a name, a size and a question.

### 3. `check:specs` E17 requires the field; W6 counts what is unknown

E17 rejects an artefact whose contract declares `ai_provenance` and that
carries none, an `ai_provenance` that is not an object, a key outside the
contract's four, a field that is not a string, and a `generated_at` that is
neither `UNKNOWN` nor an RFC-3339 date-time. `UNKNOWN` passes, by the
foundation's rule that it is *"a valid, expected output"*.

W6 reports the distribution, so that the size of the gap is in the run
output rather than in this document only:

```
W6 ai_provenance is on 184/184 artefacts; prompt_id UNKNOWN on 184 ·
   prompt_version UNKNOWN on 184. POL-GRADED-BY-IMPACT bound 3 escalates
   where the separation of duties cannot be checked.
```

The three registers — the source inventory, the question set and the
glossary proposal — carry no `ai_provenance` either. Their contracts declare
one, and a register holds many artefacts under one document, so the field
would be the register's rather than the artefact's. That is a shape question
of the kind DEC-0087 §1 settled for requirements and left open for the three
registers; it is not opened here, and E17 covers only the two contracts whose
artefact is a document.

## Consequences

- 184 artefacts gained `ai_provenance`: 155 requirements and 29 tactical
  specifications. No statement changed, no identifier moved, and every count
  is what wave 3 closed on — **303 files · 155 requirements · 90 decisions
  (91 with this one) · 74 questions · 18 sources · 29 tactical specs · 20
  glossary terms · 420 acceptance criteria**, the same pyramid, the same
  108/155 W4 and 181/420 W3.
- `check:specs` gains one error and one report. E17 is a check this
  repository could not have had before, because the field did not exist on
  anything.
- `AGENTS.md` no longer says no artefact carries the field. It says which
  two of its four values are evidenced and which two are not.
- DEC-0085 §6 gains a row for the prompt identity, which is the part of
  provenance that re-derivation rather than migration closes.

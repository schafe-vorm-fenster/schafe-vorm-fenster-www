# Needs

## Purpose

Level **L2** of the STRICT chain. Thirty-four `NEED-WEB-####` artefacts: what
a stakeholder needs, stated without a solution, each naming the goal(s) it
answers to and the stakeholder it belongs to.

Until DEC-0102 this layer did not exist, and `needs[]` sits in the
requirement-shell contract's `required` array — so all 273 requirements were
orphans by the contract's own reading: *"At least one. A requirement without a
need is a defect of the run, not of the source."*

## Where they come from

Every one is **read off a source line, not reconstructed behind a
requirement**. `inferred: false` on all thirty-four, and the contract's word
for the other case — *"`inferred` marks a need reconstructed behind a
requirement"* — does not apply to any of them.

| Source | What it gave | Needs |
| --- | --- | --- |
| SRC-0008 — the six `*.audience.md` files of `@schafe-vorm-fenster/audiences` | `information_needs`, `communication_goals` and the `## Context` / `## Desired Outcome` prose | 31 |
| SRC-0001 — `website-communication-principles.concept.md` | principle 1, principle 5 and the jobs table | 3 |

The SSD said as much before this layer existed: the audiences are *"defined in
`@schafe-vorm-fenster/audiences` with `communication_goals` and
`information_needs` (these are the STRICT needs layer for this spec)"*. What
DEC-0102 did was give each of them an identifier, a stakeholder, a goal and a
verified locator, so the chain can be walked and checked.

## The stakeholders are the SSD's six

`method-chain-linkage`: *"every need names … one stakeholder listed in the
specification"*, and the specification-document contract: *"A need may only
name a stakeholder listed here."* The SSD lists six — `rural-residents`,
`actors`, `municipalities`, `institutions`, `counties`, `companies` — and no
need names anything else. It lists **no supply-side stakeholder**, which is
why a requirement whose motivation is the operator's rather than a visitor's
carries `needs: [UNKNOWN]` instead of a need invented for it.

| Stakeholder | Needs |
| --- | --- |
| `rural-residents` | NEED-WEB-0001 … NEED-WEB-0009 |
| `actors` | NEED-WEB-0010 … NEED-WEB-0014 |
| `municipalities` | NEED-WEB-0015 … NEED-WEB-0019 |
| `institutions` | NEED-WEB-0020 … NEED-WEB-0025 |
| `counties` | NEED-WEB-0026 … NEED-WEB-0030 |
| `companies` | NEED-WEB-0031 … NEED-WEB-0034 |

Four pairs are near-identical across `institutions` and `counties`, and one
sentence is shared by three audiences. They are not deduplicated: a need names
one stakeholder, the schema types `stakeholder` as one string, and two
stakeholders asking the same question is two needs, each with its own line.

## Shape

`@leafcutter-os/schemas`' `needSchema`: `id`, `level: L2`, `status`,
`version`, `domain`, `stakeholder`, `goals[]`, `priority`, `inferred`,
`source_ids`, `evidence_sufficiency`, `confidence`, `blocking_demands`,
`ai_provenance` — plus `source`, the locator `$def` shared with the
requirement shell. `confidence` is a number and `ai_provenance` a string for
the reason DEC-0101 §4 gives.

`priority` is `UNKNOWN` on all thirty-four. No source ranks one stakeholder's
need against another's; the SSD's audience order is an order of audiences per
page, not of needs. DEM-0062 asks for the ranking, and DP-01 is where it would
be set.

---
id: DEC-0102
title: The need layer is read off the sources, never reconstructed — thirty-four needs, every one with a verified line
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

`needs[]` sits in the `requirement-shell` contract's `required` array with
`minItems: 1`, and the contract says what that means: *"At least one. A
requirement without a need is a defect of the run, not of the source."* Not
one of the 273 requirements in this repository carried one, because there was
no need layer to carry.

The temptation in front of a wave like this is to read each requirement, write
down the reason it seems to exist, and call that a need. That is the failure
`@leafcutter-strict/foundation-evidence-discipline` exists to name: a value
that looks derived and is not. The extraction-result contract is equally blunt
about what cannot be checked afterwards: *"Whether a need was reconstructed
correctly. An inferred need is a hypothesis about why somebody asked for
something."*

Wave 5 made the alternative available. Every requirement now has a verified
locator and a ≤25-word excerpt, so a need can be derived from what a source
actually says rather than from a requirement's file name.

## Decision

### 1. Thirty-four needs, all read, none inferred

`specs/needs/` holds `NEED-WEB-0001` … `NEED-WEB-0034`. Every one is a line in
a source, cited with its position and the words found there, and every one of
the thirty-four locators was verified as an exact substring of that line
before the artefact was written — the same check DEC-0097 ran on its 186.

`inferred: false` on all thirty-four. The contract's `inferred` flag marks *"a
need reconstructed behind a requirement"*, and nothing here was.

| Source | What it gave | Needs |
| --- | --- | --- |
| SRC-0008 — the six audience files | `information_needs`, `communication_goals`, `## Context` and `## Desired Outcome` | 31 |
| SRC-0001 — the communication principles | principle 1 (L45), the jobs table (L54), principle 5 (L270) | 3 |

### 2. The audience files were always the need layer, and the SSD said so

`specs/ssd/website-relaunch.ssd.md` has said since 2026-09-09 that the
audiences are *"defined in `@schafe-vorm-fenster/audiences` … with
`communication_goals` and `information_needs` (these are the STRICT needs
layer for this spec)"*. The sentence was true and unusable: an
`information_needs` bullet has no identifier, no stakeholder field of its own,
no goal link and no locator, so nothing could name it and nothing could check
it. This wave gives each one all four and changes nothing about what it says.

That is also why this is not a copy of hub content. What is taken is the
≤25-word excerpt each locator carries — the citation form DEC-0097 established
— and what is added is the identifier, the stakeholder, the goal link, the
evidence level and the confidence.

### 3. The stakeholder set is the SSD's six, and it is closed

`method-chain-linkage` step 1 requires that a need name *"one stakeholder
listed in the specification"*, and the specification-document contract makes
it a prohibition: *"A need may only name a stakeholder listed here."* The SSD
lists `rural-residents`, `actors`, `municipalities`, `institutions`,
`counties` and `companies`. No need names anything else, and no stakeholder
was added to the SSD to make a need possible — adding one is a change to the
specification document, which is DP-07's, not an executor's.

The consequence is deliberate and is the wave's sharpest finding: **the
specification lists no supply-side stakeholder.** A requirement that exists
because the operator needs it — the content pipeline, the delivery pipeline,
most of the technical constraints — has no stakeholder to hang a need on, and
gets `needs: [UNKNOWN]` and a demand rather than a need written for it.

### 4. Near-duplicates are kept

`institutions` and `counties` ask four of the same questions, and three
audiences ask *"How are AI usage, data governance, and compliance handled in a
trustworthy way?"* word for word. Those are seven separate needs, not three.
`needSchema` types `stakeholder` as one string; a need belongs to one
stakeholder; and merging them would produce a need whose stakeholder field
could not be filled without inventing a category the SSD does not list.

### 5. `priority` is UNKNOWN on all thirty-four

`needSchema` requires `priority` and no source ranks one stakeholder's need
against another's. The SSD's audience order is an order of *audiences per
page*, quoted from SRC-0003, and reading it as a need ranking would be the
plausible-figure move DEC-0092 refused for measures. `UNKNOWN` plus DEM-0062,
addressed to the role DP-01 makes accountable.

### 6. Evidence sufficiency is S2

*"a need [is decided] by its statement and stakeholder"*, and both are the
cited line. SRC-0008 and SRC-0001 are both trust `medium` (DEC-0098), which is
S2's bar. S3 needs *"a second independent source"* and *"at least one source
at trust high"*; several needs are in fact carried by two sources — the
audience file and the principles document — but the second is not independent
of the first, since SRC-0001 §"Derivation From the Communication Goals" is
explicitly derived from the audience files. Claiming S3 on that would be
counting one source twice.

## Consequences

- `specs/needs/` exists with thirty-four artefacts and an index.
- DEM-0062 is open: the need ranking nobody has stated.
- The layer is usable by DP-01 for the first time. Before it, goal and need
  acceptance was a decision point with nothing to decide on.
- Nothing moves off `DRAFT`. DP-01 is `HUMAN` at every impact level in
  `POL-GRADED-BY-IMPACT`, and an executor writing `status: APPROVED` here
  would be exactly what `foundation-draft-only-output` forbids.

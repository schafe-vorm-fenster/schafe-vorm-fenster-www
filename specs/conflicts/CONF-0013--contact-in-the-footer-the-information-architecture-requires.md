---
artefact: conflict
id: CONF-0013
type: direct_contradiction
status: RESOLVED
impact: High
involved: ["SRC-0003", "CON-WEB-0061"]
decision_point: DP-04
recommended_action: NEW_VERSION
permitted_outcomes: [REJECT_NEW, NEW_VERSION, ISOLATE]
blocking_demands: [DEM-0001]
decision_record: DEC-0081
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T18:00:00+02:00"
---

# CONF-0013

Contact in the footer: the information architecture requires it, the constraint forbids it

## Positions

- **SRC-0003** — The information architecture no longer puts contact in the footer; it says the same thing the constraint does. The position that collided was line 35, "Contact and newsletter live in the footer, together with the legal links", and the amendment of 2026-09-25 struck it.
  `go-to-market-os/concept/website-information-architecture.concept.md#L45`
  > Contact is not a footer element.

- **CON-WEB-0061** — The constraint forbids contact in the footer.
  `specs/requirements/constraints/CON-WEB-0061.md#L31`
  > The solution SHALL NOT place contact inside the footer, imposed by DEC-0081.

## Impact

High — the source is the reference the page briefs are read from, and it still tells a reader the opposite of what ships.

## Outcome

Taken: **NEW_VERSION**, and it falls on **SRC-0003** — not on the requirement.

The taxonomy permits REJECT_NEW, NEW_VERSION and ISOLATE for a direct
contradiction, and this record used to stop at the word. Under the rule in
force when it was written (`specs/README.md` rule 4, "the concept document
wins") a reader would have taken the new version to be the requirement's.
It is not: the requirement stands as DEC-0081 decided it, and the **source**
is the artefact asked for a new version, through DEM-0001.

DEC-0104 §1 is why that is now stated rather than left implicit: the
specification carries the truth, a source is cited rather than obeyed, and the
deviation is recorded at the artefact (`Deviation:`) and as a demand against
the source. Nothing about the type, the impact or the permitted outcome set
changed — the taxonomy was right, the record was merely silent at the one
place where silence now means the opposite thing.

Resolved in DEC-0081, which is the record; this file is the conflict, not a
second copy of the decision.

**The new version landed, 2026-09-25.** Hub commit `ee17e4e` (PR #510) struck
the sentence this record collided with and replaced it with the prohibition's
own wording, so `DEM-0001` is `ANSWERED` and the SRC-0003 position above is the
amended line rather than the one that contradicted. The outcome is unchanged —
NEW_VERSION was the right call and the source is the artefact that took it. The
record stays `RESOLVED`: a conflict that has been answered is not a conflict
that never existed, and the collision is what DEC-0081 was decided against.
The CON-WEB-0061 position was also off by one line, at 30 rather than 31, since
the record was written; found by the same re-resolution run.

## Blocks

CON-WEB-0061, SRC-0003

## Confidence

`certain` — the record itself names the collision.

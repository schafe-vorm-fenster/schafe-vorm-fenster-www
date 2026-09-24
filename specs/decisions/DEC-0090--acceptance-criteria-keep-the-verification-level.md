---
id: DEC-0090
title: The acceptance criteria keep their verification level — the deviation from the contract is deliberate, recorded, and raised upstream
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0085 §6 listed the acceptance-criterion shape as a deviation "deliberately
chosen". DEC-0087 §6 measured it and found that framing wrong: the two shapes
are not a preference, they are incompatible, and the schema says so.

`@leafcutter-strict/library-schemas@0.4.1`, `tactical-specification`, property
`acceptance_tests`:

```json
"items": {
  "properties": { "id": {}, "given": {}, "when": {}, "then": {} },
  "required": ["id", "given", "when", "then"],
  "additionalProperties": false }
```

`additionalProperties: false` closes the item at exactly four keys. DEC-0040's
verification level — `static · unit · integration · e2e · tool · manual`, one
per criterion — has no slot. Both smuggling routes were costed in DEC-0087 §6
and both lose: a level inside `then` is typed data parsed out of free text, and
a level inside `id` makes re-levelling a criterion a renumber, which
`@leafcutter-strict/method-identifier-and-locator-schema` forbids outright —
*"Never reuse, never renumber."*

What DEC-0087 §6 did not do is decide what happens next. It recorded the
measurement and left the deviation sitting in the owed list as though time
would resolve it. This record decides it.

## Decision

### 1. The level stays, and so do the 420 criteria

No migration. The verification level is not a convenience: 420 acceptance
criteria carry one, `check:specs` E8 validates it against the six values,
the verification pyramid is computed from nothing else (static 82 · unit 30 ·
integration 73 · e2e 165 · tool 39 · manual 31), and W3's burn-down — 181 of
420 criteria with no test — is read per level. DEC-0040 §1 is the reason it
exists at all: *"The pyramid then emerges from the specs instead of being
imposed on them, and a suspiciously empty level is visible."*

Trading that for a shape the contract cannot hold would buy schema
conformance and pay for it with the one number this repository uses to steer
its test work.

### 2. It is a deviation, named as one

This is not a local improvement on the contract and it is not a bug in this
repository. It is a documented deviation with a price, in the same register as
the other rows of DEC-0085 §6:

| What the contract wants | What this repository does instead |
| --- | --- |
| `acceptance_tests[]` with `id`, `given`, `when`, `then` and nothing else | A table row per criterion with `TS-WEB-####-A#`, a verification level from the six, and the criterion itself |

**What it costs.** Three things, and none of them is hypothetical:

- The acceptance criteria are not validated by the `tactical-specification`
  contract. `check:specs` E8 validates them instead — unique id, the id carries
  its spec's id, a level from the six — so they are checked, but by this
  repository's rules rather than the package's. A narrowing upstream would not
  reach them.
- A consumer that reads STRICT-shaped tactical specifications cannot read these
  without knowing the local form.
- The row stays in the owed list and has to be re-read by whoever next asks why
  the specs do not validate whole.

### 3. What would retire it

One thing, and it is upstream: `acceptance_tests` gaining a slot for the level.
Either a typed optional `verification_level` field, or `additionalProperties`
opened on the item. The moment either ships, the 420 criteria can migrate
mechanically — the level is already a controlled value on every one of them —
and this deviation closes with them.

Nothing this repository can do closes it. That is what makes it a demand rather
than a task.

### 4. The demand is written here, and it names nothing of this project

[`specs/questions/demand-acceptance-test-verification-level.md`](../questions/demand-acceptance-test-verification-level.md)
is the handover document, registered in the open-question register as Q-0074
with its addressee, which is how this repository has recorded every outbound
demand since the cold start. It states the contract, the conflict and the
proposed change, and nothing else.

It names no product, no page, no identifier and no repository of this project.
That is deliberate: the framework is a vendor dependency, the demand is a
schema argument that stands on its own, and a schema argument does not need to
know who is making it. Nothing is written into the Leafcutter repositories —
the packages under `node_modules/` are read and never edited, and the demand
travels as a file from here.

`@leafcutter-strict/method-demand-recording` is what the document is built to:
it names what is required concretely (*"A value with its unit. A decision
between A and B"* — here, a decision between two schema changes), it names an
addressee, it states what it blocks, why, and the answer format, and it leaves
the due date open rather than inventing one. It also takes the method's rule on
how a demand ends: *"It does not close because time passed, because somebody
said it was fine, or because the artefact was approved anyway."*

### 5. DEC-0040 stands unedited

DEC-0040 is the record of what was decided on 2026-09-10 and is not rewritten
after the fact, for the same reason DEC-0023 keeps the old framework path.
DEC-0085 §6's row is amended instead, from a measured incompatibility to a
recorded deviation with a demand behind it.

## Consequences

- DEC-0085 §6's acceptance-criterion row now points here, and says what would
  retire the deviation rather than only why it exists.
- Q-0074 is open, addressed to the `library-schemas` maintainer, and closes in
  one of the two ways `method-demand-recording` allows: answered and registered
  as a source, or waived at the blocked artefact's decision point with the
  reason recorded. Not by silence.
- The counts are untouched: 420 acceptance criteria, the same pyramid, the same
  181/420 burn-down. A decision that changed one of them would have been a
  migration wearing a decision's clothes.

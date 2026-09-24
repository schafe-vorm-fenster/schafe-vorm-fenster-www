---
artefact: upstream-demand
status: DRAFT
date: 2026-09-24
addressee: maintainer of @leafcutter-strict/library-schemas
answer_format: a decision between option A and option B, with the package version it lands in
due: open
---

# Demand — an acceptance test needs a slot for its verification level

An installation of STRICT cannot record which verification level an acceptance
test belongs to without leaving the contract. This is the request to open one
slot so that it can.

## The contract, as shipped

`@leafcutter-strict/library-schemas@0.4.1`,
`contracts/schemas/tactical-specification.schema.json`, property
`acceptance_tests`:

```json
"acceptance_tests": {
  "type": "array",
  "minItems": 1,
  "items": {
    "type": "object",
    "properties": {
      "id":    { "type": "string" },
      "given": { "type": "string" },
      "when":  { "type": "string" },
      "then":  { "type": "string" }
    },
    "required": ["id", "given", "when", "then"],
    "additionalProperties": false
  }
}
```

`contracts/tactical-specification.contract.md` describes the field as
*"One per fit criterion element, each verifiable without reading this
document."*

## The conflict

`additionalProperties: false` closes the item at exactly four keys. An
installation that records, per acceptance test, **which level of the test
pyramid verifies it** — static, unit, integration, end-to-end, tool-assisted or
manual — has nowhere to put that value. The level is not a restatement of
`given`, `when` or `then`: two tests with identical wording can be verified at
different levels, and the level is what a pipeline reads to decide which runner
owns the test and what a report reads to show the shape of the pyramid.

The two ways to carry it inside the contract as it stands both cost more than
they buy:

1. **Inside a prose field.** Encoding the level in `then` makes it a substring
   that every consumer has to parse out of free text. That is precisely what a
   typed field exists to prevent, and the contract's own note — *"The schema is
   a floor, not a review"* — is not an invitation to put typed data in prose.
2. **Inside `id`.** `id` is an untyped string, so `<spec-id>-A7:integration`
   validates. It also makes the verification level part of the identifier, so
   moving a test from one level to another renumbers it.
   `@leafcutter-strict/method-identifier-and-locator-schema` forbids exactly
   that: *"Never reuse, never renumber."* A contract should not make a method
   rule unfollowable.

So an installation that keeps the level keeps it outside the contract, and its
acceptance tests stop validating against `acceptance_tests` altogether. That is
a worse outcome for the framework than either change below.

## The proposed change

Either is sufficient. Option A is preferred, because it makes the value part of
the contract rather than part of what the contract tolerates.

**Option A — a typed, optional field.** Add to the item:

```json
"verification_level": {
  "type": "string",
  "enum": ["static", "unit", "integration", "e2e", "tool", "manual"]
}
```

Optional, so nothing already valid becomes invalid, and `additionalProperties`
stays `false`. The enum is a proposal, not a requirement of this demand; any
controlled vocabulary the framework prefers would serve, and a method package
naming it would serve better still.

**Option B — open the item.** Set `additionalProperties: true` on the
`acceptance_tests` item, as the least invasive change. It carries the usual
cost of an open object: two installations will spell the same idea differently,
and the framework will have to close it again later.

## What it blocks

The `acceptance_tests` shape of the tactical-specification contract cannot be
adopted by an installation that records a verification level per acceptance
test. Until one of the options ships, such an installation records a documented
local deviation and its acceptance tests are not validated by the contract.

## How this demand closes

By an answer naming option A or option B and the package version it lands in,
registered as a source. It does not close because time passed.

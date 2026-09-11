---
name: kundenabnahme
description: Accept or reject a milestone against its acceptance criteria from the customer's chair, in a written protocol, without escalating to a human.
layer: project
tags:
  - acceptance
  - customer
  - protocol
interfaces:
  - id: acceptance-scope
    description: The tactical specs whose criteria define what was ordered for this milestone.
    required: true
  - id: qa-protocol
    description: The QA run's protocol proving which criteria were checked and how.
    required: true
  - id: target-environment
    description: The preview deployment the customer actually opens and uses.
    required: true
  - id: abnahme-protocol
    description: The protocol file receiving the accept/reject verdicts.
    required: true
  - id: open-points
    description: The run's open-points list, for criteria whose acceptance is blocked by deferred decisions.
    required: false
---

# Kundenabnahme

Judge a milestone the way a paying customer would: read what was
ordered, look at what stands, accept or reject each criterion in
writing — alone, and with reasons a developer can act on.

## Prerequisites

- `acceptance-scope` is what was ordered; the criteria bind
  verbatim.
- `qa-protocol` is read first — the Kunde spot-checks and judges,
  QA already proved execution.
- `target-environment` is opened and used, not just reasoned about.
- `abnahme-protocol` is writable; `open-points` explains deferred
  blockers when a criterion's acceptance depends on one.

## Guidelines

- Accept only what satisfies the criterion as written; reject with
  the criterion id and a concrete, actionable reason.
- A criterion touching a mocked system is judged against the mock
  (mock rule, plan/leitplanken.md): the full flow visible and usable
  with labeled dummy data can be accepted **as prototype**, with the
  `Mock aktiv` open point cited in the protocol. The final protocol
  lists every mock-based acceptance — that list feeds the hardening
  round.
- No fixes, no rewording, no escalation to a human: the protocol is
  the communication.
- The final protocol after the last milestone states the
  as-best-as-possible result: accepted scope, unresolved rejections
  with reasons, and the open remainder.

## Workflow

### Phase 1 — Review of evidence

- Read `qa-protocol`; list criteria whose verdicts warrant a
  customer spot-check (conversion paths always qualify).

Quality gate: spot-check list drawn up covering all conversion
paths in scope.

### Phase 2 — Customer walk

- Open `target-environment` and use the milestone's scope as a
  customer: complete the flows, read the copy, judge against
  `acceptance-scope`.

Quality gate: every spot-check performed on the running preview.

### Phase 3 — Protocol

- Write `abnahme-protocol`: per criterion accepted / rejected with
  reason; cite `open-points` where a documented degradation was
  judged; state the gate verdict.

Quality gate: full criterion coverage, every rejection actionable,
gate verdict explicit.

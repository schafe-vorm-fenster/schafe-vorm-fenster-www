---
id: DEC-054
title: Visual generation waits for the complete design system
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

The tokens, the UI kit and the logos in
`@schafe-vorm-fenster/brand-design` are not treated as sufficient input
for generating the visual layer. Component library and breakpoints are
awaited as a formal specification before that layer is generated.

Everything that does not depend on the visual system — routing, content
pipeline, relevance engine, BFF, analytics, security, delivery — is
unblocked and proceeds.

## Consequences

Q-023 stays open by decision rather than by omission, and it is the
gate on visual generation. TS-017 D2's breakpoint proposals and TS-002
D3's weight floor remain provisional until the system lands and are
superseded by it, not merged with it.

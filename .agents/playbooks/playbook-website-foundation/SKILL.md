---
name: website-foundation
description: Stand up the technical foundation of a specified website — framework, strict typing, test harness, brand binding, and a proven preview deploy chain.
layer: project
tags:
  - foundation
  - scaffolding
  - delivery
interfaces:
  - id: foundation-spec
    description: The tactical specs fixing stack, typing, mobile-first rules, and brand binding.
    required: true
  - id: delivery-spec
    description: The tactical spec and decisions fixing the preview deploy chain and merge gates.
    required: true
  - id: brand-package
    description: The installed design-token package the foundation must bind, pinned exact.
    required: true
  - id: verification-strategy
    description: The document mapping acceptance-criterion levels to test tooling.
    required: true
  - id: sibling-repos
    description: Neighbouring repositories consulted for the stack-harmony rule before any new dependency.
    required: true
  - id: stack-registry
    description: The allowlist file registering every runtime dependency with its justification.
    required: true
  - id: state-files
    description: The run's status document and open-points list.
    required: true
---

# Website Foundation

Turn a specification-only repository into a deployable, strictly
typed, brand-bound application skeleton whose delivery chain has been
proven once end to end.

## Prerequisites

- `foundation-spec` is readable and its [FIXED] determinations are
  unambiguous; conflicts go to `state-files`, they never block.
- `delivery-spec` names the preview model; production stays out of
  reach by guardrail.
- `brand-package` is installed and importable.
- `verification-strategy` names the test tooling per level.
- `sibling-repos` are reachable for the stack-harmony lookups.
- `stack-registry` exists or is created in Phase 2.

## Guidelines

- Every dependency decision walks the stack-harmony rule: look
  sideways in `sibling-repos` first, decide, record the ADR, register
  in `stack-registry`.
- Configuration is code: no option without a reason traceable to
  `foundation-spec` or an ADR.
- The one token-import file is the only place brand values enter;
  everything else consumes CSS custom properties.
- Prove, don't assume: the phase gates below are commands that ran,
  not judgements.

## Workflow

### Phase 1 — Typing and gates

- Create the strict root tsconfig, wire `typecheck` into the
  repository's single check command, keep the existing spec guard
  green.

Quality gate: the check command runs typecheck + spec guard and is
green.

### Phase 2 — Framework and registry

- Scaffold the framework per `foundation-spec` (current major, App
  Router, server-first), create `stack-registry`, register every
  runtime dependency with its stack-harmony ADR.

Quality gate: dev server serves a page locally; every runtime
dependency appears in `stack-registry`.

### Phase 3 — Test harness

- Install and configure the unit/integration and e2e tooling named
  by `verification-strategy`; replace the stub test script; add one
  real test per level as proof.

Quality gate: unit, integration, and e2e each execute at least one
real passing test locally.

### Phase 4 — Brand binding and shell

- Create the single token-import file from `brand-package`, the
  mobile-first layout shell with the two fixed breakpoints, and the
  security-header/CSP scaffold.

Quality gate: no colour or font-family literal outside the token
file (greppable); shell renders on both reference viewports.

### Phase 5 — Preview chain

- Deploy to preview per `delivery-spec`, run the e2e smoke against
  the preview URL (protection bypass via the automation secret).

Quality gate: preview URL reachable, smoke green — the chain is
proven end to end, once, and the result is recorded in
`state-files`.

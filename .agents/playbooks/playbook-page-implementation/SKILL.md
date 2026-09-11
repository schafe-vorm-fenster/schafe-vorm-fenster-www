---
name: page-implementation
description: Implement one website page from its page spec — composition, components, states, and acceptance criteria — inside an existing foundation.
layer: project
tags:
  - implementation
  - pages
  - components
interfaces:
  - id: page-spec
    description: The tactical spec of the one page being built — modules, order, data needs, acceptance criteria.
    required: true
  - id: composition-rules
    description: The cross-page composition rule set — focus job, context band, closing CTA, block order.
    required: true
  - id: design-system
    description: The binding visual specification and its rendered boards.
    required: true
  - id: route-map
    description: The route tree and translation map the page must register in.
    required: true
  - id: brand-tokens
    description: The token-import surface for every colour, type, and spacing value.
    required: true
  - id: content-model
    description: The content pipeline's per-locale artifacts and schemas the page consumes.
    required: true
  - id: state-files
    description: The run's status document and open-points list.
    required: true
---

# Page Implementation

Build exactly one page as its page spec composes it: the named
modules in the named order, every state designed, every acceptance
criterion individually satisfiable.

## Prerequisites

- `page-spec` is the single scope: one page, its modules, its ACs.
- `composition-rules` and `design-system` are loaded before the
  first component decision.
- `route-map` fixes path, locale variants, and translations.
- `brand-tokens` is the only source for visual values.
- `content-model` supplies real or placeholder content per phase.
- Gaps and contradictions go to `state-files` as assumptions.

## Guidelines

- A missing component is derived from `design-system` and marked
  [PROPOSED] — never invented freestyle, never blocking.
- Every box that receives async content declares its ratio or height
  before the content arrives; a layout shift after paint is a
  defect.
- Empty and error states are designed states from the spec, not
  afterthoughts — a degraded external dependency renders its
  documented fallback.
- One component tree for all viewports; breakpoints change spacing,
  type step, aspect, and column count only.

## Workflow

### Phase 1 — Composition skeleton

- Register the route in `route-map` terms (both locales), lay the
  section sequence exactly as `page-spec` orders it, with reserved
  space and skeletons.

Quality gate: page renders both locales with every module present as
a correctly sized placeholder; no horizontal scroll on the reference
viewports.

### Phase 2 — Components

- Build or reuse each module against `design-system`; wire
  `brand-tokens`; implement all interaction states (hover, focus,
  pressed, disabled) and the focus ring.

Quality gate: every module matches the boards on both reference
viewports; keyboard traversal reaches every control.

### Phase 3 — Data and states

- Connect `content-model` and the page's data needs; implement
  loading, empty, error, and degraded states as designed.

Quality gate: page renders correctly with full data, no data, and
failing upstreams (simulated), without raw errors.

### Phase 4 — Acceptance pass

- Walk `page-spec`'s acceptance criteria one by one; write the tests
  at each criterion's verification level; fix what fails.

Quality gate: every AC of the page has a passing check at its level,
or a `state-files` entry naming why it cannot pass yet.

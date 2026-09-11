---
id: DEC-068
title: Every gap is filled with a marked placeholder, never left empty
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Context

TS-003 D2 declared two photographs as LCP elements — a WhatsApp scene on
`/mitmachen`, a founder photo on `/ueber-uns` — that do not exist. The
question was whether to keep them or make every page text-first, on the
grounds that a performance budget should not depend on an asset nobody
has produced.

That framing was too narrow. The gap is not two photographs; it is that
the site will reach a buildable state long before the content phase has
produced everything it references, and the specs had no rule for what
happens in the meantime.

## Decision

**Showing something everywhere beats showing only what is finished and
ours.** A missing asset or a missing text is filled with a generated
placeholder and swapped later. An empty slot, a collapsed block or a
page that cannot render is never the answer to a content gap.

This is a build-and-review principle, not a publishing one: it makes the
site complete enough to look at, click through and measure while the real
material is still being made.

### The guardrail that makes it safe

A placeholder must never be mistakable for the real thing. Concretely:

1. **Marked in the markup.** Every placeholder carries
   `data-placeholder="<reason>"`, so a build can enumerate what still
   needs replacing and a reviewer can see it in the DOM.
2. **Visibly generated.** Placeholder images are abstract — brand-token
   colour fields, the aspect ratio, a label naming what belongs there.
   They are produced deterministically from a manifest, committed, and
   carry no bitmap origin.
3. **Never a fabricated person, place, or record.** No synthetic
   photograph of a human being presented as a founder, a resident or a
   customer; no invented village, no invented outlet, no invented
   testimonial, no invented figure. A placeholder may occupy a slot; it
   may not *assert* anything. This is the line between an unfinished page
   and a fabricated one, and it is not negotiable — the claims regime of
   DEC-065 checks text, and an image carries no frontmatter to check.
4. **Never in a proof slot.** Proof elements are governed by
   `usage_rights` clearance (SRC-002): an uncleared element is excluded,
   not placeheld. A proof stream with too few cleared elements renders
   shorter, and the claim it supports is weakened — that regime stands
   untouched.
5. **Blocking for launch, not for build.** The build lists every
   `data-placeholder` in its summary. Production promotion requires the
   list to be empty, or each remaining entry to be explicitly accepted.

## Consequences

- The two image LCPs in TS-003 D2 **stay**. The placeholder exists from
  day one at the declared aspect ratio, so the LCP element has its
  geometry immediately and the swap to the real photograph changes bytes,
  not layout and not the budget.
- Aspect ratios move from "nice to have" to load-bearing: the placeholder
  declares one, and the real image is later cropped to it. A photograph
  that arrives in a different aspect is the photograph's problem, not the
  layout's.
- `scripts/make-placeholders.mjs` generates the set from
  `placeholders.manifest.json` into `src/generated/placeholders/`.
  Generated and committed, for the same reason as the resilience
  snapshots (DEC-069): a file that must exist on a clean checkout cannot
  be produced on demand.
- Rule 3 is the one to re-read before generating anything. "We will swap
  it later" is a reason to place a grey field with a label, never a reason
  to place something that looks like evidence.

---
id: DEC-055
title: Segmentation cache cost is observed in production, not gated before launch
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

The cache cost of community-level segmentation is observed after launch
rather than measured as a launch gate. If entry counts or hit rates turn
out badly, the segmentation falls back to municipality level — that is a
parameter change, not an architecture change.

## Reasoning

The trade was already accepted when community segmentation was chosen
(DEC-041 §7): finer segmentation is what makes proximity tier 0 reachable
at all. Pre-launch measurement on a preview would produce a synthetic
traffic mix and a number nobody would trust anyway.

## Consequences

→ TS-005 D8 records the fallback path explicitly. Resolves Q-030; the
observation belongs to the post-launch operations, not the pipeline.

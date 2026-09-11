/**
 * Provenance on the page — the one place the `Demo-Daten` badge is decided
 * (plan/guardrails.md mock and dummy-content rules, TS-007 D6).
 *
 * The components already know how to show it: every module that depends on
 * late or external data takes one `state` prop, and `mocked` is "full dummy
 * data plus `demo-data-badge`" (`src/components/data-state.ts`). A page
 * therefore never reads `slot.demo` itself and never decides per block
 * whether to render a badge — it passes `slotState(slot)` down, and the
 * module marks itself.
 */

import type { ContentSlot } from "@/src/lib/content/types";
import type { DataState } from "@/src/components/data-state";

/**
 * True for a slot the prototype fills with generated dummy content.
 *
 * `sourced-empty-by-design` and `withheld` are deliberately *not* demo: those
 * slots stay visibly empty because a clearance is missing or a page spec
 * forbids the sentence (SRC-001 rule 4, TS-007 D2). Substituting copy there
 * is the one thing the guardrails forbid outright.
 */
export function isDemoSlot(slot: ContentSlot): boolean {
  return slot.demo && slot.provenance === "generated";
}

/**
 * The state a module renders a slot in.
 *
 * `mocked` for dummy content, `empty` for a slot that could not be read or
 * that is empty by design, and otherwise whatever the page's own data
 * situation is — `base` lets a live module stay `degraded` or `loading`
 * while its copy is perfectly fine.
 */
export function slotState(slot: ContentSlot, base: DataState = "ready"): DataState {
  if (isDemoSlot(slot)) return "mocked";
  if (slot.empty) return "empty";
  if (slot.provenance === "sourced-empty-by-design" || slot.provenance === "withheld") {
    return slot.body.trim() === "" ? "empty" : base;
  }
  return base;
}

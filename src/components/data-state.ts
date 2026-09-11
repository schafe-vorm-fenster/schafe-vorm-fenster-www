/**
 * The four states, one vocabulary — plan/component-inventory.md §1 rule 6
 * and decision D-9.
 *
 * Every component that depends on late or external data declares all four.
 * A component that only knows "has data / has none" reintroduces the spinner
 * and the error sentence that TS-008 D5 and TS-009 D4 forbid, because
 * emptiness, staleness, failure and mock data are four different things:
 *
 *   ready     the data arrived and is real
 *   loading   the `skeleton` at the final geometry, no animation, ≤ 2 s
 *   empty     the honest, designed state — publisher invitation, "Foto
 *             gesucht", or the module omitted. Never a blank box
 *   degraded  tier 2 (`freshness-label` "Stand: …") or tier 3 (a build-time
 *             snapshot labelled as an example). Never a spinner, never an
 *             error sentence, never a warning icon, never a retry control
 *   mocked    full dummy data plus the `demo-data-badge`, and a `Mock aktiv`
 *             row in state/open.md (plan/guardrails.md)
 */
export const DATA_STATES = ["ready", "loading", "empty", "degraded", "mocked"] as const;

export type DataState = (typeof DATA_STATES)[number];

/** The four states a component must declare beyond the plain `ready` case. */
export const DECLARED_STATES = ["loading", "empty", "degraded", "mocked"] as const;

export interface DataStateProps {
  /**
   * Which of the five states to render. Defaults to `ready`; a component
   * that is handed no data still renders its honest `empty` state rather
   * than nothing.
   */
  readonly state?: DataState;
}

/** The mock rule's marking condition — one predicate, so no page re-derives it. */
export function isMocked(state: DataState | undefined): boolean {
  return state === "mocked";
}

/** True while the component must reserve geometry instead of showing content. */
export function isPending(state: DataState | undefined): boolean {
  return state === "loading";
}

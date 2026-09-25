/**
 * The explain module's auto-advance, as a pure state machine.
 *
 * The motion exception (DEC-0105 §6, amended twice on 2026-09-25) fixes the
 * numbers and the rules; this file is the whole of the logic that applies
 * them, so it can be tested without a browser, a timer or an observer
 * (`explain-advance.test.ts`). The component (`explain-module.tsx`) does three
 * things around it: it feeds the observer's ratio in, it turns
 * `scheduledDelay()` into one `setTimeout` at a time, and it renders the
 * state. Nothing else decides anything.
 *
 * The rules, and where each one lives below:
 *
 *  - starts on the first intersection at which three quarters of the module
 *    are in the viewport, never on load → `intersect` is the only event that
 *    leaves `armed`, and only at `ratio >= INTERSECTION_THRESHOLD`;
 *  - state 1 gets a full dwell before the first advance → the first
 *    scheduled delay is `DWELL_MS`, never a transition;
 *  - one pass to state 3, then it stops, no loop → `tick` on the settled
 *    state 3 is unreachable: the settle *is* `done`;
 *  - any interaction stops it for good, focus included → `interact` and
 *    `select` end in `stopped`, and no event leaves a terminal phase;
 *  - no restart on scrolling back → `intersect` is ignored outside `armed`,
 *    and "once per page view" is the lifetime of the state, held in the
 *    component instance — no cookie, no storage (TS-WEB-0013);
 *  - under `prefers-reduced-motion` there is no advance at all → `disable`
 *    moves `armed` to `static`, where the buttons still select.
 *
 * Why a settled state and a heading state. `TS-WEB-0022-A19` and
 * `TS-WEB-0002-A13` measure "reaches state 3 no earlier than 9.1 s" — the
 * moment the transition *settles*, not the moment it starts. So the machine
 * models the 550 ms transition as its own step: a `tick` on a settled state
 * begins a move (`heading` runs ahead of `active`), and the next `tick`, after
 * `TRANSITION_MS`, settles it (`active` catches up). `data-state` on the
 * element follows `active`, and flips at 4 550 ms and 9 100 ms.
 */

export const STEP_COUNT = 3;
export type StepIndex = 1 | 2 | 3;
export const STEP_INDICES: readonly StepIndex[] = [1, 2, 3];

/** DEC-0105 §6: "at least 4 s dwell" — the floor, taken as the value. */
export const DWELL_MS = 4000;
/** DEC-0105 §6: "550 ms per transition" — the site's one motion duration. */
export const TRANSITION_MS = 550;
/** DEC-0105 §6 amendment, rule 1 / Q-0083: three quarters of the module's own height. */
export const INTERSECTION_THRESHOLD = 0.75;
/** One pass, trigger to settled state 3: 4 000 + 550 + 4 000 + 550 = 9 100 ms. */
export const PASS_DURATION_MS = DWELL_MS + TRANSITION_MS + DWELL_MS + TRANSITION_MS;

export type AdvancePhase =
  /** Waiting for the first three-quarter intersection. Nothing has moved. */
  | "armed"
  /** The pass is under way — a timer is always pending in this phase. */
  | "running"
  /** The pass ended at state 3 on its own. Terminal. */
  | "done"
  /** An interaction ended it. Terminal — nothing restarts it. */
  | "stopped"
  /** Reduced motion, or a width from `lg`: never arms. Terminal. */
  | "static";

export interface AdvanceState {
  /** The state the stage shows once settled — `aria-current` follows it. */
  readonly active: StepIndex;
  /** Equal to `active` when settled; `active + 1` while a transition runs. */
  readonly heading: StepIndex;
  readonly phase: AdvancePhase;
}

export type AdvanceEvent =
  /** The observer reported the module's intersection ratio. */
  | { readonly type: "intersect"; readonly ratio: number }
  /** The pending timer fired. */
  | { readonly type: "tick" }
  /** Focus entered the module, or anything in it was clicked. */
  | { readonly type: "interact" }
  /** A step line was activated. */
  | { readonly type: "select"; readonly step: StepIndex }
  /** `prefers-reduced-motion: reduce`, or a viewport at `lg` or wider. */
  | { readonly type: "disable" };

/** Server-rendered, and what a JavaScript-less load shows: state 1, waiting. */
export const INITIAL_ADVANCE_STATE: AdvanceState = { active: 1, heading: 1, phase: "armed" };

const TERMINAL: ReadonlySet<AdvancePhase> = new Set(["done", "stopped", "static"]);

export const isTerminal = (phase: AdvancePhase): boolean => TERMINAL.has(phase);
export const isMoving = (state: AdvanceState): boolean => state.active !== state.heading;

function next(step: StepIndex): StepIndex {
  return step === 1 ? 2 : 3;
}

/** The whole logic. Total over both types; every unhandled pair returns the state unchanged. */
export function nextAdvanceState(state: AdvanceState, event: AdvanceEvent): AdvanceState {
  switch (event.type) {
    case "intersect":
      if (state.phase !== "armed") return state;
      if (event.ratio < INTERSECTION_THRESHOLD) return state;
      return { ...state, phase: "running" };

    case "tick": {
      if (state.phase !== "running") return state;
      if (isMoving(state)) {
        // The transition settled. State 3 settling is the end of the pass.
        const active = state.heading;
        return { active, heading: active, phase: active === STEP_COUNT ? "done" : "running" };
      }
      if (state.active === STEP_COUNT) return { ...state, phase: "done" };
      return { ...state, heading: next(state.active) };
    }

    case "interact":
      if (isTerminal(state.phase)) return state;
      // A move already under way finishes — a stage stopped half-cropped is
      // not a state. What stops is the *next* advance, and every one after it.
      return { active: state.heading, heading: state.heading, phase: "stopped" };

    case "select": {
      const phase = isTerminal(state.phase) ? state.phase : "stopped";
      return { active: event.step, heading: event.step, phase };
    }

    case "disable":
      if (isTerminal(state.phase)) return state;
      return { active: state.heading, heading: state.heading, phase: "static" };
  }
}

/**
 * How long the component waits before the next `tick`, or `null` when no
 * timer belongs to this state. Only `running` ever schedules one: a settled
 * state dwells, a moving state waits for its transition to finish.
 */
export function scheduledDelay(state: AdvanceState): number | null {
  if (state.phase !== "running") return null;
  return isMoving(state) ? TRANSITION_MS : DWELL_MS;
}

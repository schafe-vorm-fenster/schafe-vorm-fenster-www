import { describe, expect, it } from "vitest";

import {
  DWELL_MS,
  INITIAL_ADVANCE_STATE,
  INTERSECTION_THRESHOLD,
  PASS_DURATION_MS,
  TRANSITION_MS,
  isMoving,
  nextAdvanceState,
  scheduledDelay,
  type AdvanceEvent,
  type AdvanceState,
} from "./explain-advance";

/**
 * The auto-advance rules of DEC-0105 §6 (as amended twice on 2026-09-25),
 * TS-WEB-0002 D7 and TS-WEB-0022 D4, held against the pure machine. The
 * browser halves — the observer, the timers, the buttons — are asserted in
 * `e2e/explain-module.spec.ts` (TS-WEB-0002-A13, TS-WEB-0022-A19).
 */

function run(events: readonly AdvanceEvent[], from: AdvanceState = INITIAL_ADVANCE_STATE): AdvanceState {
  return events.reduce(nextAdvanceState, from);
}

/** Drives the machine through its timers, returning the states it passes and the time each settled. */
function runPass(from: AdvanceState): Array<{ readonly at: number; readonly state: AdvanceState }> {
  const trace: Array<{ at: number; state: AdvanceState }> = [];
  let state = from;
  let at = 0;
  for (let guard = 0; guard < 10; guard += 1) {
    const delay = scheduledDelay(state);
    if (delay === null) break;
    at += delay;
    state = nextAdvanceState(state, { type: "tick" });
    trace.push({ at, state });
  }
  return trace;
}

const intersect = (ratio: number): AdvanceEvent => ({ type: "intersect", ratio });

describe("the numbers are the specification's (DEC-0105 §6)", () => {
  it("dwells 4 s, moves in 550 ms, arms at three quarters, and one pass is 9.1 s", () => {
    expect(DWELL_MS).toBe(4000);
    expect(TRANSITION_MS).toBe(550);
    expect(INTERSECTION_THRESHOLD).toBe(0.75);
    expect(PASS_DURATION_MS).toBe(9100);
  });

  it("is server-rendered at state 1, armed, settled — the JavaScript-less load", () => {
    expect(INITIAL_ADVANCE_STATE).toEqual({ active: 1, heading: 1, phase: "armed" });
    expect(scheduledDelay(INITIAL_ADVANCE_STATE)).toBeNull();
  });
});

describe("rule 1 — it starts on intersection at three quarters, never on load", () => {
  it("does nothing while armed and no timer runs", () => {
    expect(scheduledDelay(INITIAL_ADVANCE_STATE)).toBeNull();
  });

  it("ignores an intersection below the threshold", () => {
    expect(run([intersect(0.5)])).toEqual(INITIAL_ADVANCE_STATE);
    expect(run([intersect(0.7499)])).toEqual(INITIAL_ADVANCE_STATE);
  });

  it("starts at exactly the threshold and above it", () => {
    expect(run([intersect(0.75)]).phase).toBe("running");
    expect(run([intersect(1)]).phase).toBe("running");
  });

  it("a second intersection changes nothing once running", () => {
    const running = run([intersect(0.8)]);
    expect(run([intersect(1)], running)).toEqual(running);
    expect(run([intersect(0)], running)).toEqual(running);
  });
});

describe("rules 2 and 3 — a full dwell first, one pass, then it stops at state 3", () => {
  const running = run([intersect(0.8)]);

  it("the first scheduled delay is the dwell, not a transition", () => {
    expect(running.active).toBe(1);
    expect(scheduledDelay(running)).toBe(DWELL_MS);
  });

  it("settles state 2 at 4 550 ms and state 3 at 9 100 ms, and is done", () => {
    const trace = runPass(running);
    const settled = trace.filter((point) => !isMoving(point.state));
    expect(settled.map((point) => [point.at, point.state.active])).toEqual([
      [DWELL_MS + TRANSITION_MS, 2],
      [PASS_DURATION_MS, 3],
    ]);
    expect(trace.at(-1)?.state).toEqual({ active: 3, heading: 3, phase: "done" });
  });

  it("the moving steps are exactly two, each 550 ms long", () => {
    const trace = runPass(running);
    const moving = trace.filter((point) => isMoving(point.state));
    expect(moving.map((point) => [point.state.active, point.state.heading])).toEqual([
      [1, 2],
      [2, 3],
    ]);
    for (const point of moving) expect(scheduledDelay(point.state)).toBe(TRANSITION_MS);
  });

  it("there is no loop: done schedules nothing and a tick does not move it", () => {
    const done = runPass(running).at(-1)?.state as AdvanceState;
    expect(scheduledDelay(done)).toBeNull();
    expect(nextAdvanceState(done, { type: "tick" })).toEqual(done);
  });

  it("scrolling back does not restart it — intersect after done is ignored (rule 5)", () => {
    const done = runPass(running).at(-1)?.state as AdvanceState;
    expect(run([intersect(1)], done)).toEqual(done);
  });
});

describe("rule 4 — any interaction stops it for good", () => {
  it("focus before the pass started spends it: armed → stopped, and intersection cannot start it", () => {
    const stopped = run([{ type: "interact" }]);
    expect(stopped).toEqual({ active: 1, heading: 1, phase: "stopped" });
    expect(run([intersect(1)], stopped)).toEqual(stopped);
    expect(scheduledDelay(stopped)).toBeNull();
  });

  it("focus during a dwell stops at the shown state and cancels the timer", () => {
    const stopped = run([intersect(1), { type: "interact" }]);
    expect(stopped).toEqual({ active: 1, heading: 1, phase: "stopped" });
    expect(scheduledDelay(stopped)).toBeNull();
    expect(nextAdvanceState(stopped, { type: "tick" })).toEqual(stopped);
  });

  it("focus during a move lets the move finish and stops there — never half-cropped", () => {
    const moving = run([intersect(1), { type: "tick" }]);
    expect(isMoving(moving)).toBe(true);
    const stopped = nextAdvanceState(moving, { type: "interact" });
    expect(stopped).toEqual({ active: 2, heading: 2, phase: "stopped" });
    expect(scheduledDelay(stopped)).toBeNull();
  });

  it("does not resume — no event brings stopped back to running", () => {
    const stopped = run([intersect(1), { type: "interact" }]);
    for (const event of [intersect(1), { type: "tick" }, { type: "interact" }] as const) {
      expect(nextAdvanceState(stopped, event).phase).toBe("stopped");
    }
  });

  it("activating a step line shows that state and stops the pass", () => {
    const selected = run([intersect(1), { type: "select", step: 3 }]);
    expect(selected).toEqual({ active: 3, heading: 3, phase: "stopped" });
    expect(scheduledDelay(selected)).toBeNull();
  });

  it("the step lines keep working after the pass — in every terminal phase", () => {
    const done = runPass(run([intersect(1)])).at(-1)?.state as AdvanceState;
    expect(run([{ type: "select", step: 1 }], done)).toEqual({ active: 1, heading: 1, phase: "done" });
    const stopped = run([{ type: "interact" }]);
    expect(run([{ type: "select", step: 2 }], stopped)).toEqual({ active: 2, heading: 2, phase: "stopped" });
    const reduced = run([{ type: "disable" }]);
    expect(run([{ type: "select", step: 3 }], reduced)).toEqual({ active: 3, heading: 3, phase: "static" });
  });
});

describe("rule 6 — prefers-reduced-motion: state 1 static, buttons operable", () => {
  it("disable arms nothing: no intersection and no tick ever moves it", () => {
    const reduced = run([{ type: "disable" }]);
    expect(reduced).toEqual({ active: 1, heading: 1, phase: "static" });
    expect(scheduledDelay(reduced)).toBeNull();
    expect(run([intersect(1), { type: "tick" }], reduced)).toEqual(reduced);
  });

  it("a terminal phase is not overwritten by disable", () => {
    const stopped = run([intersect(1), { type: "select", step: 2 }]);
    expect(run([{ type: "disable" }], stopped)).toEqual(stopped);
  });
});

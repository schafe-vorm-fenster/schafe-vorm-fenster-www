/**
 * The real eTracker adapter — TS-012 D2, written but disabled.
 *
 * **Why disabled:** D4 rule 4 — "Mapping `stage` and the goal ID onto
 * eTracker's concrete event fields … is verified in the account before
 * launch — the *contract* above binds, the field mapping is [PROPOSED]."
 * That verification is open (state/open.md row 12, Q-040: "eTracker
 * property/goal-id parity with the app never inspected"). Until it closes,
 * `index.ts` never returns this tracker — `getAnalyticsTracker()` is the
 * one injection point, gated by `NEXT_PUBLIC_ETRACKER_REAL_ADAPTER`.
 *
 * **The field mapping implemented here is a best-effort placeholder**
 * ([PROPOSED]): it calls the vendor's documented `_etracker.sendEvent`
 * queue with the goal id as the event category and the stage as the
 * action, which is the shape SRC-010's legacy loader assumes but which the
 * account has not confirmed. Swapping the mapping once it is confirmed
 * touches this one file.
 *
 * D9 (never block, never break) applies here exactly as it does to the
 * mock: a missing, blocked, or throwing vendor global is a silent no-op.
 */

import type { AnalyticsTracker, ConversionAttributes, EventStage } from "./types";

interface EtrackerGlobal {
  /**
   * The eTracker Advanced Analytics JS event queue, exposed by the
   * `_etLoader` script (D2) once it has run. [PROPOSED] shape — verify
   * against the account before this adapter is enabled (Q-040).
   */
  sendEvent?: (event: {
    category: string;
    action: string;
    [attribute: string]: string | number | boolean;
  }) => void;
}

function etrackerGlobal(): EtrackerGlobal | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { _etracker?: EtrackerGlobal })._etracker;
}

export function createEtrackerTracker(): AnalyticsTracker {
  return {
    trackConversion(
      goalId: string,
      stage: EventStage,
      attributes?: ConversionAttributes,
    ) {
      const et = etrackerGlobal();
      if (!et?.sendEvent) return; // D9: loader not ready or blocked — silent no-op.
      try {
        et.sendEvent({ category: goalId, action: stage, ...attributes });
      } catch {
        // D9: a failing vendor call must never surface to the caller.
      }
    },
  };
}

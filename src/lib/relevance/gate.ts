/**
 * The hard filters — TS-005 D5, WEB-F-033 and WEB-F-024.
 *
 * Clearance and place coverage are applied **before** scoring. An uncleared
 * element is not down-weighted, it does not enter the pool: a high-scoring
 * uncleared element never appears (A2).
 *
 * The one deliberate exception is the run's mock rule
 * (`plan/guardrails.md`): an element marked `demo` passes the gate carrying
 * its flag, so the prototype shows the mechanism working while the real
 * clearances are still open (state/open.md row 1, Q-045). The flag travels
 * with the selection; the page renders it as the `mocked` state with its
 * `Demo-Daten` badge, never as a real element.
 */

import type { RelevanceItem } from "./types";

export type GateReason = "clearance" | "place-not-covered";

export interface GateResult<Payload = unknown> {
  readonly items: readonly RelevanceItem<Payload>[];
  /** Every element the gate removed, with the reason — countable, not silent. */
  readonly dropped: readonly { readonly id: string; readonly reason: GateReason }[];
}

export interface GateOptions {
  /**
   * The communities events-api reports as covered. **Omitted means "not
   * asked"**, and a place-bound element then passes — the gate never invents
   * a coverage answer it was not given. A page that renders "in <place>" is
   * required to pass this (WEB-F-024).
   */
  readonly coveredPlaces?: readonly string[];
}

export function gate<Payload = unknown>(
  items: readonly RelevanceItem<Payload>[],
  options: GateOptions = {},
): GateResult<Payload> {
  const covered = options.coveredPlaces === undefined ? null : new Set(options.coveredPlaces);
  const passed: RelevanceItem<Payload>[] = [];
  const dropped: { id: string; reason: GateReason }[] = [];

  for (const item of items) {
    if (item.clearance !== "cleared" && item.demo !== true) {
      dropped.push({ id: item.id, reason: "clearance" });
      continue;
    }
    if (item.placeBound === true && covered !== null) {
      const place = item.place ?? null;
      if (place === null || !covered.has(place)) {
        dropped.push({ id: item.id, reason: "place-not-covered" });
        continue;
      }
    }
    passed.push(item);
  }

  return { items: passed, dropped };
}

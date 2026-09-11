/**
 * The mock tracker — plan/guardrails.md's mock rule, applied to TS-012 D2.
 *
 * Logs to the console and records nothing: no cookie, no `localStorage`,
 * `sessionStorage` or IndexedDB write, no network call. This is the
 * implementation every environment runs today (see `index.ts`) — the real
 * eTracker adapter exists (`etracker-tracker.ts`) but stays switched off
 * until the account/field-mapping open point closes (state/open.md row 12,
 * Q-040, TS-012 D4 rule 4).
 */

import type { AnalyticsTracker, ConversionAttributes, EventStage } from "./types";

export function createMockTracker(): AnalyticsTracker {
  return {
    trackPageView() {
      logMock("pageview", {});
    },
    trackConversion(
      goalId: string,
      stage: EventStage,
      attributes?: ConversionAttributes,
    ) {
      logMock("conversion", { goalId, stage, attributes });
    },
  };
}

function logMock(kind: "pageview" | "conversion", payload: Record<string, unknown>): void {
  // The mock's entire job is to be visible in dev/preview, not to collect anything.
  console.info(`[analytics:mock] ${kind}`, payload);
}

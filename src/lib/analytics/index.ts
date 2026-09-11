/**
 * The one factory a page or component calls — TS-012 D2's replaceability
 * rule made concrete: swapping the vendor touches this function, nothing
 * else.
 *
 * Today it always returns the mock (`mock-tracker.ts`): the real adapter
 * (`etracker-tracker.ts`) is written but stays off until the eTracker
 * account and field mapping are confirmed (state/open.md row 12, Q-040,
 * TS-012 D4 rule 4). `NEXT_PUBLIC_ETRACKER_REAL_ADAPTER` is that one
 * injection point — flipping it to `"true"` after the confirmation is the
 * entire hardening step for this module.
 */

import { createEtrackerTracker } from "./etracker-tracker";
import { createMockTracker } from "./mock-tracker";

import type { AnalyticsTracker } from "./types";

let cachedTracker: AnalyticsTracker | undefined;

export function getAnalyticsTracker(): AnalyticsTracker {
  if (!cachedTracker) cachedTracker = createTracker();
  return cachedTracker;
}

/** Test-only: forces the next `getAnalyticsTracker()` to rebuild. */
export function resetAnalyticsTrackerForTests(): void {
  cachedTracker = undefined;
}

function createTracker(): AnalyticsTracker {
  const realAdapterEnabled =
    process.env.NEXT_PUBLIC_ETRACKER_REAL_ADAPTER === "true";
  return realAdapterEnabled ? createEtrackerTracker() : createMockTracker();
}

export { appendCampaignParams, CAMPAIGN_PARAMS, extractCampaignParams, hasCampaignParams } from "./attribution";
export type { CampaignParam, CampaignParams } from "./attribution";
export {
  CONVERSION_EVENTS,
  conversionEvent,
  eventRegistryViolations,
  wiredConversionEvents,
} from "./event-registry";
export type { ConversionEventDefinition, ConversionGoalId } from "./event-registry";
export { createEtrackerTracker } from "./etracker-tracker";
export { createMockTracker } from "./mock-tracker";
export type { AnalyticsTracker, ConversionAttributes, EventStage } from "./types";

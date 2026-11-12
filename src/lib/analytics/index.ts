/**
 * The analytics module's public surface — TS-WEB-0012 D2. `getAnalyticsTracker()`
 * (`tracker.ts`) is the one factory; everything else here is the registry,
 * the naming schemes and the campaign helpers.
 */

export { getAnalyticsTracker, resetAnalyticsTrackerForTests } from "./tracker";
export { appendCampaignParams, CAMPAIGN_PARAMS, extractCampaignParams, hasCampaignParams } from "./attribution";
export type { CampaignParam, CampaignParams } from "./attribution";
export { etrackerSecureCode } from "./config";
export { CTA_ACTION, ctaEvent, GOAL_BY_ROUTE, isTrackedCta, NAVIGATION_CATEGORY, OUTBOUND_CATEGORY } from "./cta-event";
export type { CtaElement, CtaEvent } from "./cta-event";
export {
  CONVERSION_EVENTS,
  conversionEvent,
  eventRegistryViolations,
  wiredConversionEvents,
} from "./event-registry";
export type { ConversionEventDefinition, ConversionGoalId } from "./event-registry";
export { createEtrackerTracker } from "./etracker-tracker";
export { createMockTracker } from "./mock-tracker";
export { NOT_FOUND_PAGE, pageView } from "./page-view";
export type { PageView } from "./page-view";
export type { AnalyticsTracker, ConversionAttributes, EventStage } from "./types";

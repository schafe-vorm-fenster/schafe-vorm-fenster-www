/**
 * The mock tracker — plan/guardrails.md's mock rule, applied to TS-WEB-0012 D2.
 *
 * Logs to the console and records nothing: no cookie, no `localStorage`,
 * `sessionStorage` or IndexedDB write, no network call. This is what every
 * environment runs while `NEXT_PUBLIC_ETRACKER_SECURE_CODE` is unset
 * (`index.ts`, DEC-0218 §1): local development, CI and any deployment the
 * owner has not given a secure code.
 */

import type { CtaEvent } from "./cta-event";
import type { PageView } from "./page-view";
import type { AnalyticsTracker, ConversionAttributes, EventStage } from "./types";

export function createMockTracker(): AnalyticsTracker {
  return {
    trackPageView(view: PageView) {
      logMock("pageview", { pageName: view.pageName, areas: view.areas });
    },
    trackConversion(
      goalId: string,
      stage: EventStage,
      attributes?: ConversionAttributes,
    ) {
      logMock("conversion", { goalId, stage, attributes });
    },
    trackCtaClick(event: CtaEvent) {
      logMock("cta", { ...event });
    },
  };
}

function logMock(kind: "pageview" | "conversion" | "cta", payload: Record<string, unknown>): void {
  // The mock's entire job is to be visible in dev/preview, not to collect anything.
  console.info(`[analytics:mock] ${kind}`, payload);
}

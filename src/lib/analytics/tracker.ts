/**
 * The one factory a page or component calls — TS-WEB-0012 D2's replaceability
 * rule made concrete: swapping the vendor touches this function, nothing
 * else.
 *
 * The real adapter (`etracker-tracker.ts`) answers when
 * `NEXT_PUBLIC_ETRACKER_SECURE_CODE` is set (`config.ts`, DEC-0218 §1); the
 * mock (`mock-tracker.ts`) answers otherwise. The loader tag follows the same
 * variable (`etracker-analytics.tsx`).
 *
 * Its own file rather than `index.ts`, so the client listener can import it
 * without pulling the event registry and the hub goal index into the bundle.
 */

import { etrackerSecureCode } from "./config";
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
  const secureCode = etrackerSecureCode();
  return secureCode ? createEtrackerTracker(secureCode) : createMockTracker();
}

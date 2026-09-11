/**
 * The tracker interface — TS-012 D2's exported surface.
 *
 * D2: "No page, component, or content file calls the eTracker API directly.
 * Everything goes through one internal module … exposing exactly:
 * `trackPageView()` … and `trackConversion(goalId, stage, attributes)`."
 * This file is that contract; `index.ts` is the one factory that decides
 * which implementation answers it (mock today — see `mock-tracker.ts` and
 * `index.ts`).
 */

/** D4 rule: every event carries a fixed `stage` dimension. */
export type EventStage = "handover" | "completed";

/**
 * D4 rule 3: attributes carry no personal data and no free text. A place
 * slug is fine (public, not personal); form contents are not — the website
 * holds no submission data anyway (WEB-F-092).
 */
export type ConversionAttributes = Readonly<Record<string, string | number | boolean>>;

/**
 * D9 — the emission contract: never block, never break. Every
 * implementation of this interface (mock and real alike) must honour it:
 * `trackConversion` never throws and never delays a navigation, a blocked
 * or not-yet-loaded tracker is a silent no-op, and a dropped event is not
 * retried or queued across page loads (D1 forbids the storage that would
 * take).
 */
export interface AnalyticsTracker {
  /**
   * Only called if `data-page-changed-detection="url"` (D2) ever proves
   * insufficient for App Router client navigation — [FREE] per TS-012.
   * Optional so the mock and the real adapter need not both implement it
   * before that need is confirmed.
   */
  trackPageView?(): void;
  /** D4 — one call per completed trigger, `goalId` a hub conversion goal id. */
  trackConversion(
    goalId: string,
    stage: EventStage,
    attributes?: ConversionAttributes,
  ): void;
}

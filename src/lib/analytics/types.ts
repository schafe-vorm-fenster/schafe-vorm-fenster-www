/**
 * The tracker interface — TS-WEB-0012 D2's exported surface, widened by
 * DEC-0218 (issue 194).
 *
 * D2: "No page, component, or content file calls the eTracker API directly.
 * Everything goes through one internal module … exposing exactly:
 * `trackPageView()` … and `trackConversion(goalId, stage, attributes)`."
 * DEC-0218 adds `trackCtaClick(event)` beside them, for the click event every
 * CTA reports (`cta-event.ts`). This file is that contract; `index.ts` is the
 * one factory that decides which implementation answers it — the real
 * eTracker adapter when `NEXT_PUBLIC_ETRACKER_SECURE_CODE` is set, the mock
 * otherwise.
 */

import type { CtaEvent } from "./cta-event";
import type { PageView } from "./page-view";

/** D4 rule: every event carries a fixed `stage` dimension. */
export type EventStage = "handover" | "completed";

/**
 * D4 rule 3: attributes carry no personal data and no free text. A place
 * slug is fine (public, not personal); form contents are not — the website
 * holds no submission data anyway (FUN-WEB-0092).
 */
export type ConversionAttributes = Readonly<Record<string, string | number | boolean>>;

/**
 * D9 — the emission contract: never block, never break. Every
 * implementation of this interface (mock and real alike) must honour it:
 * no method throws or delays a navigation, a blocked or not-yet-loaded
 * tracker is a silent no-op, and a dropped event is not retried or queued
 * across page loads (D1 forbids the storage that would take).
 */
export interface AnalyticsTracker {
  /**
   * One call per page view, the first one included (DEC-0218 §2). The real
   * adapter names the page (`et_pagename`, `et_areas`) and, from the second
   * view of a document on, sends a virtual page view — the first is counted
   * by the loader itself when it arrives.
   */
  trackPageView(view: PageView): void;
  /** D4 — one call per completed trigger, `goalId` a hub conversion goal id. */
  trackConversion(
    goalId: string,
    stage: EventStage,
    attributes?: ConversionAttributes,
  ): void;
  /** DEC-0218 §3 — one call per CTA click. */
  trackCtaClick(event: CtaEvent): void;
}

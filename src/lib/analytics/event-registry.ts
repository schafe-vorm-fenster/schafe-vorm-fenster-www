/**
 * The event registry — TS-012 D4: one event per conversion goal, the event
 * name **is** the hub goal id verbatim.
 *
 * This is the only place a `(goalId, stage)` pair is decided for a surface;
 * a page or CTA looks its own entry up here rather than inventing one
 * (`conversionEvent(goalId)`). `eventRegistryViolations()` is the static
 * half of TS-012-A3, run by `event-registry.test.ts` as part of `pnpm test`
 * (hence `pnpm check`) — an id that does not resolve against
 * `@schafe-vorm-fenster/goals` fails the build there.
 *
 * `stage: null` marks a goal that is not wired from the website today (D4's
 * rightmost rows) — the registry still lists it, with `note` naming why, so
 * "one event per conversion goal" stays readable as *complete for the
 * countable goals* rather than silently missing three rows.
 */

import { isKnownConversionGoalId } from "./goal-ids";

import type { EventStage } from "./types";
import type { RouteId } from "@/src/lib/routes/routes";

export interface ConversionEventDefinition {
  /** The hub conversion-goal id (`@schafe-vorm-fenster/goals`), verbatim. */
  readonly goalId: string;
  /** `null` where D4 wires no call site yet. */
  readonly stage: EventStage | null;
  /** What fires the event, or why nothing does — content, not code. */
  readonly trigger: string;
  /** Where it fires. `"app"` for a goal the app completes with no website role. */
  readonly surface: readonly RouteId[] | "app";
  /** Whether a call site exists in this codebase today. */
  readonly wired: boolean;
}

export const CONVERSION_EVENTS: readonly ConversionEventDefinition[] = [
  {
    goalId: "register-as-publisher",
    stage: "handover",
    trigger: "click of the registration CTA that navigates to app.*",
    surface: ["register"],
    wired: true,
  },
  {
    goalId: "publish-first-event",
    stage: null,
    trigger: "happens entirely in the app; the app emits its own `completed`",
    surface: "app",
    wired: false,
  },
  {
    goalId: "save-calendar-to-homescreen",
    stage: "handover",
    trigger:
      "click that opens a place calendar on app.* (place search on / and /dein-ort, and the 404 place search)",
    surface: ["home", "place"],
    wired: true,
  },
  {
    goalId: "buy-calendar-licence",
    stage: "completed",
    trigger: "invoice checkout concluded, embed code shown (WEB-F-094)",
    surface: ["order"],
    wired: true,
  },
  {
    goalId: "request-licence-quote",
    stage: "completed",
    trigger: "envoy widget reports a successful submission (WEB-F-090)",
    surface: ["regionQuote"],
    wired: true,
  },
  {
    goalId: "request-product-briefing",
    stage: "handover",
    trigger:
      "outbound click to the Google Calendar booking link (WEB-F-093) — the booking itself is off-site with no callback",
    surface: ["calendar", "region"],
    wired: true,
  },
  {
    goalId: "request-ad-placement",
    stage: null,
    trigger:
      "not wired at launch — offering `local-advertising` is `promotion: withheld` (Q-006)",
    surface: "app",
    wired: false,
  },
  {
    goalId: "order-promotion-material",
    stage: null,
    trigger: "not wired at launch — no page yet (Q-005)",
    surface: "app",
    wired: false,
  },
  {
    goalId: "publish-events-regularly",
    stage: null,
    trigger: "not countable — the hub marks the recurrence rule open",
    surface: "app",
    wired: false,
  },
] as const;

export type ConversionGoalId = (typeof CONVERSION_EVENTS)[number]["goalId"];

export function conversionEvent(
  goalId: string,
): ConversionEventDefinition | undefined {
  return CONVERSION_EVENTS.find((event) => event.goalId === goalId);
}

/** Every wired event — the ones a page/CTA may actually call today. */
export function wiredConversionEvents(): readonly ConversionEventDefinition[] {
  return CONVERSION_EVENTS.filter((event) => event.wired);
}

/**
 * TS-012-A3, static half: no duplicate goal id, and every id resolves
 * against the hub package. Returns the violations, `[]` when clean.
 */
export function eventRegistryViolations(
  events: readonly ConversionEventDefinition[] = CONVERSION_EVENTS,
): string[] {
  const violations: string[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    if (seen.has(event.goalId)) violations.push(`duplicate goal id: ${event.goalId}`);
    seen.add(event.goalId);

    if (!isKnownConversionGoalId(event.goalId))
      violations.push(`unknown hub goal id: ${event.goalId}`);

    if (event.wired && event.stage === null)
      violations.push(`${event.goalId} is wired but carries no stage`);
    if (!event.wired && event.stage !== null)
      violations.push(`${event.goalId} is not wired but carries a stage`);
  }

  return violations;
}

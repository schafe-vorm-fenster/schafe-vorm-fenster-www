"use client";

/**
 * The two ways a page fires a conversion event without turning its own
 * server-rendered CTA into a client component (TS-012 D2/D4).
 *
 * A Server Component page cannot pass a function prop into `Button` or
 * `OutboundLink` (both stay server components, per `src/components/README.md`
 * "server-first"). `ConversionTracker` takes the already-rendered CTA as
 * `children` instead — the RSC "children as a slot" pattern — and attaches
 * one native click listener on a `display: contents` wrapper, so the click
 * bubbles up from the real anchor/button underneath unchanged. D9: this
 * never calls `preventDefault`, so the navigation is never delayed.
 *
 * `FireConversionOnMount` is for the one surface that fires on **render**,
 * not on a click — TS-025 D11 ("fired once when step 4 renders a code, not
 * on reaching step 4, not on submitting step 3").
 *
 * **What "exactly once" is keyed on** (F-2-60). A `useRef` guard only covers
 * React re-rendering the same mount, and TS-012-A5 asks for more than that:
 * "client-side navigation back and forth does not replay it". Pressing Back
 * and then Forward unmounts and re-mounts the component, so the ref is gone
 * and the goal fired a second time — the one goal wired at `stage: completed`
 * over-counting, on a paid conversion path.
 *
 * The guard is therefore keyed on **the completed step**, not on the mount,
 * and lives at module scope so it survives every soft navigation inside the
 * document. It deliberately does *not* survive a reload or a new tab: the
 * flow has no session and stores nothing between page views (DEC-009,
 * TS-025 D8), and a `sessionStorage` entry to remember a fired goal would be
 * exactly the store those two forbid. A fresh document is a fresh visit.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";

import { getAnalyticsTracker } from "@/src/lib/analytics";

import type { ConversionAttributes, EventStage } from "@/src/lib/analytics/types";
import type { ReactNode } from "react";

/**
 * One goal binding, as a **serializable** object.
 *
 * A component that owns its own CTA (`howto-block`'s app link,
 * `envoy-form-mount`'s submit) cannot be wrapped from the outside without
 * arming every click inside it, so it takes the binding as a prop and wraps
 * its own control. Strings only — the binding crosses `use cache`
 * boundaries as an island prop.
 */
export interface ConversionBinding {
  readonly goalId: string;
  readonly stage: EventStage;
  readonly attributes?: ConversionAttributes;
}

export interface ConversionTrackerProps extends ConversionBinding {
  readonly children: ReactNode;
}

/**
 * The hydration signal (F-2-71). Until this wrapper has hydrated its click
 * listener does not exist, so a test that clicks the CTA before then gets a
 * navigation and no event — the race the register and order flows kept
 * losing against a production build, where `waitForLoadState("networkidle")`
 * never settles on a streamed route. `data-hydrated` flips in the same render
 * that attaches the listener, so an auto-retrying assertion can wait for the
 * fact instead of for a proxy of it. It costs no layout: the wrapper is
 * `display: contents`.
 */
const subscribeNever = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

export function ConversionTracker({
  goalId,
  stage,
  attributes,
  children,
}: ConversionTrackerProps) {
  const hydrated = useSyncExternalStore(subscribeNever, hydratedSnapshot, serverSnapshot);

  return (
    <span
      data-conversion-tracker={goalId}
      data-hydrated={hydrated ? "true" : "false"}
      onClick={() => getAnalyticsTracker().trackConversion(goalId, stage, attributes)}
      style={{ display: "contents" }}
    >
      {children}
    </span>
  );
}

/**
 * The completed steps this document has already reported. Module scope, so
 * a Back/Forward pair through the same step finds its own key already set.
 */
const firedKeys = new Set<string>();

/** Exposed for tests: a fresh document starts with nothing reported. */
export function resetFiredConversions(): void {
  firedKeys.clear();
}

export interface FireConversionOnMountProps extends Omit<ConversionTrackerProps, "children"> {
  /**
   * What "once" counts — the completed step, not the mount. Two different
   * orders reaching step 4 in one document are two completions; the same
   * order revisited by Back and Forward is one (TS-012-A5, TS-016-A12).
   * Defaults to the goal and stage alone.
   */
  readonly dedupeKey?: string;
}

export function FireConversionOnMount({
  goalId,
  stage,
  attributes,
  dedupeKey,
}: FireConversionOnMountProps) {
  const key = `${goalId}:${stage}:${dedupeKey ?? ""}`;
  const fired = useRef(false);

  useEffect(() => {
    // Two guards, two different repeats: the ref covers React invoking the
    // same mount twice (Strict Mode in development), the key covers the same
    // completed step being mounted again after a soft navigation.
    if (fired.current || firedKeys.has(key)) return;
    fired.current = true;
    firedKeys.add(key);
    getAnalyticsTracker().trackConversion(goalId, stage, attributes);
    // `attributes` is intentionally not a dependency: the guards above
    // already limit this to one call per completed step, and a new object
    // identity on every render must not re-arm it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId, stage, key]);

  return null;
}

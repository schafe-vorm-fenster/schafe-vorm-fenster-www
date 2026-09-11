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
 * on reaching step 4, not on submitting step 3"). The `useRef` guard is only
 * about React re-rendering the same mount (e.g. Strict Mode's double
 * invocation in development); a fresh navigation to the same URL still fires
 * again, which is what "no session, no store" (DEC-009) already implies.
 */

import { useEffect, useRef } from "react";

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

export function ConversionTracker({
  goalId,
  stage,
  attributes,
  children,
}: ConversionTrackerProps) {
  return (
    <span
      onClick={() => getAnalyticsTracker().trackConversion(goalId, stage, attributes)}
      style={{ display: "contents" }}
    >
      {children}
    </span>
  );
}

export function FireConversionOnMount({
  goalId,
  stage,
  attributes,
}: Omit<ConversionTrackerProps, "children">) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    getAnalyticsTracker().trackConversion(goalId, stage, attributes);
    // `attributes` is intentionally not a dependency: the `fired` guard
    // already limits this to one call per mount, and a new object identity
    // on every render must not re-arm it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId, stage]);

  return null;
}

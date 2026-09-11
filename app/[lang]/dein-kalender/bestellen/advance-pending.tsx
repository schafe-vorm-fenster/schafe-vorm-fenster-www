"use client";

/**
 * The pending state of the step's advance control — F-2-67.
 *
 * A hasty reload issued during the client-side transition from step 3 to
 * step 4 landed back on step 3 with zero conversion events logged: the
 * in-flight history push was discarded before the URL updated, and nothing on
 * the screen said the click had not counted.
 *
 * `useLinkStatus` (Next 16) reports the pending state of the enclosing
 * `<Link>`, so the control the visitor actually pressed is what changes. No
 * store, no dedupe key, no session — TS-025 D8 keeps the whole flow state in
 * the URL and stores nothing between page views, and this adds nothing to it.
 */

import { useLinkStatus } from "next/link";

export function AdvancePending({ label }: { readonly label: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <span role="status"> · {label}</span>;
}

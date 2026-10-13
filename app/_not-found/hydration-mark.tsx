"use client";

import { useSyncExternalStore } from "react";

import type { ReactNode } from "react";

/**
 * The 404's hydration signal (TS-WEB-0014-A14, DEC-0164).
 *
 * Every routed page carries one in its site header (`header-shell.tsx`); the
 * 404 has no header by design, so this wrapper is its only island that says
 * React has hydrated. `data-hydrated` flips in the first client render — the
 * same `useSyncExternalStore` pattern `ConversionTracker` uses — and costs no
 * layout (`display: contents`). A refused inline script leaves it `"false"`,
 * which is what `e2e/csp-hydration.spec.ts` waits on.
 */
const subscribeNever = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

export function HydrationMark({ children }: { readonly children: ReactNode }): ReactNode {
  const hydrated = useSyncExternalStore(subscribeNever, hydratedSnapshot, serverSnapshot);
  return (
    <div data-hydrated={hydrated ? "true" : "false"} data-not-found-root style={{ display: "contents" }}>
      {children}
    </div>
  );
}

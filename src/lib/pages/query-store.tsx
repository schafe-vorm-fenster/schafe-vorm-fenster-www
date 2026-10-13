"use client";

/**
 * The page's query string, read in the browser — DEC-0163.
 *
 * Every page is prerendered once, so a request value (`?ort=`, a flow's
 * `schritt=`) cannot shape the HTML any more: the document is the
 * parameter-free one, and the parts that depend on the query render in the
 * browser after hydration.
 *
 * Why a store and not `useSearchParams()` in every island: in a prerendered
 * route `useSearchParams()` turns everything up to its `<Suspense>` boundary
 * into a client-only render, so the boundary's fallback is what the HTML
 * carries and React *replaces* that DOM on hydration — the swap that once
 * took a typed postcode out of the hero search (DEC-0078, row 213). Here one
 * tiny `<QuerySync />` (in the root layout, fallback `null`) is the only
 * component that bails out; it renders nothing and copies the value into this
 * store, and the islands read the store through `useSyncExternalStore`, whose
 * server snapshot is `null`. Their prerendered DOM hydrates as it is and
 * re-renders in place once the query is known — and again on every client
 * navigation that changes it, because `useSearchParams()` follows the router.
 */

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useSyncExternalStore } from "react";

let current: string | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function publish(search: string): void {
  if (current === search) return;
  current = search;
  for (const listener of listeners) listener();
}

/** Test seam. */
export function resetQueryStore(search: string | null = null): void {
  current = search;
  for (const listener of listeners) listener();
}

/**
 * The current query, or `null` while it is not known yet — on the server,
 * during hydration, and in the moment before `<QuerySync />` has run. A
 * caller renders its parameter-free state for `null`, which is exactly what
 * the prerendered HTML holds, so nothing moves until there is a value.
 */
export function useQuery(): URLSearchParams | null {
  const search = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  return useMemo(() => (search === null ? null : new URLSearchParams(search)), [search]);
}

function Sync() {
  const params = useSearchParams();
  const search = params.toString();
  useEffect(() => publish(search), [search]);
  return null;
}

/** Mounted once, in the root layout. Renders nothing, in the HTML or after. */
export function QuerySync() {
  return (
    <Suspense fallback={null}>
      <Sync />
    </Suspense>
  );
}

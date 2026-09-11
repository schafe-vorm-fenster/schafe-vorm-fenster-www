/**
 * The indexability predicate — TS-015 D3, layer 2.
 *
 *   indexable = VERCEL_ENV === "production"
 *               && requestHost ∈ canonicalPublicHosts   (TS-001 D1 domain set)
 *
 * Layer 2 is deliberately independent of layer 1 (Vercel Deployment
 * Protection): protection can be lifted for a demo, and the indexing rule has
 * to survive that. The host test is part of the predicate on purpose — a
 * production-target deployment reachable under a non-canonical hostname is
 * still not indexable.
 */

import type { Environment } from "@/src/lib/security/csp";

/** TS-001 D1 — the canonical public hosts. `www.` is canonical everywhere. */
export const CANONICAL_PUBLIC_HOSTS: readonly string[] = [
  "www.schafe-vorm-fenster.de",
  "www.owcezaoknem.pl",
  "www.schafvormfenster.at",
  "www.sheepoutside.com",
];

/** Maps `VERCEL_ENV` (absent locally) onto the three environments of TS-014 D5. */
export function environmentFrom(
  vercelEnv: string | undefined,
): Environment {
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "preview";
  return "development";
}

/** Strips the port, lowercases — `Host` headers carry both. */
export function normaliseHost(host: string | null | undefined): string {
  return (host ?? "").toLowerCase().split(":")[0] ?? "";
}

export function isIndexable(
  vercelEnv: string | undefined,
  host: string | null | undefined,
): boolean {
  return (
    vercelEnv === "production" &&
    CANONICAL_PUBLIC_HOSTS.includes(normaliseHost(host))
  );
}

/** The one non-production robots directive, used by all three surfaces. */
export const NOINDEX = "noindex, nofollow";

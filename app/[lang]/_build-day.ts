/**
 * The day this deployment was built, as an ISO date at midnight UTC — the
 * reference a sample row is dated from in the prerendered HTML (DEC-0163).
 *
 * A `use cache` function under the `max` profile, which `next.config.ts`
 * redefines to never revalidate: the value is fixed for the life of the
 * build, so the page that carries it stays byte-identical and its CSP hashes
 * stay valid. The browser re-dates the rows from its own today after
 * hydration (`mitmachen/stage-islands.tsx`).
 */

import { cacheLife } from "next/cache";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function buildDay(): Promise<string> {
  "use cache";
  cacheLife("max");
  return new Date(Math.floor(Date.now() / DAY_MS) * DAY_MS).toISOString();
}

/**
 * Query-parameter canonicalisation — TS-011 D9, refining TS-001 D6's
 * "self, exactly as served".
 *
 * "A query parameter changes what a page *shows*, never which page it
 * *is*." So the canonical of any URL — `/dein-ort?ort=…`, a URL carrying
 * `etcc_*`, or any other query string — is the same URL with every
 * parameter stripped. This is deliberately not limited to the analytics
 * `etcc_*` set (`src/lib/analytics/attribution.ts`): D9 applies the same
 * rule to `?ort=…`, which carries no campaign meaning at all.
 */

/** Strips every query parameter and the fragment; keeps the path. */
export function canonicalPath(pathWithQuery: string): string {
  const [path] = pathWithQuery.split("?");
  return (path ?? pathWithQuery).split("#")[0] ?? pathWithQuery;
}

/** Strips every query parameter and the fragment from an absolute URL. */
export function canonicalAbsoluteUrl(url: string): string {
  const parsed = new URL(url);
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

/**
 * TS-025 D2/D3/D3a/D4 — the order flow's step and scope model.
 *
 * Everything lives in the URL (D8): `orte` (comma-separated resolved
 * community slugs), `kreis` (one fixed demo county id, DEC-034 — a county is
 * one chip, never expanded into places), and `schritt` (1..4). Steps 1 and 2
 * share one screen (D2); this module still resolves a `schritt` value so the
 * step indicator and back/forward navigation have one number to show.
 */

export type OrderStep = 1 | 2 | 3 | 4;

export function parseOrte(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function serializeOrte(slugs: readonly string[]): string {
  return [...new Set(slugs)].join(",");
}

export function addPlace(raw: string | undefined, slug: string): string {
  return serializeOrte([...parseOrte(raw), slug]);
}

export function removePlace(raw: string | undefined, slug: string): string {
  return serializeOrte(parseOrte(raw).filter((candidate) => candidate !== slug));
}

/**
 * The step actually shown. `schritt` 3 or 4 without a scope is refused (A4:
 * "neither by the CTA nor by editing schritt=3 into the URL") and falls back
 * to the scope screen; an invalid or missing value defaults to step 2 once
 * something is selected, step 1 while empty — D2's "tick → the chosen scope
 * beside it" needs no separate navigation to move from 1 to 2.
 */
export function resolveOrderStep(hasScope: boolean, schrittParam: string | undefined): OrderStep {
  const requested = Number(schrittParam);
  const valid = Number.isInteger(requested) && requested >= 1 && requested <= 4;

  if (!valid) return hasScope ? 2 : 1;
  if (requested >= 3 && !hasScope) return 1;
  return requested as OrderStep;
}

/**
 * Time and editorial weight — TS-005 D4.
 *
 * Recency is one weight among four, never a verdict. The floor is
 * deliberately high (0.35, not 0.2): an old element with strong context
 * proximity should still be able to win.
 *
 * The concept's scoring block notes "testimonials do not age". D4 realises
 * that through the per-element **editorial weight** rather than through a
 * type exception, so an evergreen piece is marked as such in the content and
 * the algorithm stays one table. See `README.md` — the evidence packages do
 * not carry the field yet.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** The D4 steps, coarsest last. */
const FRESHNESS_STEPS: readonly (readonly [maxDays: number, weight: number])[] = [
  [90, 1.0],
  [365, 0.8],
  [3 * 365, 0.6],
  [5 * 365, 0.45],
];

/** What an undated, unparsable or older-than-five-years element scores. */
export const FRESHNESS_FLOOR = 0.35;

/** The default of D4 — an element that was never marked evergreen. */
export const DEFAULT_EDITORIAL_WEIGHT = 1.0;

/**
 * Age in days of a `YYYY`, `YYYY-MM` or `YYYY-MM-DD` date. `null` for an
 * undated or unparsable value — the caller decides what that means.
 *
 * A future date has age 0 rather than a negative one: an announced element is
 * fresh, never fresher than fresh.
 */
export function ageInDays(date: string | null, now: Date): number | null {
  if (date === null) return null;
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(date.trim());
  if (match === null) return null;

  const parsed = Date.UTC(
    Number(match[1]),
    match[2] === undefined ? 0 : Number(match[2]) - 1,
    match[3] === undefined ? 1 : Number(match[3]),
  );
  if (Number.isNaN(parsed)) return null;

  return Math.max(0, (now.getTime() - parsed) / DAY_MS);
}

/** `freshness(e)` — 1.0 ≤ 90 days … 0.35 older, undated or unparsable. */
export function freshness(date: string | null, now: Date): number {
  const age = ageInDays(date, now);
  if (age === null) return FRESHNESS_FLOOR;
  for (const [maxDays, weight] of FRESHNESS_STEPS) {
    if (age <= maxDays) return weight;
  }
  return FRESHNESS_FLOOR;
}

/**
 * `freshness(e) · editorial_weight(e)` — the time term of D5. The product is
 * deliberately **not** clamped to 1.0: a weight above 1.0 is how an evergreen
 * element outranks a fresh one (TS-005-A6).
 */
export function timeScore(
  item: { readonly date: string | null; readonly editorialWeight?: number },
  now: Date,
): number {
  return freshness(item.date, now) * (item.editorialWeight ?? DEFAULT_EDITORIAL_WEIGHT);
}

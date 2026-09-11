/**
 * Determinism and rotation — TS-005 D7.
 *
 * Same trait, same place, same result — always. No `Math.random()`, no
 * request-time entropy, no LLM. Variety comes from **one** deterministic
 * rotation seed, the ISO week, and it shifts selection only among candidates
 * whose scores are equal. Ranking never changes because of it.
 *
 * The seed is an **explicit input**: this module can compute it from a date,
 * but the engine never calls a clock itself — so tests pin the seed and a
 * cached segment carries it (`cacheTag`, TS-005 D8).
 */

/** `ISO-year + ISO-week`, e.g. `2026-W37`. */
export type RotationSeed = string;

/** The ISO-8601 week seed of a date, in UTC. */
export function isoWeekSeed(date: Date): RotationSeed {
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // ISO weekday: Monday 1 … Sunday 7. Move to the Thursday of this week — the
  // day that decides which ISO year the week belongs to.
  const isoWeekday = day.getUTCDay() === 0 ? 7 : day.getUTCDay();
  day.setUTCDate(day.getUTCDate() + 4 - isoWeekday);

  const isoYear = day.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstIsoWeekday = firstThursday.getUTCDay() === 0 ? 7 : firstThursday.getUTCDay();
  firstThursday.setUTCDate(firstThursday.getUTCDate() + 4 - firstIsoWeekday);

  const week = 1 + Math.round((day.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

/** FNV-1a — small, stable, and dependency-free. Any stable hash would do. */
function hash(seed: string): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return value;
}

/**
 * Sort by score descending, then rotate each equal-score group by the seed.
 *
 * Within a group the order is by `id` ascending (the D6 tie-break) and the
 * seed rotates that order. A returning visitor therefore sees the same
 * ranking with a different face on it each Monday, and never a reshuffled
 * ranking.
 */
export function rotateTies<T extends { readonly id: string; readonly score: number }>(
  items: readonly T[],
  seed: RotationSeed,
): readonly T[] {
  const byScore = [...items].toSorted((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1));
  const offsetBase = hash(seed);
  const result: T[] = [];

  for (let start = 0; start < byScore.length; ) {
    let end = start + 1;
    while (end < byScore.length && byScore[end].score === byScore[start].score) end += 1;

    const group = byScore.slice(start, end);
    const offset = group.length > 1 ? offsetBase % group.length : 0;
    for (let i = 0; i < group.length; i += 1) result.push(group[(i + offset) % group.length]);

    start = end;
  }

  return result;
}

/**
 * The sequence rule — *near · near · far · near · very far · middle · far*.
 *
 * The **concept** (`website-relevance-model.concept.md`, "Sequence Rule" and
 * the spread rule) is the law here, and where TS-005 D6 simplifies it this
 * module follows the concept (repo rule: the concept wins over a spec):
 *
 *  1. Sort by score, descending. Ties break by `id`, ascending — the rotation
 *     seed (D7) may reorder an equal-score group before this, and nothing else.
 *  2. Positions 1 and 2 are the two highest scorers. Two opening elements give
 *     recognition its momentum; one local item on its own reads as coincidence.
 *  3. From position 3 the positions alternate **far · near**:
 *     - *far* takes the element **furthest from the current centre of
 *       gravity** on the geo axis — the concept's spread rule, not merely the
 *       next-most-distant one — **provided it still scores at least 50 % of
 *       the top remaining candidate**. Below that floor the top candidate
 *       stands: spreading may cost relevance, but not the argument.
 *     - *near* takes the highest scorer at or below the centre of gravity, so
 *       the visitor's own region stays present throughout the stream.
 *  4. If the wanted side has no candidate, the top remaining candidate is
 *     taken. Alternation is a preference, never a deadlock (A7).
 *
 * Ordering reads `score` and `tier` only. It never sees a date — which is why
 * the result cannot degenerate into a chronological list (A12/A13).
 */

/** Everything the rule needs from a scored element. */
export interface Orderable {
  readonly id: string;
  readonly score: number;
  readonly tier: number;
}

/** The concept's spread rule: a widening element may cost at most half the score. */
export const SPREAD_SCORE_FLOOR = 0.5;

function centreOfGravity(placed: readonly Orderable[]): number {
  if (placed.length === 0) return 0;
  return placed.reduce((total, item) => total + item.tier, 0) / placed.length;
}

export function orderBySequenceRule<T extends Orderable>(candidates: readonly T[]): readonly T[] {
  const pool = [...candidates].toSorted((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1));
  if (pool.length <= 2) return pool;

  const placed: T[] = [pool.shift() as T, pool.shift() as T];
  let wantFar = true;

  while (pool.length > 0) {
    const centre = centreOfGravity(placed);
    const topIndex = 0; // the pool stays sorted, so the top candidate is the head
    let pick = topIndex;

    if (wantFar) {
      // The element furthest away from the centre of gravity, preferring the
      // more distant side; ties go to the better score (the pool is sorted).
      let bestDistance = -1;
      for (let i = 0; i < pool.length; i += 1) {
        const distance = pool[i].tier - centre;
        if (distance > 0 && distance > bestDistance) {
          bestDistance = distance;
          pick = i;
        }
      }
      if (bestDistance < 0) pick = topIndex;
      else if (pool[pick].score < pool[topIndex].score * SPREAD_SCORE_FLOOR) pick = topIndex;
    } else {
      const nearest = pool.findIndex((item) => item.tier <= centre);
      pick = nearest === -1 ? topIndex : nearest;
    }

    placed.push(pool.splice(pick, 1)[0]);
    wantFar = !wantFar;
  }

  return placed;
}

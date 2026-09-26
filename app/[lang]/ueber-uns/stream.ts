import type { ProofEntry } from "../_proof";

/**
 * TS-WEB-0027 D5 — **at most one empty slot is ever visible**, and "further gaps
 * shorten the stream below seven instead of adding a second empty slot".
 *
 * The relevance engine pads a surface to its DEC-0048 count with `empty`
 * entries, one per unfilled position, because that is the right behaviour for
 * every other surface: a position is a position. On this page the count is 7
 * and the artifact names five cleared elements — the sixth ("Der Dorfkalender
 * ist seit 2018 in Betrieb") left the pool because TS-WEB-0027 D4 forbids a
 * "seit …" claim anywhere here — so the engine hands back five items and two
 * gaps. Rendering both gaps would put a second empty slot on the page and
 * break A6.
 *
 * So the page keeps the first gap, in the reading order the engine gave it, and
 * drops the rest. The stream is then 5 + 1 rather than 5 + 2, which is exactly
 * what D5's "Count" row says. Nothing is backfilled: a dropped gap is not
 * handed to another type.
 */
export function oneEmptySlot(entries: readonly ProofEntry[]): readonly ProofEntry[] {
  let seenEmpty = false;
  const kept: ProofEntry[] = [];
  for (const entry of entries) {
    if (entry.kind === "empty") {
      if (seenEmpty) continue;
      seenEmpty = true;
    }
    kept.push(entry);
  }
  return kept;
}

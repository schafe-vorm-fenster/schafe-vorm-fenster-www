import type { ProofEntry } from "../_proof";

/**
 * TS-WEB-0027 D5 as amended by DEC-0175 §3 — **a missing proof renders
 * nothing.**
 *
 * The relevance engine pads a surface to its DEC-0048 count with `empty`
 * entries, one per unfilled position, so the gap stays countable in the
 * selection (`RelevanceSelection.filled`). On the page a gap is not a place:
 * until 2026-10-27 this page kept one of them as a hatched "Beleg fehlt" card,
 * and the owner's review of that day ruled that such a placeholder never
 * reaches the website (issue 105). The stream is therefore the filled entries only,
 * in the engine's order. Nothing is backfilled: a dropped gap is not handed to
 * another type, it shortens the stream.
 */
export function filledOnly(entries: readonly ProofEntry[]): readonly Extract<ProofEntry, { kind: "item" }>[] {
  return entries.filter((entry): entry is Extract<ProofEntry, { kind: "item" }> => entry.kind === "item");
}

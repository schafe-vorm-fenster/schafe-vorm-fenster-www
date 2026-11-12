/**
 * Where a proof teaser leads — issue #36 (owner review 2026-10-12, home, para 17).
 *
 * Every teaser in the shared proof section carries one core statement and a
 * deeplink to its evidence entry, so the teaser never has to spell the proof
 * out. The anchors are the hub's stable ids: the `media-echo` entries stand in
 * `/ueber-uns/archiv` as rows whose element id is the entry's own file stem
 * (TS-WEB-0028 D3, `ArchiveRow.id`), and the proof records name those entries
 * in their `media_echo` frontmatter.
 *
 * Keyed by the hub **proof** id a candidate is derived from
 * (`derived_from: ["@schafe-vorm-fenster/proof@…#<id>"]` on the slot), valued
 * with the route and the anchor of the entry that carries the evidence.
 */

import type { RouteId } from "@/src/lib/routes/routes";

export interface ProofDeeplink {
  readonly to: RouteId;
  /** The target element's id, without `#` — a hub media-echo id. */
  readonly hash: string;
}

export const PROOF_DEEPLINKS: Readonly<Record<string, ProofDeeplink>> = {
  // `lehre-lelender.proof.md` → `media_echo: [2026-08-abend-der-engagierten-lehre]`
  "lehre-lelender": { to: "archive", hash: "2026-08-abend-der-engagierten-lehre" },
  // `noerd-award-2026-smart-community.proof.md` → `media_echo: [2026-05-noerd-2026-rostock, …]`
  "noerd-award-2026-smart-community": { to: "archive", hash: "2026-05-noerd-2026-rostock" },
  // `volkshochschule-uecker-randow.proof.md` → `media_echo: [2024-09-kulturlandbuero-volkshochschule]`
  "volkshochschule-uecker-randow": {
    to: "archive",
    hash: "2024-09-kulturlandbuero-volkshochschule",
  },
  // `kulturlandbuero-broellin.proof.md` has `media_echo: []`; its Usage section
  // names "media-echo 2024-09" (the Kulturlandbüro, also the cooperation partner).
  "kulturlandbuero-broellin": {
    to: "archive",
    hash: "2024-09-kulturlandbuero-volkshochschule",
  },
};

const PROOF_REF = /^@schafe-vorm-fenster\/proof@[^#]+#(.+)$/;

/** The hub proof ids a slot's `derived_from` names, in order (package-wide refs skipped). */
export function hubProofIds(derivedFrom: readonly string[]): string[] {
  return derivedFrom.flatMap((ref) => {
    const match = PROOF_REF.exec(ref);
    return match === null ? [] : [match[1]];
  });
}

/** The deeplink of the `index`-th candidate of a slot, or `undefined` where none is mapped. */
export function proofDeeplink(
  derivedFrom: readonly string[],
  index: number,
): ProofDeeplink | undefined {
  const id = hubProofIds(derivedFrom)[index];
  return id === undefined ? undefined : PROOF_DEEPLINKS[id];
}

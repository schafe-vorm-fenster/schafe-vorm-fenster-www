/**
 * The proof selection every page shares — TS-005, run for real.
 *
 * Until now each page mapped its own list of demo proof lines straight onto
 * `proof-card`s: the order was file order, the count was whatever the artifact
 * happened to carry, and the relevance engine (`src/lib/relevance/`) — gate,
 * score, rotate, order, count — ran nowhere outside its unit tests
 * (TS-005-A8/A9/A13 were all "🔜 page work packages").
 *
 * This module is that seam, and it is deliberately **thin**: a page keeps its
 * own card rendering (context line, geo badge, image slot — they differ per
 * page and per spec), and hands the engine only what the engine scores. What
 * comes back is the selection: exactly as many positions as DEC-048 gives the
 * surface, each either an element or an honest gap.
 *
 * Three properties it enforces rather than documents:
 *
 *  - **the focus job is an input**, taken from the page's own `page.meta.ts`,
 *    so no trait can change what the page is for (DEC-059);
 *  - **`now` and the seed are arguments** to the engine, never read inside it
 *    (TS-005 D7) — this module reads the clock, the engine does not;
 *  - **an unfilled position is a position**, not a shorter list (SRC-001 §4).
 *
 * It is a `use cache` function: the selection is a pure function of the
 * candidates, the viewer segment and the ISO week, which is exactly the cache
 * key TS-005 D8 / TS-009 D3 describe. `?ort=` reaches it as a **slug prop**,
 * resolved by the page outside the cache boundary.
 */

import { cacheLife, cacheTag } from "next/cache";

import { resolveAnchorPlace } from "@/src/lib/pages/live-anchor";
import { composeViewerContext } from "@/src/lib/personalization/viewer-context";
import { isoWeekSeed } from "@/src/lib/relevance/rotation";
import { selectRelevant, type Surface } from "@/src/lib/relevance/select";
import { geo } from "@/src/lib/relevance/types";

import type { GeoBadgeFragment } from "@/src/components/content-fragments";
import type { DataState } from "@/src/components/data-state";
import type { Locale } from "@/src/lib/i18n/locales";
import type { FocusJob, ItemType, RelevanceItem } from "@/src/lib/relevance/types";
import type { RouteId } from "@/src/lib/routes/routes";

/**
 * One candidate, as a page already has it: the three texts a `proof-card`
 * renders, its geo badge, and the facets the engine scores.
 *
 * The facets are separate from the badge on purpose. The badge is what the
 * card *says* ("Beispiel", "Beispielregion"); `geoCommunity`/`geoCounty` are
 * what the element *covers*, which is what TS-005 D1 scores — "the coverage
 * level, not the venue".
 */
export interface ProofCandidate {
  readonly id: string;
  readonly contextLine: string;
  readonly claim: string;
  readonly attribution: string;
  readonly geo: GeoBadgeFragment;
  /** Labelled dummy content — passes the clearance gate carrying its flag. */
  readonly demo: boolean;
  readonly type?: ItemType;
  /** `YYYY`, `YYYY-MM` or `YYYY-MM-DD`; `null` for an undated element. */
  readonly date?: string | null;
  /** The community the element covers, where it names one. */
  readonly geoCommunity?: string | null;
  readonly geoCounty?: string | null;
  /** TS-005 D4 — multiplies freshness, never replaces it. */
  readonly editorialWeight?: number;
}

/** A selected position: a card to render, or the gap that weakens the claim. */
export type ProofEntry =
  | { readonly kind: "item"; readonly candidate: ProofCandidate; readonly state: DataState }
  | { readonly kind: "empty" };

export interface ProofSelection {
  readonly entries: readonly ProofEntry[];
  /** TS-010's stage label — observability only; nothing branches on it. */
  readonly stage: 0 | 1 | 2 | 3;
  readonly seed: string;
  /** How many of the surface's positions carry an element. */
  readonly filled: number;
}

export interface ProofRequest {
  readonly routeId: RouteId;
  readonly locale: Locale;
  /** The page's declared focus job — `page.meta.ts`, never a trait. */
  readonly focusJob: FocusJob;
  /** DEC-048: `inline` 3 · `home` 5 · `stream` 7. */
  readonly surface: Surface;
  readonly candidates: readonly ProofCandidate[];
  /** `?ort=`, already validated by `place-parameter.ts`. Stage 3 when it resolves. */
  readonly placeSlug?: string;
}

export async function selectProof({
  routeId,
  locale,
  focusJob,
  surface,
  candidates,
  placeSlug,
}: ProofRequest): Promise<ProofSelection> {
  "use cache";
  // The proof pool changes when the content artifacts change and the ranking
  // rotates on the ISO week; neither is a per-minute event.
  cacheLife("hours");

  const now = new Date();
  const seed = isoWeekSeed(now);
  // TS-005 D7: "Include the seed in the `cacheTag` so a week boundary
  // invalidates cleanly."
  cacheTag(`proof:${seed}`, `proof:${routeId}:${locale}`);

  const stated = placeSlug === undefined ? undefined : await resolveAnchorPlace(placeSlug);

  const { viewer } = await composeViewerContext({
    focusJob,
    locale,
    routeId,
    now,
    // The proxy does not hand the `Referer` down yet, so stage 2 never fires
    // in the running app (`src/lib/personalization/README.md`, row 1).
    referrer: null,
    statedPlace:
      stated === undefined
        ? null
        : { community: stated.name, county: stated.county?.name ?? null, country: "de" },
  });

  const items: RelevanceItem<ProofCandidate>[] = candidates.map((candidate) => ({
    id: candidate.id,
    type: candidate.type ?? "testimonial",
    geo: geo({
      country: "de",
      county: candidate.geoCounty ?? null,
      community: candidate.geoCommunity ?? null,
    }),
    // The artifacts carry no `job_relation` facet yet (TS-007 D12 row 4), so a
    // page's own proof is `neutral` for its own job — the honest default the
    // engine treats as "assessed, no claim either way".
    jobRelation: { [focusJob]: "neutral" },
    date: candidate.date ?? null,
    ...(candidate.editorialWeight === undefined
      ? {}
      : { editorialWeight: candidate.editorialWeight }),
    // The mock rule's exception (TS-005 gate): a `demo` element passes the
    // clearance gate carrying its flag, and comes back as the `mocked` state
    // so the card badges itself.
    clearance: candidate.demo ? "unverified" : "cleared",
    demo: candidate.demo,
    payload: candidate,
  }));

  const selection = selectRelevant<ProofCandidate>({
    items,
    viewer,
    surface,
    now,
    seed,
  });

  return {
    entries: selection.entries.map((entry) =>
      entry.kind === "item"
        ? { kind: "item" as const, candidate: entry.item.payload as ProofCandidate, state: entry.state }
        : { kind: "empty" as const },
    ),
    stage: selection.stage,
    seed,
    filled: selection.filled,
  };
}

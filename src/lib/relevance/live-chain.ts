/**
 * Live content widens the same way proof does — the concept's "Live Content"
 * table, TS-005 D1/D8 and A16.
 *
 *   1 "Today in <place>"        place
 *   2 "This week nearby"        surroundings (~15 km)
 *   3 "Active places in <county>"  county
 *   4 live counters             all regions
 *
 * Each step names **the id list of its level**, so the caller queries
 * events-api with ids rather than with a free-text place. No step is skipped
 * when the previous one returns results: the chain is a widening, not a
 * fallback (that is DEC-019 / TS-003 D5, a different mechanism).
 *
 * Two documented shifts:
 *
 * - **Empty place.** A place with no dates starts the chain at radius 2. The
 *   page's focus-job shift that goes with it (WEB-F-044, "you could be the
 *   first") belongs to **TS-008**; this module only reports `placeIsEmpty`.
 * - **Own calendar.** Where the focus job is `run-our-own-calendar`, module 1
 *   is the **embed demo** — the Portalize calendar filtered to the place just
 *   searched for, so the visitor sees her own product before buying it.
 */

import type { GeoLevel, ViewerContext } from "./types";

export type LiveRadius = "place" | "surroundings" | "county" | "all";

export type LiveModule =
  | "today-in-place"
  | "embed-demo"
  | "this-week-nearby"
  | "active-places"
  | "live-counters";

export interface LiveStep {
  readonly radius: LiveRadius;
  readonly module: LiveModule;
  /** The geo level this step queries; `null` for the nationwide counters. */
  readonly level: GeoLevel | null;
  /** The ids to send. Empty means "no filter" — the counters' case. */
  readonly ids: readonly string[];
}

export interface LiveChainInput {
  readonly viewer: ViewerContext;
  /**
   * The communities around the visitor, as the caller resolved them (geo-api
   * radius search — a demand, mocked today: state/open.md row 5, Q-038).
   * Defaults to the visitor's own community.
   */
  readonly surroundingCommunities?: readonly string[];
  /**
   * Whether the place carries dates. `undefined` means "not asked" and keeps
   * the full chain — the module renders its own empty state then (TS-008 D5).
   */
  readonly placeHasDates?: boolean;
}

export interface LiveChain {
  readonly steps: readonly LiveStep[];
  readonly startsAt: LiveRadius;
  readonly placeIsEmpty: boolean;
}

export function liveModuleChain(input: LiveChainInput): LiveChain {
  const { viewer } = input;
  const community = viewer.geo.community;
  const placeIsEmpty = community !== null && input.placeHasDates === false;

  const steps: LiveStep[] = [];

  if (community !== null && !placeIsEmpty) {
    steps.push({
      radius: "place",
      module: viewer.job === "run-our-own-calendar" ? "embed-demo" : "today-in-place",
      level: "community",
      ids: [community],
    });
  }

  if (community !== null) {
    steps.push({
      radius: "surroundings",
      module: "this-week-nearby",
      level: "community",
      ids: input.surroundingCommunities ?? [community],
    });
  }

  if (viewer.geo.county !== null) {
    steps.push({
      radius: "county",
      module: "active-places",
      level: "county",
      ids: [viewer.geo.county],
    });
  }

  steps.push({ radius: "all", module: "live-counters", level: null, ids: [] });

  return { steps, startsAt: steps[0].radius, placeIsEmpty };
}

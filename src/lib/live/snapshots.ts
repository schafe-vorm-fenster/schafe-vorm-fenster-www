/**
 * Tier 3 — the build-time snapshot artefacts of TS-009 D8.
 *
 * They are committed on purpose (D8's own "why"): the "keep the previous file
 * when the build fetch fails" rule only works if a previous file exists in
 * the source tree. They are imported statically so a serverless function
 * carries them in its bundle rather than reading the filesystem at request
 * time.
 *
 * Two rules the payloads obey:
 *
 *  - **No counters snapshot exists, and none may.** TS-009 D6 removes the
 *    counter band rather than letting it show an old figure, so the tier-3
 *    path must not be reachable by accident — there is no file and no branch.
 *  - **Never place-specific.** Tier 3 has no segment, so the snapshot is the
 *    widest scope it can be and is always labelled ("Beispiel", TS-009 D5).
 *
 * The snapshots shipped today were produced from the mock backend, so they
 * are demo data and say so. The build step that regenerates them from the
 * real upstreams (TS-009-A12) is not built — `state/open.md` carries it.
 */

import nearbySnapshot from "@/src/generated/snapshots/nearby.json";
import placeEventsSnapshot from "@/src/generated/snapshots/place-events.json";
import regionExamplesSnapshot from "@/src/generated/snapshots/region-examples.json";

import type { LiveEvent, NearbyEvents, PlaceEvents, Place, RegionExamples } from "./types";

/** The snapshot list, re-anchored on the place actually asked for. */
export function placeEventsFallback(place: Place): PlaceEvents {
  const events = (placeEventsSnapshot.events as LiveEvent[]).map((event) => ({
    ...event,
    placeName: place.name,
  }));
  return { place, events, publishInvitation: false };
}

export function nearbyFallback(radiusKm: number): NearbyEvents {
  return { events: nearbySnapshot.events as LiveEvent[], radiusKm, truncated: false };
}

export function regionExamplesFallback(county: string): RegionExamples {
  return { county, examples: regionExamplesSnapshot.examples };
}

/** TS-009 D6 / TS-009-A12: the counters have no snapshot, and must not get one. */
export const COUNTERS_HAVE_NO_SNAPSHOT = true;

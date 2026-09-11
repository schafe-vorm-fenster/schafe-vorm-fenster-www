import { describe, expect, it } from "vitest";

import {
  chainStart,
  EVENT_WINDOWS,
  haversineKm,
  NEARBY_RADIUS_KM,
  planChain,
  selectNearby,
  type ChainAnchor,
} from "./widening";

import type { Place } from "./types";

const place = (name: string, lat: number, lng: number): Place => ({
  communityId: `geoname.${name}`,
  name,
  slug: name,
  lat,
  lng,
});

const anchorPlace = place("anker", 54.0, 13.4);
const communityAnchor: ChainAnchor = { kind: "community", place: anchorPlace };
const countyAnchor: ChainAnchor = { kind: "county", countyId: "geoname.900001" };
const noAnchor: ChainAnchor = { kind: "none" };

describe("TS-008-A2: the widening chain resolves per anchor precision", () => {
  it("stops at step 1 for a place with dates", () => {
    const plan = planChain(communityAnchor, { placeEvents: 3, nearbyEvents: 5, countyExamples: 4 });
    expect(chainStart(communityAnchor)).toBe(1);
    expect(plan.position1).toBe("dates");
    expect(plan.publishInvitation).toBe(false);
  });

  it("starts at step 2 for a place without dates, and never leaves position 1 blank", () => {
    const plan = planChain(communityAnchor, { placeEvents: 0, nearbyEvents: 5, countyExamples: 4 });
    expect(plan.publishInvitation).toBe(true);
    expect(plan.position1).toBe("invitation");
    expect(plan.position2).toBe("dates");
  });

  it("starts at step 3 for a county anchor: no place module, examples only", () => {
    const plan = planChain(countyAnchor, { placeEvents: 0, nearbyEvents: 0, countyExamples: 4 });
    expect(chainStart(countyAnchor)).toBe(3);
    expect(plan.position1).toBe("absent");
    expect(plan.position2).toBe("absent");
    expect(plan.position3).toBe("examples");
  });

  it("renders only search and counters for a stage-0 visitor", () => {
    const plan = planChain(noAnchor, { placeEvents: 0, nearbyEvents: 0, countyExamples: 9 });
    expect(chainStart(noAnchor)).toBe(4);
    expect([plan.position1, plan.position2, plan.position3]).toEqual(["absent", "absent", "absent"]);
    expect(plan.position4).toBe("counters");
  });

  it("keeps position 4 at every stage — counters do not depend on the anchor", () => {
    for (const anchor of [communityAnchor, countyAnchor, noAnchor]) {
      expect(planChain(anchor, { placeEvents: 0, nearbyEvents: 0, countyExamples: 0 }).position4).toBe(
        "counters",
      );
    }
  });
});

describe("TS-008-A3: the step-2 distance filter is ours, and it never claims completeness", () => {
  // Roughly 0 / 4 / 8 / 13 / 22 / 40 km from the anchor.
  const candidates = [
    place("null-km", 54.0, 13.4),
    place("vier-km", 54.03, 13.44),
    place("acht-km", 54.06, 13.47),
    place("dreizehn-km", 54.09, 13.52),
    place("zweiundzwanzig-km", 54.2, 13.7),
    place("vierzig-km", 54.35, 13.95),
  ];

  it("admits only communities within 15 km of the anchor", () => {
    const { places } = selectNearby(anchorPlace, candidates, { radiusKm: NEARBY_RADIUS_KM });
    expect(places.map((entry) => entry.name)).toEqual(["null-km", "vier-km", "acht-km", "dreizehn-km"]);
    for (const entry of places) expect(haversineKm(anchorPlace, entry)).toBeLessThanOrEqual(15);
  });

  it("does not mark a set truncated when the radius, not the cap, ended it", () => {
    const { truncated } = selectNearby(anchorPlace, candidates, { radiusKm: 15, maxResults: 10 });
    expect(truncated).toBe(false);
  });

  it("marks the set truncated when the upstream cap hit before the radius did", () => {
    const capped = candidates.slice(0, 3);
    const { places, truncated } = selectNearby(anchorPlace, capped, { radiusKm: 15, maxResults: 3 });
    expect(places).toHaveLength(3);
    expect(truncated).toBe(true);
  });

  it("filters an empty candidate set to an empty result rather than throwing", () => {
    expect(selectNearby(anchorPlace, [], { maxResults: 10 })).toEqual({ places: [], truncated: false });
  });
});

describe("TS-008 D3: the windows position 1 and position 2 ask for", () => {
  it("asks after=now for the place and a seven-day window for the surroundings", () => {
    expect(EVENT_WINDOWS.upcoming.after).toBe("now");
    expect(EVENT_WINDOWS.week).toEqual({ after: "now", before: "7d" });
    expect(EVENT_WINDOWS.today).toEqual({ after: "now", before: "tomorrow" });
  });
});

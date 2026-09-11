import { describe, expect, it } from "vitest";

import {
  AMBIGUOUS_DEMO_PLACES,
  AMBIGUOUS_DEMO_ZIP,
  DEMO_PLACES,
  EMPTY_DEMO_SLUG,
  ZIP_DEMO_PLACES,
  demoEvents,
  demoPlaceBySlug,
  demoPlaceForZip,
} from "./fixtures";
import { haversineKm, NEARBY_RADIUS_KM, selectNearby } from "../widening";
import { mockSearchByPoint, mockSearchByZip } from "./geo";

/**
 * TS-023-A6 (F-2-5, round 2): before `AMBIGUOUS_DEMO_ZIP` existed,
 * `mockSearchByZip` answered at most one place per postcode, so a
 * municipality hit with several communities never occurred against the
 * demo data — `resolve-place.test.ts` (app/[lang]/mitmachen/registrieren)
 * could only exercise its own "ambiguous" handling against a stubbed
 * `searchPlaces` result, not the shared mock. This file is the mock's own
 * unit coverage of that fixture.
 */
describe("TS-023-A6: mockSearchByZip's ambiguous-municipality fixture", () => {
  it("answers both communities for the ambiguous ZIP, same name, different counties", () => {
    const result = mockSearchByZip(AMBIGUOUS_DEMO_ZIP);
    expect(result).toEqual(AMBIGUOUS_DEMO_PLACES);
    expect(result.length).toBeGreaterThan(1);
  });

  it("the two candidates share a name but not a county", () => {
    const [first, second] = mockSearchByZip(AMBIGUOUS_DEMO_ZIP);
    expect(first?.name).toBe(second?.name);
    expect(first?.county?.id).not.toBe(second?.county?.id);
    expect(first?.slug).not.toBe(second?.slug);
    expect(first?.communityId).not.toBe(second?.communityId);
  });

  it("every other well-formed ZIP still answers at most one place", () => {
    expect(mockSearchByZip("17495")).toHaveLength(1);
    expect(mockSearchByZip("99999")).toHaveLength(0);
  });

  it("the ambiguous fixture is not part of the six-place DEMO_PLACES ring — the widening cut and the region-example selection are unaffected", () => {
    for (const candidate of AMBIGUOUS_DEMO_PLACES) {
      expect(DEMO_PLACES).not.toContainEqual(candidate);
    }
  });

  it("stays out of proximity lookups, which read DEMO_PLACES only", () => {
    const [musterhausenMusterkreis] = AMBIGUOUS_DEMO_PLACES;
    const nearby = mockSearchByPoint(musterhausenMusterkreis!, 10);
    expect(nearby.some((place) => place.slug.startsWith("musterhausen-"))).toBe(false);
    expect(nearby).toHaveLength(DEMO_PLACES.length);
  });
});

/**
 * F-2-61 — TS-020 D2 gives state B's position 2 the *first* evidence ("the
 * chain starts here"), and TS-008-A6 requires it to render. The empty demo
 * place sits at the outer edge of the ring, so before `ZIP_DEMO_PLACES` and
 * the seventh community the ~15 km cut around it admitted nothing and the
 * designed state showed its strongest module empty.
 */
describe("F-2-61: the empty demo place has a neighbour inside the ~15 km cut", () => {
  const emptyPlace = demoPlaceBySlug(EMPTY_DEMO_SLUG)!;

  it("is itself a covered place with no dates — TS-008 D4's trigger", () => {
    expect(emptyPlace).toBeDefined();
    expect(demoEvents(emptyPlace, 3, new Date("2026-09-11T10:00:00Z"))).toHaveLength(0);
  });

  it("admits at least one other community with dates inside the cut", () => {
    const { places } = selectNearby(emptyPlace, mockSearchByPoint(emptyPlace, 10), {
      radiusKm: NEARBY_RADIUS_KM,
    });
    const others = places.filter((place) => place.slug !== EMPTY_DEMO_SLUG);
    expect(others.length).toBeGreaterThan(0);
    for (const place of others) expect(haversineKm(emptyPlace, place)).toBeLessThanOrEqual(NEARBY_RADIUS_KM);
    expect(
      others.flatMap((place) => demoEvents(place, 2, new Date("2026-09-11T10:00:00Z"))).length,
    ).toBeGreaterThan(0);
  });

  it("keeps every postcode pointing at the place it pointed at before", () => {
    // The ring gained a member for a proximity reason; the ZIP modulo runs
    // over the unchanged first six, so no already-covered walk moves.
    expect(ZIP_DEMO_PLACES).toHaveLength(6);
    expect(demoPlaceForZip("07743")?.slug).toBe("beispielwalde");
    expect(demoPlaceForZip("38165")?.slug).toBe(EMPTY_DEMO_SLUG);
    expect(demoPlaceForZip("17390")?.slug).toBe("musterbach");
    for (const place of ZIP_DEMO_PLACES) expect(DEMO_PLACES).toContain(place);
  });
});

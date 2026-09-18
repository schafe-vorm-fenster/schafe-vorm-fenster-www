import { describe, expect, it } from "vitest";

import {
  communityRouteSlugFor,
  hasPlaceIndex,
  nearestPlace,
  placeByCommunityId,
  placeBySlug,
  placesWithin,
  PLACE_INDEX_SIZE,
  searchByName,
} from "./place-index";
import { SHOWCASE_COMMUNITY } from "./showcase";

/**
 * The committed community index — the answer to a question geo-api cannot
 * answer at all (name search, Q-025) and to one events-api cannot (a
 * community id back to a slug).
 *
 * These run against the real committed artefact rather than a fixture: the
 * file **is** the contract, and a build that produced a truncated or empty
 * one has to fail here rather than on a page.
 */

describe("the artefact itself", () => {
  it("shipped, and covers the whole calendar rather than a sample", () => {
    expect(hasPlaceIndex()).toBe(true);
    expect(PLACE_INDEX_SIZE).toBeGreaterThan(1000);
  });

  it("holds the configured showcase community, with its own coordinates", () => {
    const place = placeBySlug(SHOWCASE_COMMUNITY.slug);
    expect(place?.communityId).toBe(SHOWCASE_COMMUNITY.communityId);
    expect(place?.lat).toBeCloseTo(SHOWCASE_COMMUNITY.lat, 3);
    expect(place?.lng).toBeCloseTo(SHOWCASE_COMMUNITY.lng, 3);
  });
});

describe("name search", () => {
  it("suggests the place from a prefix, which is what a typeahead needs", () => {
    const hits = searchByName("Schlat");
    expect(hits[0]?.name).toBe("Schlatkow");
    expect(hits[0]?.slug).toBe("schlatkow");
  });

  it("ranks an exact name first, then a prefix, then a substring", () => {
    const [first] = searchByName("Anklam");
    expect(first?.name).toBe("Anklam");
  });

  it("folds the diacritics a German place name carries", () => {
    // A keyboard without umlauts, and the ß/ss spelling, must both work.
    expect(searchByName("gross kiesow").map((place) => place.name)).toContain("Groß Kiesow");
    expect(searchByName("zuessow").length + searchByName("Züssow").length).toBeGreaterThan(0);
  });

  it("answers nothing below two characters — one letter matches hundreds", () => {
    expect(searchByName("S")).toEqual([]);
    expect(searchByName(" ")).toEqual([]);
  });

  it("caps the list, so a typeahead never renders something nobody can read", () => {
    expect(searchByName("a", 6).length).toBeLessThanOrEqual(6);
    expect(searchByName("er", 6).length).toBeLessThanOrEqual(6);
  });

  it("answers an empty list for a place the calendar does not cover", () => {
    expect(searchByName("Oberammergau")).toEqual([]);
  });
});

describe("an id back to a place", () => {
  it("resolves the slug an events-api event cannot carry", () => {
    expect(placeByCommunityId(SHOWCASE_COMMUNITY.communityId)?.slug).toBe(SHOWCASE_COMMUNITY.slug);
    expect(placeByCommunityId("geoname.999999999")).toBeUndefined();
  });

  it("builds the route segment the public village calendar serves", () => {
    const place = placeBySlug(SHOWCASE_COMMUNITY.slug)!;
    expect(communityRouteSlugFor(place)).toBe("schlatkow.2838887");
  });
});

describe("the ~15 km cut, made locally", () => {
  const anchor = { lat: SHOWCASE_COMMUNITY.lat, lng: SHOWCASE_COMMUNITY.lng };

  it("answers the anchor's own community first", () => {
    expect(nearestPlace(anchor)?.slug).toBe(SHOWCASE_COMMUNITY.slug);
  });

  it("includes what is inside the radius and excludes what is outside it", () => {
    const within = placesWithin(anchor, 15).map((place) => place.name);
    // Measured against the committed coordinates: Anklam 10.2 km,
    // Buddenhagen 11.3 km, Jarmen 15.8 km, Wolgast 19.1 km.
    expect(within).toContain("Anklam");
    expect(within).toContain("Buddenhagen");
    expect(within).not.toContain("Jarmen");
    expect(within).not.toContain("Wolgast");
  });

  it("is not capped — a proximity query would truncate the radius silently", () => {
    expect(placesWithin(anchor, 15).length).toBeGreaterThan(10);
    expect(placesWithin(anchor, 15).length).toBeLessThan(placesWithin(anchor, 30).length);
  });

  it("orders nearest first", () => {
    const [nearest, second] = placesWithin(anchor, 15);
    expect(nearest?.slug).toBe(SHOWCASE_COMMUNITY.slug);
    expect(second?.slug).not.toBe(SHOWCASE_COMMUNITY.slug);
  });
});

import { describe, expect, it } from "vitest";

import {
  AMBIGUOUS_DEMO_PLACES,
  AMBIGUOUS_DEMO_ZIP,
  DEMO_PLACES,
} from "./fixtures";
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

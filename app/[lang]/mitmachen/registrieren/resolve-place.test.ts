import { describe, expect, it, vi } from "vitest";

import { resolveRegisterPlace } from "./resolve-place";

/**
 * TS-023-A5/A6, unit level — the parts of D3/D4 the shared live-data mock
 * (`src/lib/live/mocks/geo.ts`) can and cannot exercise on its own.
 *
 * `mockSearchByZip` answers at most one place per postcode (never several),
 * so D3's "a municipality hit with several communities does not advance"
 * has no naturally-occurring fixture today — a measured gap, not a defect
 * in this page (`state/open.md`). The ambiguous branch is unit-tested here
 * against a stubbed `searchPlaces` result instead, so the page's own
 * handling is verified independently of the fixture's current shape.
 */
describe("TS-023-A5: place resolution (real interface, mocked backend)", () => {
  it("resolves an already-known community slug", async () => {
    const result = await resolveRegisterPlace("beispielgemeinde-musterdorf");
    expect(result.kind).toBe("resolved");
    if (result.kind === "resolved") expect(result.place.slug).toBe("beispielgemeinde-musterdorf");
  });

  it("resolves a postcode to its one covered place", async () => {
    const result = await resolveRegisterPlace("17495");
    expect(result.kind).toBe("resolved");
  });

  it("does not resolve an unknown value — step 1 stays unanswered", async () => {
    expect(await resolveRegisterPlace("99999")).toEqual({ kind: "unresolved" });
    expect(await resolveRegisterPlace(undefined)).toEqual({ kind: "unresolved" });
    expect(await resolveRegisterPlace("not a slug or a zip")).toEqual({ kind: "unresolved" });
  });
});

describe("TS-023-A6: a municipality hit with several communities does not advance", () => {
  it("reports every candidate rather than auto-selecting one", async () => {
    vi.resetModules();
    vi.doMock("@/src/lib/live/places", async () => {
      const actual = await vi.importActual<typeof import("@/src/lib/live/places")>(
        "@/src/lib/live/places",
      );
      return {
        ...actual,
        resolvePlace: async () => undefined,
        searchPlaces: async () => ({
          data: {
            query: "17389",
            outcome: {
              kind: "covered",
              place: { communityId: "geoname.1", name: "Anklam", slug: "anklam", lat: 0, lng: 0 },
            },
            suggestions: [
              { communityId: "geoname.1", name: "Anklam", slug: "anklam", lat: 0, lng: 0 },
              {
                communityId: "geoname.2",
                name: "Musterhagen",
                slug: "musterhagen",
                lat: 0,
                lng: 0,
              },
            ],
          },
          tier: "live",
          fetchedAt: new Date().toISOString(),
          stale: false,
          demo: true,
          source: "mock",
        }),
      };
    });

    const { resolveRegisterPlace: resolveWithStub } = await import("./resolve-place");
    const result = await resolveWithStub("17389");
    expect(result.kind).toBe("ambiguous");
    if (result.kind === "ambiguous") {
      expect(result.candidates.map((c) => c.slug)).toEqual(["anklam", "musterhagen"]);
    }

    vi.doUnmock("@/src/lib/live/places");
    vi.resetModules();
  });
});

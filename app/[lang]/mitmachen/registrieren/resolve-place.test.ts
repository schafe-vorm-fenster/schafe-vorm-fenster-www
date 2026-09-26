import { describe, expect, it } from "vitest";

import { placeRowLabel, resolveRegisterPlace } from "./resolve-place";

/**
 * TS-WEB-0023-A5/A6 and TS-WEB-0008-A16, unit level — step 1 resolves a **name**.
 *
 * Until T-16 this module gated on `isZip` and dropped every typed name
 * unread, which left the registration flow as the one search surface of the
 * site still running in postcode mode (DEC-0079 §1, DEC-0128). The gate is
 * gone, so the cases below are the real ones: a slug, a name that matches one
 * place, a municipality name that matches several, and five digits — which
 * are now just a string that matches nothing.
 *
 * `Groß Polzin` is a municipality of the committed community index
 * (`src/generated/place-index.json`, the same store `/dein-ort` and the
 * typeahead search) with five covered villages behind it and no community of
 * its own slug, so A6 no longer needs a stub: the shared data carries the
 * case. A municipality that *is* also a community slug (`Schmatzin`) resolves
 * on the slug branch first, which is why the fixture is not one of those.
 */
describe("TS-WEB-0023-A5: place resolution (real interface, committed index)", () => {
  it("resolves an already-known community slug", async () => {
    const result = await resolveRegisterPlace("schlatkow");
    expect(result.kind).toBe("resolved");
    if (result.kind === "resolved") expect(result.place.slug).toBe("schlatkow");
  });

  it("resolves a typed place name that matches exactly one place", async () => {
    const result = await resolveRegisterPlace("Wolfradshof");
    expect(result.kind).toBe("resolved");
    if (result.kind === "resolved") expect(result.place.slug).toBe("wolfradshof");
  });

  it("treats five typed digits like any other string — no postcode branch", async () => {
    // `17495` is the postcode the old `isZip` gate resolved to a place. The
    // search takes a name (DEC-0079 §1), so it matches nothing and step 1
    // stays unanswered rather than advancing on an abstraction.
    expect(await resolveRegisterPlace("17495")).toEqual({ kind: "unresolved" });
  });

  it("does not resolve an unknown value — step 1 stays unanswered", async () => {
    expect(await resolveRegisterPlace("99999")).toEqual({ kind: "unresolved" });
    expect(await resolveRegisterPlace(undefined)).toEqual({ kind: "unresolved" });
    expect(await resolveRegisterPlace("not a slug or a name")).toEqual({ kind: "unresolved" });
  });
});

describe("TS-WEB-0023-A6: a municipality hit with several communities does not advance", () => {
  it("reports every candidate rather than auto-selecting one", async () => {
    // A municipality name that is no community's slug, with several covered
    // villages behind it (D3: "the step asks which of them").
    const result = await resolveRegisterPlace("Groß Polzin");
    expect(result.kind).toBe("ambiguous");
    if (result.kind !== "ambiguous") return;

    expect(result.candidates.length).toBeGreaterThan(1);
    for (const candidate of result.candidates) expect(candidate.municipality).toBe("Groß Polzin");
    // The value taken from a candidate is the community slug, never the
    // municipality's name (D3, "never a municipality, county or state id"),
    // and the list is capped at the overlay's four rows (DEC-0119).
    expect(result.candidates.map((candidate) => candidate.slug)).toContain("klein-polzin");
    expect(result.candidates.length).toBeLessThanOrEqual(4);
  });

  it("labels each candidate `Ort (Gemeinde)`", async () => {
    const result = await resolveRegisterPlace("Groß Polzin");
    expect(result.kind).toBe("ambiguous");
    if (result.kind !== "ambiguous") return;

    for (const candidate of result.candidates) {
      expect(placeRowLabel(candidate)).toBe(`${candidate.name} (Groß Polzin)`);
    }
  });

  it("prints the bare name where the index carries no municipality", () => {
    expect(
      placeRowLabel({ communityId: "geoname.1", name: "Beispielort", slug: "beispielort", lat: 0, lng: 0 }),
    ).toBe("Beispielort");
  });
});

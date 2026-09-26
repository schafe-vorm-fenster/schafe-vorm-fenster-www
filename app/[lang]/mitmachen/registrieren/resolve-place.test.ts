import { describe, expect, it } from "vitest";

import { resolveRegisterPlace } from "./resolve-place";

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
 * The A6 fixture is `Lindetal`, measured against the committed community index
 * (`src/generated/snapshots/communities.json`, the same store `/dein-ort` and
 * the typeahead search): six covered communities carry it as their
 * municipality (Alt Käbelich, Ballin, Dewitz, Leppin, Marienhof, Plath), no
 * community is *named* `Lindetal` and no slug is `lindetal`. So neither the
 * slug branch nor the exact-name branch can answer it and the chooser is
 * reached for the reason A6 describes — a municipality with several
 * communities — rather than by a spelling accident. A municipality that is
 * also its seat's name (`Groß Polzin`, slug `gross-polzin`) would resolve
 * instead, which is why the fixture is not one of those.
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

  it("advances on a name typed in full even where another row contains it", async () => {
    // `Bömitz` is a community of the index; `Labömitz` contains the string and
    // ranks behind it (`place-index.ts` ranks an exact folded name match at 0).
    // Asking "which one?" here would be a question with one right answer
    // already on screen (DEC-0128 §3).
    const result = await resolveRegisterPlace("Bömitz");
    expect(result.kind).toBe("resolved");
    if (result.kind === "resolved") expect(result.place.slug).toBe("boemitz");
  });
});

describe("TS-WEB-0023-A6: a municipality hit with several communities does not advance", () => {
  it("reports every candidate rather than auto-selecting one", async () => {
    const result = await resolveRegisterPlace("Lindetal");
    expect(result.kind).toBe("ambiguous");
    if (result.kind !== "ambiguous") return;

    expect(result.candidates.length).toBeGreaterThan(1);
    for (const candidate of result.candidates) expect(candidate.municipality).toBe("Lindetal");
    // The value taken from a candidate is the community slug, never the
    // municipality's name (D3, "never a municipality, county or state id"),
    // and the list is capped at the overlay's four rows (DEC-0119).
    expect(result.candidates.map((candidate) => candidate.slug)).toContain("alt-kaebelich");
    expect(result.candidates.length).toBeLessThanOrEqual(4);
  });

  it("keeps asking where two communities carry the very same name", async () => {
    // The index holds two `Görke`, one in Dargen and one in Postlow — the case
    // TS-WEB-0008 D7a prints the municipality in brackets for. The exact-name
    // shortcut fires only when the exact match is unique, so this one asks.
    const result = await resolveRegisterPlace("Görke");
    expect(result.kind).toBe("ambiguous");
    if (result.kind !== "ambiguous") return;
    expect(result.candidates.filter((candidate) => candidate.name === "Görke").length).toBeGreaterThan(1);
    expect(result.candidates.map((candidate) => candidate.municipality)).toContain("Dargen");
  });
});

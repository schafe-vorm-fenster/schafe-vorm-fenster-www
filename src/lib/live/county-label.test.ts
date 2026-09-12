import { describe, expect, it } from "vitest";

import { countyLabel, genericCountyLabel, isGeoIdentifier } from "./county-label";

describe("F-2-73: a geo-api identifier is never a label", () => {
  it("recognises geo-api's own id shape", () => {
    expect(isGeoIdentifier("geoname.900001")).toBe(true);
    expect(isGeoIdentifier("geoname.900101")).toBe(true);
  });

  it("does not mistake a written-out county for an identifier", () => {
    expect(isGeoIdentifier("Beispiellandkreis Musterkreis")).toBe(false);
    expect(isGeoIdentifier("Landkreis Vorpommern-Greifswald")).toBe(false);
    // A name with a full stop in it — "St. Wendel" is a real county.
    expect(isGeoIdentifier("Landkreis St. Wendel")).toBe(false);
  });
});

describe("F-2-73: countyLabel answers a written-out label in both languages", () => {
  it("hands back a real county name unchanged", () => {
    expect(countyLabel("Beispiellandkreis Musterkreis", "de")).toBe(
      "Beispiellandkreis Musterkreis",
    );
    expect(countyLabel("Beispiellandkreis Musterkreis", "en")).toBe(
      "Beispiellandkreis Musterkreis",
    );
  });

  it("replaces the raw identifier with the generic phrase, per language", () => {
    expect(countyLabel("geoname.900001", "de")).toBe("deiner Region");
    expect(countyLabel("geoname.900001", "en")).toBe("your region");
  });

  it("answers the generic phrase for a missing or blank county", () => {
    expect(countyLabel(undefined, "de")).toBe(genericCountyLabel("de"));
    expect(countyLabel("   ", "en")).toBe(genericCountyLabel("en"));
  });

  it("never lets a `geoname.` string through, whatever the language", () => {
    for (const locale of ["de", "en"] as const) {
      expect(countyLabel("geoname.900002", locale)).not.toMatch(/geoname\./);
    }
  });
});

/**
 * Widened after the differential review of the F-2-73 change: the criterion is
 * "no internal id reaches a heading", and geo-api's neighbours do not all
 * spell theirs `geoname.900001`.
 */
describe("the identifier shape is wider than the one case F-2-63 met", () => {
  it.each(["geoname.900001", "geoname.900001a", "osm.relation-62422", "geo.de.900001"])(
    "%s is an identifier",
    (value) => {
      expect(isGeoIdentifier(value)).toBe(true);
    },
  );

  it.each([
    "Landkreis St. Wendel",
    "Vorpommern-Greifswald",
    "Mecklenburgische Seenplatte",
    "Kreis Plön",
  ])("%s is a name a person would recognise", (value) => {
    expect(isGeoIdentifier(value)).toBe(false);
  });
});

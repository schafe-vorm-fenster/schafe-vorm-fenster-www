import { describe, expect, it } from "vitest";

import { MAX_PLACE_LENGTH, readPlaceParameter } from "@/src/lib/pages/place-parameter";

/**
 * TS-021-A3 and TS-021-A5, at the unit level: what `?ort=` may carry, and
 * what silently becomes the placeless variant instead of an error page.
 */
describe("TS-021-A3: `?ort=` validation per D4", () => {
  it("accepts a place name, a postcode and the punctuation D4 lists", () => {
    expect(readPlaceParameter("Testdorf")).toBe("Testdorf");
    expect(readPlaceParameter("17390")).toBe("17390");
    expect(readPlaceParameter("Groß Kiesow")).toBe("Groß Kiesow");
    expect(readPlaceParameter("Sankt Peter-Ording")).toBe("Sankt Peter-Ording");
    expect(readPlaceParameter("O'Brien's Town")).toBe("O'Brien's Town");
    expect(readPlaceParameter("St. Pauli")).toBe("St. Pauli");
  });

  it("drops an absent, empty or blank parameter", () => {
    expect(readPlaceParameter(undefined)).toBeUndefined();
    expect(readPlaceParameter("")).toBeUndefined();
    expect(readPlaceParameter("   ")).toBeUndefined();
  });

  it("drops a value longer than 80 characters rather than truncating it", () => {
    expect(readPlaceParameter("a".repeat(MAX_PLACE_LENGTH))).toHaveLength(MAX_PLACE_LENGTH);
    expect(readPlaceParameter("a".repeat(MAX_PLACE_LENGTH + 1))).toBeUndefined();
    expect(readPlaceParameter("x".repeat(200))).toBeUndefined();
  });

  it("takes the first value where the parameter repeats", () => {
    expect(readPlaceParameter(["Testdorf", "Musterdorf"])).toBe("Testdorf");
    expect(readPlaceParameter([])).toBeUndefined();
  });
});

/**
 * TS-021-A5: `?ort=<script>alert(1)</script>` and
 * `?ort="><img src=x onerror=alert(1)>` — "the value appears only as escaped
 * text or as an encoded query value, and the page renders normally". The
 * page's first line of defence is that neither value is echoed at all.
 */
describe("TS-021-A5: an injection payload never becomes a place name", () => {
  for (const payload of [
    "<script>alert(1)</script>",
    '"><img src=x onerror=alert(1)>',
    "javascript:alert(1)",
    "Testdorf<script>",
    "../../etc/passwd",
    "Test%20dorf&x=1",
  ]) {
    it(`drops ${payload}`, () => {
      expect(readPlaceParameter(payload)).toBeUndefined();
    });
  }
});

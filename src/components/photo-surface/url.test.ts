import { describe, expect, it } from "vitest";

import { focalPosition, photoUrl } from "./url";

describe("TS-014-A: the photo surface never interpolates an unchecked URL", () => {
  it("wraps a plain path in a CSS url()", () => {
    expect(photoUrl("/bilder/dorf.jpg")).toBe('url("/bilder/dorf.jpg")');
  });

  it("refuses anything that could close the declaration", () => {
    expect(() => photoUrl('/a.jpg");color:red;background:url("x')).toThrow();
    expect(() => photoUrl("/a.jpg')")).toThrow();
    expect(() => photoUrl("/two words.jpg")).toThrow();
    expect(() => photoUrl("")).toThrow();
  });
});

describe("DEC-0105 §2: the focal point reaches the crop as a percentage pair", () => {
  it("formats the inventory's focal point as a background-position", () => {
    expect(focalPosition({ x: 50, y: 40 })).toBe("50% 40%");
    expect(focalPosition({ x: 0, y: 100 })).toBe("0% 100%");
  });

  it("refuses a value outside the frame rather than clamping it", () => {
    expect(() => focalPosition({ x: 120, y: 40 })).toThrow();
    expect(() => focalPosition({ x: 50, y: -1 })).toThrow();
    expect(() => focalPosition({ x: Number.NaN, y: 40 })).toThrow();
  });
});

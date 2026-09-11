import { describe, expect, it } from "vitest";

import { photoUrl } from "./url";

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

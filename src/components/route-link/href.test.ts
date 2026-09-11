import { describe, expect, it } from "vitest";

import { linkHref } from "./href";

describe("TS-001-A1: links in the default language stay bare", () => {
  it("takes the path from the route table", () => {
    expect(linkHref("takePart")).toBe("/mitmachen");
    expect(linkHref("home")).toBe("/");
  });
});

describe("TS-001-A2: a prefixed language carries its prefix and its own segments", () => {
  it("uses the English path, not the German one with a prefix", () => {
    expect(linkHref("register", { locale: "en" })).toBe("/en/take-part/register");
    expect(linkHref("home", { locale: "en" })).toBe("/en");
  });
});

describe("TS-001-A7/TS-004-A: query and fragment travel with the route", () => {
  it("appends query parameters and drops the empty ones", () => {
    expect(linkHref("place", { query: { ort: "beispieldorf", leer: "" } })).toBe(
      "/dein-ort?ort=beispieldorf",
    );
  });

  it("appends the fragment last", () => {
    expect(linkHref("legal", { hash: "impressum" })).toBe("/rechtliches#impressum");
    expect(linkHref("legal", { locale: "en", query: { a: 1 }, hash: "imprint" })).toBe(
      "/en/legal?a=1#imprint",
    );
  });
});

import { describe, expect, it } from "vitest";

import { isExternalHref, linkTarget, NEW_TAB_REL } from "./link-target";
import { SITE_ORIGIN } from "./routes";

describe("TS-WEB-0016-A24 (unit half): a link to another origin opens a new tab, nothing else does", () => {
  it.each([
    "https://schafe-vorm-fenster.de/lehre.2879378",
    "https://app.schafe-vorm-fenster.de/schlatkow",
    "https://calendar.app.google/abc",
    "https://wa.me/491234567890",
    "https://commons.wikimedia.org/wiki/File:X.jpg",
    "http://example.org/artikel",
    "//example.org/protocol-relative",
  ])("%s opens a new tab with noopener noreferrer", (href) => {
    expect(isExternalHref(href)).toBe(true);
    expect(linkTarget(href)).toEqual({ target: "_blank", rel: NEW_TAB_REL });
    expect(NEW_TAB_REL.split(" ")).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
  });

  it.each([
    "/dein-ort?ort=lehre",
    "#kontakt",
    "?ort=lehre",
    "mailto:kontakt@example.org",
    "tel:+491234567890",
    `${SITE_ORIGIN}/ueber-uns`,
    "",
    undefined,
  ])("%s stays in the tab", (href) => {
    expect(isExternalHref(href)).toBe(false);
    expect(linkTarget(href)).toEqual({});
  });
});

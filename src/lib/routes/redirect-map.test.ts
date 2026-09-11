import { describe, expect, it } from "vitest";

import { legalAnchor } from "@/src/lib/routes/legal-anchors";
import { LEGACY_REDIRECTS, redirectMapViolations } from "@/src/lib/routes/redirect-map";
import { href } from "@/src/lib/routes/routes";

describe("TS-011-A1: the redirect map — no chains, no duplicates, valid targets", () => {
  it("has no violations", () => {
    expect(redirectMapViolations()).toEqual([]);
  });

  it("carries the TS-011 D2 confirmed floor", () => {
    const sources = LEGACY_REDIRECTS.map((row) => row.from);
    expect(sources).toEqual(
      expect.arrayContaining(["/hilfe", "/funktionen", "/presse", "/impressum"]),
    );
  });

  it("/funktionen resolves to the calendar page, the only one still arguing features", () => {
    const row = LEGACY_REDIRECTS.find((r) => r.from === "/funktionen");
    expect(row?.to).toBe(href("calendar", "de"));
  });

  it("/presse resolves to the proof archive", () => {
    const row = LEGACY_REDIRECTS.find((r) => r.from === "/presse");
    expect(row?.to).toBe(href("archive", "de"));
  });

  it("/impressum resolves to the legal page's imprint anchor (TS-004 D8)", () => {
    const row = LEGACY_REDIRECTS.find((r) => r.from === "/impressum");
    expect(row?.to).toBe(`${href("legal", "de")}#${legalAnchor("imprint", "de")}`);
  });

  it("row 40: /start carries no redirect-map row — it stays TS-016's live route", () => {
    expect(LEGACY_REDIRECTS.some((row) => row.from === "/start")).toBe(false);
  });

  it("detects a chain if one is introduced", () => {
    const withChain = [
      ...LEGACY_REDIRECTS,
      { from: "/alt-a", to: "/alt-b", reason: "test" },
      { from: "/alt-b", to: "/mitmachen", reason: "test" },
    ];
    expect(redirectMapViolations(withChain)).toContain(
      "chain: /alt-a → /alt-b, which redirects again",
    );
  });

  it("detects a duplicate source", () => {
    const withDuplicate = [...LEGACY_REDIRECTS, { ...LEGACY_REDIRECTS[0]! }];
    expect(redirectMapViolations(withDuplicate)).toContain(
      `duplicate source ${LEGACY_REDIRECTS[0]!.from}`,
    );
  });
});

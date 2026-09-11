import { describe, expect, it } from "vitest";

import { parseSlotMeta, SLOT_META_COMMENT } from "@/src/lib/content/slot-meta";

const sourced =
  '<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->';
const generated =
  '<!-- id: archiv-2-rows-demo; content_type: archive-entry; provenance: generated; derived_from: []; status: draft; demo: true -->';
const multi =
  '<!-- id: home-6-scene-provenance; content_type: value-story; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor", "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"]; status: draft -->';

describe("TS-007-A1: the slot metadata comment parses against the schema", () => {
  it("reads id, content type, provenance, derived_from and status", () => {
    const result = parseSlotMeta(sourced);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.meta).toEqual({
      id: "home-1-search-hero",
      content_type: "hero",
      provenance: "sourced",
      derived_from: ["ia"],
      status: "draft",
      demo: false,
    });
  });

  it("reads the demo flag and an empty derived_from on a generated slot", () => {
    const result = parseSlotMeta(generated);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.meta.demo).toBe(true);
    expect(result.meta.provenance).toBe("generated");
    expect(result.meta.derived_from).toEqual([]);
  });

  it("reads a quoted, comma-separated list of source refs", () => {
    const result = parseSlotMeta(multi);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.meta.derived_from).toEqual([
      "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor",
      "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel",
    ]);
  });

  it("normalises the spellings the artifacts use onto the B.3 vocabulary", () => {
    for (const [written, canonical] of [
      ["form", "form-step"],
      ["tier", "offer-tier"],
      ["profile", "person-profile"],
      ["configuration", "site-config"],
    ] as const) {
      const result = parseSlotMeta(
        `<!-- id: x-1-y; content_type: ${written}; provenance: sourced; derived_from: [ia]; status: draft -->`,
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.meta.content_type).toBe(canonical);
    }
  });

  it("fails on an unknown content type", () => {
    const result = parseSlotMeta(
      '<!-- id: x-1-y; content_type: carousel; provenance: sourced; derived_from: [ia]; status: draft -->',
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.problems.join(" ")).toContain("content_type");
  });

  it("fails on a missing provenance", () => {
    const result = parseSlotMeta(
      '<!-- id: x-1-y; content_type: hero; derived_from: [ia]; status: draft -->',
    );
    expect(result.ok).toBe(false);
  });

  it("fails on a malformed source ref — a repository path is never an address (TS-007 D1)", () => {
    const result = parseSlotMeta(
      '<!-- id: x-1-y; content_type: hero; provenance: sourced; derived_from: ["packages/evidence/proof/founder.md"]; status: draft -->',
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.problems.join(" ")).toContain("derived_from");
  });

  it("fails on a version range instead of the exact installed version", () => {
    const result = parseSlotMeta(
      '<!-- id: x-1-y; content_type: hero; provenance: sourced; derived_from: ["@schafe-vorm-fenster/proof@^0.3.5#x"]; status: draft -->',
    );
    expect(result.ok).toBe(false);
  });

  it("matches only the metadata comment, not every HTML comment", () => {
    expect(SLOT_META_COMMENT.test("<!-- a note about the slot -->")).toBe(false);
    SLOT_META_COMMENT.lastIndex = 0;
    expect(SLOT_META_COMMENT.test(sourced)).toBe(true);
    SLOT_META_COMMENT.lastIndex = 0;
  });
});

import { describe, expect, it } from "vitest";

import { checkRhythm, type RhythmEntry } from "@/src/components/section-shell/rhythm";

/**
 * TS-027 / SRC-014 §Page Rhythm. `PageFrame`'s `merged` closing mode
 * (`primaryConversion: null`, TS-006 D6) appends a single `paper` section:
 * band and closing block are the same three jobs, so they render once, as
 * one block — the `aside#context-band` with block 4's `#closing-cta` anchor
 * inside it (`app/[lang]/_page-frame.tsx`, F-2-41). One section either way,
 * so the rhythm is unchanged by that fix.
 */
describe("TS-027: /ueber-uns page rhythm", () => {
  it("has no rhythm violation, exactly one photo section, one merged closing block", () => {
    const sections: RhythmEntry[] = [
      "photo", // 1 hero — the h1 on the photograph
      "paper", // 2 the causal chain, portrait and honorary-mayor proof
      "lime-100", // 3 where this comes from (the origin story, brief item 2)
      "paper", // 4 operating counters
      "surface", // 5 proof stream + the archive link (brief item 5)
      "lime-100", // 6 team
      "paper", // 7 newsletter
      "paper", // PageFrame merged closing block
    ];
    expect(checkRhythm(sections)).toEqual([]);
    expect(sections.filter((section) => section === "photo")).toHaveLength(1);
  });
});

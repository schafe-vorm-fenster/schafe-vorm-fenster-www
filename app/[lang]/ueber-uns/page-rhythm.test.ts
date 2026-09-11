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
      "photo", // 1 origin
      "paper", // 2 operating counters
      "lime-100", // 3 proof stream
      "paper", // 4 archive link
      "lime-100", // 5 team
      "paper", // 6 newsletter
      "paper", // PageFrame merged closing block
    ];
    expect(checkRhythm(sections)).toEqual([]);
    expect(sections.filter((section) => section === "photo")).toHaveLength(1);
  });
});

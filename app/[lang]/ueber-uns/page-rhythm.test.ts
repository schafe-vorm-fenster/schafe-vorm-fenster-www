import { describe, expect, it } from "vitest";

import { checkRhythm, type RhythmEntry } from "@/src/components/section-shell/rhythm";

/**
 * TS-027 / SRC-014 §Page Rhythm. `PageFrame`'s `merged` closing mode
 * (`primaryConversion: null`, TS-006 D6) suppresses the context band and
 * appends only the `paper` closing block (`app/[lang]/_page-frame.tsx`).
 */
describe("TS-027: /ueber-uns page rhythm", () => {
  it("has no rhythm violation, exactly one photo section, band suppressed", () => {
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

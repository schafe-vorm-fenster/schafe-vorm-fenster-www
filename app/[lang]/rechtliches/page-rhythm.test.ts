import { describe, expect, it } from "vitest";

import { checkRhythm, type RhythmEntry } from "@/src/components/section-shell/rhythm";

/** TS-029 / SRC-014 §Page Rhythm — one section (head + nav + sections), then `PageFrame`'s merged closing block. */
describe("TS-029: /rechtliches page rhythm", () => {
  it("has no rhythm violation", () => {
    const sections: RhythmEntry[] = ["paper", "paper"];
    expect(checkRhythm(sections)).toEqual([]);
  });
});

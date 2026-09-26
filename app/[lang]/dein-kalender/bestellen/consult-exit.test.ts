import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { consultExitHref, consultExitQuery } from "./consult-exit";

/**
 * A14 of TS-WEB-0025 and A14 of TS-WEB-0016, the page's half — spelled out
 * rather than written bare, because `check:specs` reads a bare id in a test
 * file as "this criterion has a test" and this file asserts one half of each.
 *
 * The review round found the other half asserted only against a fixture the
 * test supplied itself: `lead-fallback.test.tsx` handed the component a literal
 * href and checked it echoed it back, while nothing held the page to building
 * one that carries `orte`, `kreis` and `schritt` (TS-WEB-0025 D8, DEC-0133 §2).
 * These two cases are that missing half: the builder's output, and the fact
 * that the page's step-3 fallback mount and its per-step exit both take it.
 */

const PAGE = readFileSync(join(__dirname, "page.tsx"), "utf8");

describe("TS-WEB-0025 D8: the order flow's in-page consult target", () => {
  it("carries the scope and the step, and lands on the contact section", () => {
    expect(consultExitHref("de", { orte: "schlatkow", kreis: undefined, step: 3 })).toBe(
      "/dein-kalender/bestellen?orte=schlatkow&schritt=3#kontakt",
    );
    expect(
      consultExitHref("de", {
        orte: "schlatkow,kruckow",
        kreis: "vorpommern-greifswald",
        step: 4,
      }),
    ).toBe(
      "/dein-kalender/bestellen?orte=schlatkow%2Ckruckow&kreis=vorpommern-greifswald&schritt=4#kontakt",
    );
  });

  it("keeps the step on step 1, where no scope is chosen yet", () => {
    // `orte` and `kreis` drop out; `schritt` never does, so the exit returns
    // the visitor to the step she left rather than to the flow's start.
    expect(consultExitHref("de", { orte: undefined, kreis: undefined, step: 1 })).toBe(
      "/dein-kalender/bestellen?schritt=1#kontakt",
    );
    expect(consultExitQuery({ orte: undefined, kreis: undefined, step: 1 })).toEqual({
      orte: undefined,
      kreis: undefined,
      schritt: 1,
    });
  });

  it("resolves into the English route for the English flow", () => {
    expect(consultExitHref("en", { orte: "schlatkow", kreis: undefined, step: 3 })).toMatch(
      /^\/en\/.+\?orte=schlatkow&schritt=3#kontakt$/,
    );
  });

  /**
   * The mount and the exit have to read the builder, not rebuild the query —
   * a source assertion, because the page is an async server component whose
   * data dependencies a unit test cannot stand up.
   *
   * It asserts identifiers and the *absence* of a second query assembly, not
   * the page's formatting: the review round found the first version matching
   * three whole statements character for character, so a rename or a prettier
   * reflow would have failed a criterion that still held.
   */
  it("is what step 3's fallback mount and the per-step exit are handed", () => {
    // Both builders are imported, so neither call site can be reading something
    // else that happens to be called the same.
    expect(PAGE).toMatch(/import \{[^}]*\bconsultExitHref\b[^}]*\}\s+from\s+"\.\/consult-exit"/s);
    expect(PAGE).toMatch(/import \{[^}]*\bconsultExitQuery\b[^}]*\}\s+from\s+"\.\/consult-exit"/s);
    // And both are called: the per-step exit's href and the step-3 mount's query.
    expect(PAGE).toContain("consultExitHref(");
    expect(PAGE).toContain("consultExitQuery(");
    // No second, hand-built copy of *this* query survives: no `URLSearchParams`
    // anywhere, and no object literal that pairs `schritt` with the current
    // step. The flow's own advance links (`schritt: 3`, `schritt: 4`) are a
    // different target and stay untouched by this.
    expect(PAGE).not.toContain("URLSearchParams");
    expect(PAGE).not.toMatch(/schritt:\s*step\b/);
  });
});

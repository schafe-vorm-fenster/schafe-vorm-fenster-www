import { describe, expect, it } from "vitest";

import { UNCOVERED_DEMO_ZIP } from "@/src/lib/live/mocks/fixtures";

import { resolveLiveAnchor, resolvePlaceOutcome, STAGE_ZERO_ANCHOR } from "./live-anchor";

/**
 * F-2-30 — the three outcomes of TS-008 D7 have to survive the trip from
 * `src/lib/live/places.ts` into a page. Before this test `resolveLiveAnchor`
 * collapsed all three into "stage 0", so the uncovered branch that
 * `/dein-ort/starten` exists for was produced and consumed by nothing.
 */
describe("resolvePlaceOutcome", () => {
  it("answers `none` when no parameter arrived", async () => {
    expect(await resolvePlaceOutcome(undefined)).toEqual({ kind: "none" });
    expect(await resolvePlaceOutcome("")).toEqual({ kind: "none" });
  });

  it("answers `none` for a value the validator drops — TS-020 D2 row 4", async () => {
    // Fails the D4 grammar: the parameter is dropped and the placeless
    // variant renders, never a redirect and never an error page.
    expect(await resolvePlaceOutcome("<script>alert(1)</script>")).toEqual({ kind: "none" });
    expect(await resolvePlaceOutcome("x".repeat(81))).toEqual({ kind: "none" });
  });

  it("answers `covered` for a slug", async () => {
    const outcome = await resolvePlaceOutcome("beispielwalde");
    expect(outcome.kind).toBe("covered");
    expect(outcome.kind === "covered" && outcome.place.name).toBe("Beispielwalde");
  });

  it("answers `covered` for a postcode that resolves", async () => {
    const outcome = await resolvePlaceOutcome("07743");
    expect(outcome.kind).toBe("covered");
  });

  it("answers `uncovered` for the fixture's uncovered postcode — TS-008 D7 row 3", async () => {
    expect(await resolvePlaceOutcome(UNCOVERED_DEMO_ZIP)).toEqual({
      kind: "uncovered",
      query: UNCOVERED_DEMO_ZIP,
    });
  });

  it("answers `uncovered` for a typed name no place carries", async () => {
    expect(await resolvePlaceOutcome("abcde")).toEqual({ kind: "uncovered", query: "abcde" });
  });

  it("takes the first value of a repeated parameter", async () => {
    const outcome = await resolvePlaceOutcome(["beispielwalde", "musterbach"]);
    expect(outcome.kind === "covered" && outcome.place.slug).toBe("beispielwalde");
  });
});

describe("resolveLiveAnchor", () => {
  it("keeps the stage-0 anchor when nothing was stated", async () => {
    expect(await resolveLiveAnchor(undefined)).toEqual({ ...STAGE_ZERO_ANCHOR, stated: false });
  });

  it("anchors on a stated place", async () => {
    const anchor = await resolveLiveAnchor("beispielwalde");
    expect(anchor.slug).toBe("beispielwalde");
    expect(anchor.stated).toBe(true);
  });

  it("falls back to stage 0 for an uncovered value", async () => {
    expect(await resolveLiveAnchor(UNCOVERED_DEMO_ZIP)).toEqual({
      ...STAGE_ZERO_ANCHOR,
      stated: false,
    });
  });
});

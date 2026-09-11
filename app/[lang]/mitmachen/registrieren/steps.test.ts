import { describe, expect, it } from "vitest";

import { derivedStep, resolveDisplayedStep, resolveEnum } from "./steps";

describe("TS-023-A4: step derivation", () => {
  it("shows step 1 with no answers", () => {
    expect(derivedStep({})).toBe(1);
  });

  it("shows step 2 once the place is answered", () => {
    expect(derivedStep({ ort: "beispielgemeinde-musterdorf" })).toBe(2);
  });

  it("shows step 3 once place and who-publishes are answered", () => {
    expect(derivedStep({ ort: "beispielgemeinde-musterdorf", wer: "opt-1" })).toBe(3);
  });

  it("shows the handover once all three are answered", () => {
    expect(
      derivedStep({ ort: "beispielgemeinde-musterdorf", wer: "opt-1", weg: "whatsapp" }),
    ).toBe("handover");
  });

  it("honours an explicit `schritt` pointing back to an answered step", () => {
    const answers = {
      ort: "beispielgemeinde-musterdorf",
      wer: "opt-1",
      weg: "whatsapp",
    } as const;
    expect(resolveDisplayedStep(answers, "1")).toBe(1);
    expect(resolveDisplayedStep(answers, "2")).toBe(2);
  });

  it("ignores a `schritt` pointing forward past an unanswered step", () => {
    expect(resolveDisplayedStep({}, "3")).toBe(1);
    expect(resolveDisplayedStep({ ort: "beispielgemeinde-musterdorf" }, "3")).toBe(2);
  });

  it("ignores an invalid `schritt` value", () => {
    expect(resolveDisplayedStep({}, "not-a-number")).toBe(1);
    expect(resolveDisplayedStep({}, "0")).toBe(1);
    expect(resolveDisplayedStep({}, "99")).toBe(1);
  });

  it("drops an invalid enum value, re-asking its step", () => {
    const valid = new Set(["opt-1", "opt-2"]);
    expect(resolveEnum("opt-9", valid)).toBeUndefined();
    expect(resolveEnum("opt-1", valid)).toBe("opt-1");
    expect(resolveEnum(undefined, valid)).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";

import {
  checkContrast,
  checkScrimLadder,
  contrastRatio,
  gradientBodies,
  luminance,
  readTokenBlocks,
  scrimOver,
  themeValues,
} from "./check-contrast";

describe("TS-WEB-0002-A3: the contrast maths", () => {
  it("gives black on white the textbook 21:1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#171D0D", "#F9FBF7")).toBeCloseTo(
      contrastRatio("#F9FBF7", "#171D0D"),
      6,
    );
  });

  it("expands a three-digit hex", () => {
    expect(luminance("#FFF")).toBeCloseTo(luminance("#FFFFFF"), 6);
  });
});

describe("TS-WEB-0002-A3: the token reader", () => {
  const css = `
/* a header comment with an @ and a { brace */
@import "somewhere.css";
:root { --bg: #FFFFFF; --text: #000000; }
[data-theme="dark"] { --bg: #000000; --text: #FFFFFF; }
`;

  it("reads past a comment and a blockless at-rule", () => {
    const blocks = readTokenBlocks(css);
    expect(blocks.get(":root")?.get("--bg")).toBe("#FFFFFF");
  });

  it("layers a theme's selectors in cascade order", () => {
    const blocks = readTokenBlocks(css);
    const dark = themeValues(blocks, [":root", '[data-theme="dark"]']);
    expect(dark.get("--bg")).toBe("#000000");
    expect(dark.get("--text")).toBe("#FFFFFF");
  });
});

describe("TS-WEB-0002-A3: the guard fails what it is meant to fail", () => {
  it("passes the real token set in every theme", () => {
    const { errors, pairsChecked } = checkContrast();
    expect(errors).toEqual([]);
    expect(pairsChecked).toBeGreaterThan(60);
  });

  it("fails a token set whose body copy is too light", () => {
    const broken = `
:root {
  --bg: #FFFFFF; --bg-subtle: #FFFFFF; --bg-inset: #FFFFFF;
  --text: #BBBBBB; --text-secondary: #BBBBBB; --text-muted: #BBBBBB;
  --hairline: #EEEEEE; --border: #EEEEEE;
  --link: #BBBBBB; --link-hover: #BBBBBB; --focus: #EEEEEE;
  --brand-fill: #FFFFFF; --brand-fill-text: #EEEEEE;
  --voice: #FFFFFF; --voice-text: #EEEEEE; --pulse: #FFFFFF; --pulse-text: #EEEEEE;
  --color-status-warning: #EEEEEE; --color-archive-ground: #FFFFFF;
  --color-status-error: #EEEEEE; --color-status-success: #EEEEEE;
}
`;
    const { errors } = checkContrast(broken, SURFACE);
    expect(errors.length).toBeGreaterThan(10);
    expect(errors.join("\n")).toContain("--text");
    expect(errors.join("\n")).toContain("below 4.5:1");
  });

  it("names a token a theme forgot to declare", () => {
    const { errors } = checkContrast(":root { --bg: #FFFFFF; }", SURFACE);
    expect(errors.join("\n")).toContain("token not declared in this theme");
  });
});

/** The installed ladder's shape, as a fixture — neutral black, six stops. */
const LADDER = `
:root {
  --color-neutral-paper: #F9FBF7;
  --color-scrim-0: rgba(0,0,0,0);
  --color-scrim-30: rgba(0,0,0,0.30);
  --color-scrim-35: rgba(0,0,0,0.35);
  --color-scrim-38: rgba(0,0,0,0.38);
  --color-scrim-45: rgba(0,0,0,0.45);
  --color-scrim-72: rgba(0,0,0,0.72);
}
`;

/** The two gradients the design system states, as the surface composes them. */
const SURFACE = `
.surface {
  --photo-gradient-top: linear-gradient(180deg, var(--color-scrim-35) 0, var(--color-scrim-0) 16%);
  --photo-gradient-reading: linear-gradient(
    180deg,
    var(--color-scrim-0) 38%,
    var(--color-scrim-38) 58%,
    var(--color-scrim-72) 100%
  );
  background-image: var(--photo-gradient-top), var(--photo-gradient-reading), var(--photo-image);
}
`;

describe("TS-WEB-0002-A3, the hero row: the scrim ladder is fixed and capped (DEC-0105 §1)", () => {
  it("composites a neutral-black scrim over a ground", () => {
    expect(scrimOver([255, 255, 255], 0.72)).toBe("#474747");
    expect(scrimOver([255, 255, 255], 0)).toBe("#FFFFFF");
  });

  it("reads a gradient with a nested function call whole, and splits its stops at the top level", () => {
    const bodies = gradientBodies(
      "a: linear-gradient(180deg, color-mix(in srgb, var(--x) 96%, transparent) 62%, var(--y) 100%); b: linear-gradient(0deg, var(--z))",
    );
    expect(bodies).toHaveLength(2);
    expect(bodies[0]).toContain("color-mix(in srgb, var(--x) 96%, transparent) 62%");
  });

  it("measures paper on the ceiling over a white pixel at 4.5:1 or better", () => {
    expect(contrastRatio("#F9FBF7", scrimOver([255, 255, 255], 0.72))).toBeGreaterThan(4.5);
  });

  it("passes the installed ladder and the shipped surface", () => {
    expect(checkContrast().errors).toEqual([]);
  });

  it("passes the design system's two gradients on the fixture ladder", () => {
    expect(checkScrimLadder(LADDER, SURFACE)).toEqual([]);
  });

  it("fails a stop above the 0.72 ceiling — the retired .96 step", () => {
    const tokens = LADDER.replace("}", "  --color-scrim-96: rgba(0,0,0,0.96);\n}");
    const surface = SURFACE.replace("var(--color-scrim-72) 100%", "var(--color-scrim-96) 100%");
    const errors = checkScrimLadder(tokens, surface);
    expect(errors.join("\n")).toContain("--color-scrim-96 is above the 0.72 ceiling");
  });

  it("fails a tinted ladder — ink-derived alpha is the pre-decision shape", () => {
    const errors = checkScrimLadder(LADDER.replace("rgba(0,0,0,0.72)", "rgba(23,29,13,0.72)"), SURFACE);
    expect(errors.join("\n")).toContain("is not neutral black");
  });

  it("fails a surface that mixes its scrim from a colour role", () => {
    const surface = SURFACE.replace(
      "var(--color-scrim-72) 100%",
      "color-mix(in srgb, var(--color-neutral-ink) 96%, transparent) 100%",
    );
    const errors = checkScrimLadder(LADDER, surface).join("\n");
    expect(errors).toContain("color-mix()");
    expect(errors).toContain("is not a scrim token");
  });

  it("fails a surface with a third gradient or a missing token", () => {
    const three = SURFACE.replace("}", "  --extra: linear-gradient(180deg, var(--color-scrim-0), var(--color-scrim-38));\n}");
    expect(checkScrimLadder(LADDER, three).join("\n")).toContain("composes 3 gradient(s)");
    expect(checkScrimLadder(LADDER.replace(/.*scrim-45.*\n/, ""), SURFACE).join("\n")).toContain(
      "--color-scrim-45 is missing",
    );
  });
});

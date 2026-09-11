import { describe, expect, it } from "vitest";

import {
  checkContrast,
  contrastRatio,
  luminance,
  readTokenBlocks,
  themeValues,
} from "./check-contrast";

describe("TS-002-A3: the contrast maths", () => {
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

describe("TS-002-A3: the token reader", () => {
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

describe("TS-002-A3: the guard fails what it is meant to fail", () => {
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
  --color-status-warning: #EEEEEE; --color-placeholder-ground: #FFFFFF;
  --color-status-error: #EEEEEE; --color-status-success: #EEEEEE;
}
`;
    const { errors } = checkContrast(broken);
    expect(errors.length).toBeGreaterThan(10);
    expect(errors.join("\n")).toContain("--text");
    expect(errors.join("\n")).toContain("below 4.5:1");
  });

  it("names a token a theme forgot to declare", () => {
    const { errors } = checkContrast(":root { --bg: #FFFFFF; }");
    expect(errors.join("\n")).toContain("token not declared in this theme");
  });
});

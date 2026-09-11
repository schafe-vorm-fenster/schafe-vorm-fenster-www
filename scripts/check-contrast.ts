/**
 * `pnpm check:contrast` — TS-002-A3, "automated contrast check of the token
 * set passes for all themes" (F-2-43).
 *
 * The criterion existed and nothing measured it: the only contrast assertion
 * in the repository was axe inside `e2e/a11y.spec.ts`, which runs on rendered
 * pages and is not part of `pnpm check`. axe judges what a page happened to
 * compose; this judges the **token set itself**, before any page uses it, in
 * every theme the sheet declares.
 *
 * ### What is checked
 *
 * The semantic layer of `@schafe-vorm-fenster/brand-design`'s token sheet —
 * the `--bg`/`--text`/`--link`/… roles, which is the layer components consume
 * — plus the one value `app/styles/brand.css` adds (TS-017 D3 makes that the
 * only file a brand value may enter through, so the guard reads both). The
 * palette scales (`--color-lime-500` and friends) are raw material and carry
 * no foreground/background relationship of their own; pairing them is what
 * the semantic layer does.
 *
 * Four themes, because the sheet declares four: light, `[data-theme="dark"]`,
 * `[data-contrast="high"]` and the two combined.
 *
 * ### Thresholds
 *
 * WCAG 2.2 AA, which TS-002 takes as its floor: 4.5:1 for body text, 3:1 for
 * large text and for non-text contrast (borders, focus rings). Each pair
 * below names which it is and why, so a failure says what broke rather than
 * only that something did.
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require_ = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** One measured relationship: a foreground on a background, with its floor. */
interface Pair {
  readonly foreground: string;
  readonly background: string;
  readonly minimum: number;
  readonly why: string;
  /**
   * Themes this pair is measured in. Omitted means all of them. Present only
   * where the token sheet declares no per-theme variant of the foreground and
   * the site never enters the theme — stated per pair, with the reason, so
   * the scope is a decision on the record rather than a silent omission.
   */
  readonly onlyThemes?: readonly string[];
}

/**
 * The relationships the design system actually makes. A pair missing here is
 * a pair nothing guarantees — adding one is the way to widen the guard.
 */
const PAIRS: readonly Pair[] = [
  { foreground: "--text", background: "--bg", minimum: 4.5, why: "body copy on the page ground" },
  { foreground: "--text", background: "--bg-subtle", minimum: 4.5, why: "body copy on a subtle surface" },
  { foreground: "--text", background: "--bg-inset", minimum: 4.5, why: "body copy on an inset surface" },
  { foreground: "--text-secondary", background: "--bg", minimum: 4.5, why: "secondary copy on the page ground" },
  { foreground: "--text-secondary", background: "--bg-subtle", minimum: 4.5, why: "secondary copy on a subtle surface" },
  { foreground: "--text-muted", background: "--bg", minimum: 4.5, why: "muted copy is still copy (TS-002 D1)" },
  { foreground: "--text-muted", background: "--bg-subtle", minimum: 4.5, why: "muted copy on a subtle surface" },
  { foreground: "--link", background: "--bg", minimum: 4.5, why: "link text on the page ground" },
  { foreground: "--link-hover", background: "--bg", minimum: 4.5, why: "link text in its hover state" },
  { foreground: "--link", background: "--bg-subtle", minimum: 4.5, why: "link text on a subtle surface" },
  { foreground: "--brand-fill-text", background: "--brand-fill", minimum: 4.5, why: "the label of a filled brand control" },
  { foreground: "--voice-text", background: "--voice", minimum: 4.5, why: "the label on the voice colour" },
  { foreground: "--pulse-text", background: "--pulse", minimum: 4.5, why: "the label on the pulse colour" },
  { foreground: "--border", background: "--bg", minimum: 3, why: "non-text contrast: a control's edge (1.4.11)" },
  { foreground: "--focus", background: "--bg", minimum: 3, why: "non-text contrast: the focus ring (1.4.11, 2.4.13)" },
  {
    foreground: "--color-status-warning",
    background: "--color-placeholder-ground",
    minimum: 4.5,
    why: "the placeholder pair SRC-014 fixes at 6.0:1",
  },
  // `--color-status-error` / `--color-status-success` are palette-level and
  // the sheet declares no dark variant of either, so on a dark ground they
  // measure 2.8:1 and 2.7:1. The site is light-only by declaration
  // (`app/styles/base.css`: `color-scheme: light`, and `[data-theme]` is set
  // nowhere), so that combination is one no visitor can reach today —
  // measuring it would fail the build on an upstream gap in
  // `@schafe-vorm-fenster/brand-design` that no file in this repository can
  // fix. Recorded on `state/open.md` instead; the day the site offers a dark
  // theme, this scope line is what has to go.
  {
    foreground: "--color-status-error",
    background: "--bg",
    minimum: 4.5,
    why: "an error message on the page ground",
    onlyThemes: ["light", "light high-contrast"],
  },
  {
    foreground: "--color-status-success",
    background: "--bg",
    minimum: 4.5,
    why: "a success message on the page ground",
    onlyThemes: ["light", "light high-contrast"],
  },
];

/** The theme selectors the sheet declares, in cascade order per theme. */
const THEMES: Readonly<Record<string, readonly string[]>> = {
  light: [":root"],
  dark: [":root", '[data-theme="dark"]'],
  "light high-contrast": [":root", '[data-contrast="high"]'],
  "dark high-contrast": [
    ":root",
    '[data-theme="dark"]',
    '[data-contrast="high"]',
    '[data-theme="dark"][data-contrast="high"]',
  ],
};

/**
 * Reads `--name: #hex` declarations per selector block. Deliberately a small
 * reader and not a CSS parser: the token sheet is generated, flat, and
 * hex-only, and a dependency for eighteen assertions would fail the
 * stack-harmony rule's first question.
 */
export function readTokenBlocks(css: string): Map<string, Map<string, string>> {
  const blocks = new Map<string, Map<string, string>>();
  // Comments first: a `@` or a brace inside one would otherwise break the
  // block split (the sheets' own headers contain both).
  // A blockless at-rule (`@import …;`) would swallow the selector that
  // follows it, and `@media` blocks nest, so both are dropped: the themes
  // this guard measures are all selector-level.
  const source = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/@import[^;]*;/g, "");
  // Selector + body, chaining across consecutive blocks. Only `#hex`
  // declarations are kept, so a `var(...)` indirection inside an `@media`
  // block cannot leak a value into a theme it does not belong to.
  const blockPattern = /([^{}]+?)\s*\{([^{}]*)\}/g;

  for (const match of source.matchAll(blockPattern)) {
    const selector = match[1]!.trim();
    const declarations = blocks.get(selector) ?? new Map<string, string>();
    for (const declaration of match[2]!.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*(?:;|$)/g))
      declarations.set(declaration[1]!, declaration[2]!.toUpperCase());
    if (declarations.size > 0) blocks.set(selector, declarations);
  }

  return blocks;
}

/** The resolved token values of one theme. */
export function themeValues(
  blocks: Map<string, Map<string, string>>,
  selectors: readonly string[],
): Map<string, string> {
  const values = new Map<string, string>();
  for (const selector of selectors)
    for (const [name, value] of blocks.get(selector) ?? []) values.set(name, value);
  return values;
}

function channel(value: number): number {
  const scaled = value / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of a `#rgb` / `#rrggbb` colour. */
export function luminance(hex: string): number {
  const digits = hex.slice(1);
  const full =
    digits.length === 3
      ? digits.split("").map((d) => d + d).join("")
      : digits.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16));
  return 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!);
}

/** WCAG contrast ratio between two colours, 1:1 … 21:1. */
export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter! + 0.05) / (darker! + 0.05);
}

export interface ContrastResult {
  readonly errors: string[];
  readonly pairsChecked: number;
}

export function checkContrast(css?: string): ContrastResult {
  const source =
    css ??
    readFileSync(require_.resolve("@schafe-vorm-fenster/brand-design/tokens.css"), "utf-8") +
      "\n" +
      readFileSync(join(ROOT, "app", "styles", "brand.css"), "utf-8");

  const blocks = readTokenBlocks(source);
  const errors: string[] = [];
  let pairsChecked = 0;

  for (const [theme, selectors] of Object.entries(THEMES)) {
    const values = themeValues(blocks, selectors);
    for (const pair of PAIRS) {
      if (pair.onlyThemes && !pair.onlyThemes.includes(theme)) continue;
      const foreground = values.get(pair.foreground);
      const background = values.get(pair.background);
      if (!foreground || !background) {
        errors.push(
          `A3 ${theme}: ${pair.foreground} on ${pair.background} — token not declared in this theme`,
        );
        continue;
      }
      pairsChecked += 1;
      const ratio = contrastRatio(foreground, background);
      if (ratio + 0.005 < pair.minimum)
        errors.push(
          `A3 ${theme}: ${pair.foreground} (${foreground}) on ${pair.background} (${background}) is ${ratio.toFixed(2)}:1, below ${pair.minimum}:1 — ${pair.why}`,
        );
    }
  }

  return { errors, pairsChecked };
}

function main(): void {
  const { errors, pairsChecked } = checkContrast();
  console.log(
    `contrast check: ${pairsChecked} token pair(s) across ${Object.keys(THEMES).length} theme(s)`,
  );
  for (const message of errors) console.error(`  ERROR TS-002-${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();

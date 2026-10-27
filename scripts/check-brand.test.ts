import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { checkBrand } from "./check-brand";

/**
 * Round 1, row 42: `check-brand.ts` used to also walk `.next/static` to
 * catch "generated CSS", and its `min-width` regex had no `@media (...)`
 * context test — so a minified `min-width:0}` *property* in the built tree
 * ran the value capture past the property, picked up unrelated minified
 * text as its "value", and failed a clean build every time. These fixtures
 * are built fresh per test (never committed to the tree) and removed
 * afterwards.
 */

let fixtureRoot: string | undefined;

function fixture(...segments: string[]): string {
  const path = join(fixtureRoot!, ...segments);
  mkdirSync(join(path, ".."), { recursive: true });
  return path;
}

afterEach(() => {
  if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
  fixtureRoot = undefined;
});

function newRoot(): string {
  fixtureRoot = mkdtempSync(join(tmpdir(), "check-brand-"));
  return fixtureRoot;
}

describe("TS-WEB-0017-A4: check-brand excludes build output from the scan", () => {
  it("does not trip on a built .next tree carrying a minified min-width property", () => {
    const root = newRoot();
    // A shape modelled on real Next.js output: no whitespace, and a
    // `min-width:0}` *property* — not a media feature — followed later in
    // the same minified line by an unrelated `)` from another declaration.
    writeFileSync(
      fixture(".next", "static", "css", "app.css"),
      ".flex{display:flex;min-width:0}.btn{background:rgba(0,0,0,.5)}",
    );
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
    expect(result.cssFileCount).toBe(0);
  });

  it("does not trip on a built .next tree even if node_modules/.vercel sit beside it", () => {
    const root = newRoot();
    writeFileSync(
      fixture("node_modules", "some-pkg", "dist", "style.css"),
      ".x{min-width:0}",
    );
    writeFileSync(fixture(".vercel", "output", "static", "x.css"), ".y{min-width:0}");
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
  });

  it("still catches an authored max-width media query", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "legacy.css"),
      "@media (max-width: 600px) { .x { display: none; } }",
    );
    const result = checkBrand(root);
    expect(result.errors.some((e) => e.startsWith("TS-WEB-0017-A4") && e.includes("max-width"))).toBe(
      true,
    );
  });

  it("still catches an authored min-width media query with a non-token value", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "base.css"),
      "@media (min-width: 37.5rem) { .x { display: block; } }",
    );
    const result = checkBrand(root);
    expect(
      result.errors.some((e) => e.startsWith("TS-WEB-0017-A4") && e.includes("min-width")),
    ).toBe(true);
  });

  it("accepts an authored min-width media query on a breakpoint token", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "base.css"),
      "@media (min-width: 48rem) { .x { display: block; } }",
    );
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
  });

  it("accepts a container query on a named container threshold", () => {
    const root = newRoot();
    writeFileSync(
      fixture("src", "components", "row.module.css"),
      "@container event-row (min-width: 30rem) { .x { display: block; } }",
    );
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
  });

  it("catches a container query on a threshold the design system does not name", () => {
    const root = newRoot();
    writeFileSync(
      fixture("src", "components", "row.module.css"),
      "@container event-row (min-width: 31rem) { .x { display: block; } }",
    );
    const result = checkBrand(root);
    expect(
      result.errors.some((e) => e.startsWith("TS-WEB-0017-A4") && e.includes("@container")),
    ).toBe(true);
  });

  it("does not mistake a min-width property for a media feature", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "base.css"),
      ".card { min-width: 0; max-width: 100%; }",
    );
    const result = checkBrand(root);
    expect(result.errors).toEqual([]);
  });

  it("does not mistake a minified min-width property for a media feature, even authored", () => {
    // The regex fix itself, isolated from the directory-exclusion fix: the
    // same shape as row 42's bug (a `min-width:0}` property immediately
    // followed, with no separating whitespace, by an unrelated `)` later in
    // the line), but placed in an *authored* file the scan does visit.
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "weird.css"),
      ".flex{display:flex;min-width:0}.btn{background:rgba(0,0,0,.5)}",
    );
    const result = checkBrand(root);
    // Unrelated to A4: the fixture's `rgba(` is a genuine A5 colour-literal
    // violation (this file is not the token file) — expected and ignored
    // here, which is exactly why this asserts on A4 specifically rather
    // than on an empty error list.
    expect(result.errors.filter((e) => e.startsWith("TS-WEB-0017-A4"))).toEqual([]);
    expect(result.cssFileCount).toBe(1);
  });
});

describe("TS-WEB-0017-A22: the scrim is neutral black, in code and in the boards", () => {
  const a22 = (errors: readonly string[]) => errors.filter((e) => e.startsWith("TS-WEB-0017-A22"));

  it("fails an ink-tinted gradient in a design board", () => {
    const root = newRoot();
    writeFileSync(
      fixture("concept", "v2.0", "Board.dc.html"),
      '<div style="background-image:linear-gradient(180deg,rgba(23,29,13,.45) 0%,rgba(23,29,13,0) 22%),url(x.jpg)"></div>',
    );
    expect(a22(checkBrand(root).errors)).toHaveLength(1);
  });

  it("fails a scrim mixed from the ink or violet token in a stylesheet", () => {
    const root = newRoot();
    writeFileSync(
      fixture("src", "components", "x.module.css"),
      ".s { background-image: linear-gradient(180deg, color-mix(in srgb, var(--color-neutral-ink) 82%, transparent) 0, transparent 50%); }\n" +
        ".t { background-image: linear-gradient(0deg, var(--color-violet-500) 0, transparent 40%); }",
    );
    expect(a22(checkBrand(root).errors)).toHaveLength(2);
  });

  it("accepts the neutral-black ladder in a board and in a stylesheet", () => {
    const root = newRoot();
    writeFileSync(
      fixture("concept", "v2.0", "Board.dc.html"),
      '<div style="background-image:linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,0) 16%),linear-gradient(180deg,rgba(0,0,0,0) 38%,rgba(0,0,0,.38) 58%,rgba(0,0,0,.72) 100%)"></div>' +
        '<div style="box-shadow:0 4px 16px rgba(23,29,13,.08)"></div>',
    );
    writeFileSync(
      fixture("src", "components", "y.module.css"),
      ".s { background-image: linear-gradient(180deg, var(--color-scrim-35) 0, var(--color-scrim-0) 16%); }",
    );
    expect(a22(checkBrand(root).errors)).toEqual([]);
  });
});

describe("TS-WEB-0017-A28: ink is neutral black, and the retired ink is written nowhere", () => {
  const a28 = (errors: readonly string[]) => errors.filter((e) => e.startsWith("TS-WEB-0017-A28"));
  const TOKENS = ["node_modules", "@schafe-vorm-fenster", "brand-design", "tokens", "svf-tokens.css"];
  const tinted = ["#17", "1D0D"].join("");

  it("fails a tinted ink in the token sheet that nothing overrides", () => {
    const root = newRoot();
    writeFileSync(fixture(...TOKENS), `:root { --color-neutral-ink: ${tinted}; }`);
    expect(a28(checkBrand(root).errors)).toHaveLength(1);
  });

  it("passes when app/styles/brand.css sets a neutral ink on top of a tinted package", () => {
    const root = newRoot();
    writeFileSync(fixture(...TOKENS), `:root { --color-neutral-ink: ${tinted}; }`);
    writeFileSync(fixture("app", "styles", "brand.css"), ":root { --color-neutral-ink: #000000; }");
    expect(a28(checkBrand(root).errors)).toEqual([]);
  });

  it("fails the retired ink written in a design board, and passes a board without it", () => {
    const root = newRoot();
    writeFileSync(fixture("concept", "v2.0", "Board.dc.html"), `<div style="background:${tinted}"></div>`);
    expect(a28(checkBrand(root).errors)).toHaveLength(1);
    writeFileSync(fixture("concept", "v2.0", "Board.dc.html"), '<div style="background:#000000"></div>');
    expect(a28(checkBrand(root).errors)).toEqual([]);
  });
});

describe("TS-WEB-0017-A30: no dark-green fill, in a stylesheet or a board", () => {
  const a30 = (errors: readonly string[]) => errors.filter((e) => e.startsWith("TS-WEB-0017-A30"));
  const darkHex = ["#2D", "3F01"].join("");

  it("fails a lime-700…950 token used as a background, background-color or fill", () => {
    const root = newRoot();
    writeFileSync(
      fixture("src", "components", "x.module.css"),
      ".a:hover { background: var(--color-lime-900); }\n" +
        ".b { background-color: var(--color-lime-800); }\n" +
        ".c { fill: var(--color-lime-700); }\n" +
        ".d { background: var( --color-lime-950 ); }",
    );
    const errors = a30(checkBrand(root).errors);
    expect(errors).toHaveLength(4);
    expect(errors[0]).toContain("src/components/x.module.css:1");
    expect(errors[3]).toContain("src/components/x.module.css:4");
  });

  it("fails a fill that reads a custom property carrying a dark lime, through an alias chain, in app/ too", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "components.css"),
      ":root { --hover-fill: var(--color-lime-900); --alias: var(--hover-fill); }",
    );
    writeFileSync(fixture("src", "components", "y.module.css"), ".b:hover { background: var(--alias); }");
    const errors = a30(checkBrand(root).errors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("--alias");
  });

  it("fails the hex of a dark lime painted as a background in a design board", () => {
    const root = newRoot();
    writeFileSync(fixture("concept", "v2.0", "Board.dc.html"), `<span style="display:inline-flex;background:${darkHex};color:#F9FBF7">AMTLICH</span>`);
    expect(a30(checkBrand(root).errors)).toHaveLength(1);
  });

  it("accepts a dark lime as text, link or icon colour, and the neutral fills that replace it", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "styles", "components.css"),
      ":root { --ground-link: var(--color-lime-800); --ground-primary-fill-hover: var(--color-neutral-text2); }",
    );
    writeFileSync(
      fixture("src", "components", "z.module.css"),
      "/* background: var(--color-lime-900) in a comment is prose */\n" +
        ".k { color: var(--color-lime-900); }\n" +
        ".l { color: var(--ground-link); border-color: var(--color-lime-800); }\n" +
        ".m:hover { background: var(--ground-primary-fill-hover); }\n" +
        ".n { background: var(--color-neutral-ink); color: var(--color-lime-500); }",
    );
    writeFileSync(fixture("concept", "v2.0", "Board.dc.html"), `<span style="background:#000000;color:${darkHex}">x</span>`);
    expect(a30(checkBrand(root).errors)).toEqual([]);
  });
});

describe("TS-WEB-0017-A32: no outer margin handed to a component through className", () => {
  const a32 = (errors: readonly string[]) => errors.filter((e) => e.startsWith("TS-WEB-0017-A32"));

  it("fails a page class with a vertical margin passed as className to a component", () => {
    const root = newRoot();
    writeFileSync(
      fixture("app", "x", "page.module.css"),
      ".stories { margin-top: var(--space-6); }\n.band { margin: var(--space-4) 0; }",
    );
    writeFileSync(
      fixture("app", "x", "page.tsx"),
      'import styles from "./page.module.css";\n' +
        "export default function P() {\n" +
        "  return (<>\n" +
        "    <StoryDisclosure className={styles.stories} stories={[]} />\n" +
        "    <PriceBand className={[styles.band, \"x\"].join(\" \")} />\n" +
        "  </>);\n}\n",
    );
    const errors = a32(checkBrand(root).errors);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("app/x/page.tsx:4");
    expect(errors[0]).toContain("StoryDisclosure");
  });

  it("accepts horizontal margins, zero margins, and a margin on a plain element", () => {
    const root = newRoot();
    writeFileSync(
      fixture("src", "components", "y", "y.module.css"),
      ".a { margin-inline: auto; }\n.b { margin: 0 auto; }\n.c { margin-top: var(--space-2); }",
    );
    writeFileSync(
      fixture("src", "components", "y", "y.tsx"),
      'import styles from "./y.module.css";\n' +
        "export function Y() {\n" +
        "  return (<div><Badge className={styles.a} /><Badge className={styles.b} /><p className={styles.c}>x</p></div>);\n}\n",
    );
    expect(a32(checkBrand(root).errors)).toEqual([]);
  });
});

import { readdirSync, readFileSync } from "node:fs";
import { join, normalize, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Issue 240 guard: every CSS module that a file under `app/[lang]/` imports
 * must also be imported by `app/[lang]/_shared-styles.ts`, and the root layout
 * must import that file. Otherwise the module can become its own CSS chunk and
 * React preloads it, unused, into every page that prefetches its page.
 */
const ROOT = resolve(__dirname, "..");
const LANG_DIR = join(ROOT, "app", "[lang]");
const SHARED = join(LANG_DIR, "_shared-styles.ts");
const CSS_IMPORT = /import\s+(?:[\w$]+\s+from\s+)?["']([^"']+\.css)["']/g;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

function cssImports(file: string): string[] {
  const source = readFileSync(file, "utf-8");
  return [...source.matchAll(CSS_IMPORT)].map(([, spec]) =>
    spec.startsWith("@/")
      ? normalize(join(ROOT, spec.slice(2)))
      : normalize(join(file, "..", spec)),
  );
}

describe("shared styles entry (issue 240)", () => {
  const shared = new Set(cssImports(SHARED));
  const sources = walk(LANG_DIR).filter(
    (f) => /\.tsx?$/.test(f) && f !== SHARED,
  );

  it("the root layout imports the shared entry", () => {
    const layout = readFileSync(join(LANG_DIR, "layout.tsx"), "utf-8");
    expect(layout).toMatch(/import\s+["']\.\/_shared-styles["']/);
  });

  it("lists every CSS module imported under app/[lang]/", () => {
    const missing = sources.flatMap((file) =>
      cssImports(file)
        .filter((css) => css.endsWith(".module.css") && !shared.has(css))
        .map((css) => `${relative(ROOT, css)} (imported by ${relative(ROOT, file)})`),
    );
    expect(
      missing,
      "add these to app/[lang]/_shared-styles.ts (page-only chunks get preloaded unused)",
    ).toEqual([]);
  });
});

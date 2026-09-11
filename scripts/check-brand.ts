/**
 * Brand and layout-law guard — the static half of TS-017 D2 and D3.
 *
 *  A4  No `@media (max-width: …)` anywhere, and every `min-width` value is one
 *      of the six `breakpoint.*` token values of brand-design. A literal px
 *      breakpoint at a call site fails.
 *  A5  No colour literal and no `font-family` literal outside the single
 *      brand-token import file (app/styles/brand.css).
 *  A6  No logo, mark or font file is committed in this repository.
 *
 * Scans **authored** sources only — `app/**`, `src/**`, `e2e/**`,
 * `scripts/**` — never build output. `.next/`, `node_modules/` and
 * `.vercel/` are excluded from the walk itself (not just filtered
 * afterwards), so a build artefact can never reach either regex.
 *
 * Round 1, row 42: the previous version additionally walked
 * `.next/static` to catch "generated CSS" — a build artefact scan bolted
 * onto a pre-commit-speed check. Minified output has no whitespace, so the
 * `min-width` regex's value capture ran past the end of a `min-width:0}`
 * *property* looking for the next `)` and picked up unrelated minified
 * text as its "value" — a false positive on every built tree, exactly the
 * state `pnpm build && pnpm check` leaves the repo in. Two independent
 * fixes: the walk no longer reaches build output at all, and the
 * `min-width` regex now requires the same `@media (...)` context test the
 * `max-width` half already used, so a `min-width` *property* (build output
 * or not) can never be mistaken for a media feature again.
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The single file brand values are allowed to enter through (TS-017 D3). */
const TOKEN_FILE = "app/styles/brand.css";

/** brand-design `breakpoint.*` — the only legal `min-width` values (DEC-067). */
const BREAKPOINTS = new Map<string, string>([
  ["22.5rem", "xs"],
  ["26.75rem", "sm"],
  ["40rem", "md"],
  ["48rem", "lg"],
  ["64rem", "xl"],
  ["80rem", "2xl"],
]);

/** The authored-source universe. Nothing outside these is ever scanned. */
const SOURCE_DIRS = ["app", "src", "e2e", "scripts"];
const SOURCE_EXTENSIONS = /\.(css|ts|tsx)$/;
const ASSET_DIRS = ["app", "src", "public"];
const FONT_FILES = /\.(woff2?|ttf|otf|eot)$/i;
const LOGO_FILES = /(logo|wordmark|brandmark)[^/]*\.(svg|png|jpg|jpeg|webp)$/i;
/** Generated placeholder imagery (DEC-068) is not brand asset material. */
const ASSET_EXCEPTIONS = [join("src", "generated", "placeholders")];

/** Never descended into, from any starting point — build output, not source. */
const EXCLUDED_DIR_NAMES = new Set([
  "node_modules",
  ".next",
  ".vercel",
  ".git",
]);

/**
 * A test file's fixture data legitimately contains literal CSS text — this
 * very suite's `.next` and colour-literal fixtures are exactly that. A5/A6
 * hold against application code, not against a string a test compares
 * against; excluded here rather than by narrowing `SOURCE_DIRS`, so a real
 * violation in `e2e/**` or `scripts/**` (a component demo, a generator) is
 * still caught.
 */
function isTestFile(path: string): boolean {
  return /\.(test|integration\.test)\.tsx?$/.test(path);
}

const COLOUR_LITERAL =
  /(#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\s*\()/;
const FONT_FAMILY_LITERAL = /font-?[Ff]amily\s*[:=]\s*(.+)/;
const FONT_FAMILY_ALLOWED =
  /^(var\(|inherit|initial|unset|revert|"?\s*var\(|'?\s*var\()/;

/** `before` is the text immediately preceding a match — is it inside `@media (...)`? */
function inMediaQueryContext(before: string): boolean {
  return (
    /@media[^{]*\(\s*$/.test(before) || /@media[^{]*and\s*\(\s*$/.test(before)
  );
}

function walk(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((name) => {
    if (EXCLUDED_DIR_NAMES.has(name)) return [];
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export interface BrandCheckResult {
  readonly errors: string[];
  readonly cssFileCount: number;
  readonly sourceFileCount: number;
}

/**
 * Runs the A4/A5/A6 checks rooted at `root` (the repository root in
 * production; a fixture directory of the same shape in tests) and returns
 * every violation found, prefixed `A4`/`A5`/`A6`. Pure — no console output,
 * no `process.exit` — so a test can assert on the result directly.
 */
export function checkBrand(root: string): BrandCheckResult {
  const errors: string[] = [];
  const fail = (criterion: string, file: string, message: string) =>
    errors.push(`${criterion} ${file}: ${message}`);
  const rel = (file: string) => relative(root, file);

  // ── A4: the direction of the layout law ───────────────────────────────────

  const cssFiles = SOURCE_DIRS.flatMap((dir) => walk(join(root, dir))).filter(
    (f) => f.endsWith(".css"),
  );

  for (const file of cssFiles) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/max-width\s*:\s*[^)\s;]+/g)) {
      // A `max-width` *property* is fine (the container uses one); only a
      // `max-width` media feature reverses the direction of the law.
      const before = source.slice(Math.max(0, match.index - 40), match.index);
      if (inMediaQueryContext(before))
        fail("A4", rel(file), `max-width media query: ${match[0]}`);
    }
    for (const match of source.matchAll(
      /min-width\s*:\s*([^)\s;}]+)\s*\)/g,
    )) {
      // Mirrors the `max-width` context test: a `min-width` *property*
      // (e.g. minified `min-width:0}`) is not a media feature and is none
      // of A4's business — only a value inside `@media (...)` is checked
      // against the breakpoint token set.
      const before = source.slice(Math.max(0, match.index - 40), match.index);
      if (!inMediaQueryContext(before)) continue;
      const value = (match[1] ?? "").trim();
      if (!BREAKPOINTS.has(value))
        fail(
          "A4",
          rel(file),
          `min-width ${value} is not a breakpoint token (${[...BREAKPOINTS.keys()].join(", ")})`,
        );
    }
  }

  // ── A5: no literal outside the token file ─────────────────────────────────

  const sourceFiles = SOURCE_DIRS.flatMap((dir) =>
    walk(join(root, dir)),
  ).filter((f) => SOURCE_EXTENSIONS.test(f));

  for (const file of sourceFiles) {
    const relative_ = rel(file);
    if (relative_ === TOKEN_FILE) continue;
    if (isTestFile(relative_)) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      const at = `${relative_}:${index + 1}`;
      const colour = COLOUR_LITERAL.exec(line);
      if (colour) fail("A5", at, `colour literal: ${colour[0]}`);
      const family = FONT_FAMILY_LITERAL.exec(line);
      if (family) {
        const value = (family[1] ?? "").trim();
        if (!FONT_FAMILY_ALLOWED.test(value))
          fail("A5", at, `font-family literal: ${value}`);
      }
    });
  }

  // ── A6: no brand asset committed here ─────────────────────────────────────

  for (const dir of ASSET_DIRS) {
    for (const file of walk(join(root, dir))) {
      const relative_ = rel(file);
      if (ASSET_EXCEPTIONS.some((prefix) => relative_.startsWith(prefix)))
        continue;
      if (FONT_FILES.test(relative_))
        fail("A6", relative_, "font file committed — fonts are package subpaths");
      if (LOGO_FILES.test(relative_))
        fail("A6", relative_, "logo file committed — logos are package subpaths");
    }
  }

  return { errors, cssFileCount: cssFiles.length, sourceFileCount: sourceFiles.length };
}

function main() {
  const { errors, cssFileCount, sourceFileCount } = checkBrand(ROOT);
  console.log(
    `brand check: ${cssFileCount} stylesheet(s) · ${sourceFileCount} source file(s) · token file ${TOKEN_FILE}`,
  );
  for (const message of errors) console.error(`  ERROR TS-017-${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();

/**
 * Brand and layout-law guard — the static half of TS-WEB-0017 D2 and D3.
 *
 *  TS-WEB-0017-A4  No `@media (max-width: …)` anywhere, and every `min-width`
 *      value is one of the six `breakpoint.*` token values of brand-design. A
 *      literal px breakpoint at a call site fails.
 *  TS-WEB-0017-A5  No colour literal and no `font-family` literal outside the
 *      single brand-token import file (app/styles/brand.css).
 *  TS-WEB-0017-A6  No logo, mark or font file is committed in this repository.
 *  TS-WEB-0017-A19 Every `var(--x)` without a fallback names a custom property
 *      something declares.
 *  TS-WEB-0017-A22 No tinted scrim: no gradient carries `ink` or `violet`
 *      (as the alpha form of `ink` 23·29·13 or `violet` 83·27·222, a `color-mix()` or a
 *      `var(--color-neutral-ink|violet-*)`), in authored sources **and** in the
 *      design boards `concept/v2.0/*.dc.html`. The scrim is neutral black and
 *      nothing else (SRC-0014 §The scrim, DEC-0151).
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
 * ── Why the full identifiers ──────────────────────────────────────────────
 *
 * Every message carries the whole criterion id. Until 2026-09-26 the prefixes
 * were bare (`A4`, `A19`) and the report line pasted `TS-017-` in front of
 * them, which is not an identifier this repository defines — so
 * `check:coverage` could attribute the meter to nothing and TS-WEB-0017-A19
 * read as MISSING although this script has enforced it since it was written
 * (`state/coverage.md`). A `static` criterion is closed by a
 * `scripts/check-*.ts` in the `check` chain that **names it**: a meter has no
 * test title to carry the link, so the identifier in its failure message *is*
 * the link (`scripts/check-coverage.ts`, verdict METERED).
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The five criteria this meter is the instrument for, spelled out once. */
const A4 = "TS-WEB-0017-A4";
const A5 = "TS-WEB-0017-A5";
const A6 = "TS-WEB-0017-A6";
const A19 = "TS-WEB-0017-A19";
const A22 = "TS-WEB-0017-A22";

/** The single file brand values are allowed to enter through (TS-WEB-0017 D3). */
const TOKEN_FILE = "app/styles/brand.css";

/** brand-design `breakpoint.*` — the only legal `min-width` values (DEC-0067). */
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
/** Generated placeholder imagery (DEC-0068) is not brand asset material. */
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

/** The design boards — a generator reads them, so they are held to the scrim rule too. */
const BOARD_DIR = join("concept", "v2.0");

/** `ink` and `violet`, as a board writes them and as a stylesheet names them. */
const TINT =
  /rgba\(\s*23\s*,\s*29\s*,\s*13\s*,|rgba\(\s*83\s*,\s*27\s*,\s*222\s*,|[#]171d0d[0-9a-f]{2}\b|color-mix\([^;]*(?:ink|violet)|var\(\s*--color-(?:neutral-ink|ink|violet-[0-9]+)\s*\)/i;

/** Every `linear-gradient(…)` / `radial-gradient(…)` in `text`, balanced, with its line. */
export function gradients(text: string): { body: string; line: number }[] {
  const found: { body: string; line: number }[] = [];
  for (const match of text.matchAll(/(?:repeating-)?(?:linear|radial)-gradient\(/g)) {
    let depth = 0;
    let end = match.index;
    for (; end < text.length; end++) {
      if (text[end] === "(") depth++;
      else if (text[end] === ")" && --depth === 0) break;
    }
    found.push({
      body: text.slice(match.index, end + 1),
      line: text.slice(0, match.index).split("\n").length,
    });
  }
  return found;
}

export interface BrandCheckResult {
  readonly errors: string[];
  readonly cssFileCount: number;
  readonly sourceFileCount: number;
}

/**
 * Runs the four checks rooted at `root` (the repository root in production; a
 * fixture directory of the same shape in tests) and returns every violation
 * found, each prefixed with the full identifier of the criterion it belongs
 * to. Pure — no console output, no `process.exit` — so a test can assert on
 * the result directly.
 */
export function checkBrand(root: string): BrandCheckResult {
  const errors: string[] = [];
  const fail = (criterion: string, file: string, message: string) =>
    errors.push(`${criterion} ${file}: ${message}`);
  const rel = (file: string) => relative(root, file);

  // ── TS-WEB-0017-A4: the direction of the layout law ───────────────────────────────────

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
        fail(A4, rel(file), `max-width media query: ${match[0]}`);
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
          A4,
          rel(file),
          `min-width ${value} is not a breakpoint token (${[...BREAKPOINTS.keys()].join(", ")})`,
        );
    }
  }

  // ── TS-WEB-0017-A5: no literal outside the token file ─────────────────────────────────

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
      if (colour) fail(A5, at, `colour literal: ${colour[0]}`);
      const family = FONT_FAMILY_LITERAL.exec(line);
      if (family) {
        const value = (family[1] ?? "").trim();
        if (!FONT_FAMILY_ALLOWED.test(value))
          fail(A5, at, `font-family literal: ${value}`);
      }
    });
  }

  // ── TS-WEB-0017-A6: no brand asset committed here ─────────────────────────────────────

  for (const dir of ASSET_DIRS) {
    for (const file of walk(join(root, dir))) {
      const relative_ = rel(file);
      if (ASSET_EXCEPTIONS.some((prefix) => relative_.startsWith(prefix)))
        continue;
      if (FONT_FILES.test(relative_))
        fail(A6, relative_, "font file committed — fonts are package subpaths");
      if (LOGO_FILES.test(relative_))
        fail(A6, relative_, "logo file committed — logos are package subpaths");
    }
  }

  // --- TS-WEB-0017-A19: a `var()` whose custom property nothing declares -----------------
  //
  // An undeclared custom property does not fall back to something sensible: it
  // makes the whole declaration invalid, so the browser drops it. `--space-5`
  // and `--color-focus-ring` each sat in the tree for weeks doing exactly that
  // — one heading lost the air the rule above it promised, two components lost
  // their brand focus ring to the browser default. Neither showed up anywhere,
  // because a missing outline looks like a different outline.
  //
  // Declarations are collected from every stylesheet including the package
  // token sheet, and from TS/TSX, where a component may set one through an
  // inline style. A property used but never declared is the error.
  const declared = new Set<string>();
  const tokenSheet = join(
    root,
    "node_modules/@schafe-vorm-fenster/brand-design/tokens/svf-tokens.css",
  );
  const declarationSources = [...cssFiles, ...sourceFiles];
  if (existsSync(tokenSheet)) declarationSources.push(tokenSheet);
  for (const file of declarationSources) {
    const text = readFileSync(file, "utf8");
    // `--x:` in CSS, and `"--x":` / `'--x':` in an inline style object.
    for (const match of text.matchAll(/(?:^|[;{\s"'(,])(--[a-zA-Z0-9-]+)\s*"?'?\s*:/g))
      declared.add(match[1]);
  }
  for (const file of cssFiles) {
    const relative_ = rel(file);
    const raw = readFileSync(file, "utf8");
    // Blank comments rather than dropping them, so line numbers stay true. A
    // comment may name a property in prose without using it.
    const text = raw.replace(/\/\*[\s\S]*?\*\//g, (block) =>
      block.replace(/[^\n]/g, " "),
    );
    const reported = new Set<string>();
    // `var(--x)` only, never `var(--x, fallback)`: with a fallback an
    // undeclared property is a deliberate default, not a dropped declaration.
    for (const match of text.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)\s*\)/g)) {
      const name = match[1];
      if (declared.has(name) || reported.has(name)) continue;
      reported.add(name);
      const line = text.slice(0, match.index).split("\n").length;
      fail(
        A19,
        `${relative_}:${line}`,
        `\`var(${name})\` — nothing declares it, so the whole declaration is dropped`,
      );
    }
  }

  // --- TS-WEB-0017-A22: the scrim is neutral black, everywhere -------------------------
  //
  // Decision 5 retired the dark-green, `ink`-tinted scrim on 2026-09-23 and the
  // component followed with DEC-0116 — yet three boards a generator reads still
  // drew it, and a design input arrived with it again on 2026-10-07. A tinted
  // gradient over a photograph is never right, so any gradient naming `ink` or
  // `violet` fails, in code and in the boards alike (DEC-0151).
  const boardFiles = walk(join(root, BOARD_DIR)).filter((f) => f.endsWith(".dc.html"));
  for (const file of [...sourceFiles, ...boardFiles]) {
    const relative_ = rel(file);
    if (isTestFile(relative_)) continue;
    const text = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, (block) =>
      block.replace(/[^\n]/g, " "),
    );
    for (const { body, line } of gradients(text)) {
      const tint = TINT.exec(body);
      if (tint)
        fail(
          A22,
          `${relative_}:${line}`,
          `tinted scrim \`${tint[0]}\` — the scrim is neutral black (\`color.scrim.*\`), never \`ink\` or \`violet\``,
        );
    }
  }

  return { errors, cssFileCount: cssFiles.length, sourceFileCount: sourceFiles.length };
}

function main() {
  const { errors, cssFileCount, sourceFileCount } = checkBrand(ROOT);
  console.log(
    `brand check: ${cssFileCount} stylesheet(s) · ${sourceFileCount} source file(s) · token file ${TOKEN_FILE}`,
  );
  for (const message of errors) console.error(`  ERROR ${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();

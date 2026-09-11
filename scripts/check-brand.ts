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
 * Scans the authored sources always, and `.next/static/css` as well when a
 * build is present — so the criterion's "generated CSS" is covered in CI
 * without making the pre-commit gate wait for a build.
 *
 * Exit code: number of errors (0 = green).
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

const SOURCE_DIRS = ["app", "src"];
const BUILT_CSS_DIR = ".next/static";
const SOURCE_EXTENSIONS = /\.(css|ts|tsx)$/;
const ASSET_DIRS = ["app", "src", "public"];
const FONT_FILES = /\.(woff2?|ttf|otf|eot)$/i;
const LOGO_FILES = /(logo|wordmark|brandmark)[^/]*\.(svg|png|jpg|jpeg|webp)$/i;
/** Generated placeholder imagery (DEC-068) is not brand asset material. */
const ASSET_EXCEPTIONS = [join("src", "generated", "placeholders")];

const errors: string[] = [];
const fail = (criterion: string, file: string, message: string) =>
  errors.push(`${criterion} ${file}: ${message}`);

function walk(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const rel = (file: string) => relative(ROOT, file);

// ── A4: the direction of the layout law ─────────────────────────────────────

const cssFiles = [
  ...SOURCE_DIRS.flatMap((dir) => walk(join(ROOT, dir))).filter((f) =>
    f.endsWith(".css"),
  ),
  ...walk(join(ROOT, BUILT_CSS_DIR)).filter((f) => f.endsWith(".css")),
];

for (const file of cssFiles) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/max-width\s*:\s*[^)\s;]+/g)) {
    // A `max-width` *property* is fine (the container uses one); only a
    // `max-width` media feature reverses the direction of the law.
    const before = source.slice(Math.max(0, match.index - 40), match.index);
    if (/@media[^{]*\(\s*$/.test(before) || /@media[^{]*and\s*\(\s*$/.test(before))
      fail("A4", rel(file), `max-width media query: ${match[0]}`);
  }
  for (const match of source.matchAll(/min-width\s*:\s*([^)\s;]+)\s*\)/g)) {
    const value = (match[1] ?? "").trim();
    if (!BREAKPOINTS.has(value))
      fail(
        "A4",
        rel(file),
        `min-width ${value} is not a breakpoint token (${[...BREAKPOINTS.keys()].join(", ")})`,
      );
  }
}

// ── A5: no literal outside the token file ───────────────────────────────────

const COLOUR_LITERAL =
  /(#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\s*\()/;
const FONT_FAMILY_LITERAL = /font-?[Ff]amily\s*[:=]\s*(.+)/;
const FONT_FAMILY_ALLOWED =
  /^(var\(|inherit|initial|unset|revert|"?\s*var\(|'?\s*var\()/;

const sourceFiles = SOURCE_DIRS.flatMap((dir) => walk(join(ROOT, dir))).filter(
  (f) => SOURCE_EXTENSIONS.test(f),
);

for (const file of sourceFiles) {
  const relative_ = rel(file);
  if (relative_ === TOKEN_FILE) continue;
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

// ── A6: no brand asset committed here ───────────────────────────────────────

for (const dir of ASSET_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const relative_ = rel(file);
    if (ASSET_EXCEPTIONS.some((prefix) => relative_.startsWith(prefix))) continue;
    if (FONT_FILES.test(relative_))
      fail("A6", relative_, "font file committed — fonts are package subpaths");
    if (LOGO_FILES.test(relative_))
      fail("A6", relative_, "logo file committed — logos are package subpaths");
  }
}

// ── Report ──────────────────────────────────────────────────────────────────

console.log(
  `brand check: ${cssFiles.length} stylesheet(s) · ${sourceFiles.length} source file(s) · token file ${TOKEN_FILE}`,
);
for (const message of errors) console.error(`  ERROR TS-017-${message}`);
console.log(errors.length ? `${errors.length} error(s)` : "no errors");
process.exit(errors.length);

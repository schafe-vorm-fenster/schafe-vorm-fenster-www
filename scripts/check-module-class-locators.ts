/**
 * `pnpm check:module-class-locators` — issue 213, DEC-0221.
 *
 * Next 16.4 names a production CSS-module class `<hash>_<local>`; the module's
 * **file name** is gone (vercel/next.js issue 97944, no opt-out). A test selector such
 * as `[class*="price-tag"]` matched under `next dev` and matches nothing in a
 * production build, so `toHaveCount(0)` passes and a loop over the matches
 * checks nothing. This check forbids a `class` attribute selector whose value
 * is the file name of a CSS module. Stable hooks are a `data-*` marker or a
 * role/name; local class names (`kicker`, `chip`) survive the rename and stay
 * allowed, and so does a file name that is also a local class name somewhere.
 *
 * Exit code of `main()`: number of findings (0 = green).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["node_modules", ".next", ".vercel", ".git"]);

function walk(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((name) => {
    if (SKIP.has(name)) return [];
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export interface ModuleNames {
  /** File-name stems of every `*.module.css`. */
  readonly stems: ReadonlySet<string>;
  /** Every class name declared inside any module (these survive in production). */
  readonly locals: ReadonlySet<string>;
}

export function moduleNames(cssFiles: readonly { path: string; css: string }[]): ModuleNames {
  const stems = new Set<string>();
  const locals = new Set<string>();
  for (const { path, css } of cssFiles) {
    stems.add(basename(path).replace(/\.module\.css$/, ""));
    for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) locals.add(m[1]);
  }
  return { stems, locals };
}

/** Module file names that `source` selects through a `[class…=value]` attribute selector. */
export function moduleClassSelectors(source: string, names: ModuleNames): string[] {
  const hits = new Set<string>();
  const forbidden = (value: string) => names.stems.has(value) && !names.locals.has(value);
  for (const m of source.matchAll(/\[\s*class\s*[*^$|~]?=\s*(["']?)([^"'\]\s]+)\1\s*(?:[is]\s*)?\]/g))
    if (forbidden(m[2])) hits.add(m[2]);
  return [...hits];
}

export interface Finding {
  readonly file: string;
  readonly line: number;
  readonly name: string;
}

export function scanSources(
  files: readonly { path: string; text: string }[],
  names: ModuleNames,
): Finding[] {
  const out: Finding[] = [];
  for (const { path, text } of files)
    text.split("\n").forEach((line, i) => {
      for (const name of moduleClassSelectors(line, names)) out.push({ file: path, line: i + 1, name });
    });
  return out;
}

export function checkModuleClassLocators(root: string = ROOT): Finding[] {
  const cssFiles = [...walk(join(root, "src")), ...walk(join(root, "app"))]
    .filter((f) => f.endsWith(".module.css"))
    .map((f) => ({ path: f, css: readFileSync(f, "utf8") }));
  const names = moduleNames(cssFiles);
  const e2eDir = join(root, "e2e");
  const tests = [...walk(e2eDir), ...walk(join(root, "src")), ...walk(join(root, "app"))]
    .filter((f) => /\.tsx?$/.test(f) && (f.startsWith(e2eDir) || /\.(spec|test)\.tsx?$/.test(f)))
    .map((f) => ({ path: relative(root, f), text: readFileSync(f, "utf8") }));
  return scanSources(tests, names);
}

function main(): void {
  const findings = checkModuleClassLocators();
  for (const f of findings)
    console.error(
      `  ERROR issue-213 ${f.file}:${f.line} selects the CSS module "${f.name}" by class — production builds drop the file name; use a data-* hook`,
    );
  console.log(findings.length ? `${findings.length} module class locator(s)` : "no module class locators");
  process.exit(findings.length);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

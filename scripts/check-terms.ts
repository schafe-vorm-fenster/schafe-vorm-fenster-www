/**
 * `pnpm check:terms` — TS-026-A8's single-source wording lint (F-2-43).
 *
 * A8: "The response-time wording exists in exactly one module; a content lint
 * fails on that wording in any content file." Neither half existed.
 *
 * The wording is the two-working-day promise of WEB-F-022 / TS-026 D5, and
 * D5 is unambiguous about why this needs a lint rather than a review: while
 * Q-022 C11 is unanswered the promise is **removed, never softened** — "a
 * vaguer promise is still an unbacked promise". A softened variant is
 * therefore exactly what a human reviewer would wave through and a term list
 * will not. The terms are the ones TS-026-A7 names, plus their English
 * twins, because the site ships both languages and an unbacked promise is
 * unbacked in either.
 *
 * Two rules, from A8's two clauses:
 *
 *  1. **Modules**: the wording may occur in `src/components/response-promise/`
 *     and nowhere else under `src/` or `app/`. That module holds
 *     `RESPONSE_PROMISE_TEXT`, which is `null` until the process is
 *     confirmed; a second module writing the sentence is the single-source
 *     failure A8 describes, whether it is a page, a demo surface or a test
 *     fixture.
 *  2. **Content**: the wording may not occur in any file under `content/`.
 *     No exceptions — that is the clause in full.
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The response-time wording. TS-026-A7 names the first three by hand; the
 * rest are the same promise in the site's other language and in the
 * softenings D5 forbids.
 */
export const RESPONSE_TIME_TERMS: readonly RegExp[] = [
  /Werktag(e|en)?\b/i,
  /48\s*Stunden/i,
  /schnellstm(ö|oe)glich/i,
  /\bworking days?\b/i,
  /\bbusiness days?\b/i,
  /within\s+(24|48)\s+hours/i,
];

/** The one module A8 allows the wording in. */
export const RESPONSE_PROMISE_MODULE = "src/components/response-promise";

const MODULE_ROOTS = ["src", "app"];
const CONTENT_ROOT = "content";
const MODULE_EXTENSIONS = [".ts", ".tsx"];
const SKIP_DIRECTORIES = new Set(["node_modules", ".next", "dist"]);

function walk(directory: string, keep: (file: string) => boolean): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory)) {
    if (SKIP_DIRECTORIES.has(entry)) continue;
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full, keep));
    else if (keep(full)) found.push(full);
  }
  return found;
}

/** Every line of `text` a term matches, as `line number: the matched term`. */
export function termHits(text: string): { line: number; term: string; excerpt: string }[] {
  const hits: { line: number; term: string; excerpt: string }[] = [];
  text.split("\n").forEach((line, index) => {
    for (const term of RESPONSE_TIME_TERMS) {
      const match = term.exec(line);
      if (match) hits.push({ line: index + 1, term: match[0], excerpt: line.trim().slice(0, 90) });
    }
  });
  return hits;
}

export interface TermsResult {
  readonly errors: string[];
  readonly filesScanned: number;
}

export function checkTerms(root: string = ROOT): TermsResult {
  const errors: string[] = [];
  let filesScanned = 0;

  for (const moduleRoot of MODULE_ROOTS) {
    for (const file of walk(join(root, moduleRoot), (candidate) =>
      MODULE_EXTENSIONS.some((extension) => candidate.endsWith(extension)),
    )) {
      filesScanned += 1;
      const rel = relative(root, file);
      if (rel.startsWith(RESPONSE_PROMISE_MODULE)) continue;
      for (const hit of termHits(readFileSync(file, "utf-8")))
        errors.push(
          `A8 ${rel}:${hit.line}: response-time wording "${hit.term}" outside ${RESPONSE_PROMISE_MODULE} — ${hit.excerpt}`,
        );
    }
  }

  for (const file of walk(join(root, CONTENT_ROOT), (candidate) => candidate.endsWith(".md"))) {
    filesScanned += 1;
    const rel = relative(root, file);
    for (const hit of termHits(readFileSync(file, "utf-8")))
      errors.push(
        `A8 ${rel}:${hit.line}: response-time wording "${hit.term}" in a content file — ${hit.excerpt}`,
      );
  }

  return { errors, filesScanned };
}

function main(): void {
  const { errors, filesScanned } = checkTerms();
  console.log(`terms check: ${filesScanned} file(s) scanned for the response-time wording`);
  for (const message of errors) console.error(`  ERROR TS-026-${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();

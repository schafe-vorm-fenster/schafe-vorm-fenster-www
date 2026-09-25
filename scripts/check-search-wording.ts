/**
 * `pnpm check:search-wording` — TS-WEB-0008-A16: no visitor-facing string of a
 * place-search surface names a postcode.
 *
 * DEC-0079 §1: the place search takes a place name, and "no surface of the
 * search — label, placeholder, helper text, submit, page copy — offers, names
 * or explains a postcode". A16 makes that a static check over two places
 * the strings live:
 *
 *  1. **The dictionary** (`src/lib/i18n/dictionary.ts`): every key of
 *     `search` and of `notFound`, in every locale — the module's own label,
 *     placeholder, hint and submit, the typeahead's two rows, the
 *     geolocation control, and the 404 page's body, which carries the search.
 *  2. **The search blocks of the five content artifacts** A16 names — `/`,
 *     `/dein-ort`, `/dein-ort/starten`, `/deine-region` and
 *     `/mitmachen/registrieren` — in both locales. A "search block" is the
 *     slot that binds the page's search module (`SEARCH_SLOTS` below, by slot
 *     id): the check reads that `## …` section, drops its HTML comments (a
 *     `source_note` is not visitor-facing) and scans the rest. A slot that is
 *     missing is an error, so a renamed slot cannot make the check pass by
 *     scanning nothing.
 *
 * **Out of scope, by the criterion itself:** the order flow's scope step
 * (TS-WEB-0025 D3, DEC-0079 §7). `content/pages/dein-kalender/bestellen/**`
 * is a purchase configuration that keeps its postcode entry and is not read
 * here — `OUT_OF_SCOPE` names it so the exemption is visible, not implicit.
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { dictionary } from "../src/lib/i18n/dictionary";
import { LOCALES } from "../src/lib/i18n/locales";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The three words A16 names, plus "ZIP" — the same abstraction in the other language's shorthand. */
export const POSTCODE_TERMS: readonly RegExp[] = [/Postleitzahl/iu, /\bPLZ\b/u, /postcode/iu, /\bZIP\b/iu];

/** The dictionary blocks whose every string is a place-search surface. */
export const DICTIONARY_BLOCKS = ["search", "notFound"] as const;

export interface SearchSlot {
  /** The page directory under `content/pages/`. */
  readonly page: string;
  /** The `<!-- id: … -->` of the slot that binds the page's search module. */
  readonly slot: string;
}

/** The five artifacts A16 names, by the slot that carries their search. */
export const SEARCH_SLOTS: readonly SearchSlot[] = [
  { page: "home", slot: "home-1-search-hero" },
  { page: "dein-ort", slot: "dein-ort-0-state-s0" },
  { page: "dein-ort/starten", slot: "dein-ort-starten-5-search" },
  { page: "deine-region", slot: "deine-region-3-interim" },
  { page: "mitmachen/registrieren", slot: "registrieren-1-ort" },
];

/** DEC-0079 §7: the order flow's scope step keeps its postcode mode and is not a search surface. */
export const OUT_OF_SCOPE = "content/pages/dein-kalender/bestellen";

export interface Hit {
  readonly line: number;
  readonly term: string;
  readonly excerpt: string;
}

/** Every line of `text` a postcode term matches. */
export function postcodeHits(text: string): Hit[] {
  const hits: Hit[] = [];
  text.split("\n").forEach((line, index) => {
    for (const term of POSTCODE_TERMS) {
      const match = term.exec(line);
      if (match) {
        hits.push({ line: index + 1, term: match[0], excerpt: line.trim().slice(0, 90) });
        break;
      }
    }
  });
  return hits;
}

export interface SlotSection {
  /** 1-based line number of the section's `## ` heading. */
  readonly startLine: number;
  /** The section's lines, HTML comments blanked (line numbers preserved). */
  readonly lines: readonly string[];
}

/**
 * The `## …` section that carries `<!-- id: <slot>; … -->`: from its heading
 * to the line before the next `## ` heading, with every HTML comment blanked
 * so a `source_note` or the id line itself cannot trip the scan.
 */
export function slotSection(markdown: string, slotId: string): SlotSection | undefined {
  const lines = markdown.split("\n");
  const marker = new RegExp(`<!--\\s*id:\\s*${slotId.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\s*;`, "u");
  const at = lines.findIndex((line) => marker.test(line));
  if (at < 0) return undefined;

  let start = at;
  while (start > 0 && !lines[start]!.startsWith("## ")) start -= 1;
  let end = at + 1;
  while (end < lines.length && !lines[end]!.startsWith("## ")) end += 1;

  const section = lines.slice(start, end).join("\n").replace(/<!--[\s\S]*?-->/gu, (comment) =>
    comment.replace(/[^\n]/gu, ""),
  );
  return { startLine: start + 1, lines: section.split("\n") };
}

export interface DictionaryString {
  readonly key: string;
  readonly value: string;
}

/** Every string of the scanned dictionary blocks, in every locale. */
export function dictionaryStrings(): DictionaryString[] {
  const strings: DictionaryString[] = [];
  for (const locale of LOCALES) {
    const words = dictionary(locale);
    for (const block of DICTIONARY_BLOCKS) {
      for (const [key, value] of Object.entries(words[block])) {
        if (typeof value === "string") strings.push({ key: `${locale}.${block}.${key}`, value });
      }
    }
  }
  return strings;
}

export interface SearchWordingResult {
  readonly errors: string[];
  readonly stringsScanned: number;
  readonly slotsScanned: number;
}

export interface CheckOptions {
  readonly root?: string;
  readonly strings?: readonly DictionaryString[];
  readonly slots?: readonly SearchSlot[];
}

export function checkSearchWording({
  root = ROOT,
  strings = dictionaryStrings(),
  slots = SEARCH_SLOTS,
}: CheckOptions = {}): SearchWordingResult {
  const errors: string[] = [];

  for (const { key, value } of strings) {
    for (const hit of postcodeHits(value)) {
      errors.push(`dictionary ${key}: names a postcode ("${hit.term}") — ${hit.excerpt}`);
    }
  }

  let slotsScanned = 0;
  for (const { page, slot } of slots) {
    for (const locale of LOCALES) {
      const file = join(root, "content", "pages", page, `${locale}.md`);
      const rel = relative(root, file);
      if (rel.startsWith(OUT_OF_SCOPE)) continue;
      if (!existsSync(file)) {
        errors.push(`${rel}: content artifact missing — the search block of ${page} cannot be checked`);
        continue;
      }
      const section = slotSection(readFileSync(file, "utf-8"), slot);
      if (section === undefined) {
        errors.push(`${rel}: search slot \`${slot}\` not found — the block A16 names cannot be checked`);
        continue;
      }
      slotsScanned += 1;
      for (const hit of postcodeHits(section.lines.join("\n"))) {
        errors.push(
          `${rel}:${section.startLine + hit.line - 1}: search block \`${slot}\` names a postcode ("${hit.term}") — ${hit.excerpt}`,
        );
      }
    }
  }

  return { errors, stringsScanned: strings.length, slotsScanned };
}

function main(): void {
  const { errors, stringsScanned, slotsScanned } = checkSearchWording();
  console.log(
    `search-wording check (TS-WEB-0008-A16): ${stringsScanned} dictionary string(s) · ${slotsScanned} content search block(s) scanned`,
  );
  for (const message of errors) console.error(`  ERROR TS-008-A16 ${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();

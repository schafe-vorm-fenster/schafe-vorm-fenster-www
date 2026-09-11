/**
 * The per-slot metadata comment (TS-007 D4/D6, `state/content-map.md`).
 *
 * The Phase-2 artifacts are one file per page per locale, with one Markdown
 * section per slot and the slot's metadata in an inline HTML comment:
 *
 *     <!-- id: home-1-search-hero; content_type: hero; provenance: sourced;
 *          derived_from: [ia]; status: draft -->
 *
 * That comment carries exactly what a per-slot file's own frontmatter would
 * carry. This module is the only place that knows its syntax; everything
 * above it works on `SlotMeta`. ADR-074 records why the loader reads this
 * shape rather than asking for eleven pages to be rewritten.
 */

import {
  SLOT_CONTENT_TYPE_ALIASES,
  SlotMetaSchema,
} from "@/src/domain/content-frontmatter.schema";

import type { SlotMeta } from "@/src/domain/content-frontmatter.schema";

/**
 * Matches a slot metadata comment and nothing else — an ordinary HTML
 * comment in a content file is a note to the next author, not metadata.
 * Global, because the loader scans a whole file with it.
 */
export const SLOT_META_COMMENT = /<!--\s*id:\s*[\s\S]*?-->/g;

export type SlotMetaResult =
  | { readonly ok: true; readonly meta: SlotMeta & { readonly demo: boolean } }
  | { readonly ok: false; readonly problems: readonly string[] };

const KEYS = ["id", "content_type", "provenance", "derived_from", "status", "demo"];

/**
 * Splits `a: 1; b: [x, y]; c: 3` on the separators that are not inside a
 * bracketed list or a quoted string.
 */
function splitEntries(body: string): string[] {
  const entries: string[] = [];
  let current = "";
  let depth = 0;
  let quote: string | null = null;

  for (const char of body) {
    if (quote) {
      if (char === quote) quote = null;
      current += char;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (char === ";" && depth === 0) {
      entries.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  entries.push(current);
  return entries.map((entry) => entry.trim()).filter(Boolean);
}

function unquote(value: string): string {
  const trimmed = value.trim();
  const quoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));
  return quoted ? trimmed.slice(1, -1) : trimmed;
}

function parseList(value: string): string[] {
  const inner = value.trim().replace(/^\[/, "").replace(/\]$/, "").trim();
  if (inner === "") return [];
  return inner.split(",").map(unquote).filter(Boolean);
}

/** Parses one slot metadata comment. Never throws; an invalid comment is a result. */
export function parseSlotMeta(comment: string): SlotMetaResult {
  const match = /^<!--([\s\S]*?)-->$/.exec(comment.trim());
  if (!match) return { ok: false, problems: ["not a metadata comment"] };

  const problems: string[] = [];
  const raw: Record<string, unknown> = {};

  for (const entry of splitEntries(match[1])) {
    const separator = entry.indexOf(":");
    if (separator === -1) {
      problems.push(`\`${entry}\`: not a \`key: value\` pair`);
      continue;
    }
    const key = entry.slice(0, separator).trim();
    const value = entry.slice(separator + 1).trim();
    if (!KEYS.includes(key)) {
      problems.push(`${key}: unknown key (allowed: ${KEYS.join(", ")})`);
      continue;
    }
    if (key === "derived_from") raw[key] = parseList(value);
    else if (key === "demo") raw[key] = value === "true";
    else if (key === "content_type") {
      const written = unquote(value);
      raw[key] = SLOT_CONTENT_TYPE_ALIASES[written] ?? written;
    } else raw[key] = unquote(value);
  }

  if (raw.demo === undefined) raw.demo = false;

  const parsed = SlotMetaSchema.safeParse(raw);
  if (!parsed.success) {
    problems.push(
      ...parsed.error.issues.map(
        (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
      ),
    );
  }

  if (problems.length > 0) return { ok: false, problems };
  return { ok: true, meta: { ...parsed.data!, demo: parsed.data!.demo ?? false } };
}

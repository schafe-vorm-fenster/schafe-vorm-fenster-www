/**
 * Reads `content/legal/*.md` — the five imported documents plus the
 * generated accessibility statement (TS-029, TS-007 D10).
 *
 * `content/legal/` is still the flat, pre-relaunch tree (`content_type:
 * legal`, `locale: de` only, no `anchor` field on five of the six files —
 * `state/open.md` #8, TS-029 open points #2/#3/#8). TS-007 D10's own import
 * step is not built yet, so this module is this work package's reading of
 * it: map the registry anchor (`src/lib/routes/legal-anchors.ts`, the
 * authoritative TS-004 D8 source) straight to its file, read the frontmatter
 * and body the same way `loadPage` does (`splitFrontmatter`, TS-007's own
 * convention), and hand the page typed blocks via `legal-markdown.ts` — never
 * an HTML string.
 *
 * Never edits `content/legal/**` — read-only, same as `loadPage`.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import * as yaml from "js-yaml";

import { parseLegalMarkdown } from "@/src/lib/content/legal-markdown";

import type { LegalBlock } from "@/src/lib/content/legal-markdown";
import type { LegalSectionId } from "@/src/lib/routes/legal-anchors";

export const LEGAL_CONTENT_ROOT = "content/legal";

/**
 * Registry anchor → its file. `barrierefreiheit` is TS-029 D8's exception:
 * the one anchor without a document until legal counsel clears it
 * (`state/open.md` #21) — its file exists today as a marked draft, and D8
 * fails the *production* build while it does, not this reader.
 */
export const LEGAL_SECTION_FILES: Readonly<Record<LegalSectionId, string>> = {
  imprint: "imprint.md",
  privacy: "privacy-policy.md",
  accessibility: "accessibility.md",
  terms: "terms-of-use.md",
  communityGuidelines: "community-guidelines.md",
  dataProcessing: "dpa.md",
};

export interface LegalDocument {
  readonly id: string;
  readonly status: string;
  readonly provenance?: string;
  readonly reviewRequired?: string;
  readonly blocks: readonly LegalBlock[];
}

/** Splits off the YAML frontmatter block — the same shape `loadPage` reads. */
function splitFrontmatter(raw: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!match) return { frontmatter: {}, body: raw };
  let frontmatter: unknown;
  try {
    frontmatter = yaml.load(match[1]);
  } catch {
    frontmatter = {};
  }
  return {
    frontmatter: (frontmatter && typeof frontmatter === "object" ? frontmatter : {}) as Record<
      string,
      unknown
    >,
    body: raw.slice(match[0].length),
  };
}

const cache = new Map<string, LegalDocument | null>();

/**
 * One legal document by its registry section id. `null` when the file is
 * missing (TS-029 D1: "a registry entry whose document is absent renders
 * nothing"; D8's production-only failure is the build-time gate, not this
 * reader).
 */
export async function loadLegalDocument(
  section: LegalSectionId,
  root: string = join(process.cwd(), LEGAL_CONTENT_ROOT),
): Promise<LegalDocument | null> {
  const cacheKey = `${root}:${section}`;
  if (process.env.NODE_ENV === "production" && cache.has(cacheKey)) {
    return cache.get(cacheKey) ?? null;
  }

  const filename = LEGAL_SECTION_FILES[section];
  let raw: string;
  try {
    raw = await readFile(join(root, filename), "utf-8");
  } catch {
    cache.set(cacheKey, null);
    return null;
  }

  const { frontmatter, body } = splitFrontmatter(raw);
  const blocks = parseLegalMarkdown(body.trim());
  const document: LegalDocument = {
    id: String(frontmatter.id ?? section),
    status: String(frontmatter.status ?? "draft"),
    provenance: frontmatter.provenance ? String(frontmatter.provenance) : undefined,
    reviewRequired: frontmatter.review_required ? String(frontmatter.review_required) : undefined,
    blocks,
  };
  cache.set(cacheKey, document);
  return document;
}

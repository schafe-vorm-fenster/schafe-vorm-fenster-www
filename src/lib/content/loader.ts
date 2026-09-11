/**
 * `loadPage(routeId, locale)` — what a page calls (TS-007 D3, D4).
 *
 * Request time reads the local content tree and nothing else: no hub
 * package, no GTM artefact, no registry (TS-007-A12). That is why this
 * module imports `source-refs.ts` nowhere — resolving a provenance reference
 * is a build-time concern and lives in `scripts/check-content.ts`.
 *
 * Nothing here throws. A missing file, an invalid frontmatter block and an
 * unknown slot id are values with a reason, logged once, so a content gap
 * never takes a route down mid-render. The build-time gate is what refuses:
 * `pnpm check:content` fails on exactly the same conditions.
 *
 * The artifact shape it reads is one file per page per locale
 * (`content/pages/<route>/<locale>.md`) with one section per slot — the shape
 * `state/content-map.md` describes and ADR-074 fixes.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import * as yaml from "js-yaml";

import { PageFrontmatterSchema } from "@/src/domain/content-frontmatter.schema";
import { ctaOf, fieldsOf, parseBlocks } from "@/src/lib/content/blocks";
import { parseSlotMeta, SLOT_META_COMMENT } from "@/src/lib/content/slot-meta";
import { ROUTE_IDS, ROUTES } from "@/src/lib/routes/routes";

import type { SlotContentType } from "@/src/domain/content-frontmatter.schema";
import type { ContentGap, ContentSlot, PageContent } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

/** The content tree, relative to the repository root (TS-007 D4). */
export const CONTENT_ROOT = "content/pages";

/**
 * Which page artifact a route reads.
 *
 * Two routes share a file: `/deine-region/angebot` is specified by TS-026
 * together with `/deine-region`, and its slots (`deine-region-angebot-*`)
 * live in that page's file. `home` has no route segment to name a folder, so
 * it takes its own.
 */
export const CONTENT_PAGE_DIRS: Readonly<Record<RouteId, string>> = Object.freeze(
  Object.fromEntries(
    ROUTE_IDS.map((routeId) => [
      routeId,
      routeId === "home"
        ? "home"
        : routeId === "regionQuote"
          ? "deine-region"
          : ROUTES[routeId].path.de.slice(1),
    ]),
  ) as Record<RouteId, string>,
);

const HEADING = /^#{1,6} +(.+)$/;

const warned = new Set<string>();

/** One line per gap per process — a content hole is reported, never repeated. */
function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[content] ${message}`);
}

function emptySlot(id: string, reason: ContentGap): ContentSlot {
  return {
    id,
    contentType: "section",
    provenance: "unavailable",
    demo: false,
    derivedFrom: [],
    status: "draft",
    body: "",
    blocks: [],
    fields: {},
    empty: true,
    reason,
  };
}

function emptyPage(
  routeId: RouteId,
  locale: Locale,
  file: string,
  reason: ContentGap,
): PageContent {
  return {
    routeId,
    locale,
    specId: ROUTES[routeId].spec,
    file,
    frontmatter: null,
    slots: [],
    invalidSlots: [],
    status: "draft",
    ok: false,
    reason,
  };
}

/** Splits off the YAML frontmatter block. */
function splitFrontmatter(raw: string): { frontmatter: unknown; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!match) return { frontmatter: null, body: raw };
  let frontmatter: unknown = null;
  try {
    frontmatter = yaml.load(match[1]);
  } catch {
    frontmatter = null;
  }
  return { frontmatter, body: raw.slice(match[0].length) };
}

/**
 * Cuts a region of markdown at its last heading: everything from that heading
 * on belongs to the *next* slot, and the heading is that slot's title.
 */
function cutAtLastHeading(region: string): { body: string; title?: string } {
  const lines = region.split("\n");
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const heading = HEADING.exec(lines[index].trim());
    if (heading) {
      return {
        body: lines.slice(0, index).join("\n"),
        title: heading[1].trim(),
      };
    }
  }
  return { body: region };
}

export interface ParsePageOptions {
  readonly routeId: RouteId;
  readonly locale: Locale;
  /** Repository-relative path, for messages. */
  readonly file: string;
}

/**
 * Parses one page artifact. Pure — no filesystem, no network — so the whole
 * pipeline is testable on strings.
 */
export function parsePage(raw: string, options: ParsePageOptions): PageContent {
  const { routeId, locale, file } = options;
  const { frontmatter, body } = splitFrontmatter(raw);

  const parsed = PageFrontmatterSchema.safeParse(frontmatter);
  if (!parsed.success) {
    warnOnce(
      `frontmatter:${file}`,
      `${file}: frontmatter does not validate (TS-007 D5) — the page renders empty`,
    );
    return emptyPage(routeId, locale, file, "page-frontmatter-invalid");
  }

  SLOT_META_COMMENT.lastIndex = 0;
  const comments = [...body.matchAll(SLOT_META_COMMENT)];
  const slots: ContentSlot[] = [];
  const invalidSlots: { problems: readonly string[] }[] = [];

  let pendingTitle: string | undefined;

  for (const [index, comment] of comments.entries()) {
    const start = comment.index;
    const end = start + comment[0].length;
    const title =
      index === 0 ? cutAtLastHeading(body.slice(0, start)).title : pendingTitle;

    const next = comments[index + 1];
    const region = body.slice(end, next ? next.index : body.length);
    const after = next ? cutAtLastHeading(region) : { body: region, title: undefined };
    pendingTitle = after.title;

    const meta = parseSlotMeta(comment[0]);
    if (!meta.ok) {
      warnOnce(
        `slot-meta:${file}:${start}`,
        `${file}: a slot metadata comment does not validate — ${meta.problems.join("; ")}`,
      );
      invalidSlots.push({ problems: meta.problems });
      continue;
    }

    const slotBody = after.body.trim();
    const blocks = parseBlocks(slotBody);
    const cta = ctaOf(blocks);
    slots.push({
      id: meta.meta.id,
      contentType: meta.meta.content_type,
      provenance: meta.meta.provenance,
      demo: meta.meta.demo,
      derivedFrom: meta.meta.derived_from,
      status: meta.meta.status,
      ...(title ? { title } : {}),
      ...(cta ? { cta } : {}),
      body: slotBody,
      blocks,
      fields: fieldsOf(blocks),
      empty: false,
    });
  }

  return {
    routeId,
    locale,
    specId: ROUTES[routeId].spec,
    file,
    frontmatter: parsed.data,
    slots,
    invalidSlots,
    status: parsed.data.status,
    ok: true,
  };
}

export interface LoadPageOptions {
  /**
   * Where the content tree lives. Tests and `check:content` pass it; a page
   * never does.
   */
  readonly contentRoot?: string;
}

const pages = new Map<string, PageContent>();

/** The artifact path of a route in a language, relative to the repository root. */
export function pageFile(routeId: RouteId, locale: Locale): string {
  return `${CONTENT_ROOT}/${CONTENT_PAGE_DIRS[routeId]}/${locale}.md`;
}

/**
 * Loads one page artifact. Never throws and never falls back to another
 * language — DEC-026 forbids showing German copy on an English page as much
 * as it forbids machine translation, so a missing sibling renders empty and
 * `pnpm check:content` fails the commit that caused it.
 *
 * ```tsx
 * const page = await loadPage("place", locale);
 * const hero = slot(page, "dein-ort-1-state-a");
 * <HeroBlock headline={hero.fields["Headline"]} state={slotState(hero)} />
 * ```
 */
export async function loadPage(
  routeId: RouteId,
  locale: Locale,
  options: LoadPageOptions = {},
): Promise<PageContent> {
  const root = options.contentRoot ?? join(process.cwd(), CONTENT_ROOT);
  const file = pageFile(routeId, locale);
  const cacheKey = `${root}:${routeId}:${locale}`;

  const cached = pages.get(cacheKey);
  if (cached && process.env.NODE_ENV === "production") return cached;

  let raw: string;
  try {
    raw = await readFile(
      join(root, CONTENT_PAGE_DIRS[routeId], `${locale}.md`),
      "utf-8",
    );
  } catch {
    warnOnce(
      `missing:${file}`,
      `${file} is missing — the page renders its empty states (TS-007 D11)`,
    );
    return emptyPage(routeId, locale, file, "page-file-missing");
  }

  const page = parsePage(raw, { routeId, locale, file });
  pages.set(cacheKey, page);
  return page;
}

/**
 * One slot by id. An unknown id is a typed empty slot with a reason — the
 * page renders its empty state, the render survives.
 */
export function slot(page: PageContent, id: string): ContentSlot {
  const hit = page.slots.find((candidate) => candidate.id === id);
  if (hit) return hit;
  warnOnce(
    `slot:${page.file}:${id}`,
    `${page.file}: no slot \`${id}\` — the block renders empty`,
  );
  return emptySlot(id, page.ok ? "slot-unknown" : (page.reason ?? "slot-unknown"));
}

/** Every slot of one content type, in file order. */
export function slotsOfType(
  page: PageContent,
  contentType: SlotContentType,
): readonly ContentSlot[] {
  return page.slots.filter((candidate) => candidate.contentType === contentType);
}

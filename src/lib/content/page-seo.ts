/**
 * `pageSeo(route, locale)` — the title and description of one route, read
 * from the page's own content frontmatter (TS-011 D5, TS-021-A11).
 *
 * D5 puts both strings in `seo.title`/`seo.description` of the artifact and
 * forbids deriving either at runtime from body copy or from the `h1`. This
 * module is the whole of that move: `src/lib/routes/metadata.ts` asks here
 * instead of formatting a template, and `app/[lang]/_structured-data.tsx`
 * reaches the same two strings through that module, so the `<title>`, the
 * meta description, the OpenGraph pair and the `WebPage` node cannot drift
 * apart.
 *
 * **Why synchronous, when `loadPage()` is not.** `pageTitle()` is called from
 * inside a render — the breadcrumb node names every ancestor page, and three
 * page bodies use it for a cross-link label. Making the metadata source async
 * would turn those call sites async too, in files a metadata fix does not
 * own. The read is `readFileSync` of the same artifact `loadPage()` reads,
 * memoised per (route, locale), of which there are 24.
 *
 * Nothing here throws, for the same reason nothing in `loader.ts` does: a
 * missing or malformed `seo` block is a `null` with a warning, so a content
 * gap never takes a route down mid-render. `pnpm check:seo-budget`
 * (TS-011-A7) is what refuses the build.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { LifecycleStatusSchema, PageSeoMapSchema } from "@/src/domain/content-frontmatter.schema";
import { CONTENT_PAGE_DIRS, CONTENT_ROOT, splitFrontmatter } from "@/src/lib/content/loader";
import { contentEnvironment, rendersIn } from "@/src/lib/content/lifecycle";
import { ROUTES } from "@/src/lib/routes/routes";

import type { PageSeo } from "@/src/domain/content-frontmatter.schema";
import type { Environment } from "@/src/lib/security/csp";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

export interface PageSeoOptions {
  /** Where the content tree lives. Tests pass it; a page never does. */
  readonly contentRoot?: string;
  /** Which build this is, for TS-007 D11's gate. Defaults to the real one. */
  readonly environment?: Environment;
}

const warned = new Set<string>();

function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[content] ${message}`);
}

/**
 * Reads the `seo` map of one artifact.
 *
 * Only the `seo` block is validated, not the whole frontmatter: a page whose
 * `derived_from` is malformed still has a perfectly good title, and answering
 * with the placeholder instead would put the defect on the indexed surface
 * rather than in the check that owns it.
 */
function readSeoMap(
  file: string,
  raw: string,
  environment: Environment,
): Readonly<Record<string, PageSeo>> | null {
  const { frontmatter } = splitFrontmatter(raw);
  if (frontmatter === null || typeof frontmatter !== "object") return null;

  /**
   * TS-007 D11's editorial gate applies to the head as much as to the body.
   * `loadPage()` drops an artifact whose status this build does not render;
   * without the same check here a production build would serve unreviewed
   * `seo.title`/`seo.description` — and the `WebPage` JSON-LD built from them
   * — on a page whose body the gate has just emptied. The fallback is the
   * same one a missing block gets: the route's navigation name, no
   * description.
   */
  const status = LifecycleStatusSchema.safeParse(
    (frontmatter as Record<string, unknown>).status,
  );
  if (!status.success || !rendersIn(status.data, environment)) {
    warnOnce(
      `seo-gated:${file}`,
      `${file}: \`status: ${String((frontmatter as Record<string, unknown>).status)}\` does not render in this build (TS-007 D11) — the page falls back to its navigation name and emits no description`,
    );
    return null;
  }

  const parsed = PageSeoMapSchema.safeParse(
    (frontmatter as Record<string, unknown>).seo,
  );
  if (!parsed.success) {
    warnOnce(
      `seo:${file}`,
      `${file}: the \`seo\` block does not validate (TS-011 D5) — the page falls back to its navigation name and emits no description`,
    );
    return null;
  }
  return parsed.data;
}

const maps = new Map<string, Readonly<Record<string, PageSeo>> | null>();

/**
 * The title and description of one route in one language, or `null` where the
 * artifact does not carry them.
 *
 * The lookup key is the German route path, the locale-free name the artifact
 * uses for a route in both its language files — see `PageSeoMapSchema`.
 */
export function pageSeo(
  route: RouteId,
  locale: Locale,
  options: PageSeoOptions = {},
): PageSeo | null {
  const root = options.contentRoot ?? join(process.cwd(), CONTENT_ROOT);
  const environment = options.environment ?? contentEnvironment();
  const directory = CONTENT_PAGE_DIRS[route];
  const file = `${CONTENT_ROOT}/${directory}/${locale}.md`;
  const cacheKey = `${root}:${directory}:${locale}:${environment}`;

  // The memo is skipped outside a production build for the reason `loader.ts`
  // skips its own: a content edit has to show up in `next dev` without a
  // restart.
  let map = process.env.NODE_ENV === "production" ? maps.get(cacheKey) : undefined;
  if (map === undefined) {
    let raw: string;
    try {
      raw = readFileSync(join(root, directory, `${locale}.md`), "utf-8");
    } catch {
      warnOnce(`missing:${file}`, `${file} is missing — the page has no title of its own`);
      maps.set(cacheKey, null);
      return null;
    }
    map = readSeoMap(file, raw, environment);
    maps.set(cacheKey, map);
  }
  if (map === null) return null;

  const entry = map[ROUTES[route].path.de];
  if (!entry) {
    warnOnce(
      `seo-route:${file}:${route}`,
      `${file}: no \`seo\` entry for \`${ROUTES[route].path.de}\` (TS-011 D5) — the page falls back to its navigation name and emits no description`,
    );
    return null;
  }
  return entry;
}

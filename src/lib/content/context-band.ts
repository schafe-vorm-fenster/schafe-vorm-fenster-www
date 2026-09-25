/**
 * The context band's entries — job label plus blurb, per locale (TS-WEB-0006 D5
 * with CG-030, DEC-0120).
 *
 * The band is "all four jobs minus this page's focus job", read off the one
 * job registry (`HEADER_JOBS`). What this module adds is the **blurb** under
 * each label: the half-sentence that names audience and content together, so
 * a reader recognises whether the entry is meant for her (review: "zu jedem
 * Link einen Halbsatz … Zielgruppe und Inhalt").
 *
 * Where the blurb comes from, in order:
 *
 *  1. the page's own `context-band` slot — one list item per job, in the
 *     shape every artifact already uses:
 *
 *         - **Termine veröffentlichen:** Du willst … eintragen? → `/mitmachen`
 *
 *     The item is matched to its job by the path after the arrow, resolved
 *     through the route table — never by the label text, which the artifacts
 *     phrase freely ("Wer dahintersteckt" for the `about` job);
 *  2. the registry fallback in the dictionary (`contextBand.blurbs`), for a
 *     page that has no slot or whose slot names no item for the job.
 *
 * Either way the blurb is measured against CG-030 — a **statement** of at
 * most 80 characters, no question mark (CG-005) — and an entry that is not
 * one yet renders `data-demo="true"`: the wording exists, the owner has not
 * written the statement, and the page says so in the markup rather than in
 * a word the visitor reads.
 */

import { dictionary } from "@/src/lib/i18n/dictionary";
import { DEFAULT_LOCALE } from "@/src/lib/i18n/locales";
import { normalisePath, ROUTES } from "@/src/lib/routes/routes";

import type { ContentSlot } from "@/src/lib/content/types";
import type { Locale } from "@/src/lib/i18n/locales";
import type { NavEntry } from "@/src/lib/routes/navigation";
import type { RouteId } from "@/src/lib/routes/routes";

/** CG-030's budget for a context-band entry. */
export const BAND_BLURB_MAX = 80;

/** One rendered entry of the band: the registry's job plus its blurb. */
export interface ContextBandEntry extends NavEntry {
  /** The half-sentence under the label — audience and content together (CG-030). */
  readonly blurb: string;
  /**
   * True while the blurb is not yet a CG-030 statement — the module renders
   * it with `data-demo="true"`, never a word on the page.
   */
  readonly demo: boolean;
}

/**
 * CG-030 as a predicate: a statement, at most 80 characters, and not a
 * question (CG-005 — the band no longer asks rhetorical questions).
 */
export function isBandStatement(blurb: string): boolean {
  const text = blurb.trim();
  return text.length > 0 && text.length <= BAND_BLURB_MAX && !text.includes("?");
}

/**
 * `Label: blurb → \`/path\`` — the list-item shape of every band slot. The
 * bold markers are already gone (`parseBlocks` strips them); the backticks
 * around the path are optional because they are typography, not syntax.
 */
const ITEM = /^(?<label>[^:]+):\s*(?<blurb>.*?)\s*→\s*`?(?<path>\/[^`\s]*)`?\s*$/u;

/**
 * The route a band item points at. The artifacts write the German path in
 * both languages (`/mitmachen` in `home/en.md` too), so the lookup is against
 * the default locale's column of the route table first and the item's own
 * locale second.
 */
function routeOfPath(path: string, locale: Locale): RouteId | undefined {
  const normalised = normalisePath(path);
  const ids = Object.keys(ROUTES) as RouteId[];
  return (
    ids.find((id) => ROUTES[id].path[DEFAULT_LOCALE] === normalised) ??
    ids.find((id) => ROUTES[id].path[locale] === normalised)
  );
}

/**
 * The blurbs a slot carries, by route. Items the regex cannot read and items
 * pointing at no route are skipped, not failed — a band slot's list also
 * carries prose in some artifacts, and a page must render either way.
 */
export function bandBlurbsOf(
  slot: ContentSlot | undefined,
  locale: Locale,
): ReadonlyMap<RouteId, string> {
  const blurbs = new Map<RouteId, string>();
  if (!slot || slot.empty) return blurbs;

  for (const block of slot.blocks) {
    if (block.kind !== "list") continue;
    for (const item of block.items) {
      const match = ITEM.exec(item);
      if (!match?.groups) continue;
      const route = routeOfPath(match.groups.path, locale);
      const blurb = match.groups.blurb.trim();
      if (route && blurb && !blurbs.has(route)) blurbs.set(route, blurb);
    }
  }
  return blurbs;
}

/**
 * The band's entries for a list of jobs: the slot's blurb where the slot has
 * one, the registry's otherwise, each measured against CG-030.
 */
export function bandEntries(
  jobs: readonly NavEntry[],
  locale: Locale,
  slot?: ContentSlot,
): readonly ContextBandEntry[] {
  const fromSlot = bandBlurbsOf(slot, locale);
  const fallback = dictionary(locale).contextBand.blurbs;

  return jobs.map((job) => {
    const blurb = fromSlot.get(job.route) ?? fallback[job.label as keyof typeof fallback] ?? "";
    return { ...job, blurb, demo: !isBandStatement(blurb) };
  });
}

/**
 * The page's image inventory, as a component can use it.
 *
 * `page.images` is the raw frontmatter list (`ImageEntrySchema`); a page never
 * reads it directly, for the same reason it never reads `slot.demo`: whether
 * an image can be shown, whether it has to carry the placeholder badge, and
 * which of the two hero renditions belongs in which media query are decisions
 * that must be made in one place, not eleven.
 *
 * An entry with no file yet — `status: needed`, the shot nobody has taken, the
 * asset whose rights are unverified — returns `undefined`, and the component
 * renders the "Foto gesucht" hatch it already renders today (DEC-068). That
 * is deliberate: a missing image is an honest empty state and, per the design
 * system, an invitation to send one.
 */
import type { ImageEntry } from "@/src/domain/content-frontmatter.schema";

import type { PageContent } from "./types";

/** One image, ready to hand to `media-frame`, `photo-surface` or `hero-block`. */
export interface RenderableImage {
  readonly id: string;
  /** Site-absolute path under `/images/` — this site serves its own images. */
  readonly src: string;
  /**
   * The landscape rendition of a hero, where one exists. `photo-surface`
   * swaps it in at the width where `--ratio-hero` turns landscape.
   */
  readonly wideSrc?: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly ratio: ImageEntry["ratio"];
  /**
   * True for every generated rendition: it stands in for a photograph nobody
   * has taken, so it does not depict what the copy claims and the design
   * system's placeholder badge goes on it (SRC-014 § Photo surface).
   */
  readonly notDepicting: boolean;
  /** The page's one declared LCP image (TS-003 D2) — nothing else is eager. */
  readonly priority: boolean;
  readonly caption?: string;
  /** The rights holder's attribution string, verbatim, where one is required. */
  readonly credit?: string;
  /**
   * What `data-placeholder` carries, so a build can enumerate every image that
   * still has to be replaced (DEC-068 guardrail 1). `undefined` for a real
   * photograph — that one is finished.
   */
  readonly placeholderId?: string;
}

function renderable(entry: ImageEntry): RenderableImage | undefined {
  if (!entry.file || !entry.width || !entry.height) return undefined;
  const generated = entry.provenance === "generated";
  return {
    id: entry.id,
    src: entry.file,
    ...(entry.wide_file ? { wideSrc: entry.wide_file } : {}),
    alt: entry.alt,
    width: entry.width,
    height: entry.height,
    ratio: entry.ratio,
    notDepicting: generated,
    priority: entry.lcp === true,
    ...(entry.caption ? { caption: entry.caption } : {}),
    ...(entry.credit ? { credit: entry.credit } : {}),
    ...(generated ? { placeholderId: `generated:${entry.model ?? "image"}` } : {}),
  };
}

/** One image by its inventory id. `undefined` while the slot has no file. */
export function pageImage(
  page: PageContent,
  id: string,
): RenderableImage | undefined {
  const entry = page.images.find((image) => image.id === id);
  return entry ? renderable(entry) : undefined;
}

/** Every usable image of one slot, in inventory order. */
export function slotImages(page: PageContent, slot: string): RenderableImage[] {
  return page.images
    .filter((image) => image.slot === slot)
    .map(renderable)
    .filter((image): image is RenderableImage => image !== undefined);
}

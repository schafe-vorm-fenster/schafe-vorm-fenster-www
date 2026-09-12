/**
 * The typed shapes the content pipeline hands to a page (TS-007).
 *
 * A page implementer never sees markdown, never sees a YAML key and never
 * sees a file path: `loadPage()` returns this, and the components take it as
 * typed props (`src/components/README.md`). Nothing here throws — a missing
 * page and an unknown slot are values with a reason, because a content gap
 * must not take a route down (TS-007 D11 makes a *production build* fail on a
 * missing approved slot; the renderer stays honest and empty).
 */

import type {
  ImageEntry,
  LifecycleStatus,
  SlotContentType,
  SlotProvenance,
} from "@/src/domain/content-frontmatter.schema";
import type { PageFrontmatter } from "@/src/domain/content-frontmatter.schema";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

/**
 * What a slot's copy comes from, as the page sees it: the five file-level
 * values of TS-007 plus `unavailable`, which is what a slot that could not be
 * read carries. `unavailable` is never written to a content file — it is the
 * loader's honest answer, paired with a `reason`.
 */
export type RenderedProvenance = SlotProvenance | "unavailable";

/** Why a slot or a page is empty. Always set when `empty` is true. */
export type ContentGap =
  | "page-file-missing"
  | "page-frontmatter-invalid"
  | "slot-unknown"
  | "slot-meta-invalid"
  /** TS-007 D11: the status this build does not render (A14). */
  | "page-not-approved"
  | "slot-not-approved";

/**
 * One authored block below a slot's metadata comment.
 *
 * The bodies are markdown, but the page gets structure, not HTML: the four
 * shapes below are everything the eleven page artifacts use, and passing
 * typed values into components beats handing React an HTML string it would
 * have to `dangerouslySetInnerHTML` past the CSP (TS-013).
 */
export type ContentBlock =
  /** `**Label:** value` — the shape almost all authored copy takes. */
  | { readonly kind: "field"; readonly label: string; readonly value: string }
  /** A paragraph of prose: a note, a rationale, an intro line. */
  | { readonly kind: "paragraph"; readonly text: string }
  /** A `-` or `1.` list; `ordered` says which. */
  | { readonly kind: "list"; readonly ordered: boolean; readonly items: readonly string[] }
  /** A pipe table, header row separate. */
  | {
      readonly kind: "table";
      readonly head: readonly string[];
      readonly rows: readonly (readonly string[])[];
    };

/** One content slot of a page — the unit a component renders. */
export interface ContentSlot {
  /** Locale-free slot id (TS-007 D4): the `de` and `en` file share it. */
  readonly id: string;
  readonly contentType: SlotContentType;
  readonly provenance: RenderedProvenance;
  /**
   * Dummy content (plan/guardrails.md): the module renders it with the
   * `Demo-Daten` badge. Use `slotState()` rather than reading this directly.
   */
  readonly demo: boolean;
  /** TS-007 D6 — the update key. `ia` for a copy shell with no source record. */
  readonly derivedFrom: readonly string[];
  readonly status: LifecycleStatus;
  /** The markdown heading the slot stands under, without the `##`. */
  readonly title?: string;
  /** The slot's CTA label, where one of its fields is a CTA. */
  readonly cta?: string;
  /** The slot's raw markdown, metadata comment removed. */
  readonly body: string;
  readonly blocks: readonly ContentBlock[];
  /** `**Label:** value` blocks by label — the fast path for a component. */
  readonly fields: Readonly<Record<string, string>>;
  readonly empty: boolean;
  readonly reason?: ContentGap;
}

/** One page artifact in one language. */
export interface PageContent {
  readonly routeId: RouteId;
  readonly locale: Locale;
  /** The tactical spec the page realises, from the route table (TS-017-A14). */
  readonly specId: string;
  /** Repository-relative path of the artifact this came from. */
  readonly file: string;
  readonly frontmatter: PageFrontmatter | null;
  readonly slots: readonly ContentSlot[];
  /**
   * The page's image inventory, in frontmatter order (`images:`). Empty when
   * the page has no imagery or could not be read — never undefined, so a page
   * can map over it without a guard.
   */
  readonly images: readonly ImageEntry[];
  /**
   * Slot metadata comments the file carries but that do not validate. They
   * are dropped from `slots` so a page renders, and they fail
   * `pnpm check:content` so the commit that wrote one does not.
   */
  readonly invalidSlots: readonly { readonly problems: readonly string[] }[];
  /**
   * Slot ids the editorial gate of TS-007 D11 removed for *this* build. They
   * are absent from `slots`, so a page renders its empty states, and
   * `check:content` reports them against a production build.
   */
  readonly gatedSlots: readonly string[];
  readonly status: LifecycleStatus;
  /** False when the file is missing or its frontmatter does not validate. */
  readonly ok: boolean;
  readonly reason?: ContentGap;
}

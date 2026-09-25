/**
 * The navigation inventory — TS-WEB-0004 D4.
 *
 * Data, not markup: the header and footer components (owned by the component
 * work package) read these lists and resolve every target through `href()`.
 * No component hard-codes a path or a label (TS-WEB-0004 D4, TS-WEB-0001 D5).
 *
 * The four labels are the four **jobs** — they name what a visitor wants to
 * do, never a product (FUN-WEB-0002). The fourth reads "Über uns" / "About
 * us" since DEC-0120 (TS-WEB-0004 D4 as amended): the sender surface is the
 * one label that names the page rather than a job, the carve-out the review
 * asked for (R-home-33, R-ueber-1). The key stays `whyUs` — it is the job
 * id's name in code, and renaming it would touch every manifest for a word
 * no visitor reads.
 *
 * The context band adds a blurb under each label (TS-WEB-0006 D5 with
 * CG-030). The registry entry carries no copy: the blurb comes from the
 * page's own `context-band` slot, and the per-language fallback is
 * `dictionary.contextBand.blurbs`, keyed by `label` — see
 * `src/lib/content/context-band.ts`.
 */

import type { DictionaryKeyOf } from "@/src/lib/i18n/dictionary";
import type { LegalSectionId } from "@/src/lib/routes/legal-anchors";
import type { RouteId } from "@/src/lib/routes/routes";

export interface NavEntry {
  readonly route: RouteId;
  /** Key into `dictionary.nav` — the label is content, the key is code. */
  readonly label: DictionaryKeyOf<"nav">;
}

/** The four job labels of the header, in IA order (TS-WEB-0004 D4). */
export const HEADER_JOBS: readonly NavEntry[] = [
  { route: "place", label: "knowWhatIsOn" },
  { route: "takePart", label: "publishDates" },
  { route: "calendar", label: "yourCalendar" },
  { route: "about", label: "whyUs" },
];

/** The persistent calendar entry beside the job labels (TS-WEB-0004 D4). */
export const HEADER_CALENDAR_ENTRY: NavEntry = {
  route: "place",
  label: "calendarButton",
};

export interface FooterLegalEntry {
  readonly route: RouteId;
  readonly section: LegalSectionId;
  readonly label: DictionaryKeyOf<"footer">;
}

/**
 * The three conventional legal links of the footer (TS-WEB-0004 D4 / A9). They
 * point at their anchors on the one legal page (DEC-0039).
 */
export const FOOTER_LEGAL_LINKS: readonly FooterLegalEntry[] = [
  { route: "legal", section: "imprint", label: "imprint" },
  { route: "legal", section: "privacy", label: "privacy" },
  { route: "legal", section: "accessibility", label: "accessibility" },
];

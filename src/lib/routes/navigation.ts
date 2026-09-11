/**
 * The navigation inventory — TS-004 D4.
 *
 * Data, not markup: the header and footer components (owned by the component
 * work package) read these lists and resolve every target through `href()`.
 * No component hard-codes a path or a label (TS-004 D4, TS-001 D5).
 *
 * The four labels are the four **jobs** — they name what a visitor wants to
 * do, never a product (WEB-F-002).
 */

import type { DictionaryKeyOf } from "@/src/lib/i18n/dictionary";
import type { LegalSectionId } from "@/src/lib/routes/legal-anchors";
import type { RouteId } from "@/src/lib/routes/routes";

export interface NavEntry {
  readonly route: RouteId;
  /** Key into `dictionary.nav` — the label is content, the key is code. */
  readonly label: DictionaryKeyOf<"nav">;
}

/** The four job labels of the header, in IA order (TS-004 D4). */
export const HEADER_JOBS: readonly NavEntry[] = [
  { route: "place", label: "knowWhatIsOn" },
  { route: "takePart", label: "publishDates" },
  { route: "calendar", label: "yourCalendar" },
  { route: "about", label: "whyUs" },
];

/** The persistent calendar entry beside the job labels (TS-004 D4). */
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
 * The three conventional legal links of the footer (TS-004 D4 / A9). They
 * point at their anchors on the one legal page (DEC-039).
 */
export const FOOTER_LEGAL_LINKS: readonly FooterLegalEntry[] = [
  { route: "legal", section: "imprint", label: "imprint" },
  { route: "legal", section: "privacy", label: "privacy" },
  { route: "legal", section: "accessibility", label: "accessibility" },
];

import type { Availability } from "./status-badge/status-badge";
import type { RouteId } from "@/src/lib/routes/routes";

/**
 * The B.2 fragments (`concept/website-content-production.concept.md` §B.2)
 * that the argument blocks of inventory §2.3 share. Fragments are never
 * standalone files and never a component of their own — they are the value
 * shapes the content pipeline (M3) fills and the block components render.
 *
 * One vocabulary, so a block's props read as the content type that feeds it
 * (decision D-2), not as a private shape invented per component.
 */

/** The one mechanism a scene or a publishing path may declare (TS-006 D7). */
export const MECHANISMS = [
  "whatsapp",
  "embed",
  "calendar-connection",
  "website-import",
  "provenance",
] as const;

export type MechanismId = (typeof MECHANISMS)[number];

/** `CheckItem` — the ✓ rows in offer tiers. */
export interface CheckItem {
  readonly text: string;
  readonly emphasis?: boolean;
}

/** `Step` — publishing paths, form flows. */
export interface Step {
  readonly index: number;
  readonly title: string;
  readonly body: string;
  readonly hint?: string;
  readonly statusBadge?: Availability;
}

/** `ComparisonRow` — "Heute / Mit Portalize". */
export interface ComparisonRow {
  readonly today: string;
  readonly withProduct: string;
}

/** Exactly four rows, machine-countable at the type level (TS-024 D4). */
export type FourComparisonRows = readonly [
  ComparisonRow,
  ComparisonRow,
  ComparisonRow,
  ComparisonRow,
];

/** `GeoBadge` — the display label over the geo levels of B.5. */
export interface GeoBadgeFragment {
  readonly level: "place" | "surrounding" | "county" | "region" | "snapshot";
  readonly label: string;
}

/** `Quote` — never rendered when `clearance` is not `cleared`. */
export interface QuoteFragment {
  readonly text: string;
  readonly attribution: string;
  readonly role?: string;
}

/** An internal or external link, the shape every block's own link slot takes. */
export interface FragmentLink {
  readonly label: string;
  readonly to?: RouteId;
  readonly href?: string;
  readonly external?: boolean;
}

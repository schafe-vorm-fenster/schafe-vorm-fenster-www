/**
 * The three tables `/dein-kalender` reads out of its content artifacts, as
 * typed rows — the configuration block's six settings (TS-WEB-0024 D2 block
 * `embed-config`, DEC-0131 §1), the three checks per price tier
 * (TS-WEB-0024 D6, DEC-0131 §3) and the contrast block's two column labels
 * (TS-WEB-0024 D4, DEC-0131 §8).
 *
 * A cell this page *needs* and the artifact does not carry is a content
 * defect, and it is thrown rather than defaulted (DEC-0131 §8): an empty
 * column label renders a bare colon on the page that asks for 480 €, and a
 * misspelled tier id silently drops three check lines. Both fail the build
 * instead.
 *
 * `src/lib/content/blocks.ts` gives a slot its four shapes — field,
 * paragraph, list, table — and stops there: a cell is a string. What a cell
 * *means* is the page's business, and these two mappings are the only place
 * where it is decided, so the page body stays a composition and the rules are
 * unit-testable without a browser.
 */

import type { CheckItem } from "@/src/components/content-fragments";
import type { SettingTag } from "@/src/components/setting-row/setting-row";
import type { PriceTierId } from "@/src/components/price-section/price-section";
import type { ContentBlock } from "@/src/lib/content/types";

/** One row of the configuration block: what the setting decides, and the values it keeps or drops. */
export interface SettingRowContent {
  readonly title: string;
  readonly core: string;
  /** The one concrete case (CG-011); absent where the artifact leaves the cell empty. */
  readonly example?: string;
  readonly tags: readonly SettingTag[];
}

/**
 * A value the calendar leaves out is authored `~~struck~~` — the one
 * strikethrough the design system has (SRC-0014 §Tag, "Excluded"), and the
 * only marking in the artifact that carries meaning rather than emphasis.
 * `parseBlocks` strips `**` and leaves `~~` alone, which is why it can be
 * read here at all.
 */
const EXCLUDED = /^~~(.+)~~$/u;

/** The chip cell — comma-separated values, an excluded one written `~~so~~`. */
export function settingTags(cell: string): SettingTag[] {
  return cell
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value !== "")
    .map((value) => {
      const struck = EXCLUDED.exec(value);
      return struck ? { label: struck[1].trim(), excluded: true } : { label: value };
    });
}

/** The first table of a slot, or `[]` where the slot carries none. */
function firstTable(blocks: readonly ContentBlock[]): readonly (readonly string[])[] {
  const table = blocks.find((block) => block.kind === "table");
  return table && table.kind === "table" ? table.rows : [];
}

/**
 * The configuration block's rows, in artifact order:
 * `| Einstellung | Kernsatz | Beispiel | Chips |`.
 *
 * An empty example or chip cell is absence, not an empty element — the
 * `Zeitraum` row carries neither while the product fact is unconfirmed
 * (review 2026-09-22, "wird geprüft").
 */
export function settingRows(blocks: readonly ContentBlock[]): SettingRowContent[] {
  return firstTable(blocks).flatMap((row) => {
    const title = (row[0] ?? "").trim();
    if (title === "") return [];
    const example = (row[2] ?? "").trim();
    return [
      {
        title,
        core: (row[1] ?? "").trim(),
        ...(example === "" ? {} : { example }),
        tags: settingTags(row[3] ?? ""),
      },
    ];
  });
}

/**
 * The three checks per tier, keyed by offering id:
 * `| Stufe | Häkchen 1 | Häkchen 2 | Häkchen 3 |`.
 *
 * Keyed rather than positional because the tier order is the spec's
 * (TS-WEB-0024 D6/D6a, `PRICE_TIERS`) and must not become re-orderable by
 * editing a content file. A tier the table does not name renders no checks —
 * never a stand-in line — but a `Stufe` cell that names *no* tier throws,
 * because that is a typo, not an absence (DEC-0131 §8).
 *
 * The vocabulary is passed in (`PRICE_TIERS`) rather than imported, so this
 * module stays a parser of strings with no component in its graph.
 */
export function tierChecks(
  blocks: readonly ContentBlock[],
  tiers: readonly PriceTierId[],
): Readonly<Partial<Record<PriceTierId, readonly CheckItem[]>>> {
  const checks: Partial<Record<PriceTierId, readonly CheckItem[]>> = {};
  for (const row of firstTable(blocks)) {
    const id = (row[0] ?? "").trim();
    // A `Stufe` cell that names no tier is a typo, and a typo used to drop
    // that tier's three checks with no error anywhere (DEC-0131 §8).
    if (!isTierId(id, tiers)) {
      throw new Error(
        `dein-kalender: the tier-checks table names "${id}", which is not one of ${tiers.join(", ")}`,
      );
    }
    const items = row
      .slice(1)
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "")
      .map((text) => ({ text }));
    if (items.length > 0) checks[id] = items;
  }
  return checks;
}

function isTierId(value: string, tiers: readonly PriceTierId[]): value is PriceTierId {
  return (tiers as readonly string[]).includes(value);
}

/** The contrast block's two column labels, as the table head writes them. */
export interface ComparisonLabels {
  readonly today: string;
  readonly withCalendar: string;
}

/**
 * The two column labels of the contrast block — the artifact's own table
 * head, read off the content rather than typed in the page.
 *
 * They used to be a constant in `page.tsx`, reading "Mit dem Produkt" over a
 * heading "Heute — und mit dem Produkt". `SRC-0017` CG-039 fails a build on
 * both, `DEC-0106 §2` makes "today" and "with your calendar" a determination
 * rather than a placeholder, and `plan/reviews/2026-09-23/decisions.md` row
 * 10 writes the two German words. The wording is copy (DEC-0083 §1), so it
 * lives in `content/pages/dein-kalender/**` with the four rows it labels —
 * one table, one source.
 *
 * A missing label is thrown, not defaulted: `comparison-table` renders
 * `{todayLabel}: ` and an empty string leaves a bare colon in front of the
 * sentence. Required props moved that hole one file up (DEC-0131 §8); this
 * closes it.
 */
export function comparisonLabels(blocks: readonly ContentBlock[]): ComparisonLabels {
  const table = blocks.find((block) => block.kind === "table");
  const head = table && table.kind === "table" ? table.head : [];
  const today = (head[0] ?? "").trim();
  const withCalendar = (head[1] ?? "").trim();
  if (today === "" || withCalendar === "") {
    throw new Error(
      "dein-kalender: the contrast table needs both column labels in its head — " +
        `got "${today}" / "${withCalendar}"`,
    );
  }
  return { today, withCalendar };
}

/**
 * The two tables `/dein-kalender` reads out of its content artifacts, as
 * typed rows — the configuration block's six settings (TS-WEB-0024 D2 block
 * `embed-config`, DEC-0131 §1) and the three checks per price tier
 * (TS-WEB-0024 D6, DEC-0131 §3).
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
 * never a stand-in line.
 */
export function tierChecks(
  blocks: readonly ContentBlock[],
): Readonly<Partial<Record<PriceTierId, readonly CheckItem[]>>> {
  const checks: Partial<Record<PriceTierId, readonly CheckItem[]>> = {};
  for (const row of firstTable(blocks)) {
    const id = (row[0] ?? "").trim() as PriceTierId;
    const items = row
      .slice(1)
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "")
      .map((text) => ({ text }));
    if (items.length > 0) checks[id] = items;
  }
  return checks;
}

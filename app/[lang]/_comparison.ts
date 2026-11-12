/**
 * The comparison module's content, read off a slot's table (issue 159,
 * DEC-0203). `/dein-kalender` and `/mitmachen` author their pairs the same
 * way — one Markdown table whose head is the two labels and whose rows are
 * the pairs — so both pages read them through this one function.
 *
 * The glyph per pair is the page's, not the artifact's: which icon names a
 * topic is design, not copy (SRC-0014 §Icons), so the page passes its list and
 * the table must have exactly that many rows. A table that does not is a
 * content defect and is thrown rather than padded or cut (DEC-0131 §8): a
 * missing row would render a pair without a sentence, a fifth row a pair
 * without a glyph.
 */

import type { IconName } from "@/src/components/icon/icon";
import type { ComparisonPair } from "@/src/components/comparison-table/comparison-table";
import type { ContentBlock } from "@/src/lib/content/types";

/** The two labels, as the table head writes them. */
export interface ComparisonLabels {
  readonly today: string;
  readonly withCalendar: string;
}

export interface ComparisonContent {
  readonly labels: ComparisonLabels;
  readonly rows: readonly ComparisonPair[];
}

/**
 * The labels and the pairs of a comparison slot.
 *
 * A missing label is thrown, not defaulted: the module renders
 * `{label}: ` for assistive technology, and an empty string leaves a bare
 * colon in front of the sentence (DEC-0131 §8). The labels used to be a
 * constant reading "Mit dem Produkt", which CG-039 fails a build on
 * (DEC-0106 §2).
 */
export function comparisonPairs(
  blocks: readonly ContentBlock[],
  icons: readonly IconName[],
  slotId: string,
): ComparisonContent {
  const table = blocks.find((block) => block.kind === "table");
  if (!table || table.kind !== "table") {
    throw new Error(`${slotId}: the comparison needs a table — none found`);
  }
  const today = (table.head[0] ?? "").trim();
  const withCalendar = (table.head[1] ?? "").trim();
  if (today === "" || withCalendar === "") {
    throw new Error(
      `${slotId}: the comparison table needs both column labels in its head — ` +
        `got "${today}" / "${withCalendar}"`,
    );
  }
  if (table.rows.length !== icons.length) {
    throw new Error(
      `${slotId}: the comparison table has ${table.rows.length} rows, the page draws ${icons.length} pairs`,
    );
  }
  const rows = table.rows.map((row, index) => {
    const pair = { today: (row[0] ?? "").trim(), withProduct: (row[1] ?? "").trim() };
    if (pair.today === "" || pair.withProduct === "") {
      throw new Error(`${slotId}: row ${index + 1} of the comparison table has an empty cell`);
    }
    return { ...pair, icon: icons[index] as IconName };
  });
  return { labels: { today, withCalendar }, rows };
}

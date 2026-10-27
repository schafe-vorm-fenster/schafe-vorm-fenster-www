import { ArchiveFilter } from "@/src/components/archive-filter/archive-filter";
import { ArchiveRow } from "@/src/components/archive-row/archive-row";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";

import { archivePrecision } from "./precision";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";
import { PageFrame } from "../../_page-frame";

import { pageMeta } from "./page.meta";

import type { Metadata } from "next";

/**
 * TS-WEB-0028 — `/ueber-uns/archiv` — the archive.
 *
 * Composition (D1, D2, D7): `h1` (the LCP element, text) → `archive-filter`
 * (client-side, hidden until mounted, D4/D8) → the record, one `h2` per
 * year, `archive-row` ×n, `date` descending → band + closing, merged
 * (`primaryConversion: null`, TS-WEB-0006 D6).
 *
 * **The press page (DEC-0166, Q-0093).** Every media-echo entry is shown as a
 * citation — outlet, date, title, link to the original and, where the entry
 * has one, a quotation marked with its source — because a citation needs no
 * clearance (TS-WEB-0028 D3 as amended). No article photo and no third-party
 * logo: no row gets a preview. The rows are the content artifact's table
 * (`archiv-2-rows-demo`, the name is historical — `provenance: sourced`),
 * which `src/lib/content/media-echo-citations.test.ts` holds against the
 * installed package. Each row carries the entry's id as its anchor, its hub
 * type ids for the filter and localized labels for the badges.
 * `demo` stays derived from `isDemoSlot(rowsDemo)` (state/open.md rows 109,
 * 162).
 */

const ROUTE = "archive" as const;

/** The table's eight columns, in the content artifact's own order. */
interface ArchiveTableRow {
  /** The entry's file stem — its stable id and the row's anchor. */
  readonly id: string;
  readonly title: string;
  /** The hub's type ids, never a label (TS-WEB-0028 D4). */
  readonly types: readonly string[];
  readonly date: string;
  readonly source: string;
  readonly place: string;
  readonly url: string;
  /** A verbatim excerpt from the coverage, or empty. */
  readonly quote: string;
}

/** "—" is the table's spelling of "none". */
function cell(value: string | undefined): string {
  const text = value?.trim() ?? "";
  return text === "—" ? "" : text;
}

/**
 * D4's hub vocabulary is localized labels over stable ids (e.g. "Presse" /
 * `press`). The table carries the ids; the labels come from the dictionary.
 * The chips and the rows' `data-archive-type` both use the ids, so a label
 * with a space ("Social Media") no longer splits into two filter tokens.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadataFor(ROUTE, params);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);

  const heading = slot(page, "archiv-1-heading");
  const rowsDemo = slot(page, "archiv-2-rows-demo");

  // guardrails.md / README: the badge belongs only to the slot the loader
  // itself marks as demo — never to "some rows exist" or a hard-coded prop.
  const demo = isDemoSlot(rowsDemo);

  const table = rowsDemo.blocks.find((block) => block.kind === "table");
  const rows: ArchiveTableRow[] =
    table?.kind === "table"
      ? table.rows.map(([id, title, types, date, source, place, url, quote]) => ({
          id: cell(id),
          title: cell(title),
          types: cell(types)
            .split(",")
            .map((type) => type.trim())
            .filter(Boolean),
          date: cell(date),
          source: cell(source),
          place: cell(place),
          url: cell(url),
          quote: cell(quote),
        }))
      : [];
  const typeLabels = dictionary(locale).archiveRow.types;
  const labelOf = (type: string) => typeLabels[type] ?? type;

  // D2: `date` descending, already the content artifact's own order; ties
  // break by id ascending — irrelevant here, every demo row has a distinct
  // date. D7: one `h2` per year.
  const byYear = new Map<string, ArchiveTableRow[]>();
  for (const row of rows) {
    const year = row.date.slice(0, 4) || "—";
    byYear.set(year, [...(byYear.get(year) ?? []), row]);
  }

  // D4: only types with ≥ 1 row get a chip; an entry with two types counts
  // under both.
  const typesPresent = [...new Set(rows.flatMap((row) => row.types))];
  const filterTypes = typesPresent.map((id) => ({ id, label: labelOf(id) }));

  /**
   * One `ItemList`, byte-identical before and after filtering — the filter is
   * client-side over already-rendered rows and never touches it (D9,
   * TS-WEB-0028-A10). It now travels inside the page's **one** JSON-LD graph
   * rather than a second `<script>`, which is TS-WEB-0011 D4's own rule.
   */
  const itemList = {
    "@type": "ItemList",
    itemListElement: rows.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: row.title,
        datePublished: row.date,
        publisher: { "@type": "Organization", name: row.source },
        // D9: the original, verbatim from the entry's own `url` field —
        // falling back to the site itself only where the entry carries none.
        url: row.url || SITE_ORIGIN,
      },
    })),
  };

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} nodes={[itemList]} route={ROUTE} />
    <PageFrame closing={{ variant: "merged" }} locale={locale} meta={pageMeta}>
      <SectionShell labelledBy="archiv-h1" surface="paper">
        <MotionReveal>
          <h1 id="archiv-h1">{fieldAt(heading.blocks, 0) ?? dictionary(locale).pages.archive}</h1>

          <ArchiveFilter locale={locale} types={filterTypes}>
            {[...byYear.entries()].map(([year, yearRows]) => (
              // One year is one block of the list's stack, and a stack of its
              // own: the heading, then its rows as one block — rows are divided
              // by their hairline, never by a gap (SRC-0014 §Shape and Space).
              // The heading stands `--block-gap` above its rows and the year
              // before it ends a row's padding plus `--block-gap` higher, so it
              // reads with the entries it names (issue 108, DEC-0171). The
              // filter hides a year block with no visible row, heading
              // included (D7, A19, issue 107).
              <div data-archive-year={year} data-stack="" key={year}>
                <h2>{year}</h2>
                <div>
                  {yearRows.map((row) => (
                    <ArchiveRow
                      // The place only. The outlet is the row's own `outlet`
                      // prop, and passing it here too printed the name twice
                      // in two adjacent lines ("Nordkurier" / "Nordkurier ·
                      // Mecklenburg-Vorpommern") on all 31 rows.
                      contextLine={row.place}
                      date={row.date}
                      demo={demo}
                      // TS-WEB-0028-A14/R-2: the outlet's own `url`, verbatim — a
                      // missing one ("—") leaves the row without a link rather
                      // than pointing at nothing.
                      href={row.url || undefined}
                      id={row.id || undefined}
                      key={row.id || `${row.title}-${row.date}`}
                      locale={locale}
                      outlet={row.source}
                      // The entries carry `YYYY`, `YYYY-MM` and `YYYY-MM-DD`
                      // alike. Rendered at the component's `day` default, a
                      // month-precision entry dated itself "01. August 2026" —
                      // a day no source states, on two thirds of the list.
                      precision={archivePrecision(row.date)}
                      quote={row.quote || undefined}
                      title={row.title}
                      typeIds={row.types}
                      types={row.types.map(labelOf)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </ArchiveFilter>
        </MotionReveal>
      </SectionShell>

    </PageFrame>
    </>
  );
}

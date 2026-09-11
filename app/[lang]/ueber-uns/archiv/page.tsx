import { ArchiveFilter } from "@/src/components/archive-filter/archive-filter";
import { ArchiveRow } from "@/src/components/archive-row/archive-row";
import { DemoDataBadge } from "@/src/components/demo-data-badge/demo-data-badge";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { pageMetadata } from "@/src/lib/routes/metadata";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";

import { pageContent } from "../../_content";
import { localeFrom } from "../../_locale";
import { PageFrame } from "../../_page-frame";

import { pageMeta } from "./page.meta";

import type { Metadata } from "next";

/**
 * TS-028 — `/ueber-uns/archiv` — the archive.
 *
 * Composition (D1, D2, D7): `h1` (the LCP element, text) → `archive-filter`
 * (client-side, hidden until mounted, D4/D8) → the record, one `h2` per
 * year, `archive-row` ×n, `date` descending → band + closing, merged
 * (`primaryConversion: null`, TS-006 D6).
 *
 * [ASSUMPTION, per plan/guardrails.md] `Q-045`: 0 of 32 media-echo entries
 * carry `usage_rights` today, so the real list (`archiv-2-rows`) renders
 * zero rows (D3, WEB-F-033 — exactly the honest behaviour the mock rule
 * exists for). The content artifact's own dummy-content addition
 * (`archiv-2-rows-demo`, `provenance: generated`, `demo: true`) fills the
 * page per `state/open.md` #1/#52 — six clearly labelled example rows, none
 * a real press or award mention. `ArchiveRow` gained an additive `demo`
 * prop (`src/components/archive-row/archive-row.tsx`, separate pathspec
 * commit) so every demo row carries `data-demo="true"`, plus one
 * `demo-data-badge` for the whole record (README: "the module owns the
 * marking, not the row").
 */

const ROUTE = "archive" as const;

/** The demo table's five columns, in the content artifact's own order. */
interface DemoRow {
  readonly title: string;
  readonly type: string;
  readonly date: string;
  readonly source: string;
  readonly place: string;
}

/**
 * D4's hub vocabulary is localized labels over stable ids (e.g. "Presse" /
 * `press`), but `archive-row` takes one `types` prop for both the visible
 * badge text and the `data-archive-type` filter attribute
 * (`src/components/archive-row/archive-row.tsx`) — there is no separate id
 * slot. A chip's id therefore has to be the same label string the row
 * carries (below), or `archive-filter`'s `matchesSelection` never matches
 * anything. Separating "id" from "label" would need another additive prop
 * on `archive-row`, which this page does not decide alone; `state/open.md`
 * carries the finding.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadata(ROUTE, resolveLocale((await params).lang));
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

  const table = rowsDemo.blocks.find((block) => block.kind === "table");
  const rows: DemoRow[] =
    table?.kind === "table"
      ? table.rows.map(([title, type, date, source, place]) => ({
          title: title ?? "",
          type: type ?? "",
          date: date ?? "",
          source: source ?? "",
          place: place ?? "",
        }))
      : [];

  // D2: `date` descending, already the content artifact's own order; ties
  // break by id ascending — irrelevant here, every demo row has a distinct
  // date. D7: one `h2` per year.
  const byYear = new Map<string, DemoRow[]>();
  for (const row of rows) {
    const year = row.date.slice(0, 4) || "—";
    byYear.set(year, [...(byYear.get(year) ?? []), row]);
  }

  // D4: only types with ≥ 1 row get a chip. `id` equals `label`: see the
  // note on `TYPE_IDS` above for why.
  const typesPresent = [...new Set(rows.map((row) => row.type))];
  const filterTypes = typesPresent.map((label) => ({ id: label, label }));

  return (
    <PageFrame closing={{ variant: "merged" }} locale={locale} meta={pageMeta}>
      <SectionShell labelledBy="archiv-h1" surface="paper">
        <MotionReveal>
          <h1 id="archiv-h1">{fieldAt(heading.blocks, 0) ?? "Archiv"}</h1>
          {rows.length > 0 ? <DemoDataBadge /> : null}

          <ArchiveFilter types={filterTypes}>
            {[...byYear.entries()].map(([year, yearRows]) => (
              <div key={year}>
                <h2>{year}</h2>
                {yearRows.map((row) => (
                  <ArchiveRow
                    contextLine={`${row.source} · ${row.place}`}
                    date={row.date}
                    demo
                    key={`${row.title}-${row.date}`}
                    outlet={row.source}
                    title={row.title}
                    types={[row.type]}
                  />
                ))}
              </div>
            ))}
          </ArchiveFilter>
        </MotionReveal>
      </SectionShell>

      {/* JSON-LD: one `ItemList`, byte-identical before and after filtering —
          the filter is client-side over already-rendered rows and never
          touches this static script (D9, TS-028-A10). */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: rows.map((row, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "CreativeWork",
                name: row.title,
                datePublished: row.date,
                publisher: { "@type": "Organization", name: row.source },
                url: SITE_ORIGIN,
              },
            })),
          }),
        }}
        type="application/ld+json"
      />
    </PageFrame>
  );
}

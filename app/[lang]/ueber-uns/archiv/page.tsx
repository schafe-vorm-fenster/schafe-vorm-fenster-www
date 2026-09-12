import { ArchiveFilter } from "@/src/components/archive-filter/archive-filter";
import { ArchiveRow } from "@/src/components/archive-row/archive-row";
import { DemoDataBadge } from "@/src/components/demo-data-badge/demo-data-badge";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { isDemoSlot } from "@/src/lib/content/provenance";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";
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
 * [ASSUMPTION, per plan/guardrails.md] `Q-045`: 0 of 31 media-echo entries
 * carry `usage_rights` today, so the real list (`archiv-2-rows`) renders
 * zero rows (D3, WEB-F-033 — exactly the honest behaviour the mock rule
 * exists for). The content follow-up's second pass (2026-09-12, state/open.md
 * row 52) replaced the six invented demo rows with all 31 real media-echo
 * entries, verbatim from the package frontmatter — `archiv-2-rows-demo`
 * carries `provenance: sourced`, not `generated`, and no `demo: true`. Every
 * row's `demo` prop and the page-level `demo-data-badge` are therefore
 * derived from `isDemoSlot(rowsDemo)`, not hard-coded (state/open.md row 109,
 * row 162): they render only if a future pass ever puts genuinely generated
 * rows back in this slot. Clearance itself stays open — 0 of the 31 entries
 * carry `usage_rights`, recorded as `open_points[]` in the page frontmatter,
 * not as a badge (guardrails: the badge marks *generated* content, not
 * *clearance-pending* content). TS-028-A14/R-2: each row's own `url` field
 * is now wired to `ArchiveRow`'s outbound link, since the meta description
 * already promises "jede Zeile verlinkt auf die Originalquelle".
 */

const ROUTE = "archive" as const;

/** The table's six columns, in the content artifact's own order. */
interface ArchiveTableRow {
  readonly title: string;
  readonly type: string;
  readonly date: string;
  readonly source: string;
  readonly place: string;
  readonly url: string;
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
      ? table.rows.map(([title, type, date, source, place, url]) => ({
          title: title ?? "",
          type: type ?? "",
          date: date ?? "",
          source: source ?? "",
          place: place ?? "",
          url: url ?? "",
        }))
      : [];

  // D2: `date` descending, already the content artifact's own order; ties
  // break by id ascending — irrelevant here, every demo row has a distinct
  // date. D7: one `h2` per year.
  const byYear = new Map<string, ArchiveTableRow[]>();
  for (const row of rows) {
    const year = row.date.slice(0, 4) || "—";
    byYear.set(year, [...(byYear.get(year) ?? []), row]);
  }

  // D4: only types with ≥ 1 row get a chip. `id` equals `label`: see the
  // note on `TYPE_IDS` above for why.
  const typesPresent = [...new Set(rows.map((row) => row.type))];
  const filterTypes = typesPresent.map((label) => ({ id: label, label }));

  /**
   * One `ItemList`, byte-identical before and after filtering — the filter is
   * client-side over already-rendered rows and never touches it (D9,
   * TS-028-A10). It now travels inside the page's **one** JSON-LD graph
   * rather than a second `<script>`, which is TS-011 D4's own rule.
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
        url: row.url && row.url !== "—" ? row.url : SITE_ORIGIN,
      },
    })),
  };

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} nodes={[itemList]} route={ROUTE} />
    <PageFrame closing={{ variant: "merged" }} locale={locale} meta={pageMeta}>
      <SectionShell labelledBy="archiv-h1" surface="paper">
        <MotionReveal>
          <h1 id="archiv-h1">{fieldAt(heading.blocks, 0) ?? "Archiv"}</h1>
          {/* F-2-33: the badge takes the page's language, or it reads
              "Demo-Daten" on `/en/about/archive`. Rendered only when the slot
              itself is demo (state/open.md row 109/row 162) — today it is not: all
              31 rows are real, sourced media-echo entries. */}
          {demo ? <DemoDataBadge locale={locale} /> : null}

          <ArchiveFilter locale={locale} types={filterTypes}>
            {[...byYear.entries()].map(([year, yearRows]) => (
              <div key={year}>
                <h2>{year}</h2>
                {yearRows.map((row) => (
                  <ArchiveRow
                    contextLine={`${row.source} · ${row.place}`}
                    date={row.date}
                    demo={demo}
                    // TS-028-A14/R-2: the outlet's own `url`, verbatim — a
                    // missing one ("—") leaves the row without a link rather
                    // than pointing at nothing.
                    href={row.url && row.url !== "—" ? row.url : undefined}
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

    </PageFrame>
    </>
  );
}

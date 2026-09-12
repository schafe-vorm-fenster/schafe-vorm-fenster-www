import { LegalSection } from "@/src/components/legal-section/legal-section";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { renderLegalBlocks } from "@/src/components/legal-section/render-legal-blocks";
import { SectionNav } from "@/src/components/section-nav/section-nav";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { shiftHeadings } from "@/src/lib/content/legal-markdown";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { slot } from "@/src/lib/content/loader";
import { legalAnchor, LEGAL_SECTION_IDS } from "@/src/lib/routes/legal-anchors";

import { PageJsonLd } from "../_structured-data";
import { legalDocument, pageContent } from "../_content";
import { localeFrom, pageMetadataFor } from "../_locale";
import { PageFrame } from "../_page-frame";

import styles from "./page.module.css";
import { pageMeta } from "./page.meta";

import type { ContentBlock } from "@/src/lib/content/types";
import type { LegalSectionId } from "@/src/lib/routes/legal-anchors";
import type { Metadata } from "next";

/**
 * TS-029 — `/rechtliches` (EN `/legal`) — the one legal page.
 *
 * D1: one section per `LEGAL_SECTION_IDS` registry entry, in registry
 * order — appending a document to `content/legal/` plus its registry entry
 * is the only way a section appears; a missing document renders nothing,
 * the anchor stays reserved (`legal-section`'s own contract). D2: the `id`
 * is the registry anchor, never derived from the imported heading. D3/D4:
 * landing and scroll-margin come from `--site-header-height`
 * (`legal-section.module.css`, already built) — nothing extra to wire here.
 * D6: `h1` once, `h2` per section (this component's `title` prop), `h3`+ the
 * imported document's own structure, shifted by `shiftHeadings(…, 2)` so the
 * document's own top-level heading demotes instead of duplicating the
 * section's `h2` (never rendered twice).
 *
 * D8: `#barrierefreiheit` is the one registry anchor with no document today
 * (TS-004 D8: "to be written", `state/open.md` #21) — the production build
 * fails while it is missing; a preview build omits it.
 */

const ROUTE = "legal" as const;

/** DE/EN section display titles, read from the content artifact's own
 * registry table (`rechtliches-2-registry`) rather than typed here — the
 * table's `Anker`/`Anchor` column carries the anchor as inline code
 * (`` `#impressum` ``), which the page's typed-block reader does not strip. */
function titlesFromRegistryTable(blocks: readonly ContentBlock[]): ReadonlyMap<string, string> {
  const table = blocks.find((block) => block.kind === "table");
  const titles = new Map<string, string>();
  if (table?.kind !== "table") return titles;
  for (const [anchorCell, name] of table.rows) {
    const anchor = anchorCell?.replace(/`/g, "").replace(/^#/, "").trim();
    if (anchor && name) titles.set(anchor, name);
  }
  return titles;
}

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

  const [page, ...documents] = await Promise.all([
    pageContent(ROUTE, locale),
    ...LEGAL_SECTION_IDS.map((section) => legalDocument(section)),
  ]);

  const header = slot(page, "rechtliches-1-header");
  const registry = slot(page, "rechtliches-2-registry");
  const titles = titlesFromRegistryTable(registry.blocks);

  const d = dictionary(locale);
  // F-2-4's class, in the one file this round already edits: a German literal
  // as the fallback renders German on `/en/legal` the moment the artifact is
  // missing its header slot. The dictionary has both languages.
  const h1 = fieldAt(header.blocks, 0) ?? d.pages.legal;
  const navLabel = fieldAt(header.blocks, 1) ?? d.legal.sectionsLabel;
  const { germanOnlyNotice } = d.legal;

  const docsBySection = new Map(
    LEGAL_SECTION_IDS.map((section, index) => [section, documents[index]]),
  );

  // D8: the accessibility statement is the one release-blocking exception —
  // production fails while it is missing; preview/dev renders the page
  // without that section, exactly like any other registry entry with no
  // document (TS-029-A11).
  if (process.env.VERCEL_ENV === "production" && !docsBySection.get("accessibility")) {
    throw new Error(
      "TS-029 D8: #barrierefreiheit/#accessibility has no document — the production build must not ship the legal page without it (state/open.md #21).",
    );
  }

  const navItems = LEGAL_SECTION_IDS.map((section) => ({
    id: legalAnchor(section, locale),
    label: titles.get(legalAnchor(section, locale)) ?? section,
  }));

  return (
    <>
      {/* TS-011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
    <PageFrame backToTop closing={{ variant: "merged" }} locale={locale} meta={pageMeta}>
      {/* One section, not two: `PageFrame`'s merged closing block is
          `paper` (`app/[lang]/_page-frame.tsx`), and the page-rhythm rule
          (`src/components/section-shell/rhythm.ts`) forbids more than two
          consecutive sections of one colour family — an `h1` section plus a
          nav+article section plus the closing block would be three `paper`
          sections in a row. */}
      <SectionShell labelledBy="rechtliches-h1" surface="paper">
        <MotionReveal>
          <h1 id="rechtliches-h1">{h1}</h1>
          {/* F-2-74 / `state/open.md` row 53 — the six sections are imported
              German-only (TS-029 open point #2), so the EN page frame says
              so, in English, *before* the first German body: between the `h1`
              and the section navigation, server-rendered, no JavaScript. The
              German page has no such string in the dictionary and renders
              nothing here. */}
          {germanOnlyNotice ? (
            <p className={styles.germanOnly}>{germanOnlyNotice}</p>
          ) : null}
          <div className={styles.layout}>
            <SectionNav items={navItems} label={navLabel} />
            <article className={styles.sections}>
              {LEGAL_SECTION_IDS.map((section: LegalSectionId) => {
                const document = docsBySection.get(section);
                return (
                  <LegalSection
                    body={document ? renderLegalBlocks(shiftHeadings(document.blocks, 2)) : undefined}
                    key={section}
                    locale={locale}
                    section={section}
                    title={navItems.find((item) => item.id === legalAnchor(section, locale))?.label ?? section}
                  />
                );
              })}
            </article>
          </div>
        </MotionReveal>
      </SectionShell>
    </PageFrame>
    </>
  );
}

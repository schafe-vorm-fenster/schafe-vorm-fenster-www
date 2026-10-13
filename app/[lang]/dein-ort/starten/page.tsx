import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { pageImage } from "@/src/lib/content/images";
import { slot } from "@/src/lib/content/loader";
import { DEMO_PLACE } from "@/src/lib/pages/demo-data";

import { PageJsonLd } from "../../_structured-data";
import { pageContent } from "../../_content";
import { localeFrom, pageMetadataFor } from "../../_locale";
import { PageFrame } from "../../_page-frame";
import { PLACE_START_META } from "./page.meta";
import { StartClosing, StartExample, StartHero, StartHop, StartWhatItTakes, type StartCopy } from "./start-islands";

import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-WEB-0021 — `/dein-ort/starten` — the founding offer.
 *
 * The page a visitor reaches when the place search finds **no place at all**.
 * Blocks per TS-WEB-0021 D2: the acknowledgment with the place's name and the
 * page's only primary treatment · what it takes (WhatsApp) · the live
 * example · who usually starts it · search again · context band · closing
 * CTA, the last two from `page.meta.ts` through `PageFrame`. The breadcrumb
 * trail above block 1 is DEC-0071's, and the frame renders it because
 * `placeStart` has a parent in the route table.
 *
 * **The place is a query parameter and nothing else** (D4). `?ort=` is raw
 * user input: `readPlaceParameter` decides whether it may be echoed at all,
 * and a value that fails the grammar is *dropped* — the placeless variant
 * renders, never an error page (A3, A5). Where the value stands is fixed by
 * D6: the `h1` and body copy, the CTA labels, and the `?ort=` value on the
 * registration link. It appears in **no** module heading, no row, no
 * counter, no `app.*` link, and — because `pageMetadata` is parameter-free
 * by construction — in no title, description, `og:*`, canonical or JSON-LD.
 *
 * **The tone is D9's.** The resident who searched and found nothing is on a
 * publishing page she did not ask for: the page never tells *her* to
 * publish, it names who usually starts it and lets her recognise someone.
 * `/dein-ort` state B's "du könntest die Erste sein" belongs there and is
 * absent here, by construction — the two artifacts share no copy string.
 *
 * **The shell is static and the value is read in the browser** (DEC-0163,
 * which supersedes D10's server-resolved parameter and A2's JavaScript-less
 * echo). The HTML is the placeless variant; `start-islands.tsx` echoes the
 * validated value into the `h1`, the body copy, the CTA labels and the
 * registration link's query after hydration, and hops a covered value to
 * `/dein-ort` (the proxy does that before any HTML for a direct request).
 *
 * **Page rhythm:** PHOTO hero · lime-500 · ink (the live example, the one
 * dark section) · paper · lime-100 · surface · paper.
 */

const ROUTE = "placeStart" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  // Parameter-free by construction (TS-WEB-0011 D5): no runtime value reaches the
  // indexed surface, which is what makes D6's leak impossible rather than
  // merely unlikely.
  return pageMetadataFor(ROUTE, params);
}

/**
 * Fallback only. `dein-ort-starten-5-search` now carries the search hint
 * (state/open.md row 94, row 161) and `dein-ort-starten-6-cta` carries its
 * own placeless CTA label, both read below; `genericPlace` remains
 * generated for the *other* templates that still interpolate a generic
 * place word (the "what it takes" opener, the live-example note) — the
 * artifact authors no dedicated placeless sentence for those two. The search
 * field's label, placeholder and hint have no page-level fallback: where the
 * slot carries no field, `place-search` falls through to the dictionary's
 * `search` block, the one place TS-WEB-0008-A16 keeps under check (DEC-0079 §1).
 */
const PAGE_COPY: Record<Locale, { genericPlace: string }> = {
  de: { genericPlace: "deinen Ort" },
  en: { genericPlace: "your place" },
};

/** The label before the `→ /route` the artifact appends to its CTA fields. */
function labelOf(field: string | undefined): string {
  return (field ?? "").split("→")[0]?.trim() ?? "";
}

export default async function PlaceStartPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  const heroImage = pageImage(page, "dein-ort-starten-hero");
  const words = PAGE_COPY[locale];

  const ack = slot(page, "dein-ort-starten-1-ack");
  const whatItTakes = slot(page, "dein-ort-starten-2-was-es-braucht");
  const example = slot(page, "dein-ort-starten-3-beispiel");
  const whoStarts = slot(page, "dein-ort-starten-4-wer");
  const searchAgainSlot = slot(page, "dein-ort-starten-5-search");
  const closing = slot(page, "dein-ort-starten-6-cta");

  /**
   * Both variants of every place-bearing string — the artifact writes them,
   * so the placeless one is authored copy, not a blank. Which one renders is
   * decided in the browser (`start-islands.tsx`); the HTML is the placeless
   * one. The DE artifact names the slot `{ort}`, the EN one `{place}`.
   */
  const copy: StartCopy = {
    locale,
    headlineWithPlace: fieldAt(ack.blocks, 0) ?? "",
    headlinePlaceless: fieldAt(ack.blocks, 1) ?? "",
    ctaTemplate: labelOf(closing.cta ?? fieldAt(closing.blocks, 0)),
    ctaPlaceless: labelOf(fieldAt(closing.blocks, 1)),
    closingHeadingTemplate: labelOf(fieldAt(closing.blocks, 2)),
    // Sourced: `price.note` of `community-calendar`, the same public
    // commitment slot 2 cites.
    closingReassurance: fieldAt(closing.blocks, 3),
    openerTemplate: fieldAt(whatItTakes.blocks, 0) ?? "",
    openerBody: fieldAt(whatItTakes.blocks, 1),
    exampleTitleTemplate: fieldAt(example.blocks, 0) ?? "",
    genericPlace: words.genericPlace,
    demoPlace: DEMO_PLACE.name[locale],
  };

  /**
   * The mistyped-search field — a quiet line under the closing CTA (polish
   * brief, page 3, fix 3): still there for the visitor who needs it, no
   * longer the last argument the page makes.
   */
  const searchAgain = (
    <div id="search-again">
      <p>{fieldAt(searchAgainSlot.blocks, 0)}</p>
      <PlaceSearch
        typeahead
        hint={fieldAt(searchAgainSlot.blocks, 2)}
        id="ort-suche-nochmal"
        label={fieldAt(searchAgainSlot.blocks, 1)}
        locale={locale}
        placeholder={fieldAt(searchAgainSlot.blocks, 1)}
        to="place"
      />
    </div>
  );

  return (
    <>
      {/* TS-WEB-0011 D4 — one JSON-LD graph per page, server-rendered. */}
      <PageJsonLd locale={locale} route={ROUTE} />
      <StartHop locale={locale} />
    <PageFrame
      closing={{ variant: "module", bare: true, node: <StartClosing copy={copy} footer={searchAgain} /> }}
      contextBandHeading={fieldAt(slot(page, "dein-ort-starten-7-context-band").blocks, 0)}
      locale={locale}
      meta={PLACE_START_META}
    >
      {/* Block 1 — the acknowledgment, with the page's only primary
          treatment. No lead: G-1 moves the hero's second sentence into the
          hand-off of the section that answers it (`what-it-takes`). */}
      <StartHero
        copy={copy}
        image={{
          src: heroImage?.src,
          wideSrc: heroImage?.wideSrc,
          focal: heroImage?.focal,
          notDepicting: heroImage?.notDepicting,
          placeholderId: heroImage?.placeholderId,
        }}
      />

      {/* Block 2.1 — what it takes. One mechanism: WhatsApp (D2). */}
      <MotionReveal>
        <SectionShell
          id="what-it-takes"
          kicker={fieldAt(whatItTakes.blocks, 2)}
          surface="lime-500"
          transition={fieldAt(ack.blocks, 2)}
        >
          <StartWhatItTakes copy={copy} />
        </SectionShell>
      </MotionReveal>

      {/* Block 2.2 — the live example, headed as an example and never as
          "your place" (D6, A4). */}
      <MotionReveal>
        <SectionShell id="live-example" kicker={fieldAt(example.blocks, 1)} surface="ink">
          <StartExample copy={copy} />
        </SectionShell>
      </MotionReveal>

      {/* Block 2.3 — who usually starts it. Not a `scene-block`: D2's own
          table writes "— the scene" in its mechanism column, and it is not a
          role switcher (TS-WEB-0006 D8): it names who it usually is and lets
          the reader recognise someone (D9). */}
      <MotionReveal>
        <SectionShell
          id="who-starts-it"
          kicker={fieldAt(whoStarts.blocks, 2)}
          labelledBy="who-starts-it-heading"
          surface="lime-100"
        >
          <h2 id="who-starts-it-heading">{fieldAt(whoStarts.blocks, 0)}</h2>
          <p>{fieldAt(whoStarts.blocks, 1)}</p>
        </SectionShell>
      </MotionReveal>
    </PageFrame>
    </>
  );
}

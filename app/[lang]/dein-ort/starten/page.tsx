import { Button } from "@/src/components/button/button";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { PlaceSearch } from "@/src/components/place-search/place-search";
import { SceneBlock } from "@/src/components/scene-block/scene-block";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { slot } from "@/src/lib/content/loader";
import { resolveLocale } from "@/src/lib/i18n/locales";
import { fillTemplate, splitSteps } from "@/src/lib/pages/demo-content";
import { DEMO_PLACE } from "@/src/lib/pages/demo-data";
import { STAGE_ZERO_ANCHOR } from "@/src/lib/pages/live-anchor";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";
import { pageMetadata } from "@/src/lib/routes/metadata";

import heroPlaceholder from "@/src/generated/placeholders/dein-ort-starten/hero.svg";

import { PlaceDatesIsland } from "../../_islands";
import { pageContent } from "../../_content";
import { localeFrom } from "../../_locale";
import { PageFrame } from "../../_page-frame";
import { PLACE_START_META } from "./page.meta";

import type { Locale } from "@/src/lib/i18n/locales";
import type { Metadata } from "next";

/**
 * TS-021 — `/dein-ort/starten` — the founding offer.
 *
 * The page a visitor reaches when the place search finds **no place at all**.
 * Blocks per TS-021 D2: the acknowledgment with the place's name and the
 * page's only primary treatment · what it takes (WhatsApp) · the live
 * example · who usually starts it · search again · context band · closing
 * CTA, the last two from `page.meta.ts` through `PageFrame`. The breadcrumb
 * trail above block 1 is DEC-071's, and the frame renders it because
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
 * **Reading `searchParams` makes this route dynamic today.** TS-021 D10
 * wants the shell prerendered with the parameter resolved outside the cache
 * boundary; that is PPR, which TS-009 adopts at M4. TS-021-A2 meanwhile
 * requires the `h1` to contain the searched place **with JavaScript
 * disabled**, which only a server render can do. The AC wins; the divergence
 * from D10 is a `state/open.md` row, and the fix is one `Suspense` boundary
 * once `use cache` lands.
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
  // Parameter-free by construction (TS-011 D5): no runtime value reaches the
  // indexed surface, which is what makes D6's leak impossible rather than
  // merely unlikely.
  return pageMetadata(ROUTE, resolveLocale((await params).lang));
}

/**
 * The two words the artifact does not carry: a generic stand-in for the
 * place in the CTA label of the placeless variant (the artifact writes a
 * fallback *headline*, but no fallback CTA), and the example module's own
 * demo labels. Generated, with a `Dummy-Content` row in `state/open.md`.
 */
const PAGE_COPY: Record<Locale, { genericPlace: string; searchLabel: string; searchHint: string }> =
  {
    de: {
      genericPlace: "deinen Ort",
      searchLabel: "Deine Postleitzahl",
      searchHint: "Suche nach Ortsnamen kommt noch dazu — bis dahin reicht die Postleitzahl.",
    },
    en: {
      genericPlace: "your place",
      searchLabel: "Your postcode",
      searchHint: "Search by place name is coming — until then, the postcode works fine.",
    },
  };

/** The label before the `→ /route` the artifact appends to its CTA fields. */
function labelOf(field: string | undefined): string {
  return (field ?? "").split("→")[0]?.trim() ?? "";
}

/**
 * **Cache Components: this route blocks on purpose** (TS-009 D1, the dynamic
 * layer). `?ort=` is not one module's input here — it is the page's headline,
 * its primary CTA's query and its closing block, all three (D4/D8). Splitting
 * that into a `<Suspense>` island would put the *hero* behind a skeleton and
 * ship a shell whose first screen is empty, which is the opposite of what a
 * static shell is for.
 *
 * `instant = false` is the framework's own marker for "allowed to block".
 * The route still renders from the same tree, with the same content; what it
 * gives up is the prerendered shell. Recorded in `state/open.md` together
 * with the two other flow routes (`/mitmachen/registrieren`,
 * `/dein-kalender/bestellen`), which block for the same reason.
 */
export const instant = false;

export default async function PlaceStartPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await localeFrom(params);
  const page = await pageContent(ROUTE, locale);
  const copy = PAGE_COPY[locale];

  // D4: exactly one value, validated; anything else renders the placeless
  // variant. The DE artifact names the slot `{ort}`, the EN one `{place}`.
  const searched = readPlaceParameter((await searchParams).ort);
  const values = {
    ort: searched,
    place: searched,
    beispielort: DEMO_PLACE.name[locale],
    example_place: DEMO_PLACE.name[locale],
  };
  const ctaValues = {
    ort: searched ?? copy.genericPlace,
    place: searched ?? copy.genericPlace,
  };

  const ack = slot(page, "dein-ort-starten-1-ack");
  const whatItTakes = slot(page, "dein-ort-starten-2-was-es-braucht");
  const example = slot(page, "dein-ort-starten-3-beispiel");
  const whoStarts = slot(page, "dein-ort-starten-4-wer");
  const searchAgain = slot(page, "dein-ort-starten-5-search");
  const closing = slot(page, "dein-ort-starten-6-cta");

  // "Headline (mit Ort)" / "Headline (ohne Ort, Fallback)" — the artifact
  // writes both, so the placeless variant is authored copy, not a blank.
  const headline = searched
    ? fillTemplate(fieldAt(ack.blocks, 0) ?? "", values)
    : (fieldAt(ack.blocks, 1) ?? "");

  const ctaLabel = fillTemplate(labelOf(closing.cta ?? fieldAt(closing.blocks, 0)), ctaValues);

  /**
   * D8: a plain `<a href="/mitmachen/registrieren?ort=…">` carrying
   * `data-cta="primary"`, the value verbatim and URL-encoded by the route
   * facade. It works with JavaScript disabled, and no `app.*` href exists
   * anywhere on this page.
   */
  const registerCta = (primary: boolean) => (
    <Button
      dataCta={primary ? "primary" : undefined}
      locale={locale}
      onward
      query={{ ort: searched }}
      to="register"
      variant={primary ? "primary-light" : "secondary"}
    >
      {ctaLabel}
    </Button>
  );

  return (
    <PageFrame
      closing={{ to: "register", label: ctaLabel, query: { ort: searched } }}
      locale={locale}
      meta={PLACE_START_META}
    >
      {/* Block 1 — the acknowledgment. The place name is text, escaped by
          React. `headlineLines={2}` reserves two display lines before paint
          (D4, A13); the `display` role rather than `place-name` because the
          headline is a *sentence* that happens to contain a place name, and
          `place-name`'s two-line clamp cut it off mid-word at 360 px. The
          value is server-rendered, so a longer one makes the box taller
          without ever shifting anything after paint. */}
      <HeroBlock
        cta={registerCta(true)}
        headline={headline}
        headlineLines={2}
        id="focus-block"
        lead={fieldAt(ack.blocks, 2)}
        notDepicting
        placeholderId="dein-ort-starten/hero"
        src={heroPlaceholder.src}
      />

      {/* Block 2.1 — what it takes. One mechanism: WhatsApp (D2). */}
      <MotionReveal>
        <SectionShell id="what-it-takes" surface="lime-500">
          <SceneBlock
            body={fieldAt(whatItTakes.blocks, 1)}
            instance={null}
            locale={locale}
            mechanism="whatsapp"
            opener={fillTemplate(fieldAt(whatItTakes.blocks, 0) ?? "", ctaValues)}
          />
        </SectionShell>
      </MotionReveal>

      {/* Block 2.2 — the live example, headed as an example and never as
          "your place". The searched place appears in the note *beside* the
          module, never inside its heading or its rows (D6, A4). */}
      <MotionReveal>
        <SectionShell id="live-example" surface="ink">
          <p>{splitSteps(fillTemplate(fieldAt(example.blocks, 1) ?? "", ctaValues))[0]}</p>
          <PlaceDatesIsland
            locale={locale}
            rowCount={3}
            slug={STAGE_ZERO_ANCHOR.slug}
            titleTemplate={fillTemplate(fieldAt(example.blocks, 0) ?? "", values)}
            tone="dark"
          />
        </SectionShell>
      </MotionReveal>

      {/* Block 2.3 — who usually starts it. Not a `scene-block`: TS-006 D7
          gives a scene exactly one declared mechanism and an opener in
          question form, and this block has neither — D2's own table writes
          "— the scene" in its mechanism column. Naming a mechanism here
          would invent one. It is also emphatically not a role switcher
          (TS-006 D8): it names who it usually is and lets the reader
          recognise someone (D9). */}
      <MotionReveal>
        <SectionShell id="who-starts-it" labelledBy="who-starts-it-heading" surface="paper">
          <h2 id="who-starts-it-heading">{fieldAt(whoStarts.blocks, 0)}</h2>
          <p>{fieldAt(whoStarts.blocks, 1)}</p>
        </SectionShell>
      </MotionReveal>

      {/* Block 2.4 — the same search component as everywhere, for the
          visitor who mistyped (D2, TS-008 D7). */}
      <MotionReveal>
        <SectionShell id="search-again" labelledBy="search-again-heading" surface="lime-100">
          <h2 id="search-again-heading">{fieldAt(searchAgain.blocks, 0)}</h2>
          <PlaceSearch
            hint={copy.searchHint}
            id="ort-suche-nochmal"
            label={fieldAt(searchAgain.blocks, 1) ?? copy.searchLabel}
            locale={locale}
            placeholder={fieldAt(searchAgain.blocks, 1) ?? copy.searchLabel}
            to="place"
          />
        </SectionShell>
      </MotionReveal>
    </PageFrame>
  );
}

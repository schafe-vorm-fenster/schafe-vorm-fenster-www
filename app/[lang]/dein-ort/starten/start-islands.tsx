"use client";

/**
 * `/dein-ort/starten`'s place-dependent parts — TS-WEB-0021 D4/D6, read in the
 * browser since DEC-0163.
 *
 * `?ort=` is raw visitor input. The page is prerendered once, so its HTML is
 * the **placeless variant** — the artifact's own "Headline (ohne Ort,
 * Fallback)" and placeless CTA label, authored copy rather than a blank (A3,
 * A5). After hydration these components read the value, run it through the
 * same D4 validator (`readPlaceParameter`), and echo it exactly where D6
 * allows: the `h1`, the body copy, the CTA labels and the `?ort=` value on
 * the registration link — never a module heading's place, a row, a counter,
 * an `app.*` link, or any metadata (`pageMetadata` is parameter-free by
 * construction, and the metadata is in the static HTML).
 *
 * The value is echoed without waiting for the resolver: a value that passes
 * the grammar is either uncovered — this page's case — or covered, and a
 * covered one never stays here (`StartHop`; the proxy already answers it with
 * a 307 before any HTML, `place-hop.ts`, TS-WEB-0021-A7).
 *
 * TS-WEB-0021-A2's "the `h1` contains the searched place **with JavaScript
 * disabled**" is superseded by DEC-0163 §4: without JavaScript the page is the
 * placeless variant, complete and convertible.
 */

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/src/components/button/button";
import { ClosingCta } from "@/src/components/closing-cta/closing-cta";
import { HeroBlock } from "@/src/components/hero-block/hero-block";
import { SceneBlock } from "@/src/components/scene-block/scene-block";
import { linkHref } from "@/src/components/route-link/href";
import { extractCampaignParams } from "@/src/lib/analytics/attribution";
import { SHOWCASE_COMMUNITY } from "@/src/lib/live/showcase";
import { fillTemplate } from "@/src/lib/pages/demo-content";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";
import { usePlaceResolution } from "@/src/lib/pages/place-state";
import { useQuery } from "@/src/lib/pages/query-store";

import { PlaceDatesIsland } from "../../_islands";

import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

export interface StartCopy {
  readonly locale: Locale;
  /** "Headline (mit Ort)" — `{ort}` / `{place}`. */
  readonly headlineWithPlace: string;
  /** "Headline (ohne Ort, Fallback)". */
  readonly headlinePlaceless: string;
  /** "CTA-Label (primär)" — `{ort}` / `{place}`. */
  readonly ctaTemplate: string;
  /** "CTA-Label (ohne Ort, Fallback)"; empty where the artifact has none. */
  readonly ctaPlaceless: string;
  /** The page's promise over its offer, `{ort}` filled with the generic word without a place. */
  readonly closingHeadingTemplate: string;
  readonly closingReassurance?: string;
  /** "What it takes" opener — `{ort}` filled with the generic word without a place. */
  readonly openerTemplate: string;
  readonly openerBody?: string;
  /** The live example's heading template. */
  readonly exampleTitleTemplate: string;
  readonly genericPlace: string;
  readonly demoPlace: string;
}

/** The searched value, validated — `undefined` without one, or before the query is known. */
function useSearched(): string | undefined {
  const query = useQuery();
  return query === null ? undefined : readPlaceParameter(query.getAll("ort"));
}

function valuesFor(copy: StartCopy, searched: string | undefined) {
  return {
    text: { ort: searched, place: searched, beispielort: copy.demoPlace, example_place: copy.demoPlace },
    cta: { ort: searched ?? copy.genericPlace, place: searched ?? copy.genericPlace },
  };
}

function ctaLabel(copy: StartCopy, searched: string | undefined): string {
  const { cta } = valuesFor(copy, searched);
  return searched ? fillTemplate(copy.ctaTemplate, cta) : copy.ctaPlaceless || fillTemplate(copy.ctaTemplate, cta);
}

/**
 * DEC-0070's re-resolution (TS-WEB-0021-A7): a value that *does* resolve to a
 * community belongs on `/dein-ort?ort=<slug>`, campaign parameters carried.
 * The proxy hops before the page for a direct request; this covers a client
 * navigation that never passed through it.
 */
export function StartHop({ locale }: { readonly locale: Locale }) {
  const query = useQuery();
  const raw = query?.get("ort") ?? undefined;
  const resolution = usePlaceResolution(raw === "" ? undefined : raw);
  const router = useRouter();
  const target =
    query !== null && resolution !== undefined && resolution !== "pending" && resolution.outcome.kind === "covered"
      ? linkHref("place", { locale, query: { ort: resolution.outcome.place.slug, ...extractCampaignParams(query) } })
      : undefined;
  useEffect(() => {
    if (target !== undefined) router.replace(target);
  }, [router, target]);
  return null;
}

/**
 * D8: a plain `<a href="/mitmachen/registrieren?ort=…">` carrying
 * `data-cta="primary"`, the value verbatim and URL-encoded by the route
 * facade. No `app.*` href exists anywhere on this page.
 */
function RegisterCta({ copy, primary }: { readonly copy: StartCopy; readonly primary: boolean }) {
  const searched = useSearched();
  return (
    <Button
      dataCta={primary ? "primary" : undefined}
      locale={copy.locale}
      onward
      query={{ ort: searched }}
      to="register"
      variant={primary ? "primary-light" : "secondary"}
    >
      {ctaLabel(copy, searched)}
    </Button>
  );
}

export interface StartHeroProps {
  readonly copy: StartCopy;
  readonly image: {
    readonly src?: string;
    readonly wideSrc?: string;
    readonly focal?: { readonly x: number; readonly y: number };
    readonly notDepicting?: boolean;
    readonly placeholderId?: string;
    /** The photograph's credit behind the © control (DEC-0187). */
    readonly credit?: ReactNode;
  };
}

/**
 * Block 1 — the acknowledgment. The place name is text, escaped by React.
 * `headlineLines={2}` reserves two display lines before paint (D4, A13), so
 * the echoed value arriving after hydration does not move what follows.
 */
export function StartHero({ copy, image }: StartHeroProps) {
  const searched = useSearched();
  const headline = searched
    ? fillTemplate(copy.headlineWithPlace, valuesFor(copy, searched).text)
    : copy.headlinePlaceless;
  return (
    <HeroBlock
      cta={<RegisterCta copy={copy} primary />}
      focal={image.focal}
      headline={headline}
      headlineLines={2}
      id="focus-block"
      locale={copy.locale}
      notDepicting={image.notDepicting}
      credit={image.credit}
      placeholderId={image.placeholderId}
      src={image.src}
      wideSrc={image.wideSrc}
    />
  );
}

/** Block 2.1 — what it takes. One mechanism: WhatsApp (D2). */
export function StartWhatItTakes({ copy }: { readonly copy: StartCopy }) {
  const searched = useSearched();
  return (
    <SceneBlock
      body={copy.openerBody}
      instance={null}
      locale={copy.locale}
      mechanism="whatsapp"
      opener={fillTemplate(copy.openerTemplate, valuesFor(copy, searched).cta)}
    />
  );
}

/**
 * Block 2.2 — the live example, headed as an example and never as "your
 * place": the searched place may fill the heading's own slot, never the
 * module's rows (D6, A4).
 */
export function StartExample({ copy }: { readonly copy: StartCopy }) {
  const searched = useSearched();
  return (
    <PlaceDatesIsland
      locale={copy.locale}
      placeName={SHOWCASE_COMMUNITY.name}
      // One row, not three (G-2), and the village's own life first.
      prefer={["social", "culture", "fest", "official"]}
      role="story"
      rowCount={1}
      slug={SHOWCASE_COMMUNITY.slug}
      titleTemplate={fillTemplate(copy.exampleTitleTemplate, valuesFor(copy, searched).text)}
      tone="dark"
    />
  );
}

/** The closing block: the primary conversion repeated, the search-again line under it. */
export function StartClosing({ copy, footer }: { readonly copy: StartCopy; readonly footer: ReactNode }) {
  const searched = useSearched();
  return (
    <ClosingCta
      footer={footer}
      heading={fillTemplate(copy.closingHeadingTemplate, valuesFor(copy, searched).cta)}
      label={ctaLabel(copy, searched)}
      locale={copy.locale}
      query={{ ort: searched }}
      reassurance={copy.closingReassurance}
      to="register"
    />
  );
}

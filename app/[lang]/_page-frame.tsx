/**
 * Blocks 3 and 4 of TS-WEB-0006 D2 — the context band and the closing CTA — built
 * from the page's `page.meta.ts`, for every page, in one place.
 *
 * ```
 * (chrome: header · trail · main) → page blocks → context-band → closing-cta → (footer)
 * ```
 * (`plan/component-inventory.md` §4, "Every page is wrapped by the shared
 * layout".)
 *
 * ### Where the chrome went (state/open.md rows 97 and 204)
 *
 * Header, breadcrumb trail, the `main` landmark and the footer used to be
 * rendered here too, by a `SiteChrome` every page wrapped itself in, because
 * a Next.js layout cannot know which route renders below it and all three
 * need the route id. With Cache Components on that turned into a defect: the
 * App Router keeps the last three route segments mounted inside hidden
 * `<Activity>` boundaries (`preserving-ui-state.md`), so chrome rendered by a
 * page stayed in the document after the visitor clicked away — two, then
 * three `<main id="main">` elements, two headers, two footers. The chrome now
 * hangs off `app/[lang]/layout.tsx`, above those boundaries, and reads its
 * route from the router tree (`_chrome.tsx`).
 *
 * What stays here is what was never chrome: two **content** blocks that live
 * inside `main`, that TS-WEB-0006 D2 wants "rendered by the shared layout from
 * `page.meta.ts`, not hand-placed per page", and that are built from the
 * page's own manifest:
 *
 *  - `context-band` — "all four jobs minus *this page's* focus job" (D5);
 *  - `closing-cta` — "this page's primary conversion" (D6).
 *
 * A page hands over its manifest and its blocks and writes neither of them.
 */

import { ClosingCta, ClosingCtaModule } from "@/src/components/closing-cta/closing-cta";
import { ContextBand } from "@/src/components/context-band/context-band";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { fieldAt } from "@/src/lib/content/blocks";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { jobLabelKey } from "@/src/lib/pages/page-meta";

import type { ContentSlot } from "@/src/lib/content/types";
import type { PageMeta } from "@/src/lib/pages/page-meta";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

/**
 * The band's offer, per locale — the fallback only.
 *
 * `home-10-context-band`, `dein-ort-9-context-band`,
 * `dein-ort-starten-7-context-band`, `mitmachen-9-context-band` and
 * `registrieren-6-context-band` each carry the page's own kicker sentence
 * now (state/open.md row 95, row 161; identical wording today, so a page
 * without its own slot yet loses nothing by falling back here). The band
 * itself still renders on every page by construction (TS-WEB-0006 D5); the
 * remaining pages without a dedicated slot fall back to this constant
 * rather than the component's German default.
 */
const BAND_HEADING: Record<Locale, string> = {
  de: "Heute mit einem anderen Anliegen hier?",
  en: "Here for something else today?",
};

/** The closing block of TS-WEB-0006 D6, as the page hands it over. */
export type ClosingBlock =
  | {
      readonly variant?: "repeat";
      /** Identical to the primary conversion: same goal, same target, same label. */
      readonly to: RouteId;
      readonly label: string;
      readonly query?: Readonly<Record<string, string | number | undefined>>;
      /**
       * The in-page target the goal resolves to, through the route facade —
       * `#kontakt` for a booking, which DEC-0081 §3 turns from an outbound
       * navigation into the page's own contact section.
       */
      readonly hash?: string;
      /**
       * `repeat` (the default) or, on `/ueber-uns` alone, `primary`: DEC-0082
       * amendment C makes that page's closing CTA its one primary conversion
       * and empties its repeat rung.
       */
      readonly marker?: "primary" | "repeat";
      /** The promise the page ends on, above the button (polish brief G-6). */
      readonly heading?: string;
      /** Only where a cleared backing exists — otherwise omitted, not softened. */
      readonly reassurance?: string;
      /** A quiet second way forward under the button — never a second pill (G-5). */
      readonly footer?: ReactNode;
    }
  | { readonly variant: "merged" }
  /**
   * The block-1 primary repeated as the **module** it is [PROPOSED].
   *
   * TS-WEB-0006 D6 names two shapes, a goal CTA and the merged three-job offer.
   * Neither fits a state whose primary conversion is a module rather than a
   * link: where the focus job is "know what is on" and no place is known,
   * block 1 carries the place search and TS-WEB-0019 D2 gives that state no goal
   * at all ("a search is not a conversion"). The closing block then repeats
   * the same module with the same submit label and the same target — which
   * is what "no new text, same target" asks for — and without the
   * `data-cta="primary"` marker, which block 1 keeps. state/open.md carries
   * the row.
   */
  | {
      readonly variant: "module";
      readonly node: ReactNode;
      /**
       * The ground the closing section stands on, `paper` unless the page says
       * otherwise. `ink` is the closing search block on `/`: the one further
       * ink section a page may end on, and the only second `ink` section
       * `checkRhythm` admits — as the **last** section (DEC-0117,
       * SRC-0014 §"Second ink"). The shell takes it from the block rather than
       * from a page-level override, so the exception stays where the rhythm
       * rule can see it.
       */
      readonly surface?: "paper" | "ink";
      /** The promise the page ends on, above the control (polish brief G-6). */
      readonly heading?: string;
      /** Only where a cleared backing exists — otherwise omitted, not softened. */
      readonly reassurance?: string;
      /** A quiet line under the block — "Anderer Ort?", "Falsch getippt?". */
      readonly footer?: ReactNode;
    };

export interface PageFrameProps {
  readonly locale: Locale;
  /** The page's `page.meta.ts` — the route, and the only source of the band's and the closing block's job. */
  readonly meta: PageMeta;
  /** The band's own phrasing, from the page's `context-band` content slot. */
  readonly contextBandHeading?: string;
  /**
   * The page's `context-band` slot itself, where the page has one: its
   * kicker is the heading (unless `contextBandHeading` says otherwise) and
   * its list items are the blurbs under the three jobs (DEC-0120,
   * `src/lib/content/context-band.ts`). Without it the band falls back to
   * the registry's blurbs.
   */
  readonly contextBand?: ContentSlot;
  readonly closing: ClosingBlock;
  readonly children: ReactNode;
}

/**
 * The page's own blocks 1 and 2, and then blocks 3 and 4 from the manifest.
 *
 * A page never writes a `context-band` or a `closing-cta` itself — it hands
 * over its manifest and, for the repeat case, the label and target its
 * block-1 primary already uses, so "same goal, same target, same label"
 * (TS-WEB-0006 D6) holds by construction rather than by review.
 */
export function PageFrame({
  meta,
  locale,
  contextBandHeading,
  contextBand,
  closing,
  children,
}: PageFrameProps) {
  const currentJob = jobLabelKey(meta.focusJob);
  const bandHeading =
    contextBandHeading ??
    (contextBand ? fieldAt(contextBand.blocks, 0) : undefined) ??
    BAND_HEADING[locale];
  const merged = closing.variant === "merged";

  return (
    <>
      {children}

      {merged ? (
        /* Blocks 3 and 4 in one, where block 4 *is* the band's list: TS-WEB-0006
           D6 merges them on the `primaryConversion: null` pages, "so they
           render once, as the last block, rather than twice in sequence".
           The merged block is the band, not a replacement for it — the
           composition sheets compose it as "`context-band` in `merged` mode
           = the three-job block, rendered **once**, as the last block"
           (`plan/component-inventory.md` §4, TS-WEB-0027 block 7 / TS-WEB-0028 block
           4; §47 lists `merged` as the band's second mode). So it renders as
           the band's own `aside#context-band` — TS-WEB-0011-A4: "the context band
           is an `aside` on **every** page", TS-WEB-0006-A6: "every page renders
           exactly one context band" — and carries block 4's `#closing-cta`
           anchor inside it, which keeps exactly one of each per page and the
           three job links exactly once (TS-WEB-0027-A10: "rendered once, not
           twice").

           F-2-41, reopened at gate 2: the merge was built as a suppression,
           which left `/ueber-uns`, `/ueber-uns/archiv` and `/rechtliches`
           with no `aside` at all. No page spec exempts them — the only band
           exemption the specs carry is F-2-10's mid-flow suppression on
           `/mitmachen/registrieren` and `/dein-kalender/bestellen` (TS-WEB-0023
           D7 / TS-WEB-0025, `state/open.md` row 24), and those two pages compose
           their blocks by hand, never through this component. */
        <MotionReveal>
          <SectionShell as="aside" id="context-band" label={bandHeading} surface="paper">
            {/* The band's own heading, not the component's German default —
                the block is the band, and on `/en` the default rendered
                German (the F-2-33 failure mode). */}
            <ClosingCta
              currentJob={currentJob}
              heading={bandHeading}
              id="closing-cta"
              locale={locale}
              variant="merged"
            />
          </SectionShell>
        </MotionReveal>
      ) : (
        <>
          {/* Block 3 — the three non-focus jobs. `as="aside"` — TS-WEB-0011-A4:
              "the context band is an `aside` on every page." It rendered as
              a plain `section` before (F-2-41). */}
          <MotionReveal>
            <SectionShell as="aside" id="context-band" label={bandHeading} surface="surface">
              <ContextBand
                currentJob={currentJob}
                heading={bandHeading}
                locale={locale}
                slot={contextBand}
              />
            </SectionShell>
          </MotionReveal>

          {/* Block 4 — the focus job's conversion, repeated. It stays the last
              block *inside* `main`; after it stand exactly two things, both
              chrome: the contact section and the global footer (TS-WEB-0006 D2
              as amended by DEC-0081 §2, `_chrome.tsx`). */}
          <MotionReveal>
            <SectionShell
              id="closing-cta"
              label={dictionary(locale).nav.home}
              surface={closing.variant === "module" ? (closing.surface ?? "paper") : "paper"}
            >
              {closing.variant === "module" ? (
                /* The block-1 primary repeated as the module it is, with the
                   same heading and reassurance a `repeat` block carries — a
                   page that ends on a control and nothing else ends on no
                   promise at all (polish brief G-6). */
                <ClosingCtaModule
                  footer={closing.footer}
                  heading={closing.heading}
                  reassurance={closing.reassurance}
                >
                  {closing.node}
                </ClosingCtaModule>
              ) : (
                <ClosingCta
                  footer={closing.footer}
                  hash={closing.hash}
                  heading={closing.heading}
                  label={closing.label}
                  locale={locale}
                  marker={closing.marker}
                  query={closing.query}
                  reassurance={closing.reassurance}
                  to={closing.to}
                />
              )}
            </SectionShell>
          </MotionReveal>
        </>
      )}
    </>
  );
}

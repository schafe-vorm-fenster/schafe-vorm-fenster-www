/**
 * The shared page frame — the chrome of TS-004 D4 and blocks 3 and 4 of
 * TS-006 D2, in one place, for every page.
 *
 * ```
 * skip-link → site-header → (breadcrumb-trail) → main → context-band
 *           → closing-cta → site-footer
 * ```
 * (`plan/component-inventory.md` §4, "Every page is wrapped by the shared
 * layout".)
 *
 * ### Why this is a component and not `layout.tsx` [PROPOSED — state/open.md]
 *
 * TS-006 D2 wants blocks 3 and 4 "rendered by the shared layout from
 * `page.meta.ts`, not hand-placed per page". A Next.js layout receives only
 * `children` and its own segment `params` (`node_modules/next/dist/docs/
 * 01-app/03-api-reference/03-file-conventions/layout.md`): `app/[lang]/
 * layout.tsx` therefore knows the language and nothing else — not which of
 * the eleven routes is rendering below it. Three of the chrome's own
 * contracts need exactly that:
 *
 *  - `site-footer` → `language-switch` links the **equivalent** page in the
 *    other language (TS-001-A7) — it needs the route id;
 *  - `site-header` marks the current job with `aria-current` (TS-004 D4);
 *  - `context-band` and `closing-cta` are "all four jobs minus *this page's*
 *    focus job" and "this page's primary conversion" (TS-006 D5/D6).
 *
 * The only way a layout could learn the route is `headers()` (or a proxy
 * header), which turns the prerendered shell into a per-request function —
 * the failure mode DEC-045 and TS-010 D8 exist to prevent. So the seam moves
 * one level down: the *frame* is shared, single, and reads `page.meta.ts`;
 * the page passes its manifest and its blocks and writes no band and no
 * closing CTA of its own. `layout.tsx` keeps `<html>`, `<body>` and the
 * skip link, which need no route.
 */

import { BackToTop } from "@/src/components/back-to-top/back-to-top";
import { BreadcrumbTrail } from "@/src/components/breadcrumb-trail/breadcrumb-trail";
import { ClosingCta } from "@/src/components/closing-cta/closing-cta";
import { ContextBand } from "@/src/components/context-band/context-band";
import { EnvoyFormMount } from "@/src/components/envoy-form-mount/envoy-form-mount";
import { MotionReveal } from "@/src/components/motion-reveal/motion-reveal";
import { NewsletterBlock } from "@/src/components/newsletter-block/newsletter-block";
import { SectionShell } from "@/src/components/section-shell/section-shell";
import { SiteFooter } from "@/src/components/site-footer/site-footer";
import { SiteHeader } from "@/src/components/site-header/site-header";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { jobLabelKey } from "@/src/lib/pages/page-meta";
import { ROUTES, trail } from "@/src/lib/routes/routes";

import type { PageMeta } from "@/src/lib/pages/page-meta";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

/**
 * The imprint's own contact address (`content/legal/imprint.md`) — the
 * `lead-fallback` behind the mocked envoy widget must reach a real inbox, so
 * this is read from the legal text rather than invented (TS-016 D6).
 */
const CONTACT_EMAIL = "jan@schafe-vorm-fenster.de";

/**
 * The band's offer, per locale — the fallback only.
 *
 * `home-10-context-band`, `dein-ort-9-context-band`,
 * `dein-ort-starten-7-context-band`, `mitmachen-9-context-band` and
 * `registrieren-6-context-band` each carry the page's own kicker sentence
 * now (state/open.md row 95, row 161; identical wording today, so a page
 * without its own slot yet loses nothing by falling back here). The band
 * itself still renders on every page by construction (TS-006 D5); the
 * remaining pages without a dedicated slot fall back to this constant
 * rather than the component's German default.
 */
const BAND_HEADING: Record<Locale, string> = {
  de: "Heute mit einem anderen Anliegen hier?",
  en: "Here for something else today?",
};

export interface SiteChromeProps {
  readonly route: RouteId;
  readonly locale: Locale;
  /** The five second-level pages carry a visible trail (TS-006 D2, DEC-071). */
  readonly showTrail?: boolean;
  /** `/rechtliches` only (inventory §2.2 #18) — a fixed control, never elsewhere. */
  readonly backToTop?: boolean;
  /**
   * This page's first block is a `photo-surface` carrying a photograph, so
   * the header lies transparent on it and turns solid once it has scrolled
   * past (Jan's round-3 point 2). The page computes it from its own image
   * inventory — a hero whose photograph is still missing renders the light
   * hatch, which paper-coloured header items could not sit on.
   *
   * Suppressed where a breadcrumb trail stands between the header and the
   * hero: there the header is not over the photograph at all.
   */
  readonly heroPhoto?: boolean;
  readonly children: ReactNode;
}

/**
 * Header · trail · `main` · footer. Everything that is the same on all
 * eleven pages and needs nothing but the route and the language.
 */
export function SiteChrome({
  route,
  locale,
  showTrail = ROUTES[route].parent !== undefined,
  backToTop = false,
  heroPhoto = false,
  children,
}: SiteChromeProps) {
  const d = dictionary(locale);
  const ancestors = trail(route).slice(0, -1);
  const trailShown = showTrail && ancestors.length > 0;

  return (
    <>
      <SiteHeader current={route} locale={locale} overHero={heroPhoto && !trailShown} />
      {trailShown ? (
        <div className="container">
          <BreadcrumbTrail
            current={d.pages[route]}
            items={ancestors.map((ancestor) => ({
              to: ancestor,
              label: d.pages[ancestor],
            }))}
            label={d.nav.breadcrumb}
            locale={locale}
          />
        </div>
      ) : null}
      <main id="main">{children}</main>
      <SiteFooter
        contact={
          <EnvoyFormMount
            fallbackEmail={CONTACT_EMAIL}
            kind="contact"
            locale={locale}
            sourceRoute={route}
          />
        }
        locale={locale}
        newsletter={<NewsletterBlock locale={locale} />}
        route={route}
      />
      {backToTop ? <BackToTop /> : null}
    </>
  );
}

/** The closing block of TS-006 D6, as the page hands it over. */
export type ClosingBlock =
  | {
      readonly variant?: "repeat";
      /** Identical to the primary conversion: same goal, same target, same label. */
      readonly to: RouteId;
      readonly label: string;
      readonly query?: Readonly<Record<string, string | number | undefined>>;
      /** Only where a cleared backing exists — otherwise omitted, not softened. */
      readonly reassurance?: string;
    }
  | { readonly variant: "merged" }
  /**
   * The block-1 primary repeated as the **module** it is [PROPOSED].
   *
   * TS-006 D6 names two shapes, a goal CTA and the merged three-job offer.
   * Neither fits a state whose primary conversion is a module rather than a
   * link: where the focus job is "know what is on" and no place is known,
   * block 1 carries the place search and TS-019 D2 gives that state no goal
   * at all ("a search is not a conversion"). The closing block then repeats
   * the same module with the same submit label and the same target — which
   * is what "no new text, same target" asks for — and without the
   * `data-cta="primary"` marker, which block 1 keeps. state/open.md carries
   * the row.
   */
  | {
      readonly variant: "module";
      readonly node: ReactNode;
      /** Only where a cleared backing exists — otherwise omitted, not softened. */
      readonly reassurance?: string;
    };

export interface PageFrameProps extends Omit<SiteChromeProps, "children" | "route"> {
  /** The page's `page.meta.ts` — the route, and the only source of the band's and the closing block's job. */
  readonly meta: PageMeta;
  /** The band's own phrasing, from the page's `context-band` content slot. */
  readonly contextBandHeading?: string;
  readonly closing: ClosingBlock;
  readonly children: ReactNode;
}

/**
 * The whole page: the chrome, the page's own blocks 1 and 2, and then
 * blocks 3 and 4 built from the manifest.
 *
 * A page never writes a `context-band` or a `closing-cta` itself — it hands
 * over its manifest and, for the repeat case, the label and target its
 * block-1 primary already uses, so "same goal, same target, same label"
 * (TS-006 D6) holds by construction rather than by review.
 */
export function PageFrame({
  meta,
  locale,
  showTrail,
  backToTop,
  heroPhoto,
  contextBandHeading,
  closing,
  children,
}: PageFrameProps) {
  const currentJob = jobLabelKey(meta.focusJob);
  const bandHeading = contextBandHeading ?? BAND_HEADING[locale];
  const merged = closing.variant === "merged";

  return (
    <SiteChrome
      backToTop={backToTop}
      heroPhoto={heroPhoto}
      locale={locale}
      route={meta.route}
      showTrail={showTrail}
    >
      {children}

      {merged ? (
        /* Blocks 3 and 4 in one, where block 4 *is* the band's list: TS-006
           D6 merges them on the `primaryConversion: null` pages, "so they
           render once, as the last block, rather than twice in sequence".
           The merged block is the band, not a replacement for it — the
           composition sheets compose it as "`context-band` in `merged` mode
           = the three-job block, rendered **once**, as the last block"
           (`plan/component-inventory.md` §4, TS-027 block 7 / TS-028 block
           4; §47 lists `merged` as the band's second mode). So it renders as
           the band's own `aside#context-band` — TS-011-A4: "the context band
           is an `aside` on **every** page", TS-006-A6: "every page renders
           exactly one context band" — and carries block 4's `#closing-cta`
           anchor inside it, which keeps exactly one of each per page and the
           three job links exactly once (TS-027-A10: "rendered once, not
           twice").

           F-2-41, reopened at gate 2: the merge was built as a suppression,
           which left `/ueber-uns`, `/ueber-uns/archiv` and `/rechtliches`
           with no `aside` at all. No page spec exempts them — the only band
           exemption the specs carry is F-2-10's mid-flow suppression on
           `/mitmachen/registrieren` and `/dein-kalender/bestellen` (TS-023
           D7 / TS-025, `state/open.md` row 24), and those two pages compose
           their chrome through `SiteChrome`, never through this branch. */
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
          {/* Block 3 — the three non-focus jobs. `as="aside"` — TS-011-A4:
              "the context band is an `aside` on every page." It rendered as
              a plain `section` before (F-2-41). */}
          <MotionReveal>
            <SectionShell as="aside" id="context-band" label={bandHeading} surface="surface">
              <ContextBand currentJob={currentJob} heading={bandHeading} locale={locale} />
            </SectionShell>
          </MotionReveal>

          {/* Block 4 — the focus job's conversion, repeated. Nothing but the
              global footer renders after it (TS-006 D2). */}
          <MotionReveal>
            <SectionShell id="closing-cta" label={dictionary(locale).nav.home} surface="paper">
              {closing.variant === "module" ? (
                <>
                  {closing.node}
                  {closing.reassurance ? <p>{closing.reassurance}</p> : null}
                </>
              ) : (
                <ClosingCta
                  label={closing.label}
                  locale={locale}
                  query={closing.query}
                  reassurance={closing.reassurance}
                  to={closing.to}
                />
              )}
            </SectionShell>
          </MotionReveal>
        </>
      )}
    </SiteChrome>
  );
}

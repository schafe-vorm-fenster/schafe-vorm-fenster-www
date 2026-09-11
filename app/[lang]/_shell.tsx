/**
 * The M2 page scaffolding.
 *
 * Every route of TS-004 D1 renders its title and then the ordered module
 * list of its composition sheet (`plan/component-inventory.md` §4) as
 * labelled placeholder sections with a reserved height. The page
 * implementers replace a `<PlaceholderSection>` **in place**: the id, the
 * order and the landmark stay, the content arrives.
 *
 * These are plain elements on purpose. The component set lives in
 * `src/components/` and is a different work package; nothing here may
 * anticipate it. The reserved heights are inline `min-block-size` values so
 * the shell stands up without a stylesheet of its own — they disappear with
 * the placeholder.
 */

import { dictionary } from "@/src/lib/i18n/dictionary";
import { DEFAULT_LOCALE, LOCALES } from "@/src/lib/i18n/locales";
import { ROUTE_IDS } from "@/src/lib/routes/routes";

import { SiteChrome } from "./_page-frame";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

export interface PlaceholderModule {
  /** The sheet's module id — stable, kebab-case, used as the DOM anchor. */
  readonly id: string;
  /** The components the sheet assigns to the slot, verbatim. */
  readonly components: string;
  /** Reserved height in rem, so the page has its real rhythm early. */
  readonly height?: number;
}

const DEFAULT_HEIGHT = 12;

export function PlaceholderSection({
  module,
  labels,
}: {
  module: PlaceholderModule;
  labels: { section: string; components: string; reserved: string };
}): ReactNode {
  const headingId = `placeholder-${module.id}`;
  return (
    <section
      aria-labelledby={headingId}
      data-placeholder="module"
      data-module={module.id}
      id={module.id}
      style={{
        minBlockSize: `${module.height ?? DEFAULT_HEIGHT}rem`,
        border: "1px dashed currentColor",
        borderRadius: "0.5rem",
        marginBlockEnd: "1.5rem",
        opacity: 0.7,
        padding: "1rem",
      }}
    >
      <h2 id={headingId} style={{ fontSize: "1rem" }}>
        {labels.section}: {module.id}
      </h2>
      <p>
        {labels.components}: {module.components}
      </p>
      <p>{labels.reserved}</p>
    </section>
  );
}

/**
 * Which route and which language a placeholder page stands for, read back
 * off its own title.
 *
 * Transitional, and it disappears with the last placeholder: every page in
 * the routing skeleton passes `title={pageTitle(ROUTE, locale)}`, and the
 * eleven titles are distinct inside each language, so both values are
 * recoverable without editing eleven files that three developers are
 * replacing in parallel. A page that knows its own route and language passes
 * them and skips the lookup.
 */
function identify(title: string): { route: RouteId; locale: Locale } {
  for (const locale of LOCALES) {
    const pages = dictionary(locale).pages;
    const route = ROUTE_IDS.find((candidate) => pages[candidate] === title);
    if (route) return { route, locale };
  }
  return { route: "home", locale: DEFAULT_LOCALE };
}

export function PlaceholderPage({
  title,
  note,
  modules,
  labels,
  locale,
  route,
}: {
  title: string;
  note: string;
  modules: readonly PlaceholderModule[];
  labels: { section: string; components: string; reserved: string };
  /** The page's language — the chrome needs it for every link it renders. */
  locale?: Locale;
  /** The page's route id; derived from the title where a page has not been built yet. */
  route?: RouteId;
}): ReactNode {
  const identified = identify(title);
  return (
    <SiteChrome locale={locale ?? identified.locale} route={route ?? identified.route}>
      <article className="container" data-placeholder="page">
        <h1>{title}</h1>
        <p>{note}</p>
        {modules.map((module) => (
          <PlaceholderSection key={module.id} labels={labels} module={module} />
        ))}
      </article>
    </SiteChrome>
  );
}

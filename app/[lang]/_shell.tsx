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

export function PlaceholderPage({
  title,
  note,
  modules,
  labels,
}: {
  title: string;
  note: string;
  modules: readonly PlaceholderModule[];
  labels: { section: string; components: string; reserved: string };
}): ReactNode {
  // The chrome — header, trail, `main`, footer — belongs to
  // `app/[lang]/layout.tsx` since state/open.md row 204, so a placeholder page
  // renders its own blocks and nothing else, exactly as a finished page does.
  // That is also why it no longer needs to know its route or its language.
  return (
    <article className="container" data-placeholder="page">
      <h1>{title}</h1>
      <p>{note}</p>
      {modules.map((module) => (
        <PlaceholderSection key={module.id} labels={labels} module={module} />
      ))}
    </article>
  );
}

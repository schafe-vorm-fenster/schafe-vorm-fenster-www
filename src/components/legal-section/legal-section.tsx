import { RouteLink } from "../route-link/route-link";

import { legalAnchor } from "@/src/lib/routes/legal-anchors";

import type { LegalSectionId } from "@/src/lib/routes/legal-anchors";
import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./legal-section.module.css";

export interface LegalSectionProps {
  readonly section: LegalSectionId;
  readonly title: string;
  /**
   * Already-imported document content (headings shifted to `h3`+ by the
   * import step, TS-029 D1–D6). Absent → the entry reserves its anchor and
   * renders nothing visible.
   */
  readonly body?: ReactNode;
  /** A retired section keeps its anchor and points at its successor. */
  readonly retired?: boolean;
  readonly successor?: LegalSectionId;
  readonly successorLabel?: string;
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 39 `legal-section` [PROPOSED] — content type 26 `legal-section`,
 * TS-029 D1–D6.
 *
 * Structure: one section per registry entry (`src/lib/routes/legal-anchors.ts`),
 * in registry order; the `id` is the registry anchor for the page language,
 * never slugified from the heading; an `h2` per section, with imported
 * document headings shifted to `h3`+ before they reach this component.
 * States: a registry entry with no document renders **nothing visible**
 * while its anchor stays reserved in the DOM (no empty heading, no
 * placeholder); a retired section keeps its anchor and renders a one-line
 * pointer to its successor.
 * Inherits: a `line` hairline plus one padding step between sections, never
 * a card; Body 18/1.5; the reading measure of D-7 (66 ch ideal / 80 ch max).
 * Space: `scroll-margin-top` is set from the same `--site-header-height`
 * variable the header publishes, plus one section padding step.
 * A11y: the heading carries `tabIndex={-1}` so a script-driven focus move
 * after an in-page jump has a target (the move itself is layout-level and
 * tracked in `state/open.md`); unknown fragments are the browser's own
 * no-op, never an error this component renders.
 */
export function LegalSection({
  section,
  title,
  body,
  retired = false,
  successor,
  successorLabel,
  locale = "de",
  className,
}: LegalSectionProps) {
  const id = legalAnchor(section, locale);

  if (!body && !retired) {
    return <div aria-hidden="true" className={styles.reserved} id={id} />;
  }

  return (
    <section className={[styles.section, className].filter(Boolean).join(" ")} id={id}>
      <h2 className={styles.heading} tabIndex={-1}>
        {title}
      </h2>
      {retired ? (
        <p className={styles.pointer}>
          Dieser Abschnitt ist zusammengeführt.{" "}
          {successor ? (
            <RouteLink hash={legalAnchor(successor, locale)} locale={locale} to="legal">
              {successorLabel ?? "Zum aktuellen Abschnitt"}
            </RouteLink>
          ) : null}
        </p>
      ) : (
        <div className={styles.body}>{body}</div>
      )}
    </section>
  );
}

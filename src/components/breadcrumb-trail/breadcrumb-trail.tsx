import { RouteLink } from "../route-link/route-link";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./breadcrumb-trail.module.css";

export interface BreadcrumbItem {
  readonly to: RouteId;
  readonly label: string;
}

export interface BreadcrumbTrailProps {
  /** The ancestors, in order. The current page is not one of them. */
  readonly items: readonly BreadcrumbItem[];
  readonly current: string;
  readonly locale?: Locale;
  readonly label?: string;
  readonly className?: string;
}

/**
 * 11 `breadcrumb-trail` [PROPOSED] — TS-006 D2, DEC-071 fixes that it exists.
 *
 * Structure: one `nav` above block 1 on the five second-level pages,
 * server-rendered plain links, the last item — the current page — not a link.
 * States: static.
 * Inherits: link treatment only, never CTA treatment. `data-cta` never
 * appears inside a breadcrumb; Meta type.
 * Space: one line, reserved.
 * A11y: an accessible name, an ordered list, `aria-current="page"` on the
 * last item, and no heading level skipped — it carries no heading at all.
 */
export function BreadcrumbTrail({
  items,
  current,
  locale,
  label = "Seitenpfad",
  className,
}: BreadcrumbTrailProps) {
  return (
    <nav aria-label={label} className={[styles.nav, className].filter(Boolean).join(" ")}>
      <ol className={styles.list}>
        {items.map((item) => (
          <li className={styles.item} key={item.to}>
            <RouteLink locale={locale} to={item.to}>
              {item.label}
            </RouteLink>
            <span aria-hidden="true" className={styles.separator}>
              ·
            </span>
          </li>
        ))}
        <li className={styles.item}>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}

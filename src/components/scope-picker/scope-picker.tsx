import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { Icon } from "../icon/icon";
import { RouteLink } from "../route-link/route-link";
import { Skeleton } from "../skeleton/skeleton";

import type { RouteId } from "@/src/lib/routes/routes";
import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./scope-picker.module.css";

export interface ScopeChip {
  readonly id: string;
  readonly label: string;
  readonly kind: "place" | "county";
  /** The query that removes this one entry — the page builds it, the scope lives in the URL (D3a). */
  readonly removeQuery: Readonly<Record<string, string | number | undefined>>;
}

export interface ScopePickerProps extends DataStateProps {
  readonly items: readonly ScopeChip[];
  readonly to: RouteId;
  readonly locale?: Locale;
  /** Above this count the row collapses to "n Orte ausgewählt" plus a disclosure. */
  readonly collapseAt?: number;
  readonly emptyHeadline?: string;
  readonly emptyBody?: string;
  readonly className?: string;
}

/**
 * 55 `scope-picker` [PROPOSED] — TS-025 D3/D3a.
 *
 * Structure: `place-search` (rendered by the caller, above this component) +
 * removable `chip`s; each hit, each ZIP's places, and a county become chips
 * — a county is **one** chip, never expanded into a place list. Above
 * `collapseAt` (12) chips the row collapses to "n Orte ausgewählt" plus a
 * `<details>` disclosure — no JavaScript required. Selection lives in the
 * URL: removing a chip is a link to the scope without that entry.
 * States (D-9, all four):
 *   loading  → a `skeleton` row;
 *   empty    → the designed empty-scope state — step 3 stays unreachable,
 *              which is a page-level routing concern, not this component's;
 *   degraded → the same chips, unaffected (the scope is client/URL state,
 *              not late data);
 *   mocked   → demo chips plus `demo-data-badge` (rare — scope is normally
 *              visitor-chosen, not fetched).
 * Inherits: chips ≥ 40 px, radius 999; scope never drives price.
 * Space: removing or adding a chip produces no layout shift elsewhere on the
 * page — the disclosure keeps the collapsed row itself at a fixed height.
 * A11y: every chip is a real link, removable by keyboard, and names what it
 * removes in its accessible label.
 */
export function ScopePicker({
  items,
  to,
  locale,
  collapseAt = 12,
  emptyHeadline = "Noch keine Auswahl.",
  emptyBody = "Füge oben Orte oder eine Postleitzahl hinzu.",
  state = "ready",
  className,
}: ScopePickerProps) {
  const classes = [styles.picker, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return <Skeleton className={classes} rows={1} variant="row" />;
  }

  if (items.length === 0) {
    return (
      <div className={classes}>
        <p className={styles.emptyHeadline}>{emptyHeadline}</p>
        <p className={styles.emptyBody}>{emptyBody}</p>
      </div>
    );
  }

  const chips = items.map((item) => (
    <RouteLink
      className={styles.chip}
      key={item.id}
      locale={locale}
      query={item.removeQuery}
      styled={false}
      to={to}
    >
      <span className={styles.chipLabel}>
        {item.label}
        {item.kind === "county" ? " (ganzer Landkreis)" : ""}
      </span>
      <Icon name="circle-x" size={18} />
      <span className={styles.srOnly}>entfernen</span>
    </RouteLink>
  ));

  return (
    <div className={classes} data-demo={isMocked(state) ? "true" : undefined}>
      {items.length > collapseAt ? (
        <details className={styles.disclosure}>
          <summary className={styles.summary}>{items.length} Orte ausgewählt</summary>
          <div className={styles.chips}>{chips}</div>
        </details>
      ) : (
        <div className={styles.chips}>{chips}</div>
      )}
      {isMocked(state) ? <DemoDataBadge /> : null}
    </div>
  );
}

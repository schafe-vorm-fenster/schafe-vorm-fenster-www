import { Button } from "../button/button";
import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { Icon } from "../icon/icon";
import { linkHref } from "../route-link/href";
import { Skeleton } from "../skeleton/skeleton";

import type { RouteId } from "@/src/lib/routes/routes";
import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./choice-group.module.css";

export interface ChoiceOption {
  readonly value: string;
  readonly label: string;
}

export interface ChoiceGroupProps extends DataStateProps {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly ChoiceOption[];
  readonly selected?: string;
  /** The GET form's target — the step advances by navigating there. */
  readonly to: RouteId;
  readonly query?: Readonly<Record<string, string | number | undefined>>;
  readonly locale?: Locale;
  readonly submitLabel?: string;
  readonly className?: string;
}

/**
 * 54 `choice-group` [PROPOSED] — TS-023 D8 (Q-044 gap, decision D-6,
 * `state/open.md` row 23).
 *
 * Structure: a single-choice control for "who publishes" (step 2) and
 * "which publishing path" (step 3) of `/mitmachen/registrieren`. The design
 * system specifies no such control, so the conservative reading is
 * chip-derived: real `<input type="radio">` controls, visually chip-shaped
 * (radius 999, ≥ 44 px), one selected state (fill *and* the `check` glyph,
 * never colour alone), submitted by a plain `<form method="get">` so the
 * step advances without JavaScript.
 * States (D-9, all four):
 *   loading  → a `skeleton` row reserving the option row's height;
 *   empty    → the fieldset with no options — the step cannot be answered,
 *              which the caller re-asks rather than treating as an error;
 *   degraded → the same static options, unaffected — the vocabulary is
 *              content, not late data;
 *   mocked   → the placeholder vocabulary (step 2's "who publishes" list is
 *              UNKNOWN, `state/open.md` row 18) plus `demo-data-badge`.
 * Inherits: not self-classification — it asks who *publishes*, account data,
 * and never changes what any page shows (TS-006 D8).
 * A11y: real `radiogroup` semantics via `<fieldset>`/`<legend>`; the checked
 * state is marked by fill and the `check` glyph together.
 */
export function ChoiceGroup({
  name,
  legend,
  options,
  selected,
  to,
  query,
  locale,
  submitLabel = "Weiter",
  state = "ready",
  className,
}: ChoiceGroupProps) {
  const classes = [styles.group, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return <Skeleton className={classes} rows={1} variant="row" />;
  }

  return (
    <form action={linkHref(to, { locale })} className={classes} method="get">
      {/* A GET form's submission replaces the action URL's own query string
          entirely (the browser never merges the two) — so anything the
          step must carry forward (`ort`, an earlier `wer`) has to travel as
          a hidden field, the same pattern `search-field` already uses. */}
      {Object.entries(query ?? {}).map(([key, value]) =>
        value === undefined ? null : (
          <input key={key} name={key} type="hidden" value={String(value)} />
        ),
      )}
      <fieldset className={styles.fieldset} data-demo={isMocked(state) ? "true" : undefined}>
        <legend className={styles.legend}>
          {legend}
          {isMocked(state) ? <DemoDataBadge className={styles.badge} /> : null}
        </legend>
        {options.length === 0 ? (
          <p className={styles.none}>Keine Auswahl verfügbar.</p>
        ) : (
          <div className={styles.options}>
            {options.map((option) => (
              <label
                className={[styles.option, option.value === selected ? styles.selected : undefined]
                  .filter(Boolean)
                  .join(" ")}
                key={option.value}
              >
                <input
                  className={styles.input}
                  defaultChecked={option.value === selected}
                  name={name}
                  type="radio"
                  value={option.value}
                />
                {option.value === selected ? <Icon name="check" size={18} /> : null}
                {option.label}
              </label>
            ))}
          </div>
        )}
      </fieldset>
      <Button size="compact" type="submit" variant="primary-light">
        {submitLabel}
      </Button>
    </form>
  );
}

import { Chip } from "../chip/chip";
import { isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { SearchField } from "../search-field/search-field";
import { Skeleton } from "../skeleton/skeleton";

import type { LinkOptions } from "../route-link/href";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./place-search.module.css";

export interface PlaceSuggestion {
  readonly label: string;
  readonly to: RouteId;
  readonly query?: Readonly<Record<string, string | number | undefined>>;
}

export interface PlaceSearchProps extends DataStateProps, Omit<LinkOptions, "hash"> {
  /** Where the plain GET form navigates — the classification target (TS-008 D7). */
  readonly to: RouteId;
  readonly label?: string;
  /** Interim ZIP-only hint until Q-025 (name search) lands. */
  readonly hint?: string;
  /** Typeahead enhancement — chips, never a fetch in this component. */
  readonly suggestions?: readonly PlaceSuggestion[];
  readonly defaultValue?: string;
  /** The field's own placeholder — the second locale needs its own word. */
  readonly placeholder?: string;
  readonly submitLabel?: string;
  /** Passed to the submit control: the primary conversion of a "know what is on" page (TS-006 D4). */
  readonly submitDataCta?: string;
  readonly className?: string;
}

/**
 * 41 `place-search` [PROPOSED] — TS-008 D7.
 *
 * Structure: `search-field` plus an optional suggestion list rendered as
 * `chip`s (≥ 40 px) — the same component and behaviour everywhere it stands
 * (`/`, `/dein-ort`, `/dein-ort/starten`, the order flow's scope step, 404).
 * ZIP-only until Q-025 lands; the placeholder and the hint say so.
 * States (D-9, all four):
 *   loading  → the field's own 56 px reserved as a `skeleton` control;
 *   empty    → the field alone, no suggestion row;
 *   degraded → the field alone — an upstream error is never shown as an
 *              error here (TS-008 D7): the visitor stays where she is;
 *   mocked   → the field plus mocked suggestion chips and `demo-data-badge`,
 *              for the geo-api capabilities still behind Q-025/032/038/051.
 * Inherits: the 56 px pill with the nested 44 px submit; `paper` everywhere.
 * Space: 56 px fixed for the field; the suggestion row reserves nothing when
 * absent, so it never appears as a layout shift.
 * A11y: the label is bound to the input; suggestions are reachable by
 * keyboard; raw input is never echoed unescaped anywhere near this control.
 */
export function PlaceSearch({
  to,
  locale,
  query,
  label = "Ort oder Postleitzahl",
  hint = "Bislang nur per Postleitzahl — die Ortssuche folgt.",
  suggestions,
  defaultValue,
  placeholder = "Postleitzahl",
  submitLabel,
  submitDataCta,
  state = "ready",
  className,
}: PlaceSearchProps) {
  const classes = [styles.module, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return (
      <div className={classes}>
        <Skeleton variant="control" />
      </div>
    );
  }

  return (
    <div className={classes}>
      <SearchField
        defaultValue={defaultValue}
        label={label}
        locale={locale}
        placeholder={placeholder}
        query={query}
        submitDataCta={submitDataCta}
        submitLabel={submitLabel}
        to={to}
      />
      <p className={styles.hint}>{hint}</p>
      {suggestions && suggestions.length > 0 ? (
        <div className={styles.suggestions}>
          {suggestions.map((suggestion) => (
            <Chip key={suggestion.label} locale={locale} query={suggestion.query} to={suggestion.to}>
              {suggestion.label}
            </Chip>
          ))}
          {state === "mocked" ? <DemoDataBadge /> : null}
        </div>
      ) : null}
    </div>
  );
}

import { Chip } from "../chip/chip";
import { isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { SearchField } from "../search-field/search-field";
import { Skeleton } from "../skeleton/skeleton";

import { dictionary } from "@/src/lib/i18n/dictionary";

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
  /** `dark` where the module stands on a photo surface or the ink section. */
  readonly tone?: "light" | "dark";
  /** The input's DOM id — required where a page renders the module twice. */
  readonly id?: string;
  /** Native validation, where an empty submit is not a page state (F-3-14). */
  readonly required?: boolean;
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
  locale = "de",
  query,
  label,
  hint,
  suggestions,
  defaultValue,
  placeholder,
  submitLabel,
  submitDataCta,
  tone = "light",
  id,
  required = false,
  state = "ready",
  className,
}: PlaceSearchProps) {
  // The three words come from the dictionary unless the page's own content
  // names one, so a page that forgets to pass its own copy falls back to the
  // visitor's language rather than to German (F-2-4, same root cause as
  // `state/open.md` row 101).
  const words = dictionary(locale).search;
  const resolvedLabel = label ?? words.label;
  const resolvedHint = hint ?? words.hint;
  const resolvedPlaceholder = placeholder ?? words.placeholder;

  const classes = [styles.module, tone === "dark" ? styles.dark : undefined, className]
    .filter(Boolean)
    .join(" ");

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
        id={id}
        label={resolvedLabel}
        locale={locale}
        placeholder={resolvedPlaceholder}
        query={query}
        required={required}
        submitDataCta={submitDataCta}
        submitLabel={submitLabel}
        to={to}
      />
      <p className={styles.hint}>{resolvedHint}</p>
      {suggestions && suggestions.length > 0 ? (
        <div className={styles.suggestions}>
          {suggestions.map((suggestion) => (
            <Chip key={suggestion.label} locale={locale} query={suggestion.query} to={suggestion.to}>
              {suggestion.label}
            </Chip>
          ))}
          {state === "mocked" ? <DemoDataBadge locale={locale} /> : null}
        </div>
      ) : null}
    </div>
  );
}

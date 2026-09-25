import { Chip } from "../chip/chip";
import { isPending, type DataStateProps } from "../data-state";
import { SearchField } from "../search-field/search-field";
import { Skeleton } from "../skeleton/skeleton";

import { LocateControl } from "./locate-control";
import { PlaceTypeahead } from "./typeahead";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { LinkOptions } from "../route-link/href";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

import styles from "./place-search.module.css";

export interface PlaceSuggestion {
  readonly label: string;
  readonly to: RouteId;
  readonly query?: Readonly<Record<string, string | number | undefined>>;
}

export interface PlaceSearchProps extends DataStateProps, Omit<LinkOptions, "hash"> {
  /** Where the plain GET form navigates — the classification target (TS-WEB-0008 D7). */
  readonly to: RouteId;
  readonly label?: string;
  /** The helper text under the field. It speaks about names — never about a postcode (D7, A16). */
  readonly hint?: string;
  /** Server-resolved candidates rendered as chips (the registration flow's ambiguous step) — never a fetch in this component. */
  readonly suggestions?: readonly PlaceSuggestion[];
  readonly defaultValue?: string;
  /** The field's own placeholder — the second locale needs its own word. */
  readonly placeholder?: string;
  readonly submitLabel?: string;
  /** The submit carries `arrow-right` — a flow step, not a search (brief, page 5). */
  readonly submitOnward?: boolean;
  /** Passed to the submit control: the primary conversion of a "know what is on" page (TS-WEB-0006 D4). */
  readonly submitDataCta?: string;
  /** `dark` where the module stands on a photo surface or the ink section. */
  readonly tone?: "light" | "dark";
  /** The input's DOM id — required where a page renders the module twice. */
  readonly id?: string;
  /** Native validation, where an empty submit is not a page state (F-3-14). */
  readonly required?: boolean;
  /** The submit control, where the page owns it — DEC-0078. See `search-field`. */
  readonly submit?: ReactNode;
  /**
   * The typeahead, off by default. It is a **pure enhancement**: the module
   * stays a plain GET form, the suggestion overlay takes no layout space, and
   * a page that does not want the extra client chunk simply does not ask for
   * it (the 404 page, the order flow's scope step may decline it — D7a "Where").
   */
  readonly typeahead?: boolean;
  /**
   * The "use my location" control beside the field (TS-WEB-0010 D5, TS-WEB-0008
   * D7's coordinates row). Follows `typeahead` unless a page says otherwise:
   * the surfaces that carry the enhancement carry the control, the ones that
   * decline it stay the plain form.
   */
  readonly geolocation?: boolean;
  readonly className?: string;
}

/**
 * 41 `place-search` [PROPOSED] — TS-WEB-0008 D7.
 *
 * Structure: `search-field`, the helper line beneath it with the geolocation
 * control beside the hint, the suggestion overlay drawn over the page
 * (`typeahead`), and optionally server-resolved candidates as `chip`s — the
 * same component and behaviour everywhere it stands (`/`, `/dein-ort`,
 * `/dein-ort/starten`, `/deine-region`, the registration flow's step 1, the
 * order flow's scope step, 404). The input is a **place name**; no surface
 * of it names a postcode (DEC-0079, TS-WEB-0008-A16).
 * States (D-9, all four):
 *   loading  → the field's own 56 px reserved as a `skeleton` control;
 *   empty    → the field alone, no suggestion row;
 *   degraded → the field alone — an upstream error is never shown as an
 *              error here (TS-WEB-0008 D7): the visitor stays where she is;
 *   mocked   → the field plus mocked suggestion chips and `demo-data-badge`.
 * Inherits: the 56 px pill with the nested 44 px submit; `paper` everywhere.
 * Space: 56 px fixed for the field; the overlay reserves nothing and shifts
 * nothing (D7a "Layout"); the chip row reserves nothing when absent.
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
  submitOnward,
  submitDataCta,
  tone = "light",
  id,
  required = false,
  submit,
  typeahead = false,
  geolocation = typeahead,
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

  // `search-field`'s own default, restated so the enhancement and the input
  // cannot disagree about which element it attaches to.
  const inputId = id ?? "ort-suche";

  return (
    <div className={classes}>
      <div className={styles.fieldWrap}>
        <SearchField
          defaultValue={defaultValue}
          id={inputId}
          label={resolvedLabel}
          locale={locale}
          placeholder={resolvedPlaceholder}
          query={query}
          required={required}
          submit={submit}
          submitDataCta={submitDataCta}
          submitLabel={submitLabel}
          submitOnward={submitOnward}
          to={to}
        />
        {typeahead ? <PlaceTypeahead inputId={inputId} locale={locale} query={query} to={to} /> : null}
      </div>
      <div className={styles.meta}>
        <p className={styles.hint}>{resolvedHint}</p>
        {geolocation ? <LocateControl locale={locale} query={query} to={to} tone={tone} /> : null}
      </div>
      {suggestions && suggestions.length > 0 ? (
        <div className={styles.suggestions} data-demo={state === "mocked" ? "true" : undefined}>
          {suggestions.map((suggestion) => (
            <Chip key={suggestion.label} locale={locale} query={suggestion.query} to={suggestion.to}>
              {suggestion.label}
            </Chip>
          ))}
        </div>
      ) : null}
    </div>
  );
}

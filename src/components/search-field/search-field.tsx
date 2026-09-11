import { Icon } from "../icon/icon";
import { linkHref, type LinkOptions } from "../route-link/href";

import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./search-field.module.css";

export interface SearchFieldProps extends Omit<LinkOptions, "hash"> {
  /** Where the search goes — a route id, never a literal path. */
  readonly to: RouteId;
  /** The visible-to-assistive-tech label. Required: a placeholder is no label. */
  readonly label: string;
  readonly placeholder?: string;
  readonly submitLabel?: string;
  readonly name?: string;
  readonly defaultValue?: string;
  readonly id?: string;
  /**
   * The conversion marker on the submit control. Where the focus job is
   * "know what is on", the primary conversion **is** this submit and not a
   * link to another page (TS-006 D4, TS-019-A2) — so the marker has to be
   * reachable from the page that owns it. Absent by default: only one
   * element per page carries it (TS-006 D3).
   */
  readonly submitDataCta?: string;
  readonly className?: string;
}

/**
 * 2 `search-field` [FIXED] — SRC-014 §Search field.
 *
 * Structure: one 56 px `paper` pill holding the `map-pin`, the input with its
 * placeholder in `muted`, and the submit button as a 44 px pill nested inside
 * with a 6 px inset. A plain GET form: it works with no JavaScript at all.
 * States: the control itself has none — it is never disabled, never spinning.
 * The module around it (`place-search`, §2.4) owns the result states.
 * Inherits: radius 999 on both pills; `paper` on a photo and on a colour
 * surface alike.
 * Space: 56 px reserved everywhere it stands, including the 404 page.
 * A11y: a real `<label>` bound by `htmlFor`; the icon is decorative;
 * `:focus-within` lifts the whole pill so the compound control shows focus.
 */
export function SearchField({
  to,
  locale,
  query,
  label,
  placeholder = "Ort oder Postleitzahl",
  submitLabel = "Suchen",
  name = "ort",
  defaultValue,
  id = "ort-suche",
  submitDataCta,
  className,
}: SearchFieldProps) {
  return (
    <form
      action={linkHref(to, { locale })}
      className={[styles.form, className].filter(Boolean).join(" ")}
      method="get"
      role="search"
    >
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {Object.entries(query ?? {}).map(([key, value]) =>
        value === undefined ? null : (
          <input key={key} name={key} type="hidden" value={String(value)} />
        ),
      )}
      <div className={styles.field}>
        <Icon className={styles.pin} name="map-pin" size={24} />
        <input
          autoComplete="off"
          className={styles.input}
          defaultValue={defaultValue}
          enterKeyHint="search"
          id={id}
          name={name}
          placeholder={placeholder}
          spellCheck={false}
          type="search"
        />
        <button className={styles.submit} data-cta={submitDataCta} type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

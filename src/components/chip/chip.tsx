import { Icon, type IconName } from "../icon/icon";
import { RouteLink } from "../route-link/route-link";

import type { LinkOptions } from "../route-link/href";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

import styles from "./chip.module.css";

export interface ChipProps extends LinkOptions {
  /** Link form: the chip navigates (a neighbouring place, a scope item). */
  readonly to?: RouteId;
  /** Control form: the chip submits its value with the surrounding GET form. */
  readonly name?: string;
  readonly value?: string;
  /** Selected filter chip — `aria-pressed`, plus a non-colour-only mark. */
  readonly selected?: boolean;
  readonly tone?: "light" | "dark";
  readonly icon?: IconName;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * 4 `chip` [FIXED] — SRC-014 §Badge and chip, decision D-3.
 *
 * Structure: the tappable sibling of `badge` — neighbouring places, scope
 * items, the archive type filter. Radius 999, mono, weight 700.
 * States: `selected` is the only one, and it is marked by fill *and* a check
 * glyph, never by colour alone.
 * Inherits: the badge's shape and type; the button's focus ring.
 * Space: the design system says at least 40 px; the component ships 44 px,
 * because TS-002 D2 adopts WCAG 2.5.5 AAA and 44 also satisfies "≥ 40".
 * A11y: a real `<a>` when it navigates, a real `<button>` when it filters.
 */
export function Chip({
  to,
  locale,
  query,
  hash,
  name,
  value,
  selected = false,
  tone = "light",
  icon,
  className,
  children,
}: ChipProps) {
  const classes = [
    styles.chip,
    tone === "dark" ? styles.dark : styles.light,
    selected ? styles.selected : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {selected ? <Icon name="check" size={18} /> : icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </>
  );

  if (to) {
    return (
      <RouteLink
        className={classes}
        current={selected}
        hash={hash}
        locale={locale}
        query={query}
        styled={false}
        to={to}
      >
        {content}
      </RouteLink>
    );
  }

  return (
    <button
      aria-pressed={selected}
      className={classes}
      name={name}
      type="submit"
      value={value}
    >
      {content}
    </button>
  );
}

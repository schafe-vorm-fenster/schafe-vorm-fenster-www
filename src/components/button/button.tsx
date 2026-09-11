import { Icon, type IconName } from "../icon/icon";
import { RouteLink } from "../route-link/route-link";

import type { LinkOptions } from "../route-link/href";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

import styles from "./button.module.css";

/** The five variants of the design system — no sixth exists. */
export const BUTTON_VARIANTS = [
  "primary-light",
  "primary-dark",
  "pulse",
  "secondary",
  "quiet",
] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  "primary-light": styles.primaryLight,
  "primary-dark": styles.primaryDark,
  pulse: styles.pulse,
  secondary: styles.secondary,
  quiet: styles.quiet,
};

const SIZE_CLASS = { primary: styles.primary, compact: styles.compact };

export interface ButtonProps extends LinkOptions {
  readonly variant?: ButtonVariant;
  /** 56 px is the primary action; 44 px is the secondary/nested control. */
  readonly size?: "primary" | "compact";
  /** Adds the 24 px `arrow-right` where the action leads onward. */
  readonly onward?: boolean;
  /** A leading 24 px glyph, decorative — the label always carries the meaning. */
  readonly icon?: IconName;
  /** Renders a link to a route id. Without it the component is a `<button>`. */
  readonly to?: RouteId;
  readonly type?: "button" | "submit" | "reset";
  readonly name?: string;
  readonly value?: string;
  readonly disabled?: boolean;
  readonly id?: string;
  /** The conversion marker the analytics registry reads (TS-006). */
  readonly dataCta?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * 1 `button` [FIXED] — SRC-014 §Button.
 *
 * Structure: five variants — primary on light (`ink`/`paper`), primary on
 * dark (`lime-500`/`ink`), pulse (`himbeere-600`/`paper`, the paid conversion
 * only), secondary (`paper`/`ink`), quiet (transparent/`lime-800`). Height
 * 56, padding 0 24, radius 999, weight 800 at 18 px, with a 24 px
 * `arrow-right` where the action leads onward.
 * States: none of its own — it never carries a spinner, and it is never
 * disabled while waiting, because nothing here waits on the client.
 * Inherits: radius 999, no border, no shadow; the focus ring of the shell.
 * Space: the height is fixed, so a longer label wraps the page, not the box.
 * A11y: a real `<button>` for actions and a real `<a>` for navigation — the
 * link form goes through the route facade, so it supports Cmd-click and
 * middle-click. Touch target 56 px, 44 px in the compact size.
 */
export function Button({
  variant = "primary-light",
  size = "primary",
  onward = false,
  icon,
  to,
  locale,
  query,
  hash,
  type = "button",
  name,
  value,
  disabled,
  id,
  dataCta,
  className,
  children,
}: ButtonProps) {
  const classes = [styles.button, VARIANT_CLASS[variant], SIZE_CLASS[size], className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon ? <Icon name={icon} size={24} /> : null}
      <span className={styles.label}>{children}</span>
      {onward ? <Icon name="arrow-right" size={24} /> : null}
    </>
  );

  if (to) {
    return (
      <RouteLink
        className={classes}
        data-cta={dataCta}
        hash={hash}
        id={id}
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
      className={classes}
      data-cta={dataCta}
      disabled={disabled}
      id={id}
      name={name}
      type={type}
      value={value}
    >
      {content}
    </button>
  );
}

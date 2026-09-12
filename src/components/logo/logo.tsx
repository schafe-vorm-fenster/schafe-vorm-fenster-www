import Image from "next/image";
import { Fragment } from "react";

import sheepMark from "@schafe-vorm-fenster/brand-design/logo.svg";

import { RouteLink } from "../route-link/route-link";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./logo.module.css";

export interface LogoProps {
  /** `wordmark` is the two-line lockup, `url` the editorial mono variant. */
  readonly variant?: "wordmark" | "url" | "mark";
  /** Renders the logo as the link home. Off inside an existing link. */
  readonly link?: boolean;
  /**
   * Below `md` the wordmark is not painted and the mark stands alone — the
   * design system allows the mark at 38–40 px on its own (SRC-014 §Logo), and
   * the phone header needs the width for the calendar pill and the burger
   * (Jan's round-3 point 3). The wordmark stays in the markup and returns at
   * `md`; the link's accessible name is the dictionary's either way, so
   * nothing is lost to the accessibility tree at any width.
   */
  readonly compact?: boolean;
  readonly locale?: Locale;
  readonly className?: string;
}

const WORDMARK_LINES = ["Schafe vorm", "Fenster"] as const;
const EDITORIAL_URL = "schafe-vorm-fenster.de";

/**
 * 7 `logo` [FIXED] — SRC-014 §Logo.
 *
 * Structure: the sheep mark at 38–40 px, clipped to radius 999 — the same
 * radius as every control — beside the wordmark in two lines at 15/800, or
 * the URL in mono where the context is editorial.
 * States: none; the asset is a package subpath resolved at build time, never
 * a fetch (TS-017-A6 forbids a logo file in this repository).
 * Inherits: radius 999 on the mark. The brand package's README says
 * `radius-lg`; the website design system says 999 and the concept document
 * wins — state/open.md row 9.
 * Space: fixed; the mark is a 1:1 box at a fixed pixel size, so the header
 * height is known before paint.
 * A11y: the link form carries the site name as its accessible name, from the
 * dictionary and in the page's language (F-2-33); the mark itself is
 * decorative, because the wordmark beside it is real text.
 */
export function Logo({
  variant = "wordmark",
  link = true,
  compact = false,
  locale = "de",
  className,
}: LogoProps) {
  const content = (
    <>
      <Image
        alt=""
        className={styles.mark}
        height={40}
        priority
        src={sheepMark}
        width={40}
      />
      {variant === "wordmark" ? (
        <span className={styles.wordmark}>
          {WORDMARK_LINES.map((line, index) => (
            <Fragment key={line}>
              {/* F-3-1: the separator that makes the accessible name right.
                  The two lines are adjacent elements, so the accessible-name
                  algorithm's flattened text was "Schafe vormFenster" — not a
                  substring of the `aria-label`, which is WCAG 2.1 SC 2.5.3
                  (Label in Name) failing on two nodes of all 24 routes.
                  `.wordmark` is a column flex container and CSS Flexbox
                  §4 does not render a white-space-only anonymous flex item,
                  so this space is a space to the accessibility tree and
                  nothing at all to the layout. */}
              {index > 0 ? " " : null}
              <span className={styles.line}>{line}</span>
            </Fragment>
          ))}
        </span>
      ) : null}
      {variant === "url" ? <span className={styles.url}>{EDITORIAL_URL}</span> : null}
    </>
  );

  const classes = [styles.logo, className].filter(Boolean).join(" ");

  if (!link) {
    return (
      <span className={classes} data-compact={compact ? "phone" : undefined}>
        {content}
      </span>
    );
  }

  return (
    <RouteLink
      // F-2-33: hard-coded German, so the one landmark link every `/en` page
      // opens with announced itself in the wrong language.
      aria-label={dictionary(locale).nav.logoHome}
      className={classes}
      data-compact={compact ? "phone" : undefined}
      locale={locale}
      styled={false}
      to="home"
    >
      {content}
    </RouteLink>
  );
}

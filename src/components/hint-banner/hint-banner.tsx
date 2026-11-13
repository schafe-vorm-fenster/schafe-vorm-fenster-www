import { Icon } from "../icon/icon";
import { Tag } from "../tag/tag";

import type { Locale } from "@/src/lib/i18n/locales";
import type { StandardSource } from "@/src/lib/pricing/standard-sources";
import type { ReactNode } from "react";

import styles from "./hint-banner.module.css";

export interface HintBannerProps {
  /** The boundary statement — copy, under SRC-0017; one block of text. */
  readonly children: ReactNode;
  /** `standardSources()` — the offering record's list, never one written on a page. */
  readonly sources?: readonly StandardSource[];
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * `hint-banner` [PROPOSED] — TS-WEB-0022 D11, DEC-0107 §3, TS-WEB-0006 D10.
 *
 * Structure: one block — an `info` glyph in a `lime-100` well, the statement
 * beside it, and the standard sources as a tag row beneath. It states a
 * boundary: a source the platform already supports publishes free; an
 * individual integration into a system it does not support is the add-on.
 * States: none — the list is the package's at build time.
 * Inherits: `surface` ground, radius 0, no border, no shadow; `tag` for the
 * sources.
 * Space: static content.
 * A11y: `role="note"`; the glyph is decorative; the sources are a list.
 *
 * What it is **not**: it carries no `data-cta` of any rung and declares no
 * conversion (a boundary is not an action, DEC-0082 §1); it renders no
 * figure — the caller's copy must not either (D11, A17); it is not a status
 * badge (that is the mechanism's, `status-badge`).
 */
export function HintBanner({ children, sources, locale = "de", className }: HintBannerProps) {
  return (
    <div
      className={[styles.banner, className].filter(Boolean).join(" ")}
      data-hint-banner="true"
      role="note"
    >
      <span className={styles.well}>
        <Icon name="info" />
      </span>
      <div className={styles.body}>
        <div className={styles.text}>{children}</div>
        {sources && sources.length > 0 ? (
          <ul className={styles.sources}>
            {sources.map((source) => (
              <li data-standard-source={source.id} key={source.id}>
                <Tag>{source.label[locale]}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

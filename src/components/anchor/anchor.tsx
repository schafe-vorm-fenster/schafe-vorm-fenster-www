import { useId } from "react";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { isExternalHref, linkTarget } from "@/src/lib/routes/link-target";

import type { Locale } from "@/src/lib/i18n/locales";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import styles from "./anchor.module.css";

export interface AnchorProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> {
  /** Any target: another origin opens a new tab, everything else stays (DEC-0169). */
  readonly href: string;
  /** The language the new-tab note is read in. */
  readonly locale?: Locale;
  readonly "data-cta"?: string;
  readonly "data-channel"?: string;
  readonly children: ReactNode;
}

/**
 * `anchor` — the one raw `<a>` whose target may leave the site (DEC-0169,
 * SRC-0014 §Links, `TS-WEB-0016` D18).
 *
 * Structure: an `<a>` whose `target`/`rel` are not the caller's to choose:
 * `linkTarget()` reads them off the href, so a link to another origin opens a
 * new tab with `rel="noopener noreferrer"` and a `tel:`, `mailto:` or site
 * link stays in the tab. `outbound-link`, `button`'s href form,
 * `contact-action-row` and the legal texts render through it; a raw `<a>`
 * with any other target fails `scripts/external-links.test.ts`
 * (`TS-WEB-0016-A25`).
 * States: none.
 * Inherits: whatever the caller's class paints — this component draws nothing.
 * Space: the note is visually hidden and out of flow, so it changes no box.
 * A11y: the new tab is **said**, not only shown, and never shown as text
 * (owner, issue 100 — the glyph is the visible sign): a visually hidden
 * "öffnet neuen Tab" follows the link and is joined to it through
 * `aria-describedby` — in the description, never in the accessible name,
 * which keeps `TS-WEB-0016-A23` and 2.5.3 intact. The visible half is the
 * `external-link` glyph the callers already draw.
 */
export function Anchor({
  href,
  locale = "de",
  className,
  children,
  "aria-describedby": describedBy,
  ...rest
}: AnchorProps) {
  const id = useId();
  const noteId = `new-tab-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const external = isExternalHref(href);
  const note = external;
  const describedByIds = [describedBy, note ? noteId : undefined].filter(Boolean).join(" ");

  const anchor = (
    <a
      {...rest}
      aria-describedby={describedByIds === "" ? undefined : describedByIds}
      className={className}
      data-new-tab={external ? "" : undefined}
      href={href}
      {...linkTarget(href)}
    >
      {children}
    </a>
  );

  if (!note) return anchor;

  return (
    <>
      {anchor}
      <span className={styles.note} id={noteId}>
        {dictionary(locale).outboundLink.newTab}
      </span>
    </>
  );
}

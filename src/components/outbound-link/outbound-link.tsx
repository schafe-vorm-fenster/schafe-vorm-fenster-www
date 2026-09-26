import { Icon } from "../icon/icon";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import styles from "./outbound-link.module.css";

export interface OutboundLinkProps {
  /** The external URL. Internal targets go through `route-link` instead. */
  readonly href: string;
  /** Opens a new tab — and then the marking under the control says so. */
  readonly newTab?: boolean;
  /** Named where a third party receives data by following this link. */
  readonly recipient?: string;
  /**
   * The marking, written out instead of assembled.
   *
   * G-5: "(öffnet neuen Tab) · Daten gehen an Google" under a button is two
   * disclosures stacked into one line of machine-assembled prose, and the
   * data note belongs in the privacy section the page already links to. A
   * page that has such a section passes one finished sentence here — e.g.
   * „Öffnet Google Kalender in einem neuen Tab." — and the assembled line
   * stands down.
   */
  readonly disclosure?: string;
  readonly variant?: "inline" | "secondary" | "quiet";
  /**
   * Puts the marking on its own line below the control, whatever the variant.
   *
   * `TS-WEB-0016 D16`'s Position row is unconditional for the two surfaces it
   * names — the contact section's first action row and the lead fallback's
   * `/start` link: "**under the control, never inside its label.** A label
   * states the action; a recipient is a separate fact and belongs on its own
   * line". The control variants stack anyway; the `inline` variant does not,
   * because a link inside a sentence keeps its marking in the line (an archive
   * row, a quote card, a proof card). D16 does not reach those, so the stacked
   * form is a caller's choice rather than the default.
   */
  readonly markingOwnLine?: boolean;
  /** The conversion marker the analytics registry reads (TS-WEB-0006 D3) — e.g. `"equal-weight"`. */
  readonly dataCta?: string;
  /**
   * The id of the marking element, where a page carries two links to the same
   * target and the derived id would collide. Defaults to `outboundNoteId(href)`.
   */
  readonly noteId?: string;
  /**
   * The page's language — the new-tab announcement was hard-coded German
   * regardless of it (F-2-4, same root cause as `state/open.md` row 101).
   */
  readonly locale?: Locale;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * The id the marking element carries, derived from the target.
 *
 * `aria-describedby` needs an id and this is a server component, so there is
 * no `useId` to reach for: the target is the one value that distinguishes one
 * outbound link from another, and it is stable across renders and across the
 * prerender/hydrate boundary. Two links to the *same* target on one page
 * would share the id — which resolves to the same sentence and so reads
 * correctly, but a page that wants two distinct markings passes `noteId`.
 *
 * The slug is readable but lossy: it is the first **48 characters** of the
 * target, so two targets that agree on that prefix and differ only after it
 * would produce the same id — a duplicate DOM id and an `aria-describedby`
 * that resolves to the wrong sentence. The review round measured the exposed
 * surface and it is not the route table: nine of the twelve outbound URLs the
 * markings are rendered from (`@schafe-vorm-fenster/media-echo`,
 * `@schafe-vorm-fenster/proof`) are already longer than 48 characters, and
 * they are owner-editable content data. So the id carries a **fingerprint of
 * the whole href** after the slug: the slug stays legible in the DOM, and two
 * distinct targets cannot share an id however they were truncated. `noteId`
 * remains the caller's override, not a collision workaround.
 *
 * The dashes are trimmed *after* the slice, so a cut that lands on a
 * separator does not leave a trailing dash before the fingerprint.
 */
export function outboundNoteId(href: string): string {
  const slug = href
    .replace(/^[a-z]+:(\/\/)?/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .slice(0, 48)
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `outbound-note-${slug || "link"}-${hrefFingerprint(href)}`;
}

/**
 * FNV-1a over the full target, base 36 — a pure function of the href, so it is
 * identical on the server and after hydration, which is why this is not a
 * random suffix or a counter. Seven characters of base 36 hold the whole
 * 32-bit value; collisions need two hrefs whose entire text hashes alike, not
 * two that share a prefix.
 */
function hrefFingerprint(href: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < href.length; index += 1) {
    hash ^= href.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).padStart(7, "0");
}

/**
 * 16 `outbound-link` [PROPOSED] — TS-WEB-0016 D7/D16, DEC-0013, DEC-0081 §3.
 *
 * Structure: the external link — app handover, outlet original, the `/start`
 * fallback. The link text names source and subject; an `external-link` glyph
 * at 18 px sits after it. Where the link opens a new tab or hands the visitor
 * to a third party, the **marking of TS-WEB-0016 D16** follows the control as
 * its own element: never inside the label, never inside the `<a>`.
 * States: static — no embed, no iframe, no third-party script. A link is the
 * privacy-preserving form of an integration (TS-WEB-0016 D9).
 * Inherits: inline link treatment, or the secondary/quiet button treatment;
 * the marking takes the `meta` type role, the smallest the scale carries.
 * Space: inline; the glyph never shifts the line box, because it sits in an
 * inline-flex box with the text. The marking stands on its own line under the
 * control wherever D16 applies — both control variants, and the `inline`
 * variant when the caller passes `markingOwnLine` (D16 Position). In the
 * `inline` variant otherwise it follows in the line and wraps under it.
 * A11y: TS-WEB-0016-A23 — the marking is a separate element **after** the
 * control in DOM order, associated through `aria-describedby`, and the
 * control's own label and accessible name carry neither the recipient nor a
 * parenthetical about a new tab. It used to sit inside the `<a>`: visible in
 * the `inline` variant and clipped in the two control variants, but in the
 * accessible name either way, which is the half of A23 that failed. The
 * marking is a `span`, so it nests inside a paragraph or a sentence as
 * validly as beside a pill; it is not a button, not a link and not a consent
 * control.
 */
export function OutboundLink({
  href,
  newTab = false,
  recipient,
  disclosure: writtenDisclosure,
  variant = "inline",
  markingOwnLine = false,
  dataCta,
  noteId: givenNoteId,
  locale = "de",
  className,
  children,
}: OutboundLinkProps) {
  const classes = [styles.link, styles[variant], className].filter(Boolean).join(" ");
  const words = dictionary(locale).outboundLink;
  const control = variant !== "inline";

  const assembled = [
    newTab ? words.newTab : null,
    recipient ? `${words.dataGoesTo} ${recipient}` : null,
  ].filter((part): part is string => Boolean(part));
  const marking = writtenDisclosure ?? (assembled.length > 0 ? assembled.join(" · ") : undefined);
  const noteId = marking === undefined ? undefined : (givenNoteId ?? outboundNoteId(href));

  const anchor = (
    <a
      aria-describedby={noteId}
      className={classes}
      data-cta={dataCta}
      href={href}
      rel={newTab ? "noopener" : undefined}
      target={newTab ? "_blank" : undefined}
    >
      <span className={styles.text}>{children}</span>
      <Icon className={styles.glyph} name="external-link" size={18} />
    </a>
  );

  if (marking === undefined) return anchor;

  return (
    <span className={control ? styles.control : markingOwnLine ? styles.stacked : styles.marked}>
      {anchor}
      {/* D16: after the control, never inside its label; the `meta` role;
          associated through `aria-describedby` above. */}
      <span className={styles.meta} id={noteId}>
        {marking}
      </span>
    </span>
  );
}

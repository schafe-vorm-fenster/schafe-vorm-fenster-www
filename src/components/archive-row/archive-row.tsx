import { Badge } from "../badge/badge";
import { MediaFrame } from "../media-frame/media-frame";
import { OutboundLink } from "../outbound-link/outbound-link";

import { formatArchiveDate } from "./format";

import type { ArchivePrecision } from "./format";

import styles from "./archive-row.module.css";

export { ARCHIVE_PRECISIONS, type ArchivePrecision } from "./format";

export interface ArchiveRowProps {
  /** The original title, in its source language (DEC-026) — never translated. */
  readonly title: string;
  readonly date: string | Date;
  readonly precision?: ArchivePrecision;
  readonly outlet: string;
  /** One or more type badges, e.g. "Presse", "Radio". */
  readonly types: readonly string[];
  /** One localized sentence of context — the only translated text in the row. */
  readonly contextLine: string;
  /** Absent where the entry carries no outlet URL — then the row has no link. */
  readonly href?: string;
  /** ≤ 100 KB, `ratio-proof`, lazy — absent for the plain variant. */
  readonly previewSrc?: string;
  readonly previewAlt?: string;
  /**
   * Additive (plan/component-inventory.md §4 TS-028, mock rule): marks the
   * row as generated dummy content (`data-demo="true"`) while `Q-045`
   * leaves every real entry uncleared (`state/open.md` #1). The group badge
   * is the caller's (`src/components/README.md` — "the module owns the
   * marking, not the row"); this only carries the check-visible attribute.
   */
  readonly demo?: boolean;
  readonly className?: string;
}

/**
 * 33 `archive-row` [PROPOSED] — content type 12 `archive-entry`, TS-028 D7.
 *
 * Structure: the `event-row` shape, not a card — date at its stated
 * precision, the original title in its source language, the outlet, one or
 * more type badges, one localized context line, and one outbound link. Two
 * fixed variants: **with preview** (a still image) and **without**, each
 * declaring its own height via `previewSrc`'s presence.
 * States: no "Foto gesucht" hatch here — this page has no conversion, so a
 * missing preview is simply the variant without one, never an invitation.
 * Video, audio and PDF sources get a still or nothing, never a player, an
 * embed or a download. No link renders where the entry has no outlet URL.
 * An uncleared entry does not exist anywhere — this component only ever
 * receives cleared entries, by construction of the page that composes it.
 * Inherits: hairline between rows, no gap; the title clamps to two lines,
 * the context line to one.
 * Space: both variants occupy their final height before the preview loads —
 * the preview is lazy and async-decoded through `media-frame`.
 * A11y: this row carries no heading of its own — the page's year `h2` is the
 * only heading between the archive's `h1` and its rows, so no level is
 * skipped by adding one here.
 */
export function ArchiveRow({
  title,
  date,
  precision = "day",
  outlet,
  types,
  contextLine,
  href,
  previewSrc,
  previewAlt = "",
  demo = false,
  className,
}: ArchiveRowProps) {
  const { iso, label } = formatArchiveDate(date, precision);

  return (
    <article
      className={[styles.row, previewSrc ? styles.withPreview : styles.plain, className]
        .filter(Boolean)
        .join(" ")}
      data-archive-type={types.join(" ")}
      data-demo={demo ? "true" : undefined}
    >
      {previewSrc ? (
        <MediaFrame alt={previewAlt} className={styles.preview} ratio="proof" sizes="120px" src={previewSrc} />
      ) : null}
      <div className={styles.body}>
        <time className={styles.date} dateTime={iso}>
          {label}
        </time>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.outlet}>{outlet}</p>
        <div className={styles.badges}>
          {types.map((type) => (
            <Badge key={type} tone="neutral">
              {type}
            </Badge>
          ))}
        </div>
        <p className={styles.context}>{contextLine}</p>
        {href ? (
          <OutboundLink className={styles.link} href={href} newTab>
            Original ansehen
          </OutboundLink>
        ) : null}
      </div>
    </article>
  );
}

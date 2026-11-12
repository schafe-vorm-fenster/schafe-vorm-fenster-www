import { Icon } from "../icon/icon";
import { photoUrl } from "../photo-surface/url";

import { legendCenters } from "@/src/lib/live/dorfkalender";

import type { PhoneRow } from "@/src/lib/live/dorfkalender";
import type { ReactNode } from "react";

import styles from "./dorfkalender-intro.module.css";

export interface DorfkalenderPhoneProps {
  /** The text alternative of the whole drawing — a reader hears this, not every row. */
  readonly imageLabel: string;
  readonly placeName: string;
  /** The header's second line ("Gemeinde Schmatzin"), where known. */
  readonly commune?: string;
  /** The place's photograph, where the browser holds one. */
  readonly photoSrc?: string;
  /** The © control of that photograph; stands over the header, outside the image role. */
  readonly credit?: ReactNode;
  /** Five rows, one per legend entry after the first. */
  readonly rows: readonly PhoneRow[];
  /** Six labels: the place, the four categories, the neighbours. */
  readonly legend: readonly string[];
  readonly demo?: boolean;
}

/**
 * The drawn phone with its fixed legend — issue issue 143, DEC-0192.
 *
 * A picture of a device, not a component the visitor operates: the whole
 * drawing is one `role="img"`, so a screen reader reads its label and not
 * every row. Row height, header height and display rim are the numbers of
 * `PHONE_GEOMETRY`; the legend is positioned from the same numbers
 * (`legendCenters`), so an entry always stands level with its area.
 */
export function DorfkalenderPhone({
  imageLabel,
  placeName,
  commune,
  photoSrc,
  credit,
  rows,
  legend,
  demo = false,
}: DorfkalenderPhoneProps) {
  const centers = legendCenters();
  return (
    <div className={styles.graphic} data-demo={demo ? "true" : undefined} data-dorfkalender-graphic="">
      <div className={styles.scaled}>
        <div aria-label={imageLabel} className={styles.drawing} role="img">
          <div className={styles.phone}>
            <span className={styles.key} data-key="1" />
            <span className={styles.key} data-key="2" />
            <span className={styles.key} data-key="3" />
            <div className={styles.screen}>
              <div
                className={styles.header}
                data-has-photo={photoSrc ? "true" : "false"}
                style={photoSrc ? { backgroundImage: photoUrl(photoSrc) } : undefined}
              >
                <p className={styles.placeName}>{placeName}</p>
                {commune ? <p className={styles.commune}>{commune}</p> : null}
              </div>
              <ul className={styles.rows}>
                {rows.map((row, index) => (
                  <li className={styles.row} data-row-source={row.source} data-slot={index + 1} key={index}>
                    <span className={styles.sheet}>
                      <span className={styles.weekday}>{row.weekday}</span>
                      <span className={styles.day}>{row.day}</span>
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.meta}>
                        {row.time ? (
                          <span className={styles.metaItem}>
                            <Icon className={styles.metaIcon} name="clock" size={18} />
                            {row.time}
                          </span>
                        ) : null}
                        <span className={`${styles.metaItem} ${styles.metaPlace}`}>
                          <Icon className={styles.metaIcon} name="map-pin" size={18} />
                          <span className={styles.ellipsis}>{row.place}</span>
                        </span>
                      </span>
                      <span className={`${styles.rowTitle} ${styles.ellipsis}`}>{row.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <span className={styles.island} />
          </div>
          <ol className={styles.legend}>
            {legend.map((label, index) => (
              <li className={styles.legendItem} key={index} style={{ top: `${centers[index]}px` }}>
                <span className={styles.legendLine} />
                <span className={styles.legendDot} />
                <span className={styles.legendLabel}>{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {credit ? <div className={styles.creditSlot}>{credit}</div> : null}
    </div>
  );
}

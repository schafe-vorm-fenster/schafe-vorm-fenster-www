import { Icon, type IconName } from "../icon/icon";

import type { ReactNode } from "react";

import styles from "./web-calendar-overlay.module.css";

/**
 * The three rows the drawing shows. Category, glyph and a day numeral only:
 * the titles are bars, so the drawing names no event and claims no date
 * (DEC-0162 §5). The categories are the platform's own taxonomy (SRC-0014
 * §Category colours).
 */
const ROWS: readonly { day: string; category: string; icon: IconName }[] = [
  { day: "04", category: "culture-tourism", icon: "landmark" },
  { day: "11", category: "community-life", icon: "users" },
  { day: "18", category: "everyday-supply", icon: "shopping-basket" },
];

export interface WebCalendarOverlayProps {
  /** The photograph the drawing lies on — a `media-frame`. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * `web-calendar-overlay` [PROPOSED] — SRC-0014 §Web-calendar overlay,
 * DEC-0162 §5, issue #32.
 *
 * Structure: a photograph with a stylised drawing of the website calendar
 * laid over it — a browser strip, the calendar's head and three rows (day
 * numeral, category coin, title bar). It says "a calendar on a website" at a
 * glance and nothing more: no event title, no month, no place, so it cannot
 * be read as real dates.
 * States: none; nothing in it is late data, so it reserves no space and
 * shifts nothing.
 * Inherits: flat `paper` block, radius 0, no border, no shadow; the coins are
 * the category tokens with their glyph tokens. It never touches a photo
 * surface's scrim: the photograph here is a `media-frame` with no reading band.
 * Layout: below `xl` the drawing stands under the photograph's lower edge,
 * overlapping it, right-aligned on the page gutter, so it covers no motif;
 * from `xl` it lies inside the photograph's lower right, on the container's
 * right edge.
 * A11y: decorative (`aria-hidden`). What it shows is said by the
 * photograph's `alt`, which names both the photograph and the drawing.
 */
export function WebCalendarOverlay({ children, className }: WebCalendarOverlayProps) {
  return (
    <div className={[styles.stage, className].filter(Boolean).join(" ")} data-web-calendar-overlay>
      <div className={styles.media}>{children}</div>
      <div aria-hidden="true" className={styles.drawing}>
        <div className={styles.chrome}>
          <Icon name="globe" size={18} />
          <span className={styles.address} />
        </div>
        <div className={styles.head}>
          <Icon name="calendar-days" />
          <span className={styles.headBar} />
        </div>
        <ul className={styles.rows}>
          {ROWS.map((row) => (
            <li className={styles.row} key={row.day}>
              <span className={styles.day}>{row.day}</span>
              <span className={styles.coin} data-category={row.category}>
                <Icon name={row.icon} size={18} />
              </span>
              <span className={styles.lines}>
                <span className={styles.titleBar} />
                <span className={styles.metaBar} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

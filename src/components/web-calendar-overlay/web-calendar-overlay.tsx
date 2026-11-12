"use client";

import { useEffect, useState } from "react";

import { Icon, type IconName } from "../icon/icon";

import type { EmbedCalendarCopy, EmbedCategoryId } from "@/src/lib/content/embed-calendar";

import styles from "./web-calendar-overlay.module.css";

/** The slideshow's step, from the owner's design (issue 145): 3.5 s per category. */
export const WEB_CALENDAR_INTERVAL_MS = 3500;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Glyph per category (SRC-0014 §Icons); the colour is the category's token in the CSS. */
const GLYPH: Record<EmbedCategoryId, IconName> = {
  "community-life": "users",
  "education-health": "heart-pulse",
  "everyday-supply": "shopping-basket",
  "culture-tourism": "theater",
};

export interface WebCalendarOverlayProps {
  readonly copy: EmbedCalendarCopy;
  readonly className?: string;
}

/**
 * `web-calendar-overlay` [PROPOSED] — the drawing of the website calendar that
 * sits on the embed scene's photograph (issue 145, DEC-0193; first drawn for
 * #32, DEC-0162 §5).
 *
 * Structure: a browser strip (globe, address), the calendar's head, a filter row
 * (funnel, four category buttons) and three event rows of the chosen category.
 * It is a client island and only this graphic is: the rest of the scene is
 * server markup. The prerender — what a crawler and a visitor without
 * JavaScript get — is the first category ("Gemeindeleben") with its three rows.
 * Behaviour: every 3.5 s the next category shows, then it starts over; a click
 * on a filter button (or focus entering the graphic) shows that category and
 * stops the advance for good; under `prefers-reduced-motion` nothing advances.
 * States: none late — all twelve rows are authored copy, so the graphic reserves
 * the height of three rows and shifts nothing.
 * Inherits: flat `paper` block, radius 0, no shadow; category colours are the
 * token set (`status-*`, `lime-800`, `category-culture-tourism`).
 * A11y: real buttons with `aria-pressed` and `aria-label`; the row list is
 * `aria-live="polite"`; the focus ring is the global 3 px violet with 2 px offset.
 * The graphic is stand-in data: `data-demo="true"` (DEC-0068).
 */
export function WebCalendarOverlay({ copy, className }: WebCalendarOverlayProps) {
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const count = copy.categories.length;
  const running = !stopped && !reduced;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), WEB_CALENDAR_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [running, count]);

  const category = copy.categories[active];

  return (
    <div
      aria-label={copy.graphicLabel}
      className={[styles.graphic, className].filter(Boolean).join(" ")}
      data-active={category.id}
      data-demo="true"
      data-web-calendar-overlay=""
      onFocus={() => setStopped(true)}
      role="group"
    >
      <div aria-hidden="true" className={styles.chrome}>
        <Icon name="globe" size={18} />
        <span className={styles.address}>{copy.address}</span>
      </div>
      <div className={styles.body}>
        <p className={styles.head}>
          <Icon name="calendar-days" />
          <span>{copy.title}</span>
        </p>
        <div aria-label={copy.filterLabel} className={styles.filters} role="group">
          <span aria-hidden="true" className={styles.funnel}>
            <Icon name="funnel" size={18} />
          </span>
          {copy.categories.map((entry, index) => (
            <button
              aria-label={entry.label}
              aria-pressed={index === active}
              className={styles.filter}
              data-category={entry.id}
              key={entry.id}
              onClick={() => {
                setActive(index);
                setStopped(true);
              }}
              type="button"
            >
              <Icon name={GLYPH[entry.id]} size={18} />
              <span aria-hidden="true" className={styles.filterText}>
                {entry.label}
              </span>
            </button>
          ))}
        </div>
        {/* Phone: the buttons are icons only, so the chosen category's name stands below. */}
        <p aria-hidden="true" className={styles.chosen}>
          {category.label}
        </p>
        <ul aria-live="polite" className={styles.rows}>
          {category.events.map((event) => (
            <li className={styles.row} data-category={category.id} key={`${category.id}-${event.day}`}>
              <span className={styles.date}>
                <span className={styles.day}>{event.day}</span>
                <span className={styles.weekday}>{event.weekday}</span>
              </span>
              <span className={styles.coin} data-category={category.id}>
                <Icon name={GLYPH[category.id]} size={18} />
              </span>
              <span className={styles.lines}>
                <span className={styles.title}>{event.title}</span>
                <span className={styles.meta}>{event.meta}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { EventRow, type EventRowProps } from "../event-row/event-row";
import { Icon } from "../icon/icon";
import { Logo } from "../logo/logo";
import { MediaFrame, type MediaFrameProps } from "../media-frame/media-frame";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./explain-stage.module.css";

/*
 * `explain-stage` — the state graphics of `explain-module` (SRC-0014 §Explain
 * module, `specs/contracts/design-system-contract.md` "explain-module",
 * TS-WEB-0022 D4 "graphic stage").
 *
 * Four graphics, one box each at `ratio-square`, so the stage that swaps
 * them never changes height (TS-WEB-0022-A19). Every one of them is a
 * **picture of a state**, not the state itself: nothing here is a form, a
 * control or a link (TS-WEB-0006-A17), and no sample data lives here — the
 * page passes it (DEC-0115).
 */

const stageClass = (variant: string, className?: string) =>
  [styles.stage, variant, className].filter(Boolean).join(" ");

/* ── 1 · StageImage ─────────────────────────────────────────────────────── */

export interface StageImageProps
  extends Pick<
    MediaFrameProps,
    "src" | "alt" | "notDepicting" | "priority" | "sizes" | "unoptimized" | "placeholderId" | "state"
  > {
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * Structure: a photograph at `ratio-square`, or — when no asset exists —
 * what `media-frame` renders for a missing photo. Nothing is drawn here
 * that `media-frame` does not draw; the square box is the only addition.
 * States: `media-frame`'s four (D-9); a missing `src` is its empty case.
 * Inherits: radius 0, no border, no shadow.
 * Space: the square is declared before the asset arrives.
 * A11y: `alt` from the content frontmatter, `""` when decorative.
 */
export function StageImage({ locale, className, ...frame }: StageImageProps) {
  return (
    <div className={stageClass(styles.image, className)} data-stage="image">
      <MediaFrame {...frame} className={styles.imageFrame} locale={locale} ratio="square" />
    </div>
  );
}

/* ── 2 · StageChat ──────────────────────────────────────────────────────── */

export interface StageChatProps {
  readonly locale?: Locale;
  /** The incoming paper bubble's text — the page's sample, never ours. */
  readonly reply: string;
  /** The outgoing bubble's mono timestamp, as the page wants it shown. */
  readonly time: string;
  /** A real photographed flyer; without one the bubble shows the hatch. */
  readonly flyerSrc?: MediaFrameProps["src"];
  readonly flyerAlt?: string;
  readonly className?: string;
}

/**
 * Structure: a paper chat header — the 40 px mark beside the brand name from
 * the dictionary, never a person — over a `lime-100` chat ground with two
 * bubbles: the outgoing `lime-200` one carrying the flyer (a hatched
 * "FLYER.JPG" stand-in until a photographed flyer exists) and its mono
 * timestamp, and the incoming paper one carrying the reply the page passes.
 * States: none of its own; the hatch is the illustration's own state and
 * carries `data-placeholder="flyer-photo"` (DEC-0068 rule 1).
 * Inherits: bubble radius 8 px is illustration inside the graphic, not a
 * surface radius; colours from the lime scale only.
 * Space: the square box; the bubbles are laid out from the bottom.
 * A11y: a picture of a chat is not a chat — the whole graphic is
 * `aria-hidden`, the step lines beside it say what it shows (DEC-0115).
 */
export function StageChat({
  locale = "de",
  reply,
  time,
  flyerSrc,
  flyerAlt = "",
  className,
}: StageChatProps) {
  const words = dictionary(locale);

  return (
    <div aria-hidden="true" className={stageClass(styles.chat, className)} data-stage="chat">
      <div className={styles.chatHeader}>
        <Logo link={false} locale={locale} variant="mark" />
        <span className={styles.chatName}>{words.siteName}</span>
      </div>
      <div className={styles.chatGround}>
        <div className={styles.bubbleOut}>
          {flyerSrc ? (
            <MediaFrame alt={flyerAlt} className={styles.flyerFrame} ratio="feature" src={flyerSrc} />
          ) : (
            <div className={styles.flyer} data-placeholder="flyer-photo">
              <span className={styles.flyerLabel}>{words.explainStage.flyerFile}</span>
            </div>
          )}
          <span className={styles.time}>
            {time}
            <Icon name="check" size={18} />
          </span>
        </div>
        <div className={styles.bubbleIn}>{reply}</div>
      </div>
    </div>
  );
}

/* ── 3 · StageCalendar ──────────────────────────────────────────────────── */

/** One row of the panel — the `event-row` facts plus its optional status. */
export type StageEventRow = Pick<
  EventRowProps,
  "date" | "title" | "meta" | "category" | "categoryLabel" | "status" | "statusLabel"
>;

export interface StageCalendarProps {
  readonly locale?: Locale;
  /** The covered place's name, as the app shows it. */
  readonly place: string;
  /** Exactly three rows — the panel is a fixed picture, not a list. */
  readonly rows: readonly [StageEventRow, StageEventRow, StageEventRow];
  /**
   * `live` — the rows are a covered place's real dates; `sample` — the
   * page's marked stand-in (DEC-0068 rule 3 forbids an invented place, rule 1
   * wants the marking in the DOM). Never hard-coded here (DEC-0115).
   */
  readonly provenance?: "live" | "sample";
  readonly className?: string;
}

/**
 * Structure: an `ink` panel — the place name in uppercase, a hairline, then
 * three `event-row`s in **app parity**: day numeral and month, the category
 * as icon and colour with its label written out, and optionally one
 * `event-status-badge` beside the category (SRC-0014 §Event row, §Event-
 * status badge). The drafts drop the month and the category; the guide says
 * the drafts follow the parity rule, not the other way round.
 * States: `provenance="sample"` marks the panel `data-placeholder` and every
 * row `data-demo` (`event-row`'s `mocked`); `live` rows are the real thing.
 * Inherits: `event-row` unchanged, on its dark tone; radius 0.
 * Space: the square box; three 76 px rows and the head fit it at 360 px.
 * A11y: real rows stay in the accessibility tree — the status is a word,
 * the category is a word, the date is a `<time>`.
 */
export function StageCalendar({
  locale = "de",
  place,
  rows,
  provenance = "live",
  className,
}: StageCalendarProps) {
  const sample = provenance === "sample";

  return (
    <div
      className={stageClass(styles.calendar, className)}
      data-placeholder={sample ? "sample-events" : undefined}
      data-stage="calendar"
    >
      <p className={styles.place}>{place}</p>
      <div className={styles.rows}>
        {rows.map((row, index) => (
          <EventRow
            key={`${index}-${row.title}`}
            {...row}
            locale={locale}
            state={sample ? "mocked" : "ready"}
            tone="dark"
          />
        ))}
      </div>
    </div>
  );
}

/* ── 4 · StageRegistration ──────────────────────────────────────────────── */

export interface StageRegistrationProps {
  readonly locale?: Locale;
  /** The calendar address shown in the pill — the page's sample. */
  readonly address: string;
  /** A real screenshot of the calendar settings; without one, the hatch. */
  readonly screenshotSrc?: MediaFrameProps["src"];
  readonly screenshotAlt?: string;
  readonly className?: string;
}

/**
 * Structure: a diagonal screenshot slot (hatched until a screenshot exists),
 * the 44 px `ink` control well with the arrow between the two halves, and a
 * paper card drawn with spans — a label, an address pill and a `lime-500`
 * "Anmelden" pill. It is an illustration of a registration, **not a form**:
 * no `form`, `input` or `button` exists in it (TS-WEB-0006-A17).
 * States: none; the hatch carries `data-placeholder="calendar-settings-
 * screenshot"` (DEC-0068 rule 1).
 * Inherits: pill radius on the two pills and the well; radius 0 on the box.
 * Space: the square box.
 * A11y: `aria-hidden` — a picture of a control must never be announced as
 * one (DEC-0115); the step lines carry the meaning. The English card words
 * are a translation nobody wrote, so the graphic is `data-demo` in that
 * language (state/open.md row 216).
 */
export function StageRegistration({
  locale = "de",
  address,
  screenshotSrc,
  screenshotAlt = "",
  className,
}: StageRegistrationProps) {
  const words = dictionary(locale).explainStage;

  return (
    <div
      aria-hidden="true"
      className={stageClass(styles.registration, className)}
      data-demo={words.generated ? "true" : undefined}
      data-stage="registration"
    >
      <div
        className={styles.screenshot}
        data-placeholder={screenshotSrc ? undefined : "calendar-settings-screenshot"}
      >
        {screenshotSrc ? (
          <MediaFrame alt={screenshotAlt} ratio="square" src={screenshotSrc} />
        ) : null}
      </div>
      <span className={styles.well}>
        <Icon name="arrow-right" size={24} />
      </span>
      <div className={styles.card}>
        <span className={styles.cardLabel}>{words.addressLabel}</span>
        <span className={styles.addressPill}>{address}</span>
        <span className={styles.submitPill}>{words.submit}</span>
      </div>
    </div>
  );
}

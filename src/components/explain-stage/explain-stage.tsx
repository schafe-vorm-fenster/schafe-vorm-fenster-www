import { EventRow, type EventRowProps } from "../event-row/event-row";
import { Icon } from "../icon/icon";
import { MediaFrame, type MediaFrameProps } from "../media-frame/media-frame";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./explain-stage.module.css";

/*
 * `explain-stage` — the state graphics of `explain-module` (SRC-0014 §Explain
 * module, `specs/contracts/design-system-contract.md` "explain-module",
 * TS-WEB-0022 D4 "graphic stage").
 *
 * The state graphics, one box each at `ratio-square`, so the stage that swaps
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

/* ── Drawn flyer — the shared illustration ─────────────────────────────── */

/**
 * A flyer, drawn: a paper sheet with a coloured head, a headline in two
 * heavy bars, three body lines and a date block. An **illustration**, never
 * a stand-in for a photograph — it carries no lettering and names no place,
 * so it claims nothing a real flyer would have to back up (issue #26,
 * DEC-0161). Local coordinates 0–100 × 0–140; colours from the brand tokens
 * only, set in `explain-stage.module.css` by class, never as a literal.
 */
function FlyerArt({ transform }: { readonly transform?: string }) {
  return (
    <g transform={transform}>
      <rect className={styles.artPaper} height="140" width="100" />
      <rect className={styles.artHead} height="34" width="100" />
      <circle className={styles.artSun} cx="76" cy="17" r="9" />
      <rect className={styles.artInk} height="8" rx="2" width="64" x="10" y="46" />
      <rect className={styles.artInk} height="8" rx="2" width="44" x="10" y="60" />
      <rect className={styles.artLine} height="4" rx="2" width="80" x="10" y="80" />
      <rect className={styles.artLine} height="4" rx="2" width="72" x="10" y="90" />
      <rect className={styles.artLine} height="4" rx="2" width="58" x="10" y="100" />
      <rect className={styles.artDate} height="18" rx="3" width="34" x="10" y="114" />
      <rect className={styles.artPaperBar} height="4" rx="2" width="20" x="17" y="121" />
      <rect className={styles.artLine} height="4" rx="2" width="34" x="56" y="121" />
    </g>
  );
}

/* ── 1b · StageFlyerPhoto ───────────────────────────────────────────────── */

export interface StageFlyerPhotoProps {
  readonly className?: string;
}

/**
 * Structure: state 1 of the WhatsApp path, drawn — a flyer pinned to a
 * board, and a phone held up in front of it with the same flyer in its
 * viewfinder and a shutter button. Replaces the grey `StageImage` panel
 * there (issue #26): an honest illustration of the step, not a photograph
 * that would have to be of a real flyer.
 * States: none.
 * Inherits: the square box; colours from the brand tokens by class — `ink`
 * for the phone (neutral black), `lime-100` for the ground, `himbeere-500`,
 * `violet-500` and `lime-500` as accents; no dark-green fill.
 * Space: the square box, declared before anything paints; inline SVG, no
 * request, no file under `public/`.
 * A11y: `aria-hidden` — the step line beside it says what it shows.
 */
export function StageFlyerPhoto({ className }: StageFlyerPhotoProps) {
  return (
    <div aria-hidden="true" className={stageClass(styles.illustration, className)} data-stage="flyer-photo">
      <svg className={styles.art} focusable="false" preserveAspectRatio="xMidYMid slice" viewBox="0 0 240 240">
        <rect className={styles.artGround} height="240" width="240" />
        <FlyerArt transform="translate(22 30) rotate(-5) scale(1.12)" />
        <circle className={styles.artPin} cx="78" cy="28" r="5" />
        <g transform="translate(116 84)">
          <rect className={styles.artPhone} height="190" rx="18" width="108" />
          <rect className={styles.artScreen} height="150" rx="8" width="94" x="7" y="16" />
          <FlyerArt transform="translate(24 30) scale(0.6)" />
          <path className={styles.artFinder} d="M17 26 v-6 h10 M81 20 h10 v6 M91 120 v6 h-10 M27 126 h-10 v-6" />
          <circle className={styles.artShutterRing} cx="54" cy="148" r="11" />
          <circle className={styles.artShutter} cx="54" cy="148" r="7" />
        </g>
      </svg>
    </div>
  );
}

/* ── Drawn sources — a calendar and a website ─────────────────────────────── */

/**
 * A calendar as people keep one: a window with a week grid, a few dates
 * already in it, and one new date being entered — a block in `lime-500`
 * with its entry card open beside it. Local coordinates 0–200 × 0–168.
 * **No product**: no logo, no product colours, no lettering — it is "your
 * calendar", whichever one that is (issue #88, DEC-0174 §1).
 */
function CalendarArt({ transform, entering = true }: { readonly transform?: string; readonly entering?: boolean }) {
  const columns = [0, 1, 2, 3, 4];
  return (
    <g transform={transform}>
      <rect className={styles.artPaper} height="168" rx="8" width="200" />
      <circle className={styles.artLine} cx="12" cy="11" r="3" />
      <circle className={styles.artLine} cx="22" cy="11" r="3" />
      <circle className={styles.artLine} cx="32" cy="11" r="3" />
      <rect className={styles.artInk} height="6" rx="3" width="44" x="78" y="8" />
      <rect className={styles.artLine} height="1" width="200" y="22" />
      {columns.map((column) => (
        <rect
          className={styles.artLine}
          height="4"
          key={`head-${column}`}
          rx="2"
          width="18"
          x={8 + column * 37 + 9}
          y="30"
        />
      ))}
      {[1, 2, 3, 4].map((column) => (
        <rect className={styles.artLine} height="122" key={`col-${column}`} width="1" x={8 + column * 37} y="40" />
      ))}
      {[66, 92, 118, 144].map((y) => (
        <rect className={styles.artLine} height="1" key={`row-${y}`} width="184" x="8" y={y} />
      ))}
      {/* Dates already in it. */}
      <rect className={styles.artDate} height="20" rx="3" width="31" x="11" y="44" />
      <rect className={styles.artSoft} height="20" rx="3" width="31" x="48" y="122" />
      <rect className={styles.artDate} height="46" rx="3" width="31" x="122" y="96" />
      <rect className={styles.artSoft} height="20" rx="3" width="31" x="159" y="70" />
      {/* The new one, being entered. */}
      <rect className={styles.artNew} height="46" rx="3" width="31" x="85" y="70" />
      <rect className={styles.artInk} height="4" rx="2" width="20" x="90" y="77" />
      <rect className={styles.artInk} height="4" rx="2" width="14" x="90" y="85" />
      {entering ? (
        <g>
          <rect className={styles.artCard} height="58" rx="6" width="86" x="104" y="98" />
          <rect className={styles.artInk} height="6" rx="3" width="54" x="114" y="108" />
          <rect className={styles.artLine} height="4" rx="2" width="40" x="114" y="122" />
          <rect className={styles.artLine} height="4" rx="2" width="30" x="114" y="131" />
          <rect className={styles.artSave} height="12" rx="6" width="30" x="152" y="139" />
          <path className={styles.artCursor} d="M170 142 l0 18 l5 -5 l4 9 l4 -2 l-4 -9 l7 0 z" />
        </g>
      ) : null}
    </g>
  );
}

/**
 * A website as a Verein keeps one: a browser window with an empty address
 * pill, the site's head, a heading and a list of dates — a date tile and two
 * lines each — with the last row being typed, a caret at its end. Local
 * coordinates 0–200 × 0–168. **No product, no address, no lettering**
 * (issue #88, DEC-0174 §1).
 */
function WebsiteArt({ transform, typing = true }: { readonly transform?: string; readonly typing?: boolean }) {
  const rows = [70, 100];
  return (
    <g transform={transform}>
      <rect className={styles.artPaper} height="168" rx="8" width="200" />
      <circle className={styles.artLine} cx="12" cy="11" r="3" />
      <circle className={styles.artLine} cx="22" cy="11" r="3" />
      <circle className={styles.artLine} cx="32" cy="11" r="3" />
      <rect className={styles.artWell} height="10" rx="5" width="140" x="46" y="6" />
      <rect className={styles.artLine} height="1" width="200" y="22" />
      {/* The site's head: its mark and its menu. */}
      <rect className={styles.artSiteHead} height="26" width="200" y="23" />
      <circle className={styles.artPaperFill} cx="20" cy="36" r="7" />
      <rect className={styles.artPaperFill} height="4" rx="2" width="20" x="118" y="34" />
      <rect className={styles.artPaperFill} height="4" rx="2" width="20" x="144" y="34" />
      <rect className={styles.artPaperFill} height="4" rx="2" width="20" x="170" y="34" />
      <rect className={styles.artInk} height="7" rx="3" width="70" x="12" y="57" />
      {rows.map((y) => (
        <g key={y}>
          <rect className={styles.artSoft} height="24" rx="3" width="24" x="12" y={y} />
          <rect className={styles.artInk} height="4" rx="2" width="12" x="18" y={y + 10} />
          <rect className={styles.artInk} height="5" rx="2" width="84" x="44" y={y + 4} />
          <rect className={styles.artLine} height="4" rx="2" width="58" x="44" y={y + 15} />
          <rect className={styles.artLine} height="1" width="176" x="12" y={y + 28} />
        </g>
      ))}
      {/* The date being added, as usual: its tile, the title half typed. */}
      <rect className={styles.artNew} height="24" rx="3" width="24" x="12" y="130" />
      <rect className={styles.artInk} height="4" rx="2" width="12" x="18" y="140" />
      <rect className={styles.artInk} height="5" rx="2" width="50" x="44" y="134" />
      {typing ? <rect className={styles.artInk} height="13" width="2" x="98" y="130" /> : null}
      <rect className={styles.artLine} height="4" rx="2" width="36" x="44" y="145" />
    </g>
  );
}

/* ── 1c · StageCalendarEntry ─────────────────────────────────────────────── */

export interface StageDrawingProps {
  readonly className?: string;
}

/**
 * Structure: state 1 of the calendar path, drawn — a date entered in your own
 * calendar, as usual (issue #88). Replaces the grey `StageImage` panel there:
 * no photograph of somebody's real calendar could be shown without showing
 * somebody's dates, and no screenshot of a product without its marks.
 * States: none.
 * Inherits: the square box; colours from the brand tokens by class, `ink`
 * neutral black, no dark-green fill, no product colour, no logo.
 * Space: the square box; `meet`, so a box the calendar state has grown keeps
 * the whole window on the `lime-100` ground instead of cutting its edges.
 * A11y: `aria-hidden` — the step line beside it says what it shows.
 */
export function StageCalendarEntry({ className }: StageDrawingProps) {
  return (
    <div aria-hidden="true" className={stageClass(styles.illustration, className)} data-stage="calendar-entry">
      <svg className={styles.art} focusable="false" preserveAspectRatio="xMidYMid meet" viewBox="0 0 240 240">
        <rect className={styles.artGround} height="240" width="240" />
        <CalendarArt transform="translate(20 36)" />
      </svg>
    </div>
  );
}

/* ── 1d · StageWebsiteDates ──────────────────────────────────────────────── */

/**
 * Structure: state 1 of the website path, drawn — the dates kept on your own
 * website, as usual: a browser window with the site's list of dates and the
 * next one being typed (issue #88). Replaces the grey `StageImage` panel.
 * States: none.
 * Inherits: as `StageCalendarEntry`; the site's head is `violet-500`, the one
 * accent that is no product's and no category's.
 * Space: the square box, `meet`.
 * A11y: `aria-hidden` — the step line beside it says what it shows.
 */
export function StageWebsiteDates({ className }: StageDrawingProps) {
  return (
    <div aria-hidden="true" className={stageClass(styles.illustration, className)} data-stage="website-dates">
      <svg className={styles.art} focusable="false" preserveAspectRatio="xMidYMid meet" viewBox="0 0 240 240">
        <rect className={styles.artGround} height="240" width="240" />
        <WebsiteArt transform="translate(20 36)" />
      </svg>
    </div>
  );
}

/* ── 2 · StageChat ──────────────────────────────────────────────────────── */

export interface StageChatProps {
  /** Kept for the call sites' symmetry; the chat carries no localized word since the header went (issue #89). */
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
 * Structure: a `lime-100` chat ground with two bubbles — the outgoing
 * `lime-200` one carrying the flyer (a photographed one where the page passes
 * it, otherwise the drawn flyer — the hatched "FLYER.JPG" stand-in is retired,
 * issue #26, DEC-0161) and its mono timestamp, and the incoming paper one
 * carrying the reply the page passes. **No chat header**: the paper bar with
 * the mark and the brand name stood white on the light module ground and read
 * as a stray strip (owner's review 2026-10-27, issue #89, DEC-0174 §2) — the
 * bubbles alone say "a chat". No messenger's logo or trademark either.
 * States: none of its own.
 * Inherits: bubble radius 8 px is illustration inside the graphic, not a
 * surface radius; colours from the lime scale only.
 * Space: the square box; the bubbles are laid out from the bottom.
 * A11y: a picture of a chat is not a chat — the whole graphic is
 * `aria-hidden`, the step lines beside it say what it shows (DEC-0115).
 */
export function StageChat({
  reply,
  time,
  flyerSrc,
  flyerAlt = "",
  className,
}: StageChatProps) {
  return (
    <div aria-hidden="true" className={stageClass(styles.chat, className)} data-stage="chat">
      <div className={styles.chatGround}>
        <div className={styles.bubbleOut}>
          {flyerSrc ? (
            <MediaFrame alt={flyerAlt} className={styles.flyerFrame} ratio="feature" src={flyerSrc} />
          ) : (
            // The photographed flyer, drawn: a flyer on the kitchen table as
            // the chat shows it, not a hatch (issue #26, DEC-0161).
            <div className={styles.flyer} data-flyer-art="">
              <svg className={styles.art} focusable="false" preserveAspectRatio="xMidYMid slice" viewBox="0 0 140 100">
                <rect className={styles.artTable} height="100" width="140" />
                <FlyerArt transform="translate(44 6) rotate(4) scale(0.62)" />
              </svg>
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
            metaLayout="stacked"
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
  /**
   * Which source the slot behind the card draws: the calendar of path 2 or
   * the website of path 3 — the same drawing state 1 shows, so the reader
   * sees *that* source being registered (issue #88, DEC-0174 §1).
   */
  readonly source?: "calendar" | "website";
  /** A real screenshot of the calendar settings; without one, the drawing. */
  readonly screenshotSrc?: MediaFrameProps["src"];
  readonly screenshotAlt?: string;
  readonly className?: string;
}

/**
 * Structure: a diagonal slot showing the source — the drawn calendar or
 * website of state 1, or a real screenshot where the page passes one — the
 * 44 px `ink` control well with the arrow between the two halves, and a paper
 * card drawn with spans — a label, an address pill and a `lime-500`
 * "Anmelden" pill. It is an illustration of a registration, **not a form**:
 * no `form`, `input` or `button` exists in it (TS-WEB-0006-A17).
 * States: none. The slot was a hatch marked `data-placeholder="calendar-
 * settings-screenshot"` until 2026-10-27; a production page carries no
 * placeholder panel in an explain stage (SRC-0014 §Explain module, DEC-0174).
 * Inherits: pill radius on the two pills and the well; radius 0 on the box.
 * Space: the square box.
 * A11y: `aria-hidden` — a picture of a control must never be announced as
 * one (DEC-0115); the step lines carry the meaning. The English card words
 * are a translation nobody wrote, so the graphic is `data-demo` in that
 * language (state/open.md row 220).
 */
export function StageRegistration({
  locale = "de",
  address,
  source = "calendar",
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
      <div className={styles.screenshot} data-source={screenshotSrc ? undefined : source}>
        {screenshotSrc ? (
          <MediaFrame alt={screenshotAlt} ratio="square" src={screenshotSrc} />
        ) : (
          <svg className={styles.art} focusable="false" preserveAspectRatio="xMinYMin slice" viewBox="0 0 240 240">
            <rect className={styles.artGround} height="240" width="240" />
            {source === "website" ? (
              <WebsiteArt transform="translate(14 18) scale(0.72)" typing={false} />
            ) : (
              <CalendarArt entering={false} transform="translate(14 18) scale(0.72)" />
            )}
          </svg>
        )}
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

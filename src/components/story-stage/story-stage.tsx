import type { CSSProperties, ReactNode } from "react";

import { Badge } from "../badge/badge";
import type { QuoteFragment } from "../content-fragments";
import { Icon, type IconName } from "../icon/icon";
import { photoUrl } from "../photo-surface/url";

import styles from "./story-stage.module.css";

/** One story of the stage: a time of day, its picture or colour, its quote, its date. */
export interface StageStory {
  readonly id: string;
  /** "08:30" — the hour of the day this story stands for. */
  readonly time: string;
  /** "Brot" — the tab's word beside the time. */
  readonly tab: string;
  readonly icon: IconName;
  readonly headline: string;
  readonly body: string;
  readonly quote?: QuoteFragment;
  /**
   * The photograph, cut for the stage with its focal point at `anchor`
   * (DEC-0153). Without one the stage shows the violet ground with the
   * story's icon as a watermark — never an empty frame.
   */
  readonly photo?: { readonly src: string; readonly anchor?: { readonly x: number; readonly y: number } };
  /** The live date from the story's own category (TS-WEB-0020 D3, A14), already a row. */
  readonly example?: ReactNode;
}

export interface StoryStageProps {
  readonly id: string;
  readonly kicker: string;
  readonly headline: string;
  readonly lead?: string;
  readonly stories: readonly StageStory[];
  /** "Im Kalender" — the label over the live date. */
  readonly calendarLabel: string;
  /** The module's onward action — a link, at secondary weight (one primary per page). */
  readonly action?: ReactNode;
  /** "Weiter um {time}" — `{time}` is the next story's hour. */
  readonly nextTemplate: string;
  /** "Von vorn" — the last story's way back to the first. */
  readonly restartLabel: string;
  /** The radio group's accessible name, e.g. "Uhrzeit wählen". */
  readonly pickerLabel: string;
  readonly className?: string;
}

/** Up to four stories; the stylesheet carries one selector per position. */
export const MAX_STAGE_STORIES = 4;

function initials(name: string): string {
  return name
    .replace(/^(Dr\.|Prof\.)\s*/u, "")
    .split(/\s+/u)
    .filter(Boolean)
    .map((part) => part[0])
    .filter((char): char is string => char !== undefined && /\p{L}/u.test(char))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * `story-stage` [PROPOSED] — SRC-0014 §Story stage, DEC-0153 (the owner's
 * board `concept/v2.0/Geschichten Modul.dc.html`, variant 1a).
 *
 * Structure: one ink section; kicker · headline · lead; then the stage — a
 * large media panel (photograph with the neutral scrim, or the violet ground
 * with the story's icon as a watermark) carrying the quote, beside a paper
 * panel with the hour tabs, the hour, the story, the live date "im Kalender"
 * and the onward actions. From `xl` media and panel stand 7 : 5 side by side;
 * below, they stack.
 *
 * Interaction without JavaScript: the hours are a native radio group. CSS
 * (`:has(input:checked)`) shows the chosen story; every story's media and
 * panel share one grid cell, so the stage is as tall as its tallest story and
 * a click moves nothing (CLS). An inactive story is `visibility: hidden`, out
 * of the accessibility tree. "Weiter um …" is a `<label>` for the next radio —
 * a pointer shortcut; the keyboard path is the radio group's own arrows.
 * Nothing advances by itself: SRC-0014 §Motion allows one auto-advance, and it
 * is the explain module's.
 *
 * Single tree (TS-WEB-0017 D2d): the same markup at every width; only the
 * column placement changes.
 */
export function StoryStage({
  id,
  kicker,
  headline,
  lead,
  stories: given,
  calendarLabel,
  action,
  nextTemplate,
  restartLabel,
  pickerLabel,
  className,
}: StoryStageProps) {
  const stories = given.slice(0, MAX_STAGE_STORIES);
  const group = `${id}-hour`;

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={[styles.section, className].filter(Boolean).join(" ")}
      data-block="story-stage"
      // SRC-0014 §Page Rhythm: photo-led, so a photo section in the rhythm —
      // its ink ground is where the photograph's scrim runs out (DEC-0153).
      data-surface="photo"
      id={id}
    >
      <div className={`container ${styles.inner}`}>
        <Badge icon="clock" tone="accent">
          {kicker}
        </Badge>
        <h2 className={styles.headline} id={`${id}-heading`}>
          {headline}
        </h2>
        {lead ? <p className={styles.lead}>{lead}</p> : null}

        <div className={styles.stage} data-stories={stories.length}>
          <div className={styles.media}>
            {stories.map((story, index) => {
              const photo = story.photo;
              const style = photo
                ? ({
                    "--stage-photo": photoUrl(photo.src),
                    "--stage-anchor": photo.anchor ? `${photo.anchor.x}% ${photo.anchor.y}%` : undefined,
                  } as CSSProperties)
                : undefined;
              return (
                <div
                  className={[styles.slide, photo ? styles.photo : styles.colour].join(" ")}
                  data-index={index}
                  key={story.id}
                  style={style}
                >
                  {photo ? null : (
                    <span aria-hidden="true" className={styles.watermark}>
                      <Icon name={story.icon} size={32} />
                    </span>
                  )}
                  {story.quote ? (
                    <blockquote className={styles.quote}>
                      <span aria-hidden="true" className={styles.mark}>
                        “
                      </span>
                      <p className={styles.quoteText}>{story.quote.text}</p>
                      <footer className={styles.caption}>
                        <span aria-hidden="true" className={styles.avatar}>
                          {initials(story.quote.attribution)}
                        </span>
                        <span>
                          <b>{story.quote.attribution}</b>
                          {story.quote.role ? (
                            <>
                              <br />
                              {story.quote.role}
                            </>
                          ) : null}
                        </span>
                      </footer>
                    </blockquote>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className={styles.panel}>
            <fieldset className={styles.picker}>
              <legend className={styles.srOnly}>{pickerLabel}</legend>
              {stories.map((story, index) => (
                <input
                  className={styles.radio}
                  data-index={index}
                  defaultChecked={index === 0}
                  id={`${group}-${index}`}
                  key={story.id}
                  name={group}
                  type="radio"
                  value={story.id}
                />
              ))}
              {stories.map((story, index) => (
                <label className={styles.tab} data-index={index} htmlFor={`${group}-${index}`} key={story.id}>
                  <span className={styles.tabTime}>{story.time}</span>
                  <span>{story.tab}</span>
                </label>
              ))}
            </fieldset>

            <div className={styles.texts}>
              {stories.map((story, index) => {
                const next = (index + 1) % stories.length;
                const nextStory = stories[next]!;
                return (
                  <div className={styles.text} data-index={index} key={story.id}>
                    <div className={styles.hour}>
                      <span aria-hidden="true" className={styles.well}>
                        <Icon name={story.icon} size={24} />
                      </span>
                      <span className={styles.time}>{story.time}</span>
                    </div>
                    <h3 className={styles.storyHeadline}>{story.headline}</h3>
                    <p className={styles.body}>{story.body}</p>
                    <div className={styles.foot}>
                      {story.example ? (
                        <div className={styles.example}>
                          <p className={styles.exampleLabel}>{calendarLabel}</p>
                          {story.example}
                        </div>
                      ) : null}
                      <div className={styles.actions}>
                        {action}
                        {stories.length > 1 ? (
                          <label aria-hidden="true" className={styles.next} htmlFor={`${group}-${next}`}>
                            {next === 0 ? restartLabel : nextTemplate.replace("{time}", nextStory.time)}
                            <Icon name="arrow-right" size={18} />
                          </label>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";

import { Button } from "../button/button";
import { Icon } from "../icon/icon";
import {
  INITIAL_ADVANCE_STATE,
  INTERSECTION_THRESHOLD,
  nextAdvanceState,
  scheduledDelay,
  STEP_INDICES,
  type StepIndex,
} from "./explain-advance";

import type { ExplainStep, MechanismId } from "../content-fragments";
import type { IconName } from "../icon/icon";
import type { LinkOptions } from "../route-link/href";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

import { dictionary } from "@/src/lib/i18n/dictionary";

import styles from "./explain-module.module.css";

/**
 * `lg` — 48rem, the component's one `min-width` (TS-WEB-0022 D4 "The one
 * breakpoint"). From here the three steps stand side by side and nothing
 * advances; below it the stage exists and the pass may run. Must stay in step
 * with `explain-module.module.css`.
 */
const SIDE_BY_SIDE = "(min-width: 48rem)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Three of a kind, machine-countable at the type level — "not two, not four". */
export type ThreeOf<T> = readonly [T, T, T];

/**
 * The module's own CTA. It is `data-cta="secondary"` by construction:
 * `rank` accepts nothing but `"secondary"`, so a `primary` value is a type
 * error, not a runtime surprise (TS-WEB-0022 D4 "One CTA", SRC-0014
 * §"Explain module", TS-WEB-0006 D9).
 */
export interface ExplainModuleCta extends LinkOptions {
  readonly label: string;
  /** A route id, through the facade — paths 2 and 3 point at `/mitmachen/registrieren`. */
  readonly to?: RouteId;
  /** An external handover — the WhatsApp path's chat. Ignored when `to` is set. */
  readonly href?: string;
  readonly newTab?: boolean;
  readonly icon?: IconName;
  readonly onward?: boolean;
  /** The only value the type admits. Present so the constraint is visible at the call site. */
  readonly rank?: "secondary";
}

export interface ExplainModuleProps {
  /** The path this module explains — `data-mechanism` for the page's block count. */
  readonly mechanism: MechanismId;
  /** 1, 2, 3 — rendered as the zero-padded mono ordinal beside the title. */
  readonly ordinal: number;
  readonly title: string;
  /** Exactly three — the bold core and the normal detail of each. */
  readonly steps: ThreeOf<ExplainStep>;
  /** Exactly three — the graphic of each state, in order (T-03's `explain-stage`). */
  readonly stage: ThreeOf<ReactNode>;
  readonly cta: ExplainModuleCta;
  /** `h3` under a scene opener or a section heading; `h2` where the module is the block. */
  readonly headingLevel?: 2 | 3;
  /** The language of the two stage arrows' accessible names. */
  readonly locale?: Locale;
  readonly id?: string;
  readonly className?: string;
}

function ordinalLabel(ordinal: number): string {
  return String(ordinal).padStart(2, "0");
}

/**
 * The pane the stage is scrolled to, read off its geometry: the one whose
 * scroll target (its start, clamped to the stage's scroll range — the last
 * pane can only reach the end) lies nearest to the current offset.
 */
function nearestPane(stage: HTMLElement): StepIndex {
  const panes = [...stage.querySelectorAll<HTMLElement>("[data-explain-pane]")];
  const max = stage.scrollWidth - stage.clientWidth;
  let best: StepIndex = 1;
  let distance = Infinity;
  panes.forEach((pane, index) => {
    const target = Math.min(pane.offsetLeft, max);
    const delta = Math.abs(stage.scrollLeft - target);
    if (delta < distance) {
      distance = delta;
      best = STEP_INDICES[index] as StepIndex;
    }
  });
  return best;
}

/** Where the stage has to scroll for `step` to be the pane in view. */
function paneOffset(stage: HTMLElement, step: StepIndex): number {
  const pane = stage.querySelector<HTMLElement>(`[data-explain-pane="${step}"]`);
  return Math.min(pane?.offsetLeft ?? 0, stage.scrollWidth - stage.clientWidth);
}

/**
 * `explain-module` [FIXED: TS-WEB-0022 D4] — SRC-0014 §"Explain module",
 * `specs/contracts/design-system-contract.md` rows `explain-module`,
 * `active-step`, `auto-advance`; DEC-0105 §6, DEC-0109, DEC-0110.
 *
 * Structure: mono ordinal (display-mono, 800, `ink`) with the title at card
 * size beside it; a graphic stage; **exactly three** step lines, each a real
 * `<button>` with a numbered disc, the bold core (18/700) and the normal
 * detail (15/400); one CTA, `data-cta="secondary"` and never anything else.
 * Two layouts, one content tree, one `min-width` switch at `lg` (48rem):
 * below it the stage is one box at `ratio-square` holding the three states
 * with the next cropped in at the trailing edge — the box never changes
 * size, so a state change shifts nothing; from `lg` the stage wrapper is
 * `display: contents`, the three graphics stand in a row above their own
 * step lines, and no stage box exists — no crop, no slide.
 * States: `data-state` is the settled state 1–3, `data-advance` the pass —
 * `armed` · `running` · `done` · `stopped` · `static`. Server-rendered at
 * state 1, armed, so a JavaScript-less load is complete. The active step's
 * disc is `lime-500`/`ink`, the others `surface`/`muted`; from `lg` the
 * highlight is a colour change and moves nothing.
 * Inherits: `--motion-reveal-duration` and `--motion-reveal-easing` for the
 * one slide — the same 550 ms and easing as the section reveal; radius 0 for
 * the step lines, `pill` for the disc; the shell's focus ring.
 * Space: the stage declares its ratio before any graphic arrives; the two
 * lines of a step are **never truncated** — the copy is written to the
 * 390 px target (SRC-0017 CG-025), a longer line wraps, and since all three
 * step lines are always rendered (and from `lg` share one grid row) a change
 * of step moves nothing (DEC-0154, DEC-0161, TS-WEB-0022-A20).
 * Swipe: below `lg` the stage is a horizontal scroll-snap container with two
 * arrow buttons inside it (issue #27, DEC-0161). A swipe that settles on a
 * pane selects that step; an arrow selects the neighbour. Both are handwork
 * and stop the pass for good, like a step line.
 * A11y: the step lines are the WCAG 2.2.2 mechanism (TS-WEB-0002 D7) — real
 * buttons at every size, `Tab`, `Enter`/`Space`, `aria-current="step"` on
 * the active one. Focus anywhere in the module, or a click anywhere in it,
 * stops the advance for good. Under `prefers-reduced-motion` nothing
 * advances: state 1 static, buttons operable. The advance runs once per
 * page view; "once" lives in this component instance, not in storage
 * (TS-WEB-0013). The trigger is `threshold: 0.75` on the module element,
 * direction-blind, as written — which quarter is missing is Q-0084 and is
 * not decided here.
 */
export function ExplainModule({
  mechanism,
  ordinal,
  title,
  steps,
  stage,
  cta,
  headingLevel = 3,
  locale = "de",
  id,
  className,
}: ExplainModuleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(nextAdvanceState, INITIAL_ADVANCE_STATE);
  /**
   * The pane a scroll this component started is heading for. While it is set,
   * the scroll it causes is ours and is not read back as a swipe; a touch, a
   * wheel or the pane arriving clears it.
   */
  const programmatic = useRef<StepIndex | null>(null);
  const active = useRef<StepIndex>(state.active);
  useEffect(() => {
    active.current = state.active;
  }, [state.active]);

  // The trigger — once, on mount. Reduced motion and the side-by-side layout
  // never arm; otherwise one observer at the specified threshold, dropped
  // after the first qualifying intersection because nothing can start twice.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia(REDUCED_MOTION).matches || window.matchMedia(SIDE_BY_SIDE).matches) {
      dispatch({ type: "disable" });
      return;
    }
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= INTERSECTION_THRESHOLD) {
            dispatch({ type: "intersect", ratio: entry.intersectionRatio });
            observer.disconnect();
          }
        }
      },
      { threshold: INTERSECTION_THRESHOLD },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The clock — one pending timer at a time, owned by the state it belongs
  // to. A state without a delay (armed, or any terminal phase) schedules
  // nothing, and leaving a state clears its timer, which is how an
  // interaction cancels the next advance rather than merely ignoring it.
  useEffect(() => {
    const delay = scheduledDelay(state);
    if (delay === null) return;
    const timer = window.setTimeout(() => dispatch({ type: "tick" }), delay);
    return () => window.clearTimeout(timer);
  }, [state]);

  // The stage follows the machine: below `lg` the stage is a horizontal
  // scroll-snap container (issue #27), so a state change is a scroll to the
  // pane, smooth unless the reader asked for reduced motion. From `lg` the
  // stage is `display: contents` and there is nothing to scroll.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia(SIDE_BY_SIDE).matches) return;
    const left = paneOffset(stage, state.heading);
    if (Math.abs(stage.scrollLeft - left) < 2) return;
    programmatic.current = state.heading;
    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    if (typeof stage.scrollTo === "function") {
      stage.scrollTo({ left, behavior: reduced ? "instant" : "smooth" });
    } else {
      stage.scrollLeft = left;
    }
  }, [state.heading]);

  // The machine follows the stage: a swipe that settles on another pane is a
  // selection of that step — handwork, so the pass stops for good (DEC-0105
  // §6), and the step lines below always show the pane the stage shows.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let timer: number | undefined;
    const settle = () => {
      if (window.matchMedia(SIDE_BY_SIDE).matches) return;
      const step = nearestPane(stage);
      // The scroll has been quiet for a moment, so whatever moved it is over.
      // Ours, landed where it was sent: nothing to read back. Ours, landed
      // elsewhere: something interrupted it, and where it stopped is the
      // reader's choice like any swipe.
      const target = programmatic.current;
      programmatic.current = null;
      if (step === target) return;
      if (step !== active.current) dispatch({ type: "select", step });
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 120);
    };
    const onHand = () => {
      programmatic.current = null;
      dispatch({ type: "interact" });
    };
    // From `lg` there is nothing to scroll, so the stage leaves the tab order.
    const sideBySide = window.matchMedia(SIDE_BY_SIDE);
    const syncTabStop = () => {
      stage.tabIndex = sideBySide.matches ? -1 : 0;
    };
    syncTabStop();
    sideBySide.addEventListener?.("change", syncTabStop);
    stage.addEventListener("scroll", onScroll, { passive: true });
    stage.addEventListener("touchstart", onHand, { passive: true });
    stage.addEventListener("wheel", onHand, { passive: true });
    return () => {
      window.clearTimeout(timer);
      stage.removeEventListener("scroll", onScroll);
      stage.removeEventListener("touchstart", onHand);
      stage.removeEventListener("wheel", onHand);
      sideBySide.removeEventListener?.("change", syncTabStop);
    };
  }, []);

  const stop = useCallback(() => dispatch({ type: "interact" }), []);
  const words = dictionary(locale).explainStage;
  const shown = state.heading;

  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div
      className={[styles.module, className].filter(Boolean).join(" ")}
      data-advance={state.phase}
      data-explain-module=""
      data-mechanism={mechanism}
      data-ordinal={ordinal}
      data-state={state.active}
      data-target={state.heading}
      id={id}
      onClickCapture={stop}
      onFocusCapture={stop}
      ref={ref}
    >
      <div className={styles.header}>
        {/* A number, not a word — nothing to translate; the heading carries the name. */}
        <p aria-hidden className={styles.ordinal} data-explain-ordinal="">
          {ordinalLabel(ordinal)}
        </p>
        <Heading className={styles.title}>{title}</Heading>
      </div>

      <div className={styles.stageFrame} data-explain-frame="">
      {/* A scroll container below `lg`, so it takes keyboard focus: the
          arrow keys scroll it like a swipe (WCAG 2.1.1, axe
          `scrollable-region-focusable`). From `lg` it is `display: contents`
          and takes none. */}
      <div
        aria-label={words.stageLabel}
        className={styles.stage}
        data-explain-stage=""
        ref={stageRef}
        role="group"
        tabIndex={0}
      >
        <div className={styles.track}>
          {stage.map((graphic, index) => {
            const step = STEP_INDICES[index] as StepIndex;
            return (
              <div
                className={styles.pane}
                data-active={state.active === step ? "true" : undefined}
                data-explain-pane={step}
                key={step}
              >
                {graphic}
              </div>
            );
          })}
        </div>
      </div>
        {/* Below `lg` only: the two arrows inside the stage (issue #27). Real
            buttons with a name; at either end the arrow stays focusable and
            says so with `aria-disabled` rather than vanishing under focus. */}
        <button
          aria-disabled={shown === 1 ? "true" : undefined}
          aria-label={words.previousStep}
          className={[styles.arrow, styles.arrowPrevious].join(" ")}
          data-explain-arrow="previous"
          onClick={() => {
            if (shown > 1) dispatch({ type: "select", step: (shown - 1) as StepIndex });
          }}
          type="button"
        >
          <Icon name="arrow-right" size={24} />
        </button>
        <button
          aria-disabled={shown === 3 ? "true" : undefined}
          aria-label={words.nextStep}
          className={[styles.arrow, styles.arrowNext].join(" ")}
          data-explain-arrow="next"
          onClick={() => {
            if (shown < 3) dispatch({ type: "select", step: (shown + 1) as StepIndex });
          }}
          type="button"
        >
          <Icon name="arrow-right" size={24} />
        </button>
      </div>

      <ol className={styles.steps}>
        {steps.map((line, index) => {
          const step = STEP_INDICES[index] as StepIndex;
          const active = state.active === step;
          return (
            <li className={styles.step} key={step}>
              <button
                aria-current={active ? "step" : undefined}
                className={styles.stepLine}
                data-explain-step={step}
                onClick={() => dispatch({ type: "select", step })}
                type="button"
              >
                <span aria-hidden className={styles.disc}>
                  {step}
                </span>
                <span className={styles.core}>{line.core}</span>
                <span className={styles.detail}>{line.detail}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.cta} data-explain-cta="">
        <Button
          dataCta="secondary"
          hash={cta.hash}
          href={cta.href}
          icon={cta.icon}
          locale={cta.locale}
          newTab={cta.newTab}
          onward={cta.onward}
          query={cta.query}
          to={cta.to}
          variant="secondary"
        >
          {cta.label}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";

import { Button } from "../button/button";
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
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

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
  readonly id?: string;
  readonly className?: string;
}

function ordinalLabel(ordinal: number): string {
  return String(ordinal).padStart(2, "0");
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
 * lines of a step are clamped to one line each — the copy is written to the
 * 390 px budget (SRC-0017 CG-025), and nothing here grows.
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
  id,
  className,
}: ExplainModuleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(nextAdvanceState, INITIAL_ADVANCE_STATE);

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

  const stop = useCallback(() => dispatch({ type: "interact" }), []);

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

      <div className={styles.stage} data-explain-stage="">
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

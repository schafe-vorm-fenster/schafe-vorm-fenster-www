"use client";

import { useEffect, useRef } from "react";

import type { ReactNode } from "react";

import styles from "./motion-reveal.module.css";

export interface MotionRevealProps {
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * The observer's root, as a `rootMargin` string — and the one line of this
 * component that carries a correctness argument rather than a design one.
 *
 * The bottom edge sits 10 % up from the viewport's own bottom, so a section
 * animates once it is properly in view rather than at the moment its first
 * pixel appears. The top edge is pushed far *above* the viewport, which is
 * what makes "the visitor scrolled past me" an event at all.
 *
 * `IntersectionObserver` notifies only when `isIntersecting` **changes**
 * (`entry.isIntersecting`, per the spec's "queue an IntersectionObserverEntry"
 * step). With a viewport-sized root, a section that goes from *below* the
 * viewport to *above* it inside a single scroll step — a flick to the bottom,
 * `End`, an anchor jump, a full-page screenshot — never changes it: `false`
 * before, `false` after, no callback, and the section stays armed at
 * `opacity: 0` while still reserving its full height. That is F-3-10's
 * screen-height blank band, and it was reproducible on every long page.
 *
 * With the top edge effectively unbounded, "intersecting" means "has entered
 * the viewport, or has already passed above it", and the skipped section's
 * `false → true` transition is a real change the observer must report. The
 * reveal then happens off screen, where it costs nothing and where the
 * visitor finds painted content when she scrolls back up.
 */
const OBSERVER_ROOT_MARGIN = "100000px 0px -10% 0px";

/**
 * 14 `motion-reveal` [PROPOSED] — SRC-014 §Motion.
 *
 * Structure: the wrapper that applies the site's single movement — rise
 * 22 px and fade over 550 ms, `cubic-bezier(.2,.7,.3,1)`, once, on enter.
 * States: disabled entirely under `prefers-reduced-motion: reduce`.
 * Inherits: it *is* the motion rule. Nothing else on this site moves, which
 * is also why skeletons do not animate.
 * Space: transform and opacity only — never height, so it cannot shift the
 * layout, and the compositor can do it without a repaint.
 * A11y: the content is present and readable **before** the animation runs.
 * The element is only armed (made transparent) once it is known to be off
 * screen *below*, and it is un-armed the moment it has entered the viewport
 * or been scrolled past — so nothing ever flashes, nothing is ever invisible
 * without JavaScript, and no gesture can leave content painted-out (F-3-10).
 */
export function MotionReveal({ className, children }: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // In view, or already scrolled past: either way the section is
            // done hiding. An element that was never armed is simply marked
            // revealed, which animates nothing and cannot flash.
            entry.target.setAttribute("data-revealed", "true");
            observer.disconnect();
          } else if (!entry.target.hasAttribute("data-armed")) {
            entry.target.setAttribute("data-armed", "true");
          }
        }
      },
      { rootMargin: OBSERVER_ROOT_MARGIN },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={[styles.reveal, className].filter(Boolean).join(" ")} ref={ref}>
      {children}
    </div>
  );
}

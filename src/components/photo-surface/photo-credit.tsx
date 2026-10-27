"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Icon } from "../icon/icon";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";
import type { KeyboardEvent, ReactNode } from "react";

import styles from "./photo-credit.module.css";

export interface PhotoCreditProps {
  /** The page's language — the control's name ("Bildnachweis" / "Photo credit"). */
  readonly locale?: Locale;
  /**
   * The full credit as the rights holder asks for it — for a place photograph
   * title (linked to the source), author, licence, source; for an inventory
   * image its `credit`. Plain text is set in one paragraph.
   */
  readonly children: ReactNode;
  /**
   * `true` where the frame also carries the AI-edited mark: the control then
   * stands left of it in the same row instead of on top of it (DEC-0165).
   */
  readonly besideMark?: boolean;
}

/**
 * `photo-credit` — the © control on every credited photograph (SRC-0014
 * §Photo surface, DEC-0168, issues #78 and 101): a place photograph on a
 * stage, an inventory image with a `credit` on a `photo-surface` or in a
 * `media-frame`. A credit is never standing text on or under a photograph.
 *
 * Structure: a 40 px round well in the photograph's top-right corner — the
 * corner, the well and the scrim step of `ai-edited-mark` (DEC-0165), so the
 * two marks speak one language — carrying Lucide `copyright` in `paper`; under
 * it, the credit panel.
 * States: closed · open. It opens on pointer hover, on keyboard focus
 * (`:focus-visible`, so a tap's focus does not open and close it in one go),
 * and on a click or tap, which pins it; it closes on Escape (focus returns to
 * the control), when focus or the pointer leaves an unpinned panel, and on a
 * second click or a tap outside.
 * A11y: a real `<button>` with the label as its name, `aria-expanded` and
 * `aria-controls` — a disclosure, not a `title` tooltip, because the panel
 * holds a link and a tooltip may not. The licence obligations — author,
 * licence, a reachable link to the source — are inside the panel, one tab
 * stop past the control.
 */
export function PhotoCredit({ locale = "de", children, besideMark = false }: PhotoCreditProps) {
  const label = dictionary(locale).photoCredit.label;
  const panelId = useId();
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [pinned, setPinned] = useState(false);
  const [peek, setPeek] = useState(false);
  // Closed on purpose (Escape, a second click): hover and focus do not reopen
  // it until the pointer or the focus has left and come back.
  const [dismissed, setDismissed] = useState(false);
  const open = pinned || (peek && !dismissed);

  // A pinned panel closes on a tap or click anywhere else.
  useEffect(() => {
    if (!pinned) return;
    const outside = (event: PointerEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) setPinned(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [pinned]);

  const close = () => {
    setPinned(false);
    setDismissed(true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !open) return;
    event.stopPropagation();
    close();
    button.current?.focus();
  };

  return (
    <div
      className={[styles.credit, besideMark ? styles.besideMark : undefined].filter(Boolean).join(" ")}
      data-open={open ? "true" : "false"}
      data-photo-credit=""
      onBlur={(event) => {
        if (box.current?.contains(event.relatedTarget as Node | null)) return;
        setPinned(false);
        setPeek(false);
        setDismissed(false);
      }}
      onFocus={(event) => {
        if ((event.target as HTMLElement).matches(":focus-visible")) setPeek(true);
      }}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setPeek(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        setPeek(false);
        setDismissed(false);
      }}
      ref={box}
    >
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={label}
        className={styles.control}
        onClick={() => {
          if (pinned) {
            close();
          } else {
            setPinned(true);
            setDismissed(false);
          }
        }}
        ref={button}
        type="button"
      >
        <Icon name="copyright" />
      </button>
      <div className={styles.panel} data-photo-note="credit" hidden={!open} id={panelId}>
        {typeof children === "string" ? <p>{children}</p> : children}
      </div>
    </div>
  );
}

import { isMocked, isPending, type DataStateProps } from "../data-state";
import { DemoDataBadge } from "../demo-data-badge/demo-data-badge";
import { FreshnessLabel } from "../freshness-label/freshness-label";
import { Skeleton } from "../skeleton/skeleton";

import { CopyButton } from "./copy-button";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./code-snippet.module.css";

export interface CodeSnippetProps extends DataStateProps {
  readonly code: string;
  /** The permanent reminder — copy now, this is not stored anywhere. */
  readonly note?: string;
  readonly pendingNote?: string;
  /** The page's language — the `Demo-Daten` badge and the freshness label read it. */
  readonly locale?: Locale;
  readonly className?: string;
}

/**
 * 56 `code-snippet` [PROPOSED] — TS-025 D7.
 *
 * Structure: the loader snippet as selectable, server-rendered text in a
 * code block, plus a copy control. A permanent note beside it says to copy
 * the code now — not a dialog, not an unload prompt.
 * States (D-9, all four):
 *   loading  → a `skeleton` reserving the block's height;
 *   empty    → the code cannot be issued synchronously (TS-025 D8 step 4):
 *              the pending note renders instead of a code block, and the
 *              `buy-calendar-licence` event does not fire (a page-level
 *              concern, not this component's);
 *   degraded → a build-time snapshot example, labelled "Beispiel" — never
 *              claimed as the visitor's own code;
 *   mocked   → dummy code from the mocked `organizerId` (Q-046,
 *              `state/open.md` row 2) plus `demo-data-badge`.
 * Inherits: mono type role; radius 0 block; `copy`/`check` icons.
 * Space: the block reserves its height for the longest snippet.
 * A11y: the code is reachable and copyable by keyboard; the copy control
 * confirms in text, in a live region.
 */
export function CodeSnippet({
  code,
  note = "Kopiere den Code jetzt — er wird nirgendwo gespeichert und ist nach einem Neuladen weg.",
  pendingNote = "Der Code kommt in Kürze per E-Mail.",
  state = "ready",
  className,
  locale = "de",
}: CodeSnippetProps) {
  const classes = [styles.snippet, className].filter(Boolean).join(" ");

  if (isPending(state)) {
    return <Skeleton className={classes} lines={4} variant="text" />;
  }

  if (state === "empty") {
    return <p className={styles.pending}>{pendingNote}</p>;
  }

  return (
    <div className={classes} data-demo={isMocked(state) ? "true" : undefined}>
      {state === "degraded" ? <FreshnessLabel locale={locale} tier="snapshot" /> : null}
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
      <div className={styles.actions}>
        <CopyButton code={code} />
        {isMocked(state) ? <DemoDataBadge locale={locale} /> : null}
      </div>
      <p className={styles.note}>{note}</p>
    </div>
  );
}

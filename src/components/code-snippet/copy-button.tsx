"use client";

import { useState } from "react";

import { Icon } from "../icon/icon";

import styles from "./code-snippet.module.css";

export interface CopyButtonProps {
  readonly code: string;
  readonly label?: string;
  readonly confirmedLabel?: string;
}

/**
 * The one client-side sliver of `code-snippet` (56 `code-snippet`,
 * TS-025 D7): the Clipboard API is not available without JavaScript, so this
 * one control — not the snippet itself, which stays server-rendered,
 * selectable text — is a client component, matching the same rule
 * `motion-reveal` and `back-to-top` follow in the foundation set.
 *
 * "The copy control confirms in text" (D7 A11y): a real live region, not a
 * colour change, carries the confirmation.
 */
export function CopyButton({ code, label = "Code kopieren", confirmedLabel = "Kopiert" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={styles.copy}
      onClick={() => {
        void navigator.clipboard.writeText(code).then(() => setCopied(true));
      }}
      type="button"
    >
      <Icon name={copied ? "check" : "copy"} size={18} />
      <span aria-live="polite">{copied ? confirmedLabel : label}</span>
    </button>
  );
}

import { Icon } from "../icon/icon";

import { RESPONSE_PROMISE_TEXT } from "./constant";

import styles from "./response-promise.module.css";

export interface ResponsePromiseProps {
  /** Defaults to the one constant; a caller never invents its own wording. */
  readonly text?: string | null;
  readonly className?: string;
}

/**
 * 52 `response-promise` [PROPOSED] — TS-006 D11, TS-026 D5.
 *
 * Structure: one constant, one component, three call sites — the CTA on
 * `/deine-region`, the form on `/deine-region/angebot`, and the confirmation
 * after submit — so the three can never disagree.
 * States: while the constant is `null` (Q-022 C11 unanswered) the component
 * renders nothing at all: no response-time wording of any kind, removed
 * rather than softened.
 * Inherits: Meta type, `clock` icon, no badge implying certification.
 * Space: renders no reserved space when `null`.
 * A11y: plain text beside the submit action.
 */
export function ResponsePromise({ text = RESPONSE_PROMISE_TEXT, className }: ResponsePromiseProps) {
  if (!text) return null;

  return (
    <p className={[styles.promise, className].filter(Boolean).join(" ")}>
      <Icon name="clock" size={18} />
      {text}
    </p>
  );
}

/**
 * The one response-time constant — TS-006 D11, TS-026 D5.
 *
 * `null` until the lead-handling process behind the envoy widget confirms it
 * can keep two working days (Q-022 C11, `state/open.md` row 20). The
 * component reads this constant so the CTA copy, the form copy and the
 * confirmation copy can never disagree — and so the promise is *removed*,
 * never softened, while the process is unconfirmed.
 */
export const RESPONSE_PROMISE_TEXT: string | null = null;

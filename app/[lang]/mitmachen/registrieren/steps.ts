/**
 * TS-023 D2/D4 — the step model, without any store.
 *
 * The state lives entirely in the URL query string; this module is the pure
 * derivation the page calls on every request. Nothing here reads
 * `searchParams` itself, so it is trivially unit-testable (TS-023-A4).
 */

export type RegisterStepId = 1 | 2 | 3 | "handover";

export interface RegisterAnswers {
  /** A validated, resolved community slug — never a raw postcode. */
  readonly ort?: string;
  /** A validated enum value from the (placeholder) who-publishes vocabulary. */
  readonly wer?: string;
  /** A validated enum value — one of the three publishing mechanisms. */
  readonly weg?: string;
}

/** Which step the answers present derive — D4 "Which step is shown". */
export function derivedStep(answers: RegisterAnswers): RegisterStepId {
  if (!answers.ort) return 1;
  if (!answers.wer) return 2;
  if (!answers.weg) return 3;
  return "handover";
}

const RANK: Record<RegisterStepId, number> = { 1: 1, 2: 2, 3: 3, handover: 4 };

/**
 * The step actually shown: the derived step, unless `schritt` names an
 * already-answered step to go back to. `schritt` may never move forward past
 * an unanswered step (D4) — an out-of-range or forward value is ignored.
 */
export function resolveDisplayedStep(
  answers: RegisterAnswers,
  schrittParam: string | undefined,
): RegisterStepId {
  const derived = derivedStep(answers);
  if (schrittParam === undefined) return derived;

  const requested = Number(schrittParam);
  if (!Number.isInteger(requested) || requested < 1 || requested > 3) return derived;

  return RANK[requested as 1 | 2 | 3] <= RANK[derived] ? (requested as RegisterStepId) : derived;
}

/** Validates one enum answer against the options actually offered this request. */
export function resolveEnum(
  raw: string | undefined,
  validValues: ReadonlySet<string>,
): string | undefined {
  return raw !== undefined && validValues.has(raw) ? raw : undefined;
}

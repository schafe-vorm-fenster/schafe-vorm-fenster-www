/**
 * The one way an ecosystem host is reached — TS-008 D2/D10, TS-013 D3.
 *
 * Three properties every upstream call in this repository has, and has only
 * because they live here rather than in each client:
 *
 *  1. **No client identity leaves the server.** The request headers are built
 *     from a closed set (`accept`, `content-type`, and nothing else). No
 *     `x-forwarded-for`, no `x-real-ip`, no cookie, no user agent of the
 *     visitor — TS-013 D3 rule 1, checked by TS-013-A5.
 *  2. **One attempt, bounded.** `AbortSignal.timeout` cuts the call at the
 *     budget of TS-009 D4 (800 ms). There is no in-request retry: a retry
 *     spends the visitor's time on a service that is already failing.
 *  3. **Failure is one type.** Network error, non-2xx and a body that is not
 *     JSON all arrive as `UpstreamError`, so `resilient()` has a single thing
 *     to catch (TS-009 D4: "failure is anything that is not a valid answer" —
 *     schema validation is the caller's half of that).
 */

/** Every non-answer from an ecosystem service, as one type. */
export class UpstreamError extends Error {
  readonly service: string;
  readonly status?: number;

  constructor(service: string, message: string, status?: number) {
    super(`${service}: ${message}`);
    this.name = "UpstreamError";
    this.service = service;
    this.status = status;
  }
}

export interface UpstreamCall {
  readonly service: string;
  readonly url: string;
  /** GET or POST — the website reads, and events-api's search happens to be a POST read. */
  readonly method?: "GET" | "POST";
  readonly body?: unknown;
  readonly timeoutMs: number;
}

/**
 * The closed header set. A header not built here never reaches an upstream —
 * which is what makes TS-013-A5 a property of the code and not of a review.
 */
export function upstreamHeaders(hasBody: boolean): Readonly<Record<string, string>> {
  return hasBody
    ? { accept: "application/json", "content-type": "application/json" }
    : { accept: "application/json" };
}

/** The headers TS-013 D3 forbids forwarding, as data, so a test can name them. */
export const FORBIDDEN_FORWARD_HEADERS = [
  "x-forwarded-for",
  "x-real-ip",
  "x-vercel-forwarded-for",
  "cf-connecting-ip",
  "forwarded",
  "true-client-ip",
  "cookie",
] as const;

/** One upstream attempt. Returns the parsed JSON body; throws `UpstreamError`. */
export async function callUpstream({
  service,
  url,
  method = "GET",
  body,
  timeoutMs,
}: UpstreamCall): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: upstreamHeaders(body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      // The BFF is the cache boundary (TS-003 D5); the fetch itself is raw.
      cache: "no-store",
    });
  } catch (cause) {
    const reason = cause instanceof Error ? cause.name : "network error";
    throw new UpstreamError(service, reason === "TimeoutError" ? `timeout after ${timeoutMs} ms` : reason);
  }

  if (!response.ok) throw new UpstreamError(service, `HTTP ${response.status}`, response.status);

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new UpstreamError(service, "response body is not JSON", response.status);
  }
}

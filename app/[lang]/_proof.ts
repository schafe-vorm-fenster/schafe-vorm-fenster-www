/**
 * The proof selection every page shares — TS-WEB-0005, run for real.
 *
 * Until now each page mapped its own list of demo proof lines straight onto
 * `proof-card`s: the order was file order, the count was whatever the artifact
 * happened to carry, and the relevance engine (`src/lib/relevance/`) — gate,
 * score, rotate, order, count — ran nowhere outside its unit tests
 * (TS-WEB-0005-A8/A9/A13 were all "🔜 page work packages").
 *
 * This module is that seam, and it is deliberately **thin**: a page keeps its
 * own card rendering (context line, geo badge, image slot — they differ per
 * page and per spec), and hands the engine only what the engine scores. What
 * comes back is the selection: exactly as many positions as DEC-0048 gives the
 * surface, each either an element or an honest gap.
 *
 * Three properties it enforces rather than documents:
 *
 *  - **the focus job is an input**, taken from the page's own `page.meta.ts`,
 *    so no trait can change what the page is for (DEC-0059);
 *  - **`now` and the seed are arguments** to the engine, never read inside it
 *    (TS-WEB-0005 D7) — this module reads the clock, the engine does not;
 *  - **an unfilled position is a position**, not a shorter list (SRC-0001 §4).
 *
 * It is a `use cache` function: the selection is a pure function of the
 * candidates, the viewer segment and the ISO week, which is exactly the cache
 * key TS-WEB-0005 D8 / TS-WEB-0009 D3 describe. `?ort=` reaches it as a **slug prop**,
 * resolved by the page outside the cache boundary.
 */

import { cacheLife, cacheTag } from "next/cache";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { resolveAnchorPlace } from "@/src/lib/pages/live-anchor";
import { composeViewerContext } from "@/src/lib/personalization/viewer-context";
import { isoWeekSeed } from "@/src/lib/relevance/rotation";
import { selectRelevant, type Surface } from "@/src/lib/relevance/select";
import { geo } from "@/src/lib/relevance/types";

import type { GeoBadgeFragment } from "@/src/components/content-fragments";
import type { DataState } from "@/src/components/data-state";
import type { Locale } from "@/src/lib/i18n/locales";
import type { FocusJob, ItemType, RelevanceItem } from "@/src/lib/relevance/types";
import type { RouteId } from "@/src/lib/routes/routes";

/**
 * One candidate, as a page already has it: the three texts a `proof-card`
 * renders, its geo badge, and the facets the engine scores.
 *
 * The facets are separate from the badge on purpose. The badge is what the
 * card *says* ("Beispiel", "Beispielregion"); `geoCommunity`/`geoCounty` are
 * what the element *covers*, which is what TS-WEB-0005 D1 scores — "the coverage
 * level, not the venue".
 */
export interface ProofCandidate {
  readonly id: string;
  readonly contextLine: string;
  readonly claim: string;
  readonly attribution: string;
  /**
   * The badge the card shows. Optional since polish brief G-7: a card that
   * already names its source in the context line drops the badge rather than
   * printing the same word twice ("Beleg  BELEG", `/ueber-uns`).
   */
  readonly geo?: GeoBadgeFragment;
  /** Labelled dummy content — passes the clearance gate carrying its flag. */
  readonly demo: boolean;
  readonly type?: ItemType;
  /**
   * Whose voice this is — `customer` or `press` (`ProofKind` below). Carried
   * through untouched: the engine does not score on it, and the page reads it
   * back off the selection through `selectedProofKind` to head its section.
   * It decides nothing else — whether an element renders as a quote or as a
   * claim is `citation` plus the attribution's shape, not the kind.
   * DEC-0143 §1.
   */
  readonly proofKind?: ProofKind;
  /**
   * The concrete publication and article, where the artifact names one. A
   * quote renders as a `quote-card` only with this, never without
   * (SRC-0014 §Quote card, CG-028).
   */
  readonly citation?: ProofCitation;
  /** `YYYY`, `YYYY-MM` or `YYYY-MM-DD`; `null` for an undated element. */
  readonly date?: string | null;
  /** The community the element covers, where it names one. */
  readonly geoCommunity?: string | null;
  readonly geoCounty?: string | null;
  /** TS-WEB-0005 D4 — multiplies freshness, never replaces it. */
  readonly editorialWeight?: number;
}

/** A selected position: a card to render, or the gap that weakens the claim. */
export type ProofEntry =
  | { readonly kind: "item"; readonly candidate: ProofCandidate; readonly state: DataState }
  | { readonly kind: "empty" };

export interface ProofSelection {
  readonly entries: readonly ProofEntry[];
  /** TS-WEB-0010's stage label — observability only; nothing branches on it. */
  readonly stage: 0 | 1 | 2 | 3;
  readonly seed: string;
  /** How many of the surface's positions carry an element. */
  readonly filled: number;
}

export interface ProofRequest {
  readonly routeId: RouteId;
  readonly locale: Locale;
  /** The page's declared focus job — `page.meta.ts`, never a trait. */
  readonly focusJob: FocusJob;
  /** DEC-0048: `inline` 3 · `home` 5 · `stream` 7. */
  readonly surface: Surface;
  readonly candidates: readonly ProofCandidate[];
  /** `?ort=`, already validated by `place-parameter.ts`. Stage 3 when it resolves. */
  readonly placeSlug?: string;
}

export async function selectProof({
  routeId,
  locale,
  focusJob,
  surface,
  candidates,
  placeSlug,
}: ProofRequest): Promise<ProofSelection> {
  "use cache";
  // The proof pool changes when the content artifacts change and the ranking
  // rotates on the ISO week; neither is a per-minute event.
  cacheLife("hours");

  const now = new Date();
  const seed = isoWeekSeed(now);
  // TS-WEB-0005 D7: "Include the seed in the `cacheTag` so a week boundary
  // invalidates cleanly."
  cacheTag(`proof:${seed}`, `proof:${routeId}:${locale}`);

  const stated = placeSlug === undefined ? undefined : await resolveAnchorPlace(placeSlug);

  const { viewer } = await composeViewerContext({
    focusJob,
    locale,
    routeId,
    now,
    // The proxy does not hand the `Referer` down yet, so stage 2 never fires
    // in the running app (`src/lib/personalization/README.md`, row 1).
    referrer: null,
    statedPlace:
      stated === undefined
        ? null
        : { community: stated.name, county: stated.county?.name ?? null, country: "de" },
  });

  const items: RelevanceItem<ProofCandidate>[] = candidates.map((candidate) => ({
    id: candidate.id,
    type: candidate.type ?? "testimonial",
    geo: geo({
      country: "de",
      county: candidate.geoCounty ?? null,
      community: candidate.geoCommunity ?? null,
    }),
    // The artifacts carry no `job_relation` facet yet (TS-WEB-0007 D12 row 4), so a
    // page's own proof is `neutral` for its own job — the honest default the
    // engine treats as "assessed, no claim either way".
    jobRelation: { [focusJob]: "neutral" },
    date: candidate.date ?? null,
    ...(candidate.editorialWeight === undefined
      ? {}
      : { editorialWeight: candidate.editorialWeight }),
    // The mock rule's exception (TS-WEB-0005 gate): a `demo` element passes the
    // clearance gate carrying its flag, and comes back as the `mocked` state
    // so the card badges itself.
    clearance: candidate.demo ? "unverified" : "cleared",
    demo: candidate.demo,
    payload: candidate,
  }));

  const selection = selectRelevant<ProofCandidate>({
    items,
    viewer,
    surface,
    now,
    seed,
  });

  return {
    entries: selection.entries.map((entry) =>
      entry.kind === "item"
        ? { kind: "item" as const, candidate: entry.item.payload as ProofCandidate, state: entry.state }
        : { kind: "empty" as const },
    ),
    stage: selection.stage,
    seed,
    filled: selection.filled,
  };
}

/**
 * What a proof element proves — the review's own split ("„Wer das schon macht"
 * sind die Kundenbelege, „Was andere sagen" ist Presse und Auftritte",
 * `plan/reviews/2026-09-23/2026-09-22 Review SVF Preview Website.md:462`).
 *
 * It is a **content facet** carried per candidate and passed through this seam,
 * because the hub's proof schema has no field for it yet: `proof_class`
 * (customer | press | award | partner) is the change theme B asks the *hub*
 * for (`plan/reviews/2026-09-23/spec-impact.md:99-102`), and until it lands the
 * two values the pages need are the two the review names. The engine does not
 * score on it, and `ProofCandidate.type` above is not it: `ItemType` is the
 * relevance taxonomy (`src/lib/relevance/types.ts`), which answers "what kind
 * of element is this", not "whose voice is it". DEC-0143 §1.
 */
export type ProofKind = "customer" | "press";

/**
 * The customer heading, in the owner's own words for what belongs in that
 * section — "Sachen, wo es wirklich benutzt wird" (review, line 458), with the
 * leading noun dropped; the English is its mirror. The press heading is not
 * here: it is the site's own fixed vocabulary and is read from the one place
 * that holds it.
 */
const CUSTOMER_PROOF_HEADING: Readonly<Record<Locale, string>> = {
  de: "Wo es wirklich benutzt wird",
  en: "Where it is really in use",
};

/**
 * The heading a proof section carries, decided by what the section proves and
 * by nothing else.
 *
 * Three pages headed a **customer** pool with the **press** heading — its own
 * words on `/mitmachen` ("Was andere sagen"), a variant of them on
 * `/deine-region` ("Was Landkreise und Institutionen sagen"), and the flat
 * "Belege" on `/dein-kalender` — while the copy guide reserves that heading for
 * the other kind: "Wer das schon macht → Was andere sagen *(for press proof
 * only)*" (`concept/website-copy-guide.md:516`, CG-017). The heading is read
 * from the kind here, in one place, rather than typed once per page.
 *
 * The kicker above it stays `kickers.customers`, which names the section's
 * *role*; this says what the section shows. No joint carries the same words
 * twice (polish brief G-7). DEC-0143 §2.
 */
export function proofHeading(kind: ProofKind, locale: Locale): string {
  if (kind === "press") return dictionary(locale).kickers.othersSay;
  return CUSTOMER_PROOF_HEADING[locale];
}

/**
 * The kind a proof section is headed by: the facet of the first element the
 * engine selected, `customer` where the selection is empty or the artifact
 * carries no facet.
 *
 * This is what makes `ProofCandidate.proofKind` a read field rather than a
 * decorative one. The alternative — a literal typed at each `proofHeading`
 * call — is exactly the duplication DEC-0143 §2 removes: the pool decides its
 * own heading, so exchanging an element for a press one re-heads the section
 * with no page edit. The first selected element decides, because the surface
 * mixes kinds and the engine's order is the page's order; a fully empty slot
 * keeps the customer heading, which is what the empty state is about
 * (TS-WEB-0027 D5).
 */
export function selectedProofKind(selection: ProofSelection): ProofKind {
  for (const entry of selection.entries) {
    if (entry.kind === "item") return entry.candidate.proofKind ?? "customer";
  }
  return "customer";
}

/**
 * A proof element's source: the concrete publication or article, and the link
 * to it.
 *
 * SRC-0014 §Quote card and CG-028 are absolute — "a quote without a named
 * source and a working link does not ship" — so somebody's words are only ever
 * rendered *as a quote* where both exist, and otherwise render as the
 * `proof-card` the claim itself is. The hub's proof schema carries neither
 * field (`spec-impact.md:99-102`) and `node_modules` is not ours to edit, so
 * the artifact carries the citation, appended to the authored line as an
 * ordinary markdown link:
 *
 *     1. „Die Termindaten …" — Holger Wendt, Bürgermeister in Rubkow — [Nordkurier, „Titel"](https://…)
 *
 * A line without one parses exactly as it did before. DEC-0143 §3.
 */
export interface ProofCitation {
  readonly label: string;
  readonly url: string;
}

/** `\s—\s[label](url)` at the very end of an authored line, and nowhere else. */
const CITATION = /\s+—\s+\[([^\]]+)]\((https?:\/\/[^)\s]+)\)\s*$/;

export interface ProofLine {
  /** The line without its citation — what `parseDemoProofElement` reads. */
  readonly line: string;
  /** Absent where the artifact names no source, which is today's common case. */
  readonly citation?: ProofCitation;
}

/**
 * Splits an authored proof line from its optional trailing citation.
 *
 * The citation is taken off **before** the attribution is parsed, so the ` — `
 * inside it cannot be mistaken for the attribution separator
 * (`parseDemoProofElement` splits on the last one).
 */
export function parseProofLine(line: string): ProofLine {
  const match = CITATION.exec(line);
  if (match === null) return { line: line.trim() };
  return {
    line: line.slice(0, match.index).trim(),
    citation: { label: match[1].trim(), url: match[2] },
  };
}

/**
 * The role and the organisation a `quote-card` needs under the name, read off
 * the authored attribution — "Bürgermeister in Rubkow, Gemeinde Rubkow" splits
 * at its last comma. `null` where it does not split, because the design system
 * is explicit that both are required: "a name without a role and an
 * organisation is not a proof" (SRC-0014 §Quote card). An element that cannot
 * supply the pair stays a `proof-card`.
 *
 * This is the **second** condition of the quote path, and it is why a citation
 * on its own changes nothing: `parseDemoProofElement` splits the attribution
 * part at its *first* `, `, so "Holger Wendt, Bürgermeister in Rubkow" leaves
 * the role alone in `attribution` and this function returns `null`. A line
 * reaches a quote card only written as
 * `„…" — <Name>, <Rolle>, <Organisation> — [<Publikation>](https://…)`.
 * Lives here rather than in the page so both conditions are testable in one
 * place. DEC-0143 §3, `state/open.md` row 280.
 */
export function quoteAuthor(attribution: string): { role: string; organisation: string } | null {
  const comma = attribution.lastIndexOf(", ");
  if (comma === -1) return null;
  const role = attribution.slice(0, comma).trim();
  const organisation = attribution.slice(comma + 2).trim();
  if (role === "" || organisation === "") return null;
  return { role, organisation };
}

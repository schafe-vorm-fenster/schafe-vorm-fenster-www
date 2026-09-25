"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Icon } from "../icon/icon";
import { linkHref } from "../route-link/href";

import { matchSpan, MAX_ROWS, suggestionLabel } from "./suggestion-row";

import { dictionary } from "@/src/lib/i18n/dictionary";

import type { LinkOptions } from "../route-link/href";
import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./typeahead.module.css";

/** What the BFF answers — `src/lib/live/bff.ts`'s one response shape. */
interface SearchResponse {
  readonly data: {
    readonly suggestions: readonly Suggestion[];
  };
}

interface Suggestion {
  readonly name: string;
  readonly slug: string;
  readonly municipality?: string;
}

export interface TypeaheadProps extends Omit<LinkOptions, "hash"> {
  /** The DOM id of the `search-field` input this enhances. */
  readonly inputId: string;
  /** Where a chosen suggestion goes — the route the form GETs to. */
  readonly to: RouteId;
  /** The query parameter the form uses for the place (`ort`). */
  readonly name?: string;
  readonly locale?: Locale;
}

/** Below this nothing is requested: one letter matches hundreds of villages. */
export const MIN_QUERY = 2;

/** Long enough that typing a word is one request, short enough to feel live. */
export const DEBOUNCE_MS = 180;

/**
 * The place search's suggestion overlay — TS-WEB-0008 D7a, **progressive
 * enhancement only**.
 *
 * `place-search` is a plain GET form and stays one: this component renders
 * nothing until the visitor has typed, adds no control the form needs, and
 * never prevents a submit. With JavaScript off, or before this chunk loads,
 * the field submits and the page answers exactly as it did before.
 *
 * It reaches `/api/places/search` and nothing else — the BFF is the browser's
 * only data surface (TS-WEB-0008 D10), so no ecosystem host and no read token is
 * ever part of a client request. The answer is a list of covered communities
 * out of the committed index, matched on place **and** municipality names.
 *
 * D7a's properties, each where it lives:
 *   trigger      — `MIN_QUERY`, the second character;
 *   row format   — `suggestionLabel`, "Ort (Gemeinde)";
 *   rows shown   — `MAX_ROWS`, four, and the list neither pages nor scrolls;
 *   placement    — `typeahead.module.css`, absolute over the page, anchored
 *                  to the field, no space in the flow;
 *   no match     — one non-interactive row; the form still submits;
 *   keyboard     — ARIA combobox on the existing input: `aria-expanded`,
 *                  `aria-activedescendant`, ArrowDown/ArrowUp, Enter selects,
 *                  Escape closes; every option is a real link.
 *
 * A pick carries the form's hidden query (`etcc_*`, the order flow's `orte`)
 * along with the slug — the same href the form would GET, built through the
 * route facade (TS-WEB-0023-A9: entry parameters survive a pick).
 *
 * **No state is set from an effect body.** What is shown is derived from the
 * typed value and the last answer: the popup is open exactly while the answer
 * in hand belongs to the value in the field. That is also what makes a stale
 * answer to an earlier keystroke unable to flash into the list.
 */
export function PlaceTypeahead({ inputId, to, query, name = "ort", locale = "de" }: TypeaheadProps) {
  const listId = useId();
  const words = dictionary(locale).search;

  const [typed, setTyped] = useState("");
  const [answer, setAnswer] = useState<{ query: string; items: readonly Suggestion[] } | undefined>();
  const [dismissed, setDismissed] = useState(true);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const value = typed.trim();
  const enabled = value.length >= MIN_QUERY;
  const items = (answer?.query === value ? answer.items : []).slice(0, MAX_ROWS);
  const open = enabled && !dismissed && answer?.query === value;
  const selected = items.length === 0 ? -1 : Math.min(active, items.length - 1);
  const optionId = (index: number) => `${listId}-option-${index}`;

  // The input belongs to `search-field`, which is a server component and has
  // to stay one — a page carrying this module should not ship its form as a
  // client chunk too. So the enhancement attaches to the element rather than
  // owning it, which is a subscription to an external system and exactly what
  // an effect is for.
  useEffect(() => {
    const input = document.getElementById(inputId);
    if (!(input instanceof HTMLInputElement)) return undefined;
    inputRef.current = input;

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", listId);

    const onInput = () => {
      setTyped(input.value);
      // A real input event comes from a focused field; the replay below may
      // not — a restored value in a blurred field waits for the focus.
      setDismissed(document.activeElement !== input);
      setActive(-1);
    };
    // A pointer press on an option blurs the input before the click lands.
    const onBlur = () => window.setTimeout(() => setDismissed(true), 150);
    const onFocus = () => setDismissed(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDismissed(true);
        setActive(-1);
        return;
      }
      if (event.key === "Enter") {
        // Enter on an active row selects it (SRC-0014 §overlay). The row is a
        // real link, so selecting is following it; with no active row the
        // form submits as it always did.
        const activeId = input.getAttribute("aria-activedescendant");
        const option = activeId ? document.getElementById(activeId) : null;
        if (option instanceof HTMLAnchorElement) {
          event.preventDefault();
          option.click();
        }
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      setDismissed(false);
      setActive((current) => {
        const next = event.key === "ArrowDown" ? current + 1 : current - 1;
        return Math.max(-1, next);
      });
    };

    input.addEventListener("input", onInput);
    input.addEventListener("blur", onBlur);
    input.addEventListener("focus", onFocus);
    input.addEventListener("keydown", onKeyDown);

    // Text that reached the field before this effect attached — a visitor
    // faster than hydration, a value the browser restored — fired `input`
    // before anyone listened. Replay it once, so the overlay answers what is
    // already in the field — but only while the visitor is in the field: a
    // value the page arrived with (`?ort=` prefilled, a browser-restored
    // form) is not a search until the field is focused, and `onFocus`
    // picks it up then. This keeps the rate-limited BFF free of one
    // request per prefilled page load.
    if (input.value !== "" && document.activeElement === input) {
      input.dispatchEvent(new Event("input"));
    }
    return () => {
      input.removeEventListener("input", onInput);
      input.removeEventListener("blur", onBlur);
      input.removeEventListener("focus", onFocus);
      input.removeEventListener("keydown", onKeyDown);
      for (const attribute of [
        "role",
        "aria-autocomplete",
        "aria-controls",
        "aria-expanded",
        "aria-activedescendant",
      ]) {
        input.removeAttribute(attribute);
      }
    };
  }, [inputId, listId]);

  /** The two things the DOM outside this component has to be told. */
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && selected >= 0) input.setAttribute("aria-activedescendant", optionId(selected));
    else input.removeAttribute("aria-activedescendant");
  });

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/places/search?q=${encodeURIComponent(value)}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(String(response.status));
          const body = (await response.json()) as SearchResponse;
          setAnswer({ query: value, items: body.data.suggestions });
        } catch {
          // A failing search is never an error the visitor sees (TS-WEB-0008 D7):
          // the popup stays away and the form still submits.
          if (!controller.signal.aborted) setAnswer(undefined);
        }
      })();
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [enabled, value]);

  if (!open) return null;

  return (
    <div className={styles.popup}>
      <ul aria-label={words.suggestionsLabel} className={styles.list} id={listId} role="listbox">
        {items.length === 0 ? (
          // One designed row, not an empty panel: `map-pin` in muted, the
          // line in ink, no arrow — and not a link. The onward action is the
          // field's own submit, which stays live (D7a, DEC-0079 §4).
          <li
            aria-disabled="true"
            aria-selected={false}
            className={styles.none}
            data-typeahead-none
            id={optionId(0)}
            role="option"
          >
            <Icon className={styles.pin} name="map-pin" size={18} />
            <span>{words.noSuggestions}</span>
          </li>
        ) : (
          items.map((item, index) => {
            const { before, match, after } = matchSpan(item.name, value);
            return (
              <li key={item.slug} role="presentation">
                <a
                  aria-label={suggestionLabel(item)}
                  aria-selected={index === selected}
                  className={[styles.option, index === selected ? styles.active : undefined]
                    .filter(Boolean)
                    .join(" ")}
                  data-typeahead-option
                  href={linkHref(to, { locale, query: { ...query, [name]: item.slug } })}
                  id={optionId(index)}
                  role="option"
                >
                  <span className={styles.name}>
                    {before}
                    {match ? <strong className={styles.match}>{match}</strong> : null}
                    {after}
                  </span>
                  {item.municipality ? (
                    <span className={styles.municipality}> ({item.municipality})</span>
                  ) : null}
                </a>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

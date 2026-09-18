"use client";

import { useEffect, useId, useRef, useState } from "react";

import { dictionary } from "@/src/lib/i18n/dictionary";

import styles from "./typeahead.module.css";

import type { Locale } from "@/src/lib/i18n/locales";

/** What the BFF answers — `src/lib/live/bff.ts`'s one response shape. */
interface SearchResponse {
  readonly data: {
    readonly suggestions: readonly { readonly name: string; readonly slug: string }[];
  };
}

interface Suggestion {
  readonly name: string;
  readonly slug: string;
}

export interface TypeaheadProps {
  /** The DOM id of the `search-field` input this enhances. */
  readonly inputId: string;
  /** Where a chosen suggestion goes — the same href the form would GET. */
  readonly action: string;
  /** The query parameter the form uses for the place (`ort`). */
  readonly name?: string;
  readonly locale?: Locale;
}

/** Below this nothing is requested: one letter matches hundreds of villages. */
export const MIN_QUERY = 2;

/** Long enough that typing a word is one request, short enough to feel live. */
export const DEBOUNCE_MS = 180;

/**
 * The place search's typeahead — TS-008 D7, **progressive enhancement only**.
 *
 * `place-search` is a plain GET form and stays one: this component renders
 * nothing until the visitor has typed, adds no control the form needs, and
 * never prevents a submit. With JavaScript off, or before this chunk loads,
 * the field submits and the page answers exactly as it did before.
 *
 * It reaches `/api/places/search` and nothing else — the BFF is the browser's
 * only data surface (TS-008 D10), so no ecosystem host and no read token is
 * ever part of a client request. The answer is a list of covered communities
 * out of the committed index, which is why a typed name suggests anything at
 * all: geo-api has no name search (Q-025).
 *
 * The popup is an ARIA combobox on the existing input — the input keeps its
 * own `<label>` and gains `aria-expanded`/`aria-controls`, and the options
 * are real links, so a suggestion works by keyboard, by pointer and by
 * "open in new tab" alike.
 *
 * **No state is set from an effect body.** What is shown is derived from the
 * typed value and the last answer: the popup is open exactly while the answer
 * in hand belongs to the value in the field. That is also what makes a stale
 * answer to an earlier keystroke unable to flash into the list.
 */
export function PlaceTypeahead({ inputId, action, name = "ort", locale = "de" }: TypeaheadProps) {
  const listId = useId();
  const words = dictionary(locale).search;

  const [typed, setTyped] = useState("");
  const [answer, setAnswer] = useState<{ query: string; items: readonly Suggestion[] } | undefined>();
  const [dismissed, setDismissed] = useState(true);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const value = typed.trim();
  const enabled = value.length >= MIN_QUERY;
  const items = answer?.query === value ? answer.items : [];
  const open = enabled && !dismissed && answer?.query === value;

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
      setDismissed(false);
      setActive(-1);
    };
    // A pointer press on an option blurs the input before the click lands.
    const onBlur = () => window.setTimeout(() => setDismissed(true), 150);
    const onFocus = () => setDismissed(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDismissed(true);
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      setActive((current) => {
        const next = event.key === "ArrowDown" ? current + 1 : current - 1;
        return Math.max(-1, next);
      });
    };

    input.addEventListener("input", onInput);
    input.addEventListener("blur", onBlur);
    input.addEventListener("focus", onFocus);
    input.addEventListener("keydown", onKeyDown);
    return () => {
      input.removeEventListener("input", onInput);
      input.removeEventListener("blur", onBlur);
      input.removeEventListener("focus", onFocus);
      input.removeEventListener("keydown", onKeyDown);
      for (const attribute of ["role", "aria-autocomplete", "aria-controls", "aria-expanded"]) {
        input.removeAttribute(attribute);
      }
    };
  }, [inputId, listId]);

  /** The one thing the DOM outside this component has to be told. */
  useEffect(() => {
    inputRef.current?.setAttribute("aria-expanded", open ? "true" : "false");
  }, [open]);

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
          // A failing search is never an error the visitor sees (TS-008 D7):
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

  const selected = items.length === 0 ? -1 : Math.min(active, items.length - 1);

  return (
    <div className={styles.popup}>
      <ul aria-label={words.suggestionsLabel} className={styles.list} id={listId} role="listbox">
        {items.length === 0 ? (
          <li className={styles.none}>{words.noSuggestions}</li>
        ) : (
          items.map((item, index) => (
            <li key={item.slug} role="presentation">
              <a
                aria-selected={index === selected}
                className={[styles.option, index === selected ? styles.active : undefined]
                  .filter(Boolean)
                  .join(" ")}
                data-typeahead-option
                href={`${action}?${name}=${encodeURIComponent(item.slug)}`}
                role="option"
              >
                {item.name}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

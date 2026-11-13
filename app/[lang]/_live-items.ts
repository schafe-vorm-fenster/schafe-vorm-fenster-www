/**
 * Envelope → shell props, the pure half of the live modules (`_islands.tsx`).
 *
 * Its own module because `_islands.tsx` is a client module since DEC-0163:
 * a server file that imported a function from it would get a client
 * reference rather than the function. Everything here is pure and runs on
 * either side.
 */

import { OG_LOCALE } from "@/src/lib/i18n/locales";
import { categoryLabel, categoryTone } from "@/src/lib/live/categories";
import { formatDistance } from "@/src/lib/live/format-distance";

import type { DataState } from "@/src/components/data-state";
import type { EventListItem } from "@/src/components/event-list/event-list";
import type { Locale } from "@/src/lib/i18n/locales";
import type { LiveEvent, LiveTier } from "@/src/lib/live/types";

/**
 * Envelope → the `state` a shell takes. One function, so no page re-derives
 * the badge or the freshness rule (`src/lib/live/README.md`'s table).
 */
export function stateOf(
  envelope: { readonly stale: boolean; readonly demo: boolean },
  empty = false,
): DataState {
  if (empty) return "empty";
  if (envelope.stale) return "degraded";
  if (envelope.demo) return "mocked";
  return "ready";
}

/** Tier 2 and tier 3 render different words; tier 1 renders none. */
export function tierOf(envelope: { readonly tier: LiveTier }): "stale" | "snapshot" {
  return envelope.tier === "snapshot" ? "snapshot" : "stale";
}

/** `LiveEvent` → the row shape `event-list` takes. The one mapping (TS-WEB-0005 owns the vocabulary). */
export function toListItems(events: readonly LiveEvent[], locale: Locale): EventListItem[] {
  const time = new Intl.DateTimeFormat(OG_LOCALE[locale].replace("_", "-"), {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });
  return events.map((event) => {
    const category = categoryTone(event.categoryId);
    const starts = new Date(event.startsAt);
    // An all-day date has no hour: its stored start is midnight UTC, which would
    // print as "02:00" or "01:00" — a time nobody set.
    const clock = event.allDay || Number.isNaN(starts.getTime()) ? undefined : time.format(starts);
    return {
      id: event.id,
      date: event.startsAt,
      title: event.title,
      // Every row names its own place — the rule that lets a widened module
      // stand beside a narrow one without lying (TS-WEB-0008 D1). The place comes
      // **first**: the meta line is one line of 76 px and ellipsises at its
      // end, and with the clock in front a row from the next village over
      // read "13:…" on a phone — the one word the rule is about, cut.
      // A row from another village also says how far away it is (TS-WEB-0020-A15):
      // "Rubkow · 6 km · 19:00".
      meta: [
        event.placeName,
        // The place itself is no distance away: under half a kilometre, no figure.
        event.distanceKm === undefined || event.distanceKm < 0.5 ? undefined : formatDistance(event.distanceKm),
        clock,
      ]
        .filter(Boolean)
        .join(" · "),
      category,
      categoryLabel: categoryLabel(event.categoryId, locale),
    };
  });
}

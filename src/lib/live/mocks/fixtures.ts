/**
 * Stand-in data for the mocked capabilities — plan/guardrails.md (the mock
 * rule) and the dummy-content rule, as Jan restated them on 2026-09-18.
 *
 * Three properties every value here has:
 *
 *  - **it reads real.** Places are the real municipalities of
 *    Vorpommern-Greifswald the brand's own sources already name (Schlatkow,
 *    Schmatzin, Rubkow, Quilow, Groß Kiesow, Lassan, Züssow), and the
 *    titles are the kind of date a village calendar actually carries. No
 *    real person, customer or testimonial appears, and no figure is
 *    presented as a counted traction number;
 *  - **marked where Jan can see it, never in the page.** Everything built
 *    from these fixtures leaves the BFF with `demo: true`, which reaches the
 *    markup as `data-demo="true"` / `data-mock="true"` — never as rendered
 *    copy;
 *  - **complete.** A mocked module shows the full experience — rows, chips,
 *    figures — never an empty state standing in for a missing system.
 *
 * Every row of this file has a `Mock aktiv` entry in `state/open.md`.
 */

import type { LiveEvent, Place } from "../types";

/** A stable county the demo places all sit in. */
export const DEMO_COUNTY = { id: "geoname.900001", name: "Vorpommern-Greifswald" } as const;

/**
 * Seven communities in a ring around the first one, at increasing distance,
 * so the ~15 km cut of the widening chain has something real to cut (three
 * inside, three outside).
 *
 * The seventh, `Züssow`, is the **neighbour of the empty place** (F-2-61).
 * `EMPTY_DEMO_SLUG` below is what makes TS-WEB-0008 D4's empty state reachable,
 * and TS-WEB-0020 D2 has that state's position 2 carry the *first* evidence ("the
 * chain starts here", TS-WEB-0008-A6). Without a community inside the 15 km cut
 * around `Lassan` the widening chain had nothing to widen to, so the
 * designed state rendered its strongest module empty. It is deliberately
 * **not** ZIP-addressable (`ZIP_DEMO_PLACES` below): the ring's existing
 * members are keyed to their ZIP positions by several already-covered
 * behaviours, and a seventh divisor would move all of them.
 */
export const DEMO_PLACES: readonly Place[] = [
  // The municipality is what the typeahead prints in brackets (TS-WEB-0008 D7a,
  // "Ort (Gemeinde)"); the mock carries one per place so the row format is
  // reviewable under `LIVE_DATA=mock` too.
  { communityId: "geoname.900101", name: "Schlatkow", slug: "schlatkow", lat: 54.0, lng: 13.4, municipality: "Schmatzin", county: DEMO_COUNTY },
  { communityId: "geoname.900102", name: "Schmatzin", slug: "schmatzin", lat: 54.03, lng: 13.44, municipality: "Schmatzin", county: DEMO_COUNTY },
  { communityId: "geoname.900103", name: "Rubkow", slug: "rubkow", lat: 54.06, lng: 13.47, municipality: "Rubkow", county: DEMO_COUNTY },
  { communityId: "geoname.900104", name: "Quilow", slug: "quilow", lat: 54.09, lng: 13.52, municipality: "Groß Polzin", county: DEMO_COUNTY },
  { communityId: "geoname.900105", name: "Groß Kiesow", slug: "gross-kiesow", lat: 54.2, lng: 13.7, municipality: "Groß Kiesow", county: DEMO_COUNTY },
  { communityId: "geoname.900106", name: "Lassan", slug: "lassan", lat: 54.35, lng: 13.95, municipality: "Lassan", county: DEMO_COUNTY },
  { communityId: "geoname.900107", name: "Züssow", slug: "zuessow", lat: 54.38, lng: 14.02, municipality: "Züssow", county: DEMO_COUNTY },
];

/**
 * The demo places a postcode resolves to. The first six of the ring, in
 * order: `demoPlaceForZip` is a modulo over this list, so its divisor — and
 * therefore which ZIP means which place — must not move when the ring gains
 * a member for a proximity reason.
 */
export const ZIP_DEMO_PLACES: readonly Place[] = DEMO_PLACES.slice(0, 6);

/**
 * The ZIP that demonstrates the **uncovered** branch of TS-WEB-0008 D7 — the
 * third outcome, which the conversion argument of `/dein-ort/starten` lives
 * on. Every other well-formed ZIP resolves to a demo place, so the covered
 * branches are reachable without knowing a magic number.
 */
export const UNCOVERED_DEMO_ZIP = "99999";

/** The second county of the ambiguous-municipality fixture below. */
const NEIGHBOURING_DEMO_COUNTY = {
  id: "geoname.900002",
  name: "Vorpommern-Rügen",
} as const;

/**
 * TS-WEB-0023-A6 fixture (F-2-5, round 2): the ZIP that demonstrates the
 * **ambiguous** branch — a municipality search that resolves to several
 * communities, which must not auto-advance
 * (`app/[lang]/mitmachen/registrieren/resolve-place.ts`'s `PlaceLookup`
 * "ambiguous" case). Before this fixture, `mockSearchByZip` answered at
 * most one place for every ZIP, so that branch had no gate-level walk —
 * only a stubbed unit test of the page's own handling
 * (`resolve-place.test.ts`) exercised it.
 *
 * Two communities that share a **name** across two **counties** — the real
 * shape a German postcode occasionally serves (one ZIP area covering more
 * than one place of the same name is exactly why "which one?" is a real
 * step, not a hypothetical one). Both entries live in
 * `AMBIGUOUS_DEMO_PLACES`, deliberately kept **out of** `DEMO_PLACES`: that
 * ring is keyed elsewhere (the ~15 km widening cut's three-in/
 * three-out split, `mocks/events.ts`'s region-example selection) to its
 * current members and order, and a same-named collision would change what
 * those already-covered behaviours see rather than only add a lookup
 * branch.
 */
export const AMBIGUOUS_DEMO_ZIP = "18299";

export const AMBIGUOUS_DEMO_PLACES: readonly Place[] = [
  {
    communityId: "geoname.900201",
    name: "Neuendorf",
    slug: "neuendorf-vorpommern-greifswald",
    lat: 54.5,
    lng: 12.1,
    county: DEMO_COUNTY,
  },
  {
    communityId: "geoname.900202",
    name: "Neuendorf",
    slug: "neuendorf-vorpommern-ruegen",
    lat: 51.3,
    lng: 9.5,
    county: NEIGHBOURING_DEMO_COUNTY,
  },
];

/**
 * The demo place whose dates are empty — the conversion moment of TS-WEB-0008 D4
 * ("nothing entered in <place> yet") has to be reachable in the prototype,
 * or the strongest state of `/dein-ort` never gets reviewed.
 */
export const EMPTY_DEMO_SLUG = "lassan";

/** Deterministic: the same input gives the same place, in every render and every test. */
export function demoPlaceForZip(zip: string): Place | undefined {
  if (zip === UNCOVERED_DEMO_ZIP) return undefined;
  const digits = Number.parseInt(zip, 10);
  if (!Number.isFinite(digits)) return undefined;
  return ZIP_DEMO_PLACES[digits % ZIP_DEMO_PLACES.length];
}

export function demoPlaceBySlug(slug: string): Place | undefined {
  return DEMO_PLACES.find((place) => place.slug === slug);
}

const DEMO_TITLES: readonly { readonly title: string; readonly categoryId: string }[] = [
  { title: "Feuerwehrfest am Gerätehaus", categoryId: "fest" },
  { title: "Bäckerwagen am Dorfplatz", categoryId: "merchants" },
  { title: "Line-Dance-Gruppe im Gemeindehaus", categoryId: "culture" },
  { title: "Gemeindevertretersitzung, öffentlich", categoryId: "official" },
  { title: "Seniorenkaffee im Vereinsheim", categoryId: "social" },
  { title: "Blutspende im Dorfgemeinschaftshaus", categoryId: "neighbouring" },
];

/**
 * Dates relative to `from`, so a list never reads as stale. Deterministic
 * given the same `from` — the tests pin it, the prototype passes `new Date()`.
 */
export function demoEvents(place: Place, count: number, from: Date): LiveEvent[] {
  if (place.slug === EMPTY_DEMO_SLUG) return [];
  return Array.from({ length: count }, (_unused, index) => {
    const startsAt = new Date(from.getTime() + (index + 1) * 26 * 60 * 60 * 1000);
    // Offset by the place's own id so two neighbouring places do not show the
    // same three titles — a list that repeats itself reads as a bug in review.
    const seed = Number.parseInt(place.communityId.replace(/\D/gu, ""), 10) || 0;
    const entry = DEMO_TITLES[(index + seed) % DEMO_TITLES.length]!;
    return {
      id: `${place.slug}-${index + 1}`,
      title: entry.title,
      startsAt: startsAt.toISOString(),
      placeName: place.name,
      categoryId: entry.categoryId,
    };
  });
}

/**
 * The counter figures the mock backend supplies.
 *
 * `places` and `updatesToday` have **no field** in `/api/stats` (Q-0037, open
 * row 6), so they are mocked whatever the environment. `dates` is only used
 * when the events backend is forced to the mock (`LIVE_DATA=mock`): in the
 * default `auto` mode `/api/stats` is tokenless and really answers, so the
 * dates counter is a counted figure, not this one.
 *
 * How this stays inside FUN-WEB-0041 / TS-WEB-0008-A10 ("counted live or not shown",
 * no static traction figure): these numbers never stand in for a failed
 * count. There is no counters snapshot and no tier-3 path (TS-WEB-0009 D6), so a
 * cold counter band is **removed**, never filled from here. They leave the
 * BFF only inside a `demo: true` envelope, which reaches the markup as a
 * `data-demo` attribute beside them — never as rendered copy.
 */
export const DEMO_COUNTER_FIGURES = { dates: 1234, places: 120, updatesToday: 8 } as const;

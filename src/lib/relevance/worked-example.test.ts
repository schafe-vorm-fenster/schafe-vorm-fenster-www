import { describe, expect, it } from "vitest";

import { selectRelevant } from "./select";
import { geo, type RelevanceItem, type ViewerContext } from "./types";

/**
 * The concept's worked example — "visitor from Lehre, Lower Saxony, stage 1"
 * (`website-relevance-model.concept.md`). The seven elements are the ones the
 * table names; their type, date and clearance are the **shipped** values of
 * `@schafe-vorm-fenster/proof` and `media-echo` where the element exists there
 * (`lehre-lelender`, `noerd-award-2026-smart-community`, `wendt-rubkow`), so
 * the fixture is not tuned to produce the answer. `job_relation` is assessed
 * here with its reason, because no package carries the facet yet
 * (state/open.md — the content-schema gap of TS-005's own open points).
 *
 * An element whose shipped `usage_rights` is `unverified` runs as a labelled
 * demo element (Q-045, the run's mock rule), which is exactly what the
 * prototype renders today.
 */
const now = new Date("2026-09-11T12:00:00Z");
const seed = "2026-W37";

const viewer: ViewerContext = {
  // Stage 1 with a trustworthy municipality (TS-010 D4); `community` stays
  // null, because IP never reaches it.
  geo: geo({ country: "de", state: "niedersachsen", county: "helmstedt", municipality: "lehre" }),
  trait: "direct",
  job: "know-what-is-on",
  stage: 1,
  locale: "de",
};

const elements: RelevanceItem[] = [
  {
    id: "abend-der-engagierten-flechtorf",
    type: "conference",
    geo: geo({
      country: "de",
      state: "niedersachsen",
      county: "helmstedt",
      municipality: "lehre",
      community: "flechtorf",
    }),
    date: "2026-08-15",
    clearance: "cleared",
    jobRelation: {
      "know-what-is-on": "supports",
      "publish-our-dates": "supports",
      "run-our-own-calendar": "peripheral",
      "understand-who-is-behind-it": "neutral",
    },
    jobRelationReason: "An evening of local volunteers: a date in the visitor's own place.",
  },
  {
    id: "lehre-lelender",
    type: "reference-case",
    geo: geo({ country: "de", state: "niedersachsen", county: "helmstedt", municipality: "lehre" }),
    date: "2026-08-27",
    clearance: "unverified",
    demo: true,
    jobRelation: {
      "know-what-is-on": "neutral",
      "publish-our-dates": "supports",
      "run-our-own-calendar": "supports",
      "understand-who-is-behind-it": "neutral",
    },
    jobRelationReason: "A Gemeinde running the calendar as its own brand for 17 places.",
  },
  {
    id: "noerd-award-2026-smart-community",
    type: "award",
    geo: geo({ country: "de", state: "mecklenburg-vorpommern" }),
    date: "2026-05-28",
    clearance: "cleared",
    jobRelation: {
      "know-what-is-on": "neutral",
      "publish-our-dates": "neutral",
      "run-our-own-calendar": "supports",
      "understand-who-is-behind-it": "supports",
    },
    jobRelationReason: "An independent award for the infrastructure — legitimacy, not a date.",
  },
  {
    id: "lehre-place-flyers",
    type: "promotion-material",
    geo: geo({ country: "de", state: "niedersachsen", county: "helmstedt", municipality: "lehre" }),
    date: "2026-06-01",
    clearance: "cleared",
    jobRelation: {
      "know-what-is-on": "neutral",
      "publish-our-dates": "supports",
      "run-our-own-calendar": "neutral",
      "understand-who-is-behind-it": "peripheral",
    },
    jobRelationReason: "Place-specific flyers: the publishing path made physical.",
  },
  {
    id: "podcast-baden-wuerttemberg",
    type: "podcast",
    geo: geo({ country: "de", state: "baden-wuerttemberg" }),
    date: "2026-04-01",
    clearance: "unverified",
    demo: true,
    jobRelation: {
      "know-what-is-on": "peripheral",
      "publish-our-dates": "neutral",
      "run-our-own-calendar": "neutral",
      "understand-who-is-behind-it": "supports",
    },
    jobRelationReason: "An appearance far away — maximum spread, and who is behind it.",
  },
  {
    id: "wendt-rubkow",
    type: "testimonial",
    geo: geo({
      country: "de",
      state: "mecklenburg-vorpommern",
      county: "vorpommern-greifswald",
      municipality: "rubkow",
    }),
    date: "2022-01-01",
    clearance: "unverified",
    demo: true,
    jobRelation: {
      "know-what-is-on": "neutral",
      "publish-our-dates": "neutral",
      "run-our-own-calendar": "supports",
      "understand-who-is-behind-it": "neutral",
    },
    jobRelationReason: "A mayor on workload: role proof for the municipal hat.",
  },
  {
    id: "kfw-award-gruenden-2021",
    type: "award",
    geo: geo({ country: "de" }),
    date: "2021-11-01",
    clearance: "cleared",
    jobRelation: {
      "know-what-is-on": "peripheral",
      "publish-our-dates": "neutral",
      "run-our-own-calendar": "neutral",
      "understand-who-is-behind-it": "supports",
    },
    jobRelationReason: "A nationwide founding award — legitimacy at the widest level.",
  },
];

describe("TS-005-A3: the worked example of the concept, visitor from Lehre, stage 1", () => {
  const selection = selectRelevant({ items: elements, viewer, surface: "stream", now, seed });
  const ids = selection.entries.map((entry) => entry.id);
  const tiers = selection.entries.map((entry) => (entry.kind === "item" ? entry.tier : null));

  it("reproduces positions 1–7 in the documented order", () => {
    expect(ids).toEqual([
      "abend-der-engagierten-flechtorf", // 1 recognition: "I was there"
      "lehre-lelender", //                  2 momentum through a second local item
      "noerd-award-2026-smart-community", // 3 first widening: bigger than Lehre
      "lehre-place-flyers", //              4 return to proximity
      "podcast-baden-wuerttemberg", //      5 maximum spread
      "wendt-rubkow", //                    6 role proof for the municipal hat
      "kfw-award-gruenden-2021", //         7 legitimacy
    ]);
  });

  it("fills all seven positions of the /ueber-uns stream", () => {
    expect(selection.filled).toBe(7);
  });

  it("opens with two nearby elements — recognition, then momentum", () => {
    expect(tiers[0]).toBeLessThanOrEqual(1);
    expect(tiers[1]).toBeLessThanOrEqual(1);
    expect(ids.slice(0, 2)).toEqual(["abend-der-engagierten-flechtorf", "lehre-lelender"]);
  });

  it("widens at position 3 and returns to proximity at position 4", () => {
    expect(tiers[2]).toBeGreaterThan(Number(tiers[1]));
    expect(tiers[3]).toBeLessThanOrEqual(1);
    expect(ids[3]).toBe("lehre-place-flyers");
  });

  it("spreads positions 5 to 7 away from the visitor's own region", () => {
    expect(tiers.slice(4).every((tier) => Number(tier) >= 4)).toBe(true);
  });

  it("is the concept's shape: near · near · far · near · far · far · far", () => {
    // The sequence above is the documented one, position for position. The
    // *tiers* are coarser than the concept's prose: TS-005 D1 measures
    // administrative **containment**, so for a visitor in Niedersachsen an MV
    // award, a Baden-Württemberg podcast and a nationwide award are all
    // "same country", tier 4. "very far · middle · far" is therefore a
    // distinction the engine cannot make — here the scores happen to place
    // them in the documented order anyway. → state/open.md.
    expect(tiers).toEqual([1, 1, 4, 1, 4, 4, 4]);
  });

  it("holds every element of the documented set, and no other", () => {
    expect(ids.toSorted()).toEqual(elements.map((element) => element.id).toSorted());
  });

  it("marks the three elements without cleared usage rights as demo data", () => {
    const demo = selection.entries
      .filter((entry) => entry.kind === "item" && entry.state === "mocked")
      .map((entry) => entry.id);
    expect(demo.toSorted()).toEqual(["lehre-lelender", "podcast-baden-wuerttemberg", "wendt-rubkow"]);
  });
});

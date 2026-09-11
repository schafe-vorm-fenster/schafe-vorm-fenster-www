import { describe, expect, it } from "vitest";

import { loadPage, parsePage, slot, slotsOfType } from "@/src/lib/content/loader";
import { isDemoSlot, slotState } from "@/src/lib/content/provenance";

const artifact = `---
id: home-de
page_id: TS-019
route: "/"
content_type: section
status: draft
locale: de
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
provenance: "mixed"
---

# Startseite

## Slot 1 — Suchfeld

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Was ist bei dir los?

**Button:** Suchen

## Slot 8 — Proof

<!-- id: home-8-proof-stream; content_type: proof-card; provenance: generated; derived_from: []; status: draft; demo: true -->

**Karte 1:** Beispielgemeinde Musterdorf
`;

describe("TS-007-A1: a page artifact parses into a typed page", () => {
  const page = parsePage(artifact, {
    routeId: "home",
    locale: "de",
    file: "content/pages/home/de.md",
  });

  it("validates the frontmatter and carries the spec id, route and provenance key", () => {
    expect(page.ok).toBe(true);
    expect(page.specId).toBe("TS-019");
    expect(page.frontmatter?.page_id).toBe("TS-019");
    expect(page.frontmatter?.derived_from).toEqual(["ia"]);
    expect(page.status).toBe("draft");
  });

  it("returns the slots in file order, each with its provenance", () => {
    expect(page.slots.map((s) => s.id)).toEqual([
      "home-1-search-hero",
      "home-8-proof-stream",
    ]);
    expect(page.slots[0].provenance).toBe("sourced");
    expect(page.slots[0].demo).toBe(false);
    expect(page.slots[1].provenance).toBe("generated");
    expect(page.slots[1].demo).toBe(true);
  });

  it("carries the slot's heading, fields and CTA", () => {
    const hero = slot(page, "home-1-search-hero");
    expect(hero.title).toBe("Slot 1 — Suchfeld");
    expect(hero.fields["Headline"]).toBe("Was ist bei dir los?");
    expect(hero.cta).toBe("Suchen");
    expect(hero.contentType).toBe("hero");
  });

  it("finds slots by content type", () => {
    expect(slotsOfType(page, "proof-card").map((s) => s.id)).toEqual([
      "home-8-proof-stream",
    ]);
    expect(slotsOfType(page, "origin-story")).toEqual([]);
  });
});

describe("TS-007-A5: an unknown or missing slot is a typed empty, never a throw", () => {
  const page = parsePage(artifact, {
    routeId: "home",
    locale: "de",
    file: "content/pages/home/de.md",
  });

  it("answers an unknown slot id with an empty slot and a reason", () => {
    const missing = slot(page, "home-99-does-not-exist");
    expect(missing.empty).toBe(true);
    expect(missing.reason).toBe("slot-unknown");
    expect(missing.provenance).toBe("unavailable");
    expect(missing.blocks).toEqual([]);
    expect(missing.body).toBe("");
  });

  it("answers a missing page file with an empty page rather than throwing", async () => {
    const page404 = await loadPage("home", "de", {
      contentRoot: "/nowhere/that/exists",
    });
    expect(page404.ok).toBe(false);
    expect(page404.reason).toBe("page-file-missing");
    expect(page404.slots).toEqual([]);
    expect(slot(page404, "home-1-search-hero").empty).toBe(true);
  });

  it("answers invalid frontmatter with an empty page and a reason", () => {
    const broken = parsePage("---\nid: x\n---\n\n# nothing else\n", {
      routeId: "home",
      locale: "de",
      file: "content/pages/home/de.md",
    });
    expect(broken.ok).toBe(false);
    expect(broken.reason).toBe("page-frontmatter-invalid");
  });

  it("drops a slot whose metadata comment does not validate, and says so", () => {
    const bad = parsePage(
      artifact.replace("content_type: hero", "content_type: carousel"),
      { routeId: "home", locale: "de", file: "content/pages/home/de.md" },
    );
    expect(bad.slots.map((s) => s.id)).toEqual(["home-8-proof-stream"]);
    expect(slot(bad, "home-1-search-hero").reason).toBe("slot-unknown");
  });
});

describe("TS-007-A1: the provenance surface a page renders the badge from", () => {
  const page = parsePage(artifact, {
    routeId: "home",
    locale: "de",
    file: "content/pages/home/de.md",
  });

  it("marks a demo slot `mocked`, so the module shows `Demo-Daten`", () => {
    expect(isDemoSlot(slot(page, "home-8-proof-stream"))).toBe(true);
    expect(slotState(slot(page, "home-8-proof-stream"))).toBe("mocked");
  });

  it("leaves a sourced slot in the state the page passes in", () => {
    expect(isDemoSlot(slot(page, "home-1-search-hero"))).toBe(false);
    expect(slotState(slot(page, "home-1-search-hero"))).toBe("ready");
    expect(slotState(slot(page, "home-1-search-hero"), "degraded")).toBe("degraded");
  });

  it("renders an unreadable slot as `empty`, never as an error", () => {
    expect(slotState(slot(page, "home-99-nope"))).toBe("empty");
  });

  it("keeps a clearance-gated slot empty rather than substituting copy (SRC-001 rule 4)", () => {
    const gated = parsePage(
      artifact.replace("provenance: sourced;", "provenance: sourced-empty-by-design;"),
      { routeId: "home", locale: "de", file: "content/pages/home/de.md" },
    );
    expect(slot(gated, "home-1-search-hero").provenance).toBe(
      "sourced-empty-by-design",
    );
    expect(isDemoSlot(slot(gated, "home-1-search-hero"))).toBe(false);
  });
});

describe("TS-007-A14 (F-2-40): the editorial gate of D11", () => {
  const approved = artifact
    .replace("status: draft\nlocale: de", "status: approved\nlocale: de")
    .replaceAll("status: draft -->", "status: approved -->")
    .replace("status: draft; demo: true -->", "status: approved; demo: true -->");

  const options = {
    routeId: "home",
    locale: "de",
    file: "content/pages/home/de.md",
  } as const;

  it("renders a draft page outside production — review happens on the page", () => {
    for (const environment of ["preview", "development"] as const) {
      const page = parsePage(artifact, { ...options, environment });
      expect(page.ok, environment).toBe(true);
      expect(page.slots, environment).toHaveLength(2);
    }
  });

  it("renders no draft slot in a production build", () => {
    const page = parsePage(artifact, { ...options, environment: "production" });
    expect(page.ok).toBe(false);
    expect(page.reason).toBe("page-not-approved");
    expect(page.slots).toEqual([]);
    // The status is still reported, so `check:content` can name it.
    expect(page.status).toBe("draft");
  });

  it("renders an approved page in a production build", () => {
    const page = parsePage(approved, { ...options, environment: "production" });
    expect(page.ok).toBe(true);
    expect(page.slots.map((s) => s.id)).toEqual([
      "home-1-search-hero",
      "home-8-proof-stream",
    ]);
  });

  it("drops a single unapproved slot from an approved page, and says why", () => {
    const mixed = approved.replace(
      "provenance: generated; derived_from: []; status: approved; demo: true",
      "provenance: generated; derived_from: []; status: draft; demo: true",
    );
    const page = parsePage(mixed, { ...options, environment: "production" });

    expect(page.ok).toBe(true);
    expect(page.slots.map((s) => s.id)).toEqual(["home-1-search-hero"]);
    expect(page.gatedSlots).toEqual(["home-8-proof-stream"]);
    expect(slot(page, "home-8-proof-stream").reason).toBe("slot-not-approved");
    expect(slot(page, "home-8-proof-stream").empty).toBe(true);
  });

  it("keeps a `demo: true` slot out of production too — the badge is not a clearance", () => {
    const page = parsePage(artifact, { ...options, environment: "production" });
    expect(page.slots.some((s) => s.demo)).toBe(false);
  });

  it("never gates an imported file — the legal family never reaches the editorial gate", () => {
    const imported = approved.replace(
      "status: approved\nlocale: de",
      "status: imported\nlocale: de",
    );
    const page = parsePage(imported, { ...options, environment: "production" });
    expect(page.ok).toBe(true);
    expect(page.slots).toHaveLength(2);
  });
});

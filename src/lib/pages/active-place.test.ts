import { describe, expect, it } from "vitest";

import { createActivePlaceStore, EXAMPLE_PLACE, type ActivePlace } from "./active-place";

import type { Place } from "@/src/lib/live/types";

/**
 * DEC-0168 — the active place is one store, and an answer for a superseded
 * place is dropped whatever order the network delivers it in. Every request
 * here is a promise the test settles by hand, so each interleaving is
 * written down rather than hoped for.
 */

const LEHRE: Place = { communityId: "geoname.2879378", name: "Lehre", slug: "lehre", lat: 52.3, lng: 10.7 };
const ANKLAM: Place = { communityId: "geoname.2956018", name: "Anklam", slug: "anklam", lat: 53.9, lng: 13.7 };

interface Pending {
  readonly url: string;
  readonly resolve: (value: unknown) => void;
}

function harness() {
  const pending: Pending[] = [];
  const images: { src: string; resolve: (ok: boolean) => void; signal: AbortSignal }[] = [];
  const store = createActivePlaceStore({
    fetchJson: <T,>(url: string) =>
      new Promise<T | null>((resolve) => pending.push({ url, resolve: resolve as (value: unknown) => void })),
    loadImage: (src, signal) => new Promise<boolean>((resolve) => images.push({ src, resolve, signal })),
  });
  const seen: ActivePlace[] = [];
  store.subscribe(() => seen.push(store.getSnapshot()));

  /** Settles the oldest open request for `url` (by prefix). */
  const answer = async (url: string, value: unknown) => {
    const index = pending.findIndex((request) => request.url.startsWith(url));
    if (index === -1) throw new Error(`no open request for ${url}: ${pending.map((p) => p.url).join(", ")}`);
    const [request] = pending.splice(index, 1);
    request!.resolve(value);
    await flush();
  };
  const image = async (src: string, ok: boolean) => {
    const index = images.findIndex((entry) => entry.src === src);
    if (index === -1) throw new Error(`no image ${src}`);
    const [entry] = images.splice(index, 1);
    entry!.resolve(ok);
    await flush();
  };
  return { store, pending, images, seen, answer, image };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const covered = (place: Place) => ({ outcome: { kind: "covered", place }, lookup: {} });
const events = (count: number) => ({ data: { events: Array.from({ length: count }, (_, i) => ({ id: String(i) })), publishInvitation: count === 0 } });
const photo = (slug: string) => ({
  data: {
    src: `https://assets.example/${slug}.webp`,
    fileName: `${slug}.jpg`,
    sourceUrl: `https://commons.example/${slug}`,
    licence: "CC BY-SA 4.0",
    author: "Erika Musterfrau",
  },
});

/** Every snapshot that names a place and a photograph — they must always be the same place. */
function photographsAgree(seen: readonly ActivePlace[]): boolean {
  return seen.every(
    (snapshot) =>
      !("photo" in snapshot) ||
      snapshot.photo.status !== "ready" ||
      snapshot.photo.photo.src === `https://assets.example/${snapshot.place.slug}.webp`,
  );
}

describe("TS-WEB-0020-A27: one active place; a superseded answer never lands (DEC-0168)", () => {
  it("is `unknown` until the query is read, and asks nothing", () => {
    const { store, pending } = harness();
    expect(store.getSnapshot().kind).toBe("unknown");
    store.setQuery(null);
    expect(store.getSnapshot().kind).toBe("unknown");
    expect(pending).toHaveLength(0);
  });

  it("without ?ort= the example is explicit state, and its photograph is the example's", async () => {
    const { store, answer, image, seen } = harness();
    store.setQuery("");
    const snapshot = store.getSnapshot();
    expect(snapshot.kind).toBe("example");
    expect(snapshot.kind === "example" && snapshot.place.slug).toBe(EXAMPLE_PLACE.slug);

    store.requestPhoto(EXAMPLE_PLACE.slug);
    await answer(`/api/places/${EXAMPLE_PLACE.slug}/photo`, photo(EXAMPLE_PLACE.slug));
    await image(`https://assets.example/${EXAMPLE_PLACE.slug}.webp`, true);
    const shown = store.getSnapshot();
    expect(shown.kind === "example" && shown.photo.status).toBe("ready");
    expect(photographsAgree(seen)).toBe(true);
  });

  it("while ?ort= resolves, nothing about the example is shown or asked", () => {
    const { store, pending } = harness();
    store.setQuery("ort=lehre");
    expect(store.getSnapshot()).toMatchObject({ kind: "resolving", query: "lehre" });
    expect(pending.map((request) => request.url)).toEqual(["/api/places/resolve?ort=lehre"]);
    // A stage that asks for the example's photograph now gets nothing.
    store.requestPhoto(EXAMPLE_PLACE.slug);
    expect(pending).toHaveLength(1);
  });

  it("drops place A's photograph when it arrives after the switch to place B", async () => {
    const { store, answer, image, images, seen } = harness();
    store.setQuery("ort=lehre");
    await answer("/api/places/resolve?ort=lehre", covered(LEHRE));
    store.requestPhoto("lehre");

    // The visitor moves on before Lehre's photograph has arrived.
    store.setQuery("ort=anklam");
    await answer("/api/places/resolve?ort=anklam", covered(ANKLAM));
    store.requestPhoto("anklam");

    // Lehre's answer lands late, then Anklam's.
    await answer("/api/places/lehre/photo", photo("lehre"));
    expect(images.map((entry) => entry.src)).not.toContain("https://assets.example/lehre.webp");
    await answer("/api/places/anklam/photo", photo("anklam"));
    await image("https://assets.example/anklam.webp", true);

    const now = store.getSnapshot();
    expect(now.kind === "chosen" && now.place.slug).toBe("anklam");
    expect(now.kind === "chosen" && now.photo.status === "ready" && now.photo.photo.src).toBe(
      "https://assets.example/anklam.webp",
    );
    expect(photographsAgree(seen)).toBe(true);
  });

  it("drops a resolver answer that arrives after a newer query", async () => {
    const { store, answer } = harness();
    store.setQuery("ort=lehre");
    store.setQuery("ort=anklam");
    await answer("/api/places/resolve?ort=anklam", covered(ANKLAM));
    await answer("/api/places/resolve?ort=lehre", covered(LEHRE));
    const now = store.getSnapshot();
    expect(now.kind === "chosen" && now.place.slug).toBe("anklam");
  });

  it("aborts the superseded place's image and drops a late dates verdict", async () => {
    const { store, answer, images } = harness();
    store.setQuery("ort=lehre");
    await answer("/api/places/resolve?ort=lehre", covered(LEHRE));
    store.requestPhoto("lehre");
    await answer("/api/places/lehre/photo", photo("lehre"));
    const lehreImage = images.find((entry) => entry.src.endsWith("lehre.webp"))!;

    store.setQuery("");
    expect(lehreImage.signal.aborted).toBe(true);
    await answer("/api/places/lehre/events", events(0));
    const now = store.getSnapshot();
    expect(now.kind).toBe("example");
    expect(now.kind === "example" && now.photo.status).toBe("idle");
  });

  it("an image that does not load is `none`, never another place's picture", async () => {
    const { store, answer, image } = harness();
    store.setQuery("ort=lehre");
    await answer("/api/places/resolve?ort=lehre", covered(LEHRE));
    store.requestPhoto("lehre");
    await answer("/api/places/lehre/photo", photo("lehre"));
    await image("https://assets.example/lehre.webp", false);
    const now = store.getSnapshot();
    expect(now.kind === "chosen" && now.photo.status).toBe("none");
  });

  it("the dates verdict lands on the place it was asked for", async () => {
    const { store, answer } = harness();
    store.setQuery("ort=lehre");
    await answer("/api/places/resolve?ort=lehre", covered(LEHRE));
    await answer("/api/places/lehre/events", events(0));
    const now = store.getSnapshot();
    expect(now.kind === "chosen" && now.dates).toEqual({ status: "known", hasDates: false, publishInvitation: true });
  });

  it("a resolver that does not answer leaves the page on its example, openly", async () => {
    const { store, answer } = harness();
    store.setQuery("ort=lehre");
    await answer("/api/places/resolve?ort=lehre", null);
    expect(store.getSnapshot().kind).toBe("example");
  });

  it("the same query twice starts nothing new", () => {
    const { store, pending } = harness();
    store.setQuery("ort=lehre&etcc_cmp=x");
    store.setQuery("ort=lehre&etcc_cmp=y");
    expect(pending).toHaveLength(1);
  });
});

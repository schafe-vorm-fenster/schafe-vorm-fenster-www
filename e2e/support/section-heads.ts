/**
 * The section-head measurement — DEC-0206, TS-WEB-0006 D12, TS-WEB-0006-A21.
 *
 * The owner's rule of 2026-11-12 (issue 163): before a section's content
 * stand **at most three text levels** — kicker, heading, intro. A transition
 * sentence or an in-between line is no level of its own any more: it becomes
 * the intro or goes. The heading is required, the kicker optional, and the
 * three levels **repeat neither a word stem nor a statement**.
 *
 * Two halves, because one runs in the browser and one does not:
 *
 *  - `readSectionHeads` is handed to `page.evaluate`, so it is self-contained:
 *    no import, no closure over anything outside it. It reads what the reader
 *    reads — the rendered DOM — because a section's head is composed in three
 *    places (the shell's kicker and transition, the page's heading, a module's
 *    own lead) and no single source file holds it.
 *  - `sectionHeadFindings` is plain TypeScript and judges the levels read. It
 *    is unit-tested in `scripts/section-heads.test.ts`.
 *
 * **What a level is.** Walking the section in document order, every rendered
 * kicker (`data-kicker`), heading (`h1`–`h6`), paragraph, and badge or label
 * (an element with words of its own) before the first piece of content is one
 * level; its own subtree is not walked further. Once the heading has been
 * read, the next line is the intro and the head ends there; a second heading
 * opens a module and ends it too. Content is anything a reader does something
 * with or looks at: a list, a table, a form, a control, a link, a picture, a
 * figure, a quote, a disclosure. An element the browser does not draw
 * (`display: none`, a visually hidden label of 1 px or less), decoration
 * hidden from assistive technology (`aria-hidden`) and a line without a
 * letter (a step ordinal, "01") are no level.
 *
 * **What a repeated stem is.** Two levels that share a content word once both
 * are reduced to a crude German/English stem: lower case, umlauts folded, one
 * prefix (`be`, `ge`, `ver`) and one inflection suffix cut where at least four
 * letters remain, function words and words under four letters dropped. It
 * finds "Wer den Kalender **nutzt**" over "Wo es wirklich **benutzt** wird"
 * (the owner's own example). A repeated **statement** in different words is
 * beyond a stem and stays a review item (SRC-0017 CG-019, `review`).
 *
 * **What is no repetition.** A proper name from `PROPER_NAMES` (a village, a
 * city, an organisation) may stand in two levels: naming the same place twice
 * is not saying the same thing twice. Only the listed names are excused.
 */

/** One text line before the section's content, as the reader meets it. */
export interface HeadLevel {
  /** `kicker` (`data-kicker`), `heading` (`h1`–`h6`), `line` (a paragraph before the heading) or `intro` (the line after it). */
  readonly kind: "kicker" | "heading" | "line" | "intro";
  readonly text: string;
}

/** One top-level section of `main`, and the levels before its content. */
export interface SectionHead {
  /** `data-block`, id or accessible name, with `#n` where a page repeats one. */
  readonly section: string;
  readonly levels: readonly HeadLevel[];
}

/**
 * Reads the head of every top-level section of `main` after the hero.
 *
 * Left out, and why: the hero (`[data-hero]`, its own block type, SRC-0014
 * §Hero), the context band (`#context-band`, chrome whose kicker stands beside
 * its heading, TS-WEB-0017-A35) and the contact section (`[data-contact-section]`,
 * chrome, DEC-0122).
 */
export function readSectionHeads(): SectionHead[] {
  const main = document.querySelector("#main");
  if (!main) return [];

  const LINE = "h1, h2, h3, h4, h5, h6, p, [data-kicker]";
  const CONTENT = [
    "ul", "ol", "dl", "table", "form", "fieldset", "button", "input", "select", "textarea",
    "a[href]", "img", "picture", "svg", "video", "iframe", "canvas", "figure", "blockquote",
    "details", "[role='list']", "[role='tablist']", "[role='radiogroup']",
  ].join(", ");

  /** A badge or label is a line too: an element carrying words of its own, outside a paragraph. */
  const ownWords = (element: Element) =>
    [...element.childNodes].some(
      (child) => child.nodeType === Node.TEXT_NODE && /\p{L}/u.test(child.textContent ?? ""),
    );

  const drawn = (element: Element): boolean => {
    const box = element.getBoundingClientRect();
    if (box.width <= 1 && box.height <= 1) return false;
    return typeof element.checkVisibility === "function" ? element.checkVisibility() : true;
  };

  const text = (element: Element) => (element.textContent ?? "").replace(/\s+/g, " ").trim();

  const headOf = (section: Element): HeadLevel[] => {
    const levels: HeadLevel[] = [];
    let sawHeading = false;
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_ELEMENT);

    /** The next element after the current one's subtree, or null at the section's end. */
    const skip = (): Node | null => {
      let next = walker.nextSibling();
      while (!next) {
        const parent = walker.parentNode();
        if (!parent || parent === section) return null;
        next = walker.nextSibling();
      }
      return next;
    };

    let node: Node | null = walker.nextNode();
    while (node) {
      const element = node as Element;
      // Not drawn, or decoration hidden from the reader (a badge's icon): no
      // level and no content.
      if (!drawn(element) || element.getAttribute("aria-hidden") === "true") {
        node = skip();
        continue;
      }
      if (element.matches(CONTENT)) break;
      // Once the heading is read, an `<article>` is content (a proof card, a
      // story): the lines inside it are its own, not the section's intro.
      if (sawHeading && element.tagName === "ARTICLE") break;
      if (element.matches(LINE) || ownWords(element)) {
        const words = text(element);
        // An ordinal ("01", "02") numbers a module's step; it says nothing.
        if (/\p{L}/u.test(words)) {
          const isHeading = /^H[1-6]$/.test(element.tagName);
          if (sawHeading) {
            // The line after the heading is the intro and closes the head; a
            // second heading is a module's own title and closes it unread.
            if (!isHeading) levels.push({ kind: "intro", text: words });
            break;
          }
          levels.push({
            kind: isHeading ? "heading" : element.matches("[data-kicker]") ? "kicker" : "line",
            text: words,
          });
          if (isHeading) sawHeading = true;
        }
        node = skip();
        continue;
      }
      node = walker.nextNode();
    }
    return levels;
  };

  const seen = new Map<string, number>();
  return [...main.querySelectorAll("section, aside")]
    .filter((section) => !section.parentElement?.closest("section, aside"))
    .filter((section) => !section.matches("[data-hero], #context-band, [data-contact-section]"))
    .filter(drawn)
    .map((section) => {
      const name =
        (section as HTMLElement).dataset.block ||
        section.id ||
        section.getAttribute("aria-label")?.slice(0, 32) ||
        section.tagName.toLowerCase();
      const count = (seen.get(name) ?? 0) + 1;
      seen.set(name, count);
      return { section: count > 1 ? `${name}#${count}` : name, levels: headOf(section) };
    });
}

/** The most text levels a section may stand before its content (DEC-0206 §1). */
export const MAX_HEAD_LEVELS = 3;

/** Function words of both languages: they carry no statement, so sharing one is no repetition. */
const FUNCTION_WORDS = new Set([
  // German
  "aber", "alle", "allem", "allen", "alles", "auch", "bei", "beim", "bleibt", "dann", "dass", "dein",
  "deine", "deinem", "deinen", "deiner", "denn", "diese", "diesem", "diesen", "dieser", "dieses",
  "dort", "durch", "eine", "einem", "einen", "einer", "eines", "etwas", "euch", "euer", "eure",
  "eurem", "euren", "eurer", "ganz", "gibt", "haben", "heute", "hier", "ihre", "ihrem", "ihren",
  "ihrer", "immer", "jede", "jedem", "jeden", "jeder", "jedes", "kann", "kein", "keine", "keinen",
  "mehr", "nach", "nicht", "noch", "ohne", "oder", "schon", "sehr", "sich", "sind", "unser",
  "unsere", "unserem", "unseren", "unserer", "unter", "viel", "viele", "warum", "weil", "welche",
  "welcher", "wenn", "werden", "wieder", "wird", "wirklich", "wurde", "über", "zwei", "drei",
  // English
  "about", "also", "been", "does", "every", "from", "have", "here", "into", "just", "more", "only",
  "over", "same", "than", "that", "their", "them", "then", "there", "they", "this", "today",
  "very", "were", "what", "when", "where", "which", "while", "will", "with", "your", "yours",
]);

/**
 * Proper names (places, organisations, the award) that a head may repeat: a
 * place label over an intro that names the same village is the same place,
 * not the same statement. Lower case, matched on the whole word before
 * stemming; a hyphenated name counts per part ("Vorpommern-Greifswald").
 *
 * A list and not "capitalised mid-sentence": every German noun is capitalised,
 * so that test would also excuse "Küchenfenster". Add a name here when a page
 * needs it; a common noun never belongs in this list.
 */
export const PROPER_NAMES: ReadonlySet<string> = new Set([
  "schlatkow", "schmatzin", "rostock", "berlin", "anklam", "vorpommern", "greifswald",
  "mecklenburg", "pomerania", "nørd", "bitkom",
]);

/** A crude stem: enough to catch "nutzt" and "benutzt", not a linguistic claim. */
export function stem(word: string): string {
  let s = word
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss");
  for (const prefix of ["ver", "be", "ge"]) {
    if (s.startsWith(prefix) && s.length - prefix.length >= 5) {
      s = s.slice(prefix.length);
      break;
    }
  }
  for (const suffix of ["ungen", "ung", "ern", "en", "er", "es", "em", "st", "et", "e", "s", "t"]) {
    if (s.endsWith(suffix) && s.length - suffix.length >= 4) {
      s = s.slice(0, -suffix.length);
      break;
    }
  }
  return s;
}

/** The content-word stems of one line, each mapped back to the word it came from. */
export function stemsOf(line: string): Map<string, string> {
  const stems = new Map<string, string>();
  for (const word of line.split(/[^\p{L}]+/u)) {
    const lower = word.toLowerCase();
    if (word.length < 4 || FUNCTION_WORDS.has(lower) || PROPER_NAMES.has(lower)) continue;
    const s = stem(word);
    if (!stems.has(s)) stems.set(s, word);
  }
  return stems;
}

/** What a section head breaks of DEC-0206, one sentence per breach. Empty when it holds. */
export function sectionHeadFindings(head: SectionHead): string[] {
  const findings: string[] = [];
  const { levels } = head;
  if (levels.length > MAX_HEAD_LEVELS) {
    findings.push(
      `${levels.length} text levels before the content (${levels.map((level) => level.kind).join(" · ")}), at most ${MAX_HEAD_LEVELS}`,
    );
  }
  const stems = levels.map((level) => stemsOf(level.text));
  for (let a = 0; a < levels.length; a += 1) {
    for (let b = a + 1; b < levels.length; b += 1) {
      const shared = [...stems[a]!.keys()].filter((s) => stems[b]!.has(s));
      if (shared.length === 0) continue;
      const pairs = shared.map((s) => `${stems[a]!.get(s)}/${stems[b]!.get(s)}`).join(", ");
      findings.push(
        `${levels[a]!.kind} "${levels[a]!.text}" and ${levels[b]!.kind} "${levels[b]!.text}" share a stem (${pairs})`,
      );
    }
  }
  return findings;
}

/**
 * Microdata prop builders for `/ueber-uns/archiv` — TS-011 D4: an
 * `ItemList` of `NewsArticle`/`CreativeWork`, each with the **outlet** as
 * `publisher` and `url` to the original — a citation list, never authored
 * content. Microdata, not JSON-LD (one-entity rule): this module hands the
 * archive page (its own work package) DOM attributes to spread onto
 * existing markup, not a script tag.
 */

export interface MicrodataAttrs {
  readonly itemScope: true;
  readonly itemType: string;
  readonly itemProp?: string;
}

export function itemListProps(): MicrodataAttrs {
  return { itemScope: true, itemType: "https://schema.org/ItemList" };
}

export function listItemProps(): MicrodataAttrs {
  return {
    itemScope: true,
    itemType: "https://schema.org/ListItem",
    itemProp: "itemListElement",
  };
}

/** The cited work itself — `CreativeWork`, the closest of D4's two names for a citation without a NewsArticle-specific field (dateline, etc.) on hand. */
export function citationWorkProps(): MicrodataAttrs {
  return { itemScope: true, itemType: "https://schema.org/CreativeWork", itemProp: "item" };
}

/** Spread on the element naming the outlet — D4: "the outlet as `publisher`". */
export const PUBLISHER_ITEMPROP = "publisher";
/** Spread on the element carrying the outbound link to the original. */
export const URL_ITEMPROP = "url";
/** Spread on the element carrying the citation's own title. */
export const NAME_ITEMPROP = "name";

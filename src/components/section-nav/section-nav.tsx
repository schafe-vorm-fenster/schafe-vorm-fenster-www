import styles from "./section-nav.module.css";

export interface SectionNavItem {
  /** The heading's `id`; the link is a fragment, so it needs no route. */
  readonly id: string;
  readonly label: string;
}

export interface SectionNavProps {
  readonly items: readonly SectionNavItem[];
  readonly label?: string;
  /** The section currently in view, where the page knows it server-side. */
  readonly current?: string;
  readonly id?: string;
  readonly className?: string;
}

/**
 * 17 `section-nav` [PROPOSED] — TS-029 D4.
 *
 * Structure: one `nav` listing the registry sections in order, server-
 * rendered plain links. From the xl switch point it is a sticky column beside
 * the text, below the header; below that it stands once under the `h1` and
 * does not stick. It is never hidden behind a phone toggle — the list is the
 * table of contents of a long legal page, and hiding it is hiding the page.
 * States: marking the current section with an `IntersectionObserver` is
 * progressive enhancement. Without JavaScript there is no marker and nothing
 * else changes, which is why this component stays server-rendered and takes
 * the marker as a prop.
 * Inherits: Meta / Label-mono, hairline separators, a radius-0 list.
 * Space: the list length is known at build time.
 * A11y: an accessible name, `aria-current="true"` plus a non-colour-only
 * mark, targets ≥ 44 px.
 */
export function SectionNav({
  items,
  label = "Abschnitte",
  current,
  id = "abschnitte",
  className,
}: SectionNavProps) {
  return (
    <nav
      aria-label={label}
      className={[styles.nav, className].filter(Boolean).join(" ")}
      id={id}
    >
      <p className={styles.title}>{label}</p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              aria-current={item.id === current ? "true" : undefined}
              className={item.id === current ? styles.current : styles.link}
              href={`#${item.id}`}
            >
              {item.id === current ? (
                <span aria-hidden="true" className={styles.marker}>
                  ›
                </span>
              ) : null}
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

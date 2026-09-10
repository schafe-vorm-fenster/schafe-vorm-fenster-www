---
id: DEC-043
title: The brand typeface is Atkinson Hyperlegible Next; Catamaran is retired
status: accepted
date: 2026-09-10
---

# DEC-043 — The brand typeface is Atkinson Hyperlegible Next

## Context

TS-002 D3 and TS-003 D3 were written against Catamaran, taken from the
brand profile as it stood on 2026-09-09. The design system has since
moved — its own kit records the change in as many words: "Catamaran's old
rules" and "Catamaran sunset."

**Correction of 2026-09-10:** an earlier version of this record named
*Inter* as the successor. That was wrong — it came from counting
occurrences of the string "inter", which matches `letterSpacing`,
"interface" and similar. Read from the tokens themselves, the family is:

```
sans: 'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible',
      'Helvetica Neue', Helvetica, Arial, sans-serif
mono: 'Atkinson Hyperlegible Mono', 'Atkinson Hyperlegible Next',
      ui-monospace, monospace
```

## Decision

**Atkinson Hyperlegible Next** is the website's typeface, with the Mono
variant for markers rather than sentences (wordmark, eyebrows, labels,
table headers, meta lines, timestamps). Catamaran is not used, not
loaded, not carried as a fallback.

Source of truth: `@schafe-vorm-fenster/brand-design`, `font.family` in
`tokens.json`. The specs name no font value of their own.

## Consequences

- **The weight-floor question dissolves.** The family ships exactly two
  weights, `regular 400` and `bold 700` — there is no Light to guard
  against. TS-002 D3's floor becomes "body ≥ 400", which is the only
  option.
- Type sizes are already responsive at token level (`clamp()`), body at
  `1.125rem` — the specs consume them rather than restating them.
- The choice is itself an accessibility argument: Atkinson Hyperlegible
  was designed by the Braille Institute for low-vision readers, which is
  a strong fit for WCAG AA plus the AAA basics (TS-002 D1/D2) and for an
  audience of all ages.
- Q-034 narrows accordingly: verify the *colour world* (Lime, Violett,
  Himbeere — decided 2026-09-09) for contrast; the typeface needs no
  separate readability case.

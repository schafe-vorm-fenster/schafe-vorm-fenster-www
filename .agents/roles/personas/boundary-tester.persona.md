# Chaos persona: The Boundary Tester (Der Grenzgänger)

Feeds the site what nobody intended. Politely, thoroughly, at the
edges.

## Behaviour

- Every input: empty, single space, 10.000 characters, emoji,
  RTL text, `<script>alert(1)</script>`, `Robert'); DROP TABLE`,
  `%00`, surrogate halves.
- Place search: places that don't exist, ZIP codes from other
  countries, coordinates as text, umlauts in every position,
  "Schlatkow " with trailing whitespace.
- URLs: manufactured deep links, wrong locale prefixes, uppercase
  paths, query-string garbage, very long slugs.
- Required fields empty on submit; optional fields at maximum;
  paste-bombs into number fields.

## What to watch for

Unescaped output anywhere (XSS), raw error pages or stack traces,
layout collapse under long content, silent truncation, 500s where a
designed empty/error state belongs, validation messages that name
the wrong field.

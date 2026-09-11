# Generated placeholders

Do not edit these files. They are produced by `pnpm placeholders` from
`placeholders.manifest.json`, and they are **committed on purpose**
(DEC-068): a file that must exist on a clean checkout cannot be produced
on demand.

## What they are for

A gap in the content is filled with a placeholder, never left as an empty
slot — showing something everywhere beats showing only what is finished
and ours (DEC-068). The real asset is swapped in later; the aspect ratio
declared here is what it will be cropped to.

## The line that must not be crossed

A placeholder may **occupy** a slot. It may not **assert** anything.

No synthetic photograph of a person, no invented village, no invented
outlet, no invented testimonial, no figure that could read as data. That
is why these are flat graphics carrying the word PLATZHALTER and not, for
example, a generated portrait: the difference between an unfinished page
and a fabricated one.

Proof elements are outside this regime entirely. They are governed by
`usage_rights` clearance — an uncleared element is excluded, never
placeheld, and the claim it would have supported is weakened instead.

## Adding a slot

Add it to `placeholders.manifest.json` and run `pnpm placeholders`. Every
consumer renders with `data-placeholder="<id>"`, so the build can list
what still needs replacing and production promotion can require the list
to be empty.

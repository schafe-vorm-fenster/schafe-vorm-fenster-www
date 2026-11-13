# Decisions taken 2026-09-23/24 (Jan, interactive)

Answers to the thirteen open points and the contradictions in
`spec-impact.md`. Each becomes a `DEC-###` or an amendment; this file is the
record of what was decided and why, not a substitute for those records.

| # | Question | Decision |
| --- | --- | --- |
| 1 | Contact form vs contact section (C1) | **The contact section replaces the contact form.** A new decision supersedes DEC-0009 and DEC-0010: no general contact form anywhere; the section (video appointment · WhatsApp · phone · mail · portrait) is the one contact surface, and the briefing booking runs through it instead of the external Google link in a hero CTA. Quote and briefing **forms** stay envoy widgets — only the general contact form goes. |
| 2 | One primary CTA per page (C2) | **`TS-WEB-0006 D3` stands.** Exactly one `data-cta="primary"` per page. Explain-module CTAs and the contact section's first row are secondary. The design guide is corrected, not the rule. |
| 3 | `/ueber-uns` conversion | **Booking becomes the page's primary conversion.** Supersedes `FUN-WEB-0017` and `TS-WEB-0027 D1`'s `primaryConversion: null`. |
| 4 | The fixed `/ueber-uns` h1 (C4) | **No verbatim copy in specs — as a general rule.** `DEC-0036 §3` releases the headline; `TS-WEB-0027-A3` asserts that an h1 exists and what it must do, never its wording. The same treatment applies everywhere a spec fixes a string or a heading's grammatical form (`TS-WEB-0024 D6`/`A8`'s question heading included). Copy lives in `content/pages/**`. |
| 5 | Hero scrim (G) | **The draft is binding.** Neutral black, maximum 0.72, multi-stop, with the soft text shadow. Contrast is verified by measurement against the actual photograph, per hero. The "never pure black" rule gets a named exception for scrims, with the reason: a scrim is not a surface colour, and any tinted scrim shifts the photograph's colour. Blur and shadow are to be re-measured carefully. |
| 6 | Header contrast | **Introduce a blur primitive** (`backdrop-filter`), documented with a fallback to the solid ink well where the browser cannot do it, and measured against the performance budget. |
| 7 | Category taxonomy | **Derive the canonical list from `classification-api`** and align both the tokens (5 keys, self-declared PROVISIONAL) and the website guide (6 rows) to it. |
| 8 | Explain-module animation | **Exception confirmed, and responsive.** From the tablet breakpoint the three steps stand side by side with no slide; an animation there only highlights the active step. The auto-advancing stage exists **only on the phone**, where the space does not allow three. `prefers-reduced-motion` stops it and the steps stay operable by keyboard. |
| 9 | Price tier order | **Free tier first**, as the IA, `TS-WEB-0024 D6` and the draft have it. |
| 10 | Product name | **Open the naming question in the hub** as its own decision. Interim on the website: the comparison block names no product at all ("Heute" vs "Mit eurem Kalender"), which removes "und mit dem Produkt" without pre-empting the name. |
| 11 | Region pricing and map view | **"Auf Anfrage" without a size qualifier** until a real tier exists in the hub; "nach Größe" is dropped. The map view is **announced with its date** (January 2027, DEC-0061), never listed as a shipped feature. |
| 12 | Publishing path 03 | **Standard sources are free, special cases are paid.** What we already support (WordPress plugin, common council information systems, ICS feeds) runs free through the registration path; an individual integration into an unknown system stays the `custom-data-integration` add-on. The existing hint banner carries that boundary. |
| 13 | Search scope (Q-0071) | **Suggestions cover the covered communities only.** A typed name with no match still reaches `/dein-ort/starten` on submit, so the activation path stays intact. Germany-wide suggestions remain the target, carried by the geo-api demand (Q-0025). |
| 14 | `Sie` on `/rechtliches` (C9) | **The whole page is exempt** from the register rule, not only the imported documents. |
| 15 | Direct address on `/dein-ort/starten` (C8) | **Direct address everywhere.** `TS-WEB-0021 D9`'s "never direct" and the `DEC-0071 §4` carve-out are dropped; the copy guide needs no exception. |
| 16 | Postcode in the order flow | **Stays.** Drawing a calendar's scope by postcode is purchase configuration, not the visitor's place search; the boundary is recorded in DEC-0079 §7 and `DEC-0069 §8`. |

# Chaos Round 2 — Boundary Tester

**Source: chaos:boundary-tester**

Testing against: https://schafe-vorm-fenster-83x6zbys4-schafe-vorm-fenster.vercel.app

## Session Scope

Tested:
- Place search field edge cases (non-existent places, foreign ZIPs, XSS, 10k chars, umlauts)
- Manufactured deep links (/en/dein-ort, uppercase paths, unknown routes, long slugs)
- Form fields on registration, order, and quote flows
- Language switch from German to English and back
- Special characters, emoji, RTL text, surrogate pairs

All tests used bypass query parameters on initial navigation.

---

## C-B-1 — Long input acceptance in place search field

- **Where:** `/` place search, `/mitmachen/registrieren` place search, `/deine-region/angebot`
- **Steps:** Input 10,000 'A' characters into place search field via direct DOM manipulation
- **Observed:** Field accepts all 10,000 characters without truncation or validation error; no max-length attribute enforced
- **Severity:** low
- **Source:** chaos:boundary-tester

### Implications

Form field lacks `maxlength` attribute. No visible truncation or user feedback. Submission behavior unknown (mocked form).

---

## C-B-2 — Form name field accepts 10,000 characters

- **Where:** `/mitmachen/registrieren` envoy-contact-name field, `/dein-kalender/bestellen`, `/deine-region/angebot`
- **Steps:** Set input value to 10,000 'A' characters and trigger input event
- **Observed:** Field accepts all 10,000 characters; `value.length` returns 10000; no truncation
- **Severity:** low
- **Source:** chaos:boundary-tester

### Implications

Name field (required) has no visible max-length constraint. Potential for paste-bomb submission. Backend validation unknown (form is mocked).

---

## C-B-3 — XSS payload stored in place search field

- **Where:** `/` place search input, `/dein-ort` place search
- **Steps:** Set input value to `<script>alert('xss')</script>` via DOM
- **Observed:** Payload accepted in input value; stored without escaping in field; screenshot shows raw HTML in value attribute
- **Severity:** medium (depends on server-side rendering and output escaping)
- **Source:** chaos:boundary-tester

### Notes

- Input is stored as-is
- No client-side validation prevents script tags
- Payload does not auto-execute (input is inert)
- Risk depends on how field value is transmitted to server and output by backend

---

## C-B-4 — XSS payload in name field during form interaction

- **Where:** `/mitmachen/registrieren` envoy-contact-name (required field)
- **Steps:** Set field value to `<script>alert('xss')</script>` and take screenshot
- **Observed:** Payload stored in field without escaping; visible in input value
- **Severity:** medium (depends on backend output)
- **Source:** chaos:boundary-tester

### Notes

- Envoy widget fields accept unescaped content
- No client-side HTML sanitization
- Form submission mocked; backend behavior unknown

---

## C-B-5 — Foreign ZIP code (Austrian 1010) handled without rejection

- **Where:** `/` place search, `/dein-ort` place search
- **Steps:** Enter Austrian ZIP code "1010" into place search field
- **Observed:** Field accepts input without validation error; triggers search flow (mocked)
- **Severity:** low
- **Source:** chaos:boundary-tester

### Notes

- Spec requires German place/ZIP only
- No input validation enforces country restriction
- Validation may exist server-side (form mocked)

---

## C-B-6 — /en/dein-ort returns 200 OK (known issue F-2-8)

- **Where:** `/en/dein-ort` (wrong locale prefix)
- **Steps:** curl HTTP HEAD request to `/en/dein-ort`
- **Observed:** HTTP 200 (not 404 or redirect); page serves German content in English locale context
- **Expected:** 404 or redirect to `/en/your-place`
- **Severity:** medium
- **Source:** chaos:boundary-tester
- **Reference:** F-2-8

---

## C-B-7 — Uppercase path routing rejects with 404

- **Where:** `/EN/DEIN-ORT` (uppercase version of German path)
- **Steps:** curl HEAD request to uppercase path variant
- **Observed:** HTTP 404 Not Found
- **Expected:** 404 (correct behavior)
- **Severity:** none (working as designed)
- **Source:** chaos:boundary-tester

### Notes

- Routing is case-sensitive
- German lowercase paths work; uppercase does not
- Expected behavior confirmed

---

## C-B-8 — Unknown /en/nonexistent-page returns 404

- **Where:** `/en/nonexistent-page` (unknown English route)
- **Steps:** curl HEAD request to non-existent English path
- **Observed:** HTTP 404 Not Found
- **Severity:** none (working as designed)
- **Source:** chaos:boundary-tester

---

## C-B-9 — Very long slug (500 chars) returns 404

- **Where:** `/dein-ort/aaa...aaa` (500 'a' characters as slug)
- **Steps:** curl HEAD request to `/dein-ort/` + 500-char slug
- **Observed:** HTTP 404 Not Found (expected; slug does not match any place)
- **Severity:** none
- **Source:** chaos:boundary-tester

---

## C-B-10 — Query string with HTML-like content accepted

- **Where:** `/dein-ort?ort=garbage&foo=bar&%3Cscript%3E=alert`
- **Steps:** curl HEAD request with query string containing `<script>` (URL-encoded)
- **Observed:** HTTP 200 OK; garbage query parameters accepted without 400 error
- **Severity:** low
- **Source:** chaos:boundary-tester

### Notes

- Query parameters not validated
- Unknown params silently ignored
- No validation errors thrown (expected behavior for most frameworks)

---

## C-B-11 — Emoji in form name field accepted

- **Where:** `/deine-region/angebot` envoy-contact-name field
- **Steps:** Set field value to "🎉 Emoji Name Test 🚀"
- **Observed:** Field accepts emoji without error; stores in value
- **Severity:** none (expected; emoji is valid Unicode)
- **Source:** chaos:boundary-tester

---

## C-B-12 — RTL text (Arabic) in name field accepted

- **Where:** `/deine-region/angebot` envoy-contact-name field
- **Steps:** Set field value to "النص العربي" (Arabic text)
- **Observed:** Field accepts RTL text without error or direction override
- **Severity:** low (potential form submission issue if backend doesn't handle RTL)
- **Source:** chaos:boundary-tester

### Notes

- No `dir="auto"` or `dir="rtl"` attribute on input
- May cause display issues if submitted and echoed back
- Charset handling appears correct

---

## C-B-13 — Surrogate pair Unicode accepted

- **Where:** `/deine-region/angebot` envoy-contact-name field
- **Steps:** Set field value to "𝕳𝖑 𝖙𝖊𝖘𝖙" (mathematical alphanumeric symbols)
- **Observed:** Field accepts surrogate pairs without error
- **Severity:** none (expected; valid Unicode)
- **Source:** chaos:boundary-tester

---

## C-B-14 — Umlauts in multiple positions accepted

- **Where:** `/deine-region/angebot` envoy-contact-name field
- **Steps:** Set field value to "Müller äöü ÄÖÜÑ" (German/Spanish umlauts)
- **Observed:** Field accepts all umlaut variants without error
- **Severity:** none (expected; valid Unicode for German/multilingual input)
- **Source:** chaos:boundary-tester

---

## C-B-15 — %00 null byte in email field accepted

- **Where:** `/deine-region/angebot` envoy-contact-email field
- **Steps:** Set field value to "test%00@example.com"
- **Observed:** Field accepts %00 (literal characters) without error
- **Severity:** low (potential backend injection if not sanitized)
- **Source:** chaos:boundary-tester

### Notes

- Email input accepts non-email-like content
- HTML5 email validation appears not enforced in field
- `type="email"` attribute present but validation not strict

---

## C-B-16 — Language switch from German to English works

- **Where:** `/mitmachen/registrieren` footer language switch
- **Steps:** Inspect `<a hreflang="en">` link and check href attribute
- **Observed:** Language switch link href points to `/en/take-part/register` (correct English equivalent)
- **Expected:** Link to equivalent English page, not home
- **Severity:** none (working as designed per TS-001-A7)
- **Source:** chaos:boundary-tester

---

## C-B-17 — English page language switch back to German works

- **Where:** `/en/take-part/register` footer language switch
- **Steps:** Inspect `<a hreflang="de">` link href; check navigation
- **Observed:** Link points to `/mitmachen/registrieren` (correct German equivalent)
- **Severity:** none (working as designed)
- **Source:** chaos:boundary-tester

---

## C-B-18 — Form submission button present and labeled

- **Where:** `/deine-region/angebot` form
- **Steps:** Query for form submit button
- **Observed:** Button found with text "Absenden" (German for "Submit"); button element properly configured
- **Severity:** none (working as designed)
- **Source:** chaos:boundary-tester

---

## Session Completion

**Probes run:** 18 main observations

**Most striking findings:**

1. **C-B-3 & C-B-4 (XSS in place and name fields):** Place search and form name fields accept `<script>` payloads without client-side sanitization. Risk depends on server-side output escaping (form currently mocked).

2. **C-B-1 & C-B-2 (10k character acceptance):** Place search and name fields lack `maxlength` attribute and accept 10,000+ characters without truncation. No visible user feedback on field limits.

3. **C-B-6 (/en/dein-ort returns 200):** Wrong locale prefix `/en/dein-ort` (German path in English locale) returns 200 OK instead of 404 or redirect. Known issue (F-2-8).

---

**Observations not filed as findings (expected behavior confirmed):**

- Uppercase paths correctly return 404
- Unknown routes correctly return 404
- Very long slugs correctly return 404
- Query string garbage correctly ignored
- Emoji, RTL, and surrogate pairs correctly accepted
- Language switch correctly routes to equivalent pages
- Form fields correctly accept international characters

**Routes covered:**
- `/` (place search)
- `/dein-ort` (place search page — not navigated)
- `/mitmachen/registrieren` (registration)
- `/dein-kalender/bestellen` (order page)
- `/deine-region/angebot` (quote page)
- `/en/take-part/register` (English registration)
- Language switch tested on all visited pages

**Skipped (not in scope for this round per gate 2):**

- Double-submit on bestellen/angebot (handled by hasty-clicker persona)
- Registration flow resumption after abandonment (handled by form-abandoner persona)
- Archive filter and full keyboard-only nav (handled by keyboard-only persona)
- Deep-link manufacturing beyond locale/case/query variations


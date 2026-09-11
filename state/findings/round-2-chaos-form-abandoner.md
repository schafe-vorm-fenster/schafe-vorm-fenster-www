# Round 2 — Chaos Testing: Form Abandoner Persona

Test session for the Form Abandoner (Der Abbrecher) persona.

**Source:** chaos:form-abandoner
**Environment:** https://schafe-vorm-fenster-83x6zbys4-schafe-vorm-fenster.vercel.app
**Test routes:** `/mitmachen/registrieren`, `/dein-kalender/bestellen`, `/deine-region/angebot`, language switch
**Session ID:** chaos-abandon-run-2

---

## Routes Covered

1. `/mitmachen/registrieren` (Registration form) - all 3 steps
2. `/dein-kalender/bestellen` (Order form) - steps 1-3
3. `/deine-region/angebot` (Quote form) - single step
4. Language switch (DEUTSCH/ENGLISH) on all tested routes

## Observations

### C-A-01 — Template variable not substituted in quote page heading

- Severity: medium
- Source: chaos:form-abandoner
- Where: `/deine-region/angebot` (quote page), `<h1>` heading
- Steps: Navigate to `/deine-region/angebot` after switching language to English
- Expected: Heading should read "Request a quote for [county or organization name]"
- Observed: Heading reads "Request a quote for {county-or-organization}" — the template variable is not filled in
- Route: `/en/your-region/quote` (English equivalent)

### C-A-02 — Form labels not localized when switching to English on quote page

- Severity: medium
- Source: chaos:form-abandoner
- Where: `/deine-region/angebot` quote form, form labels
- Steps:
  1. Navigate to `/deine-region/angebot` (German version)
  2. Click language switch to "ENGLISH" in footer
  3. Observe form labels
- Expected: Form labels should be in English ("Organization", "Name", "Email", "Phone", "What is it about?")
- Observed: Form labels remain in German ("Organisation", "E-Mail-Adresse", "Telefon", "Worum geht es?") while the rest of the page (heading, navigation, buttons) switched to English
- Route: `/en/your-region/quote`

### C-A-03 — Mixed language content in footer after language switch on quote page

- Severity: low
- Source: chaos:form-abandoner
- Where: Footer region on quote page after switching to English
- Steps:
  1. Navigate to `/deine-region/angebot`
  2. Click language switch to "ENGLISH"
  3. Scroll to footer
- Expected: All footer labels and contact form labels should be in English
- Observed: Some footer sections show English ("CONTACT", "NEWSLETTER", "IMPRINT") but form labels and placeholder text remain German ("Nachricht", "Anmelden")
- Route: `/en/your-region/quote`

### C-A-04 — Form data not retained between new sessions (resumption via direct URL)

- Severity: low (expected behavior as stated on the order form)
- Source: chaos:form-abandoner
- Where: Registration form (`/mitmachen/registrieren`) and Order form (`/dein-kalender/bestellen`)
- Steps:
  1. Fill postal code in Step 1 of order form
  2. Close browser session
  3. Open new session and navigate directly to `/dein-kalender/bestellen`
- Expected (per spec): Place selection retained, billing form cleared
- Observed: Form resets to Step 1 with empty postal code field. Site explicitly states "Die Rechnungsangaben musst du einmal neu eingeben — diese Website speichert nichts davon zwischen zwei Seitenaufrufen" (Billing information must be entered again — this website does not save anything between page views)
- Note: This is documented on the order form itself, appears intentional

### C-A-05 — Registration flow resumption via direct URL starts at Step 1

- Severity: low
- Source: chaos:form-abandoner
- Where: `/mitmachen/registrieren` (registration flow)
- Steps:
  1. Fill postal code in registration Step 1
  2. Click search to proceed to Step 2
  3. Select organization type in Step 2
  4. Close browser session
  5. Open new session and navigate directly to `/mitmachen/registrieren`
- Expected: Continue at Step 2 or show current progress
- Observed: Form resets to Step 1 with empty postal code field. No progress indication or resumption state visible

### C-A-06 — Language switch from quote page (English) redirects to quote page (German)

- Severity: low
- Source: chaos:form-abandoner
- Where: Language switch navigation from `/en/your-region/quote` to `/deine-region/angebot`
- Steps:
  1. Navigate to `/deine-region/angebot` (quote page, German)
  2. Fill in organization field ("Test Org")
  3. Click "ENGLISH" language switch
  4. Click "DEUTSCH" language switch to return to German
- Expected: Return to quote page with any previously entered data, or at least to the German equivalent
- Observed: Successfully switches languages and maintains route context (always on quote/angebot page), but form data is lost between language switches

## Summary

- **Total observations**: 6
- **Routes covered**: 4 main routes (registration, order, quote, language switch)
- **Most striking findings**:
  1. Template variable not rendering in English quote page heading
  2. Form labels not localized when switching to English on quote page (localization incomplete)
  3. Form resumption resets to Step 1 for both registration and order flows across new sessions


# Domain Configuration

## Overview

The Community Calendar uses **country-code TLDs** for locale detection. The hostname's TLD determines the default language via [`TLD_LANGUAGE_MAP`](../apps/web/src/data/supported-languages.ts). Users can override the language with a URL path prefix (e.g., `/en/m/slug.id`).

## Vercel Domain Setup

### Production Domains

| Domain                                     | TLD | Default Language | Notes                                    |
| ------------------------------------------ | --- | ---------------- | ---------------------------------------- |
| `next.schafe-vorm-fenster.de`              | de  | German (de)      | Will become `www.schafe-vorm-fenster.de` |
| `next.owcezaoknem.pl`                      | pl  | Polish (pl)      | Will become `www.owcezaoknem.pl`         |
| `next.schafvormfenster.at`                 | at  | German (de)      | Will become `www.schafvormfenster.at`    |
| `community-calendar-production.vercel.app` | —   | German (de)      | Vercel default production domain         |

> **Note:** The `next.*` prefix is temporary for pre-launch. It will be replaced with `www.*` (or removed) once the project goes live.

### Preview Domains

| Domain                                  | TLD | Default Language | Notes                           |
| --------------------------------------- | --- | ---------------- | ------------------------------- |
| `preview.schafe-vorm-fenster.de`        | de  | German (de)      | Preview environment for testing |
| `preview.owcezaoknem.pl`                | pl  | Polish (pl)      | Preview environment for testing |
| `preview.schafvormfenster.at`           | at  | German (de)      | Preview environment for testing |
| `community-calendar-preview.vercel.app` | —   | German (de)      | Vercel default preview domain   |

### Local Development Domains

Configured via [`scripts/setup-local-domains.sh`](../scripts/setup-local-domains.sh) (adds entries to `/etc/hosts`):

| Domain                         | TLD | Default Language |
| ------------------------------ | --- | ---------------- |
| `local.schafe-vorm-fenster.de` | de  | German (de)      |
| `local.schafe-vorm-fenster.pl` | pl  | Polish (pl)      |
| `local.schafe-vorm-fenster.at` | at  | German (de)      |

## TLD-to-Language Mapping

Defined in [`apps/web/src/data/supported-languages.ts`](../apps/web/src/data/supported-languages.ts):

| TLD   | Language |
| ----- | -------- |
| `.de` | German   |
| `.pl` | Polish   |
| `.at` | German   |

All other TLDs (including `.app` for Vercel domains and `localhost`) fall back to German (`de`).

## How It Works

1. A request arrives at the Vercel edge
2. Astro reads the hostname from `Astro.url.hostname`
3. [`detectLocale()`](../apps/web/src/helpers/routing/detect-locale.ts) extracts the TLD and looks it up in `TLD_LANGUAGE_MAP`
4. If a language prefix exists in the URL path (e.g., `/en/...`), it overrides the TLD default
5. No middleware is used — detection happens at page level for performance

# Ecosystem Architecture Reference

> **Scope:** This document preserves backend and ecosystem-level architecture principles from the original project concept that are **out of scope** for this frontend repository but important for the broader Schafe vom Fenster platform. These principles govern the microservice ecosystem that this frontend consumes.

## Core Ecosystem Principles

### API First

Every interaction, data stream, and business process is defined as a technical interface (API) before any user interface is considered. APIs are the primary product; UIs are secondary consumers.

### Domain Centricity

Services are organized around semantic domains. Each service has absolute sovereignty over its domain (e.g., "Calendar," "Geodata," "User Communication"). Overlaps between service domains are strictly forbidden.

### "General Store" (Bauchladen) Principle

Services act as agnostic providers. A service is responsible for its own "wares" (data and logic) and offers them for retrieval. It does not "push" data to other services nor does it need to know which services are consuming its data.

### Pull Principle & Notification-Pot

Services do not actively push data into other systems. Instead:

- A service that requires data must **pull** it from the source.
- To trigger pulls, a central **Notification-Pot** (Event-Streaming) is used.
- Services publish standardized events to the "Pot."
- Interested services subscribe to events and pull necessary updates.

**Notification event schema fields:** Source, Type, Entity ID, Timestamp, Trace ID.
**Event naming examples:** `calendar.deleted`, `customer.registered`.

### Statelessness and Recoverability

Services should hold **zero origin data**. A service must be designed so that it can be deleted, restarted, and its entire state 100% reconstructed from external sources (e.g., Google Calendar, Wikidata).

### Channel Independence

Business logic remains central in the API. A registration process must function identically whether it happens via a web form or a WhatsApp conversation.

## Internal Service Model (3-Level Separation)

Every microservice is internally structured into three distinct layers:

1. **Clients:** Technical adapters for external systems. They handle authentication, low-level communication, and the **Factory Adapter Pattern** to ensure external providers can be swapped easily (e.g., switching from Google Translate to DeepL).
2. **Services:** Contains the business logic. Operates exclusively on internal domain objects provided by the Clients.
3. **Coordinators:** Orchestrate interactions between multiple services. **Rule:** Coordinators are forbidden from accessing Clients directly; they must interact via the Service layer.

## Security and Governance

- Granular authorization handled at the API layer.
- The security model must allow for easy extension to new user groups, white-label partners, or internal roles without core refactoring.

## External Systems

### Technical Infrastructure Services

| Service                  | Purpose                                                       |
| ------------------------ | ------------------------------------------------------------- |
| MongoDB                  | General purpose data persistence and caching                  |
| Typesense                | High-performance indexed search and filtered mass data access |
| Google Cloud Tasks       | Management of asynchronous background jobs and queues         |
| Google Gemini            | AI-driven analysis (text, image, and data contextualization)  |
| Google Translate / DeepL | Automated translation services                                |

### External Data & Communication Sources

| Source                             | Purpose                                            |
| ---------------------------------- | -------------------------------------------------- |
| Mateo                              | Central hub for user communication (WhatsApp, SMS) |
| Google Calendar                    | Primary source for scheduling and event data       |
| Google Maps                        | Geolocation and mapping services                   |
| Wikidata / OpenGeoNames            | Open data for entity enrichment and geodata        |
| Company/Association Registers      | External databases for entity verification         |
| Social Media (Facebook, Instagram) | User-driven interactions                           |

## Technology Transition Paths

| Area                   | Legacy          | Target                           |
| ---------------------- | --------------- | -------------------------------- |
| Frontend (Static)      | Next.js / React | **Astro**                        |
| Frontend (Interactive) | React           | **Svelte / SvelteKit (Islands)** |
| Backend API Framework  | Next.js (REST)  | Next.js (REST) — unchanged       |
| Event Streaming        | Webhooks        | **Notification-Pot (Event Bus)** |

## Web Components Strategy

Transactional UI elements (Login, Registration, Appointment Booking) are built as Web Components. This enables "two-line" integration into any website, allowing true white-labeling and infrastructure independence. These are separate from the Community Calendar frontend.

## Scalability Principle

The system treats every geographic unit as an instance of a single class. A "County" is simply a high-level container that aggregates the "Communities" within it. The logic remains identical whether we have 10 or 10,000 communities (CON-CPN-2.0).

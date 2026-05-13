# Legacy Content Archive

This folder preserves content and assets from the previous website implementation.

Archive rules:

- Move all legacy website copy, markdown sources, imported legal content, and media here.
- Keep content-bearing implementation files when they contain copy that is not stored elsewhere.
- Remove the old runtime/framework scaffolding from the repository root so a new stack can start cleanly.

Current archive layout:

- `app/` contains the previous route files and components, including content embedded directly in TSX.
- `content/` contains imported legal content and its import manifest.
- `public/` contains the previous media library.
- `lib/legal-content.ts` contains the legacy legal-content reader.
- `scripts/import-content.ts` contains the legacy content import script.
- `hilfe-komplett.md` contains the consolidated help export.

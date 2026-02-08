# Specification

## Summary
**Goal:** Let admins bulk publish the provided glossary terms (CEDEL through Custody risk) into the on-chain glossary so they become visible and searchable.

**Planned changes:**
- Add an admin-only bulk publish action that submits the provided C-terms to the existing backend batch API, using deterministic normalized keys to avoid duplicates and update existing entries.
- Ensure each entry stores the exact provided term and definition text; set example/usage to empty strings unless explicitly provided.
- Add minimal admin UI within the Glossary area describing what will be imported and requiring an explicit confirmation before publishing.
- On publish success, show an English success message and refresh glossary queries so new terms appear immediately; on error, show an English error message including the error string when available.
- Enforce admin-only access both in the UI (hidden for non-admins) and in the backend (reject/trap unauthorized calls).

**User-visible outcome:** Admins can confirm and bulk publish the provided C-terms into the glossary, and then immediately search and view them on the Glossary page; non-admin users will not see the bulk publish controls.

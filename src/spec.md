# Specification

## Summary
**Goal:** Replace the app’s existing logo and favicon with assets derived from the uploaded logo image (`012.jpeg`) while keeping all referenced URL paths unchanged.

**Planned changes:**
- Regenerate/replace the existing logo asset at `/assets/generated/logo-finance-ki-sharan-transparent.dim_200x100.png` to visually match `012.jpeg` and work on light/dark themes.
- Regenerate/replace the existing favicon asset at `/assets/generated/favicon-logo.dim_32x32.png` to match `012.jpeg` and remain legible at 32×32.
- Keep existing code references unchanged in `frontend/src/components/Header.tsx`, `frontend/src/components/MaintenanceScreen.tsx`, and `frontend/index.html`.

**User-visible outcome:** The header and maintenance screen display the new provided logo, and the browser tab shows a matching favicon, with no broken image links.

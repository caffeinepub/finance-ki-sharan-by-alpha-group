# Specification

## Summary
**Goal:** Improve Draft and Live page load performance by reducing initial bundle size, deferring non-critical work, and minimizing redundant startup queries.

**Planned changes:**
- Code-split and lazy-load non-home route components (learning, glossary, articles, research, blogs, calculators, admin, etc.) so they are not included in the initial home bundle.
- Add a consistent route-level loading UI for lazy-loaded routes (English “Loading...” or equivalent) to show immediate feedback during chunk download/query latency.
- Load the ChatAssistantWidget asynchronously so it does not block initial render or first paint.
- Optimize home hero image loading to reduce layout shift and avoid blocking interactivity (explicit dimensions and appropriate loading behavior).
- Tune React Query caching/refetch settings for global/always-on checks (e.g., maintenance/admin checks and footer ticker) to reduce redundant refetching and prevent the app feeling “stuck” on initial load.

**User-visible outcome:** The home page loads faster, navigation to other pages shows a quick loading state while code downloads, the chat widget appears after initial content renders, the hero image is smoother with less layout shift, and startup checks/ticker feel less “heavy” due to better query caching.

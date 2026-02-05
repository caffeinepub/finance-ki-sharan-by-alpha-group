# Specification

## Summary
**Goal:** Add a dedicated Blogs feature (separate from Articles) with backend support and a new public UI section.

**Planned changes:**
- Backend: introduce a new `BlogPost` record type distinct from `Article`, with public query APIs to list blog posts and fetch a single blog post by id, plus admin-only CRUD APIs to create, update, and delete blog posts (with backend-generated monotonically increasing ids).
- Frontend: add `/blogs` (list) and `/blogs/$id` (detail) routes using the existing TanStack Router pattern, including loading/empty/error/not-found states.
- Frontend: add React Query hooks in `frontend/src/hooks/useQueries.ts` for fetching the blog list and an individual blog post by id, following existing article/research patterns.
- Frontend: update global navigation (desktop + mobile) to include a “Blogs” top-level item linking to `/blogs`, with active-route styling working for both list and detail routes.

**User-visible outcome:** Users can navigate to a new Blogs section from the header, browse a list of blog posts, and open individual blog posts by id.

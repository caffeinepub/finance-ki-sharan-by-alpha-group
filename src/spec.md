# Specification

## Summary
**Goal:** Ensure Draft Glossary reliably shows saved terms after backend upgrades and avoid misleading “Glossary is Empty” UI when the backend actor is unavailable.

**Planned changes:**
- Persist glossary terms in the Motoko backend across canister upgrades so previously added terms remain available after deployments.
- Adjust Glossary page empty-state logic to only show “Glossary is Empty” after a successful fetch returns zero terms; show loading/error state instead when the actor is unavailable or the query fails.
- Add lightweight developer-facing console diagnostics in the Glossary fetch path to distinguish actor-not-initialized, query-disabled, successful-empty result, and fetch error states.

**User-visible outcome:** After draft deployments/upgrades, glossary terms remain visible, and the Glossary page no longer incorrectly shows “Glossary is Empty” when the backend connection/actor isn’t ready—while providing clearer console signals for debugging draft issues.

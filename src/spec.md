# Specification

## Summary
**Goal:** Embed the shared Google Feedback Form directly inside the Contact page’s existing “Feedback” card in a responsive, card-style layout.

**Planned changes:**
- Update the Contact page “Feedback” card to render the Google Form in an embedded iframe within the card content area.
- Remove the current “Open Feedback Form” button/link from the Contact page card.
- Centralize the iframe embed URL derivation in the existing feedback form utility so Contact uses the shared constant (no duplicated hardcoded URL).

**User-visible outcome:** On the Contact page, users can fill out the Feedback Google Form directly inside the “Feedback” card without being redirected to a new tab.

# Specification

## Summary
**Goal:** Add a reusable Cash Flow schedule section to every calculator page, with CSV export.

**Planned changes:**
- Create a reusable “Cash Flow” UI component under the calculators components area that renders a time-ordered schedule (period/date label, cash-flow amount, optional running balance) and shows an English “Not applicable” message when a schedule doesn’t apply.
- Update all existing calculator pages to include the Cash Flow section and generate an appropriate cash-flow schedule from each calculator’s current inputs/assumptions (including using the user-edited list for XIRR).
- Add a client-side “Download CSV” action in the Cash Flow section that exports exactly the currently displayed rows (with a header row).

**User-visible outcome:** Every calculator page shows a “Cash Flow” section with a clear schedule (or a clear “Not applicable” message), and users can download the displayed cash-flow schedule as a CSV.

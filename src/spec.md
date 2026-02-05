# Specification

## Summary
**Goal:** Replace the calculators’ invested-vs-earned result breakdown visualization from a bar chart to a pie/donut chart while preserving existing styling, labels, and values.

**Planned changes:**
- Add a new reusable pie/donut breakdown component under `frontend/src/components/calculators` that accepts the same inputs as the current bar chart (invested, earned, optional total, optional label overrides), supports light/dark theme tokens, shows a legend with INR-formatted values, and renders the existing empty-state card when values are zero/empty.
- Update calculator pages that currently use `ResultBreakdownBarChart` (at minimum SIP, Lump Sum, and PPF) to use the new pie/donut breakdown component in the same placement below the numeric results summary, preserving labels and displayed values.

**User-visible outcome:** On SIP, Lump Sum, and PPF calculators, users see a pie/donut chart (with legend and INR values) breaking down invested vs earned, with the same empty-state prompt when inputs are not valid.

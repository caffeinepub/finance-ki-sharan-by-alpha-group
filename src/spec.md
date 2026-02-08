# Specification

## Summary
**Goal:** Fetch and display live share prices sourced from NSE India in the frontend Market Ticker.

**Planned changes:**
- Add backend HTTP outcall logic to retrieve the latest available stock price data from https://www.nseindia.com/ and expose a query method returning stock records with: symbol, companyName, ltp, dayClose.
- Add backend-side caching/throttling so outcalls are not excessive while still providing reasonably fresh data, and handle upstream errors gracefully without trapping.
- Update the frontend footer market ticker to use the backend-provided NSE data and show clear loading, empty, and non-crashing error states.

**User-visible outcome:** The Market Ticker displays NSE-sourced stock information (company name, symbol, and price), shows a loading indicator while fetching, and provides a clear “data unavailable/empty” experience if data cannot be loaded.

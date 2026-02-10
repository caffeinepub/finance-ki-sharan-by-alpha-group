# Specification

## Summary
**Goal:** Replace the existing market ticker with a live NIFTY 100 (Top 100) ticker whose data is fetched server-side from NSE India.

**Planned changes:**
- Add a backend method that fetches NIFTY 100 stock data from https://www.nseindia.com/ via canister HTTP outcalls and returns an array of stocks (symbol, companyName, ltp, dayClose), with server-side caching and resilient fallback to cached/empty results on failure.
- Add a new React Query hook (e.g., `useGetNifty100Stocks`) in `frontend/src/hooks/useQueries.ts` to call the new backend method and periodically refetch for live updates, returning an empty array when the backend actor is unavailable.
- Update the market ticker UI to display NIFTY 100 (instead of NIFTY 50), including label text for live vs closed market state, and showing loading/error states consistent with the current Footer ticker UX.

**User-visible outcome:** The website ticker shows up to 100 NIFTY 100 stocks with live (or closing) prices and appropriate labels, updating periodically without the browser calling NSE directly.

/**
 * Single source of truth for the minimal grouped navigation structure.
 * Used by both desktop dropdowns and mobile grouped lists.
 */

export interface NavSubItem {
  label: string;
  path: string;
  hash?: string;
  query?: Record<string, string>;
}

export interface NavGroup {
  label: string;
  items: NavSubItem[];
}

export const NAV_STRUCTURE: NavGroup[] = [
  {
    label: 'Home',
    items: [
      { label: 'Overview', path: '/', hash: 'overview' },
      { label: 'Featured Content', path: '/', hash: 'features' },
      { label: 'Latest Articles', path: '/', hash: 'latest' },
    ],
  },
  {
    label: 'Learn',
    items: [
      { label: 'Learn Finance', path: '/learning' },
      { label: 'Personal Finance', path: '/learning', query: { topic: 'personal-finance' } },
      { label: 'Stock Market', path: '/learning', query: { topic: 'stock-market' } },
      { label: 'Mutual Funds', path: '/learning', query: { topic: 'mutual-funds' } },
      { label: 'ETFs', path: '/learning', query: { topic: 'etfs' } },
      { label: 'Bonds', path: '/learning', query: { topic: 'bonds' } },
      { label: 'Insurance', path: '/learning', query: { topic: 'insurance' } },
      { label: 'Economic Environment', path: '/learning', query: { topic: 'economic-environment' } },
    ],
  },
  {
    label: 'Read',
    items: [
      { label: 'Articles', path: '/articles' },
      { label: 'Blogs', path: '/blogs' },
      { label: 'Research Papers', path: '/research' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Glossary', path: '/glossary' },
      { label: 'Regulations', path: '/regulations' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Calculator', path: '/calculators' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'About Finance Ki Sharan', path: '/about' },
      { label: 'Mission & Philosophy', path: '/about', hash: 'mission' },
      { label: 'Contact', path: '/contact' },
    ],
  },
];

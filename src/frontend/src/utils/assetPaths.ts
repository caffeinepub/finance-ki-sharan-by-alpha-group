/**
 * Centralized asset path management for static assets.
 * Provides consistent URLs across the application.
 * Uses Vite's BASE_URL for proper base-path support in production deployments.
 */

/**
 * Get base path from Vite's build configuration
 * This works correctly in both development and production, including non-root deployments
 */
function getBasePath(): string {
  // Use Vite's BASE_URL which is set during build time
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Remove trailing slash for consistency
  return baseUrl.endsWith('/') && baseUrl.length > 1 ? baseUrl.slice(0, -1) : baseUrl === '/' ? '' : baseUrl;
}

/**
 * Create asset URL with base path support
 * No cache-busting query params to avoid 404s on IC asset canister
 */
function createAssetUrl(path: string): string {
  const basePath = getBasePath();
  return `${basePath}${path}`;
}

export const ASSET_PATHS = {
  logo: createAssetUrl('/assets/generated/logo-finance-ki-sharan-transparent.dim_200x100.png'),
  favicon: createAssetUrl('/assets/generated/favicon-logo-v2.dim_32x32.png'),
  heroImage: createAssetUrl('/assets/generated/hero-finance-learning.dim_800x400.png'),
} as const;

export const BRAND_NAME = 'Finance Ki Sharan';
export const BRAND_TAGLINE = 'By Alpha Group';

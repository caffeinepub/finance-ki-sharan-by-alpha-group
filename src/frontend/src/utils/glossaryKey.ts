// Deterministic glossary key normalization utility
// Ensures consistent key generation to prevent duplicates across repeated publishes

/**
 * Normalizes a glossary term into a deterministic key
 * - Converts to lowercase
 * - Trims whitespace
 * - Collapses multiple spaces into single space
 * - Removes special characters that might cause issues
 */
export function normalizeGlossaryKey(term: string): string {
  return term
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/[^\w\s()-]/g, ''); // Keep alphanumeric, spaces, hyphens, and parentheses
}

/**
 * Converts a bulk import entry term into a backend-compatible key
 */
export function termToKey(term: string): string {
  return normalizeGlossaryKey(term);
}

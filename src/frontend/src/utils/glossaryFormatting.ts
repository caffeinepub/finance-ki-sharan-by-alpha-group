/**
 * Utility for parsing and formatting glossary definition text.
 * Extracts "Also read:" references and normalizes whitespace for consistent display.
 * Provides robust term grouping utilities that handle trimming, empty strings, and non-letter starting characters.
 */

export interface ParsedDefinition {
  mainContent: string;
  alsoReadReferences: string[];
}

/**
 * Parse a glossary definition to extract main content and "Also read:" references.
 * Handles various formats: "Also read:", "Also Read:", etc.
 */
export function parseGlossaryDefinition(definition: string): ParsedDefinition {
  // Normalize line breaks and excessive whitespace
  const normalized = definition
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Look for "Also read:" pattern (case-insensitive)
  const alsoReadPattern = /also read:\s*(.+?)(?:\.|$)/is;
  const match = normalized.match(alsoReadPattern);

  if (!match) {
    return {
      mainContent: normalized,
      alsoReadReferences: [],
    };
  }

  // Extract main content (everything before "Also read:")
  const mainContent = normalized
    .substring(0, match.index)
    .trim();

  // Extract and parse references
  const referencesText = match[1].trim();
  const references = referencesText
    .split(',')
    .map((ref) => ref.trim())
    .filter((ref) => ref.length > 0);

  return {
    mainContent,
    alsoReadReferences: references,
  };
}

/**
 * Normalize a term name for comparison (case-insensitive, trimmed).
 */
export function normalizeTermName(term: string): string {
  return term.trim().toLowerCase();
}

/**
 * Normalize a term for display and sorting (trim whitespace, handle Unicode).
 */
export function normalizeTermForDisplay(term: string): string {
  // Trim whitespace and normalize Unicode
  return term.trim().normalize('NFC');
}

/**
 * Get the group key (letter) for a term based on its first alphanumeric character.
 * Returns uppercase letter A-Z, or "#" for terms starting with non-alphanumeric characters.
 * Hardened to handle Unicode, hidden characters, and edge cases.
 */
export function getTermGroupKey(term: string): string {
  // First normalize and trim the term
  const normalized = normalizeTermForDisplay(term);
  
  // Handle empty strings
  if (!normalized || normalized.length === 0) {
    return '#';
  }
  
  // Find first letter character (Unicode-aware)
  // Use regex to find first letter in any script
  const letterMatch = normalized.match(/\p{L}/u);
  
  if (letterMatch) {
    const firstLetter = letterMatch[0].toUpperCase();
    
    // Check if it's A-Z (English alphabet)
    if (/^[A-Z]$/.test(firstLetter)) {
      return firstLetter;
    }
    
    // For non-English letters, return '#'
    return '#';
  }
  
  // No letter found, return '#'
  return '#';
}

/**
 * Find a term by reference string (case-insensitive match).
 * Returns the matched term's display name or null if not found.
 */
export function findTermByReference(
  reference: string,
  allTerms: Array<[string, { term: string }]>
): string | null {
  const normalizedRef = normalizeTermName(reference);
  
  for (const [, termData] of allTerms) {
    if (normalizeTermName(termData.term) === normalizedRef) {
      return termData.term;
    }
  }
  
  return null;
}

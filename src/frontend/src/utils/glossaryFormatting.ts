/**
 * Utility for parsing and formatting glossary definition text.
 * Extracts "Also read:" references and normalizes whitespace for consistent display.
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
 * Check if a reference term exists in the glossary dataset.
 */
export function findTermByReference(
  reference: string,
  allTerms: Array<[string, { term: string }]>
): string | null {
  const normalizedRef = normalizeTermName(reference);
  
  for (const [key, term] of allTerms) {
    if (normalizeTermName(term.term) === normalizedRef) {
      return term.term;
    }
  }
  
  return null;
}

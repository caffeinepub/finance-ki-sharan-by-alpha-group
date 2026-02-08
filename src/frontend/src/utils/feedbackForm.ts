// Shared Google Form URL for feedback collection
export const GOOGLE_FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScqZU_oBmXqsYR-sS69AifMXRb10D6kLxFhBOXzELqk0aOb5w/viewform?usp=publish-editor';

/**
 * Opens the feedback form in a new tab with proper security attributes
 */
export function openFeedbackForm(): void {
  window.open(GOOGLE_FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
}

/**
 * Returns the Google Form embed URL for iframe usage
 */
export function getFeedbackFormEmbedUrl(): string {
  // Convert the viewform URL to the embedded format
  return GOOGLE_FEEDBACK_FORM_URL.replace('/viewform', '/viewform?embedded=true');
}

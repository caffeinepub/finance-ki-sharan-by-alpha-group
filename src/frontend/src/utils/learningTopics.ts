/**
 * Learning topics mapping for URL state and UI highlighting.
 * Maps topic slugs to display labels.
 */

export interface LearningTopic {
  slug: string;
  label: string;
}

export const LEARNING_TOPICS: LearningTopic[] = [
  { slug: 'personal-finance', label: 'Personal Finance' },
  { slug: 'stock-market', label: 'Stock Market' },
  { slug: 'mutual-funds', label: 'Mutual Funds' },
  { slug: 'etfs', label: 'ETFs' },
  { slug: 'bonds', label: 'Bonds' },
  { slug: 'insurance', label: 'Insurance' },
  { slug: 'economic-environment', label: 'Economic Environment' },
];

export function getTopicBySlug(slug: string): LearningTopic | undefined {
  return LEARNING_TOPICS.find(t => t.slug === slug);
}

export function matchSectionToTopic(sectionTitle: string): LearningTopic | undefined {
  const normalized = sectionTitle.toLowerCase().trim();
  
  return LEARNING_TOPICS.find(topic => {
    const topicLabel = topic.label.toLowerCase();
    return normalized.includes(topicLabel) || topicLabel.includes(normalized);
  });
}

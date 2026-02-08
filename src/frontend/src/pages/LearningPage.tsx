import { useEffect, useMemo } from 'react';
import { BookOpen, Loader2, Info } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetLearningSections } from '../hooks/useQueries';
import { getTopicBySlug, matchSectionToTopic, LEARNING_TOPICS } from '../utils/learningTopics';

export default function LearningPage() {
  const { data: sections = [], isLoading } = useGetLearningSections();
  const search = useSearch({ strict: false }) as { topic?: string };
  const selectedTopicSlug = search.topic;

  const selectedTopic = useMemo(() => {
    if (!selectedTopicSlug) return null;
    return getTopicBySlug(selectedTopicSlug);
  }, [selectedTopicSlug]);

  // Find matching section based on selected topic
  const matchedSectionIndex = useMemo(() => {
    if (!selectedTopic || sections.length === 0) return null;
    
    const index = sections.findIndex(([, section]) => {
      const match = matchSectionToTopic(section.title);
      return match?.slug === selectedTopic.slug;
    });
    
    return index >= 0 ? index : null;
  }, [selectedTopic, sections]);

  // Auto-scroll to matched section when topic is selected
  useEffect(() => {
    if (matchedSectionIndex !== null && !isLoading) {
      setTimeout(() => {
        const element = document.getElementById(`section-${matchedSectionIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [matchedSectionIndex, isLoading]);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <BookOpen className="h-4 w-4" />
              Financial Education
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Learn Finance Step by Step
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master financial concepts through our structured learning path, from basics to advanced topics.
            </p>
          </div>

          {/* Topic Selection Indicator */}
          {selectedTopic && (
            <div className="max-w-4xl mx-auto mb-8">
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Selected Topic</AlertTitle>
                <AlertDescription>
                  {matchedSectionIndex !== null ? (
                    <>Showing content for <strong>{selectedTopic.label}</strong>. Scroll down to view the section.</>
                  ) : (
                    <>You selected <strong>{selectedTopic.label}</strong>, but we don't have a matching section yet. Browse all available topics below.</>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Available Topics */}
          {!isLoading && sections.length > 0 && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {LEARNING_TOPICS.map((topic) => {
                  const hasMatch = sections.some(([, section]) => {
                    const match = matchSectionToTopic(section.title);
                    return match?.slug === topic.slug;
                  });
                  
                  return (
                    <Badge
                      key={topic.slug}
                      variant={selectedTopicSlug === topic.slug ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        hasMatch ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      {topic.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && sections.length === 0 && (
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Learning Content Coming Soon</CardTitle>
                <CardDescription>
                  We're preparing comprehensive learning materials for you. Check back soon!
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!isLoading && sections.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <Accordion 
                type="single" 
                collapsible 
                className="space-y-4"
                defaultValue={matchedSectionIndex !== null ? `section-${matchedSectionIndex}` : undefined}
              >
                {sections.map(([key, section], index) => {
                  const isHighlighted = index === matchedSectionIndex;
                  
                  return (
                    <AccordionItem 
                      key={key} 
                      value={`section-${index}`} 
                      id={`section-${index}`}
                      className={`border rounded-lg px-6 bg-card transition-all ${
                        isHighlighted ? 'border-primary/50 shadow-lg' : 'border-border/50'
                      }`}
                    >
                      <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                        {section.title}
                        {isHighlighted && (
                          <Badge variant="default" className="ml-2">Selected</Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {section.content.split('\n').map((paragraph, i) => (
                            paragraph.trim() && <p key={i} className="mb-4">{paragraph}</p>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useGetLearningSections } from '../hooks/useQueries';

export default function LearningPage() {
  const { data: sections = [], isLoading } = useGetLearningSections();

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
              <Accordion type="single" collapsible className="space-y-4">
                {sections.map(([key, section], index) => (
                  <AccordionItem key={key} value={`section-${index}`} className="border border-border/50 rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {section.content.split('\n').map((paragraph, i) => (
                          paragraph.trim() && <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

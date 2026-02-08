import { Download, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetResearchPapers } from '../hooks/useQueries';

export default function ResearchPapersPage() {
  const { data: papers = [], isLoading } = useGetResearchPapers();

  const handleDownload = (paper: typeof papers[0]) => {
    const url = paper.file.getDirectURL();
    window.open(url, '_blank');
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <FileText className="h-4 w-4" />
              Research & Analysis
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Research Papers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access in-depth research reports and studies from RBI, SEBI, and economic analysts.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && papers.length === 0 && (
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Research Papers Coming Soon</CardTitle>
                <CardDescription>
                  We're curating high-quality research papers for you. Check back soon!
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!isLoading && papers.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {papers.map((paper) => (
                <Card key={Number(paper.id)} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="line-clamp-2">{paper.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-3">
                      {paper.description}
                    </CardDescription>
                    <Button 
                      onClick={() => handleDownload(paper)} 
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

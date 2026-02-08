import { useState, useMemo } from 'react';
import { Search, Loader2, BookOpen, ExternalLink, AlertTriangle, Database, Info, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchTerms, useGetAllTerms, useIsCallerAdmin, useGetGlossaryDiagnosticsByPrefix } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { parseGlossaryDefinition, findTermByReference, getTermGroupKey, normalizeTermForDisplay } from '../utils/glossaryFormatting';
import GlossaryBackupRestorePanel from '../components/GlossaryBackupRestorePanel';
import GlossaryBulkImportCTermsPanel from '../components/GlossaryBulkImportCTermsPanel';

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Normalize search query for consistent behavior
  const normalizedQuery = searchQuery.trim();
  
  const { 
    data: terms = [], 
    isLoading, 
    isError, 
    error,
    isActorAvailable,
    isQueryEnabled,
    isFetched
  } = useSearchTerms(searchQuery);
  
  const { data: allTerms = [] } = useGetAllTerms();
  const { data: isAdmin = false } = useIsCallerAdmin();

  // Admin diagnostics: fetch counts for A, B, C from backend
  const { data: diagnosticA = [] } = useGetGlossaryDiagnosticsByPrefix('a');
  const { data: diagnosticB = [] } = useGetGlossaryDiagnosticsByPrefix('b');
  const { data: diagnosticC = [] } = useGetGlossaryDiagnosticsByPrefix('c');

  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof terms> = {};
    
    terms.forEach(([key, term]) => {
      const groupKey = getTermGroupKey(term.term);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push([key, term]);
    });

    // Sort terms within each group alphabetically
    Object.keys(groups).forEach(groupKey => {
      groups[groupKey].sort(([, a], [, b]) => {
        const termA = normalizeTermForDisplay(a.term).toLowerCase();
        const termB = normalizeTermForDisplay(b.term).toLowerCase();
        return termA.localeCompare(termB);
      });
    });

    // Sort groups: A-Z first, then # at the end
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });
  }, [terms]);

  // Admin diagnostic: count rendered terms per letter
  const renderedCounts = useMemo(() => {
    if (!isAdmin) return null;
    
    const counts: Record<string, number> = {};
    terms.forEach(([, term]) => {
      const groupKey = getTermGroupKey(term.term);
      counts[groupKey] = (counts[groupKey] || 0) + 1;
    });
    
    return counts;
  }, [terms, isAdmin]);

  // Admin diagnostic: compare backend vs rendered for A, B, C
  const diagnosticSummary = useMemo(() => {
    if (!isAdmin || !renderedCounts) return null;

    const backendA = diagnosticA.length;
    const backendB = diagnosticB.length;
    const backendC = diagnosticC.length;

    const renderedA = renderedCounts['A'] || 0;
    const renderedB = renderedCounts['B'] || 0;
    const renderedC = renderedCounts['C'] || 0;

    return {
      A: { backend: backendA, rendered: renderedA, mismatch: backendA !== renderedA },
      B: { backend: backendB, rendered: renderedB, mismatch: backendB !== renderedB },
      C: { backend: backendC, rendered: renderedC, mismatch: backendC !== renderedC },
    };
  }, [isAdmin, renderedCounts, diagnosticA, diagnosticB, diagnosticC]);

  const handleReferenceClick = (reference: string) => {
    const matchedTerm = findTermByReference(reference, allTerms);
    if (matchedTerm) {
      setSearchQuery(matchedTerm);
      // Scroll to top to show search results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check if glossary is truly empty - only after successful fetch with actor ready and no search query
  const isGlossaryEmpty = isActorAvailable && isQueryEnabled && isFetched && !isError && !normalizedQuery && terms.length === 0;
  
  // Show loading/connecting state when actor is not available or query is not enabled
  const isInitializing = !isActorAvailable || !isQueryEnabled;

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <BookOpen className="h-4 w-4" />
              Financial Terminology
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Finance Glossary
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search and explore financial terms with definitions, examples, and practical usage.
            </p>
          </div>

          {/* Admin Panels */}
          {isAdmin && (
            <div className="max-w-2xl mx-auto mb-8 space-y-4">
              <GlossaryBackupRestorePanel />
              <GlossaryBulkImportCTermsPanel />
              
              {/* Admin Diagnostic Panel */}
              {diagnosticSummary && (
                <Alert className="bg-muted/50 border-primary/30">
                  <Activity className="h-4 w-4 text-primary" />
                  <AlertTitle className="font-semibold">Admin Diagnostics (A/B/C Terms)</AlertTitle>
                  <AlertDescription className="space-y-2 mt-2">
                    <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <div className="font-semibold text-foreground mb-1">Letter A</div>
                        <div>Backend: {diagnosticSummary.A.backend}</div>
                        <div>Rendered: {diagnosticSummary.A.rendered}</div>
                        {diagnosticSummary.A.mismatch && (
                          <Badge variant="destructive" className="mt-1 text-xs">Mismatch</Badge>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground mb-1">Letter B</div>
                        <div>Backend: {diagnosticSummary.B.backend}</div>
                        <div>Rendered: {diagnosticSummary.B.rendered}</div>
                        {diagnosticSummary.B.mismatch && (
                          <Badge variant="destructive" className="mt-1 text-xs">Mismatch</Badge>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground mb-1">Letter C</div>
                        <div>Backend: {diagnosticSummary.C.backend}</div>
                        <div>Rendered: {diagnosticSummary.C.rendered}</div>
                        {diagnosticSummary.C.mismatch && (
                          <Badge variant="destructive" className="mt-1 text-xs">Mismatch</Badge>
                        )}
                      </div>
                    </div>
                    {(diagnosticSummary.A.mismatch || diagnosticSummary.B.mismatch || diagnosticSummary.C.mismatch) && (
                      <div className="text-xs text-destructive mt-2">
                        ⚠️ Mismatch detected: Backend has terms that are not rendered in UI. Check grouping logic.
                      </div>
                    )}
                    {diagnosticSummary.C.backend === 0 && (
                      <div className="text-xs text-warning mt-2">
                        ℹ️ No C-terms found in backend. Use the bulk import panel above to publish C-terms.
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Connection/Initialization State */}
          {isInitializing && (
            <Alert className="mb-8 max-w-2xl mx-auto">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Connecting to Backend</AlertTitle>
              <AlertDescription>
                Initializing connection to the glossary service...
              </AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {isError && !isInitializing && (
            <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Glossary</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to load glossary terms. Please try refreshing the page.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State Message - only after successful fetch with actor ready */}
          {isGlossaryEmpty && (
            <Alert className="mb-8 max-w-2xl mx-auto">
              <Database className="h-4 w-4" />
              <AlertTitle>Glossary is Empty</AlertTitle>
              <AlertDescription>
                The glossary currently contains no terms. {!isAdmin && 'Please contact an administrator to restore the glossary from a backup.'}
              </AlertDescription>
            </Alert>
          )}

          <div className="mx-auto max-w-2xl mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for financial terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
                disabled={isInitializing}
              />
            </div>
            {normalizedQuery && !isLoading && !isError && isFetched && (
              <p className="mt-3 text-sm text-muted-foreground text-center">
                Found {terms.length} {terms.length === 1 ? 'term' : 'terms'} matching "{normalizedQuery}"
              </p>
            )}
          </div>

          {isLoading && !isInitializing && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && !isError && !isInitializing && isFetched && terms.length === 0 && normalizedQuery && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No terms found matching "{normalizedQuery}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!isLoading && !isError && !isInitializing && isFetched && terms.length > 0 && (
            <div className="space-y-12">
              {groupedTerms.map(([letter, letterTerms]) => (
                <div key={letter} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg font-bold px-4 py-2 bg-primary/10 border-primary/30">
                      {letter}
                    </Badge>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {letterTerms.map(([key, term]) => {
                      const parsed = parseGlossaryDefinition(term.definition);
                      
                      return (
                        <Card 
                          key={key}
                          className="transition-all hover:shadow-lg hover:border-primary/30"
                        >
                          <CardHeader className="pb-3">
                            <CardTitle className="text-xl">{normalizeTermForDisplay(term.term)}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Definition</p>
                              <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                                {parsed.mainContent}
                              </CardDescription>
                            </div>

                            {parsed.alsoReadReferences.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-2">Also read:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {parsed.alsoReadReferences.map((reference, idx) => {
                                      const matchedTerm = findTermByReference(reference, allTerms);
                                      const isClickable = !!matchedTerm;
                                      
                                      return isClickable ? (
                                        <button
                                          key={idx}
                                          onClick={() => handleReferenceClick(reference)}
                                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 hover:border-primary/40"
                                        >
                                          {reference}
                                          <ExternalLink className="h-3 w-3" />
                                        </button>
                                      ) : (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border"
                                        >
                                          {reference}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            )}

                            {term.example && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Example</p>
                                  <CardDescription className="text-sm leading-relaxed whitespace-pre-line">
                                    {term.example}
                                  </CardDescription>
                                </div>
                              </>
                            )}
                            {term.usage && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Practical Usage</p>
                                  <CardDescription className="text-sm leading-relaxed whitespace-pre-line">
                                    {term.usage}
                                  </CardDescription>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

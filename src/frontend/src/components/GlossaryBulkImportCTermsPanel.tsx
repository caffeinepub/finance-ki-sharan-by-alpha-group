import { useState } from 'react';
import { Upload, Loader2, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { usePublishCTermsBatch } from '../hooks/useQueries';
import { cTermsBatch } from '../data/glossaryBulkImportC';

export default function GlossaryBulkImportCTermsPanel() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const publishMutation = usePublishCTermsBatch();

  const handlePublish = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmPublish = async () => {
    setShowConfirmDialog(false);
    await publishMutation.mutateAsync();
  };

  const termCount = cTermsBatch.length;
  const firstTerm = cTermsBatch[0]?.term || '';
  const lastTerm = cTermsBatch[cTermsBatch.length - 1]?.term || '';

  return (
    <>
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent" />
            Bulk Import: C-Terms Batch
          </CardTitle>
          <CardDescription>
            Publish a batch of {termCount} glossary terms (from "{firstTerm}" to "{lastTerm}")
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Import Scope</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Total terms:</strong> {termCount}</p>
                <p><strong>Range:</strong> {firstTerm} through {lastTerm}</p>
                <p className="mt-2">
                  This will add or update these terms in the glossary. Existing terms with the same name will be updated with the new definitions.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {publishMutation.isSuccess && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success</AlertTitle>
              <AlertDescription className="text-green-600">
                Successfully published {termCount} glossary terms. The glossary has been updated and is now searchable.
              </AlertDescription>
            </Alert>
          )}

          {publishMutation.isError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {publishMutation.error instanceof Error 
                  ? publishMutation.error.message 
                  : 'Failed to publish glossary batch. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handlePublish}
            disabled={publishMutation.isPending}
            className="w-full"
            size="lg"
          >
            {publishMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing {termCount} Terms...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Publish C-Terms Batch ({termCount} terms)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Import</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to publish {termCount} glossary terms to the backend.
              <br /><br />
              <strong>Terms range:</strong> {firstTerm} through {lastTerm}
              <br /><br />
              This will add new terms and update any existing terms with matching names. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPublish}>
              Yes, Publish Terms
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

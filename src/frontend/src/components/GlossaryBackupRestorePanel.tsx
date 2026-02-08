import { useState, useRef } from 'react';
import { Download, Upload, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useExportGlossarySnapshot, useRestoreGlossaryFromSnapshot, useReplaceGlossaryWithSnapshot, useGetGlossaryStats } from '../hooks/useQueries';
import type { GlossarySnapshot } from '../backend';

export default function GlossaryBackupRestorePanel() {
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedSnapshot, setParsedSnapshot] = useState<GlossarySnapshot | null>(null);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: stats } = useGetGlossaryStats();
  const exportMutation = useExportGlossarySnapshot();
  const restoreMergeMutation = useRestoreGlossaryFromSnapshot();
  const restoreReplaceMutation = useReplaceGlossaryWithSnapshot();

  const handleExport = async () => {
    try {
      const snapshot = await exportMutation.mutateAsync();
      
      // Convert snapshot to JSON and download
      const jsonString = JSON.stringify(snapshot, (key, value) => {
        // Convert BigInt to string for JSON serialization
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      }, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `glossary-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Parse and validate the file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content, (key, value) => {
          // Convert string back to BigInt for specific fields
          if (key === 'createdAt' || key === 'termCount' || key === 'version') {
            return BigInt(value);
          }
          return value;
        });
        
        // Basic validation
        if (!parsed.terms || !Array.isArray(parsed.terms)) {
          throw new Error('Invalid snapshot format: missing terms array');
        }
        
        setParsedSnapshot(parsed as GlossarySnapshot);
      } catch (error) {
        console.error('Failed to parse snapshot:', error);
        setParsedSnapshot(null);
        setSelectedFile(null);
        alert('Invalid backup file format. Please select a valid glossary backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!parsedSnapshot) return;

    if (restoreMode === 'replace') {
      setShowReplaceConfirm(true);
    } else {
      await restoreMergeMutation.mutateAsync(parsedSnapshot);
      resetFileSelection();
    }
  };

  const handleConfirmReplace = async () => {
    if (!parsedSnapshot) return;
    
    setShowReplaceConfirm(false);
    await restoreReplaceMutation.mutateAsync(parsedSnapshot);
    resetFileSelection();
  };

  const resetFileSelection = () => {
    setSelectedFile(null);
    setParsedSnapshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isRestoring = restoreMergeMutation.isPending || restoreReplaceMutation.isPending;

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Admin: Glossary Backup & Restore
          </CardTitle>
          <CardDescription>
            Export glossary data to a backup file or restore from a previous backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Display */}
          {stats && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Current Glossary Stats</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Total terms: {Number(stats.currentTermCount)}</p>
                  {stats.lastBackupTimestamp && (
                    <p>Last backup: {new Date(Number(stats.lastBackupTimestamp) / 1000000).toLocaleString()}</p>
                  )}
                  {stats.lastRestoreTimestamp && (
                    <p>Last restore: {new Date(Number(stats.lastRestoreTimestamp) / 1000000).toLocaleString()}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Export Backup</h3>
            <Button
              onClick={handleExport}
              disabled={exportMutation.isPending}
              className="w-full"
            >
              {exportMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Glossary Backup
                </>
              )}
            </Button>
          </div>

          {/* Restore Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Restore from Backup</h3>
            
            <div className="space-y-2">
              <Label htmlFor="backup-file">Select Backup File</Label>
              <Input
                id="backup-file"
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={isRestoring}
              />
              {selectedFile && parsedSnapshot && (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedFile.name} ({Number(parsedSnapshot.termCount)} terms)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restore-mode">Restore Mode</Label>
              <Select
                value={restoreMode}
                onValueChange={(value) => setRestoreMode(value as 'merge' | 'replace')}
                disabled={isRestoring}
              >
                <SelectTrigger id="restore-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merge">Merge (Add/Update terms)</SelectItem>
                  <SelectItem value="replace">Replace (Clear existing first)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {restoreMode === 'merge' 
                  ? 'Merge mode will add new terms and update existing ones without deleting any current terms.'
                  : 'Replace mode will delete all existing terms before restoring from the backup.'}
              </p>
            </div>

            {restoreMode === 'replace' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Replace mode will permanently delete all current glossary terms before restoring the backup.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleRestore}
              disabled={!parsedSnapshot || isRestoring}
              variant={restoreMode === 'replace' ? 'destructive' : 'default'}
              className="w-full"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Restore Glossary ({restoreMode})
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Replace Confirmation Dialog */}
      <AlertDialog open={showReplaceConfirm} onOpenChange={setShowReplaceConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Replace Operation</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {stats ? Number(stats.currentTermCount) : 'current'} glossary terms and replace them with {parsedSnapshot ? Number(parsedSnapshot.termCount) : 'the backup'} terms from the backup file.
              <br /><br />
              This action cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplace} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, Replace All Terms
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

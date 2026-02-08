import { useState, useMemo } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAllFeedback, useGetSystemInfoStorageUsage } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ArrowUpDown, ShieldAlert, LogIn, Database, HardDrive, AlertCircle } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export default function FeedbackAdminPage() {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: feedbackData, isLoading: isFeedbackLoading, error } = useGetAllFeedback();
  const { data: storageUsage, isLoading: isStorageLoading, error: storageError } = useGetSystemInfoStorageUsage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'none'>('none');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Filter and sort feedback
  const processedFeedback = useMemo(() => {
    if (!feedbackData) return [];
    
    let filtered = feedbackData;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ([_, fb]) =>
          fb.name.toLowerCase().includes(query) ||
          fb.email.toLowerCase().includes(query) ||
          fb.message.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortBy !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        const [_, fbA] = a;
        const [__, fbB] = b;
        if (sortBy === 'name') {
          return fbA.name.localeCompare(fbB.name);
        } else if (sortBy === 'email') {
          return fbA.email.localeCompare(fbB.email);
        }
        return 0;
      });
    }
    
    return filtered;
  }, [feedbackData, searchQuery, sortBy]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  // Show loading state while initializing
  if (isInitializing || isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-primary" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              You must be logged in to access the feedback admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page. Only administrators can view feedback submissions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Error Loading Feedback</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load feedback data. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* System Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            System Info
          </CardTitle>
          <CardDescription>
            Approximate storage usage across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isStorageLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : storageError ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Storage Info Unavailable</AlertTitle>
              <AlertDescription>
                {storageError instanceof Error && storageError.message.includes('not yet implemented')
                  ? 'The storage usage feature is not yet available. The backend method will be implemented soon.'
                  : storageError instanceof Error 
                    ? storageError.message 
                    : 'Failed to load storage usage data.'}
              </AlertDescription>
            </Alert>
          ) : storageUsage ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <HardDrive className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Storage</p>
                    <p className="text-2xl font-bold">{formatBytes(Number(storageUsage.approximateTotalBytes))}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Database className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Glossary</p>
                    <p className="text-2xl font-bold">{formatBytes(Number(storageUsage.glossaryBytes))}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Database className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Articles</p>
                    <p className="text-2xl font-bold">{formatBytes(Number(storageUsage.articlesBytes))}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Database className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Blogs</p>
                    <p className="text-2xl font-bold">{formatBytes(Number(storageUsage.blogsBytes))}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Database className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Feedback</p>
                    <p className="text-2xl font-bold">{formatBytes(Number(storageUsage.feedbackBytes))}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Database className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Research Papers</p>
                    <p className="text-2xl font-bold">{formatBytes(Number(storageUsage.researchPapersBytes))}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Storage values are approximate estimates and may not reflect exact canister memory usage.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Feedback Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Management</CardTitle>
          <CardDescription>
            View and manage all feedback submissions from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Controls */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'email' | 'none')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No sorting</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="email">Sort by Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feedback Table */}
          {isFeedbackLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : processedFeedback.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No feedback found matching your search.' : 'No feedback submissions yet.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[250px]">Email</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedFeedback.map(([id, feedback]) => (
                    <TableRow key={id.toString()}>
                      <TableCell className="font-medium">{feedback.name}</TableCell>
                      <TableCell>{feedback.email}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-3 text-sm">{feedback.message}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Results Count */}
          {!isFeedbackLoading && processedFeedback.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {processedFeedback.length} {processedFeedback.length === 1 ? 'entry' : 'entries'}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
